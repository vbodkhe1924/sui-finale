import React from 'react';
import { WalletConnect } from '../components/Wallet/WalletConnect';
import WalletDetails from '../components/Wallet/WalletDetails';
import ExpenseList from '../components/Expenses/ExpenseList';
import { useWallet } from '../context/WalletContext';

const WalletPage: React.FC = () => {
  const { isConnected } = useWallet();

  return (
    <div className="space-y-8">
      <WalletConnect />
      {isConnected && (
        <>
          <WalletDetails />
          <ExpenseList />
        </>
      )}
    </div>
  );
};

export default WalletPage; 