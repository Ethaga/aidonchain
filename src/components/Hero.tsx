import React from 'react';
import { Shield, Zap, Users, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react';

interface HeroProps {
  onGetStarted: () => void;
}

export function Hero({ onGetStarted }: HeroProps) {
  const features = [
    {
      icon: Shield,
      title: 'Full Transparency',
      description: 'Every transaction verified publicly in real-time on VeChain blockchain'
    },
    {
      icon: Zap,
      title: 'Immutable Records',
      description: 'Data cannot be changed or manipulated - guaranteed by blockchain technology'
    },
    {
      icon: Users,
      title: 'Trustless System',
      description: 'Trust built through code, not institutions - completely decentralized'
    },
    {
      icon: TrendingUp,
      title: 'AI-Powered Analytics',
      description: 'Smart anomaly detection and optimized distribution recommendations'
    }
  ];

  const stats = [
    { label: 'Total Donations', value: '$2.4M', change: '+23%' },
    { label: 'Recipients Helped', value: '12,847', change: '+18%' },
    { label: 'Validators Active', value: '1,256', change: '+31%' },
    { label: 'Transparency Score', value: '100%', change: 'Perfect' }
  ];

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-full mb-8">
              <CheckCircle className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-800">100% On-Chain • VeChain Powered</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Social Aid Distribution
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
                Reimagined with Blockchain
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              OnChainAid ensures complete transparency in social aid distribution through 
              100% on-chain operations on VeChain blockchain, powered by AI analytics and 
              community validation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={onGetStarted}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:border-gray-400 transition-colors">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
                <div className="text-xs text-green-600 font-medium">
                  {stat.change}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Blockchain for Social Aid?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Only blockchain can guarantee the level of transparency and trust needed 
              for social aid distribution at scale.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300"
              >
                <div className="bg-gradient-to-r from-blue-50 to-green-50 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="h-7 w-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Join the Future of Transparent Aid Distribution
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Be part of a revolutionary system that ensures every donation reaches those who need it most.
          </p>
          <button
            onClick={onGetStarted}
            className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-lg"
          >
            Start Contributing Today
          </button>
        </div>
      </section>
    </div>
  );
}