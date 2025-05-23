import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Home, Wallet, Plus, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NavBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: <Home className="h-5 w-5" /> },
    { to: '/wallet', label: 'Wallet', icon: <Wallet className="h-5 w-5" /> },
    { to: '/create-expense', label: 'Create Expense', icon: <Plus className="h-5 w-5" /> },
    { to: '/participants', label: 'Participants', icon: <Users className="h-5 w-5" /> },
  ];

  // Animation variants for mobile menu
  const menuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    closed: { opacity: 0, y: -10 },
    open: { opacity: 1, y: 0 },
  };

  return (
    <nav className="sticky top-0 z-50 bg-gray-900 border-b border-gray-800 shadow-lg">
      {/* Desktop Navigation */}
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo for mobile */}
          <div className="md:hidden text-xl font-bold gradient-text-animate">
            SuiSplit
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 py-2 px-3 font-medium transition-colors ${
                    isActive
                      ? "text-cyan-400 border-b-2 border-cyan-400"
                      : "text-gray-300 hover:text-cyan-400 hover:bg-gray-800/50 rounded"
                  }`
                }
              >
                {link.icon}
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Hamburger menu for mobile */}
          <button
            className="md:hidden p-2 text-gray-300 hover:text-cyan-400 focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="md:hidden bg-gray-800 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-2">
              {navLinks.map((link) => (
                <motion.div key={link.to} variants={itemVariants}>
                  <NavLink
                    to={link.to}
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 py-3 px-4 rounded-lg my-2 ${
                        isActive
                          ? "bg-cyan-500/10 text-cyan-400"
                          : "text-gray-300 hover:bg-gray-700/50 hover:text-cyan-400"
                      }`
                    }
                  >
                    {link.icon}
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default NavBar; 