import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import { useWalletKit } from '@mysten/wallet-kit';
import { expenseService } from '../../services/expenseService';
import ParticipantCard from './ParticipantCard';
import { Participant } from '../../types';
import { toast } from 'react-toastify';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.12 }
  }
};

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, type: "spring" }
  }
};

const ParticipantBalances: React.FC = () => {
  const { walletAddress, isConnected } = useWallet();
  const walletKit = useWalletKit();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'settled'>('all');
  const [sortField, setSortField] = useState<'name' | 'amount'>('amount');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    const fetchParticipants = async () => {
      if (!isConnected) {
        setParticipants([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // Get the expense group
        const groupId = await expenseService.getExpenseGroup();
        if (!groupId) {
          console.log('No expense group found');
          setParticipants([]);
          setIsLoading(false);
          return;
        }

        console.log('Using expense group:', groupId);

        // Get participant balances
        const balances = await expenseService.getParticipantBalances(groupId);
        console.log('Received balances:', balances);
        
        // Convert balances to participant objects
        const participantList = balances.map((balance, index) => {
          const participant = {
            id: balance.address,
            name: `Participant ${index + 1}`,
            walletAddress: balance.address,
            amount: balance.balance,
            expenses: balance.expenses || [],
          };
          console.log(`Created participant ${index + 1}:`, participant);
          return participant;
        });

        console.log('Setting participants:', participantList);
        setParticipants(participantList);
      } catch (error) {
        console.error('Error fetching participants:', error);
        toast.error('Failed to fetch participant balances');
      } finally {
        setIsLoading(false);
      }
    };

    fetchParticipants();
  }, [isConnected]);

  const handleSettlement = async (participantId: string) => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      const participant = participants.find(p => p.id === participantId);
      if (!participant) return;

      // Create and execute settlement transaction
      const tx = expenseService.createSettleExpenseTransaction(participantId, Math.abs(participant.amount));
      
      await walletKit.signAndExecuteTransactionBlock({
        transactionBlock: tx,
        options: {
          showEffects: true,
          showEvents: true,
        }
      });

      toast.success('Settlement transaction submitted successfully');
      
      // Refresh participant balances
      const groupId = await expenseService.getExpenseGroup();
      if (groupId) {
        const balances = await expenseService.getParticipantBalances(groupId);
        const updatedParticipants = balances.map((balance, index) => ({
          id: balance.address,
          name: `Participant ${index + 1}`,
          walletAddress: balance.address,
          amount: balance.balance,
          expenses: balance.expenses || [],
        }));
        setParticipants(updatedParticipants);
      }
    } catch (error) {
      console.error('Error settling expense:', error);
      toast.error('Failed to settle expense');
    }
  };

  const filteredAndSortedParticipants = React.useMemo(() => {
    let filtered = [...participants];
    
    if (filter === 'pending') {
      filtered = filtered.filter(p => p.amount !== 0);
    } else if (filter === 'settled') {
      filtered = filtered.filter(p => p.amount === 0);
    }
    
    return filtered.sort((a, b) => {
      const multiplier = sortDirection === 'asc' ? 1 : -1;
      if (sortField === 'name') {
        return multiplier * a.name.localeCompare(b.name);
      } else {
        return multiplier * (a.amount - b.amount);
      }
    });
  }, [participants, sortField, sortDirection, filter]);

  const totalOwed = React.useMemo(() => 
    participants.reduce((sum, p) => sum + (p.amount > 0 ? p.amount : 0), 0),
    [participants]
  );

  const totalDebt = React.useMemo(() => 
    participants.reduce((sum, p) => sum + (p.amount < 0 ? Math.abs(p.amount) : 0), 0),
    [participants]
  );

  const pendingCount = React.useMemo(() => 
    participants.filter(p => p.amount !== 0).length,
    [participants]
  );

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-700/50"
      >
        <motion.div 
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <h2 className="text-3xl font-bold text-white">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent bg-size-200 animate-gradient">
                Participant Balances
              </span>
            </h2>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2 bg-gray-700/30 rounded-xl p-1.5 backdrop-blur-sm">
                {(['all', 'pending', 'settled'] as const).map((tab, index) => (
                  <button
                    key={tab}
                    onClick={() => setFilter(tab)}
                    className={`
                      relative px-4 py-2 rounded-lg text-sm font-medium transition-colors
                      ${filter === tab 
                        ? 'text-cyan-400 bg-gray-700/50' 
                        : 'text-gray-300 hover:text-white hover:bg-gray-700/30'
                      }
                    `}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 rounded-xl p-6 border border-green-500/20"
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-green-500/10">
                  <span className="text-2xl text-green-400">↗</span>
                </div>
                <div>
                  <p className="text-sm text-gray-300">Total Owed</p>
                  <motion.p 
                    className="text-2xl font-bold text-green-400"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={totalOwed}
                  >
                    ${totalOwed.toFixed(2)}
                  </motion.p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-br from-red-500/10 to-orange-500/5 rounded-xl p-6 border border-red-500/20"
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-red-500/10">
                  <span className="text-2xl text-red-400">↘</span>
                </div>
                <div>
                  <p className="text-sm text-gray-300">Total Debt</p>
                  <motion.p 
                    className="text-2xl font-bold text-red-400"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={totalDebt}
                  >
                    ${totalDebt.toFixed(2)}
                  </motion.p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-br from-cyan-500/10 to-purple-500/5 rounded-xl p-6 border border-cyan-500/20"
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-cyan-500/10">
                  <span className="text-2xl text-cyan-400">⟳</span>
                </div>
                <div>
                  <p className="text-sm text-gray-300">Pending Settlements</p>
                  <motion.p 
                    className="text-2xl font-bold text-cyan-400"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={pendingCount}
                  >
                    {pendingCount}
                  </motion.p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {isLoading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center py-16"
          >
            <motion.div
              animate={{ 
                rotate: 360,
                transition: { repeat: Infinity, duration: 1, ease: "linear" }
              }}
              className="relative"
            >
              <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl" />
              <Loader className="h-8 w-8 text-cyan-400 relative" />
            </motion.div>
            <span className="ml-3 text-gray-300">Loading balances...</span>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible" 
            className="grid grid-cols-1 gap-6 mt-8"
          >
            {filteredAndSortedParticipants.map((participant, index) => (
              <ParticipantCard
                key={participant.id}
                participant={participant}
                index={index}
                onSettle={() => handleSettlement(participant.id)}
              />
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ParticipantBalances;