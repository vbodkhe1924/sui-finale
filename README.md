# SuiSplit 🚀

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Sui Network](https://img.shields.io/badge/Blockchain-Sui-blue.svg)](https://sui.io/)
[![React](https://img.shields.io/badge/Frontend-React-61dafb.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue.svg)](https://www.typescriptlang.org/)

> *Revolutionizing bill-splitting through blockchain technology*

SuiSplit is a decentralized bill-splitting application built on the Sui blockchain that eliminates the hassle of tracking IOUs and settling debts. Experience transparent, secure, and instant settlements using cryptocurrency with your friends, roommates, and group members.

![SuiSplit Dashboard](https://via.placeholder.com/800x400/4f46e5/ffffff?text=SuiSplit+Dashboard)

## 🌟 What Makes SuiSplit Special

Traditional bill-splitting apps rely on centralized databases and require manual settlements. SuiSplit transforms this experience by leveraging blockchain technology:

| Traditional Apps | SuiSplit |
|------------------|----------|
| Manual cash settlements | Instant crypto settlements |
| Centralized databases | Immutable blockchain records |
| Trust-based system | Cryptographically secure |
| Limited to local currencies | Global accessibility |

## ✨ Features

- 🔐 *Seamless Wallet Integration* - Connect with Sui wallets effortlessly
- 💰 *Real-time Balance Tracking* - Always know who owes what
- ⚡ *Smart Settlement System* - One-click expense settlement via blockchain
- 📊 *Interactive Dashboard* - Visual representation of all balances
- 🔍 *Advanced Filtering* - Organize expenses and balances efficiently
- 🎨 *Modern UI/UX* - Beautiful, responsive interface with smooth animations
- 🌍 *Global Accessibility* - Works anywhere with internet connectivity
- 🔒 *Transparent Records* - All participants can verify transaction history

## 🎯 Use Cases

SuiSplit is perfect for:

- *👥 Friend Groups* - Restaurant bills, entertainment, social activities
- *🏠 Roommates* - Rent, utilities, groceries, household expenses
- *✈ Travel Companions* - Trip costs, accommodations, shared activities
- *🎉 Event Organizers* - Group purchases, event expenses
- *💎 Crypto Enthusiasts* - Practical DeFi applications

## 🏗 Architecture & Technology Stack

### Frontend
- *React.js* with *TypeScript* for type-safe development
- *Tailwind CSS* for modern, utility-first styling
- *Framer Motion* for smooth animations and transitions
- *React Context* for efficient state management
- *Vite* for fast development and building

### Backend
- *Node.js* with *Express.js* for RESTful API
- *TypeScript* for type-safe backend development
- *CORS* for cross-origin resource sharing
- *Custom middleware* for request handling

### Blockchain Integration
- *Sui Network* for high-performance, low-cost transactions
- *@mysten/wallet-kit* for seamless wallet integration
- *Custom Smart Contracts* (Move language) for expense logic
- *Sui TypeScript SDK* for blockchain interactions

### Development Tools
- *ESLint & Prettier* for code quality
- *PostCSS* for CSS processing
- *TypeScript* for enhanced developer experience

## 🚀 Getting Started (Quick Setup)

### Prerequisites

Ensure you have the following installed:
- *Node.js* (v16 or higher) - [Download here](https://nodejs.org/)
- *npm* or *yarn* package manager
- *Sui CLI* - [Installation guide](https://docs.sui.io/build/install)
- *Sui Wallet* - [Install extension](https://chrome.google.com/webstore/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil)

### One-Command Setup (Recommended)

bash
# Clone and setup everything
git clone https://github.com/yourusername/suisplit.git
cd suisplit

# Setup backend
cd sui_back/backend && npm install && cd ../..

# Setup frontend  
cd sui_back/frontend && npm install && cd ../..

# Build smart contracts
cd move && sui move build && cd ..


### Running the Application

You'll need *3 terminal windows*:

*Terminal 1 - Backend:*
bash
cd sui_back/backend
npm run dev
# Backend runs on http://localhost:5000


*Terminal 2 - Frontend:*
bash
cd sui_back/frontend  
npm run dev
# Frontend runs on http://localhost:3000


*Terminal 3 - Smart Contracts (if needed):*
bash
cd move
sui move publish
# Deploy contracts to Sui network


### Verify Setup
1. Open http://localhost:3000 in your browser
2. Connect your Sui wallet
3. Start splitting bills! 🎉

> *Note*: The backend and frontend run on different ports (5000 and 3000) and communicate via CORS-enabled API calls.

### Installation

1. *Clone the repository*
   bash
   git clone https://github.com/yourusername/suisplit.git
   cd suisplit
   

2. *Backend Setup*
   bash
   # Navigate to backend directory
   cd sui_back/backend
   
   # Install backend dependencies
   npm install
   # or
   yarn install
   
   # Set up backend environment variables
   cp .env.example .env
   # Edit .env with your backend configuration
   
   # Start the backend server (runs on port 5000 by default)
   npm run dev
   # or
   yarn dev
   

3. *Frontend Setup* (Open a new terminal)
   bash
   # Navigate to frontend directory from project root
   cd sui_back/frontend
   
   # Install frontend dependencies
   npm install
   # or
   yarn install
   
   # Set up frontend environment variables
   cp .env.example .env.local
   # Edit .env.local with your frontend configuration
   
   # Start the frontend development server (runs on port 3000 by default)
   npm run dev
   # or
   yarn dev
   

4. *Smart Contract Setup*
   bash
   # Navigate to move directory for smart contracts
   cd move
   
   # Deploy smart contracts (requires Sui CLI)
   sui move build
   sui move publish
   

5. *Access the Application*
   - *Frontend*: Navigate to http://localhost:3000
   - *Backend API*: Available at http://localhost:5000
   - Start splitting bills! 🎉

## 📖 Usage Guide

### Getting Started

1. *Connect Your Wallet*
   - Click the "Connect" button in the navigation bar
   - Select your Sui wallet and authorize the connection

2. *View Balances*
   - Access the main dashboard to see all participant balances
   - Use color-coded indicators to quickly identify pending settlements

3. *Filter & Organize*
   - Filter balances by status: All, Pending, or Settled
   - Sort by amount, date, or participant name

4. *Settle Balances*
   - Click the settlement button for any outstanding balance
   - Confirm the transaction in your wallet
   - Watch real-time updates as settlements are processed

### Smart Contract Integration

SuiSplit integrates with Sui blockchain smart contracts for:

- *Expense Group Management* - Create and manage participant groups
- *Balance Tracking* - Automatic calculation and updates
- *Settlement Transactions* - Secure, automated payments
- *Transaction History* - Immutable record keeping

## 🛠 Development

### Project Structure


suisplit/
├── sui_back/                    # Main project directory
│   ├── backend/                 # Backend API server
│   │   ├── src/                 # Backend source code
│   │   ├── node_modules/        # Backend dependencies
│   │   ├── package.json         # Backend dependencies & scripts
│   │   ├── package-lock.json    # Backend lock file
│   │   └── .env                 # Backend environment variables
│   └── frontend/                # Frontend React application
│       ├── src/                 # Frontend source code
│       │   ├── components/      # React components
│       │   │   ├── Dashboard/   # Dashboard related components
│       │   │   ├── Expenses/    # Expense management components
│       │   │   ├── Layout/      # Layout components (NavBar, etc.)
│       │   │   ├── ParticipantBalances/  # Balance display components
│       │   │   └── Wallet/      # Wallet integration components
│       │   ├── context/         # React contexts (WalletContext)
│       │   ├── pages/           # Page components
│       │   ├── styles/          # Global CSS styles
│       │   ├── sui/             # Sui blockchain integration
│       │   │   ├── client.ts    # Sui client configuration
│       │   │   └── queries.ts   # Blockchain queries
│       │   ├── types/           # TypeScript type definitions
│       │   ├── utils/           # Utility functions
│       │   └── App.tsx          # Main app component
│       ├── public/              # Static assets
│       ├── node_modules/        # Frontend dependencies
│       ├── package.json         # Frontend dependencies & scripts
│       ├── tailwind.config.js   # Tailwind CSS configuration
│       ├── postcss.config.js    # PostCSS configuration
│       └── vite-env.d.ts        # Vite environment types
├── move/                        # Sui Move smart contracts
├── docs/                        # Documentation
├── .gitignore                   # Git ignore file
├── README.md                    # Project documentation
└── eslint.config.js             # ESLint configuration


### Available Scripts

#### Frontend Scripts (from sui_back/frontend/)
bash
npm run dev          # Start frontend development server (port 3000)
npm run build        # Build frontend for production
npm run preview      # Preview frontend production build
npm run lint         # Run ESLint on frontend code
npm run type-check   # Run TypeScript checks on frontend


#### Backend Scripts (from sui_back/backend/)
bash
npm run dev          # Start backend development server (port 5000)
npm run build        # Build backend for production
npm run start        # Start production backend server
npm run lint         # Run ESLint on backend code
npm run type-check   # Run TypeScript checks on backend


#### Smart Contract Scripts (from move/)
bash
sui move build       # Build Move smart contracts
sui move test        # Run Move contract tests
sui move publish     # Publish contracts to Sui network


### Environment Variables

#### Frontend Environment (sui_back/frontend/.env.local)
env
VITE_SUI_NETWORK=devnet
VITE_API_BASE_URL=http://localhost:5000
VITE_CONTRACT_ADDRESS=your_contract_address
VITE_PACKAGE_ID=your_package_id


#### Backend Environment (sui_back/backend/.env)
env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
SUI_NETWORK=devnet
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret


## 🧪 Testing

### Frontend Testing
bash
# Navigate to frontend directory
cd sui_back/frontend

# Run frontend tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage


### Backend Testing
bash
# Navigate to backend directory
cd sui_back/backend

# Run backend tests
npm test

# Run API integration tests
npm run test:integration

# Run tests with coverage
npm run test:coverage


### Smart Contract Testing
bash
# Navigate to move directory
cd move

# Run Move contract tests
sui move test

# Run specific test module
sui move test --filter test_expense_creation


## 📱 Deployment

### Frontend Deployment

1. *Build the frontend*
   bash
   cd sui_back/frontend
   npm run build
   

2. *Deploy to Vercel*
   bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy from frontend directory
   cd sui_back/frontend
   vercel --prod
   

### Backend Deployment

1. *Build the backend*
   bash
   cd sui_back/backend
   npm run build
   

2. *Deploy to Railway/Heroku*
   bash
   # For Railway
   railway login
   railway deploy
   
   # For Heroku
   heroku create your-app-name
   git subtree push --prefix sui_back/backend heroku main
   

### Smart Contract Deployment

bash
# Navigate to move directory
cd move

# Deploy to Sui Devnet
sui move publish --gas-budget 100000000

# Deploy to Sui Testnet
sui move publish --gas-budget 100000000 --network testnet

# Deploy to Sui Mainnet
sui move publish --gas-budget 100000000 --network mainnet


### Full Stack Deployment Options

- *Frontend*: Vercel, Netlify, GitHub Pages
- *Backend*: Railway, Heroku, AWS EC2, DigitalOcean
- *Database*: MongoDB Atlas, PostgreSQL (Supabase)
- *Smart Contracts*: Sui Devnet/Testnet/Mainnet

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Development Process

1. *Fork* the repository
2. *Clone* your fork locally
3. *Set up both frontend and backend* following installation instructions
4. *Create* a feature branch (git checkout -b feature/amazing-feature)
5. *Make changes* in appropriate directories (frontend/backend/move)
6. *Test* your changes thoroughly
7. *Commit* your changes (git commit -m 'Add some amazing feature')
8. *Push* to the branch (git push origin feature/amazing-feature)
9. *Open* a Pull Request

### Development Workflow

#### For Frontend Changes:
bash
cd sui_back/frontend
# Make your changes
npm run lint        # Check code style
npm run type-check  # Verify TypeScript
npm test           # Run tests


#### For Backend Changes:
bash
cd sui_back/backend
# Make your changes
npm run lint        # Check code style
npm run type-check  # Verify TypeScript
npm test           # Run tests


#### For Smart Contract Changes:
bash
cd move
# Make your changes
sui move build     # Build contracts
sui move test      # Run contract tests


### Contribution Guidelines

- Follow the existing code style and conventions
- Write clear commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

### Reporting Issues

Found a bug or have a feature request?
- Check existing issues first
- Use the appropriate issue template
- Provide clear reproduction steps
- Include relevant screenshots or logs

## 🗺 Roadmap

### Current Version (v1.0)
- ✅ Basic expense splitting
- ✅ Sui wallet integration
- ✅ Real-time balance tracking
- ✅ One-click settlements

### Upcoming Features (v1.1)
- 🔄 Multi-currency support
- 📱 Mobile application
- 📈 Advanced analytics and insights
- 🔔 Push notifications
- 🌐 Internationalization (i18n)

### Future Plans (v2.0)
- 💳 Integration with traditional payment methods
- 🤖 AI-powered expense categorization
- 📅 Recurring expense management
- 🏪 Merchant integrations
- 🔐 Enhanced privacy features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- *Sui Network Team* - For the incredible blockchain infrastructure
- *@mysten/wallet-kit* - For seamless wallet integration
- *Open Source Community* - For the amazing tools and libraries
- *Contributors* - For making SuiSplit better every day

## 📞 Support & Community

Need help or want to contribute? We're here for you:

- 🐛 *Issues*: [GitHub Issues](https://github.com/yourusername/suisplit/issues)
- 💬 *Discussions*: [GitHub Discussions](https://github.com/yourusername/suisplit/discussions)
- 📧 *Email*: support@suisplit.com
- 🐦 *Twitter*: [@SuiSplit](https://twitter.com/suisplit)
- 💬 *Discord*: [Join our community](https://discord.gg/suisplit)

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/yourusername/suisplit?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/suisplit?style=social)
![GitHub issues](https://img.shields.io/github/issues/yourusername/suisplit)
![GitHub pull requests](https://img.shields.io/github/issues-pr/yourusername/suisplit)

---

<div align="center">
  <p><strong>Made with ❤ by TechAlpha</strong></p>
  <p>Bridging traditional finance with the decentralized future</p>
  
  ⭐ *Star this repository if you find it helpful!* ⭐
</div>
