import React from 'react';
import { Home, ClipboardList, Target, BarChart2, Settings, Leaf } from 'lucide-react';
import { Card } from '../ui/Card';

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "home", icon: Home, label: "Dashboard" },
    { id: "pantry", icon: ClipboardList, label: "Pantry Center" },
    { id: "impact", icon: Target, label: "Recipes" },
    { id: "analytics", icon: BarChart2, label: "Impact Analytics" },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-full h-screen bg-[#F8F9FA] border-r border-gray-100 p-6 sticky top-0 overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <Leaf className="text-white w-5 h-5" />
        </div>
        <span className="text-xl font-bold text-[#1A202C]">Eco-Scan</span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-2 mb-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${
              activeTab === tab.id 
                ? 'bg-primary text-white font-semibold shadow-md' 
                : 'text-text-secondary hover:bg-gray-100 font-medium'
            }`}
          >
            <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-white' : 'text-text-secondary'}`} />
            {tab.label}
          </button>
        ))}
        <div className="h-px bg-gray-200 my-4 mx-2" />
        <button className="flex items-center gap-4 px-4 py-3 rounded-2xl transition-all text-text-secondary hover:bg-gray-100 font-medium">
          <Settings className="w-5 h-5 text-text-secondary" />
          Settings
        </button>
      </nav>

      {/* Sustainability Score */}
      <Card className="mt-8 bg-white border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-sm font-bold text-primary">Sustainability Score</h4>
          <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <div className="flex items-baseline gap-1 my-4">
          <span className="text-4xl font-black">84</span>
          <span className="text-xs text-text-secondary font-bold">/ 100</span>
        </div>
        
        {/* Sparkline placeholder */}
        <div className="h-12 w-full mt-2 mb-4 relative">
          <svg viewBox="0 0 100 30" className="w-full h-full" preserveAspectRatio="none">
            <path 
              d="M 0 20 L 15 10 L 30 18 L 45 5 L 60 15 L 75 0 L 100 12" 
              fill="none" 
              stroke="#067A57" 
              strokeWidth="3" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
            {/* Dots */}
            <circle cx="0" cy="20" r="3" fill="#067A57" />
            <circle cx="15" cy="10" r="3" fill="#067A57" />
            <circle cx="30" cy="18" r="3" fill="#067A57" />
            <circle cx="45" cy="5" r="3" fill="#067A57" />
            <circle cx="60" cy="15" r="3" fill="#067A57" />
            <circle cx="75" cy="0" r="3" fill="#067A57" />
            <circle cx="100" cy="12" r="3" fill="#067A57" />
          </svg>
        </div>

        <p className="text-[11px] text-text-secondary leading-relaxed">
          Great job! You've saved <span className="font-bold text-primary">12.4kg CO2e</span> this week by reducing food waste.
        </p>
      </Card>
    </aside>
  );
};
