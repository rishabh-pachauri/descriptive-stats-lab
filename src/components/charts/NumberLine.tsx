import { useMemo } from 'react';

interface DatasetLine {
  name: string;
  values: number[];
  color: string;
}

interface NumberLineProps {
  datasets: DatasetLine[];
  showMean?: boolean;
  showMedian?: boolean;
  min?: number;
  max?: number;
  height?: number;
}

const W = 560;
const MARGIN = 40;

function toX(v: number, min: number, max: number): number {
  return MARGIN + ((v - min) / (max - min)) * (W - 2 * MARGIN);
}

/** Stack dots at the same x position to avoid overlap */
function stackDots(values: number[], min: number, max: number) {
  const buckets: Record<string, number> = {};
  return values.map(v => {
    const x = Math.round(toX(v, min, max));
    buckets[x] = (buckets[x] ?? 0) + 1;
    return { v, x, level: buckets[x] - 1 };
  });
}

function mean(vals: number[]) { return vals.reduce((s, x) => s + x, 0) / vals.length; }
function median(vals: number[]) {
  const s = [...vals].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 === 0 ? (s[m - 1] + s[m]) / 2 : s[m];
}

export default function NumberLine({
  datasets,
  showMean = true,
  showMedian = true,
  min: propMin,
  max: propMax,
  height = 160,
}: NumberLineProps) {
  const allValues = datasets.flatMap(d => d.values);
  const min = propMin ?? Math.min(...allValues) - 2;
  const max = propMax ?? Math.max(...allValues) + 2;

  const rows = datasets.map(d => ({
    ...d,
    dots: stackDots(d.values, min, max),
    meanX: toX(mean(d.values), min, max),
    medianX: toX(median(d.values), min, max),
    meanVal: mean(d.values),
    medianVal: median(d.values),
  }));

  const rowH = Math.floor(height / datasets.length);
  const DOT_R = 7;
  const BASELINE_Y = rowH - 30;

  // Axis tick marks
  const tickCount = 8;
  const ticks = useMemo(() => {
    const step = (max - min) / tickCount;
    return Array.from({ length: tickCount + 1 }, (_, i) => {
      const v = min + i * step;
      return { v: Math.round(v * 10) / 10, x: toX(v, min, max) };
    });
  }, [min, max]);

  const totalH = datasets.length * rowH + 20;

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${totalH}`} width="100%" className="select-none">
        {rows.map((row, ri) => {
          const offsetY = ri * rowH;
          return (
            <g key={row.name} transform={`translate(0,${offsetY})`}>
              {/* Row label */}
              <text x={8} y={BASELINE_Y - 4} fontSize={11} fontWeight="700" fill={row.color} fontFamily="Inter, sans-serif">
                {row.name}
              </text>

              {/* Axis line */}
              <line x1={MARGIN} y1={BASELINE_Y} x2={W - MARGIN} y2={BASELINE_Y} stroke="#cbd5e1" strokeWidth={2} />

              {/* Tick marks */}
              {ticks.map(t => (
                <g key={t.v}>
                  <line x1={t.x} y1={BASELINE_Y} x2={t.x} y2={BASELINE_Y + 5} stroke="#94a3b8" strokeWidth={1} />
                  <text x={t.x} y={BASELINE_Y + 16} textAnchor="middle" fontSize={9} fill="#94a3b8" fontFamily="Inter, sans-serif">
                    {t.v}
                  </text>
                </g>
              ))}

              {/* Data points */}
              {row.dots.map(({ v, x, level }) => (
                <g key={`${v}-${level}`}>
                  <circle
                    cx={x} cy={BASELINE_Y - DOT_R * 2 * level - DOT_R - 4}
                    r={DOT_R}
                    fill={row.color} fillOpacity={0.85} stroke="white" strokeWidth={1.5}
                  />
                  <title>{v}</title>
                </g>
              ))}

              {/* Mean marker */}
              {showMean && (
                <g>
                  <line x1={row.meanX} y1={BASELINE_Y - 50} x2={row.meanX} y2={BASELINE_Y} stroke="#6366f1" strokeWidth={2} strokeDasharray="4 2" />
                  <polygon
                    points={`${row.meanX},${BASELINE_Y - 54} ${row.meanX - 5},${BASELINE_Y - 46} ${row.meanX + 5},${BASELINE_Y - 46}`}
                    fill="#6366f1"
                  />
                  <text x={row.meanX} y={BASELINE_Y - 58} textAnchor="middle" fontSize={9} fill="#6366f1" fontWeight="bold" fontFamily="Inter, sans-serif">
                    μ={Math.round(row.meanVal * 10) / 10}
                  </text>
                </g>
              )}

              {/* Median marker */}
              {showMedian && (
                <g>
                  <line x1={row.medianX} y1={BASELINE_Y - 35} x2={row.medianX} y2={BASELINE_Y} stroke="#10b981" strokeWidth={2} strokeDasharray="4 2" />
                  <text x={row.medianX + 4} y={BASELINE_Y - 38} fontSize={9} fill="#10b981" fontWeight="bold" fontFamily="Inter, sans-serif">
                    M={Math.round(row.medianVal * 10) / 10}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
      {/* Legend */}
      {(showMean || showMedian) && (
        <div className="flex items-center gap-4 justify-center mt-2 text-xs text-gray-500">
          {showMean && <span><span className="inline-block w-6 border-t-2 border-dashed border-brand-500 mr-1 align-middle" />Mean (μ)</span>}
          {showMedian && <span><span className="inline-block w-6 border-t-2 border-dashed border-green-500 mr-1 align-middle" />Median (M)</span>}
        </div>
      )}
    </div>
  );
}
