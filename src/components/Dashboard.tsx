import React, { useState } from 'react';
import { 
  DollarSign, 
  Users, 
  Heart, 
  TrendingUp, 
  Activity, 
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export function Dashboard() {
  const [selectedTab, setSelectedTab] = useState('overview');

  const stats = [
    {
      icon: DollarSign,
      label: 'Total Donations',
      value: '$2,435,847',
      change: '+23.5%',
      changeType: 'positive'
    },
    {
      icon: Users,
      label: 'Recipients Helped',
      value: '12,847',
      change: '+18.2%',
      changeType: 'positive'
    },
    {
      icon: Heart,
      label: 'Active Donors',
      value: '3,256',
      change: '+12.8%',
      changeType: 'positive'
    },
    {
      icon: Activity,
      label: 'Validation Score',
      value: '98.7%',
      change: '+0.3%',
      changeType: 'positive'
    }
  ];

  const recentTransactions = [
    {
      id: '1',
      type: 'donation',
      donor: '0x742d35Cc6635C0532925a3b8D55dEdc4CF384df9',
      amount: '$500',
      recipient: 'Education Fund',
      status: 'completed',
      timestamp: '2 minutes ago'
    },
    {
      id: '2',
      type: 'distribution',
      donor: '0x8ba1f109551bD432803012645Hac136c30B70c08',
      amount: '$1,200',
      recipient: 'Medical Aid - Jakarta',
      status: 'pending',
      timestamp: '5 minutes ago'
    },
    {
      id: '3',
      type: 'validation',
      donor: 'Community Validator',
      amount: '+50 VET',
      recipient: 'Validator Reward',
      status: 'completed',
      timestamp: '12 minutes ago'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'donations', label: 'My Donations' },
    { id: 'validations', label: 'My Validations' },
    { id: 'rewards', label: 'Rewards' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Monitor your contributions and track aid distribution in real-time
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    selectedTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <stat.icon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <div className={`flex items-center mt-2 text-sm ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {stat.change}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Transactions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Transactions</h2>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${
                        transaction.status === 'completed' ? 'bg-green-400' : 'bg-yellow-400'
                      }`}></div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {transaction.type === 'donation' ? 'Donation' : 
                           transaction.type === 'distribution' ? 'Distribution' : 'Validation'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {transaction.donor.length > 20 ? 
                            `${transaction.donor.slice(0, 20)}...` : 
                            transaction.donor
                          }
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{transaction.amount}</p>
                      <p className="text-sm text-gray-600">{transaction.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Insights</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Distribution Optimal</p>
                    <p className="text-xs text-gray-600">Current aid distribution showing 95% efficiency</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Peak Demand Detected</p>
                    <p className="text-xs text-gray-600">Medical aid requests increasing by 15%</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Validation Rewards</p>
                    <p className="text-xs text-gray-600">You've earned 150 VET this week</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Community Impact</h3>
              <p className="text-blue-100 text-sm mb-4">
                Your contributions have helped 247 individuals this month
              </p>
              <div className="bg-white/20 rounded-lg p-3">
                <div className="flex justify-between items-center text-sm">
                  <span>Impact Score</span>
                  <span className="font-semibold">9.2/10</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}