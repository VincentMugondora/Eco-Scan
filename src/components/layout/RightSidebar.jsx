import React from 'react';
import { ChefHat, ArrowRight, Scan, Utensils, Sparkles, Calendar, ChevronRight, ChevronLeft, Clock } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const RightSidebar = ({ activeTab }) => {
  const isRecipes = activeTab === 'impact';

  if (isRecipes) {
    return (
      <aside className="hidden lg:flex flex-col w-[320px] xl:w-[350px] h-full bg-white border-l border-[#F1F5F9] px-6 py-8 sticky top-0 overflow-y-auto pb-20">
        
        {/* AI Chef Active Card */}
        <Card className="bg-[#107050] text-white border-none shadow-xl shadow-[#107050]/20 p-5 rounded-[24px] mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
          
          <div className="flex justify-between items-center mb-4">
             <div className="flex items-center gap-1.5 opacity-90">
                <Sparkles className="w-4 h-4" />
                <span className="text-[10px] font-black tracking-widest uppercase text-white">AI Chef Active</span>
             </div>
             <button className="w-5 h-5 rounded-full border border-white/30 flex items-center justify-center opacity-80 hover:bg-white/10 transition-colors">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
             </button>
          </div>
          
          <h3 className="text-[18px] font-black mb-2">Pantry Match Found!</h3>
          <p className="text-[13px] text-white/90 leading-relaxed mb-5">
             I've found 3 additional ways to use your <span className="font-bold text-[#A7F3D0]">Maize Meal</span> and <span className="font-bold text-[#A7F3D0]">Kapenta</span>.
          </p>
          
          <Button className="w-full bg-white text-[#107050] hover:bg-gray-50 h-10 rounded-xl font-bold text-[13px] border-none shadow-none text-center justify-center pt-0.5">
             Unlock AI Suggestions
          </Button>
        </Card>

        {/* Smart Filters */}
        <div className="mb-8">
           <h3 className="text-[16px] font-black text-[#0F172A] mb-5">Smart Filters</h3>
           
           <div className="mb-5 border-b border-[#F1F5F9] pb-5">
              <h4 className="text-[9px] font-black uppercase tracking-widest text-[#64748B] mb-3">Cuisine</h4>
              <div className="flex flex-wrap gap-2">
                 <Badge className="bg-[#107050] text-white py-1 px-3.5 border-none shadow-sm rounded-lg text-[11px] cursor-pointer">African</Badge>
                 <Badge variant="outline" className="text-[#4A5568] border-[#E2E8F0] py-1 px-3.5 bg-white hover:bg-[#F8FAFC] rounded-lg text-[11px] font-bold cursor-pointer">Mediterranean</Badge>
                 <Badge variant="outline" className="text-[#4A5568] border-[#E2E8F0] py-1 px-3.5 bg-white hover:bg-[#F8FAFC] rounded-lg text-[11px] font-bold cursor-pointer">Asian</Badge>
                 <Badge variant="outline" className="text-[#4A5568] border-[#E2E8F0] py-1 px-3.5 bg-white hover:bg-[#F8FAFC] rounded-lg text-[11px] font-bold cursor-pointer">Fusion</Badge>
              </div>
           </div>

           <div className="mb-5 border-b border-[#F1F5F9] pb-5">
              <h4 className="text-[9px] font-black uppercase tracking-widest text-[#64748B] mb-3">Cooking Time</h4>
              <div className="flex flex-wrap gap-2">
                 <Badge variant="outline" className="text-[#4A5568] border-[#E2E8F0] py-1 px-3 bg-white hover:bg-[#F8FAFC] rounded-lg text-[11px] font-bold cursor-pointer">{'<'} 15m</Badge>
                 <Badge variant="outline" className="text-[#4A5568] border-[#E2E8F0] py-1 px-3 bg-white hover:bg-[#F8FAFC] rounded-lg text-[11px] font-bold cursor-pointer">15-30m</Badge>
                 <Badge variant="outline" className="text-[#4A5568] border-[#E2E8F0] py-1 px-3 bg-white hover:bg-[#F8FAFC] rounded-lg text-[11px] font-bold cursor-pointer">30-60m</Badge>
                 <Badge variant="outline" className="text-[#4A5568] border-[#E2E8F0] py-1 px-3 bg-white hover:bg-[#F8FAFC] rounded-lg text-[11px] font-bold cursor-pointer">60m+</Badge>
              </div>
           </div>

           <div>
              <h4 className="text-[9px] font-black uppercase tracking-widest text-[#64748B] mb-3">Difficulty</h4>
              <div className="flex flex-wrap gap-2">
                 <Badge variant="outline" className="text-[#4A5568] border-[#E2E8F0] py-1 px-3.5 bg-white hover:bg-[#F8FAFC] rounded-lg text-[11px] font-bold cursor-pointer">Beginner</Badge>
                 <Badge variant="outline" className="text-[#4A5568] border-[#E2E8F0] py-1 px-3.5 bg-white hover:bg-[#F8FAFC] rounded-lg text-[11px] font-bold cursor-pointer">Intermediate</Badge>
                 <Badge variant="outline" className="text-[#4A5568] border-[#E2E8F0] py-1 px-3.5 bg-white hover:bg-[#F8FAFC] rounded-lg text-[11px] font-bold cursor-pointer">Expert</Badge>
              </div>
           </div>
        </div>

        {/* Related Ideas */}
        <div>
           <div className="flex justify-between items-center mb-4">
              <h3 className="text-[16px] font-black text-[#0F172A]">Related Ideas</h3>
              <div className="flex gap-1.5">
                 <button className="w-6 h-6 rounded-full border border-[#E2E8F0] flex items-center justify-center text-[#94A3B8] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-colors"><ChevronLeft className="w-3.5 h-3.5" strokeWidth={3} /></button>
                 <button className="w-6 h-6 rounded-full border border-[#E2E8F0] flex items-center justify-center text-[#0F172A] hover:bg-[#F8FAFC] transition-colors"><ChevronRight className="w-3.5 h-3.5" strokeWidth={3} /></button>
              </div>
           </div>
           
           <div className="flex flex-col gap-3">
              <Card className="h-28 rounded-2xl overflow-hidden border-none relative p-0 group cursor-pointer shadow-sm">
                 <img src="https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=400&auto=format&fit=crop" alt="Peanut Kale Stew" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                 <div className="absolute bottom-3 left-4 text-white">
                    <h4 className="font-black text-[13px] mb-1 leading-tight">Peanut Kale Stew</h4>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-white/90">
                       <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 25m</span>
                       <span className="text-[#34D399]">90% Match</span>
                    </div>
                 </div>
              </Card>
              
              <Card className="h-28 rounded-2xl overflow-hidden border-none relative p-0 group cursor-pointer shadow-sm">
                 <img src="https://images.unsplash.com/photo-1628198946765-a832e82ce855?q=80&w=400&auto=format&fit=crop" alt="Garlic Kapenta Stir-fry" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                 <div className="absolute bottom-3 left-4 text-white">
                    <h4 className="font-black text-[13px] mb-1 leading-tight">Garlic Kapenta Stir-fry</h4>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-white/90">
                       <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 10m</span>
                       <span className="text-[#34D399]">90% Match</span>
                    </div>
                 </div>
              </Card>
           </div>
        </div>

        {/* Weekly Meal Planner */}
        <div className="mt-8 pt-8 border-t border-[#F1F5F9]">
          <div className="border-[1.5px] border-dashed border-[#E2E8F0] bg-white rounded-2xl p-5 flex flex-col items-center text-center">
            <Calendar className="w-6 h-6 text-[#94A3B8] mb-2.5" strokeWidth={1.5} />
            <h4 className="font-bold text-[13px] text-[#0F172A] mb-1.5">Weekly Meal Planner</h4>
            <p className="text-[11px] text-[#64748B] mb-4 leading-relaxed px-1">Upgrade to Pro to sync with your calendar and automate shopping lists.</p>
            <Button variant="outline" className="w-full text-[12px] font-bold h-9 rounded-xl border-[#E2E8F0] text-[#4A5568] hover:bg-[#F8FAFC]">Explore Pro</Button>
          </div>
        </div>
      </aside>
    );
  }

  // Default Dashboard / Pantry Right Sidebar
  return (
    <aside className="hidden lg:flex flex-col w-[320px] xl:w-[350px] h-full bg-white border-l border-[#F1F5F9] px-6 py-8 sticky top-0 overflow-y-auto pb-20">
      <div className="flex items-center gap-2 mb-1.5">
        <ChefHat className="text-[#0F172A] w-5 h-5" strokeWidth={2.5} />
        <h2 className="text-[15px] font-black text-[#0F172A]">AI Chef's Corner</h2>
      </div>
      <p className="text-[12px] text-[#64748B] mb-8 font-medium">Smart suggestions based on your selection</p>

      {/* Meal of the Day */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-[#64748B]">Meal of the day</h3>
          <span className="text-[10px] font-bold text-[#10B981]">Daily Pick</span>
        </div>
        
        <Card className="p-0 overflow-hidden border-none shadow-[0_4px_25px_-4px_rgba(0,0,0,0.08)] rounded-[20px]">
          <div className="relative h-[180px]">
            <img 
              src="https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&q=80" 
              alt="Sadza & Leafy Greens" 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A2E1F]/90 via-[#0A2E1F]/20 to-transparent" />
            
            <div className="absolute top-4 left-4">
              <Badge className="bg-[#10B981] hover:bg-[#10B981] text-white border-none py-1 px-3 text-[10px] font-bold">Zero Waste</Badge>
            </div>
            
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <h4 className="font-black text-[18px] leading-[1.1] mb-2 drop-shadow-sm">Sadza & Leafy Greens</h4>
              <p className="text-[11px] text-white/90 font-medium flex items-center gap-3">
                <span className="flex items-center gap-1.5"><svg className="w-3.5 h-3.5 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> 20m</span>
                <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-white/90" /> Beginner</span>
              </p>
            </div>
          </div>
          
          <div className="p-4 bg-white">
            <p className="text-[12px] text-[#4A5568] mb-4 leading-[1.6]">
              Uses 100% of your expiring <span className="font-black text-[#0F172A]">Spinach</span> and <span className="font-black text-[#0F172A]">Mealie-meal</span>. A Zimbabwean classic.
            </p>
            <Button variant="secondary" className="w-full bg-[#E6F4F0] text-[#107050] hover:bg-[#D1EBE3] justify-center text-[12px] h-10 font-bold gap-2 py-0 rounded-xl">
              View Recipe <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-[10px] font-black uppercase tracking-widest text-[#64748B] mb-4">Recent Activity</h3>
        <div className="flex flex-col gap-5">
          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 border border-[#E2E8F0] rounded-full bg-white flex items-center justify-center shrink-0">
              <Scan className="w-3.5 h-3.5 text-[#64748B]" />
            </div>
            <div className="pt-0.5">
              <p className="text-[13px] font-bold text-[#0F172A] leading-tight mb-0.5">Scanned 4 items</p>
              <p className="text-[11px] text-[#94A3B8] font-medium">2h ago</p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 border border-[#E2E8F0] rounded-full bg-white flex items-center justify-center shrink-0">
              <Utensils className="w-3.5 h-3.5 text-[#64748B]" />
            </div>
            <div className="pt-0.5">
              <p className="text-[13px] font-bold text-[#0F172A] leading-tight mb-0.5">Cooked Curry Medley</p>
              <p className="text-[11px] text-[#94A3B8] font-medium">Yesterday</p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 border border-[#E2E8F0] rounded-full bg-white flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-[#64748B]" />
            </div>
            <div className="pt-0.5">
              <p className="text-[13px] font-bold text-[#0F172A] leading-tight mb-0.5">Impact Milestone hit!</p>
              <p className="text-[11px] text-[#94A3B8] font-medium">2d ago</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-8 pb-2">
        <div className="border-[1.5px] border-dashed border-[#E2E8F0] bg-white rounded-2xl p-5 flex flex-col items-center text-center">
          <Calendar className="w-6 h-6 text-[#94A3B8] mb-2.5" strokeWidth={1.5} />
          <h4 className="font-bold text-[13px] text-[#0F172A] mb-1.5">Weekly Meal Planner</h4>
          <p className="text-[11px] text-[#64748B] mb-4 leading-relaxed px-1">Upgrade to Pro to sync with your Google Calendar and automate shopping lists.</p>
          <Button variant="outline" className="w-full text-[12px] font-bold h-9 rounded-xl border-[#E2E8F0] text-[#4A5568] hover:bg-[#F8FAFC]">Explore Pro</Button>
        </div>
      </div>
    </aside>
  );
};

