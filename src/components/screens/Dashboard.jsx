import React from "react";
import { Search, Bell, Grid, Plus, ScanLine, Utensils, Sparkles, ChevronRight, CheckCircle2 } from "lucide-react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { ProgressBar } from "../ui/ProgressBar";
import { IMPACT_STATS, PANTRY_ITEMS, ACTION_REQUIRED_ITEMS } from "../../data/mockData";
import { motion } from "framer-motion";

const Dashboard = () => {
  const urgentItems = [...PANTRY_ITEMS].filter(item => item.status === "expired" || item.status === "soon").slice(0, 3);

  return (
    <div className="flex flex-col pb-32 pt-2 px-4 lg:px-8 max-w-7xl mx-auto w-full min-h-screen font-sans bg-[#F8FAFC]">
      
      {/* Top App Bar area matches visual exactly */}
      <div className="flex justify-between items-center mb-6 pt-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden relative">
            <img 
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
             <p className="text-[12px] text-[#64748B] font-medium leading-tight">Good morning,</p>
             <h1 className="text-[18px] font-black text-[#0F172A] leading-tight tracking-tight">Vincent</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <button className="w-10 h-10 rounded-full bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-center relative text-[#4A5568] hover:bg-[#F1F5F9] transition-colors">
              <Search className="w-5 h-5" strokeWidth={2.5} />
           </button>
           <button className="w-10 h-10 rounded-full bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-center relative text-[#4A5568] hover:bg-[#F1F5F9] transition-colors">
              <Bell className="w-5 h-5" strokeWidth={2.5} />
              <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-[#EF4444] border-2 border-white rounded-full"></div>
           </button>
        </div>
      </div>

      {/* Hero Eco-Score Card */}
      <Card className="p-0 bg-[#107050] border-none shadow-[0_20px_40px_-15px_rgba(16,112,80,0.5)] rounded-[24px] lg:rounded-[32px] relative overflow-hidden mb-8 text-white">
        {/* Soft decorative blur */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white opacity-10 rounded-full blur-[60px]"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#065A3F] opacity-50 rounded-full blur-[40px]"></div>

        <div className="p-6 lg:p-8 relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
           <div className="flex-1">
             <div className="flex items-center gap-2 mb-3">
               <Sparkles className="w-4 h-4 text-[#A7F3D0]" />
               <span className="text-[11px] font-black uppercase tracking-widest text-[#D1EBE3]">Weekly Impact</span>
             </div>
             <h2 className="text-[32px] lg:text-[40px] font-black leading-tight tracking-tight mb-2">
                12.4 <span className="text-[20px] font-bold text-[#D1EBE3]">kg CO₂e</span>
             </h2>
             <p className="text-[13px] text-[#A7F3D0] max-w-[200px] leading-relaxed font-medium">
               You are in the top <span className="text-white font-bold">15%</span> of eco-savers in your community this week!
             </p>
           </div>
           
           {/* Circular Gauge */}
           <div className="relative w-28 h-28 shrink-0 self-center md:self-auto">
             <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full drop-shadow-lg">
               <circle cx="50" cy="50" r="44" fill="transparent" stroke="rgba(255,255,255,0.15)" strokeWidth="12" />
               <circle 
                 cx="50" 
                 cy="50" 
                 r="44" 
                 fill="transparent" 
                 stroke="#A7F3D0" 
                 strokeWidth="12" 
                 strokeDasharray="276" 
                 strokeDashoffset={276 - (276 * 0.84)} 
                 strokeLinecap="round" 
               />
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center pt-1 drop-shadow-md">
                <span className="text-[26px] font-black tracking-tighter">84</span>
                <span className="text-[9px] font-bold text-[#D1EBE3] tracking-wider uppercase mt-0.5">SCORE</span>
             </div>
           </div>
        </div>
        
        {/* Subtle bottom info bar */}
        <div className="bg-[#0A4A35]/40 backdrop-blur-md px-6 py-3 flex justify-between items-center z-10 relative border-t border-white/5">
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                 <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                 <span className="text-[11px] font-bold text-[#D1EBE3]">Meals Saved: {IMPACT_STATS.mealsSaved}</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5">
                 <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]"></span>
                 <span className="text-[11px] font-bold text-[#D1EBE3]">Water: {IMPACT_STATS.waterSaved}L</span>
              </div>
           </div>
           <button className="text-[11px] font-bold text-white hover:text-[#A7F3D0] transition-colors flex items-center gap-1 uppercase tracking-widest">
              Details <ChevronRight className="w-3 h-3" strokeWidth={3} />
           </button>
        </div>
      </Card>

      {/* Quick Access Grid exactly as dash1.png */}
      <div className="grid grid-cols-4 gap-3 mb-8">
        {[
          { id: "add", icon: Plus, label: "Add", bg: "bg-white", border: "border-[#E2E8F0]", color: "text-[#0F172A]", iconBg: "bg-[#F8FAFC]", iconColor: "text-[#64748B]" },
          { id: "scan", icon: ScanLine, label: "Scan Item", bg: "bg-[#107050]", border: "border-[#107050]", color: "text-white", iconBg: "bg-white/20", iconColor: "text-white" },
          { id: "recipe", icon: Utensils, label: "Recipes", bg: "bg-white", border: "border-[#E2E8F0]", color: "text-[#0F172A]", iconBg: "bg-[#FFF7ED]", iconColor: "text-[#F59E0B]" },
          { id: "pantry", icon: Grid, label: "Pantry", bg: "bg-white", border: "border-[#E2E8F0]", color: "text-[#0F172A]", iconBg: "bg-[#F3FAF7]", iconColor: "text-[#107050]" },
        ].map((item) => (
          <button key={item.id} className={`${item.bg} border ${item.border} rounded-[20px] p-3 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center justify-center gap-2 aspect-square group`}>
             <div className={`w-12 h-12 rounded-full ${item.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
               <item.icon className={`w-5 h-5 ${item.iconColor}`} strokeWidth={2.5} />
             </div>
             <span className={`text-[11px] font-bold ${item.color}`}>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Action Required / Expiring Soon */}
      <div>
        <div className="flex justify-between items-center mb-4 px-1">
          <h3 className="font-black text-[18px] text-[#0F172A] tracking-tight">Expiring Soon</h3>
          <button className="text-[12px] font-bold text-[#107050] hover:underline">See all</button>
        </div>

        <div className="flex flex-col gap-3">
          {urgentItems.map((item, index) => (
            <Card key={index} className="px-4 py-3 bg-white border border-[#E2E8F0] rounded-[20px] shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#F8FAFC] border border-[#F1F5F9] shrink-0 p-1 relative">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-[12px] mix-blend-multiply" />
              </div>
              
              <div className="flex-1 min-w-0 flex flex-col justify-center py-1">
                 <h4 className="font-bold text-[15px] text-[#0F172A] mb-1 truncate leading-none">{item.name}</h4>
                 <div className="flex items-center gap-1.5 mt-1.5">
                   <ProgressBar value={item.status === 'expired' ? 100 : 80} variant={item.status === 'expired' ? 'danger' : 'warning'} className="w-full h-[5px] bg-[#F1F5F9]" />
                 </div>
              </div>

              <div className="flex flex-col items-end justify-center shrink-0">
                 {item.status === 'expired' ? (
                   <span className="text-[11px] font-black text-[#EF4444] bg-[#FEF2F2] px-2.5 py-1 rounded-md uppercase tracking-wide">Expired</span>
                 ) : (
                   <span className="text-[11px] font-black text-[#F59E0B] bg-[#FFFBEB] px-2.5 py-1 rounded-md uppercase tracking-wide">1 Day Left</span>
                 )}
                 <span className="text-[11px] font-bold text-[#64748B] mt-1.5">{item.quantity}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Perfect Pairings / AI Suggestions Placeholder aligned with dash1 styling */}
      <div className="mt-8 mb-4">
        <h3 className="font-black text-[18px] text-[#0F172A] tracking-tight px-1 mb-4 flex items-center gap-2">
           Recipes for you <Sparkles className="w-4 h-4 text-[#F59E0B]" />
        </h3>
        
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-6 px-1">
           <Card className="min-w-[220px] w-[220px] p-0 rounded-[20px] bg-white border border-[#E2E8F0] shadow-sm overflow-hidden shrink-0 group cursor-pointer block">
              <div className="h-32 relative">
                <img src="https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&q=80" alt="Recipe" className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[#0F172A] text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                   <CheckCircle2 className="w-3 h-3 text-[#10B981]" /> 100% Match
                </div>
              </div>
              <div className="p-4">
                 <h4 className="font-bold text-[14px] text-[#0F172A] mb-1 leading-tight group-hover:text-[#107050] transition-colors">Sadza & Leafy Greens</h4>
                 <p className="text-[12px] text-[#64748B] font-medium flex items-center gap-4">
                    <span>20 min</span>
                    <span className="w-1 h-1 rounded-full bg-[#CBD5E1]"></span>
                    <span>Beginner</span>
                 </p>
              </div>
           </Card>

           <Card className="min-w-[220px] w-[220px] p-0 rounded-[20px] bg-white border border-[#E2E8F0] shadow-sm overflow-hidden shrink-0 group cursor-pointer block">
              <div className="h-32 relative">
                <img src="https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80" alt="Recipe" className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[#0F172A] text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                   <CheckCircle2 className="w-3 h-3 text-[#10B981]" /> 80% Match
                </div>
              </div>
              <div className="p-4">
                 <h4 className="font-bold text-[14px] text-[#0F172A] mb-1 leading-tight group-hover:text-[#107050] transition-colors">Hearty Kale Stew</h4>
                 <p className="text-[12px] text-[#64748B] font-medium flex items-center gap-4">
                    <span>35 min</span>
                    <span className="w-1 h-1 rounded-full bg-[#CBD5E1]"></span>
                    <span>Medium</span>
                 </p>
              </div>
           </Card>
        </div>
      </div>

    </div>
  );
};

export { Dashboard };

function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}

