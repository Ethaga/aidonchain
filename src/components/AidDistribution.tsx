import React, { useEffect, useState } from 'react';
import { MapPin, Users, Clock, CheckCircle, AlertTriangle, Filter } from 'lucide-react';
import { veChainService } from '../services/vechain';

type RequestStatus = 'active' | 'ready' | 'distributed';

interface DistributionRequest {
  id: string;
  title: string;
  location: string;
  urgency: string;
  category: string;
  requested: string; // dollar string
  raised: string; // dollar string
  recipients: number;
  validator: string; // initial validator address
  status: RequestStatus | string;
  timeLeft: string;
  description: string;
  validators?: string[]; // addresses who validated
}

const STORAGE_KEY_REQUESTS = 'onchainaid_distribution_requests_v1';
const STORAGE_KEY_VALIDATIONS = 'onchainaid_validations_v1';
const VALIDATION_THRESHOLD = 3;

export function AidDistribution() {
  const initialRequests: DistributionRequest[] = [
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
      description: 'Urgent medical supplies needed for flood victims in Jakarta region. AI analysis shows high priority distribution need.',
      validators: []
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
      description: 'Educational materials and school supplies for underprivileged children. Community validated and ready for distribution.',
      validators: []
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
      description: 'Monthly food packages for families affected by economic hardship. AI recommends immediate attention.',
      validators: []
    }
  ];

  const [selectedFilter, setSelectedFilter] = useState('all');
  const [requests, setRequests] = useState<DistributionRequest[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_REQUESTS);
      if (raw) return JSON.parse(raw) as DistributionRequest[];
    } catch (e) {
      // ignore
    }
    return initialRequests;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_REQUESTS, JSON.stringify(requests));
    } catch (e) {
      // ignore
    }
  }, [requests]);

  const filters = [
    { id: 'all', label: 'All Requests', count: requests.length },
    { id: 'active', label: 'Active', count: requests.filter(r => r.status === 'active').length },
    { id: 'ready', label: 'Ready', count: requests.filter(r => r.status === 'ready').length },
    { id: 'high', label: 'High Priority', count: requests.filter(r => r.urgency === 'high').length }
  ];

  const filteredRequests = requests.filter(request => {
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
      case 'distributed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const parseDollar = (s: string) => Number(s.replace(/[^0-9.-]+/g, ''));
  const formatDollar = (n: number) => '$' + Math.round(n).toLocaleString();

  const handleContribute = async (id: string) => {
    const req = requests.find(r => r.id === id);
    if (!req) return;

    const input = window.prompt(`Enter contribution amount in VET (min 1 VET) for "${req.title}"`, '1');
    if (!input) return;
    const amount = parseFloat(input);
    if (isNaN(amount) || amount <= 0) {
      window.alert('Invalid amount');
      return;
    }
    if (amount < 1) {
      window.alert('Minimum donation is 1 VET');
      return;
    }

    // Ensure wallet connected
    if (!veChainService.isVeWorldInstalled()) {
      window.alert('Please install VeWorld wallet from https://www.veworld.net/');
      return;
    }

    const conn = await veChainService.connectWallet();
    if (!conn.success) {
      window.alert('Wallet connection failed: ' + (conn.error || 'unknown'));
      return;
    }

    // Call donation flow (will save local donation record inside service)
    const res = await veChainService.makeDonation({
      category: req.category,
      message: `Contribution to request ${req.id} - ${req.title}`,
      amount: String(amount)
    });

    if (res.success && res.txId) {
      // Update raised amount (assume raised is dollar value; we will approximate VET -> USD parity not available,
      // so we treat raised field as VET for the purpose of progress change to show immediate feedback.)
      // Parse current raised/requested as numbers and add contribution to raised.
      const currentRaised = parseDollar(req.raised);
      const newRaised = currentRaised + amount; // mixing VET and $ for display is best-effort

      setRequests(prev => prev.map(r => r.id === id ? { ...r, raised: formatDollar(newRaised) } : r));

      window.alert(`Donation submitted. Tx: ${res.txId}`);
    } else {
      window.alert('Donation failed: ' + (res.error || 'unknown error'));
    }
  };

  const handleValidate = async (id: string) => {
    const req = requests.find(r => r.id === id);
    if (!req) return;

    if (!veChainService.isVeWorldInstalled()) {
      window.alert('Please install VeWorld wallet from https://www.veworld.net/');
      return;
    }

    // Get current address (will prompt wallet if needed)
    const addr = await veChainService.getCurrentAddress();
    if (!addr) {
      const conn = await veChainService.connectWallet();
      if (!conn.success) {
        window.alert('Wallet connection failed: ' + (conn.error || 'unknown'));
        return;
      }
    }

    const currentAddr = (await veChainService.getCurrentAddress()) || 'unknown';

    // Check if already validated
    if (req.validators && req.validators.includes(currentAddr)) {
      window.alert('You have already validated this request');
      return;
    }

    // Persist validation in localStorage
    try {
      const raw = localStorage.getItem(STORAGE_KEY_VALIDATIONS);
      const arr: { requestId: string; address: string; timestamp: number }[] = raw ? JSON.parse(raw) : [];
      arr.push({ requestId: id, address: currentAddr, timestamp: Date.now() });
      localStorage.setItem(STORAGE_KEY_VALIDATIONS, JSON.stringify(arr));
    } catch (e) {
      // ignore
    }

    // Update in-memory state
    setRequests(prev => prev.map(r => {
      if (r.id !== id) return r;
      const validators = Array.from(new Set([...(r.validators || []), currentAddr]));
      const status = validators.length >= VALIDATION_THRESHOLD ? 'ready' : r.status;
      // If became ready, set timeLeft accordingly
      return { ...r, validators, status };
    }));

    window.alert('Validation recorded. Thank you for validating.');
  };

  const handleDistribute = async (id: string) => {
    const req = requests.find(r => r.id === id);
    if (!req) return;

    if (req.status !== 'ready') {
      window.alert('Request is not ready for distribution');
      return;
    }

    const ok = window.confirm(`Are you sure you want to mark "${req.title}" as distributed? This action will record the distribution on-chain (simulated) and update status.`);
    if (!ok) return;

    // For now we simulate the distribution record locally and update status
    try {
      const distKey = 'onchainaid_distributions_v1';
      const raw = localStorage.getItem(distKey);
      const arr: { requestId: string; distributor: string; timestamp: number }[] = raw ? JSON.parse(raw) : [];
      const addr = (await veChainService.getCurrentAddress()) || 'unknown';
      arr.push({ requestId: id, distributor: addr, timestamp: Date.now() });
      localStorage.setItem(distKey, JSON.stringify(arr));
    } catch (e) {
      // ignore
    }

    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'distributed', timeLeft: 'Distributed' } : r));

    window.alert('Distribution recorded locally. If you need an on-chain distribution call, provide the distribution contract ABI and we can wire a transaction.');
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
                      width: `${(parseDollar(request.raised) / parseDollar(request.requested)) * 100}%` 
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
                <div className="text-xs text-gray-600 mt-2">
                  {request.validators && request.validators.length ? `${request.validators.length} community validations` : 'No community validations yet'}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                {request.status === 'ready' ? (
                  <button onClick={() => handleDistribute(request.id)} className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Distribute Now
                  </button>
                ) : request.status === 'distributed' ? (
                  <button disabled className="flex-1 bg-gray-200 text-gray-500 py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center">Distributed</button>
                ) : (
                  <>
                    <button onClick={() => handleContribute(request.id)} className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                      Contribute
                    </button>
                    <button onClick={() => handleValidate(request.id)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
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
