import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users } from 'lucide-react';
import Avatar from '../common/Avatar';

interface Participant {
  name: string;
  wallet: string;
}

interface AnimatedAvatarSelectorProps {
  participants: Participant[];
  selected: string[];
  onToggle: (wallet: string) => void;
  onSelectAll: () => void;
  onClear: () => void;
}

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
      
      <div className="flex flex-wrap gap-3">
        <AnimatePresence>
          {participants.map((p, i) => {
            const isSelected = selected.includes(p.wallet);
            return (
              <motion.div
                key={p.wallet}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ delay: i * 0.1, type: 'spring', stiffness: 300, damping: 24 }}
              >
                <Avatar
                  address={p.wallet}
                  name={p.name}
                  size="md"
                  showTooltip
                  isSelected={isSelected}
                  onClick={() => onToggle(p.wallet)}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AnimatedAvatarSelector; 