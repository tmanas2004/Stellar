"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { User, Wallet, Award, TrendingUp, Copy, ExternalLink, Settings } from "lucide-react"
import { useWalletStore } from "../stores/walletStore"
import { getUserProfile, getUserStats } from "../services/api"
import toast from "react-hot-toast"

const Profile = () => {
  const { isConnected, address, balance, disconnectWallet } = useWalletStore()
  const [activeTab, setActiveTab] = useState("overview")

  const { data: profile } = useQuery({
    queryKey: ["user-profile", address],
    queryFn: () => getUserProfile(address!),
    enabled: !!address,
  })

  const { data: stats } = useQuery({
    queryKey: ["user-stats", address],
    queryFn: () => getUserStats(address!),
    enabled: !!address,
  })

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      toast.success("Address copied to clipboard!")
    }
  }

  if (!isConnected) {
    return (
      <div className="text-center py-20 space-y-6">
        <div className="text-6xl">🔒</div>
        <h2 className="text-2xl font-bold text-white">Wallet Connection Required</h2>
        <p className="text-white/80">Please connect your Freighter wallet to view your profile.</p>
      </div>
    )
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "wallet", label: "Wallet", icon: Wallet },
    { id: "achievements", label: "Achievements", icon: Award },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-24 h-24 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <User className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </h1>
        <p className="text-white/80">Stellar Wallet Address</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card text-center">
          <div className="text-2xl font-bold text-white">{stats?.totalInvestments || 0}</div>
          <div className="text-white/60 text-sm">Investments</div>
        </div>
        <div className="glass-card text-center">
          <div className="text-2xl font-bold text-white">{stats?.totalProjects || 0}</div>
          <div className="text-white/60 text-sm">Projects</div>
        </div>
        <div className="glass-card text-center">
          <div className="text-2xl font-bold text-white">{stats?.totalNFTs || 0}</div>
          <div className="text-white/60 text-sm">NFTs</div>
        </div>
        <div className="glass-card text-center">
          <div className="text-2xl font-bold text-green-400">{stats?.totalReturns || 0}</div>
          <div className="text-white/60 text-sm">Returns (XLM)</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="glass-card">
        <div className="flex space-x-1 p-1 bg-white/5 rounded-lg mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
                  activeTab === tab.id ? "bg-blue-500 text-white" : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Account Overview</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-white/80">Member Since</span>
                    <span className="text-white">{profile?.memberSince || "Recently"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Total Invested</span>
                    <span className="text-white">{stats?.totalInvested || 0} XLM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Projects Created</span>
                    <span className="text-white">{stats?.totalProjects || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Success Rate</span>
                    <span className="text-green-400">{stats?.successRate || 0}%</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-white/80">Active Investments</span>
                    <span className="text-white">{stats?.activeInvestments || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Completed Projects</span>
                    <span className="text-white">{stats?.completedProjects || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">NFTs Earned</span>
                    <span className="text-white">{stats?.totalNFTs || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Reputation Score</span>
                    <span className="text-blue-400">{stats?.reputationScore || 0}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {profile?.recentActivity?.map((activity: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 glass bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <div className="text-white font-medium">{activity.action}</div>
                        <div className="text-white/60 text-sm">{activity.timestamp}</div>
                      </div>
                    </div>
                    <div className="text-white font-semibold">{activity.amount}</div>
                  </div>
                )) || <div className="text-center py-8 text-white/60">No recent activity</div>}
              </div>
            </div>
          </div>
        )}

        {activeTab === "wallet" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Wallet Information</h3>
              <div className="space-y-4">
                <div className="glass bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white/80 text-sm">Wallet Address</div>
                      <div className="text-white font-mono">{address}</div>
                    </div>
                    <button onClick={copyAddress} className="btn-secondary flex items-center space-x-2">
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </button>
                  </div>
                </div>

                <div className="glass bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white/80 text-sm">XLM Balance</div>
                      <div className="text-white text-2xl font-bold">{balance || "0"} XLM</div>
                    </div>
                    <a
                      href={`https://stellar.expert/explorer/testnet/account/${address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary flex items-center space-x-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>View on Explorer</span>
                    </a>
                  </div>
                </div>

                <div className="glass bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white/80 text-sm">Network</div>
                      <div className="text-white">Stellar Testnet</div>
                    </div>
                    <div className="px-2 py-1 bg-green-500/20 text-green-400 text-sm rounded">Connected</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Transaction History</h3>
              <div className="space-y-3">
                {profile?.transactions?.map((tx: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 glass bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          tx.type === "investment"
                            ? "bg-blue-500/20"
                            : tx.type === "return"
                              ? "bg-green-500/20"
                              : "bg-purple-500/20"
                        }`}
                      >
                        <TrendingUp
                          className={`w-4 h-4 ${
                            tx.type === "investment"
                              ? "text-blue-400"
                              : tx.type === "return"
                                ? "text-green-400"
                                : "text-purple-400"
                          }`}
                        />
                      </div>
                      <div>
                        <div className="text-white font-medium">{tx.description}</div>
                        <div className="text-white/60 text-sm">{tx.timestamp}</div>
                      </div>
                    </div>
                    <div className={`font-semibold ${tx.type === "return" ? "text-green-400" : "text-white"}`}>
                      {tx.type === "return" ? "+" : "-"}
                      {tx.amount} XLM
                    </div>
                  </div>
                )) || <div className="text-center py-8 text-white/60">No transaction history</div>}
              </div>
            </div>
          </div>
        )}

        {activeTab === "achievements" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Achievement NFTs</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {profile?.achievements?.map((achievement: any, index: number) => (
                  <div key={index} className="glass bg-white/5 rounded-lg p-4 text-center">
                    <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Award className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-white font-semibold mb-1">{achievement.name}</h4>
                    <p className="text-white/60 text-sm mb-2">{achievement.description}</p>
                    <div className="text-xs text-white/50">{achievement.earnedDate}</div>
                  </div>
                )) || (
                  <div className="col-span-full text-center py-8 text-white/60">
                    No achievements yet. Start participating to earn NFTs!
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Available Achievements</h3>
              <div className="space-y-3">
                {[
                  {
                    name: "Welcome Badge",
                    description: "Connect your wallet",
                    requirement: "Connect Freighter wallet",
                  },
                  { name: "Creator Badge", description: "Submit your first project", requirement: "Submit 1 project" },
                  {
                    name: "Investor Bronze",
                    description: "Invest less than 1,000 XLM",
                    requirement: "Invest < 1,000 XLM",
                  },
                  {
                    name: "Investor Silver",
                    description: "Invest 1,000-10,000 XLM",
                    requirement: "Invest 1,000-10,000 XLM",
                  },
                  {
                    name: "Investor Gold",
                    description: "Invest more than 10,000 XLM",
                    requirement: "Invest > 10,000 XLM",
                  },
                  {
                    name: "Early Supporter",
                    description: "Be among first 10 investors",
                    requirement: "Invest early in projects",
                  },
                ].map((achievement, index) => (
                  <div key={index} className="flex items-center justify-between p-3 glass bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-500/20 rounded-full flex items-center justify-center">
                        <Award className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <div className="text-white font-medium">{achievement.name}</div>
                        <div className="text-white/60 text-sm">{achievement.description}</div>
                      </div>
                    </div>
                    <div className="text-white/60 text-sm">{achievement.requirement}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Account Settings</h3>
              <div className="space-y-4">
                <div className="glass bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">Wallet Connection</div>
                      <div className="text-white/60 text-sm">Manage your Freighter wallet connection</div>
                    </div>
                    <button onClick={disconnectWallet} className="btn-secondary text-red-400 hover:bg-red-500/20">
                      Disconnect
                    </button>
                  </div>
                </div>

                <div className="glass bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">Network</div>
                      <div className="text-white/60 text-sm">Currently connected to Stellar Testnet</div>
                    </div>
                    <div className="px-2 py-1 bg-blue-500/20 text-blue-400 text-sm rounded">Testnet</div>
                  </div>
                </div>

                <div className="glass bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">Notifications</div>
                      <div className="text-white/60 text-sm">Receive updates about your investments</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Privacy & Security</h3>
              <div className="space-y-4">
                <div className="glass bg-white/5 rounded-lg p-4">
                  <div className="text-white font-medium mb-2">Data Privacy</div>
                  <p className="text-white/60 text-sm mb-3">
                    Your wallet address and transaction data are stored on the Stellar blockchain. Personal information
                    is not collected or stored by this application.
                  </p>
                </div>

                <div className="glass bg-white/5 rounded-lg p-4">
                  <div className="text-white font-medium mb-2">Smart Contract Security</div>
                  <p className="text-white/60 text-sm mb-3">
                    All investments are secured by audited smart contracts on Stellar Soroban. Your funds are protected
                    by cryptographic security.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
