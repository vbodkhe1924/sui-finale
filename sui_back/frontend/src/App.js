import React, { useState, useEffect } from 'react';
import { WalletProvider } from '@suiet/wallet-kit';
import '@suiet/wallet-kit/style.css';
import './App.css';

import WalletConnect from './components/WalletConnect';
import ExpenseForm from './components/ExpenseForm';
import BalanceDashboard from './components/BalanceDashboard';

// Mock data for development - will be replaced with actual blockchain data
const MOCK_GROUP_MEMBERS = [
  '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  '0x2345678901abcdef2345678901abcdef2345678901abcdef2345678901abcdef',
  '0x3456789012abcdef3456789012abcdef3456789012abcdef3456789012abcdef'
];

const MOCK_BALANCES = [
  {
    creditor: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    debtor: '0x2345678901abcdef2345678901abcdef2345678901abcdef2345678901abcdef',
    amount: 25.5,
    description: 'Dinner at Red Lobster'
  },
  {
    creditor: '0x3456789012abcdef3456789012abcdef3456789012abcdef3456789012abcdef',
    debtor: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    amount: 15.75,
    description: 'Movie tickets'
  }
];

function App() {
  const [walletAddress, setWalletAddress] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState(MOCK_BALANCES);
  const [groupMembers, setGroupMembers] = useState(MOCK_GROUP_MEMBERS);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // This would be where we fetch data from the blockchain
    // For MVP, we're using mock data
    if (walletAddress) {
      setIsConnected(true);
      // In a real implementation, we would:
      // 1. Fetch the user's groups from the blockchain
      // 2. Fetch the group members
      // 3. Fetch the expenses and balances
    } else {
      setIsConnected(false);
    }
  }, [walletAddress]);

  const handleWalletConnect = (address) => {
    setWalletAddress(address);
    // For demo, add the connected wallet to the group members if not already there
    if (address && !groupMembers.includes(address)) {
      setGroupMembers([...groupMembers, address]);
    }
  };

  const handleAddExpense = (newExpense) => {
    // In a real implementation, this would call the smart contract
    // For MVP, we just update the local state
    setExpenses([...expenses, newExpense]);

    // Calculate and update balances
    const updatedBalances = [...balances];
    const perPersonAmount = newExpense.amount / newExpense.participants.length;

    // For each participant, create a balance entry
    newExpense.participants.forEach(participant => {
      if (participant !== newExpense.payer) {
        // Find if there's an existing balance between these users
        const existingBalance = updatedBalances.find(
          b => b.creditor === newExpense.payer && b.debtor === participant
        );

        if (existingBalance) {
          // Update existing balance
          existingBalance.amount += perPersonAmount;
        } else {
          // Create new balance
          updatedBalances.push({
            creditor: newExpense.payer,
            debtor: participant,
            amount: perPersonAmount,
            description: newExpense.description
          });
        }
      }
    });

    setBalances(updatedBalances);
  };

  const handleSettleDebt = async (creditor, amount) => {
    // In a real implementation, this would call the smart contract
    // For MVP, we just update the local state
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // Find the balance to update
          const updatedBalances = balances.filter(
            b => !(b.creditor === creditor && b.debtor === walletAddress)
          );
          
          setBalances(updatedBalances);
          resolve();
        } catch (err) {
          reject(new Error('Failed to settle debt'));
        }
      }, 1000); // Simulate a delay for the blockchain transaction
    });
  };

  return (
    <WalletProvider>
      <div className="app bg-gray-100 min-h-screen">
        <header className="bg-indigo-800 text-white p-4 shadow-md">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold">SuiSplit</h1>
            <p className="text-indigo-200">Split bills easily on the Sui blockchain</p>
          </div>
        </header>

        <main className="container mx-auto p-4">
          <section className="mb-6">
            <WalletConnect onWalletConnect={handleWalletConnect} />
          </section>

          {isConnected ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <ExpenseForm 
                  onAddExpense={handleAddExpense} 
                  groupMembers={groupMembers}
                  currentUserAddress={walletAddress}
                />
              </div>
              <div>
                <BalanceDashboard 
                  balances={balances} 
                  currentUserAddress={walletAddress}
                  onSettleDebt={handleSettleDebt}
                />
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Welcome to SuiSplit</h2>
              <p className="text-gray-600 mb-4">Connect your wallet to get started</p>
            </div>
          )}
        </main>

        <footer className="bg-gray-800 text-white p-4 mt-10">
          <div className="container mx-auto text-center">
            <p>SuiSplit - A decentralized bill splitting app on the Sui blockchain</p>
          </div>
        </footer>
      </div>
    </WalletProvider>
  );
}

export default App; 