import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, Title, BarChart, DonutChart } from '@tremor/react';
import { Activity, TrendingUp, Users } from 'lucide-react';
import AnimatedLineChart from './AnimatedLineChart';
import { getBalance } from '../../sui/queries';
import StatCard from './StatCard';
import { useWallet } from '../../context/WalletContext';
import SuiLogo from '../../assets/sui-logo.svg';
import { expenseService } from '../../services/expenseService';
import { Expense } from '../../types';

interface ExpenseData {
  date: string;
  expenses: number;
  income: number;
}

interface ParticipantDebt {
  name: string;
  amount: number;
}

const monthlyData: ExpenseData[] = [
  { date: 'Jan', expenses: 250, income: 400 },
  { date: 'Feb', expenses: 300, income: 150 },
  { date: 'Mar', expenses: 200, income: 950 },
  { date: 'Apr', expenses: 278, income: 400 },
  { date: 'May', expenses: 189, income: 475 },
  { date: 'Jun', expenses: 239, income: 380 },
  { date: 'Jul', expenses: 349, income: 430 },
];

const participantDebts: ParticipantDebt[] = [
  { name: 'Alice', amount: 49.99 },
  { name: 'Bob', amount: 25.50 },
  { name: 'Charlie', amount: 15.75 },
];

const coinIllustration = (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <ellipse cx="24" cy="40" rx="16" ry="4" fill="#00D2D3" fillOpacity="0.18" />
    <circle cx="24" cy="24" r="14" fill="#00D2D3" />
    <circle cx="24" cy="24" r="10" fill="#fff" fillOpacity="0.9" />
    <text x="24" y="29" textAnchor="middle" fontSize="16" fill="#00D2D3" fontWeight="bold">$</text>
  </svg>
);

