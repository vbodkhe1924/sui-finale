import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface AnimatedBarChartProps {
  data: { x: string; y: number }[];
  width?: number;
  height?: number;
  barColor?: string;
  gradientFrom?: string;
  gradientTo?: string;
}

const AnimatedBarChart: React.FC<AnimatedBarChartProps> = ({
  data,
  width = 320,
  height = 180,
  barColor = '#6C5CE7',
  gradientFrom = '#6C5CE7',
  gradientTo = '#00D2D3',
}) => {
  const maxY = Math.max(...data.map(d => d.y));
  const barWidth = (width - 40) / data.length - 12;
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <svg width={width} height={height} className="w-full h-44">
      <defs>
        <linearGradient id="bar-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={gradientFrom} stopOpacity={0.9} />
          <stop offset="100%" stopColor={gradientTo} stopOpacity={0.7} />
        </linearGradient>
      </defs>
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
        <line
          key={i}
          x1={30}
          x2={width-10}
          y1={height-30-t*(height-60)}
          y2={height-30-t*(height-60)}
          stroke="#fff"
          strokeOpacity={0.07}
          strokeWidth={1}
        />
      ))}
      {/* Bars */}
      {data.map((d, i) => {
        const x = 30 + i * ((width - 40) / data.length);
        const barHeight = ((d.y / (maxY || 1)) * (height - 60));
        return (
          <g key={i}>
            <motion.rect
              x={x}
              y={height-30-barHeight}
              width={barWidth}
              height={0}
              fill="url(#bar-gradient)"
              rx={6}
              initial={{ height: 0 }}
              animate={{ height: barHeight }}
              transition={{ delay: 0.2 + i * 0.12, duration: 0.7, type: 'spring', stiffness: 200 }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{ filter: hovered === i ? 'brightness(1.2)' : 'none', cursor: 'pointer' }}
            />
            {/* Value label */}
            <motion.text
              x={x + barWidth/2}
              y={height-35-barHeight}
              textAnchor="middle"
              fontSize={13}
              fill="#fff"
              fontWeight="bold"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.12, duration: 0.3 }}
            >
              {d.y}
            </motion.text>
            {/* X label */}
            <text
              x={x + barWidth/2}
              y={height-12}
              textAnchor="middle"
              fontSize={12}
              fill="#00D2D3"
            >
              {d.x}
            </text>
          </g>
        );
      })}
      {/* Tooltip */}
      {hovered !== null && (
        <g>
          <rect
            x={30 + hovered * ((width - 40) / data.length) - 18}
            y={height-60-32}
            width={56}
            height={28}
            rx={8}
            fill="#222f3e"
            opacity={0.95}
            stroke={barColor}
            strokeWidth={1}
          />
          <text
            x={30 + hovered * ((width - 40) / data.length) + barWidth/2}
            y={height-60-14}
            textAnchor="middle"
            fontSize={13}
            fill="#fff"
            fontWeight="bold"
          >
            {data[hovered].y}
          </text>
          <text
            x={30 + hovered * ((width - 40) / data.length) + barWidth/2}
            y={height-60}
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

export default AnimatedBarChart; 