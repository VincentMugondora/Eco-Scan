import React, { useState } from "react";
import { Search, Filter, ChefHat, Bookmark, Clock, Flame, Heart, Utensils, Sparkles, CheckCircle2, PlusCircle, AlertCircle } from "lucide-react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { usePantry } from "../../hooks/usePantry";

const Recipes = () => {
  const { items, loading: pantryLoading } = usePantry();
  const [recipes, setRecipes] = useState(null);
  const [loadingRecipes, setLoadingRecipes] = useState(false);
  const [error, setError] = useState(null);

  // Sorting items by expiry to find the most urgent one to base the recipe on easily
  const urgentItems = [...items].sort((a, b) => new Date(a.expiry_date) - new Date(b.expiry_date));

  const generateAIRecipes = async () => {
    if (urgentItems.length === 0) {
      setError("Please add items to your pantry first.");
      return;
    }

    setLoadingRecipes(true);
    setError(null);
    try {
      const primaryItem = urgentItems[0].item_name;
      const res = await fetch(`http://127.0.0.1:8000/recipes?item_name=${encodeURIComponent(primaryItem)}`, {
        method: "POST"
      });

      if (!res.ok) throw new Error("Failed to fetch recipes");
      const data = await res.json();
      setRecipes(data);
    } catch (err) {
      console.error(err);
      setError("Failed to generate recipes. Please try again later.");
    } finally {
      setLoadingRecipes(false);
    }
  };

  const currentRecipe = recipes?.recipes?.[0]; // Show the first recommended recipe as hero

  if (pantryLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#107050]"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-10 lg:pt-10 lg:px-6">
      
      {/* Header - Desktop */}
      <div className="hidden lg:flex justify-between items-end px-2">
        <div>
           <h1 className="text-[24px] font-black text-[#0F172A] leading-tight">Recipe Discovery</h1>
           <p className="text-[14px] text-[#64748B] mt-1 font-medium">Browse dishes tailored to your current inventory</p>
        </div>
      </div>

      <div className="px-2">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl flex items-center gap-3">
             <AlertCircle className="w-5 h-5 text-red-500" />
             <p className="text-red-700 font-medium text-[14px]">{error}</p>
          </div>
        )}

        {/* Hero Recipe Card or Empty State */}
        {loadingRecipes ? (
          <Card className="p-12 border border-[#E2E8F0] shadow-sm rounded-[24px] bg-white flex flex-col items-center justify-center min-h-[400px]">
            <ChefHat className="w-12 h-12 text-[#107050] animate-bounce mb-4" />
            <h3 className="text-[18px] font-bold text-[#0F172A] mb-2">Chef AI is thinking...</h3>
            <p className="text-[14px] text-[#64748B]">Creating zero-waste recipes from your pantry.</p>
          </Card>
        ) : currentRecipe ? (
          <Card className="p-0 overflow-hidden relative border border-[#E2E8F0] shadow-sm rounded-[24px] bg-white">
             <div className="relative h-[280px] bg-[#107050]/10 flex items-center justify-center">
                <Utensils className="w-24 h-24 text-[#107050]/20" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
                
                {/* Badges */}
                <div className="absolute top-6 left-6 flex items-center gap-2">
                   <Badge className="bg-[#10B981] hover:bg-[#10B981] text-white border-none py-1 px-3.5 text-[11px] font-black tracking-wide border border-white/20">Zero Waste</Badge>
                   <Badge className="bg-white/20 backdrop-blur-md text-white border-none py-1 px-3.5 text-[11px] font-bold flex items-center gap-1.5 border border-white/20 shadow-sm"><Clock className="w-3.5 h-3.5" /> {currentRecipe.time_to_cook_minutes}m</Badge>
                   <Badge className="bg-white/20 backdrop-blur-md text-white border-none py-1 px-3.5 text-[11px] font-bold flex items-center gap-1.5 border border-white/20 shadow-sm capitalize"><Flame className="w-3.5 h-3.5" /> {currentRecipe.difficulty}</Badge>
                </div>

                <button className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-colors shadow-sm">
                   <Heart className="w-5 h-5" />
                </button>
                
                <div className="absolute bottom-6 left-6 pr-10 text-white max-w-[80%]">
                   <h2 className="text-[36px] font-black leading-tight drop-shadow-md mb-2">{currentRecipe.name}</h2>
                   <p className="text-[14px] text-white/90 font-medium leading-relaxed drop-shadow-sm w-3/4">An AI generated recipe using your pantry staples to reduce waste.</p>
                </div>
             </div>

             <div className="p-6 flex items-center justify-between bg-white pl-8">
                <div className="flex items-center gap-4">
                   <Button className="h-12 rounded-xl px-6 bg-[#107050] hover:bg-[#065A3F] text-white font-bold text-[14px] flex items-center gap-2.5 shadow-md shadow-[#107050]/20">
                      Cook Now
                   </Button>
                   <Button variant="outline" className="h-12 rounded-xl px-6 bg-white border-[#E2E8F0] text-[#107050] hover:bg-[#F8FAFC] font-bold text-[14px] flex items-center gap-2.5">
                      <Bookmark className="w-4.5 h-4.5" strokeWidth={2.5} /> Save Recipe
                   </Button>
                </div>
             </div>
          </Card>
        ) : (
          <Card className="p-12 border border-[#E2E8F0] shadow-sm rounded-[24px] bg-white flex flex-col items-center justify-center min-h-[300px] text-center">
            <div className="w-16 h-16 rounded-full bg-[#E6F4F0] flex items-center justify-center mb-4">
              <ChefHat className="w-8 h-8 text-[#107050]" />
            </div>
            <h3 className="text-[20px] font-black text-[#0F172A] mb-2">No Recipes Generated Yet</h3>
            <p className="text-[14px] text-[#64748B] max-w-md mb-6">Let our AI Chef create a perfect, zero-waste recipe based on the ingredients you already have in your pantry.</p>
            <Button onClick={generateAIRecipes} className="h-12 rounded-xl px-8 bg-[#107050] hover:bg-[#065A3F] text-white font-bold text-[15px] shadow-sm">
              Generate AI Recipes
            </Button>
          </Card>
        )}

        {/* Ingredients Matrix */}
        <div className="mt-8 bg-white border border-[#E2E8F0] rounded-[24px] p-6 shadow-sm">
           <div className="flex items-center gap-2.5 mb-6 pl-2">
              <Utensils className="w-5 h-5 text-[#107050]" strokeWidth={2.5} />
              <h3 className="text-[18px] font-black text-[#0F172A]">Your Ingredients Profile</h3>
           </div>
           
           <div className="flex flex-col lg:flex-row gap-8">
              {/* Have List */}
              <div className="flex-1 lg:border-r border-[#F1F5F9] lg:pr-8">
                 <div className="flex justify-between items-center mb-4 pl-2">
                    <h4 className="text-[11px] font-black text-[#107050] uppercase tracking-widest leading-none">In Your Pantry</h4>
                    <Badge className="bg-[#E6F4F0] text-[#107050] border-none font-bold text-[10px] px-2.5 py-0.5">{items.length} items</Badge>
                 </div>
                 <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                    {items.length > 0 ? items.map((item) => (
                      <Card key={item.id} className="p-3.5 bg-[#F3FAF7] border border-[#107050]/15 shadow-none rounded-2xl flex justify-between items-center">
                         <div className="flex items-center gap-3.5">
                            <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0" strokeWidth={2.5} />
                            <div>
                               <p className="text-[13px] font-bold text-[#0F172A] leading-tight mb-0.5">{item.item_name}</p>
                               <p className="text-[11px] text-[#64748B] font-medium">{item.weight_kg} kg • {item.category}</p>
                            </div>
                         </div>
                      </Card>
                    )) : (
                      <p className="text-sm text-slate-500 italic p-2">Your pantry is empty.</p>
                    )}
                 </div>
              </div>

              {/* Required/Missing List for Current Recipe */}
              <div className="flex-1 pr-2">
                 <div className="flex justify-between items-center mb-4 pl-2">
                    <h4 className="text-[11px] font-black text-[#EF4444] uppercase tracking-widest leading-none mt-0.5">Recipe Requirements</h4>
                 </div>
                 {currentRecipe ? (
                   <div className="flex flex-col gap-3">
                      {currentRecipe.ingredients.map((ing, i) => {
                        // Check if we have this ingredient (fuzzy matching)
                        const haveIt = items.some(item => item.item_name.toLowerCase().includes(ing.name.toLowerCase()));
                        
                        return (
                          <Card key={i} className={`p-3.5 border shadow-sm rounded-2xl flex justify-between items-center ${haveIt ? 'bg-white border-[#10B981]/30' : 'bg-red-50/30 border-red-100'}`}>
                             <div className="flex items-center gap-3.5">
                                {haveIt ? (
                                  <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0" strokeWidth={2} />
                                ) : (
                                  <PlusCircle className="w-5 h-5 text-red-400 shrink-0" strokeWidth={2} />
                                )}
                                <div>
                                   <p className="text-[13px] font-bold text-[#0F172A] leading-tight mb-0.5">{ing.name}</p>
                                   <p className="text-[11px] text-[#64748B] font-medium">{ing.amount}</p>
                                </div>
                             </div>
                          </Card>
                        )
                      })}
                   </div>
                 ) : (
                   <div className="h-full flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-200 rounded-2xl">
                     <p className="text-[13px] text-[#64748B]">Generate a recipe to see what else you might need.</p>
                   </div>
                 )}
              </div>
           </div>
        </div>

        {/* Generate / Refresh Box */}
        {recipes && (
          <Card className="mt-8 bg-white border border-[#E2E8F0] shadow-sm rounded-2xl p-5 flex items-center justify-between pl-6 pr-6">
             <div className="flex items-center gap-5">
                <div className="w-10 h-10 rounded-xl bg-[#E6F4F0] flex items-center justify-center shrink-0">
                   <Sparkles className="w-5 h-5 text-[#107050]" strokeWidth={2.5} />
                </div>
                <div>
                   <h4 className="font-bold text-[15px] text-[#0F172A] leading-none mb-1.5 pt-1">Want different ideas?</h4>
                   <p className="text-[12px] text-[#64748B] font-medium">Let AI create another custom recipe based on your selected items</p>
                </div>
             </div>
             <Button onClick={generateAIRecipes} disabled={loadingRecipes} className="h-10 rounded-xl px-6 bg-[#107050] hover:bg-[#065A3F] text-white font-bold text-[13px] shadow-sm disabled:opacity-50">
               {loadingRecipes ? "Generating..." : "Regenerate Recipes"}
             </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export { Recipes };
