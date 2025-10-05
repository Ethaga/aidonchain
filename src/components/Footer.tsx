import React from 'react';
import { Heart, Github, Twitter, Globe } from 'lucide-react';

export function Footer() {
  const links = {
    product: [
      { label: 'Dashboard', href: '#' },
      { label: 'Donate', href: '#' },
      { label: 'Distribute', href: '#' },
      { label: 'Analytics', href: '#' }
    ],
    community: [
      { label: 'Validators', href: '#' },
      { label: 'Documentation', href: '#' },
      { label: 'API', href: '#' },
      { label: 'Support', href: '#' }
    ],
    blockchain: [
      { label: 'VeChain Network', href: '#' },
      { label: 'Smart Contracts', href: '#' },
      { label: 'Block Explorer', href: '#' },
      { label: 'Wallet Integration', href: '#' }
    ],
    legal: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Cookie Policy', href: '#' },
      { label: 'Compliance', href: '#' }
    ]
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <img src="https://cdn.builder.io/api/v1/image/assets%2F9f726f94586248d5a947df4f23b59b53%2F07af4452ecec4a3ca1512d2be8833a27?format=webp&width=800" alt="AIDonchain" className="h-8 w-auto" />
              <span className="ml-3 text-xl font-bold">AIDonchain</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Revolutionizing social aid distribution through 100% on-chain transparency, 
              AI-powered analytics, and community validation on VeChain blockchain.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Globe className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Product
            </h3>
            <ul className="space-y-3">
              {links.product.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Community Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Community
            </h3>
            <ul className="space-y-3">
              {links.community.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Blockchain Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Blockchain
            </h3>
            <ul className="space-y-3">
              {links.blockchain.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              {links.legal.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 AIDonchain. All rights reserved. Built on VeChain blockchain.
            </p>
            <div className="mt-4 md:mt-0">
              <p className="text-gray-400 text-sm">
                Powered by VeChainThor • 100% Transparent • AI-Enhanced
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
