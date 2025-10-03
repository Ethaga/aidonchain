import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Dashboard } from './components/Dashboard';
import { DonationForm } from './components/DonationForm';
import { AidDistribution } from './components/AidDistribution';
import { Analytics } from './components/Analytics';
import { Community } from './components/Community';
import { Footer } from './components/Footer';

type View = 'home' | 'donate' | 'distribute' | 'analytics' | 'community' | 'dashboard';

function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [isConnected, setIsConnected] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'donate':
        return <DonationForm />;
      case 'distribute':
        return <AidDistribution />;
      case 'analytics':
        return <Analytics />;
      case 'community':
        return <Community />;
      default:
        return <Hero onGetStarted={() => setCurrentView('dashboard')} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header 
        currentView={currentView} 
        setCurrentView={setCurrentView}
        isConnected={isConnected}
        setIsConnected={setIsConnected}
      />
      
      <main className="pt-16">
        {renderView()}
      </main>
      
      {currentView === 'home' && <Footer />}
    </div>
  );
}

export default App;