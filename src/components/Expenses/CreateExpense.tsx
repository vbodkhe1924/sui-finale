import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Loader, DollarSign, Calendar, FileText, MapPin, UserPlus } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import { useWalletKit } from '@mysten/wallet-kit';
import { expenseService } from '../../services/expenseService';
import AnimatedInput from './AnimatedInput';
import AnimatedAvatarSelector from './AnimatedAvatarSelector';
import { toast } from 'react-toastify';
import { ExpenseCategory } from '../../types';

const CATEGORIES: ExpenseCategory[] = [
  'Food & Dining',
  'Transportation',
  'Entertainment',
  'Utilities & Bills',
  'Shopping',
  'Healthcare',
  'Travel',
  'Other'
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

const formItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (custom: number) => ({
    opacity: 1,
    x: 0,
    transition: { 
      delay: 0.1 * custom,
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  })
};

const CreateExpense: React.FC = () => {
  const { walletAddress, isConnected } = useWallet();
  const walletKit = useWalletKit();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [participants, setParticipants] = useState<Array<{ name: string; wallet: string; color: string }>>([]);
  const [newParticipantAddress, setNewParticipantAddress] = useState('');
  const [formData, setFormData] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: '' as ExpenseCategory,
    description: '',
    merchant: '',
    participants: [] as string[]
  });

  useEffect(() => {
    if (isConnected && walletAddress) {
      // Add the current user as the first participant
      setParticipants([
        { name: 'You', wallet: walletAddress, color: 'bg-cyan-500' }
      ]);
      // Also add the current user to the participants list
      setFormData(prev => ({
        ...prev,
        participants: [walletAddress]
      }));
    }
  }, [isConnected, walletAddress]);

  const handleAddParticipant = () => {
    if (!newParticipantAddress) {
      toast.error('Please enter a wallet address');
      return;
    }

    if (participants.some(p => p.wallet === newParticipantAddress)) {
      toast.error('This participant is already added');
      return;
    }

    // Add new participant
    const newParticipant = {
      name: `Participant ${participants.length + 1}`,
      wallet: newParticipantAddress,
      color: `bg-${['purple', 'green', 'orange', 'pink', 'yellow', 'blue', 'red'][participants.length % 7]}-500`
    };

    setParticipants(prev => [...prev, newParticipant]);
    setNewParticipantAddress('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (formData.participants.length === 0) {
      toast.error('Please select at least one participant');
      return;
    }

    setIsSubmitting(true);

    try {
      // Get or create group
      console.log('Checking for existing expense group...');
      let groupId = await expenseService.getExpenseGroup();
      
      if (!groupId) {
        console.log('No expense group found, creating one...');
        const groupTx = expenseService.createInitGroupTransaction();
        
        // Execute the group creation transaction
        console.log('Executing group creation transaction...');
        const txResponse = await walletKit.signAndExecuteTransactionBlock({
          transactionBlock: groupTx,
          options: { 
            showEffects: true,
            showEvents: true,
            showObjectChanges: true
          }
        });
        
        console.log('Group creation transaction completed, getting object ID...');
        // Wait for transaction confirmation and get the created group ID
        groupId = await expenseService.getCreatedObjectId(txResponse);
        
        if (!groupId) {
          console.error('Failed to get group ID from transaction response');
          throw new Error('Failed to create expense group - no group ID returned');
        }
      }

      console.log('Using expense group:', groupId);

      // Create the expense transaction
      console.log('Creating expense transaction...');
      const tx = expenseService.createExpenseTransaction({
        amount: parseFloat(formData.amount),
        date: formData.date,
        category: formData.category,
        description: formData.description,
        merchant: formData.merchant,
        participants: formData.participants
      }, groupId);

      // Execute the transaction
      console.log('Executing expense transaction...');
      const expenseTxResponse = await walletKit.signAndExecuteTransactionBlock({
        transactionBlock: tx,
        options: { 
          showEffects: true,
          showEvents: true,
          showObjectChanges: true
        }
      });

      console.log('Expense transaction response:', expenseTxResponse);

      if (!expenseTxResponse.effects?.status?.status === 'success') {
        console.error('Transaction failed:', expenseTxResponse.effects?.status);
        throw new Error('Failed to create expense - transaction failed');
      }

      console.log('Expense created successfully');
      toast.success('Expense created successfully!');
      
      // Reset form
      setFormData({
        amount: '',
        date: new Date().toISOString().split('T')[0],
        category: '' as ExpenseCategory,
        description: '',
        merchant: '',
        participants: walletAddress ? [walletAddress] : []
      });
    } catch (error) {
      console.error('Error creating expense:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create expense. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleParticipantToggle = (walletAddress: string) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.includes(walletAddress)
        ? prev.participants.filter(p => p !== walletAddress)
        : [...prev.participants, walletAddress]
    }));
  };

  if (!isConnected) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700"
      >
        <div className="text-center text-gray-300">
          <h2 className="text-xl font-semibold mb-2">Connect Your Wallet</h2>
          <p>Please connect your wallet to create expenses.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700"
    >
      <div className="flex items-center gap-3 mb-8">
        <motion.div 
          whileHover={{ rotate: 90, backgroundColor: 'rgba(34, 211, 238, 0.2)' }}
          transition={{ duration: 0.3 }}
          className="p-2 bg-cyan-500/10 rounded-lg"
        >
          <Plus className="h-6 w-6 text-cyan-400" />
        </motion.div>
        <div>
          <h2 className="text-2xl font-bold text-white">Create New Expense</h2>
          <p className="text-gray-300">Enter details for the expense you paid for</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Amount & Date Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatedInput
            icon={<DollarSign className="h-5 w-5 text-white" />}
            label="Amount ($)*"
            type="number"
            step="0.01"
            required
            min="0.01"
            max="999999.99"
            value={formData.amount}
            onChange={e => setFormData(prev => ({ ...prev, amount: e.target.value }))}
            placeholder="0.00"
            isValid={!!formData.amount && parseFloat(formData.amount) > 0}
          />
          <AnimatedInput
            icon={<Calendar className="h-5 w-5 text-white" />}
            label="Date*"
            type="date"
            required
            max={new Date().toISOString().split('T')[0]}
            value={formData.date}
            onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
            isValid={!!formData.date}
          />
        </div>

        {/* Category */}
        <motion.div variants={formItemVariants} custom={2} initial="hidden" animate="visible">
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Category*
          </label>
          <select
            required
            value={formData.category}
            onChange={e => setFormData(prev => ({ ...prev, category: e.target.value as ExpenseCategory }))}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent shadow-sm"
          >
            <option value="">Select a category</option>
            {CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </motion.div>

        {/* Description */}
        <AnimatedInput
          icon={<FileText className="h-5 w-5 text-white" />}
          label="Description*"
          type="text"
          required
          minLength={5}
          maxLength={50}
          value={formData.description}
          onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="e.g., Dinner at Restaurant"
          isValid={formData.description.length >= 5}
        />

        {/* Merchant */}
        <AnimatedInput
          icon={<MapPin className="h-5 w-5 text-white" />}
          label="Merchant/Location*"
          type="text"
          required
          value={formData.merchant}
          onChange={e => setFormData(prev => ({ ...prev, merchant: e.target.value }))}
          placeholder="Enter business name"
          isValid={formData.merchant.length > 0}
        />

        {/* Add Participant */}
        <motion.div variants={formItemVariants} custom={4} initial="hidden" animate="visible">
          <div className="flex gap-4 mb-4">
            <AnimatedInput
              icon={<UserPlus className="h-5 w-5 text-white" />}
              label="Add Participant (Wallet Address)"
              type="text"
              value={newParticipantAddress}
              onChange={e => setNewParticipantAddress(e.target.value)}
              placeholder="Enter wallet address"
              isValid={newParticipantAddress.length > 0}
            />
            <motion.button
              type="button"
              onClick={handleAddParticipant}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-7 px-4 py-2 bg-cyan-500 text-white rounded-lg"
            >
              Add
            </motion.button>
          </div>
        </motion.div>

        {/* Participants */}
        <motion.div variants={formItemVariants} custom={5} initial="hidden" animate="visible">
          <AnimatedAvatarSelector
            participants={participants}
            selected={formData.participants}
            onToggle={wallet => handleParticipantToggle(wallet)}
            onSelectAll={() => setFormData(prev => ({ ...prev, participants: participants.map(p => p.wallet) }))}
            onClear={() => setFormData(prev => ({ ...prev, participants: walletAddress ? [walletAddress] : [] }))}
          />
        </motion.div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={isSubmitting ? {} : { scale: 1.02, boxShadow: "0 0 15px rgba(6, 182, 212, 0.4)" }}
          whileTap={isSubmitting ? {} : { scale: 0.98 }}
          className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 text-white py-3 px-6 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-70 shadow-lg shadow-cyan-700/30"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
              <span>Creating Expense...</span>
            </div>
          ) : (
            'Create Expense'
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default CreateExpense;