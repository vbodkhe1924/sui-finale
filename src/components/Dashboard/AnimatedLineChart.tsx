import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface AnimatedLineChartProps {
  data: { x: string; y: number }[];
  width?: number;
  height?: number;
  color?: string;
  gradientFrom?: string;
  gradientTo?: string;
}

const AnimatedLineChart: React.FC<AnimatedLineChartProps> = ({
  data,
  width = 400,
  height = 180,
  color = '#6C5CE7',
  gradientFrom = '#6C5CE7',
  gradientTo = '#00D2D3',
}) => {
  // Calculate points
  const maxY = Math.max(...data.map(d => d.y));
  const minY = Math.min(...data.map(d => d.y));
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * (width - 40) + 20;
    const y = height - 30 - ((d.y - minY) / (maxY - minY || 1)) * (height - 60);
    return { x, y };
  });
  const pathD = points.map((p, i) => i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`).join(' ');
  const areaD = `${points.map((p, i) => i === 0 ? `M${p.x},${height-30}` : '')} ${points.map(p => `L${p.x},${p.y}`).join(' ')} L${points[points.length-1].x},${height-30} Z`;

  // Tooltip state
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <svg width={width} height={height} className="w-full h-48">
      {/* Gradient */}
      <defs>
        <linearGradient id="line-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={gradientFrom} stopOpacity={0.7} />
          <stop offset="100%" stopColor={gradientTo} stopOpacity={0.1} />
        </linearGradient>
      </defs>
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
        <line
          key={i}
          x1={20}
          x2={width-20}
          y1={height-30-t*(height-60)}
          y2={height-30-t*(height-60)}
          stroke="#fff"
          strokeOpacity={0.07}
          strokeWidth={1}
        />
      ))}
      {/* Area fill */}
      <motion.path
        d={areaD}
        fill="url(#line-gradient)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
      {/* Line */}
      <motion.path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={3}
        strokeLinejoin="round"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
      {/* Data points */}
      {points.map((p, i) => (
        <motion.circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={hovered === i ? 7 : 4}
          fill={color}
          stroke="#fff"
          strokeWidth={2}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 + i * 0.05, type: 'spring', stiffness: 300 }}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
        />
      ))}
      {/* Tooltips */}
      {hovered !== null && (
        <g>
          <rect
            x={points[hovered].x - 32}
            y={points[hovered].y - 38}
            width={64}
            height={28}
            rx={8}
            fill="#222f3e"
            opacity={0.95}
            stroke={color}
            strokeWidth={1}
          />
          <text
            x={points[hovered].x}
            y={points[hovered].y - 22}
            textAnchor="middle"
            fontSize={13}
            fill="#fff"
            fontWeight="bold"
          >
            {data[hovered].y}
          </text>
          <text
            x={points[hovered].x}
            y={points[hovered].y - 8}
            textAnchor="middle"
            fontSize={11}
            fill="#00D2D3"
          >
            {data[hovered].x}
          </text>
        </g>
      )}
    </svg>
  );
};

export default AnimatedLineChart; 