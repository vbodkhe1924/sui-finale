import React, { useState } from 'react';

const SettleButton = ({ creditor, amount, onSettle }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSettle = async () => {
    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Call the function provided by the parent to handle settlement
      await onSettle(creditor, amount);
      setSuccess(true);
    } catch (err) {
      setError(`Failed to settle: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="settle-button">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-2 text-sm">
          {error}
        </div>
      )}
      
      {success ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded mb-2 text-sm">
          Settlement completed successfully!
        </div>
      ) : (
        <button
          className={`bg-indigo-600 hover:bg-indigo-700 text-white text-sm py-2 px-4 rounded transition duration-200 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={handleSettle}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : `Settle ${amount.toFixed(2)} SUI`}
        </button>
      )}
    </div>
  );
};

export default SettleButton; 