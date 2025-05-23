import React from 'react';
import { motion } from 'framer-motion';
import { formatCurrency, truncateAddress } from '../../utils/blockchain';
import { ArrowUpRight, ArrowDownLeft, History, Copy, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { useWallet } from '../../context/WalletContext';

const WalletDetails: React.FC = () => {
  const { walletAddress, disconnectWallet, isConnected } = useWallet();

  const handleCopyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      toast.success('Address copied to clipboard');
    } else {
      toast.error('No wallet address available');
    }
  };

  const openExplorer = () => {
    if (walletAddress) {
      window.open(`https://explorer.sui.io/address/${walletAddress}`, '_blank');
    } else {
      toast.error('No wallet address available');
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, delay: 0.1 }
    }
  };

  const actionButtonVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: (custom: number) => ({
      scale: 1,
      opacity: 1,
      transition: { delay: 0.2 + (custom * 0.1) }
    }),
    hover: { scale: 1.05, backgroundColor: 'rgba(34, 211, 238, 0.15)' }
  };

  if (!isConnected) {
    return null; // Don't render anything if wallet is not connected
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700"
    >
      <div className="space-y-6">
        {/* Address Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ rotate: 10 }}
              className="p-2 bg-cyan-500/10 rounded-lg"
            >
              <img src="/sui-logo.png" alt="Sui" className="h-6 w-6" />
            </motion.div>
            <div>
              <p className="text-sm text-gray-300">Connected Wallet</p>
              <p className="text-lg font-mono text-white">
                {walletAddress ? truncateAddress(walletAddress) : 'Not Connected'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1, color: '#22d3ee' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopyAddress}
              className="p-2 text-gray-300 transition-colors"
              title="Copy address"
            >
              <Copy className="h-5 w-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1, color: '#22d3ee' }}
              whileTap={{ scale: 0.95 }}
              onClick={openExplorer}
              className="p-2 text-gray-300 transition-colors"
              title="View in explorer"
            >
              <ExternalLink className="h-5 w-5" />
            </motion.button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-4">
          <motion.button 
            variants={actionButtonVariants}
            custom={0}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className="flex flex-col items-center p-4 bg-gray-700/50 rounded-lg transition-colors"
          >
            <ArrowUpRight className="h-6 w-6 text-cyan-400 mb-2" />
            <span className="text-sm text-gray-300">Send</span>
          </motion.button>
          <motion.button 
            variants={actionButtonVariants}
            custom={1}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className="flex flex-col items-center p-4 bg-gray-700/50 rounded-lg transition-colors"
          >
            <ArrowDownLeft className="h-6 w-6 text-cyan-400 mb-2" />
            <span className="text-sm text-gray-300">Receive</span>
          </motion.button>
          <motion.button 
            variants={actionButtonVariants}
            custom={2}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className="flex flex-col items-center p-4 bg-gray-700/50 rounded-lg transition-colors"
          >
            <History className="h-6 w-6 text-cyan-400 mb-2" />
            <span className="text-sm text-gray-300">History</span>
          </motion.button>
        </div>

        {/* Disconnect Button */}
        <motion.button
          onClick={disconnectWallet}
          whileHover={{ scale: 1.02, backgroundColor: 'rgba(239, 68, 68, 0.2)' }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className="w-full bg-red-500/10 text-red-400 py-3 px-6 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 shadow-md shadow-red-500/10"
        >
          Disconnect Wallet
        </motion.button>
      </div>
    </motion.div>
  );
};

export default WalletDetails;