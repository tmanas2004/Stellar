"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { TrendingUp, DollarSign, Target, Award, Clock, ExternalLink, Plus } from "lucide-react"
import { useWalletStore } from "../stores/walletStore"
import { getUserInvestments, getUserProjects, getUserNFTs } from "../services/api"

const Dashboard = () => {
  const { isConnected, address } = useWalletStore()
  const [activeTab, setActiveTab] = useState("investments")

  const { data: investments } = useQuery({
    queryKey: ["user-investments", address],
    queryFn: () => getUserInvestments(address!),
    enabled: !!address,
  })

  const { data: projects } = useQuery({
    queryKey: ["user-projects", address],
    queryFn: () => getUserProjects(address!),
    enabled: !!address,
  })

  const { data: nfts } = useQuery({
    queryKey: ["user-nfts", address],
    queryFn: () => getUserNFTs(address!),
    enabled: !!address,
  })

  if (!isConnected) {
    return (
      <div className="text-center py-20 space-y-6">
        <div className="text-6xl">🔒</div>
        <h2 className="text-2xl font-bold text-white">Wallet Connection Required</h2>
        <p className="text-white/80">Please connect your Freighter wallet to view your dashboard.</p>
      </div>
    )
  }

  const totalInvested = investments?.reduce((sum: number, inv: any) => sum + inv.amount, 0) || 0
  const totalReturns = investments?.reduce((sum: number, inv: any) => sum + inv.expectedReturns, 0) || 0
  const activeInvestments = investments?.filter((inv: any) => inv.status === "active").length || 0

  const tabs = [
    { id: "investments", label: "My Investments", count: investments?.length || 0 },
    { id: "projects", label: "My Projects", count: projects?.length || 0 },
    { id: "nfts", label: "NFT Collection", count: nfts?.length || 0 },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">Dashboard</h1>
        <p className="text-xl text-white/80">Track your investments, projects, and achievements</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="glass-card text-center">
          <div className="flex items-center justify-center mb-2">
            <DollarSign className="w-8 h-8 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-white">{totalInvested.toLocaleString()}</div>
          <div className="text-white/60">Total Invested</div>
        </div>

        <div className="glass-card text-center">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="w-8 h-8 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-white">{totalReturns.toLocaleString()}</div>
          <div className="text-white/60">Expected Returns</div>
        </div>

        <div className="glass-card text-center">
          <div className="flex items-center justify-center mb-2">
            <Target className="w-8 h-8 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-white">{activeInvestments}</div>
          <div className="text-white/60">Active Investments</div>
        </div>

        <div className="glass-card text-center">
          <div className="flex items-center justify-center mb-2">
            <Award className="w-8 h-8 text-pink-400" />
          </div>
          <div className="text-3xl font-bold text-white">{nfts?.length || 0}</div>
          <div className="text-white/60">NFTs Earned</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="glass-card">
        <div className="flex space-x-1 p-1 bg-white/5 rounded-lg mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id ? "bg-blue-500 text-white" : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "investments" && (
          <div className="space-y-4">
            {investments && investments.length > 0 ? (
              investments.map((investment: any) => (
                <div key={investment.id} className="glass bg-white/5 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{investment.projectTitle}</h3>
                      <p className="text-white/60 text-sm">{investment.projectDescription}</p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        investment.status === "active"
                          ? "bg-green-500/20 text-green-400"
                          : investment.status === "matured"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {investment.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-white/60">Invested</div>
                      <div className="text-white font-semibold">{investment.amount.toLocaleString()} XLM</div>
                    </div>
                    <div>
                      <div className="text-white/60">APY</div>
                      <div className="text-green-400 font-semibold">{investment.apy}%</div>
                    </div>
                    <div>
                      <div className="text-white/60">Expected Returns</div>
                      <div className="text-white font-semibold">{investment.expectedReturns.toLocaleString()} XLM</div>
                    </div>
                    <div>
                      <div className="text-white/60">Maturity</div>
                      <div className="text-white font-semibold">{investment.maturityDate}</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center space-x-2 text-white/60">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{investment.daysRemaining} days remaining</span>
                    </div>
                    <Link
                      to={`/projects/${investment.projectId}`}
                      className="btn-secondary text-sm flex items-center space-x-1"
                    >
                      <span>View Project</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 space-y-4">
                <div className="text-6xl">💰</div>
                <h3 className="text-xl font-semibold text-white">No Investments Yet</h3>
                <p className="text-white/60">Start investing in innovative projects to see them here</p>
                <Link to="/projects" className="btn-primary">
                  Explore Projects
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === "projects" && (
          <div className="space-y-4">
            {projects && projects.length > 0 ? (
              projects.map((project: any) => (
                <div key={project.id} className="glass bg-white/5 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                      <p className="text-white/60 text-sm">{project.description}</p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        project.status === "active"
                          ? "bg-green-500/20 text-green-400"
                          : project.status === "funded"
                            ? "bg-blue-500/20 text-blue-400"
                            : project.status === "completed"
                              ? "bg-purple-500/20 text-purple-400"
                              : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <div className="text-white/60">Funding Goal</div>
                      <div className="text-white font-semibold">{project.fundingGoal.toLocaleString()} XLM</div>
                    </div>
                    <div>
                      <div className="text-white/60">Raised</div>
                      <div className="text-white font-semibold">{project.totalRaised.toLocaleString()} XLM</div>
                    </div>
                    <div>
                      <div className="text-white/60">APY</div>
                      <div className="text-green-400 font-semibold">{(project.interestRate / 100).toFixed(1)}%</div>
                    </div>
                    <div>
                      <div className="text-white/60">Progress</div>
                      <div className="text-white font-semibold">
                        {((project.totalRaised / project.fundingGoal) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  <div className="w-full bg-white/10 rounded-full h-2 mb-4">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                      style={{ width: `${Math.min((project.totalRaised / project.fundingGoal) * 100, 100)}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-end">
                    <Link to={`/projects/${project.id}`} className="btn-secondary text-sm flex items-center space-x-1">
                      <span>Manage Project</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 space-y-4">
                <div className="text-6xl">🚀</div>
                <h3 className="text-xl font-semibold text-white">No Projects Yet</h3>
                <p className="text-white/60">Submit your first project to get started</p>
                <Link to="/submit" className="btn-primary flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Submit Project</span>
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === "nfts" && (
          <div className="space-y-4">
            {nfts && nfts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {nfts.map((nft: any) => (
                  <div key={nft.tokenId} className="glass bg-white/5 rounded-lg p-4 text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Award className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{nft.name}</h3>
                    <p className="text-white/60 text-sm mb-3">{nft.description}</p>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-white/60">Type</span>
                        <span className="text-white">{nft.achievementType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Earned</span>
                        <span className="text-white">{nft.mintedAt}</span>
                      </div>
                    </div>
                    <div className="mt-3 px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                      Soulbound NFT
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 space-y-4">
                <div className="text-6xl">🏆</div>
                <h3 className="text-xl font-semibold text-white">No NFTs Yet</h3>
                <p className="text-white/60">Earn achievement NFTs by participating in the platform</p>
                <div className="space-y-2 text-sm text-white/60">
                  <p>• Connect wallet to earn Welcome NFT</p>
                  <p>• Submit projects to earn Creator badge</p>
                  <p>• Invest to earn Investor tier NFTs</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
