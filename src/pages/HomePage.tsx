import React from 'react';
import { useWallet } from '../context/WalletContext';
import Dashboard from '../components/Dashboard/Dashboard';
import { motion } from 'framer-motion';

const HomePage: React.FC = () => {
  const { isConnected } = useWallet();

  if (!isConnected) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 text-center"
      >
        <h2 className="text-2xl font-bold text-white mb-4">Welcome to SuiSplit</h2>
        <p className="text-gray-400 max-w-md mb-8">
          Connect your wallet to view your dashboard and start managing your shared expenses.
        </p>
        <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700/50">
          <p className="text-cyan-400">Please connect your wallet to continue</p>
        </div>
      </motion.div>
    );
  }

  return <Dashboard />;
};

export default HomePage;
