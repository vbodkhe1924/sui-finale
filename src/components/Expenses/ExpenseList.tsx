import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Calendar, FileText, MapPin, Users } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import { useWalletKit } from '@mysten/wallet-kit';
import { expenseService } from '../../services/expenseService';
import { Expense } from '../../types';
import { toast } from 'react-toastify';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

const ExpenseList: React.FC = () => {
  const { walletAddress, isConnected } = useWallet();
  const walletKit = useWalletKit();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isConnected && walletAddress) {
      loadExpenses();
    }
  }, [isConnected, walletAddress]);

  const loadExpenses = async () => {
    try {
      const expenseList = await expenseService.getExpenses(walletAddress!);
      setExpenses(expenseList);
    } catch (error) {
      console.error('Error loading expenses:', error);
      toast.error('Failed to load expenses');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettleExpense = async (expenseId: string, amount: number) => {
    try {
      await expenseService.settleExpense(expenseId, amount, walletKit);
      toast.success('Expense settled successfully!');
      loadExpenses(); // Reload the expenses list
    } catch (error) {
      console.error('Error settling expense:', error);
      toast.error('Failed to settle expense');
    }
  };

  if (!isConnected) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700"
      >
        <div className="text-center text-gray-300">
          <h2 className="text-xl font-semibold mb-2">Connect Your Wallet</h2>
          <p>Please connect your wallet to view expenses.</p>
        </div>
      </motion.div>
    );
  }

  if (isLoading) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700"
      >
        <div className="text-center text-gray-300">
          <p>Loading expenses...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-white mb-6">Your Expenses</h2>
      
      {expenses.length === 0 ? (
        <div className="bg-gray-800 rounded-xl p-6 text-center text-gray-300">
          <p>No expenses found.</p>
        </div>
      ) : (
        expenses.map((expense) => (
          <motion.div
            key={expense.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-500/10 rounded-lg">
                  <DollarSign className="h-6 w-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">${expense.amount.toFixed(2)}</h3>
                  <p className="text-gray-300">{expense.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">{expense.date}</p>
                <p className="text-sm text-cyan-400">{expense.category}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300">{expense.merchant}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300">{expense.participants.length} participants</span>
              </div>
            </div>

            <motion.button
              onClick={() => handleSettleExpense(expense.id, expense.amount)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-2 px-4 rounded-lg font-medium"
            >
              Settle Expense
            </motion.button>
          </motion.div>
        ))
      )}
    </motion.div>
  );
};

export default ExpenseList; 