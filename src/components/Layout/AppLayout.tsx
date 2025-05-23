import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import NavBar from './NavBar';
import { useWallet } from '../../context/WalletContext';

const AppLayout: React.FC = () => {
  const { walletAddress, isConnected, disconnectWallet } = useWallet();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <NavBar />
      
      <header className="w-full py-6 border-b border-gray-800">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold gradient-text-animate"
            >
              SuiSplit
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-gray-300 mt-2"
            >
              Decentralized Bill-Splitting on Sui Blockchain
            </motion.p>
          </div>

          <div className="flex items-center gap-3">
            {isConnected && walletAddress ? (
              <div className="flex items-center gap-2">
                <span className="text-gray-300 bg-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </span>
                <button
                  onClick={disconnectWallet}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                >
                  Disconnect
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </header>
      
      <main className="container mx-auto py-8 px-4">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;