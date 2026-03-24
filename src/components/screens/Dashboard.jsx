import React from "react";
import { LayoutGrid, ClipboardList, Scan, Target, Bell, User } from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { ProgressBar } from "../ui/ProgressBar";
import { IMPACT_STATS, PANTRY_ITEMS } from "../../data/mockData";
import { motion } from "framer-motion";

const Dashboard = () => {
  const urgentItems = PANTRY_ITEMS.filter(item => item.status === "expired" || item.status === "soon").slice(0, 2);

  return (
    <div className="flex flex-col gap-6 pb-24">
      {/* Header */}
      <div className="flex justify-between items-center px-4 pt-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-text-primary rounded-xl flex items-center justify-center">
            <Scan className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold">Home</h1>
        </div>
        <div className="relative">
          <img 
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop" 
            alt="Profile" 
            className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
          />
        </div>
      </div>

      {/* Impact Card */}
      <div className="px-4">
        <Card className="relative overflow-hidden border-none shadow-lg bg-white">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-lg font-bold">Your Weekly Impact</h2>
              <p className="text-text-secondary text-xs">Progress against {IMPACT_STATS.goalCO2}kg goal</p>
            </div>
            <Badge variant="success" className="bg-[#E6F4F0] text-primary">Level {IMPACT_STATS.level}</Badge>
          </div>

          <div className="flex flex-col items-center my-6">
            <div className="relative w-40 h-20 overflow-hidden">
               <svg viewBox="0 0 100 50" className="w-full h-full">
                  <path 
                    d="M 10 50 A 40 40 0 0 1 90 50" 
                    fill="none" 
                    stroke="#F1F5F9" 
                    strokeWidth="8" 
                    strokeLinecap="round"
                  />
                  <path 
                    d="M 10 50 A 40 40 0 0 1 90 50" 
                    fill="none" 
                    stroke="#067A57" 
                    strokeWidth="8" 
                    strokeLinecap="round"
                    strokeDasharray="125.6"
                    strokeDashoffset={125.6 * (1 - IMPACT_STATS.weeklyCO2 / IMPACT_STATS.goalCO2)}
                  />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
                  <span className="text-3xl font-black">{IMPACT_STATS.weeklyCO2}</span>
                  <span className="text-[10px] text-text-secondary font-bold uppercase tracking-widest">KG CO2e</span>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-[#EEF2FF] p-3 rounded-2xl">
              <p className="text-[10px] font-bold text-[#4338CA] uppercase flex items-center gap-1">
                <span className="w-1 h-1 bg-[#4338CA] rounded-full" /> Water Saved
              </p>
              <p className="text-lg font-black text-[#4338CA]">{IMPACT_STATS.waterSaved.toLocaleString()}</p>
            </div>
            <div className="bg-[#ECFDF5] p-3 rounded-2xl">
              <p className="text-[10px] font-bold text-primary uppercase flex items-center gap-1">
                <span className="w-1 h-1 bg-primary rounded-full" /> Meals Saved
              </p>
              <p className="text-lg font-black text-primary">{IMPACT_STATS.mealsSaved} <span className="text-xs font-medium">Saved</span></p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-2 px-4">
        {[
          { icon: LayoutGrid, label: "Add", color: "bg-primary" },
          { icon: Scan, label: "Scan", color: "bg-[#067A57]" },
          { icon: Target, label: "Recipes", color: "bg-[#067A57]" },
          { icon: ClipboardList, label: "Report", color: "bg-[#067A57]" },
        ].map((action, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <Button size="icon" className={cn("w-14 h-14 rounded-full shadow-lg", action.color)}>
              <action.icon className="text-white w-6 h-6" />
            </Button>
            <span className="text-[10px] font-bold text-text-secondary">{action.label}</span>
          </div>
        ))}
      </div>

      {/* Action Required */}
      <div className="px-4 mt-2">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
              <Bell className="text-danger w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base">Action Required</h3>
              <p className="text-[10px] text-text-secondary">Expiring in less than 48 hours</p>
            </div>
          </div>
          <button className="text-primary text-xs font-bold">View All</button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {urgentItems.map((item) => (
            <Card key={item.id} className="min-w-[200px] p-0 overflow-hidden shrink-0 border-gray-100 flex flex-col">
              <div className="relative h-28">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2">
                   <Badge variant={item.status === 'expired' ? 'danger' : 'warning'} className="backdrop-blur-md bg-white/80 lowercase">
                     {item.status === 'expired' ? 'Expired' : '14h'}
                   </Badge>
                </div>
              </div>
              <div className="p-3">
                <h4 className="font-bold text-sm truncate">{item.name}</h4>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <ProgressBar value={item.status === 'expired' ? 100 : 70} variant={item.status === 'expired' ? 'danger' : 'warning'} className="flex-1" />
                  <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center">
                     <svg className="w-3 h-3 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                     </svg>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Sustainability Tip */}
      <div className="px-4">
        <Card className="bg-[#ECFDF5] border-none flex gap-4 p-4">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shrink-0 shadow-lg">
            <Target className="text-white w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm">AI Sustainability Tip</h4>
            <p className="text-[11px] text-text-secondary leading-relaxed mt-1">
              Freezing those tomatoes now can preserve their nutrients for up to 3 months!
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export { Dashboard };

function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}
