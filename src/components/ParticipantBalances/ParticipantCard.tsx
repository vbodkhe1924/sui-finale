import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ChevronRight, TrendingUp, TrendingDown, Calendar, DollarSign } from 'lucide-react';
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

const expenseVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { 
    opacity: 1, 
    height: 'auto',
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

const ParticipantCard: React.FC<ParticipantCardProps> = ({ 
  participant, 
  index, 
  onSettle,
  onViewDetails 
}) => {
  const [showExpenses, setShowExpenses] = useState(false);
  const identicon = generateIdenticon(participant.walletAddress);
  const isEven = index % 2 === 0;
  const hasPositiveTrend = participant.amount > 0;
  const hasNegativeTrend = participant.amount < 0;

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
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] bg-[size:20px_20px]" />
      </div>

      <div className="flex flex-col space-y-4">
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

            <div>
              <h3 className="font-bold text-xl text-white tracking-tight">
                {participant.name}
              </h3>
              <WalletAddress address={participant.walletAddress} />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <AmountBadge amount={participant.amount} onSettle={onSettle} />
            <motion.button
              whileHover={{ x: showExpenses ? -3 : 3, color: '#22d3ee' }}
              className="text-gray-400 p-2 rounded-full hover:bg-gray-700/50 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setShowExpenses(!showExpenses);
              }}
            >
              <ChevronRight 
                className={`h-5 w-5 transform transition-transform duration-300 ${showExpenses ? 'rotate-90' : ''}`} 
              />
            </motion.button>
          </div>
        </div>

        {/* Expenses List */}
        <AnimatePresence>
          {showExpenses && participant.expenses && participant.expenses.length > 0 && (
            <motion.div
              variants={expenseVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="mt-4 space-y-3"
            >
              <div className="h-px bg-gradient-to-r from-transparent via-gray-700/50 to-transparent" />
              
              <div className="space-y-3">
                {participant.expenses.map(expense => (
                  <motion.div
                    key={expense.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 border border-gray-700/50"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-gray-700/50">
                        <DollarSign className="h-4 w-4 text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{expense.description}</p>
                        <div className="flex items-center space-x-2 text-xs text-gray-400">
                          <Calendar className="h-3 w-3" />
                          <span>{expense.date}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`text-sm font-medium ${expense.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      ${Math.abs(expense.amount).toFixed(2)}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ParticipantCard;