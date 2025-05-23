import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Loader, DollarSign, Calendar, FileText, MapPin } from 'lucide-react';
import AnimatedInput from './AnimatedInput';
import AnimatedAvatarSelector from './AnimatedAvatarSelector';

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

const PARTICIPANTS = [
  { name: 'You', wallet: '0x9cfb...M0CK', color: 'bg-cyan-500' },
  { name: 'Alice', wallet: '0xAL1C...', color: 'bg-purple-500' },
  { name: 'Bob', wallet: '0xB0B2...', color: 'bg-green-500' },
  { name: 'Charlie', wallet: '0xCHRL...', color: 'bg-orange-500' },
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: '' as ExpenseCategory,
    description: '',
    merchant: '',
    participants: [] as string[]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Here you would call your blockchain contract
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulated delay
      console.log('Expense created:', formData);
      
      // Reset form
      setFormData({
        amount: '',
        date: new Date().toISOString().split('T')[0],
        category: '' as ExpenseCategory,
        description: '',
        merchant: '',
        participants: []
      });
    } catch (error) {
      console.error('Error creating expense:', error);
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

        {/* Participants */}
        <motion.div variants={formItemVariants} custom={5} initial="hidden" animate="visible">
          <AnimatedAvatarSelector
            participants={PARTICIPANTS}
            selected={formData.participants}
            onToggle={wallet => handleParticipantToggle(wallet)}
            onSelectAll={() => setFormData(prev => ({ ...prev, participants: PARTICIPANTS.map(p => p.wallet) }))}
            onClear={() => setFormData(prev => ({ ...prev, participants: [] }))}
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