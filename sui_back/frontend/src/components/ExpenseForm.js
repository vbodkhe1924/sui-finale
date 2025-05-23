import React, { useState } from 'react';

const ExpenseForm = ({ onAddExpense, groupMembers = [], currentUserAddress }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [error, setError] = useState('');

  const handleAddExpense = () => {
    // Clear previous errors
    setError('');
    
    // Basic validation
    if (!description) {
      setError('Please enter a description');
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (selectedParticipants.length === 0) {
      setError('Please select at least one participant');
      return;
    }

    // Create expense object
    const newExpense = {
      description,
      amount: parseFloat(amount),
      payer: currentUserAddress,
      participants: selectedParticipants,
      timestamp: Date.now(),
      settled: false,
    };

    // Send to parent component
    onAddExpense(newExpense);

    // Reset form
    setDescription('');
    setAmount('');
    setSelectedParticipants([]);
  };

  const toggleParticipant = (address) => {
    if (selectedParticipants.includes(address)) {
      setSelectedParticipants(selectedParticipants.filter(addr => addr !== address));
    } else {
      setSelectedParticipants([...selectedParticipants, address]);
    }
  };

  const selectAllParticipants = () => {
    setSelectedParticipants([...groupMembers]);
  };

  return (
    <div className="expense-form bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Expense</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
          Description
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="description"
          type="text"
          placeholder="Dinner, Movie tickets, etc."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
          Amount (SUI)
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="amount"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Participants
        </label>
        <div className="flex justify-end mb-2">
          <button
            type="button"
            className="text-sm text-blue-600 hover:text-blue-800"
            onClick={selectAllParticipants}
          >
            Select All
          </button>
        </div>
        <div className="max-h-48 overflow-y-auto border rounded p-2">
          {groupMembers.length > 0 ? (
            groupMembers.map((address) => (
              <div key={address} className="flex items-center mb-2">
                <input
                  id={`participant-${address}`}
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-blue-600"
                  checked={selectedParticipants.includes(address)}
                  onChange={() => toggleParticipant(address)}
                />
                <label
                  htmlFor={`participant-${address}`}
                  className="ml-2 text-sm text-gray-700 truncate"
                  title={address}
                >
                  {address.substring(0, 10)}...{address.substring(address.length - 4)}
                  {address === currentUserAddress && " (You)"}
                </label>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No group members available</p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          onClick={handleAddExpense}
        >
          Add Expense
        </button>
      </div>
    </div>
  );
};

export default ExpenseForm; 