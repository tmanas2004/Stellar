import { Link } from "react-router-dom"
import { ArrowRight, TrendingUp, Shield, Zap, Users, DollarSign, Target } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { getPlatformStats, getFeaturedProjects } from "../services/api"

const Home = () => {
  const { data: stats } = useQuery({
    queryKey: ["platform-stats"],
    queryFn: getPlatformStats,
  })

  const { data: featuredProjects } = useQuery({
    queryKey: ["featured-projects"],
    queryFn: getFeaturedProjects,
  })

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Lending",
      description: "Isolated lending pools with smart contract security and transparent terms.",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Instant Deployment",
      description: "Deploy your SCF project with automated pool creation and NFT rewards.",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Competitive Returns",
      description: "Earn attractive yields while supporting innovative Stellar ecosystem projects.",
    },
  ]

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="text-center space-y-8 py-20">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Blend SCF Launchpad
          </h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">
            Fund Stellar Community Fund projects through decentralized lending pools. Earn yields while supporting
            innovation.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/projects" className="btn-primary text-lg px-8 py-3 flex items-center space-x-2">
            <span>Explore Projects</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/submit" className="btn-secondary text-lg px-8 py-3">
            Submit Your Project
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      {stats && (
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="glass-card text-center">
            <div className="flex items-center justify-center mb-2">
              <Target className="w-8 h-8 text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-white">{stats.totalProjects}</div>
            <div className="text-white/60">Total Projects</div>
          </div>
          <div className="glass-card text-center">
            <div className="flex items-center justify-center mb-2">
              <DollarSign className="w-8 h-8 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-white">{stats.totalFunded} XLM</div>
            <div className="text-white/60">Total Funded</div>
          </div>
          <div className="glass-card text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-8 h-8 text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-white">{stats.activeProjects}</div>
            <div className="text-white/60">Active Projects</div>
          </div>
          <div className="glass-card text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="w-8 h-8 text-pink-400" />
            </div>
            <div className="text-3xl font-bold text-white">{stats.totalInvestors}</div>
            <div className="text-white/60">Total Investors</div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-white">Why Choose Blend SCF?</h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            The first decentralized launchpad specifically designed for Stellar Community Fund projects
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="glass-card text-center space-y-4 hover:bg-white/15 transition-all duration-300">
              <div className="flex justify-center text-blue-400">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
              <p className="text-white/70">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Projects */}
      {featuredProjects && featuredProjects.length > 0 && (
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-white">Featured Projects</h2>
            <p className="text-xl text-white/80">Discover innovative projects backed by the Stellar Community Fund</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.slice(0, 3).map((project: any) => (
              <div key={project.id} className="glass-card space-y-4 hover:bg-white/15 transition-all duration-300">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                    {project.scfStatus}
                  </span>
                </div>
                <p className="text-white/70 text-sm line-clamp-3">{project.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Funding Goal</span>
                    <span className="text-white">{project.fundingGoal} XLM</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">APY</span>
                    <span className="text-green-400">{project.interestRate / 100}%</span>
                  </div>
                </div>
                <Link to={`/projects/${project.id}`} className="block w-full btn-primary text-center">
                  View Details
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/projects" className="btn-secondary">
              View All Projects
            </Link>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="glass-card text-center space-y-6 py-12">
        <h2 className="text-3xl font-bold text-white">Ready to Get Started?</h2>
        <p className="text-xl text-white/80 max-w-2xl mx-auto">
          Join the future of decentralized project funding on Stellar. Whether you're a creator or investor, there's a
          place for you.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/submit" className="btn-primary text-lg px-8 py-3">
            Launch Your Project
          </Link>
          <Link to="/projects" className="btn-secondary text-lg px-8 py-3">
            Start Investing
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
