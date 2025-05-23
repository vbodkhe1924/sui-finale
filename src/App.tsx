import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WalletKitProvider } from '@mysten/wallet-kit';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout
import AppLayout from './components/Layout/AppLayout';

// Pages
import HomePage from './pages/HomePage';
import WalletPage from './pages/WalletPage';
import CreateExpensePage from './pages/CreateExpensePage';
import ParticipantsPage from './pages/ParticipantsPage';
import NotFoundPage from './pages/NotFoundPage';

// Context
import { WalletProvider } from './context/WalletContext';

function App() {
  return (
    <WalletKitProvider>
      <WalletProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<HomePage />} />
              <Route path="wallet" element={<WalletPage />} />
              <Route path="create-expense" element={<CreateExpensePage />} />
              <Route path="participants" element={<ParticipantsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      </WalletProvider>
    </WalletKitProvider>
  );
}

export default App;