import React, { useState } from 'react';
import { MapPin, Users, Clock, CheckCircle, AlertTriangle, Filter } from 'lucide-react';

export function AidDistribution() {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const distributionRequests = [
    {
      id: '1',
      title: 'Emergency Medical Aid - Jakarta',
      location: 'Jakarta, Indonesia',
      urgency: 'high',
      category: 'Medical',
      requested: '$2,500',
      raised: '$1,800',
      recipients: 45,
      validator: '0x742d35Cc6635C0532925a3b8D55dEdc4CF384df9',
      status: 'active',
      timeLeft: '2 days',
      description: 'Urgent medical supplies needed for flood victims in Jakarta region. AI analysis shows high priority distribution need.'
    },
    {
      id: '2',
      title: 'School Supplies Distribution',
      location: 'Surabaya, Indonesia',
      urgency: 'medium',
      category: 'Education',
      requested: '$1,200',
      raised: '$1,200',
      recipients: 120,
      validator: '0x8ba1f109551bD432803012645Hac136c30B70c08',
      status: 'ready',
      timeLeft: 'Ready for distribution',
      description: 'Educational materials and school supplies for underprivileged children. Community validated and ready for distribution.'
    },
    {
      id: '3',
      title: 'Food Package Distribution',
      location: 'Bandung, Indonesia',
      urgency: 'high',
      category: 'Food',
      requested: '$3,000',
      raised: '$2,100',
      recipients: 200,
      validator: '0x9f8e7D6c5B4a3E2F1d0C9b8A7f6E5d4C3b2A1F0E',
      status: 'active',
      timeLeft: '5 days',
      description: 'Monthly food packages for families affected by economic hardship. AI recommends immediate attention.'
    }
  ];

  const filters = [
    { id: 'all', label: 'All Requests', count: distributionRequests.length },
    { id: 'active', label: 'Active', count: distributionRequests.filter(r => r.status === 'active').length },
    { id: 'ready', label: 'Ready', count: distributionRequests.filter(r => r.status === 'ready').length },
    { id: 'high', label: 'High Priority', count: distributionRequests.filter(r => r.urgency === 'high').length }
  ];

  const filteredRequests = distributionRequests.filter(request => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'active') return request.status === 'active';
    if (selectedFilter === 'ready') return request.status === 'ready';
    if (selectedFilter === 'high') return request.urgency === 'high';
    return true;
  });

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Aid Distribution</h1>
          <p className="text-gray-600 mt-2">
            Monitor and validate aid distribution requests powered by AI analysis and community verification
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <div className="flex items-center space-x-1 bg-white p-1 rounded-lg shadow-sm border border-gray-200 w-fit">
            <Filter className="h-4 w-4 text-gray-500 ml-3" />
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  selectedFilter === filter.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {filter.label}
                <span className="ml-2 bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                  {filter.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Distribution Cards */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredRequests.map((request) => (
            <div key={request.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(request.urgency)}`}>
                    {request.urgency.toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                    {request.status.toUpperCase()}
                  </span>
                </div>
                {request.urgency === 'high' && (
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                )}
              </div>

              {/* Title and Location */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{request.title}</h3>
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                {request.location}
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                {request.description}
              </p>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">
                    {request.raised} / {request.requested}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${(parseInt(request.raised.replace('$', '').replace(',', '')) / 
                               parseInt(request.requested.replace('$', '').replace(',', ''))) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Users className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                  <div className="text-sm font-medium text-gray-900">{request.recipients}</div>
                  <div className="text-xs text-gray-600">Recipients</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Clock className="h-5 w-5 text-green-500 mx-auto mb-1" />
                  <div className="text-sm font-medium text-gray-900">{request.timeLeft}</div>
                  <div className="text-xs text-gray-600">Time Left</div>
                </div>
              </div>

              {/* Validator */}
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <div className="text-xs text-blue-600 font-medium mb-1">Validated by:</div>
                <div className="text-xs text-blue-800 font-mono">
                  {request.validator.slice(0, 20)}...
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                {request.status === 'ready' ? (
                  <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Distribute Now
                  </button>
                ) : (
                  <>
                    <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                      Contribute
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                      Validate
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* AI Recommendations */}
        <div className="mt-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">AI Distribution Insights</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/20 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Optimal Distribution</h3>
              <p className="text-purple-100 text-sm">
                AI recommends prioritizing medical aid in Jakarta region due to recent flood impact analysis.
              </p>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Resource Allocation</h3>
              <p className="text-purple-100 text-sm">
                Current efficiency rate: 94.7%. Recommended to increase food distribution by 15%.
              </p>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Community Validation</h3>
              <p className="text-purple-100 text-sm">
                1,247 community validators active. Average validation time: 2.3 hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}