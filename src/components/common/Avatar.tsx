import React from 'react';
import { motion } from 'framer-motion';
import { generateAvatar } from '../../utils/avatar';

interface AvatarProps {
  address: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTooltip?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-11 h-11 text-base',
  lg: 'w-14 h-14 text-lg',
  xl: 'w-20 h-20 text-2xl'
};

const Avatar: React.FC<AvatarProps> = ({
  address,
  name,
  size = 'md',
  showTooltip = false,
  isSelected = false,
  onClick
}) => {
  const avatar = generateAvatar(address, name);
  const isClickable = typeof onClick === 'function';

  return (
    <motion.div
      whileHover={isClickable ? { scale: 1.05 } : undefined}
      whileTap={isClickable ? { scale: 0.95 } : undefined}
      className="relative group"
      onClick={onClick}
      style={{ cursor: isClickable ? 'pointer' : 'default' }}
    >
      <motion.div
        className={`
          relative rounded-xl flex items-center justify-center
          shadow-lg overflow-hidden select-none
          ${sizeClasses[size]}
          ${isSelected ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-gray-900' : ''}
        `}
        initial={false}
        animate={{
          boxShadow: isSelected
            ? '0 0 0 2px rgba(34, 211, 238, 0.5), 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}
      >
        {/* Gradient Background */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${avatar.primaryColor}, ${avatar.secondaryColor})`
          }}
        />

        {/* Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: avatar.pattern,
            backgroundSize: size === 'xl' ? '8px 8px' : '4px 4px'
          }}
        />

        {/* Initials */}
        <span className="relative font-bold text-white mix-blend-overlay">
          {avatar.initials}
        </span>

        {/* Selection Indicator */}
        {isSelected && (
          <motion.div
            className="absolute inset-0 bg-cyan-400/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </motion.div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute z-10 left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 rounded bg-gray-800 text-xs text-white opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap shadow-lg transition-opacity duration-200">
          {name || address}
        </div>
      )}
    </motion.div>
  );
};

export default Avatar; 