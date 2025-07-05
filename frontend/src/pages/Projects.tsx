"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Search, Filter, TrendingUp, Clock, DollarSign } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { getAllProjects } from "../services/api"

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: getAllProjects,
  })

  const filteredProjects =
    projects?.filter((project: any) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilter = filterStatus === "all" || project.status.toLowerCase() === filterStatus
      return matchesSearch && matchesFilter
    }) || []

  const sortedProjects = [...filteredProjects].sort((a: any, b: any) => {
    switch (sortBy) {
      case "newest":
        return b.createdAt - a.createdAt
      case "funding":
        return b.fundingGoal - a.fundingGoal
      case "apy":
        return b.interestRate - a.interestRate
      default:
        return 0
    }
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">Explore Projects</h1>
        <p className="text-xl text-white/80">Discover and invest in innovative Stellar Community Fund projects</p>
      </div>

      {/* Filters */}
      <div className="glass-card">
        <div className="grid md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 input-glass rounded-lg"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2 input-glass rounded-lg appearance-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="funded">Funded</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Sort */}
          <div className="relative">
            <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full pl-10 pr-4 py-2 input-glass rounded-lg appearance-none"
            >
              <option value="newest">Newest First</option>
              <option value="funding">Highest Funding</option>
              <option value="apy">Highest APY</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedProjects.map((project: any) => (
          <div key={project.id} className="glass-card space-y-4 hover:bg-white/15 transition-all duration-300">
            {/* Project Header */}
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-semibold text-white line-clamp-2">{project.title}</h3>
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

            {/* Description */}
            <p className="text-white/70 text-sm line-clamp-3">{project.description}</p>

            {/* SCF Status */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-white/60">SCF Status:</span>
              <span className="px-2 py-1 bg-stellar-500/20 text-stellar-400 text-xs rounded">{project.scfStatus}</span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <div className="flex items-center space-x-1 text-white/60">
                  <DollarSign className="w-4 h-4" />
                  <span>Funding Goal</span>
                </div>
                <div className="text-white font-semibold">{project.fundingGoal.toLocaleString()} XLM</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-1 text-white/60">
                  <TrendingUp className="w-4 h-4" />
                  <span>APY</span>
                </div>
                <div className="text-green-400 font-semibold">{(project.interestRate / 100).toFixed(1)}%</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Progress</span>
                <span className="text-white">{((project.totalRaised / project.fundingGoal) * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((project.totalRaised / project.fundingGoal) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="text-xs text-white/60">
                {project.totalRaised.toLocaleString()} / {project.fundingGoal.toLocaleString()} XLM raised
              </div>
            </div>

            {/* Time Remaining */}
            <div className="flex items-center space-x-2 text-sm text-white/60">
              <Clock className="w-4 h-4" />
              <span>
                {Math.ceil((project.createdAt + project.loanTerm - Date.now() / 1000) / (24 * 60 * 60))} days remaining
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <Link to={`/projects/${project.id}`} className="flex-1 btn-secondary text-center text-sm py-2">
                View Details
              </Link>
              <Link to={`/invest/${project.id}`} className="flex-1 btn-primary text-center text-sm py-2">
                Invest Now
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {sortedProjects.length === 0 && (
        <div className="text-center py-12 space-y-4">
          <div className="text-6xl">🔍</div>
          <h3 className="text-xl font-semibold text-white">No projects found</h3>
          <p className="text-white/60">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  )
}

export default Projects
