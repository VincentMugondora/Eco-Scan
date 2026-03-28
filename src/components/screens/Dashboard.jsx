import React, { useState, useEffect } from "react";
import { Search, Bell, Grid, Plus, ScanLine, Utensils, Sparkles, ChevronRight, CheckCircle2 } from "lucide-react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { ProgressBar } from "../ui/ProgressBar";
import { IMPACT_STATS, PANTRY_ITEMS, ACTION_REQUIRED_ITEMS } from "../../data/mockData";
import { motion } from "framer-motion";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const chartData = [
  { day: 'Mon', co2: 1.2 },
  { day: 'Tue', co2: 2.1 },
  { day: 'Wed', co2: 1.8 },
  { day: 'Thu', co2: 3.4 },
  { day: 'Fri', co2: 2.8 },
  { day: 'Sat', co2: 4.1 },
  { day: 'Sun', co2: 12.4 },
];

import { usePantry } from "../../hooks/usePantry";
import { useUserLocation } from "../../hooks/useUserLocation";
import { calculateCO2eSaved } from "../../utils/impactMath";
import { calculateLocalImpact } from "../../services/impactLogic";
import { supabase } from "../../utils/supabaseClient";

const Dashboard = ({ setActiveTab }) => {
  const { items, loading: pantryLoading } = usePantry();
  const { city, loading: locationLoading } = useUserLocation();
  
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [greeting, setGreeting] = useState("Hello,");
  const [userLoading, setUserLoading] = useState(true);

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Fallback to email prefix if no full_name is set
          const name = user.user_metadata?.full_name || user.email?.split('@')[0] || "Eco Warrior";
          setUserName(name.split(' ')[0]); // Use first name for casual greeting
          setUserEmail(user.email || "");
        }
      } catch (err) {
        console.error("Error fetching user session:", err);
      } finally {
        setUserLoading(false);
      }
    };
    fetchUser();

    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning,");
    else if (hour < 18) setGreeting("Good afternoon,");
    else setGreeting("Good evening,");
  }, []);

  // Calculate Scientific Carbon Impact using shared logic
  const totalImpact = items.reduce((acc, item) => {
    return acc + calculateCO2eSaved(item.weight_kg, item.carbon_impact_factor);
  }, 0);

  // City-adjusted local impact
  const localImpact = calculateLocalImpact(items, city);

  const urgentItems = items.filter(item => 
    item.status === 'warning' && !item.is_cooked
  ).slice(0, 5); // Show more urgent items if available

  // Generate dynamic chart data based on items added per day (simplified for demo)
  const dynamicChartData = [
    { day: 'Mon', co2: totalImpact * 0.1 },
    { day: 'Tue', co2: totalImpact * 0.3 },
    { day: 'Wed', co2: totalImpact * 0.2 },
    { day: 'Thu', co2: totalImpact * 0.5 },
    { day: 'Fri', co2: totalImpact * 0.4 },
    { day: 'Sat', co2: totalImpact * 0.8 },
    { day: 'Sun', co2: totalImpact },
  ];

  if (pantryLoading || userLoading || locationLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#107050]"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col pb-32 pt-2 px-4 lg:px-8 max-w-7xl mx-auto w-full min-h-screen font-sans bg-[#F8FAFC]">
      
      {/* Top App Bar */}
      <div className="flex justify-between items-center mb-6 pt-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden relative bg-[#F1F5F9] flex items-center justify-center">
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userEmail || 'default'}&backgroundColor=e2e8f0`} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
             <p className="text-[12px] text-[#64748B] font-medium leading-tight">{greeting}</p>
             <h1 className="text-[18px] font-black text-[#0F172A] leading-tight tracking-tight">{userName || "Eco Warrior"}</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <button className="w-10 h-10 rounded-full bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-center text-[#4A5568] hover:bg-[#F1F5F9] transition-colors">
              <Search className="w-5 h-5" strokeWidth={2.5} />
           </button>
           <button className="w-10 h-10 rounded-full bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-center text-[#4A5568] hover:bg-[#F1F5F9] transition-colors">
              <Bell className="w-5 h-5" strokeWidth={2.5} />
              <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-[#EF4444] border-2 border-white rounded-full"></div>
           </button>
        </div>
      </div>

      {/* Hero Eco-Score Card */}
      <Card className="p-0 bg-[#107050] border-none shadow-[0_20px_40px_-15px_rgba(16,112,80,0.5)] rounded-[24px] lg:rounded-[32px] relative overflow-hidden mb-8 text-white min-h-[340px] lg:min-h-[300px]">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white opacity-10 rounded-full blur-[60px]"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#065A3F] opacity-50 rounded-full blur-[40px]"></div>

        <div className="p-6 lg:p-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
           <div>
             <div className="flex items-center gap-2 mb-3">
               <Sparkles className="w-4 h-4 text-[#A7F3D0]" />
               <span className="text-[11px] font-black uppercase tracking-widest text-[#D1EBE3]">
                 Impact in {city.name}
               </span>
             </div>
             <h2 className="text-[32px] lg:text-[40px] font-black leading-tight tracking-tight mb-2">
                {localImpact.adjustedCO2eSavedKg.toFixed(1)} <span className="text-[20px] font-bold text-[#D1EBE3]">kg CO₂e</span>
             </h2>
             <p className="text-[13px] text-[#A7F3D0] max-w-[200px] leading-relaxed font-medium">
               You are tracking <span className="text-white font-bold">{items.length}</span> items and reducing your footprint!
             </p>

             {/* Local Hero stat */}
             {localImpact.zupcoKmEquivalent > 0 && (
               <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/10 max-w-[240px]">
                 <p className="text-[10px] font-black uppercase tracking-widest text-[#A7F3D0] mb-1">🏆 Local Hero</p>
                 <p className="text-[12px] text-white font-medium leading-snug">
                   You've saved enough CO₂e to offset{" "}
                   <span className="font-black text-[#A7F3D0]">{localImpact.zupcoKmEquivalent} km</span>{" "}
                   of travel on a {city.transportLabel}
                 </p>
               </div>
             )}
             
             <button 
              onClick={() => setActiveTab('impact')}
              className="mt-6 bg-white/10 hover:bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-xl text-[12px] font-black transition-all flex items-center gap-2 group w-fit"
            >
               View Details <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
            </button>
           </div>
           
           <div className="w-full h-80 min-h-[320px] relative">
              <ResponsiveContainer minWidth={0} width="99%" height="100%">
                <AreaChart data={dynamicChartData}>
                  <defs>
                    <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#A7F3D0" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#A7F3D0" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0F172A', border: 'none', borderRadius: '12px', color: '#fff' }}
                    itemStyle={{ color: '#10B981', fontWeight: 'bold' }}
                    labelStyle={{ color: '#94A3B8', fontSize: '10px' }}
                  />
                  <Area type="monotone" dataKey="co2" stroke="#A7F3D0" strokeWidth={3} fillOpacity={1} fill="url(#colorCo2)" />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>
        
        <div className="bg-[#0A4A35]/40 backdrop-blur-md px-6 py-4 flex justify-between items-center z-10 relative border-t border-white/5">
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                 <span className="text-[11px] font-bold text-[#D1EBE3]">Inventory Items: {items.length}</span>
              </div>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-12 h-8 rounded-full bg-white/10 flex items-center justify-center font-black text-[12px] px-2">
                 Eco v1
              </div>
           </div>
        </div>
      </Card>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-4 gap-3 mb-8">
        {[
          { id: "scan", icon: Plus, label: "Add", bg: "bg-white", border: "border-[#E2E8F0]", color: "text-[#0F172A]", iconBg: "bg-[#F8FAFC]", iconColor: "text-[#64748B]" },
          { id: "scan", icon: ScanLine, label: "Scan Item", bg: "bg-[#107050]", border: "border-[#107050]", color: "text-white", iconBg: "bg-white/20", iconColor: "text-white" },
          { id: "impact", icon: Utensils, label: "Recipes", bg: "bg-white", border: "border-[#E2E8F0]", color: "text-[#0F172A]", iconBg: "bg-[#FFF7ED]", iconColor: "text-[#F59E0B]" },
          { id: "pantry", icon: Grid, label: "Pantry", bg: "bg-white", border: "border-[#E2E8F0]", color: "text-[#0F172A]", iconBg: "bg-[#F3FAF7]", iconColor: "text-[#107050]" },
        ].map((item) => (
          <button 
            key={item.label} 
            onClick={() => setActiveTab(item.id)}
            className={`${item.bg} border ${item.border} rounded-[20px] p-3 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center justify-center gap-2 aspect-square group`}
          >
             <div className={`w-12 h-12 rounded-full ${item.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
               <item.icon className={`w-5 h-5 ${item.iconColor}`} strokeWidth={2.5} />
             </div>
             <span className={`text-[11px] font-bold ${item.color}`}>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Expiring Soon */}
      <div>
        <div className="flex justify-between items-center mb-4 px-1">
          <h3 className="font-black text-[18px] text-[#0F172A] tracking-tight">Expiring Soon</h3>
          <button onClick={() => setActiveTab('pantry')} className="text-[12px] font-bold text-[#107050] hover:underline">See all</button>
        </div>

          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-1 px-1">
            {urgentItems.length > 0 ? urgentItems.map((item, index) => (
              <Card key={index} className="min-w-[280px] w-[280px] px-4 py-4 bg-white border border-[#E2E8F0] rounded-[24px] shadow-sm flex items-center gap-4 shrink-0 transition-transform hover:scale-[1.02]">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 shrink-0 p-1 flex items-center justify-center">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.item_name} className="w-full h-full object-contain rounded-[12px]" />
                  ) : (
                    <Utensils className="w-6 h-6 text-amber-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                   <h4 className="font-bold text-[15px] text-[#0F172A] mb-1 truncate">{item.item_name}</h4>
                   <div className="flex items-center gap-2">
                     <span className="text-[10px] font-black uppercase tracking-wider text-amber-600">Urgent</span>
                     <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                     <span className="text-[11px] font-bold text-slate-500">Expiring soon</span>
                   </div>
                </div>
              </Card>
            )) : (
              <div className="w-full py-8 text-center bg-white rounded-[24px] border border-dashed border-slate-200">
                <p className="text-slate-400 font-medium text-sm">No urgent items. Great job! 🌿</p>
              </div>
            )}
          </div>
      </div>
      {/* Perfect Pairings / AI Suggestions Placeholder */}
      <div className="mt-8 mb-4 px-1">
        <h3 className="font-black text-[18px] text-[#0F172A] tracking-tight mb-4 flex items-center gap-2">
           Recipes for you <Sparkles className="w-4 h-4 text-[#F59E0B]" />
        </h3>
        
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-6">
           <Card 
             onClick={() => setActiveTab('impact')}
             className="min-w-[220px] w-[220px] p-0 rounded-[20px] bg-white border border-[#E2E8F0] shadow-sm overflow-hidden shrink-0 group cursor-pointer block"
           >
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

           <Card 
             onClick={() => setActiveTab('impact')}
             className="min-w-[220px] w-[220px] p-0 rounded-[20px] bg-white border border-[#E2E8F0] shadow-sm overflow-hidden shrink-0 group cursor-pointer block"
           >
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

