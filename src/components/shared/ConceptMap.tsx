import { useAppContext } from '../../context/AppContext';

interface Node {
  id: number;
  label: string;
  sublabel?: string;
  x: number;
  y: number;
  module: number;
  color: string;
}

interface Edge {
  from: number;
  to: number;
}

const NODES: Node[] = [
  // Root
  { id: 0,  label: 'Descriptive',  sublabel: 'Statistics', x: 400, y: 30,  module: 1,  color: '#4f46e5' },
  // Tier 1
  { id: 1,  label: 'CENTER',       x: 130, y: 130, module: 2,  color: '#0ea5e9' },
  { id: 2,  label: 'SPREAD',       x: 400, y: 130, module: 4,  color: '#10b981' },
  { id: 3,  label: 'SHAPE',        x: 670, y: 130, module: 8,  color: '#f59e0b' },
  // Tier 2 — CENTER
  { id: 4,  label: 'Mean',         x: 50,  y: 240, module: 2,  color: '#38bdf8' },
  { id: 5,  label: 'Median',       x: 150, y: 240, module: 2,  color: '#38bdf8' },
  { id: 6,  label: 'Mode',         x: 250, y: 240, module: 2,  color: '#38bdf8' },
  // Tier 2 — SPREAD
  { id: 7,  label: 'Range',        x: 310, y: 240, module: 5,  color: '#34d399' },
  { id: 8,  label: 'Variance',     x: 400, y: 240, module: 6,  color: '#34d399' },
  { id: 9,  label: 'Std Dev',      x: 490, y: 240, module: 7,  color: '#34d399' },
  { id: 10, label: 'IQR',          x: 580, y: 240, module: 10, color: '#34d399' },
  // Tier 2 — SHAPE
  { id: 11, label: 'Distribution', x: 630, y: 240, module: 8,  color: '#fcd34d' },
  { id: 12, label: 'Skewness',     x: 730, y: 240, module: 9,  color: '#fcd34d' },
  // Box Plot (links spread + shape)
  { id: 13, label: 'Box Plot',     x: 490, y: 350, module: 10, color: '#a78bfa' },
  // Outliers
  { id: 14, label: 'Outliers',     x: 490, y: 450, module: 10, color: '#f472b6' },
];

const EDGES: Edge[] = [
  { from: 0, to: 1 }, { from: 0, to: 2 }, { from: 0, to: 3 },
  { from: 1, to: 4 }, { from: 1, to: 5 }, { from: 1, to: 6 },
  { from: 2, to: 7 }, { from: 2, to: 8 }, { from: 2, to: 9 }, { from: 2, to: 10 },
  { from: 3, to: 11 }, { from: 3, to: 12 },
  { from: 9, to: 13 }, { from: 10, to: 13 },
  { from: 13, to: 14 },
];

export default function ConceptMap() {
  const { setCurrentModule } = useAppContext();

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox="0 0 800 520"
        width="100%"
        style={{ minWidth: 600 }}
        className="rounded-2xl border border-gray-100"
      >
        <rect width="800" height="520" fill="#f8fafc" rx="16" />

        {/* Edges */}
        {EDGES.map(({ from, to }) => {
          const n1 = NODES[from];
          const n2 = NODES[to];
          return (
            <line
              key={`${from}-${to}`}
              x1={n1.x} y1={n1.y + 16}
              x2={n2.x} y2={n2.y - 12}
              stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 3"
            />
          );
        })}

        {/* Nodes */}
        {NODES.map(node => (
          <g
            key={node.id}
            onClick={() => setCurrentModule(node.module)}
            className="cursor-pointer group"
            tabIndex={0}
            role="button"
            aria-label={`Go to ${node.label} module`}
            onKeyDown={e => e.key === 'Enter' && setCurrentModule(node.module)}
          >
            <rect
              x={node.x - 45} y={node.y - 16}
              width={90} height={node.sublabel ? 38 : 30}
              rx="8"
              fill={node.color}
              className="group-hover:opacity-80 transition-opacity"
            />
            <text
              x={node.x} y={node.y + (node.sublabel ? -2 : 4)}
              textAnchor="middle"
              fill="white"
              fontSize={node.id === 0 ? 11 : 10}
              fontWeight="bold"
              fontFamily="Inter, sans-serif"
            >
              {node.label}
            </text>
            {node.sublabel && (
              <text
                x={node.x} y={node.y + 12}
                textAnchor="middle"
                fill="rgba(255,255,255,0.85)"
                fontSize={9}
                fontFamily="Inter, sans-serif"
              >
                {node.sublabel}
              </text>
            )}
          </g>
        ))}
      </svg>
      <p className="text-center text-xs text-gray-400 mt-2">
        Click any concept to navigate to that module
      </p>
    </div>
  );
}
