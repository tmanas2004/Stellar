"use client"

import { useParams, Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft, ExternalLink, Github, Globe, DollarSign, TrendingUp, Clock, Users, Calendar } from "lucide-react"
import { getProject } from "../services/api"

const ProjectDetail = () => {
  const { id } = useParams()
  const { data: project, isLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: () => getProject(id!),
  })

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
        <p className="text-white/80">The project you're looking for doesn't exist.</p>
        <Link to="/projects" className="btn-primary">
          Back to Projects
        </Link>
      </div>
    )
  }

  const progressPercentage = (project.totalRaised / project.fundingGoal) * 100
  const daysRemaining = Math.ceil((project.createdAt + project.loanTerm - Date.now() / 1000) / (24 * 60 * 60))

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Link to="/projects" className="inline-flex items-center space-x-2 text-white/80 hover:text-white">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Projects</span>
      </Link>

      {/* Project Header */}
      <div className="glass-card">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-bold text-white">{project.title}</h1>
              <span
                className={`px-3 py-1 text-sm rounded-full ${
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

            <p className="text-white/80 text-lg max-w-3xl">{project.description}</p>

            <div className="flex flex-wrap gap-4">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Globe className="w-4 h-4" />
                  <span>Live Demo</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          <div className="flex-shrink-0">
            <Link to={`/invest/${project.id}`} className="btn-primary text-lg px-8 py-3 block text-center">
              Invest Now
            </Link>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Funding Progress */}
          <div className="glass-card">
            <h2 className="text-2xl font-semibold text-white mb-6">Funding Progress</h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white/80">Progress</span>
                <span className="text-white font-semibold">{progressPercentage.toFixed(1)}%</span>
              </div>

              <div className="w-full bg-white/10 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                ></div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-white">{project.totalRaised.toLocaleString()}</div>
                  <div className="text-white/60 text-sm">Raised (XLM)</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-white">{project.fundingGoal.toLocaleString()}</div>
                  <div className="text-white/60 text-sm">Goal (XLM)</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-green-400">{(project.interestRate / 100).toFixed(1)}%</div>
                  <div className="text-white/60 text-sm">APY</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-white">{daysRemaining}</div>
                  <div className="text-white/60 text-sm">Days Left</div>
                </div>
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="glass-card">
            <h2 className="text-2xl font-semibold text-white mb-6">Project Details</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">About</h3>
                <p className="text-white/80">{project.description}</p>
              </div>

              {project.techStack && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Technology Stack</h3>
                  <p className="text-white/80">{project.techStack}</p>
                </div>
              )}

              {project.roadmap && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Roadmap</h3>
                  <p className="text-white/80">{project.roadmap}</p>
                </div>
              )}

              {project.useOfFunds && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Use of Funds</h3>
                  <p className="text-white/80">{project.useOfFunds}</p>
                </div>
              )}
            </div>
          </div>

          {/* Team Information */}
          {project.teamMembers && (
            <div className="glass-card">
              <h2 className="text-2xl font-semibold text-white mb-6">Team</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Team Members</h3>
                  <p className="text-white/80">{project.teamMembers}</p>
                </div>
                {project.experience && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Experience</h3>
                    <p className="text-white/80">{project.experience}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Investment Summary */}
          <div className="glass-card">
            <h3 className="text-xl font-semibold text-white mb-4">Investment Details</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-white/60" />
                  <span className="text-white/80">Min Investment</span>
                </div>
                <span className="text-white font-semibold">{project.minInvestment || 100} XLM</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-white/60" />
                  <span className="text-white/80">APY</span>
                </div>
                <span className="text-green-400 font-semibold">{(project.interestRate / 100).toFixed(1)}%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-white/60" />
                  <span className="text-white/80">Term</span>
                </div>
                <span className="text-white font-semibold">{Math.ceil(project.loanTerm / (24 * 60 * 60))} days</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-white/60" />
                  <span className="text-white/80">Time Left</span>
                </div>
                <span className="text-white font-semibold">{daysRemaining} days</span>
              </div>
            </div>

            <Link to={`/invest/${project.id}`} className="w-full btn-primary mt-6 text-center block">
              Start Investing
            </Link>
          </div>

          {/* SCF Information */}
          <div className="glass-card">
            <h3 className="text-xl font-semibold text-white mb-4">SCF Status</h3>

            <div className="space-y-3">
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

              {project.scfAmount && (
                <div className="flex justify-between">
                  <span className="text-white/80">SCF Amount</span>
                  <span className="text-white">{project.scfAmount} XLM</span>
                </div>
              )}
            </div>
          </div>

          {/* Creator Info */}
          <div className="glass-card">
            <h3 className="text-xl font-semibold text-white mb-4">Creator</h3>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">{project.creator?.slice(0, 2).toUpperCase()}</span>
                </div>
                <div>
                  <div className="text-white font-medium">
                    {project.creator?.slice(0, 6)}...{project.creator?.slice(-4)}
                  </div>
                  <div className="text-white/60 text-sm">Project Creator</div>
                </div>
              </div>

              {project.teamSize && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-white/60" />
                    <span className="text-white/80">Team Size</span>
                  </div>
                  <span className="text-white">{project.teamSize}</span>
                </div>
              )}
            </div>
          </div>

          {/* Risk Information */}
          {project.risks && (
            <div className="glass-card">
              <h3 className="text-xl font-semibold text-white mb-4">Risk Assessment</h3>
              <p className="text-white/80 text-sm">{project.risks}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProjectDetail
