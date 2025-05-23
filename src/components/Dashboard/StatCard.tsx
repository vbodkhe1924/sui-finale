import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: number;
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
  // Animated number using framer-motion animate
  const [displayValue, setDisplayValue] = useState(0);
  const motionValue = useMotionValue(0);
  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: 1.2,
      ease: 'easeOut',
      onUpdate: v => setDisplayValue(v)
    });
    return controls.stop;
  }, [value]);

  // Sparkline SVG
  let sparkline = null;
  if (sparklineData && sparklineData.length > 1) {
    const max = Math.max(...sparklineData);
    const min = Math.min(...sparklineData);
    const points = sparklineData.map((v, i) => {
      const x = (i / (sparklineData.length - 1)) * 60;
      const y = 24 - ((v - min) / (max - min || 1)) * 20;
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
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.18)' }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 300 }}
      className={`relative rounded-2xl p-6 shadow-lg flex flex-col justify-between min-h-[160px] bg-gradient-to-br ${gradientFrom} ${gradientTo}`}
      style={{ background: `linear-gradient(135deg, var(--tw-gradient-from), var(--tw-gradient-to))` }}
    >
      <div className="flex items-center justify-between mb-2">
        {icon && <div className="p-3 rounded-xl bg-white/10 text-white text-2xl flex items-center justify-center">{icon}</div>}
        {illustration && <div className="absolute right-4 bottom-4 opacity-80 pointer-events-none">{illustration}</div>}
        {avatars && avatars.length > 0 && (
          <div className="flex -space-x-3">
            {avatars.map((a, i) => (
              <div key={i} className="w-9 h-9 rounded-full border-2 border-white bg-gray-800 flex items-center justify-center text-white text-sm font-bold shadow-md" style={{ zIndex: 10 - i }}>
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
              {prefix}{displayValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}{suffix}
            </span>
            {percentChange !== undefined && (
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${percentColor} bg-white/10`}>{percentChange > 0 ? '+' : ''}{percentChange}%</span>
            )}
          </motion.div>
        </div>
        {sparkline && <div className="ml-2">{sparkline}</div>}
      </div>
    </motion.div>
  );
};

export default StatCard; 