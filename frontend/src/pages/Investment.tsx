"use client"

import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft, DollarSign, TrendingUp, Calendar, Shield, Calculator, AlertTriangle } from "lucide-react"
import { useWalletStore } from "../stores/walletStore"
import { getProject, investInProject } from "../services/api"
import toast from "react-hot-toast"

const Investment = () => {
  const { id } = useParams()
  const { isConnected, address } = useWalletStore()
  const [investmentAmount, setInvestmentAmount] = useState("")
  const [isInvesting, setIsInvesting] = useState(false)

  const { data: project, isLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: () => getProject(id!),
  })

  const calculateReturns = () => {
    if (!investmentAmount || !project) return { principal: 0, interest: 0, total: 0 }

    const principal = Number.parseFloat(investmentAmount)
    const annualRate = project.interestRate / 10000 // Convert basis points to decimal
    const termInYears = project.loanTerm / (365 * 24 * 60 * 60)
    const interest = principal * annualRate * termInYears

    return {
      principal,
      interest,
      total: principal + interest,
    }
  }

  const handleInvest = async () => {
    if (!isConnected || !address) {
      toast.error("Please connect your wallet first")
      return
    }

    if (!investmentAmount || Number.parseFloat(investmentAmount) <= 0) {
      toast.error("Please enter a valid investment amount")
      return
    }

    const minInvestment = project?.minInvestment || 100
    if (Number.parseFloat(investmentAmount) < minInvestment) {
      toast.error(`Minimum investment is ${minInvestment} XLM`)
      return
    }

    setIsInvesting(true)
    try {
      await investInProject(id!, {
        investor: address,
        amount: Number.parseFloat(investmentAmount),
      })

      toast.success("Investment successful!")
      // Redirect to dashboard or show success state
    } catch (error) {
      console.error("Investment failed:", error)
      toast.error("Investment failed. Please try again.")
    } finally {
      setIsInvesting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="text-center py-20 space-y-6">
        <div className="text-6xl">❌</div>
        <h2 className="text-2xl font-bold text-white">Project Not Found</h2>
        <Link to="/projects" className="btn-primary">
          Back to Projects
        </Link>
      </div>
    )
  }

  const returns = calculateReturns()
  const progressPercentage = (project.totalRaised / project.fundingGoal) * 100
  const remainingAmount = project.fundingGoal - project.totalRaised

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back Button */}
      <Link to={`/projects/${id}`} className="inline-flex items-center space-x-2 text-white/80 hover:text-white">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Project</span>
      </Link>

      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">Invest in {project.title}</h1>
        <p className="text-xl text-white/80">Support innovation while earning competitive returns</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Investment Form */}
        <div className="space-y-6">
          <div className="glass-card">
            <h2 className="text-2xl font-semibold text-white mb-6">Investment Details</h2>

            <div className="space-y-6">
              {/* Investment Amount */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Investment Amount (XLM)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                  <input
                    type="number"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 input-glass rounded-lg text-lg"
                    placeholder="0"
                    min={project.minInvestment || 100}
                    max={remainingAmount}
                  />
                </div>
                <div className="flex justify-between text-sm text-white/60 mt-2">
                  <span>Min: {project.minInvestment || 100} XLM</span>
                  <span>Available: {remainingAmount.toLocaleString()} XLM</span>
                </div>
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-4 gap-2">
                {[100, 500, 1000, 5000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setInvestmentAmount(amount.toString())}
                    className="btn-secondary text-sm py-2"
                    disabled={amount > remainingAmount}
                  >
                    {amount}
                  </button>
                ))}
              </div>

              {/* Investment Summary */}
              {investmentAmount && Number.parseFloat(investmentAmount) > 0 && (
                <div className="glass bg-blue-500/10 border-blue-500/30 rounded-lg p-4 space-y-3">
                  <div className="flex items-center space-x-2 text-blue-400">
                    <Calculator className="w-4 h-4" />
                    <span className="font-semibold">Investment Summary</span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/80">Principal</span>
                      <span className="text-white font-semibold">{returns.principal.toLocaleString()} XLM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/80">Expected Interest</span>
                      <span className="text-green-400 font-semibold">+{returns.interest.toLocaleString()} XLM</span>
                    </div>
                    <div className="border-t border-white/20 pt-2">
                      <div className="flex justify-between">
                        <span className="text-white font-semibold">Total Return</span>
                        <span className="text-white font-bold text-lg">{returns.total.toLocaleString()} XLM</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Invest Button */}
              <button
                onClick={handleInvest}
                disabled={!isConnected || !investmentAmount || Number.parseFloat(investmentAmount) <= 0 || isInvesting}
                className="w-full btn-primary text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isInvesting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Processing Investment...</span>
                  </div>
                ) : !isConnected ? (
                  "Connect Wallet to Invest"
                ) : (
                  "Confirm Investment"
                )}
              </button>
            </div>
          </div>

          {/* Risk Warning */}
          <div className="glass bg-yellow-500/10 border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h3 className="text-yellow-400 font-semibold">Investment Risk Warning</h3>
                <p className="text-white/80 text-sm">
                  All investments carry risk. Please ensure you understand the project details, team background, and
                  potential risks before investing. Only invest what you can afford to lose.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Project Summary */}
        <div className="space-y-6">
          {/* Project Info */}
          <div className="glass-card">
            <h3 className="text-xl font-semibold text-white mb-4">Project Overview</h3>

            <div className="space-y-4">
              <div>
                <h4 className="text-white font-medium mb-2">{project.title}</h4>
                <p className="text-white/80 text-sm">{project.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <div className="flex items-center space-x-1 text-white/60">
                    <TrendingUp className="w-4 h-4" />
                    <span>APY</span>
                  </div>
                  <div className="text-green-400 font-semibold text-lg">{(project.interestRate / 100).toFixed(1)}%</div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-1 text-white/60">
                    <Calendar className="w-4 h-4" />
                    <span>Term</span>
                  </div>
                  <div className="text-white font-semibold text-lg">
                    {Math.ceil(project.loanTerm / (24 * 60 * 60))} days
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Funding Progress */}
          <div className="glass-card">
            <h3 className="text-xl font-semibold text-white mb-4">Funding Progress</h3>

            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-white/80">Progress</span>
                <span className="text-white font-semibold">{progressPercentage.toFixed(1)}%</span>
              </div>

              <div className="w-full bg-white/10 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                ></div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-white/60">Raised</div>
                  <div className="text-white font-semibold">{project.totalRaised.toLocaleString()} XLM</div>
                </div>
                <div>
                  <div className="text-white/60">Goal</div>
                  <div className="text-white font-semibold">{project.fundingGoal.toLocaleString()} XLM</div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Features */}
          <div className="glass-card">
            <h3 className="text-xl font-semibold text-white mb-4">Security & Trust</h3>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-green-400" />
                <div>
                  <div className="text-white font-medium">Smart Contract Security</div>
                  <div className="text-white/60 text-sm">Funds secured by audited smart contracts</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="text-white font-medium">SCF Backed</div>
                  <div className="text-white/60 text-sm">Stellar Community Fund verified project</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-purple-400" />
                <div>
                  <div className="text-white font-medium">Transparent Terms</div>
                  <div className="text-white/60 text-sm">Clear lending terms and conditions</div>
                </div>
              </div>
            </div>
          </div>

          {/* SCF Status */}
          <div className="glass-card">
            <h3 className="text-xl font-semibold text-white mb-4">SCF Information</h3>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-white/80">Status</span>
                <span className="px-2 py-1 bg-stellar-500/20 text-stellar-400 text-sm rounded">
                  {project.scfStatus}
                </span>
              </div>

              {project.scfRound && (
                <div className="flex justify-between">
                  <span className="text-white/80">Round</span>
                  <span className="text-white">{project.scfRound}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Investment
