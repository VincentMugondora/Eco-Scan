import React from 'react';
import { ChefHat, ArrowRight, Scan, Utensils, Sparkles, Calendar } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const RightSidebar = () => {
  return (
    <aside className="hidden lg:flex flex-col w-[320px] xl:w-[350px] h-screen bg-white border-l border-[#F1F5F9] px-6 py-8 sticky top-0 overflow-y-auto">
      <div className="flex items-center gap-2 mb-1.5">
        <ChefHat className="text-[#0F172A] w-5 h-5" strokeWidth={2.5} />
        <h2 className="text-[15px] font-black text-[#0F172A]">AI Chef's Corner</h2>
      </div>
      <p className="text-[12px] text-[#64748B] mb-8 font-medium">Smart suggestions based on your selection</p>

      {/* Meal of the Day */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-[#64748B]">Meal of the day</h3>
          <span className="text-[10px] font-bold text-primary">Daily Pick</span>
        </div>
        
        <Card className="p-0 overflow-hidden border-none shadow-[0_4px_25px_-4px_rgba(0,0,0,0.08)] rounded-[20px]">
          <div className="relative h-[180px]">
            <img 
              src="https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=400&auto=format&fit=crop" 
              alt="Harvest Veggie Medley" 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A2E1F]/90 via-[#0A2E1F]/20 to-transparent" />
            
            <div className="absolute top-4 left-4">
              <Badge className="bg-primary hover:bg-primary text-white border-none py-1 px-3 text-[10px] font-bold">Zero Waste</Badge>
            </div>
            
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <h4 className="font-black text-[18px] leading-[1.1] mb-2 drop-shadow-sm">Harvest Veggie Medley</h4>
              <p className="text-[11px] text-white/90 font-medium flex items-center gap-3">
                <span className="flex items-center gap-1.5"><svg className="w-3.5 h-3.5 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> 20m</span>
                <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-white/90" /> Expert</span>
              </p>
            </div>
          </div>
          
          <div className="p-4 bg-white">
            <p className="text-[12px] text-[#4A5568] mb-4 leading-[1.6]">
              Uses 100% of your expiring <span className="font-black text-[#0F172A]">Spinach</span> and <span className="font-black text-[#0F172A]">Oat Milk</span>.
            </p>
            <Button variant="secondary" className="w-full bg-[#E6F4F0] text-primary hover:bg-[#D1EBE3] justify-center text-[12px] h-10 font-bold gap-2 py-0 rounded-xl">
              View Recipe <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-[11px] font-black uppercase tracking-widest text-[#64748B] mb-5">Recent Activity</h3>
        <div className="flex flex-col gap-6">
          <div className="flex gap-4 items-start">
            <div className="w-9 h-9 border border-[#E2E8F0] rounded-full bg-white flex items-center justify-center shrink-0">
              <Scan className="w-4 h-4 text-[#64748B]" />
            </div>
            <div className="pt-0.5">
              <p className="text-[14px] font-bold text-[#0F172A] leading-tight mb-0.5">Scanned 4 items</p>
              <p className="text-[12px] text-[#94A3B8] font-medium">2h ago</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="w-9 h-9 border border-[#E2E8F0] rounded-full bg-white flex items-center justify-center shrink-0">
              <Utensils className="w-4 h-4 text-[#64748B]" />
            </div>
            <div className="pt-0.5">
              <p className="text-[14px] font-bold text-[#0F172A] leading-tight mb-0.5">Cooked Curry Medley</p>
              <p className="text-[12px] text-[#94A3B8] font-medium">Yesterday</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="w-9 h-9 border border-[#E2E8F0] rounded-full bg-white flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-[#64748B]" />
            </div>
            <div className="pt-0.5">
              <p className="text-[14px] font-bold text-[#0F172A] leading-tight mb-0.5">Impact Milestone hit!</p>
              <p className="text-[12px] text-[#94A3B8] font-medium">2d ago</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-10 pb-4">
        <div className="border-[1.5px] border-dashed border-[#E2E8F0] bg-white rounded-2xl p-6 flex flex-col items-center text-center">
          <Calendar className="w-7 h-7 text-[#94A3B8] mb-3" strokeWidth={1.5} />
          <h4 className="font-bold text-[14px] text-[#0F172A] mb-1.5">Weekly Meal Planner</h4>
          <p className="text-[12px] text-[#64748B] mb-5 leading-relaxed px-2">Upgrade to Pro to sync with your Google Calendar and automate shopping lists.</p>
          <Button variant="outline" className="w-full text-[13px] font-bold h-10 rounded-xl border-[#E2E8F0] text-[#4A5568] hover:bg-[#F8FAFC]">Explore Pro</Button>
        </div>
      </div>
    </aside>
  );
};

