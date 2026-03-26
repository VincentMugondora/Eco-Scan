import React from "react";
import { LayoutGrid, ClipboardList, Scan, Target, Bell, User, Sparkles, Droplets, Scale, ArrowRight, ChevronRight, AlertCircle, Plus } from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { ProgressBar } from "../ui/ProgressBar";
import { IMPACT_STATS, PANTRY_ITEMS, ACTION_REQUIRED_ITEMS } from "../../data/mockData";
import { motion } from "framer-motion";

const Dashboard = () => {
  const urgentItems = PANTRY_ITEMS.filter(item => item.status === "expired" || item.status === "soon").slice(0, 2);

  return (
    <div className="flex flex-col gap-6 lg:gap-8 pb-32 pt-2 lg:pt-8 lg:px-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex justify-between items-center px-4 lg:px-2">
        <div className="flex flex-col">
          <p className="text-[13px] text-[#64748B] font-bold tracking-wide uppercase mb-0.5">Welcome back</p>
          <h1 className="text-2xl lg:text-3xl font-black text-[#0F172A] tracking-tight">Vincent</h1>
        </div>
        <div className="relative cursor-pointer hover:opacity-90 transition-opacity">
          <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full border-[3px] border-white shadow-md overflow-hidden relative">
            <img 
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-[#10B981] border-2 border-white rounded-full"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-4 lg:px-2">
        
        {/* Main Left Column for Desktop */}
        <div className="lg:col-span-8 flex flex-col gap-6 lg:gap-8">
          
          {/* Hero Impact Card */}
          <Card className="p-6 lg:p-8 bg-white border-[#E2E8F0] shadow-sm rounded-[24px] lg:rounded-[32px] relative overflow-hidden flex flex-col sm:flex-row justify-between items-center gap-6 group hover:shadow-md transition-shadow">
            <div className="w-full sm:w-[55%] flex flex-col justify-center relative z-10">
              <Badge className="bg-[#E6F4F0] text-[#107050] text-[10px] font-black uppercase tracking-widest px-2.5 py-1 border-none mb-5 rounded-md self-start">WEEKLY IMPACT</Badge>
              <h2 className="text-[40px] lg:text-[48px] font-black text-[#0F172A] leading-[1] mb-1 tracking-tighter">
                {IMPACT_STATS.weeklyCO2}<span className="text-[20px] text-[#64748B] font-bold ml-1 tracking-normal">kg</span>
              </h2>
              <p className="text-[16px] text-[#64748B] font-medium mb-5">CO2e Saved</p>
              <p className="text-[12px] text-[#4A5568] leading-[1.6] mb-6 font-medium max-w-[240px]">
                You are performing <span className="font-bold text-[#107050]">18% better</span> than your 2025 average!
              </p>
              <button className="text-[13px] font-bold text-[#107050] flex items-center gap-1.5 hover:gap-2 transition-all w-fit">
                View full report <ArrowRight className="w-4 h-4" strokeWidth={3} />
              </button>
            </div>
            
            <div className="w-full sm:w-[45%] flex justify-center items-center relative py-4 sm:py-0">
               {/* Decorative background blur */}
               <div className="absolute inset-0 bg-gradient-to-tr from-[#107050]/5 to-[#10B981]/5 rounded-full blur-3xl scale-150 group-hover:scale-110 transition-transform duration-700"></div>
               
               <div className="relative w-[140px] h-[140px] lg:w-[180px] lg:h-[180px]">
                 <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full drop-shadow-sm">
                   {/* Background track */}
                   <circle cx="50" cy="50" r="42" fill="transparent" stroke="#F1F5F9" strokeWidth="10" />
                   {/* Progress stroke with gradient simulation (using multiple paths or a single bright color) */}
                   <defs>
                     <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                       <stop offset="0%" stopColor="#10B981" />
                       <stop offset="100%" stopColor="#107050" />
                     </linearGradient>
                   </defs>
                   <circle 
                     cx="50" 
                     cy="50" 
                     r="42" 
                     fill="transparent" 
                     stroke="url(#progressGrad)" 
                     strokeWidth="10" 
                     strokeDasharray="264" 
                     strokeDashoffset={264 - (264 * (IMPACT_STATS.weeklyCO2 / IMPACT_STATS.goalCO2))} 
                     strokeLinecap="round" 
                     className="transition-all duration-1000 ease-out"
                   />
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
                    <span className="text-[28px] lg:text-[36px] font-black text-[#0F172A] tracking-tighter">
                       {Math.round((IMPACT_STATS.weeklyCO2 / IMPACT_STATS.goalCO2) * 100)}%
                    </span>
                    <span className="text-[9px] font-bold text-[#64748B] uppercase tracking-widest mt-0.5">OF GOAL</span>
                 </div>
               </div>
            </div>
          </Card>

          {/* Secondary Stats */}
          <div className="grid grid-cols-2 gap-4 lg:gap-6">
            <Card className="bg-white border-[#E2E8F0] p-4 lg:p-6 rounded-[20px] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="flex items-start justify-between mb-4">
                 <div className="w-10 h-10 rounded-full bg-[#EFF6FF] text-[#3B82F6] flex items-center justify-center">
                    <Droplets className="w-5 h-5" strokeWidth={2.5} />
                 </div>
              </div>
              <div>
                 <p className="text-[10px] font-black text-[#64748B] uppercase tracking-widest mb-1.5 flex items-center gap-1.5">Water Saved</p>
                 <p className="text-[24px] lg:text-[28px] font-black text-[#0F172A] tracking-tight">{IMPACT_STATS.waterSaved.toLocaleString()}<span className="text-[12px] text-[#64748B] ml-1 font-bold">Liters</span></p>
              </div>
            </Card>
            <Card className="bg-white border-[#E2E8F0] p-4 lg:p-6 rounded-[20px] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="flex items-start justify-between mb-4">
                 <div className="w-10 h-10 rounded-full bg-[#FFF7ED] text-[#F59E0B] flex items-center justify-center">
                    <Scale className="w-5 h-5" strokeWidth={2.5} />
                 </div>
              </div>
              <div>
                 <p className="text-[10px] font-black text-[#64748B] uppercase tracking-widest mb-1.5 flex items-center gap-1.5">Meals Rescued</p>
                 <p className="text-[24px] lg:text-[28px] font-black text-[#0F172A] tracking-tight">{IMPACT_STATS.mealsSaved}<span className="text-[12px] text-[#64748B] ml-1 font-bold">Full Meals</span></p>
              </div>
            </Card>
          </div>

          {/* Quick Actions (Desktop only, mobile moved below) */}
          <div className="hidden lg:block mt-2">
            <h3 className="text-[16px] font-black text-[#0F172A] mb-4">Quick Actions</h3>
            <div className="grid grid-cols-4 gap-4">
              {[
                { icon: Plus, label: "Add Item", desc: "Manual entry", color: "text-[#107050]", bg: "bg-[#F3FAF7]" },
                { icon: Scan, label: "Scan Receipt", desc: "Auto capture", color: "text-[#3B82F6]", bg: "bg-[#EFF6FF]" },
                { icon: Target, label: "Find Recipe", desc: "AI suggested", color: "text-[#F59E0B]", bg: "bg-[#FFF7ED]" },
                { icon: ClipboardList, label: "Reports", desc: "View analytics", color: "text-[#8B5CF6]", bg: "bg-[#F5F3FF]" },
              ].map((action, i) => (
                <Card key={i} className="p-4 border-[#E2E8F0] shadow-sm hover:border-[#CBD5E1] hover:shadow-md cursor-pointer transition-all flex flex-col items-start rounded-[20px] group">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${action.bg} ${action.color} group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-5 h-5" strokeWidth={2.5} />
                  </div>
                  <span className="font-bold text-[14px] text-[#0F172A] mb-0.5">{action.label}</span>
                  <span className="text-[11px] text-[#64748B] font-medium">{action.desc}</span>
                </Card>
              ))}
            </div>
          </div>
          
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 flex flex-col gap-6 lg:gap-8">
          
          {/* Quick Actions (Mobile) */}
          <div className="lg:hidden">
            <h3 className="text-[14px] font-black text-[#0F172A] mb-3 px-1">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Plus, label: "Add Item", color: "text-[#107050]", bg: "bg-[#F3FAF7]" },
                { icon: Scan, label: "Scan Receipt", color: "text-[#3B82F6]", bg: "bg-[#EFF6FF]" },
                { icon: Target, label: "Find Recipe", color: "text-[#F59E0B]", bg: "bg-[#FFF7ED]" },
                { icon: ClipboardList, label: "Reports", color: "text-[#8B5CF6]", bg: "bg-[#F5F3FF]" },
              ].map((action, i) => (
                <Card key={i} className="p-3 border-[#E2E8F0] shadow-sm flex items-center gap-3 rounded-[16px] active:scale-95 transition-transform">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${action.bg} ${action.color}`}>
                    <action.icon className="w-5 h-5" strokeWidth={2.5} />
                  </div>
                  <span className="font-bold text-[13px] text-[#0F172A]">{action.label}</span>
                </Card>
              ))}
            </div>
          </div>

          {/* Sustainability Tip */}
          <Card className="p-6 bg-[#1A202C] border-none shadow-[0_10px_30px_-10px_rgba(26,32,44,0.3)] rounded-[24px] lg:rounded-[32px] text-white relative flex flex-col overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#10B981] opacity-20 blur-[50px] group-hover:opacity-40 transition-opacity duration-500"></div>
            
            <div className="flex items-center gap-2 mb-4 relative z-10">
              <div className="w-8 h-8 rounded-full bg-[#2D3748] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#34D399]" />
              </div>
              <h3 className="text-[14px] font-black text-white tracking-wide">AI Recommendation</h3>
            </div>
            
            <p className="text-[13px] lg:text-[14px] text-[#E2E8F0] leading-[1.6] mb-5 font-medium relative z-10">
              Freezing your <span className="font-bold text-[#A7F3D0]">tomatoes</span> now will preserve their nutrients for up to 3 months and save <span className="font-bold text-[#A7F3D0]">2.5kg CO2e</span>.
            </p>
            
            <Button className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-bold text-[13px] py-2.5 h-auto rounded-[12px] border-none shadow-none z-10 mt-auto">
              Learn Preservation
            </Button>
          </Card>

          {/* Action Required */}
          <div>
            <div className="flex justify-between items-center mb-4 px-1">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#EF4444]" strokeWidth={2.5} />
                <h3 className="font-black text-[16px] text-[#0F172A]">Action Required</h3>
              </div>
              <button className="text-[#64748B] text-[12px] font-bold hover:text-[#0F172A] transition-colors flex items-center gap-0.5">
                View All <ChevronRight className="w-3.5 h-3.5" strokeWidth={2.5}/>
              </button>
            </div>

            <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 no-scrollbar items-start lg:items-stretch pl-1 pr-4 lg:px-0">
              {ACTION_REQUIRED_ITEMS.map((item) => (
                <Card key={item.id} className="min-w-[240px] lg:min-w-0 p-3 lg:p-4 border-[#E2E8F0] bg-white rounded-[20px] shadow-sm flex items-center gap-4 shrink-0 hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-[14px] overflow-hidden shrink-0 relative bg-[#F1F5F9]">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply opacity-95" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex items-start justify-between mb-1.5 gap-2">
                      <h4 className="font-black text-[14px] text-[#0F172A] truncate leading-tight">{item.name}</h4>
                      <Badge className="bg-[#FEF2F2] text-[#EF4444] text-[9px] font-black uppercase tracking-wider px-2 py-0.5 border-none shadow-none shrink-0 rounded-md">
                        {item.timeLeft.replace(' left', '')}
                      </Badge>
                    </div>
                    <ProgressBar value={85} variant="danger" className="h-[4px] bg-[#F1F5F9] mb-1.5" />
                    <p className="text-[11px] text-[#64748B] font-bold">{item.quantity} remaining</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export { Dashboard };

function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}

