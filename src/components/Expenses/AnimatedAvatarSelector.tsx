import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Users } from 'lucide-react';

interface Participant {
  name: string;
  wallet: string;
  color: string;
}

interface AnimatedAvatarSelectorProps {
  participants: Participant[];
  selected: string[];
  onToggle: (wallet: string) => void;
  onSelectAll: () => void;
  onClear: () => void;
}

const avatarColors = [
  'bg-cyan-500',
  'bg-purple-500',
  'bg-green-500',
  'bg-orange-500',
  'bg-pink-500',
  'bg-yellow-500',
  'bg-blue-500',
  'bg-red-500',
];

const avatarVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, type: 'spring', stiffness: 300, damping: 24 }
  }),
  hover: { scale: 1.05 },
  tap: { scale: 0.97 },
  selected: { boxShadow: '0 0 0 4px #06b6d4, 0 2px 8px 0 rgba(6,182,212,0.2)' },
};

const AnimatedAvatarSelector: React.FC<AnimatedAvatarSelectorProps> = ({
  participants,
  selected,
  onToggle,
  onSelectAll,
  onClear,
}) => {
  return (
    <div className="bg-gray-900/70 rounded-xl p-4 mb-2 shadow-inner">
      <div className="flex items-center mb-3 gap-2">
        <Users className="h-5 w-5 text-cyan-400" />
        <span className="text-base font-semibold text-white">Participants</span>
        <span className="ml-2 px-2 py-0.5 rounded-full bg-cyan-700/30 text-cyan-300 text-xs font-bold">
          {selected.length}
        </span>
        <div className="flex-1" />
        <motion.button
          type="button"
          onClick={onSelectAll}
          whileHover={{ scale: 1.08 }}
          className="text-cyan-400 text-xs font-medium px-3 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 mr-2"
        >
          Select All
        </motion.button>
        <motion.button
          type="button"
          onClick={onClear}
          whileHover={{ scale: 1.08 }}
          className="text-gray-400 text-xs font-medium px-3 py-1 rounded-lg bg-gray-700/40 hover:bg-gray-700/60"
        >
          Clear
        </motion.button>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2" role="listbox" aria-label="Select participants">
        {participants.map((p, i) => {
          const isSelected = selected.includes(p.wallet);
          return (
            <motion.button
              key={p.wallet}
              type="button"
              tabIndex={0}
              aria-checked={isSelected}
              aria-label={`${p.name} (${p.wallet})`}
              role="option"
              initial="hidden"
              animate="visible"
              whileHover="hover"
              whileTap="tap"
              variants={avatarVariants}
              custom={i}
              onClick={() => onToggle(p.wallet)}
              className={`relative w-11 h-11 rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-200 group ${p.color} shadow-md`}
              style={{ minWidth: 44 }}
            >
              <span className="text-white font-bold text-lg select-none">
                {p.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </span>
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className="absolute inset-0 rounded-full ring-4 ring-cyan-400/80 bg-cyan-500/20 pointer-events-none"
                  />
                )}
              </AnimatePresence>
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ delay: 0.05, type: 'spring', stiffness: 400, damping: 20 }}
                    className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shadow"
                  >
                    <Check className="h-3.5 w-3.5 text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
              <span className="absolute z-10 left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 rounded bg-gray-800 text-xs text-white opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap shadow-lg transition-opacity duration-200">
                {p.name} <br /> <span className="text-cyan-300 font-mono">{p.wallet}</span>
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default AnimatedAvatarSelector; 