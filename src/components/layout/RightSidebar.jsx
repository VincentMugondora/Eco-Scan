import React from 'react';
import { ChefHat, ArrowRight, Scan, Target, Calendar } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const RightSidebar = () => {
  return (
    <aside className="hidden lg:flex flex-col w-full h-screen bg-[#F8F9FA] border-l border-gray-100 p-6 sticky top-0 overflow-y-auto @container">
      <div className="flex items-center gap-2 mb-2">
        <ChefHat className="text-primary w-5 h-5" />
        <h2 className="text-lg font-bold">AI Chef's Corner</h2>
      </div>
      <p className="text-xs text-text-secondary mb-8">Smart suggestions based on your selection</p>

      {/* Meal of the Day */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-[#4A5568]">Meal of the day</h3>
          <span className="text-[10px] font-bold text-primary">Daily Pick</span>
        </div>
        
        <Card className="p-0 overflow-hidden border-none shadow-lg">
          <div className="relative h-40">
            <img 
              src="https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=400&auto=format&fit=crop" 
              alt="Harvest Veggie Medley" 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            
            <div className="absolute top-4 left-4">
              <Badge className="bg-primary text-white border-none py-1">Zero Waste</Badge>
            </div>
            
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <h4 className="font-black text-lg leading-tight mb-1">Harvest Veggie Medley</h4>
              <p className="text-[10px] text-white/90 font-medium flex items-center gap-2">
                <span className="flex items-center gap-1"><svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> 20m</span>
                <span className="flex items-center gap-1"><svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg> Expert</span>
              </p>
            </div>
          </div>
          
          <div className="p-4 bg-white">
            <p className="text-xs text-text-secondary mb-4 @[250px]:text-sm">
              Uses 100% of your expiring <span className="font-bold text-text-primary">Spinach</span> and <span className="font-bold text-text-primary">Oat Milk</span>.
            </p>
            <Button variant="secondary" className="w-full bg-[#E6F4F0] text-primary hover:bg-[#D1EBE3] justify-center text-sm font-bold gap-2 py-2">
              View Recipe <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-xs font-black uppercase tracking-widest text-[#4A5568] mb-4">Recent Activity</h3>
        <div className="flex flex-col gap-6">
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0">
              <Scan className="w-4 h-4 text-text-secondary" />
            </div>
            <div>
              <p className="text-sm font-bold text-text-primary leading-tight">Scanned 4 items</p>
              <p className="text-[10px] text-text-secondary mt-0.5">2h ago</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0">
              <ChefHat className="w-4 h-4 text-text-secondary" />
            </div>
            <div>
              <p className="text-sm font-bold text-text-primary leading-tight">Cooked Curry Medley</p>
              <p className="text-[10px] text-text-secondary mt-0.5">Yesterday</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0">
              <Target className="w-4 h-4 text-text-secondary" />
            </div>
            <div>
              <p className="text-sm font-bold text-text-primary leading-tight">Impact Milestone hit!</p>
              <p className="text-[10px] text-text-secondary mt-0.5">2d ago</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-8">
        <div className="border border-dashed bg-white border-gray-300 rounded-2xl p-6 flex flex-col items-center text-center">
          <Calendar className="w-8 h-8 text-gray-400 mb-3" />
          <h4 className="font-bold text-sm mb-2">Weekly Meal Planner</h4>
          <p className="text-[11px] text-text-secondary mb-4">Upgrade to Pro to sync with your Google Calendar and automate shopping lists.</p>
          <Button variant="outline" className="w-full text-xs rounded-xl py-2">Explore Pro</Button>
        </div>
      </div>
    </aside>
  );
};