const Dashboard: React.FC = () => {
  const { walletAddress } = useWallet();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [monthlyData, setMonthlyData] = useState<ExpenseData[]>([]);
  const [participantDebts, setParticipantDebts] = useState<ParticipantDebt[]>([]);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [activeParticipants, setActiveParticipants] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    },
    hover: {
      y: -5,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
    }
  };

  // Sui balance
  const [suiBalance, setSuiBalance] = useState<string | null>(null);
  
  useEffect(() => {
    if (walletAddress) {
      setIsLoading(true);
      setError(null);

      const fetchData = async () => {
        try {
          // Get Sui balance
          const balanceRes = await getBalance(walletAddress);
          setSuiBalance(balanceRes.totalBalance ? balanceRes.totalBalance : '0');

          // Get expense group
          const groupId = await expenseService.getExpenseGroup();
          if (!groupId) {
            setError('No expense group found. Please create one first.');
            setIsLoading(false);
            return;
          }

          // Get participant balances (which includes expenses)
          const participantData = await expenseService.getParticipantBalances(groupId);
          
          // Find current user's data
          const userData = participantData.find(p => p.address === walletAddress);
          if (!userData) {
            setError('No expenses found for your wallet.');
            setIsLoading(false);
            return;
          }

          setExpenses(userData.expenses);

          // Process expenses for monthly data
          const monthlyMap = new Map<string, { expenses: number; income: number }>();
          const participants = new Set<string>();
          const debts = new Map<string, number>();

          userData.expenses.forEach(expense => {
            // Monthly data
            const date = new Date(expense.date).toLocaleString('default', { month: 'short' });
            const monthData = monthlyMap.get(date) || { expenses: 0, income: 0 };
            
            if (expense.participants.includes(walletAddress)) {
              monthData.expenses += expense.amount;
            } else {
              monthData.income += expense.amount;
            }
            monthlyMap.set(date, monthData);

            // Collect participants
            expense.participants.forEach(p => participants.add(p));
          });

          // Convert monthly data to array
          const monthlyDataArray = Array.from(monthlyMap.entries())
            .map(([date, data]) => ({
              date,
              expenses: data.expenses,
              income: data.income
            }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

          // Process participant balances
          const debtsArray = participantData
            .filter(p => p.address !== walletAddress && p.balance !== 0)
            .map(p => ({
              name: p.address.slice(0, 6) + '...' + p.address.slice(-4),
              amount: Math.abs(p.balance)
            }));

          setMonthlyData(monthlyDataArray);
          setParticipantDebts(debtsArray);
          setTotalTransactions(userData.expenses.length);
          setActiveParticipants(participants);
        } catch (err) {
          console.error('Error fetching dashboard data:', err);
          setError('Error fetching dashboard data. Please try again.');
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [walletAddress]);

  const totalOwed = participantDebts.reduce((sum, debt) => sum + debt.amount, 0);

  if (!walletAddress) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 text-center"
      >
        <h2 className="text-xl text-white mb-4">Welcome to SuiSplit Dashboard</h2>
        <p className="text-gray-400">Please connect your wallet to view your expenses and balances.</p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 text-center"
      >
        <h2 className="text-xl text-white mb-4">Error</h2>
        <p className="text-red-400">{error}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 space-y-8"
    >
      {/* Sui Balance Card */}
      <Card className="mb-4 bg-gradient-to-r from-cyan-700/40 to-cyan-900/40 border-cyan-500/30 shadow-lg">
        <div className="flex items-center gap-4">
          <img src={SuiLogo} alt="Sui" className="h-8 w-8" />
          <div>
            <div className="text-lg font-bold text-cyan-300">
              Sui Balance ({walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Loading...'})
            </div>
            <div className="text-2xl font-mono text-white">{suiBalance === null ? 'Loading...' : suiBalance}</div>
          </div>
        </div>
      </Card>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard
          title="Total Balance"
          value={isLoading ? null : totalOwed}
          prefix="$"
          icon={<TrendingUp className="h-7 w-7 text-white" />}
          gradientFrom="from-[#00D2D3]"
          gradientTo="to-[#192a56]"
          sparklineData={monthlyData.map(d => d.expenses)}
          illustration={coinIllustration}
        />
        <StatCard
          title="Monthly Transactions"
          value={isLoading ? null : totalTransactions}
          suffix=" txns"
          icon={<Activity className="h-7 w-7 text-white" />}
          gradientFrom="from-[#6C5CE7]"
          gradientTo="to-[#341f97]"
          percentChange={monthlyData.length > 1 ? 
            ((monthlyData[monthlyData.length - 1].expenses - monthlyData[monthlyData.length - 2].expenses) / 
            monthlyData[monthlyData.length - 2].expenses) * 100 : 0}
          percentColor="text-emerald-400"
          sparklineData={monthlyData.map(d => d.expenses + d.income)}
        />
        <StatCard
          title="Active Participants"
          value={isLoading ? null : activeParticipants.size}
          icon={<Users className="h-7 w-7 text-white" />}
          gradientFrom="from-[#00B894]"
          gradientTo="to-[#222f3e]"
          avatars={Array.from(activeParticipants).slice(0, 3).map(addr => addr.slice(0, 1))}
        />
      </div>

      {/* Charts */}
      <motion.div variants={cardVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div variants={cardVariants}>
          <Card className="shadow-lg border border-gray-700/50 bg-gradient-to-br from-slate-900 to-slate-800">
            <Title className="text-cyan-300">Monthly Expense Trends</Title>
            <div className="h-72 mt-6">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-400">Loading...</p>
                </div>
              ) : (
                <AnimatedLineChart
                  data={monthlyData.map(d => ({ x: d.date, y: d.expenses }))}
                  color="#00D2D3"
                  gradientFrom="rgba(108, 92, 231, 0.5)"
                  gradientTo="rgba(0, 210, 211, 0.1)"
                  width={400}
                  height={220}
                />
              )}
            </div>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card className="shadow-lg border border-gray-700/50 bg-gradient-to-br from-slate-900 to-slate-800">
            <Title className="text-purple-400">Recent Expenses Comparison</Title>
            {isLoading ? (
              <div className="flex items-center justify-center h-72 mt-6">
                <p className="text-gray-400">Loading...</p>
              </div>
            ) : monthlyData.length > 0 ? (
              <BarChart
                className="h-72 mt-6"
                data={monthlyData.slice(-3)}
                index="date"
                categories={["expenses", "income"]}
                colors={["cyan", "purple"]}
                valueFormatter={(number) => `$${number.toFixed(2)}`}
                showAnimation={true}
                showLegend={true}
                showGridLines={false}
                startEndOnly={false}
                showXAxis={true}
                showYAxis={true}
                yAxisWidth={60}
              />
            ) : (
              <div className="flex items-center justify-center h-72 mt-6">
                <p className="text-gray-400">No expense data available</p>
              </div>
            )}
          </Card>
        </motion.div>
      </motion.div>

      {/* Donut Chart */}
      <motion.div variants={cardVariants}>
        <Card className="shadow-lg border border-gray-700/50 bg-gradient-to-br from-slate-900 to-slate-800">
          <Title className="text-emerald-400">Participant Debt Distribution</Title>
          {isLoading ? (
            <div className="flex items-center justify-center h-80 mt-6">
              <p className="text-gray-400">Loading...</p>
            </div>
          ) : participantDebts.length > 0 ? (
            <DonutChart
              className="h-80 mt-6"
              data={participantDebts}
              category="amount"
              index="name"
              valueFormatter={(number) => `$${number.toFixed(2)}`}
              colors={["cyan", "violet", "indigo", "emerald", "rose", "amber"]}
              variant="pie"
              showAnimation={true}
              showTooltip={true}
              showLabel={true}
              label="Amount"
              labelColor="#94A3B8"
              valueColor="#E2E8F0"
              showLegend={true}
              legendPosition="bottom"
            />
          ) : (
            <div className="flex items-center justify-center h-80 mt-6">
              <p className="text-gray-400">No debt data available</p>
            </div>
          )}
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
