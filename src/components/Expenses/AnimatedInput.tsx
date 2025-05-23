import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ReactNode;
  isValid?: boolean;
  label: string;
}

const AnimatedInput: React.FC<AnimatedInputProps> = ({ icon, isValid, label, ...props }) => {
  return (
    <div className="relative flex items-center bg-gray-900 rounded-xl shadow-lg px-4 py-3 mb-2 focus-within:ring-2 focus-within:ring-cyan-500 transition-all duration-300">
      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center mr-3">
        {icon}
      </div>
      <div className="flex-1">
        <label className="block text-xs text-gray-400 mb-1 select-none">{label}</label>
        <input
          {...props}
          className="w-full bg-transparent border-none outline-none text-white placeholder-gray-500 text-base"
        />
      </div>
      <AnimatePresence>
        {isValid && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="ml-3 flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500"
          >
            <Check className="h-4 w-4 text-white" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnimatedInput; 