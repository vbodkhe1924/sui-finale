import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface NicknamePromptModalProps {
  isOpen: boolean;
  walletAddress: string;
  onSave: (nickname: string) => void;
  onClose: () => void;
}

const NicknamePromptModal: React.FC<NicknamePromptModalProps> = ({
  isOpen,
  walletAddress,
  onSave,
  onClose,
}) => {
  const [nickname, setNickname] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nickname.trim()) {
      onSave(nickname.trim());
      setNickname('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700/50">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Set Participant Nickname</h2>
                <button
                  onClick={onClose}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Wallet Address */}
              <div className="mb-6">
                <p className="text-sm text-gray-400 mb-2">Wallet Address</p>
                <p className="font-mono text-gray-300 bg-gray-700/50 p-2 rounded-lg text-sm break-all">
                  {walletAddress}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label htmlFor="nickname" className="block text-sm font-medium text-gray-300 mb-2">
                    Nickname
                  </label>
                  <input
                    type="text"
                    id="nickname"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="Enter a nickname"
                    className="w-full bg-gray-700/50 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    autoFocus
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!nickname.trim()}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-cyan-600 hover:to-cyan-700 transition-colors"
                  >
                    Save Nickname
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NicknamePromptModal; 