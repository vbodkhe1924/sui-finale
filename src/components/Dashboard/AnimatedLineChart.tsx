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
  color = '#00D2D3',
  gradientFrom = 'rgba(108, 92, 231, 0.5)',
  gradientTo = 'rgba(0, 210, 211, 0.1)',
}) => {
  // Handle empty data case
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <p className="text-gray-400">No data available</p>
      </div>
    );
  }

  // Filter out invalid data points
  const validData = data.filter(d => typeof d.y === 'number' && !isNaN(d.y));

  if (validData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <p className="text-gray-400">Invalid data points</p>
      </div>
    );
  }

  // Calculate points with padding
  const padding = { top: 20, right: 20, bottom: 30, left: 40 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxY = Math.max(...validData.map(d => d.y));
  const minY = Math.min(...validData.map(d => d.y));
  const yRange = maxY - minY || 1; // Prevent division by zero

  const points = validData.map((d, i) => {
    const x = padding.left + (i / (validData.length - 1)) * chartWidth;
    const y = padding.top + chartHeight - ((d.y - minY) / yRange) * chartHeight;
    return { x: Math.round(x), y: Math.round(y) };
  });

  // Generate path strings with explicit commands and tension
  const linePath = points.reduce((path, point, i) => {
    if (i === 0) return `M ${point.x} ${point.y}`;
    const prevPoint = points[i - 1];
    const tension = 0.3; // Adjust this value to control curve smoothness
    const controlX1 = prevPoint.x + (point.x - prevPoint.x) * tension;
    const controlX2 = point.x - (point.x - prevPoint.x) * tension;
    return `${path} C ${controlX1} ${prevPoint.y}, ${controlX2} ${point.y}, ${point.x} ${point.y}`;
  }, '');

  const areaPath = `
    M ${points[0].x} ${height - padding.bottom}
    L ${points[0].x} ${points[0].y}
    ${points.slice(1).map((point, i) => {
      const prevPoint = points[i];
      const tension = 0.3;
      const controlX1 = prevPoint.x + (point.x - prevPoint.x) * tension;
      const controlX2 = point.x - (point.x - prevPoint.x) * tension;
      return `C ${controlX1} ${prevPoint.y}, ${controlX2} ${point.y}, ${point.x} ${point.y}`;
    }).join(' ')}
    L ${points[points.length - 1].x} ${height - padding.bottom}
    Z
  `.trim();

  // Tooltip state
  const [hovered, setHovered] = useState<number | null>(null);

  // Generate grid lines and labels
  const yAxisTicks = 5;
  const gridLines = Array.from({ length: yAxisTicks }).map((_, i) => {
    const y = padding.top + (chartHeight * i) / (yAxisTicks - 1);
    const value = maxY - (yRange * i) / (yAxisTicks - 1);
    return { y, value };
  });

  return (
    <svg 
      width={width} 
      height={height} 
      className="w-full h-full"
      style={{ overflow: 'visible' }}
    >
      {/* Multiple gradients for visual effects */}
      <defs>
        <linearGradient id="line-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={gradientFrom} stopOpacity={0.5} />
          <stop offset="100%" stopColor={gradientTo} stopOpacity={0.1} />
        </linearGradient>
        <linearGradient id="line-stroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#00D2D3" />
          <stop offset="100%" stopColor="#6C5CE7" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Grid lines and labels */}
      {gridLines.map((tick, i) => (
        <g key={i}>
          <line
            x1={padding.left}
            x2={width - padding.right}
            y1={tick.y}
            y2={tick.y}
            stroke="#ffffff"
            strokeOpacity={0.1}
            strokeWidth={1}
            strokeDasharray="4,4"
          />
          <text
            x={padding.left - 10}
            y={tick.y}
            textAnchor="end"
            alignmentBaseline="middle"
            fill="#94A3B8"
            fontSize="12"
          >
            ${tick.value.toFixed(2)}
          </text>
        </g>
      ))}

      {/* X-axis labels */}
      {validData.map((d, i) => (
        <text
          key={i}
          x={points[i].x}
          y={height - padding.bottom + 20}
          textAnchor="middle"
          fill="#94A3B8"
          fontSize="12"
        >
          {d.x}
        </text>
      ))}

      {/* Area fill with gradient */}
      <motion.path
        d={areaPath}
        fill="url(#line-gradient)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />

      {/* Animated line with gradient stroke */}
      <motion.path
        d={linePath}
        fill="none"
        stroke="url(#line-stroke)"
        strokeWidth={3}
        strokeLinejoin="round"
        strokeLinecap="round"
        filter="url(#glow)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />

      {/* Data points with glow effect */}
      {points.map((p, i) => (
        <g key={i}>
          <motion.circle
            cx={p.x}
            cy={p.y}
            r={hovered === i ? 6 : 4}
            fill={color}
            stroke="#fff"
            strokeWidth={2}
            filter="url(#glow)"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 + i * 0.05, type: 'spring', stiffness: 300 }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{ cursor: 'pointer' }}
          />
          {/* Enhanced tooltip */}
          {hovered === i && (
            <g>
              <rect
                x={p.x - 45}
                y={p.y - 45}
                width={90}
                height={35}
                rx={8}
                fill="rgba(17, 25, 40, 0.95)"
                stroke={color}
                strokeWidth={1}
                filter="url(#glow)"
              />
              <text
                x={p.x}
                y={p.y - 30}
                textAnchor="middle"
                fill="#fff"
                fontSize="12"
                fontWeight="bold"
              >
                ${validData[i].y.toFixed(2)}
              </text>
              <text
                x={p.x}
                y={p.y - 18}
                textAnchor="middle"
                fill={color}
                fontSize="10"
              >
                {validData[i].x}
              </text>
            </g>
          )}
        </g>
      ))}
    </svg>
  );
};

export default AnimatedLineChart; 