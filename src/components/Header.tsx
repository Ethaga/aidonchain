import React from 'react';
import { Heart, Menu, Wallet, X, AlertCircle } from 'lucide-react';
import { veChainService } from '../services/vechain';

interface HeaderProps {
  currentView: string;
  setCurrentView: (view: 'home' | 'donate' | 'distribute' | 'analytics' | 'community' | 'dashboard') => void;
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
}

export function Header({ currentView, setCurrentView, isConnected, setIsConnected }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [walletAddress, setWalletAddress] = React.useState<string>('');
  const [isConnecting, setIsConnecting] = React.useState(false);
  const [error, setError] = React.useState<string>('');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'donate', label: 'Donate' },
    { id: 'distribute', label: 'Distribute' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'community', label: 'Community' },
  ];

  const handleConnect = async () => {
    if (isConnected) {
      setIsConnected(false);
      setWalletAddress('');
      return;
    }

    setIsConnecting(true);
    setError('');

    if (!veChainService.isVeWorldInstalled()) {
      setError('Please install VeWorld wallet from https://www.veworld.net/');
      setIsConnecting(false);
      return;
    }

    const result = await veChainService.connectWallet();

    if (result.success && result.address) {
      setIsConnected(true);
      setWalletAddress(result.address);
    } else {
      setError(result.error || 'Failed to connect wallet');
    }

    setIsConnecting(false);
  };

  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => setCurrentView('home')}
          >
            <img src="https://cdn.builder.io/api/v1/image/assets%2F9f726f94586248d5a947df4f23b59b53%2F07af4452ecec4a3ca1512d2be8833a27?format=webp&width=800" alt="AIDonchain" className="h-8 w-auto" />
            <span className="ml-3 text-xl font-bold text-gray-900">AIDonchain</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as any)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentView === item.id
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Wallet Connection */}
          <div className="flex items-center space-x-4">
            {error && (
              <div className="hidden md:flex items-center text-red-600 text-xs bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                <AlertCircle className="h-4 w-4 mr-2" />
                <span className="max-w-xs truncate">{error}</span>
              </div>
            )}
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isConnected
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isConnecting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <img src="https://cdn.builder.io/api/v1/image/assets%2F9f726f94586248d5a947df4f23b59b53%2F58e7c9417afd4cdc887e312012dfaf5b?format=webp&width=800" alt="VeWorld" className="h-4 w-4 mr-2 rounded" />
              )}
              {isConnecting ? 'Connecting...' : isConnected ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Connect VeWorld'}
            </button>

            {/* Mobile menu button */}
            <button
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-600" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id as any);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                    currentView === item.id
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
