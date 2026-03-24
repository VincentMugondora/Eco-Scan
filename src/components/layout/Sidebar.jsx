import React from 'react';
import { LayoutDashboard, UtensilsCrossed, ChefHat, Sparkles, Settings, Leaf } from 'lucide-react';
import { Card } from '../ui/Card';

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "home", icon: LayoutDashboard, label: "Dashboard" },
    { id: "pantry", icon: UtensilsCrossed, label: "Pantry Center" },
    { id: "impact", icon: ChefHat, label: "Recipes" },
    { id: "analytics", icon: Sparkles, label: "Impact Analytics" },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-[260px] h-screen bg-white border-r border-[#F1F5F9] px-6 py-8 sticky top-0 overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10 pl-2">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <Leaf className="text-white w-5 h-5" />
        </div>
        <span className="text-lg font-black text-[#1A202C]">Eco-Scan</span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 mb-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-primary text-white font-bold shadow-md shadow-primary/20' 
                  : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A] font-medium'
              }`}
            >
              <tab.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#94A3B8]'}`} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[13px]">{tab.label}</span>
            </button>
          )
        })}
        
        <div className="mt-8 mb-2 px-4 flex items-center gap-3 py-3 rounded-xl transition-all text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A] font-medium cursor-pointer">
          <Settings className="w-4 h-4 text-[#94A3B8]" strokeWidth={2} />
          <span className="text-[13px]">Settings</span>
        </div>
      </nav>

      {/* Sustainability Score */}
      <Card className="mt-8 bg-[#F8FAFC] border-none shadow-none p-4 rounded-2xl relative overflow-hidden">
        <div className="flex justify-between items-start mb-3">
          <h4 className="text-[11px] font-bold text-primary">Sustainability Score</h4>
          <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v11" className="opacity-0" />
            {/* Using a trend-up icon specifically */}
            <path d="M19 9l-7 -7l-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 2v14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        
        <div className="flex items-baseline gap-1 my-1">
          <span className="text-[32px] font-black text-[#0F172A] leading-none tracking-tight">84</span>
          <span className="text-[11px] text-[#64748B] font-bold">/ 100</span>
        </div>
        
        {/* Real sparkline line */}
        <div className="h-14 w-full mt-4 mb-4 relative z-10">
          <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible" preserveAspectRatio="none">
            <path 
              d="M 0 30 L 15 20 L 30 25 L 45 10 L 60 20 L 75 5 L 100 15" 
              fill="none" 
              stroke="#067A57" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
            <circle cx="0" cy="30" r="3" fill="#067A57" />
            <circle cx="15" cy="20" r="3" fill="#067A57" />
            <circle cx="30" cy="25" r="3" fill="#067A57" />
            <circle cx="45" cy="10" r="3" fill="#067A57" />
            <circle cx="60" cy="20" r="3" fill="#067A57" />
            <circle cx="75" cy="5" r="3" fill="#067A57" />
            <circle cx="100" cy="15" r="3" fill="#067A57" />
          </svg>
        </div>

        <p className="text-[11px] text-[#64748B] leading-relaxed relative z-10 pr-2">
          Great job! You've saved <span className="font-bold text-primary">12.4kg CO2e</span> this week by reducing food waste.
        </p>
      </Card>
    </aside>
  );
};

