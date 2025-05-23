import React from 'react';
import { motion } from 'framer-motion';

interface AmountBadgeProps {
  amount: number;
  onSettle: () => void;
}

const AmountBadge: React.FC<AmountBadgeProps> = ({ amount, onSettle }) => {
  const getBalanceStyle = () => {
    if (amount > 0) {
      return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-green-500/20 cursor-pointer animate-pulse-subtle';
    } else if (amount < 0) {
      return 'bg-gradient-to-r from-red-500 to-orange-600 text-white hover:shadow-lg hover:shadow-red-500/20 cursor-pointer';
    } else {
      return 'bg-gray-700/50 text-gray-400 cursor-default';
    }
  };

  const getBalanceText = () => {
    if (amount === 0) {
      return 'All settled up!';
    }
    return `$${Math.abs(amount).toFixed(2)}`;
  };

  const handleClick = () => {
    if (amount !== 0) {
      onSettle();
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={amount === 0}
      className={`
        px-4 py-2 rounded-full font-medium text-sm 
        transform active:scale-95 transition-all duration-200
        ${getBalanceStyle()}
      `}
      title={amount > 0 ? "Click to settle" : amount < 0 ? "You owe this amount" : "No balance to settle"}
      whileHover={amount !== 0 ? { scale: 1.05 } : {}}
      whileTap={amount !== 0 ? { scale: 0.95 } : {}}
    >
      <div className="flex items-center">
        {amount !== 0 && <span className="mr-1">$</span>}
        <span>{getBalanceText()}</span>
      </div>
    </motion.button>
  );
};

export default AmountBadge;