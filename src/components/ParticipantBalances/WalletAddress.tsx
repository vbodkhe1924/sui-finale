import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { truncateAddress } from '../../utils/blockchain';

interface WalletAddressProps {
  address: string;
}

const WalletAddress: React.FC<WalletAddressProps> = ({ address }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center group">
      <span className="text-sm text-gray-400 font-mono">
        {truncateAddress(address)}
      </span>
      <button
        onClick={handleCopy}
        className="ml-2 text-gray-500 hover:text-cyan-400 focus:outline-none transition-colors duration-200"
        title={copied ? "Copied!" : "Copy full address"}
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </button>
      <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-900 text-xs text-white p-2 rounded shadow-lg mt-8 -ml-2 max-w-xs truncate pointer-events-none">
        {address}
      </div>
    </div>
  );
};

export default WalletAddress;