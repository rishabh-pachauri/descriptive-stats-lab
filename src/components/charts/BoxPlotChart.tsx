import { useMemo } from 'react';
import { fiveNumberSummary } from '../../utils/stats';

interface BoxDataset {
  name: string;
  values: number[];
  color: string;
}

interface BoxPlotChartProps {
  datasets: BoxDataset[];
  showOutliers?: boolean;
}

const SVG_W = 560;
const MARGIN = { left: 80, right: 40, top: 20, bottom: 30 };
const ROW_H = 80;

function xScale(v: number, min: number, max: number): number {
  const w = SVG_W - MARGIN.left - MARGIN.right;
  return MARGIN.left + ((v - min) / (max - min)) * w;
}

export default function BoxPlotChart({ datasets, showOutliers = true }: BoxPlotChartProps) {
  const allValues = datasets.flatMap(d => d.values);
  const globalMin = Math.min(...allValues);
  const globalMax = Math.max(...allValues);
  const pad = (globalMax - globalMin) * 0.12;
  const min = globalMin - pad;
  const max = globalMax + pad;

  const summaries = useMemo(() => datasets.map(d => ({
    ...d,
    fns: fiveNumberSummary(d.values),
  })), [datasets]);

  const totalH = datasets.length * ROW_H + MARGIN.top + MARGIN.bottom;

  // Axis ticks
  const tickCount = 6;
  const ticks = Array.from({ length: tickCount + 1 }, (_, i) => {
    const v = min + (i / tickCount) * (max - min);
    return { v, x: xScale(v, min, max) };
  });

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${SVG_W} ${totalH}`} width="100%" className="select-none">
        {/* X axis */}
        <g transform={`translate(0,${totalH - MARGIN.bottom})`}>
          <line x1={MARGIN.left} y1={0} x2={SVG_W - MARGIN.right} y2={0} stroke="#cbd5e1" strokeWidth={1} />
          {ticks.map(t => (
            <g key={t.v}>
              <line x1={t.x} y1={0} x2={t.x} y2={5} stroke="#94a3b8" strokeWidth={1} />
              <text x={t.x} y={18} textAnchor="middle" fontSize={9} fill="#94a3b8" fontFamily="Inter, sans-serif">
                {Math.round(t.v * 10) / 10}
              </text>
            </g>
          ))}
        </g>

        {/* Grid lines */}
        {ticks.map(t => (
          <line key={`grid-${t.v}`} x1={t.x} y1={MARGIN.top} x2={t.x} y2={totalH - MARGIN.bottom}
            stroke="#f1f5f9" strokeWidth={1} />
        ))}

        {/* Box plots */}
        {summaries.map((row, ri) => {
          const cy = MARGIN.top + ri * ROW_H + ROW_H / 2;
          const { min: dmin, max: dmax, q1, q3, median: med, lowerFence, upperFence, outlierPoints } = row.fns;

          // Whisker endpoints clamped to fences (not min/max if outlier)
          const whiskerLow  = xScale(Math.max(dmin, lowerFence), min, max);
          const whiskerHigh = xScale(Math.min(dmax, upperFence), min, max);
          const xQ1 = xScale(q1, min, max);
          const xQ3 = xScale(q3, min, max);
          const xMed = xScale(med, min, max);
          const boxH = 26;

          return (
            <g key={row.name}>
              {/* Row label */}
              <text x={MARGIN.left - 8} y={cy + 4} textAnchor="end" fontSize={11} fontWeight="700" fill={row.color} fontFamily="Inter, sans-serif">
                {row.name}
              </text>

              {/* Whisker lines */}
              <line x1={whiskerLow} y1={cy} x2={xQ1} y2={cy} stroke={row.color} strokeWidth={2} />
              <line x1={xQ3} y1={cy} x2={whiskerHigh} y2={cy} stroke={row.color} strokeWidth={2} />
              {/* Whisker caps */}
              <line x1={whiskerLow} y1={cy - 8} x2={whiskerLow} y2={cy + 8} stroke={row.color} strokeWidth={2} />
              <line x1={whiskerHigh} y1={cy - 8} x2={whiskerHigh} y2={cy + 8} stroke={row.color} strokeWidth={2} />

              {/* Box (IQR) */}
              <rect x={xQ1} y={cy - boxH / 2} width={xQ3 - xQ1} height={boxH}
                fill={row.color} fillOpacity={0.18} stroke={row.color} strokeWidth={2} rx={3} />

              {/* Median line */}
              <line x1={xMed} y1={cy - boxH / 2} x2={xMed} y2={cy + boxH / 2}
                stroke={row.color} strokeWidth={3} />

              {/* Outliers */}
              {showOutliers && outlierPoints.map((ov, oi) => (
                <circle key={oi} cx={xScale(ov, min, max)} cy={cy} r={5}
                  fill="none" stroke={row.color} strokeWidth={2} />
              ))}

              {/* Labels inside box */}
              <text x={xQ1 - 2} y={cy + boxH / 2 + 12} textAnchor="end" fontSize={8} fill="#64748b" fontFamily="Inter, sans-serif">Q1={q1}</text>
              <text x={xMed} y={cy - boxH / 2 - 4} textAnchor="middle" fontSize={8} fill={row.color} fontWeight="bold" fontFamily="Inter, sans-serif">M={med}</text>
              <text x={xQ3 + 2} y={cy + boxH / 2 + 12} textAnchor="start" fontSize={8} fill="#64748b" fontFamily="Inter, sans-serif">Q3={q3}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
