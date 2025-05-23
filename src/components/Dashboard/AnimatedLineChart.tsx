import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Add logger utility
const log = (component: string, action: string, data?: any) => {
  console.log(`[${component}] ${action}`, data ? data : '');
};

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
  log('AnimatedLineChart', 'Rendering', { 
    dataPoints: data.length,
    width,
    height
  });

  const [chartData, setChartData] = useState<{ x: string; y: number }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [processedData, setProcessedData] = useState<{
    points: { x: number; y: number }[];
    linePath: string;
    areaPath: string;
    gridLines: { y: number; value: number }[];
  } | null>(null);

  useEffect(() => {
    try {
      log('AnimatedLineChart', 'Processing data', { 
        inputDataPoints: data.length,
        hasInvalidData: data.some(d => !d || typeof d.x !== 'string' || isNaN(Number(d.y)))
      });

      // Ensure data is valid and numbers are properly parsed
      const validData = data
        .filter(d => d && typeof d.x === 'string' && !isNaN(Number(d.y)))
        .map(d => ({
          x: d.x,
          y: Number(d.y)
        }));

      if (validData.length === 0) {
        log('AnimatedLineChart', 'No valid data points');
        setError('No valid data points available');
        setProcessedData(null);
        return;
      }

      log('AnimatedLineChart', 'Data processed', { 
        validDataPoints: validData.length,
        firstPoint: validData[0],
        lastPoint: validData[validData.length - 1]
      });

      setChartData(validData);
      setError(null);

      // Calculate points with padding
      const padding = { top: 20, right: 20, bottom: 30, left: 40 };
      const chartWidth = width - padding.left - padding.right;
      const chartHeight = height - padding.top - padding.bottom;

      const maxY = Math.max(...validData.map(d => d.y));
      const minY = Math.min(...validData.map(d => d.y));
      const yRange = maxY - minY || 1; // Prevent division by zero

      log('AnimatedLineChart', 'Calculated dimensions', {
        chartWidth,
        chartHeight,
        maxY,
        minY,
        yRange
      });

      const points = validData.map((d, i) => {
        const x = padding.left + (i / (validData.length - 1)) * chartWidth;
        const y = padding.top + chartHeight - ((d.y - minY) / yRange) * chartHeight;
        return { x: Math.round(x), y: Math.round(y) };
      });

      // Generate path strings with explicit commands and tension
      const linePath = points.reduce((path, point, i) => {
        if (i === 0) return `M ${point.x} ${point.y}`;
        const prevPoint = points[i - 1];
        const tension = 0.3;
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

      // Generate grid lines
      const yAxisTicks = 5;
      const gridLines = Array.from({ length: yAxisTicks }).map((_, i) => {
        const y = padding.top + (chartHeight * i) / (yAxisTicks - 1);
        const value = maxY - (yRange * i) / (yAxisTicks - 1);
        return { y, value };
      });

      setProcessedData({ points, linePath, areaPath, gridLines });

      log('AnimatedLineChart', 'Generated paths', {
        linePathLength: linePath.length,
        areaPathLength: areaPath.length
      });
    } catch (err) {
      console.error('Error processing chart data:', err);
      log('AnimatedLineChart', 'Error processing data', err);
      setError('Error processing chart data');
      setProcessedData(null);
    }
  }, [data, width, height]);

  // Handle error case
  if (error) {
    log('AnimatedLineChart', 'Rendering error state', { error });
    return (
      <div className="flex items-center justify-center h-full w-full">
        <p className="text-gray-400">{error}</p>
      </div>
    );
  }

  // Handle empty data case
  if (!processedData) {
    log('AnimatedLineChart', 'Rendering empty state');
    return (
      <div className="flex items-center justify-center h-full w-full">
        <p className="text-gray-400">No data available</p>
      </div>
    );
  }

  const { points, linePath, areaPath, gridLines } = processedData;

  return (
    <svg 
      width={width} 
      height={height} 
      className="w-full h-full"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="line-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={gradientFrom} stopOpacity={0.8} />
          <stop offset="50%" stopColor={gradientFrom} stopOpacity={0.3} />
          <stop offset="100%" stopColor={gradientTo} stopOpacity={0.1} />
        </linearGradient>
        <linearGradient id="line-stroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={gradientFrom} />
          <stop offset="50%" stopColor={color} />
          <stop offset="100%" stopColor={gradientTo} />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <filter id="tooltip-glow">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feFlood floodColor={color} floodOpacity="0.2"/>
          <feComposite in2="blur" operator="in"/>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Grid lines and labels */}
      {gridLines.map((tick, i) => (
        <g key={i}>
          <line
            x1={40}
            x2={width - 20}
            y1={tick.y}
            y2={tick.y}
            stroke={color}
            strokeOpacity={0.1}
            strokeWidth={1}
            strokeDasharray="4,4"
          />
          <text
            x={30}
            y={tick.y}
            textAnchor="end"
            alignmentBaseline="middle"
            fill="#E2E8F0"
            fontSize="12"
          >
            ${tick.value.toFixed(2)}
          </text>
        </g>
      ))}

      {/* X-axis labels */}
      {chartData.map((d, i) => (
        <text
          key={i}
          x={points[i].x}
          y={height - 10}
          textAnchor="middle"
          fill="#E2E8F0"
          fontSize="12"
          opacity={0.8}
        >
          {d.x}
        </text>
      ))}

      {/* Area fill with gradient */}
      <motion.path
        d={areaPath}
        fill="url(#line-gradient)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        onAnimationComplete={() => log('AnimatedLineChart', 'Area animation completed')}
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
        onAnimationComplete={() => log('AnimatedLineChart', 'Line animation completed')}
      />

      {/* Data points with hover effect */}
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
            transition={{ delay: i * 0.05, type: 'spring', stiffness: 300 }}
            onMouseEnter={() => {
              setHovered(i);
              log('AnimatedLineChart', 'Point hovered', { index: i, value: chartData[i].y });
            }}
            onMouseLeave={() => setHovered(null)}
            style={{ cursor: 'pointer' }}
          />
          {/* Tooltip */}
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
                filter="url(#tooltip-glow)"
              />
              <text
                x={p.x}
                y={p.y - 30}
                textAnchor="middle"
                fill="#fff"
                fontSize="12"
                fontWeight="bold"
              >
                ${chartData[i].y.toFixed(2)}
              </text>
              <text
                x={p.x}
                y={p.y - 18}
                textAnchor="middle"
                fill={color}
                fontSize="10"
              >
                {chartData[i].x}
              </text>
            </g>
          )}
        </g>
      ))}
    </svg>
  );
};

export default AnimatedLineChart; 