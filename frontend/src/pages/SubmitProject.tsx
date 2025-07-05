"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronLeft, ChevronRight, Upload, Github, Globe, DollarSign, Percent, Calendar } from "lucide-react"
import { useWalletStore } from "../stores/walletStore"
import { createProject } from "../services/api"
import toast from "react-hot-toast"

const SubmitProject = () => {
  const navigate = useNavigate()
  const { isConnected, address } = useWalletStore()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    // Basic Info
    title: "",
    description: "",
    category: "",
    tags: "",

    // Technical Details
    githubUrl: "",
    liveUrl: "",
    documentation: "",
    techStack: "",

    // SCF Information
    scfStatus: "applied",
    scfRound: "",
    scfAmount: "",

    // Pool Configuration
    fundingGoal: "",
    interestRate: "",
    loanTerm: "90", // days
    minInvestment: "100",

    // Team Information
    teamSize: "",
    teamMembers: "",
    experience: "",

    // Additional
    roadmap: "",
    risks: "",
    useOfFunds: "",
  })

  const steps = [
    { id: 1, title: "Basic Info", description: "Project overview and description" },
    { id: 2, title: "Technical", description: "GitHub, demo, and tech details" },
    { id: 3, title: "SCF Status", description: "Community Fund information" },
    { id: 4, title: "Pool Config", description: "Lending pool parameters" },
    { id: 5, title: "Team", description: "Team information and experience" },
    { id: 6, title: "Review", description: "Review and submit" },
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    if (!isConnected || !address) {
      toast.error("Please connect your wallet first")
      return
    }

    setIsSubmitting(true)
    try {
      await createProject({
        ...formData,
        creator: address,
        fundingGoal: Number.parseInt(formData.fundingGoal),
        interestRate: Number.parseInt(formData.interestRate) * 100, // Convert to basis points
        loanTerm: Number.parseInt(formData.loanTerm) * 24 * 60 * 60, // Convert days to seconds
      })

      toast.success("Project submitted successfully!")
      navigate("/dashboard")
    } catch (error) {
      console.error("Failed to submit project:", error)
      toast.error("Failed to submit project. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-white">Basic Information</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Project Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full px-4 py-3 input-glass rounded-lg"
                  placeholder="Enter your project title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 input-glass rounded-lg resize-none"
                  placeholder="Describe your project, its goals, and impact"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange("category", e.target.value)}
                    className="w-full px-4 py-3 input-glass rounded-lg"
                  >
                    <option value="">Select category</option>
                    <option value="defi">DeFi</option>
                    <option value="infrastructure">Infrastructure</option>
                    <option value="tools">Developer Tools</option>
                    <option value="education">Education</option>
                    <option value="gaming">Gaming</option>
                    <option value="nft">NFT/Digital Assets</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Tags</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => handleInputChange("tags", e.target.value)}
                    className="w-full px-4 py-3 input-glass rounded-lg"
                    placeholder="e.g., stellar, defi, payments"
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-white">Technical Details</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  <Github className="inline w-4 h-4 mr-2" />
                  GitHub Repository *
                </label>
                <input
                  type="url"
                  value={formData.githubUrl}
                  onChange={(e) => handleInputChange("githubUrl", e.target.value)}
                  className="w-full px-4 py-3 input-glass rounded-lg"
                  placeholder="https://github.com/username/repository"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  <Globe className="inline w-4 h-4 mr-2" />
                  Live Demo URL
                </label>
                <input
                  type="url"
                  value={formData.liveUrl}
                  onChange={(e) => handleInputChange("liveUrl", e.target.value)}
                  className="w-full px-4 py-3 input-glass rounded-lg"
                  placeholder="https://your-project-demo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Documentation URL</label>
                <input
                  type="url"
                  value={formData.documentation}
                  onChange={(e) => handleInputChange("documentation", e.target.value)}
                  className="w-full px-4 py-3 input-glass rounded-lg"
                  placeholder="https://docs.your-project.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Tech Stack</label>
                <textarea
                  value={formData.techStack}
                  onChange={(e) => handleInputChange("techStack", e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 input-glass rounded-lg resize-none"
                  placeholder="List the technologies, frameworks, and tools used"
                />
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-white">SCF Information</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">SCF Application Status *</label>
                <select
                  value={formData.scfStatus}
                  onChange={(e) => handleInputChange("scfStatus", e.target.value)}
                  className="w-full px-4 py-3 input-glass rounded-lg"
                  required
                >
                  <option value="applied">Applied</option>
                  <option value="approved">Approved</option>
                  <option value="funded">Funded</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">SCF Round</label>
                  <input
                    type="text"
                    value={formData.scfRound}
                    onChange={(e) => handleInputChange("scfRound", e.target.value)}
                    className="w-full px-4 py-3 input-glass rounded-lg"
                    placeholder="e.g., Round 15"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">SCF Amount (XLM)</label>
                  <input
                    type="number"
                    value={formData.scfAmount}
                    onChange={(e) => handleInputChange("scfAmount", e.target.value)}
                    className="w-full px-4 py-3 input-glass rounded-lg"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-white">Pool Configuration</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  <DollarSign className="inline w-4 h-4 mr-2" />
                  Funding Goal (XLM) *
                </label>
                <input
                  type="number"
                  value={formData.fundingGoal}
                  onChange={(e) => handleInputChange("fundingGoal", e.target.value)}
                  className="w-full px-4 py-3 input-glass rounded-lg"
                  placeholder="10000"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    <Percent className="inline w-4 h-4 mr-2" />
                    Interest Rate (APY %) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.interestRate}
                    onChange={(e) => handleInputChange("interestRate", e.target.value)}
                    className="w-full px-4 py-3 input-glass rounded-lg"
                    placeholder="8.5"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    <Calendar className="inline w-4 h-4 mr-2" />
                    Loan Term (Days) *
                  </label>
                  <select
                    value={formData.loanTerm}
                    onChange={(e) => handleInputChange("loanTerm", e.target.value)}
                    className="w-full px-4 py-3 input-glass rounded-lg"
                    required
                  >
                    <option value="30">30 Days</option>
                    <option value="60">60 Days</option>
                    <option value="90">90 Days</option>
                    <option value="180">180 Days</option>
                    <option value="365">1 Year</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Minimum Investment (XLM)</label>
                <input
                  type="number"
                  value={formData.minInvestment}
                  onChange={(e) => handleInputChange("minInvestment", e.target.value)}
                  className="w-full px-4 py-3 input-glass rounded-lg"
                  placeholder="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Use of Funds</label>
                <textarea
                  value={formData.useOfFunds}
                  onChange={(e) => handleInputChange("useOfFunds", e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 input-glass rounded-lg resize-none"
                  placeholder="Explain how the funds will be used"
                />
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-white">Team Information</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Team Size</label>
                <select
                  value={formData.teamSize}
                  onChange={(e) => handleInputChange("teamSize", e.target.value)}
                  className="w-full px-4 py-3 input-glass rounded-lg"
                >
                  <option value="">Select team size</option>
                  <option value="1">Solo (1 person)</option>
                  <option value="2-5">Small team (2-5 people)</option>
                  <option value="6-10">Medium team (6-10 people)</option>
                  <option value="10+">Large team (10+ people)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Team Members</label>
                <textarea
                  value={formData.teamMembers}
                  onChange={(e) => handleInputChange("teamMembers", e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 input-glass rounded-lg resize-none"
                  placeholder="List team members and their roles"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Team Experience</label>
                <textarea
                  value={formData.experience}
                  onChange={(e) => handleInputChange("experience", e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 input-glass rounded-lg resize-none"
                  placeholder="Describe relevant experience and past projects"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Project Roadmap</label>
                <textarea
                  value={formData.roadmap}
                  onChange={(e) => handleInputChange("roadmap", e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 input-glass rounded-lg resize-none"
                  placeholder="Outline your project milestones and timeline"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Risks and Mitigation</label>
                <textarea
                  value={formData.risks}
                  onChange={(e) => handleInputChange("risks", e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 input-glass rounded-lg resize-none"
                  placeholder="Identify potential risks and how you plan to address them"
                />
              </div>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-white">Review & Submit</h3>

            <div className="space-y-6">
              {/* Basic Info Summary */}
              <div className="glass-card">
                <h4 className="text-lg font-semibold text-white mb-4">Basic Information</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-white/60">Title:</span> <span className="text-white">{formData.title}</span>
                  </div>
                  <div>
                    <span className="text-white/60">Category:</span>{" "}
                    <span className="text-white">{formData.category}</span>
                  </div>
                  <div>
                    <span className="text-white/60">Description:</span>{" "}
                    <span className="text-white">{formData.description.slice(0, 100)}...</span>
                  </div>
                </div>
              </div>

              {/* Technical Summary */}
              <div className="glass-card">
                <h4 className="text-lg font-semibold text-white mb-4">Technical Details</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-white/60">GitHub:</span>{" "}
                    <span className="text-white">{formData.githubUrl}</span>
                  </div>
                  <div>
                    <span className="text-white/60">Live Demo:</span>{" "}
                    <span className="text-white">{formData.liveUrl || "Not provided"}</span>
                  </div>
                </div>
              </div>

              {/* Pool Configuration Summary */}
              <div className="glass-card">
                <h4 className="text-lg font-semibold text-white mb-4">Pool Configuration</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-white/60">Funding Goal:</span>{" "}
                    <span className="text-white">{formData.fundingGoal} XLM</span>
                  </div>
                  <div>
                    <span className="text-white/60">Interest Rate:</span>{" "}
                    <span className="text-white">{formData.interestRate}% APY</span>
                  </div>
                  <div>
                    <span className="text-white/60">Loan Term:</span>{" "}
                    <span className="text-white">{formData.loanTerm} days</span>
                  </div>
                  <div>
                    <span className="text-white/60">Min Investment:</span>{" "}
                    <span className="text-white">{formData.minInvestment} XLM</span>
                  </div>
                </div>
              </div>

              {/* SCF Status Summary */}
              <div className="glass-card">
                <h4 className="text-lg font-semibold text-white mb-4">SCF Information</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-white/60">Status:</span>{" "}
                    <span className="text-white">{formData.scfStatus}</span>
                  </div>
                  <div>
                    <span className="text-white/60">Round:</span>{" "}
                    <span className="text-white">{formData.scfRound || "Not specified"}</span>
                  </div>
                  <div>
                    <span className="text-white/60">Amount:</span>{" "}
                    <span className="text-white">{formData.scfAmount || "Not specified"} XLM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (!isConnected) {
    return (
      <div className="text-center py-20 space-y-6">
        <div className="text-6xl">🔒</div>
        <h2 className="text-2xl font-bold text-white">Wallet Connection Required</h2>
        <p className="text-white/80">Please connect your Freighter wallet to submit a project.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">Submit Your Project</h1>
        <p className="text-xl text-white/80">Launch your SCF project with automated lending pool creation</p>
      </div>

      {/* Progress Steps */}
      <div className="glass-card">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id ? "bg-blue-500 border-blue-500 text-white" : "border-white/30 text-white/60"
                }`}
              >
                {step.id}
              </div>
              <div className="ml-3 hidden md:block">
                <div className={`text-sm font-medium ${currentStep >= step.id ? "text-white" : "text-white/60"}`}>
                  {step.title}
                </div>
                <div className="text-xs text-white/40">{step.description}</div>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 h-0.5 mx-4 ${currentStep > step.id ? "bg-blue-500" : "bg-white/20"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="glass-card min-h-[500px]">{renderStepContent()}</div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="btn-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        {currentStep < steps.length ? (
          <button onClick={handleNext} className="btn-primary flex items-center space-x-2">
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Submit Project</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

export default SubmitProject
