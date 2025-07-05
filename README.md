# Blend SCF Launchpad

A decentralized application (DApp) that enables Stellar Community Fund (SCF) projects to create isolated lending pools for fundraising, while allowing retail investors to earn yields by supporting innovative projects.

## 🌟 Features

- **Project Launchpad**: Submit and manage SCF-backed projects with automated pool creation
- **Isolated Lending Pools**: Each project has its own risk-isolated lending pool
- **Micro-Investment Support**: Retail investors can participate with small amounts
- **Soulbound NFTs**: Achievement-based NFTs for users, investors, and creators
- **Freighter Integration**: Seamless Stellar wallet connectivity
- **IPFS Storage**: Decentralized NFT metadata storage via Pinata
- **Multi-Step Forms**: DoraHacks-style project submission with GitHub integration

## 🏗️ Architecture

### Smart Contracts (Rust/Soroban)
- **LaunchpadFactory**: Manages project creation and metadata
- **LendingPool**: Handles isolated investments per project
- **SoulboundNFT**: Mints non-transferable achievement NFTs
- **InvestmentTracker**: Tracks portfolios and platform metrics

### Frontend (React + Vite)
- **Multi-page routing** with React Router
- **Wallet integration** with Freighter
- **State management** with Zustand
- **API layer** with React Query
- **Responsive design** with Tailwind CSS

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Rust and Cargo
- Soroban CLI
- Freighter Wallet Extension

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repo-url>
   cd blend-scf-launchpad
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   npm run install:frontend
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env
   # Edit .env with your configuration
   \`\`\`

4. **Add Rust WASM target**
   \`\`\`bash
   rustup target add wasm32-unknown-unknown
   \`\`\`

5. **Install Soroban CLI**
   \`\`\`bash
   cargo install --locked soroban-cli
   \`\`\`

### Development

1. **Build smart contracts**
   \`\`\`bash
   npm run build:contracts
   \`\`\`

2. **Deploy to testnet**
   \`\`\`bash
   npm run deploy:testnet
   \`\`\`

3. **Start frontend development server**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

\`\`\`
blend-scf-launchpad/
├── contracts/                 # Rust smart contracts
│   ├── launchpad-factory/    # Main factory contract
│   ├── lending-pool/         # Pool management contract
│   ├── soulbound-nft/        # NFT achievement contract
│   └── investment-tracker/   # Portfolio tracking contract
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── stores/          # Zustand state stores
│   │   ├── services/        # API and blockchain services
│   │   └── utils/           # Utility functions
│   └── public/              # Static assets
├── scripts/                 # Deployment and utility scripts
├── .env                     # Environment configuration
└── README.md               # This file
\`\`\`

## 🔧 Configuration

### Environment Variables

Create a `.env` file with the following variables:

\`\`\`env
# Stellar Network Configuration
STELLAR_NETWORK=testnet
STELLAR_RPC_URL=https://soroban-testnet.stellar.org
STELLAR_PASSPHRASE=Test SDF Network ; September 2015

# Pinata IPFS Configuration
PINATA_API_KEY=your_pinata_api_key_here
PINATA_SECRET_API_KEY=your_pinata_secret_key_here
PINATA_JWT=your_pinata_jwt_token_here

# Admin Configuration
ADMIN_SECRET_KEY=your_admin_secret_key_here
\`\`\`

### Pinata Setup

1. Create account at [Pinata.cloud](https://pinata.cloud)
2. Generate API keys in your dashboard
3. Add keys to your `.env` file

### Freighter Wallet

1. Install [Freighter Extension](https://freighter.app/)
2. Create or import a Stellar wallet
3. Switch to Testnet for development

## 🎯 Usage

### For Project Creators

1. **Connect Wallet**: Connect your Freighter wallet
2. **Submit Project**: Use the multi-step form to submit your SCF project
3. **Configure Pool**: Set funding goals, interest rates, and loan terms
4. **Launch**: Deploy your isolated lending pool
5. **Manage**: Track funding progress and investor activity

### For Investors

1. **Connect Wallet**: Connect your Freighter wallet
2. **Browse Projects**: Explore available investment opportunities
3. **Analyze**: Review project details, team, and risk factors
4. **Invest**: Choose investment amount and confirm transaction
5. **Track**: Monitor your portfolio and expected returns

### For NFT Collectors

- **Welcome Badge**: Earned by connecting wallet
- **Creator Badge**: Earned by submitting projects
- **Investor Tiers**: Bronze, Silver, Gold based on investment amounts
- **Early Supporter**: Earned by being among first investors

## 🧪 Testing

### Frontend Tests
\`\`\`bash
cd frontend
npm run test
\`\`\`

### Smart Contract Tests
\`\`\`bash
cd contracts
cargo test
\`\`\`

### Integration Tests
\`\`\`bash
npm run test:integration
\`\`\`

## 🚀 Deployment

### Testnet Deployment
\`\`\`bash
npm run deploy:testnet
\`\`\`

### Mainnet Deployment
\`\`\`bash
npm run deploy:mainnet
\`\`\`

**⚠️ Warning**: Mainnet deployment uses real XLM. Ensure thorough testing on testnet first.

## 🔒 Security

- **Smart Contract Audits**: All contracts should be audited before mainnet deployment
- **Access Controls**: Admin functions are properly protected
- **Input Validation**: All user inputs are validated and sanitized
- **Rate Limiting**: API endpoints include rate limiting
- **Secure Storage**: Private keys are never stored in the application

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the `/docs` folder for detailed guides
- **Issues**: Report bugs and request features via GitHub Issues
- **Community**: Join our Discord server for discussions
- **Email**: Contact the team at support@blend-scf-launchpad.com

## 🙏 Acknowledgments

- **Stellar Development Foundation** for the amazing blockchain platform
- **Stellar Community Fund** for supporting innovative projects
- **Blend Protocol** for DeFi infrastructure inspiration
- **Freighter Team** for the excellent wallet solution
- **Pinata** for reliable IPFS storage services

## 🗺️ Roadmap

- [ ] **Phase 1**: Core functionality and testnet deployment
- [ ] **Phase 2**: Security audits and mainnet deployment
- [ ] **Phase 3**: Advanced features (governance, staking)
- [ ] **Phase 4**: Mobile app development
- [ ] **Phase 5**: Cross-chain integration

---

**Built with ❤️ for the Stellar ecosystem**
