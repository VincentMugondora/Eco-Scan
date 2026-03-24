import React from 'react';
import { LayoutDashboard, UtensilsCrossed, ChefHat, Sparkles, Settings, Leaf, Droplets, Scale } from 'lucide-react';
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
        <div className="w-8 h-8 bg-[#107050] rounded-full flex items-center justify-center">
          <Leaf className="text-white w-4 h-4" />
        </div>
        <span className="text-[17px] font-black text-[#0F172A]">Eco-Scan</span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1.5 mb-auto -mx-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-[20px] transition-all ${
                isActive 
                  ? 'bg-[#107050] text-white font-bold ml-0' 
                  : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A] font-medium mx-2'
              }`}
            >
              <tab.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#94A3B8]'}`} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[13px]">{tab.label}</span>
            </button>
          )
        })}
        
        <div className="mt-8 mb-2 px-6 flex items-center gap-3 py-3 rounded-xl transition-all text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A] font-medium cursor-pointer">
          <Settings className="w-4 h-4 text-[#94A3B8]" strokeWidth={2} />
          <span className="text-[13px]">Settings</span>
        </div>
      </nav>

      {/* Sustainability Score */}
      <Card className="mt-8 bg-white border border-[#D1EBE3] shadow-sm pb-5 pt-4 px-4 rounded-3xl relative overflow-hidden">
        <div className="flex justify-between items-start mb-1">
          <h4 className="text-[10px] font-black tracking-widest uppercase text-[#107050]">Sustainability Score</h4>
          <svg className="w-3.5 h-3.5 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
            <path d="M19 9l-7 -7l-7 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 2v14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        
        <div className="flex items-baseline gap-1 my-0.5 mb-2">
          <span className="text-[32px] font-black text-[#0F172A] leading-none tracking-tight">84</span>
          <span className="text-[11px] text-[#64748B] font-bold">/ 100</span>
        </div>
        
        {/* Real sparkline line */}
        <div className="h-14 w-full mt-2 mb-6 relative z-10">
          <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible" preserveAspectRatio="none">
             <path 
               d="M 0 35 L 15 32 L 30 35 L 45 25 L 60 28 L 75 15 L 90 20 L 100 22" 
               fill="none" 
               stroke="#107050" 
               strokeWidth="2.5" 
               strokeLinecap="round" 
               strokeLinejoin="round" 
             />
          </svg>
          <div className="absolute top-[20px] right-0 w-2 h-2 bg-[#107050] rounded-full shadow-[0_0_0_4px_rgba(16,112,80,0.15)]"></div>
        </div>

        <p className="text-[9px] text-[#64748B] font-medium leading-[1.6] relative z-10">
          2026 Milestone: You've rescued <br/>
          <span className="font-bold text-[#107050]">12.4kg CO2e</span> this week.
        </p>
      </Card>
      
      {/* Footer Stats */}
      <div className="mt-5 px-1 flex flex-col gap-4">
         <div className="flex items-start gap-4">
            <div className="w-7 h-7 rounded-full bg-[#EFF6FF] text-[#3B82F6] flex items-center justify-center shrink-0 mt-0.5">
               <Droplets className="w-3.5 h-3.5" strokeWidth={2.5} />
            </div>
            <div>
               <p className="text-[9px] font-black text-[#64748B] uppercase tracking-widest leading-none mb-1">Water Saved</p>
               <p className="text-[13px] font-black text-[#0F172A] leading-none">1,240 Liters</p>
            </div>
         </div>
         <div className="flex items-start gap-4">
            <div className="w-7 h-7 rounded-full bg-[#FFF7ED] text-[#F59E0B] flex items-center justify-center shrink-0 mt-0.5">
               <Scale className="w-3.5 h-3.5" strokeWidth={2.5} />
            </div>
            <div>
               <p className="text-[9px] font-black text-[#64748B] uppercase tracking-widest leading-none mb-1">Meals Rescued</p>
               <p className="text-[13px] font-black text-[#0F172A] leading-none">18 Full Meals</p>
            </div>
         </div>
      </div>
    </aside>
  );
};

