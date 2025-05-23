import React from 'react';

const BalanceDashboard = ({ balances = [], currentUserAddress, onSettleDebt }) => {
  // Filter balances to show what the current user owes to others
  // and what others owe to the current user
  const userOwes = balances.filter(
    balance => balance.debtor === currentUserAddress && balance.amount > 0
  );
  
  const owedToUser = balances.filter(
    balance => balance.creditor === currentUserAddress && balance.amount > 0
  );

  // Calculate total balance
  const totalOwed = owedToUser.reduce((sum, balance) => sum + balance.amount, 0);
  const totalOwes = userOwes.reduce((sum, balance) => sum + balance.amount, 0);
  const netBalance = totalOwed - totalOwes;

  const formatAmount = (amount) => {
    return amount.toFixed(2);
  };

  const truncateAddress = (address) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="balance-dashboard bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Balance Summary</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-blue-800 font-medium">Total Owed to You</p>
          <p className="text-2xl font-bold text-blue-600">{formatAmount(totalOwed)} SUI</p>
        </div>
        
        <div className="bg-red-50 p-3 rounded-lg">
          <p className="text-red-800 font-medium">Total You Owe</p>
          <p className="text-2xl font-bold text-red-600">{formatAmount(totalOwes)} SUI</p>
        </div>
        
        <div className={`p-3 rounded-lg ${netBalance >= 0 ? 'bg-green-50' : 'bg-yellow-50'}`}>
          <p className={`font-medium ${netBalance >= 0 ? 'text-green-800' : 'text-yellow-800'}`}>Net Balance</p>
          <p className={`text-2xl font-bold ${netBalance >= 0 ? 'text-green-600' : 'text-yellow-600'}`}>
            {formatAmount(Math.abs(netBalance))} SUI {netBalance >= 0 ? '(positive)' : '(negative)'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* People who owe you money */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Owed to You</h3>
          {owedToUser.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {owedToUser.map((balance, index) => (
                <li key={index} className="py-3">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{truncateAddress(balance.debtor)}</p>
                      <p className="text-sm text-gray-500">{balance.description || 'Various expenses'}</p>
                    </div>
                    <p className="font-bold text-green-600">{formatAmount(balance.amount)} SUI</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No one owes you money</p>
          )}
        </div>

        {/* People you owe money to */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">You Owe</h3>
          {userOwes.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {userOwes.map((balance, index) => (
                <li key={index} className="py-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{truncateAddress(balance.creditor)}</p>
                      <p className="text-sm text-gray-500">{balance.description || 'Various expenses'}</p>
                    </div>
                    <div className="flex items-center">
                      <p className="font-bold text-red-600 mr-3">{formatAmount(balance.amount)} SUI</p>
                      <button
                        onClick={() => onSettleDebt(balance.creditor, balance.amount)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm py-1 px-3 rounded"
                      >
                        Settle
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">You don't owe money to anyone</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BalanceDashboard; 