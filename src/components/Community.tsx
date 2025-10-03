import React, { useState } from 'react';
import { 
  Users, 
  Star, 
  Award, 
  TrendingUp, 
  CheckCircle, 
  Clock,
  Shield,
  Coins,
  Camera,
  Upload
} from 'lucide-react';

export function Community() {
  const [selectedTab, setSelectedTab] = useState('validators');

  const topValidators = [
    {
      address: '0x742d35Cc6635C0532925a3b8D55dEdc4CF384df9',
      name: 'CryptoHelper',
      validations: 1247,
      accuracy: 98.7,
      rewards: 2450,
      level: 'Diamond',
      badge: '🏆'
    },
    {
      address: '0x8ba1f109551bD432803012645Hac136c30B70c08',
      name: 'AidValidator',
      validations: 892,
      accuracy: 97.3,
      rewards: 1780,
      level: 'Gold',
      badge: '🥇'
    },
    {
      address: '0x9f8e7D6c5B4a3E2F1d0C9b8A7f6E5d4C3b2A1F0E',
      name: 'CommunityGuard',
      validations: 654,
      accuracy: 96.8,
      rewards: 1320,
      level: 'Silver',
      badge: '🥈'
    }
  ];

  const pendingValidations = [
    {
      id: '1',
      title: 'Medical Aid Distribution - Jakarta',
      submitter: '0x123...456',
      amount: '$2,500',
      evidence: 'distribution_photos_jakarta_001.jpg',
      timeSubmitted: '2 hours ago',
      validators: 3,
      requiredValidators: 5,
      reward: '50 VET'
    },
    {
      id: '2',
      title: 'School Supplies Delivery - Surabaya',
      submitter: '0x789...abc',
      amount: '$1,200',
      evidence: 'school_delivery_receipt_002.pdf',
      timeSubmitted: '4 hours ago',
      validators: 2,
      requiredValidators: 3,
      reward: '30 VET'
    },
    {
      id: '3',
      title: 'Food Package Distribution - Bandung',
      submitter: '0xdef...123',
      amount: '$800',
      evidence: 'food_distribution_video_003.mp4',
      timeSubmitted: '6 hours ago',
      validators: 1,
      requiredValidators: 4,
      reward: '40 VET'
    }
  ];

  const rewardTiers = [
    { level: 'Bronze', minValidations: 10, reward: '10 VET/validation', badge: '🥉' },
    { level: 'Silver', minValidations: 100, reward: '15 VET/validation', badge: '🥈' },
    { level: 'Gold', minValidations: 500, reward: '20 VET/validation', badge: '🥇' },
    { level: 'Diamond', minValidations: 1000, reward: '25 VET/validation', badge: '🏆' }
  ];

  const tabs = [
    { id: 'validators', label: 'Top Validators', icon: Users },
    { id: 'pending', label: 'Pending Validations', icon: Clock },
    { id: 'rewards', label: 'Reward System', icon: Award }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Community Validation</h1>
          <p className="text-gray-600 mt-2">
            Participate in the x-2-earn ecosystem by validating aid distributions and earning VET rewards
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="bg-blue-50 p-3 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-gray-900">1,256</h3>
              <p className="text-sm text-gray-600">Active Validators</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="bg-green-50 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-gray-900">47,382</h3>
              <p className="text-sm text-gray-600">Validations Completed</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="bg-yellow-50 p-3 rounded-lg">
                <Coins className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-gray-900">₩2.4M</h3>
              <p className="text-sm text-gray-600">VET Rewards Distributed</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="bg-purple-50 p-3 rounded-lg">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-gray-900">98.7%</h3>
              <p className="text-sm text-gray-600">Accuracy Rate</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    selectedTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {selectedTab === 'validators' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Community Validators</h2>
              <div className="space-y-4">
                {topValidators.map((validator, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">{validator.badge}</div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{validator.name}</h3>
                        <p className="text-sm text-gray-600 font-mono">
                          {validator.address.slice(0, 20)}...
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-8 text-sm">
                      <div className="text-center">
                        <div className="font-semibold text-gray-900">{validator.validations}</div>
                        <div className="text-gray-600">Validations</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-gray-900">{validator.accuracy}%</div>
                        <div className="text-gray-600">Accuracy</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-green-600">{validator.rewards} VET</div>
                        <div className="text-gray-600">Rewards</div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        validator.level === 'Diamond' ? 'bg-purple-100 text-purple-800' :
                        validator.level === 'Gold' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {validator.level}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'pending' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Pending Validations</h2>
              <div className="space-y-6">
                {pendingValidations.map((validation) => (
                  <div key={validation.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{validation.title}</h3>
                        <p className="text-sm text-gray-600">
                          Submitted by {validation.submitter} • {validation.timeSubmitted}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">{validation.amount}</div>
                        <div className="text-sm text-green-600 font-medium">+{validation.reward}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Camera className="h-4 w-4" />
                        <span>{validation.evidence}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-sm">
                          <span className="text-gray-600">Validators: </span>
                          <span className="font-medium">
                            {validation.validators}/{validation.requiredValidators}
                          </span>
                        </div>
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ 
                              width: `${(validation.validators / validation.requiredValidators) * 100}%` 
                            }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                          Validate
                        </button>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                          View Evidence
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'rewards' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Validator Reward Tiers</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {rewardTiers.map((tier, index) => (
                  <div key={index} className="text-center p-6 border border-gray-200 rounded-lg">
                    <div className="text-4xl mb-3">{tier.badge}</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{tier.level}</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {tier.minValidations}+ validations required
                    </p>
                    <div className="bg-green-50 px-3 py-2 rounded-lg">
                      <div className="text-sm font-medium text-green-800">{tier.reward}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">Start Earning VET Today!</h2>
              <p className="text-blue-100 mb-6">
                Join our community of validators and earn VET tokens while ensuring aid reaches those who need it most. 
                Every validation helps build trust and transparency in the system.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                  Start Validating
                </button>
                <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
                  Learn More
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">How Validation Works</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Upload className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">1. Evidence Submitted</h4>
                  <p className="text-sm text-gray-600">
                    Aid distributors upload proof of delivery (photos, receipts, videos)
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-green-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">2. Community Reviews</h4>
                  <p className="text-sm text-gray-600">
                    Multiple validators review and verify the authenticity of evidence
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-yellow-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Coins className="h-6 w-6 text-yellow-600" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">3. Rewards Distributed</h4>
                  <p className="text-sm text-gray-600">
                    Validators earn VET tokens based on accuracy and participation level
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}