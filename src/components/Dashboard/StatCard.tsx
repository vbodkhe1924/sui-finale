import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';

// Add logger utility
const log = (component: string, action: string, data?: any) => {
  console.log(`[${component}] ${action}`, data ? data : '');
};

interface StatCardProps {
  title: string;
  value: number | null;
  prefix?: string;
  suffix?: string;
  icon?: React.ReactNode;
  gradientFrom: string;
  gradientTo: string;
  sparklineData?: number[];
  percentChange?: number;
  percentColor?: string;
  avatars?: string[]; // URLs or initials
  accent?: string;
  illustration?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  prefix = '',
  suffix = '',
  icon,
  gradientFrom,
  gradientTo,
  sparklineData,
  percentChange,
  percentColor = 'text-emerald-400',
  avatars,
  accent,
  illustration,
}) => {
  log('StatCard', 'Rendering', { title, value, hasSparkline: !!sparklineData });
  
  const [displayValue, setDisplayValue] = useState(0);
  const motionValue = useMotionValue(0);

  useEffect(() => {
    log('StatCard', 'Value changed', { title, oldValue: displayValue, newValue: value });
    
    if (value !== null) {
      const controls = animate(motionValue, value, {
        duration: 1.2,
        ease: 'easeOut',
        onUpdate: (latest) => {
          setDisplayValue(latest);
          log('StatCard', 'Animating value', { title, currentValue: latest });
        }
      });
      return controls.stop;
    } else {
      setDisplayValue(0);
      log('StatCard', 'Reset to zero', { title });
    }
  }, [value, motionValue, title]);

  // Sparkline SVG
  let sparkline = null;
  if (sparklineData && sparklineData.length > 1) {
    log('StatCard', 'Processing sparkline data', { 
      title, 
      dataPoints: sparklineData.length,
      hasInvalidData: sparklineData.some(v => isNaN(v) || v === null)
    });
    
    const validData = sparklineData.filter(v => !isNaN(v) && v !== null);
    if (validData.length > 1) {
      const max = Math.max(...validData);
      const min = Math.min(...validData);
      const range = max - min || 1;
      
      log('StatCard', 'Sparkline data processed', { 
        title, 
        validPoints: validData.length,
        min,
        max,
        range
      });

      const points = validData.map((v, i) => {
        const x = (i / (validData.length - 1)) * 60;
        const y = 24 - ((v - min) / range) * 20;
        return `${x},${y}`;
      }).join(' ');

      sparkline = (
        <svg width="64" height="24" viewBox="0 0 64 24" fill="none">
          <motion.polyline
            points={points}
            fill="none"
            stroke="#00D2D3"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </svg>
      );
    } else {
      log('StatCard', 'Insufficient valid data for sparkline', { title });
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={`relative rounded-2xl p-6 shadow-lg flex flex-col justify-between min-h-[160px] bg-gradient-to-br ${gradientFrom} ${gradientTo}`}
    >
      <div className="flex items-center justify-between mb-2">
        {icon && (
          <div className="p-3 rounded-xl bg-white/10 text-white text-2xl flex items-center justify-center backdrop-blur-sm">
            {icon}
          </div>
        )}
        {illustration && (
          <div className="absolute right-4 bottom-4 opacity-80 pointer-events-none">
            {illustration}
          </div>
        )}
        {avatars && avatars.length > 0 && (
          <div className="flex -space-x-3">
            {avatars.map((a, i) => (
              <div
                key={i}
                className="w-9 h-9 rounded-full border-2 border-white bg-gray-800 flex items-center justify-center text-white text-sm font-bold shadow-md backdrop-blur-sm"
                style={{ zIndex: 10 - i }}
              >
                {a}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-lg font-medium text-white/80 mb-1">{title}</div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-baseline gap-2"
          >
            <span className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              {value === null ? (
                <motion.span
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                  transition={{ repeat: Infinity, duration: 1, repeatType: "reverse" }}
                  className="text-3xl"
                >
                  Loading...
                </motion.span>
              ) : (
                <>
                  {prefix}
                  {displayValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  {suffix}
                </>
              )}
            </span>
            {percentChange !== undefined && value !== null && (
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${percentColor} bg-white/10 backdrop-blur-sm`}>
                {percentChange > 0 ? '+' : ''}{percentChange.toFixed(1)}%
              </span>
            )}
          </motion.div>
        </div>
        {sparkline && value !== null && <div className="ml-2">{sparkline}</div>}
      </div>
    </motion.div>
  );
};

export default StatCard; 