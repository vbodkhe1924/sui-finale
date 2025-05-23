import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ChevronRight, TrendingUp, TrendingDown, Calendar, DollarSign, Edit2, Check, X } from 'lucide-react';
import WalletAddress from './WalletAddress';
import AmountBadge from './AmountBadge';
import { Participant } from '../../types';
import { generateIdenticon } from '../../utils/identicon';
import { getNickname, setNickname } from '../../utils/nicknames';
import Avatar from '../common/Avatar';

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
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNicknameState] = useState(getNickname(participant.walletAddress) || `Participant ${index + 1}`);
  const [editValue, setEditValue] = useState(nickname);
  const isEven = index % 2 === 0;
  const hasPositiveTrend = participant.amount > 0;
  const hasNegativeTrend = participant.amount < 0;

  const handleSaveNickname = () => {
    if (editValue.trim()) {
      setNickname(participant.walletAddress, editValue.trim());
      setNicknameState(editValue.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditValue(nickname);
    setIsEditing(false);
  };

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
            <Avatar
              address={participant.walletAddress}
              name={nickname}
              size="lg"
              showTooltip={false}
            />

            <div className="flex-1">
              <div className="flex items-center space-x-2">
                {isEditing ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="bg-gray-700/50 text-white px-2 py-1 rounded-lg text-lg font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveNickname();
                        if (e.key === 'Escape') handleCancelEdit();
                      }}
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSaveNickname}
                      className="p-1 text-green-400 hover:text-green-300"
                    >
                      <Check className="h-5 w-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCancelEdit}
                      className="p-1 text-red-400 hover:text-red-300"
                    >
                      <X className="h-5 w-5" />
                    </motion.button>
                  </div>
                ) : (
                  <>
                    <h3 className="font-bold text-xl text-white tracking-tight">
                      {nickname}
                    </h3>
                    <motion.button
                      whileHover={{ scale: 1.1, color: '#22d3ee' }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsEditing(true)}
                      className="p-1 text-gray-400 hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Edit2 className="h-4 w-4" />
                    </motion.button>
                  </>
                )}
              </div>
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