import { SuiClient } from '@mysten/sui.js/client';

// Use the correct endpoint for your network (devnet, testnet, mainnet, or local)
export const suiClient = new SuiClient({ url: 'https://fullnode.devnet.sui.io:443' });
// For local node: url: 'http://127.0.0.1:9000' 