import { useEffect, useRef } from 'react';

interface DeviationChartProps {
  data: number[];
  mean: number;
  color?: string;
  animate?: boolean;
  showSquared?: boolean;
}

const W = 560;
const MARGIN = 40;
const BASE_Y = 130;
const DOT_R = 6;
const COLORS = { dot: '#6366f1', mean: '#ef4444', line: '#f59e0b', sq: 'rgba(245,158,11,0.15)' };

function toX(v: number, min: number, max: number) {
  return MARGIN + ((v - min) / (max - min)) * (W - 2 * MARGIN);
}

export default function DeviationChart({
  data,
  mean: meanVal,
  color = COLORS.dot,
  animate = true,
  showSquared = false,
}: DeviationChartProps) {
  const linesRef = useRef<SVGGElement>(null);

  const allVals = [...data, meanVal];
  const minV = Math.min(...allVals) - 3;
  const maxV = Math.max(...allVals) + 3;

  const points = data.map(v => ({
    v,
    x: toX(v, minV, maxV),
    dev: v - meanVal,
  }));
  const meanX = toX(meanVal, minV, maxV);

  // Animate lines
  useEffect(() => {
    if (!animate || !linesRef.current) return;
    const lines = linesRef.current.querySelectorAll<SVGLineElement>('.dev-line');
    lines.forEach((line, i) => {
      line.style.strokeDashoffset = '200';
      line.style.transition = 'none';
      setTimeout(() => {
        line.style.transition = `stroke-dashoffset 0.4s ease ${i * 0.1}s`;
        line.style.strokeDashoffset = '0';
      }, 50);
    });
  }, [animate, data, meanVal]);

  const tickVals: number[] = [];
  const step = Math.max(1, Math.round((maxV - minV) / 8));
  for (let v = Math.ceil(minV); v <= maxV; v += step) tickVals.push(v);

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${W} 210`} width="100%" className="select-none">
        {/* Axis */}
        <line x1={MARGIN} y1={BASE_Y} x2={W - MARGIN} y2={BASE_Y} stroke="#cbd5e1" strokeWidth={2} />
        {tickVals.map(v => (
          <g key={v}>
            <line x1={toX(v, minV, maxV)} y1={BASE_Y} x2={toX(v, minV, maxV)} y2={BASE_Y + 5} stroke="#94a3b8" />
            <text x={toX(v, minV, maxV)} y={BASE_Y + 16} textAnchor="middle" fontSize={9} fill="#94a3b8" fontFamily="Inter,sans-serif">{v}</text>
          </g>
        ))}

        {/* Mean line */}
        <line x1={meanX} y1={BASE_Y - 80} x2={meanX} y2={BASE_Y + 5} stroke={COLORS.mean} strokeWidth={2.5} strokeDasharray="5 3" />
        <text x={meanX} y={BASE_Y - 84} textAnchor="middle" fontSize={10} fontWeight="bold" fill={COLORS.mean} fontFamily="Inter,sans-serif">
          Mean = {meanVal.toFixed(2)}
        </text>

        {/* Deviation lines */}
        <g ref={linesRef}>
          {points.map(({ v, x, dev }, i) => {
            const dotY = BASE_Y - DOT_R - 2;
            return (
              <g key={i}>
                {showSquared && (
                  <rect
                    x={Math.min(x, meanX)} y={dotY - Math.abs(x - meanX)}
                    width={Math.abs(x - meanX)} height={Math.abs(x - meanX)}
                    fill={COLORS.sq} stroke={COLORS.line} strokeWidth={1} strokeDasharray="3 2"
                    opacity={0.7}
                  />
                )}
                <line
                  className="dev-line"
                  x1={x} y1={dotY} x2={meanX} y2={dotY}
                  stroke={dev < 0 ? '#10b981' : dev > 0 ? '#f59e0b' : '#94a3b8'}
                  strokeWidth={2}
                  strokeDasharray="200"
                  strokeDashoffset={animate ? '200' : '0'}
                />
                <text x={(x + meanX) / 2} y={dotY - 6} textAnchor="middle" fontSize={9}
                  fill={dev < 0 ? '#10b981' : dev > 0 ? '#f59e0b' : '#94a3b8'}
                  fontWeight="bold" fontFamily="Inter,sans-serif">
                  {dev > 0 ? `+${dev.toFixed(1)}` : dev.toFixed(1)}
                </text>
              </g>
            );
          })}
        </g>

        {/* Data points */}
        {points.map(({ x }, i) => (
          <circle key={i} cx={x} cy={BASE_Y - DOT_R - 2} r={DOT_R}
            fill={color} fillOpacity={0.85} stroke="white" strokeWidth={1.5} />
        ))}

        {/* Mean dot */}
        <circle cx={meanX} cy={BASE_Y - DOT_R - 2} r={DOT_R + 2} fill={COLORS.mean} stroke="white" strokeWidth={2} />
      </svg>
      <div className="flex gap-4 justify-center text-xs mt-1">
        <span className="flex items-center gap-1"><span className="w-4 h-0.5 bg-green-500 inline-block" /> Negative dev.</span>
        <span className="flex items-center gap-1"><span className="w-4 h-0.5 bg-amber-500 inline-block" /> Positive dev.</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500 inline-block" /> Mean</span>
      </div>
    </div>
  );
}
