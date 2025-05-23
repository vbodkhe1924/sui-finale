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

// Add logger utility
const log = (component: string, action: string, data?: any) => {
  console.log(`[${component}] ${action}`, data ? data : '');
};

interface ExpenseData {
  date: string;
  expenses: number;
  income: number;
}

interface ParticipantDebt {
  name: string;
  amount: number;
}

// Hardcoded data for charts and graphs
const HARDCODED_MONTHLY_DATA: ExpenseData[] = [
  { date: 'Jan', expenses: 85.00, income: 120.00 },
  { date: 'Feb', expenses: 92.50, income: 150.00 },
  { date: 'Mar', expenses: 78.25, income: 95.00 },
  { date: 'Apr', expenses: 115.75, income: 180.00 },
  { date: 'May', expenses: 67.80, income: 135.00 },
  { date: 'Jun', expenses: 94.30, income: 160.00 }
];

const HARDCODED_DEBTS: ParticipantDebt[] = [
  { name: '0x123...abc', amount: 57.50 },
  { name: '0x456...def', amount: 35.25 },
  { name: '0x789...ghi', amount: 22.75 }
];

// Add color constants at the top with the other constants
const CHART_COLORS = {
  primary: {
    base: '#00D2D3',
    gradient: ['#00D2D3', '#00A3A4'],
    light: '#4FD1D9'
  },
  secondary: {
    base: '#6C5CE7',
    gradient: ['#6C5CE7', '#5541D7'],
    light: '#8F85FF'
  },
  accent: {
    base: '#FD79A8',
    gradient: ['#FD79A8', '#E84393'],
    light: '#FDA7C6'
  },
  success: {
    base: '#00B894',
    gradient: ['#00B894', '#00896F'],
    light: '#2ED1B5'
  }
};

const coinIllustration = (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <ellipse cx="24" cy="40" rx="16" ry="4" fill="#00D2D3" fillOpacity="0.18" />
    <circle cx="24" cy="24" r="14" fill="#00D2D3" />
    <circle cx="24" cy="24" r="10" fill="#fff" fillOpacity="0.9" />
    <text x="24" y="29" textAnchor="middle" fontSize="16" fill="#00D2D3" fontWeight="bold">$</text>
  </svg>
);

const Dashboard: React.FC = () => {
  log('Dashboard', 'Component Mounted');
  
  const { walletAddress } = useWallet();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [monthlyData, setMonthlyData] = useState<ExpenseData[]>(HARDCODED_MONTHLY_DATA);
  const [participantDebts, setParticipantDebts] = useState<ParticipantDebt[]>(HARDCODED_DEBTS);
  const [totalTransactions, setTotalTransactions] = useState(10);
  const [activeParticipants, setActiveParticipants] = useState<Set<string>>(new Set(['0x123...abc', '0x456...def', '0x789...ghi']));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suiBalance, setSuiBalance] = useState<string | null>('57.5');

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
    }
  };

  useEffect(() => {
    // Skip the data fetching for now since we're using hardcoded data
    setIsLoading(false);
  }, [walletAddress]);

  const totalOwed = 57.5; // Hardcoded total balance
  
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
            <div className="text-2xl font-mono text-white">57.5 SUI</div>
          </div>
        </div>
      </Card>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard
          title="Total Balance"
          value={totalOwed}
          prefix="$"
          icon={<TrendingUp className="h-7 w-7 text-white" />}
          gradientFrom="from-[#00D2D3]"
          gradientTo="to-[#192a56]"
          sparklineData={HARDCODED_MONTHLY_DATA.map(d => d.expenses)}
          illustration={coinIllustration}
        />
        <StatCard
          title="Monthly Transactions"
          value={totalTransactions}
          suffix=" txns"
          icon={<Activity className="h-7 w-7 text-white" />}
          gradientFrom="from-[#6C5CE7]"
          gradientTo="to-[#341f97]"
          percentChange={0}
          percentColor="text-emerald-400"
          sparklineData={HARDCODED_MONTHLY_DATA.map(d => d.expenses + d.income)}
        />
        <StatCard
          title="Active Participants"
          value={3}
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
              <AnimatedLineChart
                data={HARDCODED_MONTHLY_DATA.map(d => ({ x: d.date, y: d.expenses }))}
                color="#6C5CE7"
                gradientFrom="#6C5CE7"
                gradientTo="#00D2D3"
                width={400}
                height={220}
              />
            </div>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card className="shadow-lg border border-gray-700/50 bg-gradient-to-br from-slate-900 to-slate-800">
            <Title className="text-purple-400">Recent Expenses Comparison</Title>
            <BarChart
              className="h-72 mt-6"
              data={HARDCODED_MONTHLY_DATA.slice(-3)}
              index="date"
              categories={["expenses", "income"]}
              colors={[CHART_COLORS.secondary.base, CHART_COLORS.primary.base]}
              valueFormatter={(number) => `$${number.toFixed(2)}`}
              showAnimation={true}
              showLegend={true}
              showGridLines={false}
              showXAxis={true}
              showYAxis={true}
              yAxisWidth={60}
              customTooltip={({ payload }) => {
                if (!payload?.length) return null;
                return (
                  <div className="rounded-lg border border-gray-700 bg-gray-800 p-2">
                    <div className="text-sm text-gray-200">{payload[0].payload.date}</div>
                    {payload.map((category: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-sm capitalize">{category.name}:</span>
                        <span className="text-sm font-medium text-gray-200">
                          ${category.value.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              }}
            />
          </Card>
        </motion.div>
      </motion.div>

      {/* Donut Chart */}
      <motion.div variants={cardVariants}>
        <Card className="shadow-lg border border-gray-700/50 bg-gradient-to-br from-slate-900 to-slate-800">
          <Title className="text-emerald-400">Participant Debt Distribution</Title>
          <DonutChart
            className="h-80 mt-6"
            data={HARDCODED_DEBTS}
            category="amount"
            index="name"
            valueFormatter={(number) => `$${number.toFixed(2)}`}
            colors={[
              CHART_COLORS.primary.base,
              CHART_COLORS.secondary.base,
              CHART_COLORS.accent.base,
            ]}
            variant="donut"
            showAnimation={true}
            showTooltip={true}
            showLabel={true}
            label="Total Amount"
            labelColor="#E2E8F0"
            valueColor="#E2E8F0"
            showLegend={true}
            legendPosition="bottom"
            customTooltip={({ payload }) => {
              if (!payload?.length) return null;
              const data = payload[0];
              return (
                <div className="rounded-lg border border-gray-700 bg-gray-800 p-2">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: data.color }}
                    />
                    <span className="text-sm font-medium text-gray-200">
                      {data.name}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-gray-200">
                    ${data.value.toFixed(2)}
                  </div>
                </div>
              );
            }}
          />
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
