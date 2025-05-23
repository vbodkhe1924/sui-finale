import React from 'react';
import { useWallet } from '../context/WalletContext';
import Dashboard from '../components/Dashboard/Dashboard';
import { motion } from 'framer-motion';
import { ConnectButton } from '@mysten/wallet-kit';

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
        <motion.div 
          className="p-6 bg-gray-800/50 rounded-xl border border-gray-700/50"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex flex-col items-center gap-4">
            <p className="text-cyan-400 mb-2">Please connect your wallet to continue</p>
            <ConnectButton />
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return <Dashboard />;
};

export default HomePage;
