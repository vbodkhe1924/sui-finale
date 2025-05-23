# SuiSplit - Decentralized Bill Splitting on Sui Blockchain

SuiSplit is a decentralized application built on the Sui blockchain that allows users to:
- Create and manage expense groups
- Add expenses and split them equally among participants
- Track balances between group members
- Settle debts directly through blockchain transactions

## Project Structure

```
SuiSplit/
├── move/                  # Smart contract code
│   ├── sources/           # Move contract source files
│   │   └── sui_split.move # Main expense splitter contract
│   └── Move.toml          # Move package configuration
│
└── frontend/              # React frontend application
    ├── src/
    │   ├── components/    # React components
    │   ├── App.js         # Main application component
    │   ├── App.css        # Application styles
    │   └── index.js       # React entry point
    ├── public/            # Static assets
    ├── package.json       # Frontend dependencies
    └── tailwind.config.js # Tailwind CSS configuration
```

## Setup Instructions

### Prerequisites

- [Sui CLI](https://docs.sui.io/build/install)
- [Node.js](https://nodejs.org/) (v16 or later)
- [Sui Wallet](https://chrome.google.com/webstore/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil) Chrome extension

### Smart Contract Deployment

1. Install Sui CLI and set up your development environment:
   ```
   sui client active-address
   ```

2. Build the Move package:
   ```
   cd move
   sui move build
   ```

3. Deploy the package to Sui Devnet:
   ```
   sui client publish --gas-budget 100000000
   ```

4. Take note of the package object ID from the output, you'll need it for frontend configuration.

### Frontend Setup

1. Install dependencies:
   ```
   cd frontend
   npm install
   ```

2. Start the development server:
   ```
   npm start
   ```

3. Open your browser at `http://localhost:3000`

## Usage Guide

1. Connect your Sui wallet to the application
2. Create a new expense group or join an existing one
3. Add new expenses, specifying who paid and who participated
4. View your balance dashboard to see who owes you money and who you owe
5. Settle debts with a single click using SUI tokens

## Development & Testing

For local testing, you can use the Sui Local Network:

```
sui client switch --env localnet
```

The app is also configured to work with mock data for development purposes.

## License

MIT 