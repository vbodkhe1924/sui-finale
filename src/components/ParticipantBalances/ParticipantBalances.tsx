import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader, ArrowUpDown, Filter, TrendingUp, TrendingDown, Users } from 'lucide-react';
import ParticipantCard from './ParticipantCard';
import { Participant } from '../../types';

type SortField = 'name' | 'amount';
type SortDirection = 'asc' | 'desc';
type FilterType = 'all' | 'pending' | 'settled';

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

const tabVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.1,
      duration: 0.3
    }
  }),
  hover: { 
    y: -2,
    transition: { duration: 0.2 }
  }
};

const underlineVariants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: { 
    scaleX: 1, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25
    }
  }
};

const ParticipantBalances: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortField, setSortField] = useState<SortField>('amount');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    // Simulate fetching participants from API/blockchain
    const fetchParticipants = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call to your backend or blockchain
        // Mock data for demonstration
        setTimeout(() => {
          setParticipants([
            {
              id: '1',
              name: 'Alice',
              walletAddress: '0xAL1C3456789ABCDEF123456789ABCDEF123456789ABCMOCK',
              amount: 49.99,
            },
            {
              id: '2',
              name: 'Bob',
              walletAddress: '0xB0B3456789ABCDEF123456789ABCDEF123456789ABCMOCK',
              amount: -25.50,
            },
            {
              id: '3',
              name: 'Charlie',
              walletAddress: '0xCHARL3456789ABCDEF123456789ABCDEF123456789ABCMOCK',
              amount: 0,
            },
            {
              id: '4',
              name: 'David',
              walletAddress: '0xDAV1D456789ABCDEF123456789ABCDEF123456789ABCMOCK',
              amount: 25.50,
            },
          ]);
          setIsLoading(false);
        }, 1500); // Simulate network delay
      } catch (error) {
        console.error('Error fetching participants:', error);
        setIsLoading(false);
      }
    };

    fetchParticipants();
  }, []);

  const handleSettlement = (id: string) => {
    // In a real app, this would trigger a blockchain transaction
    console.log(`Settling balance with participant ${id}`);
    // You would call your smart contract here
  };

  const handleViewDetails = (id: string) => {
    // In a real app, this would open a modal or navigate to details
    console.log(`Viewing details for participant ${id}`);
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredAndSortedParticipants = useMemo(() => {
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

  const totalOwed = useMemo(() => 
    participants.reduce((sum, p) => sum + (p.amount > 0 ? p.amount : 0), 0),
    [participants]
  );

  const totalDebt = useMemo(() => 
    participants.reduce((sum, p) => sum + (p.amount < 0 ? Math.abs(p.amount) : 0), 0),
    [participants]
  );

  const pendingCount = useMemo(() => 
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
              <motion.div 
                className="flex items-center space-x-2 bg-gray-700/30 rounded-xl p-1.5 backdrop-blur-sm"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
              >
                {(['all', 'pending', 'settled'] as const).map((tab, index) => (
                  <motion.button
                    key={tab}
                    custom={index}
                    variants={tabVariants}
                    whileHover="hover"
                    onClick={() => setFilter(tab)}
                    className={`
                      relative px-4 py-2 rounded-lg text-sm font-medium transition-colors
                      ${filter === tab 
                        ? 'text-cyan-400' 
                        : 'text-gray-300 hover:text-white'
                      }
                    `}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    {filter === tab && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500"
                        variants={underlineVariants}
                        layoutId="filterUnderline"
                      />
                    )}
                  </motion.button>
                ))}
              </motion.div>
              <motion.div 
                className="flex items-center space-x-2 bg-gray-700/30 rounded-xl p-1.5 backdrop-blur-sm"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                custom={3}
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleSort('name')}
                  className={`
                    p-2 rounded-lg transition-colors
                    ${sortField === 'name' 
                      ? 'bg-cyan-500/20 text-cyan-400' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                    }
                  `}
                >
                  <ArrowUpDown className="h-4 w-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleSort('amount')}
                  className={`
                    p-2 rounded-lg transition-colors
                    ${sortField === 'amount' 
                      ? 'bg-cyan-500/20 text-cyan-400' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                    }
                  `}
                >
                  <Filter className="h-4 w-4" />
                </motion.button>
              </motion.div>
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
                  <TrendingUp className="h-6 w-6 text-green-400" />
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
                  <TrendingDown className="h-6 w-6 text-red-400" />
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
                  <Users className="h-6 w-6 text-cyan-400" />
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
            <AnimatePresence mode="popLayout">
              {filteredAndSortedParticipants.map((participant, index) => (
                <ParticipantCard
                  key={participant.id}
                  participant={participant}
                  index={index}
                  onSettle={() => handleSettlement(participant.id)}
                  onViewDetails={() => handleViewDetails(participant.id)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ParticipantBalances;