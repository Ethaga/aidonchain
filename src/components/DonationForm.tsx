import React, { useState } from 'react';
import { Heart, Shield, Zap, Users, Send, ExternalLink, CheckCircle, XCircle } from 'lucide-react';
import { veChainService } from '../services/vechain';

export function DonationForm() {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('general');
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [txHash, setTxHash] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);

  const categories = [
    { id: 'general', label: 'General Aid', icon: Heart },
    { id: 'medical', label: 'Medical Emergency', icon: Shield },
    { id: 'education', label: 'Education Support', icon: Users },
    { id: 'disaster', label: 'Disaster Relief', icon: Zap }
  ];

  const quickAmounts = ['10', '25', '50', '100', '250', '500'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');
    setSuccess(false);
    setTxHash('');

    if (!veChainService.isVeWorldInstalled()) {
      setError('Please install VeWorld wallet from https://www.veworld.net/');
      setIsProcessing(false);
      return;
    }

    const result = await veChainService.makeDonation({
      category,
      message,
      amount
    });

    setIsProcessing(false);

    if (result.success && result.txId) {
      setSuccess(true);
      setTxHash(result.txId);

      setTimeout(() => {
        setAmount('');
        setMessage('');
        setCategory('general');
        setSuccess(false);
        setTxHash('');
      }, 10000);
    } else {
      setError(result.error || 'Transaction failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Make a Donation</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your donation will be recorded on VeChain blockchain, ensuring complete transparency 
            and immutable proof of your contribution to social aid.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Donation Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Donation Details</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Select Category
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          category === cat.id
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <cat.icon className="h-6 w-6 mb-2 mx-auto" />
                        <div className="text-sm font-medium">{cat.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amount Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Donation Amount (USD)
                  </label>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {quickAmounts.map((quickAmount) => (
                      <button
                        key={quickAmount}
                        type="button"
                        onClick={() => setAmount(quickAmount)}
                        className={`py-2 px-4 rounded-lg border-2 transition-all ${
                          amount === quickAmount
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        ${quickAmount}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter custom amount"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message (Optional)
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add a message of hope or encouragement..."
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                    <XCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-red-800">{error}</div>
                  </div>
                )}

                {/* Success Message */}
                {success && txHash && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-green-900">Donation successful!</p>
                        <p className="text-xs text-green-700 mt-1">Your transaction has been submitted to VeChain blockchain.</p>
                      </div>
                    </div>
                    <a
                      href={veChainService.getExplorerUrl(txHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-xs text-green-700 hover:text-green-800 mt-2"
                    >
                      View on Explorer
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!amount || isProcessing}
                  className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      <span>Processing via VeWorld...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Donate ${amount || '0'} VET on VeChain
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Blockchain Features */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Blockchain Benefits</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-green-500 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">100% Transparent</p>
                    <p className="text-xs text-gray-600">All transactions publicly verifiable</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Zap className="h-5 w-5 text-blue-500 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Immutable Record</p>
                    <p className="text-xs text-gray-600">Cannot be altered or deleted</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-purple-500 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Community Verified</p>
                    <p className="text-xs text-gray-600">Validated by network participants</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Impact Stats */}
            <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Your Impact</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-green-100">Total Donated</span>
                  <span className="font-semibold">$1,250</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-100">People Helped</span>
                  <span className="font-semibold">73</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-100">Validation Score</span>
                  <span className="font-semibold">9.8/10</span>
                </div>
              </div>
            </div>

            {/* Recent Donations */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {[
                  { amount: '$100', category: 'Medical', time: '2h ago' },
                  { amount: '$50', category: 'Education', time: '1d ago' },
                  { amount: '$200', category: 'General', time: '3d ago' }
                ].map((donation, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{donation.amount}</p>
                      <p className="text-xs text-gray-600">{donation.category}</p>
                    </div>
                    <span className="text-xs text-gray-500">{donation.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}