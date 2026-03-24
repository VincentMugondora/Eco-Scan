import React from "react";
import { ChevronLeft, Bookmark, Clock, Flame, ShieldCheck, MapPin, Target, Plus, LayoutGrid } from "lucide-react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { RECIPES } from "../../data/mockData";

const Recipes = () => {
  const mainRecipe = RECIPES[0];

  return (
    <div className="flex flex-col gap-6 pb-32">
       {/* Header */}
       <div className="px-4 pt-4 flex justify-between items-center">
         <Button variant="ghost" size="icon" className="h-10 w-10">
           <ChevronLeft className="w-6 h-6" />
         </Button>
         <h1 className="text-lg font-bold">Zero-Waste Reci...</h1>
         <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <Bookmark className="w-5 h-5" />
            </Button>
            <img 
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop" 
              alt="Profile" 
              className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
            />
         </div>
       </div>

       {/* Featured Recipe */}
       <div className="px-4">
         <Card className="p-0 overflow-hidden relative border-none shadow-xl">
            <div className="relative h-56">
               <img src={mainRecipe.image} alt={mainRecipe.title} className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
               <div className="absolute top-4 left-4">
                  <Badge className="bg-primary text-white border-none py-1">
                    {mainRecipe.match}% Pantry Match
                  </Badge>
               </div>
               <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-md p-2 rounded-xl text-white">
                  <p className="text-[8px] font-black uppercase tracking-widest text-white/60">Waste Saved</p>
                  <p className="text-sm font-black">{mainRecipe.wasteSaved}</p>
               </div>
               <div className="absolute bottom-4 left-4 text-white">
                  <h2 className="text-xl font-black leading-tight drop-shadow-md">{mainRecipe.title}</h2>
               </div>
            </div>

            <div className="p-4 flex items-center justify-between border-b border-gray-50">
               <div className="flex gap-4">
                  <div className="flex items-center gap-1.5 text-text-secondary">
                     <Clock className="w-4 h-4 text-primary" />
                     <span className="text-xs font-bold">{mainRecipe.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-text-secondary">
                     <Flame className="w-4 h-4 text-orange-500" />
                     <span className="text-xs font-bold">{mainRecipe.difficulty}</span>
                  </div>
               </div>
               <div className="flex items-center gap-1.5 text-primary">
                  <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                     <ShieldCheck className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-xs font-bold">Impact Verified</span>
               </div>
            </div>

            <div className="p-4 grid grid-cols-2 gap-6 bg-white">
               <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-3">In your pantry</h4>
                  <div className="flex flex-col gap-3">
                     {mainRecipe.inPantry.map(item => (
                        <div key={item} className="flex items-center gap-2">
                           <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                              <ShieldCheck className="w-3 h-3 text-primary" />
                           </div>
                           <span className="text-xs font-medium text-text-primary">{item}</span>
                        </div>
                     ))}
                  </div>
               </div>
               <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-[#6B7280] mb-3">Need to get</h4>
                  <div className="flex flex-col gap-3">
                     {mainRecipe.needed.map(item => (
                        <div key={item} className="flex items-center gap-2">
                           <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                              <Plus className="w-3 h-3 text-gray-500" />
                           </div>
                           <span className="text-xs font-medium text-text-secondary">{item}</span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            <div className="p-4 flex flex-col gap-3 bg-white">
               <Button className="w-full h-14 rounded-2xl text-base font-black flex items-center justify-center gap-2 transition-transform active:scale-95">
                  Cook Now
                  <ChevronLeft className="w-5 h-5 rotate-180" />
               </Button>
               <Button variant="outline" className="w-full h-14 rounded-2xl text-base font-black bg-white border-gray-100 text-text-secondary">
                  Save for Later
               </Button>
            </div>
         </Card>
       </div>

       {/* More from Pantry */}
       <div className="px-4">
         <div className="flex justify-between items-center mb-4">
           <h3 className="text-base font-black">More from your pantry</h3>
           <button className="text-primary text-xs font-bold">View All</button>
         </div>

         <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {RECIPES.slice(1).map(recipe => (
               <Card key={recipe.id} className="min-w-[240px] p-0 overflow-hidden relative shadow-lg">
                  <div className="h-32 relative">
                     <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
                     <div className="absolute top-2 right-2">
                        <Badge className="bg-white/80 backdrop-blur-md text-primary">{recipe.match}% Match</Badge>
                     </div>
                  </div>
                  <div className="p-3">
                     <h4 className="font-bold text-sm leading-tight">{recipe.title}</h4>
                     <div className="mt-2 flex items-center gap-3 text-text-secondary">
                        <div className="flex items-center gap-1 text-[10px] font-bold">
                           <Clock className="w-3 h-3" /> {recipe.time}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-bold">
                           <MapPin className="w-3 h-3" /> {recipe.wasteSaved}
                        </div>
                     </div>
                  </div>
               </Card>
            ))}
         </div>
       </div>

       {/* Chef Tip */}
       <div className="px-4">
          <Card className="bg-[#ECFDF5] border-none flex gap-4 p-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shrink-0 shadow-lg">
              <LayoutGrid className="text-white w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm">AI Chef Tip</h4>
              <p className="text-[11px] text-text-secondary leading-relaxed mt-1">
                Your tomatoes are very soft—this makes them perfect for a rich soup base! Roasting them for 5 mins first will double the umami flavor.
              </p>
            </div>
          </Card>
       </div>
    </div>
  );
};

export { Recipes };
