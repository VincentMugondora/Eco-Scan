import React from "react";
import { Search, Filter, ChefHat, Bookmark, Clock, Flame, ShieldCheck, MapPin, Target, Plus, LayoutGrid, Heart, Utensils, Sparkles, CheckCircle2, PlusCircle } from "lucide-react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

const Recipes = () => {
  return (
    <div className="flex flex-col gap-8 pb-10 lg:pt-10 lg:px-6">
      
      {/* Header - Desktop */}
      <div className="hidden lg:flex justify-between items-end px-2">
        <div>
           <h1 className="text-[24px] font-black text-[#0F172A] leading-tight">Recipe Discovery</h1>
           <p className="text-[14px] text-[#64748B] mt-1 font-medium">Browse dishes tailored to your current inventory</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-[300px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search recipes, ingredients..." 
              className="w-full h-10 bg-[#F8FAFC] border-none shadow-[inset_0_1px_3px_0_rgba(0,0,0,0.05)] rounded-2xl pl-10 pr-4 text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#107050]/20 transition-all font-medium"
            />
          </div>
          <Button variant="outline" className="h-10 rounded-xl bg-white border-[#E2E8F0] text-[#4A5568] px-4 font-bold flex gap-2 text-[13px] shadow-sm hover:bg-[#F8FAFC]">
            <Filter className="w-4 h-4 text-[#94A3B8]" /> Filters
          </Button>
          <div className="relative w-10 h-10 ml-3 cursor-pointer select-none">
             <img 
               src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop" 
               alt="Profile" 
               className="w-full h-full rounded-full border-2 border-white shadow-sm object-cover"
             />
             <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#EF4444] border-2 border-white rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="px-2">
        {/* Hero Recipe Card */}
        <Card className="p-0 overflow-hidden relative border border-[#E2E8F0] shadow-sm rounded-[24px] bg-white">
           <div className="relative h-[280px]">
              <img src="https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=1200&auto=format&fit=crop" alt="Leftover Veggie Soup" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
              
              {/* Badges */}
              <div className="absolute top-6 left-6 flex items-center gap-2">
                 <Badge className="bg-[#10B981] hover:bg-[#10B981] text-white border-none py-1 px-3.5 text-[11px] font-black tracking-wide border border-white/20">Zero Waste</Badge>
                 <Badge className="bg-white/20 backdrop-blur-md text-white border-none py-1 px-3.5 text-[11px] font-bold flex items-center gap-1.5 border border-white/20 shadow-sm"><Clock className="w-3.5 h-3.5" /> 15m</Badge>
                 <Badge className="bg-white/20 backdrop-blur-md text-white border-none py-1 px-3.5 text-[11px] font-bold flex items-center gap-1.5 border border-white/20 shadow-sm"><Flame className="w-3.5 h-3.5" /> Easy</Badge>
              </div>

              {/* Heart Icon */}
              <button className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-colors shadow-sm">
                 <Heart className="w-5 h-5" />
              </button>
              
              {/* Overlay Content */}
              <div className="absolute bottom-6 left-6 pr-10 text-white max-w-[80%]">
                 <h2 className="text-[36px] font-black leading-tight drop-shadow-md mb-2">Leftover Veggie Soup</h2>
                 <p className="text-[14px] text-white/90 font-medium leading-relaxed drop-shadow-sm w-3/4">A hearty, traditional blend using your pantry staples. Perfect for a quick, sustainable lunch.</p>
              </div>
           </div>

           {/* Action Buttons & Stats */}
           <div className="p-6 flex items-center justify-between bg-white pl-8">
              <div className="flex items-center gap-4">
                 <Button className="h-12 rounded-xl px-6 bg-[#107050] hover:bg-[#065A3F] text-white font-bold text-[14px] flex items-center gap-2.5 shadow-md shadow-[#107050]/20">
                    <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z" /><path d="M3 12V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" /><path d="M12 2v4" /><path d="M8 2v4" /><path d="M16 2v4" /></svg>
                    Cook Now
                 </Button>
                 <Button variant="outline" className="h-12 rounded-xl px-6 bg-white border-[#E2E8F0] text-[#107050] hover:bg-[#F8FAFC] font-bold text-[14px] flex items-center gap-2.5">
                    <Bookmark className="w-4.5 h-4.5" strokeWidth={2.5} /> Save Recipe
                 </Button>
              </div>
              <div className="flex items-center gap-8 pr-4">
                 <div className="text-center">
                    <p className="text-[10px] font-black text-[#64748B] uppercase tracking-widest mb-0.5">Servings</p>
                    <p className="text-[16px] font-black text-[#0F172A]">4 people</p>
                 </div>
                 <div className="w-[1px] h-8 bg-[#E2E8F0]"></div>
                 <div className="text-center">
                    <p className="text-[10px] font-black text-[#64748B] uppercase tracking-widest mb-0.5">Calories</p>
                    <p className="text-[16px] font-black text-[#0F172A]">240 kcal</p>
                 </div>
              </div>
           </div>
        </Card>

        {/* Ingredients Analysis */}
        <div className="mt-8 bg-white border border-[#E2E8F0] rounded-[24px] p-6 shadow-sm">
           <div className="flex items-center gap-2.5 mb-6 pl-2">
              <Utensils className="w-5 h-5 text-[#107050]" strokeWidth={2.5} />
              <h3 className="text-[18px] font-black text-[#0F172A]">Ingredients Analysis</h3>
           </div>
           
           <div className="flex gap-8">
              {/* Have List */}
              <div className="flex-1 border-r border-[#F1F5F9] pr-8">
                 <div className="flex justify-between items-center mb-4 pl-2">
                    <h4 className="text-[11px] font-black text-[#107050] uppercase tracking-widest leading-none">Ingredients You Have</h4>
                    <Badge className="bg-[#E6F4F0] text-[#107050] border-none font-bold text-[10px] px-2.5 py-0.5">Pantry Match</Badge>
                 </div>
                 <div className="flex flex-col gap-3">
                    <Card className="p-3.5 bg-[#F3FAF7] border border-[#107050]/15 shadow-none rounded-2xl flex justify-between items-center">
                       <div className="flex items-center gap-3.5">
                          <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0" strokeWidth={2.5} />
                          <div>
                             <p className="text-[13px] font-bold text-[#0F172A] leading-tight mb-0.5">Maize Meal (Sadza staple)</p>
                             <p className="text-[11px] text-[#64748B] font-medium">250g</p>
                          </div>
                       </div>
                    </Card>
                    <Card className="p-3.5 bg-[#F3FAF7] border border-[#107050]/15 shadow-none rounded-2xl flex justify-between items-center">
                       <div className="flex items-center gap-3.5">
                          <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0" strokeWidth={2.5} />
                          <div>
                             <p className="text-[13px] font-bold text-[#0F172A] leading-tight mb-0.5">Pumpkin Leaves (Muriwo)</p>
                             <p className="text-[11px] text-[#64748B] font-medium">1 bunch</p>
                          </div>
                       </div>
                    </Card>
                    <Card className="p-3.5 bg-[#F3FAF7] border border-[#107050]/15 shadow-none rounded-2xl flex justify-between items-center">
                       <div className="flex items-center gap-3.5">
                          <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0" strokeWidth={2.5} />
                          <div>
                             <p className="text-[13px] font-bold text-[#0F172A] leading-tight mb-0.5">Dried Kapenta</p>
                             <p className="text-[11px] text-[#64748B] font-medium">100g</p>
                          </div>
                       </div>
                    </Card>
                    <Card className="p-3.5 bg-[#F3FAF7] border border-[#107050]/15 shadow-none rounded-2xl flex justify-between items-center">
                       <div className="flex items-center gap-3.5">
                          <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0" strokeWidth={2.5} />
                          <div>
                             <p className="text-[13px] font-bold text-[#0F172A] leading-tight mb-0.5">Peanut Butter (Unsweetened)</p>
                             <p className="text-[11px] text-[#64748B] font-medium">2 tbsp</p>
                          </div>
                       </div>
                    </Card>
                 </div>
              </div>

              {/* Missing List */}
              <div className="flex-1 pr-2">
                 <div className="flex justify-between items-center mb-4 pl-2">
                    <h4 className="text-[11px] font-black text-[#EF4444] uppercase tracking-widest leading-none mt-0.5">Missing Ingredients</h4>
                    <button className="text-[11px] font-bold text-[#107050] hover:text-[#0F172A] transition-colors leading-none">Add all to list</button>
                 </div>
                 <div className="flex flex-col gap-3">
                    <Card className="p-3.5 bg-white border border-[#E2E8F0] shadow-sm rounded-2xl flex justify-between items-center group hover:border-[#CBD5E1] transition-colors">
                       <div className="flex items-center gap-3.5">
                          <PlusCircle className="w-5 h-5 text-[#94A3B8] shrink-0 group-hover:text-[#64748B]" strokeWidth={2} />
                          <div>
                             <p className="text-[13px] font-bold text-[#0F172A] leading-tight mb-0.5">Vegetable Stock Cubes</p>
                             <p className="text-[11px] text-[#64748B] font-medium">Est. $1.20</p>
                          </div>
                       </div>
                       <button className="text-[12px] font-black text-[#107050] pr-3 hover:text-[#065A3F] transition-colors">Add</button>
                    </Card>
                    <Card className="p-3.5 bg-white border border-[#E2E8F0] shadow-sm rounded-2xl flex justify-between items-center group hover:border-[#CBD5E1] transition-colors">
                       <div className="flex items-center gap-3.5">
                          <PlusCircle className="w-5 h-5 text-[#94A3B8] shrink-0 group-hover:text-[#64748B]" strokeWidth={2} />
                          <div>
                             <p className="text-[13px] font-bold text-[#0F172A] leading-tight mb-0.5">Fresh Garlic Cloves</p>
                             <p className="text-[11px] text-[#64748B] font-medium">Est. $0.50</p>
                          </div>
                       </div>
                       <button className="text-[12px] font-black text-[#107050] pr-3 hover:text-[#065A3F] transition-colors">Add</button>
                    </Card>
                    <Card className="p-3.5 bg-white border border-[#E2E8F0] shadow-sm rounded-2xl flex justify-between items-center group hover:border-[#CBD5E1] transition-colors">
                       <div className="flex items-center gap-3.5">
                          <PlusCircle className="w-5 h-5 text-[#94A3B8] shrink-0 group-hover:text-[#64748B]" strokeWidth={2} />
                          <div>
                             <p className="text-[13px] font-bold text-[#0F172A] leading-tight mb-0.5">Black Pepper</p>
                             <p className="text-[11px] text-[#64748B] font-medium">Est. $0.80</p>
                          </div>
                       </div>
                       <button className="text-[12px] font-black text-[#107050] pr-3 hover:text-[#065A3F] transition-colors">Add</button>
                    </Card>
                 </div>
              </div>
           </div>
        </div>

        {/* Want More Ideas */}
        <Card className="mt-8 bg-white border border-[#E2E8F0] shadow-sm rounded-2xl p-5 flex items-center justify-between pl-6 pr-6">
           <div className="flex items-center gap-5">
              <div className="w-10 h-10 rounded-xl bg-[#E6F4F0] flex items-center justify-center shrink-0">
                 <Sparkles className="w-5 h-5 text-[#107050]" strokeWidth={2.5} />
              </div>
              <div>
                 <h4 className="font-bold text-[15px] text-[#0F172A] leading-none mb-1.5 pt-1">Want more ideas?</h4>
                 <p className="text-[12px] text-[#64748B] font-medium">Let AI create a custom recipe based on your selected items</p>
              </div>
           </div>
           <Button className="h-10 rounded-xl px-6 bg-[#107050] hover:bg-[#065A3F] text-white font-bold text-[13px] shadow-sm">
             AI Recipe for These
           </Button>
        </Card>

      </div>
    </div>
  );
};

export { Recipes };
