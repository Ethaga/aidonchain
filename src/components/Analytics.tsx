import React, { useState } from 'react';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Activity,
  Brain,
  Shield,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

export function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  const periods = [
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' },
    { id: '90d', label: '90 Days' },
    { id: '1y', label: '1 Year' }
  ];

  const keyMetrics = [
    {
      icon: DollarSign,
      label: 'Total Volume',
      value: '$2.4M',
      change: '+23.5%',
      changeType: 'positive'
    },
    {
      icon: Users,
      label: 'Active Recipients',
      value: '12,847',
      change: '+18.2%',
      changeType: 'positive'
    },
    {
      icon: Activity,
      label: 'Transaction Efficiency',
      value: '94.7%',
      change: '+2.1%',
      changeType: 'positive'
    },
    {
      icon: Shield,
      label: 'Validation Score',
      value: '98.9%',
      change: '+0.8%',
      changeType: 'positive'
    }
  ];

  const distributionData = [
    { category: 'Medical Aid', amount: 890000, percentage: 37, color: 'bg-red-500' },
    { category: 'Education', amount: 650000, percentage: 27, color: 'bg-blue-500' },
    { category: 'Food Security', amount: 480000, percentage: 20, color: 'bg-green-500' },
    { category: 'Disaster Relief', amount: 290000, percentage: 12, color: 'bg-yellow-500' },
    { category: 'General Aid', amount: 90000, percentage: 4, color: 'bg-purple-500' }
  ];

  const aiInsights = [
    {
      type: 'optimization',
      icon: CheckCircle,
      title: 'Distribution Efficiency Optimal',
      description: 'Current aid distribution showing 94.7% efficiency rate - above target threshold.',
      confidence: 'High',
      action: 'No action required'
    },
    {
      type: 'alert',
      icon: AlertCircle,
      title: 'Medical Aid Demand Surge',
      description: 'AI detected 35% increase in medical aid requests in Jakarta region over past 7 days.',
      confidence: 'High',
      action: 'Consider increasing medical aid allocation'
    },
    {
      type: 'prediction',
      icon: TrendingUp,
      title: 'Seasonal Pattern Detected',
      description: 'Historical data suggests education aid demand will increase by 40% next month.',
      confidence: 'Medium',
      action: 'Prepare additional education resources'
    },
    {
      type: 'anomaly',
      icon: Brain,
      title: 'Unusual Transaction Pattern',
      description: 'Detected irregular donation pattern from 3 addresses - flagged for review.',
      confidence: 'Medium',
      action: 'Manual validation recommended'
    }
  ];

  const blockchainMetrics = [
    { label: 'Total Transactions', value: '47,382', icon: Activity },
    { label: 'Smart Contracts', value: '23', icon: Shield },
    { label: 'Gas Efficiency', value: '99.2%', icon: TrendingUp },
    { label: 'Network Uptime', value: '100%', icon: CheckCircle }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Analytics Dashboard</h1>
              <p className="text-gray-600 mt-2">
                Real-time insights powered by artificial intelligence and blockchain data analysis
              </p>
            </div>
            <div className="flex space-x-2">
              {periods.map((period) => (
                <button
                  key={period.id}
                  onClick={() => setSelectedPeriod(period.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedPeriod === period.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {keyMetrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <metric.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div className={`text-sm font-medium ${
                  metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.change}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</h3>
              <p className="text-sm text-gray-600">{metric.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Distribution Chart */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Aid Distribution by Category</h2>
                <PieChart className="h-5 w-5 text-gray-500" />
              </div>
              
              <div className="space-y-4">
                {distributionData.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className={`w-4 h-4 ${item.color} rounded-full mr-3`}></div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-900">{item.category}</span>
                        <span className="text-sm text-gray-600">${(item.amount / 1000).toFixed(0)}K</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`${item.color} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="ml-4 text-sm font-medium text-gray-900 w-12 text-right">
                      {item.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Insights */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center mb-6">
                <div className="bg-purple-50 p-2 rounded-lg mr-3">
                  <Brain className="h-5 w-5 text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">AI Insights & Recommendations</h2>
              </div>
              
              <div className="space-y-4">
                {aiInsights.map((insight, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <div className={`mt-0.5 ${
                        insight.type === 'optimization' ? 'text-green-500' :
                        insight.type === 'alert' ? 'text-yellow-500' :
                        insight.type === 'prediction' ? 'text-blue-500' : 'text-purple-500'
                      }`}>
                        <insight.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-900 mb-1">{insight.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">Confidence: {insight.confidence}</span>
                          <span className="text-xs font-medium text-blue-600">{insight.action}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Blockchain Metrics */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">VeChain Network Status</h3>
              <div className="space-y-4">
                {blockchainMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <metric.icon className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-gray-600">{metric.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{metric.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Real-time Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Real-time Activity</h3>
              <div className="space-y-3">
                {[
                  { action: 'New donation received', amount: '$500', time: '2m ago' },
                  { action: 'Aid distributed', amount: '$1,200', time: '5m ago' },
                  { action: 'Validation completed', amount: '+50 VET', time: '8m ago' },
                  { action: 'Smart contract executed', amount: '$800', time: '12m ago' }
                ].map((activity, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-600">{activity.time}</p>
                    </div>
                    <span className="text-sm font-semibold text-green-600">{activity.amount}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Score */}
            <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">System Performance</h3>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">94.7%</div>
                <div className="text-green-100 text-sm mb-4">Overall Efficiency Score</div>
                <div className="bg-white/20 rounded-lg p-3">
                  <div className="text-xs">
                    <div className="flex justify-between mb-1">
                      <span>Distribution Speed</span>
                      <span>96%</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span>Validation Accuracy</span>
                      <span>98%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cost Efficiency</span>
                      <span>92%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}