import { useMemo } from 'react';

interface DotPlotProps {
  datasets: { name: string; values: number[]; color: string }[];
  min?: number;
  max?: number;
}

const W = 520;
const MARGIN = { left: 80, right: 30 };
const DOT_R = 7;
const ROW_H = 100;
const AXIS_Y = 60;

function xScale(v: number, min: number, max: number): number {
  return MARGIN.left + ((v - min) / (max - min)) * (W - MARGIN.left - MARGIN.right);
}

function stackDots(vals: number[], min: number, max: number) {
  const map: Record<number, number> = {};
  return vals.map(v => {
    const px = Math.round(xScale(v, min, max));
    map[px] = (map[px] ?? 0) + 1;
    return { v, px, level: map[px] - 1 };
  });
}

function avg(vals: number[]) { return vals.reduce((s, x) => s + x, 0) / vals.length; }

export default function DotPlot({ datasets, min: propMin, max: propMax }: DotPlotProps) {
  const all = datasets.flatMap(d => d.values);
  const min = propMin ?? Math.min(...all) - 2;
  const max = propMax ?? Math.max(...all) + 2;

  const rows = useMemo(() => datasets.map(d => ({
    ...d,
    dots: stackDots(d.values, min, max),
    meanX: xScale(avg(d.values), min, max),
    meanVal: avg(d.values),
  })), [datasets, min, max]);

  // Axis ticks
  const tickStep = Math.max(5, Math.round((max - min) / 8));
  const ticks: number[] = [];
  for (let v = Math.ceil(min / tickStep) * tickStep; v <= max; v += tickStep) ticks.push(v);

  const totalH = datasets.length * ROW_H + 24;

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${totalH}`} width="100%" className="select-none">
        {rows.map((row, ri) => {
          const offsetY = ri * ROW_H;
          return (
            <g key={row.name} transform={`translate(0, ${offsetY})`}>
              {/* Label */}
              <text x={4} y={AXIS_Y - 4} fontSize={12} fontWeight="700" fill={row.color} fontFamily="Inter,sans-serif">
                {row.name}
              </text>

              {/* Axis */}
              <line x1={MARGIN.left} y1={AXIS_Y} x2={W - MARGIN.right} y2={AXIS_Y} stroke="#cbd5e1" strokeWidth={2} />

              {/* Ticks */}
              {ticks.map(v => (
                <g key={v}>
                  <line x1={xScale(v, min, max)} y1={AXIS_Y} x2={xScale(v, min, max)} y2={AXIS_Y + 5} stroke="#94a3b8" />
                  <text x={xScale(v, min, max)} y={AXIS_Y + 16} textAnchor="middle" fontSize={9} fill="#94a3b8" fontFamily="Inter,sans-serif">{v}</text>
                </g>
              ))}

              {/* Dots */}
              {row.dots.map(({ v, px, level }) => (
                <g key={`${v}-${level}`}>
                  <circle
                    cx={px} cy={AXIS_Y - DOT_R * 2 * level - DOT_R - 4}
                    r={DOT_R} fill={row.color} fillOpacity={0.8} stroke="white" strokeWidth={1.5}
                  />
                  <title>{v}</title>
                </g>
              ))}

              {/* Mean marker */}
              <line x1={row.meanX} y1={AXIS_Y - 55} x2={row.meanX} y2={AXIS_Y} stroke="#6366f1" strokeWidth={2} strokeDasharray="4 2" />
              <text x={row.meanX} y={AXIS_Y - 58} textAnchor="middle" fontSize={9} fontWeight="bold" fill="#6366f1" fontFamily="Inter,sans-serif">
                Mean={row.meanVal.toFixed(1)}
              </text>
            </g>
          );
        })}

        {/* X-axis shared label */}
        <text x={W / 2} y={totalH - 4} textAnchor="middle" fontSize={10} fill="#94a3b8" fontFamily="Inter,sans-serif">
          Value
        </text>
      </svg>
    </div>
  );
}
