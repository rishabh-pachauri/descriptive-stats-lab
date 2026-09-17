import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { histogramBins } from '../../utils/stats';

interface HistogramChartProps {
  data: number[];
  numBins: number;
  color?: string;
  showMean?: boolean;
  showMedian?: boolean;
  label?: string;
}

function mean(d: number[]) { return d.reduce((s, x) => s + x, 0) / d.length; }
function median(d: number[]) {
  const s = [...d].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 === 0 ? (s[m - 1] + s[m]) / 2 : s[m];
}

export default function HistogramChart({
  data,
  numBins,
  color = '#6366f1',
  label = '',
}: HistogramChartProps) {
  if (data.length === 0) return null;
  const bins = histogramBins(data, numBins);
  const maxCount = Math.max(...bins.map(b => b.count), 1);

  return (
    <div>
      {label && <div className="text-sm font-semibold text-gray-700 mb-2 text-center">{label}</div>}
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={bins} barCategoryGap={2}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 9, fill: '#94a3b8' }}
            interval={0}
            angle={-25}
            textAnchor="end"
            height={40}
          />
          <YAxis
            allowDecimals={false}
            domain={[0, maxCount + 1]}
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            label={{ value: 'Count', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#94a3b8' }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload as { label: string; count: number };
              return (
                <div className="bg-white rounded-xl border border-gray-100 shadow-lg px-3 py-2 text-sm">
                  <div className="font-semibold text-gray-700">{d.label}</div>
                  <div className="text-brand-600">Count: <strong>{d.count}</strong></div>
                </div>
              );
            }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {bins.map((_, i) => (
              <Cell key={i} fill={color} fillOpacity={0.8} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex gap-4 justify-center text-xs text-gray-500 mt-1">
        <span>Mean: <strong className="text-brand-600">{(mean(data)).toFixed(1)}</strong></span>
        <span>Median: <strong className="text-green-600">{(median(data)).toFixed(1)}</strong></span>
        <span>n = {data.length}</span>
      </div>
    </div>
  );
}
