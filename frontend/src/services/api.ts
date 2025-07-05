// Mock data for development
const mockProjects = [
  {
    id: 1,
    title: "StellarPay - Cross-border Payments",
    description:
      "A revolutionary payment system built on Stellar for instant cross-border transactions with minimal fees.",
    creator: "GCKFBEIYTKP6RCZNVPH73XL7XFWTEOAO7EUYCMLZXJPLJAUDAXXJ3T2Z",
    fundingGoal: 50000,
    totalRaised: 32500,
    interestRate: 850, // 8.5% in basis points
    loanTerm: 7776000, // 90 days in seconds
    status: "active",
    scfStatus: "approved",
    scfRound: "Round 15",
    scfAmount: "25000",
    githubUrl: "https://github.com/stellar/stellarpay",
    liveUrl: "https://stellarpay-demo.com",
    category: "payments",
    createdAt: Date.now() / 1000 - 86400 * 30, // 30 days ago
    minInvestment: 100,
  },
  {
    id: 2,
    title: "Stellar DEX Analytics",
    description: "Advanced analytics platform for Stellar DEX providing real-time market data and trading insights.",
    creator: "GDQOE23CFSUMSVQK4Y5JHPPYK73VYCNHZHA7ENKCV37P6SUEO6XQBKPP",
    fundingGoal: 30000,
    totalRaised: 18750,
    interestRate: 750, // 7.5%
    loanTerm: 5184000, // 60 days
    status: "active",
    scfStatus: "funded",
    scfRound: "Round 14",
    scfAmount: "15000",
    githubUrl: "https://github.com/stellar/dex-analytics",
    liveUrl: "https://stellar-dex-analytics.com",
    category: "analytics",
    createdAt: Date.now() / 1000 - 86400 * 20,
    minInvestment: 50,
  },
]

const mockStats = {
  totalProjects: 42,
  totalFunded: 1250000,
  activeProjects: 18,
  totalInvestors: 324,
}

// API Functions
export const getPlatformStats = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockStats
}

export const getFeaturedProjects = async () => {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockProjects.slice(0, 3)
}

export const getAllProjects = async () => {
  await new Promise((resolve) => setTimeout(resolve, 400))
  return mockProjects
}

export const getProject = async (id: string) => {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockProjects.find((p) => p.id === Number.parseInt(id))
}

export const createProject = async (projectData: any) => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  // In production, this would interact with Stellar smart contracts
  console.log("Creating project:", projectData)
  return { success: true, projectId: Date.now() }
}

export const investInProject = async (projectId: string, investmentData: any) => {
  await new Promise((resolve) => setTimeout(resolve, 1500))
  // In production, this would call the lending pool contract
  console.log("Investing in project:", projectId, investmentData)
  return { success: true, transactionId: `tx_${Date.now()}` }
}

export const getUserInvestments = async (address: string) => {
  await new Promise((resolve) => setTimeout(resolve, 400))
  // Mock user investments
  return [
    {
      id: 1,
      projectId: 1,
      projectTitle: "StellarPay - Cross-border Payments",
      projectDescription: "Revolutionary payment system built on Stellar",
      amount: 1000,
      apy: 8.5,
      expectedReturns: 1085,
      status: "active",
      maturityDate: "2024-04-15",
      daysRemaining: 45,
    },
    {
      id: 2,
      projectId: 2,
      projectTitle: "Stellar DEX Analytics",
      projectDescription: "Advanced analytics platform for Stellar DEX",
      amount: 500,
      apy: 7.5,
      expectedReturns: 537.5,
      status: "active",
      maturityDate: "2024-03-30",
      daysRemaining: 30,
    },
  ]
}

export const getUserProjects = async (address: string) => {
  await new Promise((resolve) => setTimeout(resolve, 400))
  // Return projects created by the user
  return mockProjects.filter((p) => p.creator === address)
}

export const getUserNFTs = async (address: string) => {
  await new Promise((resolve) => setTimeout(resolve, 300))
  // Mock NFTs
  return [
    {
      tokenId: 1,
      name: "Welcome Badge",
      description: "Congratulations on joining Blend SCF Launchpad!",
      achievementType: "Welcome",
      mintedAt: "2024-01-15",
      imageUrl: "/nft-welcome.png",
    },
    {
      tokenId: 2,
      name: "Investor Bronze",
      description: "Invested your first 1000 XLM in projects",
      achievementType: "InvestorBronze",
      mintedAt: "2024-01-20",
      imageUrl: "/nft-investor-bronze.png",
    },
  ]
}

export const getUserProfile = async (address: string) => {
  await new Promise((resolve) => setTimeout(resolve, 400))
  return {
    address,
    memberSince: "January 2024",
    recentActivity: [
      {
        action: "Invested in StellarPay",
        amount: "1000 XLM",
        timestamp: "2 hours ago",
      },
      {
        action: "Earned Investor Bronze NFT",
        amount: "",
        timestamp: "1 day ago",
      },
    ],
    transactions: [
      {
        type: "investment",
        description: "Investment in StellarPay",
        amount: "1000",
        timestamp: "2024-01-20 14:30",
      },
      {
        type: "return",
        description: "Returns from DEX Analytics",
        amount: "537.5",
        timestamp: "2024-01-18 09:15",
      },
    ],
    achievements: [
      {
        name: "Welcome Badge",
        description: "Joined the platform",
        earnedDate: "Jan 15, 2024",
      },
      {
        name: "Investor Bronze",
        description: "First investment milestone",
        earnedDate: "Jan 20, 2024",
      },
    ],
  }
}

export const getUserStats = async (address: string) => {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return {
    totalInvestments: 2,
    totalProjects: 0,
    totalNFTs: 2,
    totalReturns: 537.5,
    totalInvested: 1500,
    activeInvestments: 2,
    completedProjects: 0,
    successRate: 100,
    reputationScore: 85,
  }
}

// IPFS/Pinata functions for NFT metadata
export const uploadToIPFS = async (metadata: any) => {
  const pinataApiKey = import.meta.env.VITE_PINATA_API_KEY
  const pinataJWT = import.meta.env.VITE_PINATA_JWT

  if (!pinataApiKey || !pinataJWT) {
    throw new Error("Pinata API credentials not configured")
  }

  try {
    const response = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${pinataJWT}`,
      },
      body: JSON.stringify({
        pinataContent: metadata,
        pinataMetadata: {
          name: `nft-metadata-${Date.now()}`,
        },
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to upload to IPFS")
    }

    const result = await response.json()
    return `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`
  } catch (error) {
    console.error("IPFS upload error:", error)
    throw error
  }
}

export const mintNFT = async (address: string, metadata: any) => {
  try {
    // Upload metadata to IPFS first
    const metadataUrl = await uploadToIPFS(metadata)

    // In production, this would call the SoulboundNFT contract
    console.log("Minting NFT for:", address, "with metadata:", metadataUrl)

    // Simulate contract call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    return {
      success: true,
      tokenId: Date.now(),
      metadataUrl,
      transactionId: `nft_${Date.now()}`,
    }
  } catch (error) {
    console.error("NFT minting error:", error)
    throw error
  }
}
