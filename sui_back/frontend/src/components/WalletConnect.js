import React, { useState, useEffect } from 'react';
import { ConnectButton, useWallet } from '@suiet/wallet-kit';

const WalletConnect = ({ onWalletConnect }) => {
  const { connected, account } = useWallet();
  const [walletAddress, setWalletAddress] = useState('');

  useEffect(() => {
    if (connected && account) {
      setWalletAddress(account.address);
      if (onWalletConnect) {
        onWalletConnect(account.address);
      }
    } else {
      setWalletAddress('');
    }
  }, [connected, account, onWalletConnect]);

  return (
    <div className="wallet-connect p-4 bg-white rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 mb-2 md:mb-0">SuiSplit Wallet</h2>
        <ConnectButton className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-200" />
      </div>
      
      {connected && (
        <div className="mt-2">
          <p className="text-gray-600 font-medium">Connected Address:</p>
          <p className="text-sm font-mono bg-gray-100 p-2 rounded overflow-x-auto">
            {walletAddress}
          </p>
        </div>
      )}
    </div>
  );
};

export default WalletConnect; 