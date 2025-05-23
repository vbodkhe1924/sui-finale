import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import WalletAddress from './WalletAddress';
import AmountBadge from './AmountBadge';
import { Participant } from '../../types';
import { generateIdenticon } from '../../utils/identicon';

interface ParticipantCardProps {
  participant: Participant;
  index: number;
  onSettle: () => void;
  onViewDetails?: () => void;
}

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring", 
      stiffness: 300, 
      damping: 25,
      mass: 0.8
    }
  },
  hover: { 
    scale: 1.02,
    y: -2,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
    borderColor: "rgba(34, 211, 238, 0.4)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25
    }
  },
  tap: {
    scale: 0.98,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25
    }
  }
};

const sparklineVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: { 
    pathLength: 1, 
    opacity: 1,
    transition: {
      duration: 1,
      ease: "easeInOut"
    }
  }
};

const ParticipantCard: React.FC<ParticipantCardProps> = ({ 
  participant, 
  index, 
  onSettle,
  onViewDetails 
}) => {
  const identicon = generateIdenticon(participant.walletAddress);
  const isEven = index % 2 === 0;
  const hasPositiveTrend = participant.amount > 0;
  const hasNegativeTrend = participant.amount < 0;

  // Mock sparkline data - in a real app, this would come from transaction history
  const sparklineData = [0, 2, 1, 4, 3, 5, 4, 6, 5, 7];
  const maxValue = Math.max(...sparklineData);
  const normalizedData = sparklineData.map(v => v / maxValue);

  return (
    <motion.div 
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      transition={{ delay: index * 0.1 }}
      className={`
        rounded-2xl p-6 border border-gray-700/50 shadow-lg
        ${isEven ? 'bg-gradient-to-br from-gray-800/50 to-gray-800/30' : 'bg-gradient-to-br from-gray-800 to-gray-800/80'}
        backdrop-blur-sm relative overflow-hidden
        before:absolute before:inset-0 before:bg-gradient-to-r before:from-cyan-500/5 before:to-purple-500/5 before:opacity-0 hover:before:opacity-100 before:transition-opacity
      `}
      onClick={onViewDetails}
      role="button"
      tabIndex={0}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] bg-[size:20px_20px]" />
      </div>

      <div className="relative">
        <div className="flex justify-between items-start">
          <div className="flex items-start space-x-4">
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              {identicon ? (
                <img 
                  src={identicon} 
                  alt={`${participant.name}'s avatar`}
                  className="h-14 w-14 rounded-2xl border-2 border-cyan-500/20 shadow-lg shadow-cyan-500/10"
                />
              ) : (
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center border-2 border-cyan-500/20 shadow-lg shadow-cyan-500/10">
                  <span className="text-xl font-bold text-white">
                    {participant.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <motion.div
                className="absolute -bottom-1 -right-1 p-1 rounded-full bg-gray-800 border border-gray-700"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                {hasPositiveTrend ? (
                  <TrendingUp className="h-3 w-3 text-green-400" />
                ) : hasNegativeTrend ? (
                  <TrendingDown className="h-3 w-3 text-red-400" />
                ) : null}
              </motion.div>
            </motion.div>

            <div className="space-y-2">
              <div>
                <h3 className="font-bold text-xl text-white tracking-tight">
                  {participant.name}
                </h3>
                <WalletAddress address={participant.walletAddress} />
              </div>

              {/* Sparkline Graph */}
              <div className="h-8 w-24 bg-gray-800/50 rounded-lg p-1">
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 100 30"
                  preserveAspectRatio="none"
                  className="text-cyan-400"
                >
                  <motion.path
                    d={normalizedData.reduce((path, value, index) => {
                      const x = (index / (normalizedData.length - 1)) * 100;
                      const y = (1 - value) * 30;
                      return path + (index === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`);
                    }, '')}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    variants={sparklineVariants}
                    initial="hidden"
                    animate="visible"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <AmountBadge amount={participant.amount} onSettle={onSettle} />
            {onViewDetails && (
              <motion.div
                whileHover={{ x: 3, color: '#22d3ee' }}
                className="text-gray-400 p-2 rounded-full hover:bg-gray-700/50 transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </motion.div>
            )}
          </div>
        </div>

        {/* Divider */}
        <motion.div 
          className="h-px bg-gradient-to-r from-transparent via-gray-700/50 to-transparent my-4"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
        />
      </div>
    </motion.div>
  );
};

export default ParticipantCard;