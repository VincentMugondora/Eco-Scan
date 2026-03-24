import React, { useState } from "react";
import { Search, Filter, Scan, Target, Check, MoreVertical } from "lucide-react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { ProgressBar } from "../ui/ProgressBar";
import { Button } from "../ui/Button";
import { PANTRY_ITEMS } from "../../data/mockData";
import { motion, AnimatePresence } from "framer-motion";

const Pantry = () => {
  const [filter, setFilter] = useState("all");
  const [selectedItems, setSelectedItems] = useState([]);

  const toggleItem = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedItems.length === PANTRY_ITEMS.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(PANTRY_ITEMS.map(i => i.id));
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-32 lg:pt-8 lg:px-4">
      
      {/* Header - Mobile */}
      <div className="px-4 pt-4 flex justify-between items-center lg:hidden">
        <h1 className="text-xl font-bold">Pantry</h1>
        <img 
          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop" 
          alt="Profile" 
          className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
        />
      </div>

      {/* Header - Desktop (Command Center) */}
      <div className="hidden lg:flex justify-between items-end px-4">
        <div>
           <h1 className="text-2xl font-black text-[#1A202C]">Pantry Command</h1>
           <p className="text-sm text-text-secondary mt-1">Manage your high-utility inventory and reduce waste</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search inventory..." 
              className="w-full h-10 bg-gray-50 border-none rounded-2xl pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
            />
          </div>
          <Button variant="outline" className="h-10 rounded-2xl bg-white border-gray-200 text-text-primary px-4 font-bold flex gap-2">
            <Filter className="w-4 h-4" /> Filters
          </Button>
          <div className="relative w-10 h-10 ml-2">
             <img 
               src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop" 
               alt="Profile" 
               className="w-full h-full rounded-full border-2 border-white shadow-sm"
             />
             <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Search & Filter - Mobile */}
      <div className="px-4 flex gap-2 lg:hidden">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search items or categories..." 
            className="w-full h-12 bg-white border border-gray-100 rounded-2xl pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl bg-white border-gray-100">
          <Filter className="w-5 h-5" />
        </Button>
      </div>

      {/* Tabs - Mobile */}
      <div className="px-4 lg:hidden">
        <div className="flex bg-gray-50 p-1 rounded-2xl">
          {['all', 'Soon', 'expired'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={cn(
                "flex-1 py-2 text-sm font-bold capitalize rounded-xl transition-all",
                filter === tab ? "bg-white shadow-sm text-primary" : "text-text-secondary"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory List */}
      <div className="px-4 lg:mt-6">
        <div className="flex justify-between items-center mb-4 lg:mb-6">
          <h3 className="text-[10px] lg:text-sm lg:capitalize lg:font-black lg:tracking-normal font-black uppercase tracking-widest text-text-primary flex items-center gap-3">
             <span className="lg:hidden text-text-secondary">All Items ({PANTRY_ITEMS.length})</span>
             <span className="hidden lg:inline">Current Inventory</span>
             <Badge className="hidden lg:flex bg-[#E6F4F0] text-primary">{PANTRY_ITEMS.length} Items Total</Badge>
          </h3>
          <button className="text-primary text-[10px] lg:text-sm font-bold lg:font-bold lg:tracking-normal lg:text-text-secondary uppercase tracking-widest flex items-center gap-1">
            <span className="hidden lg:inline font-medium">Sorted by:</span> <span className="lg:text-primary">Expiry (Closest)</span> <Filter className="w-3 h-3 lg:hidden" /> <svg className="w-4 h-4 hidden lg:block text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        <div className="flex flex-col gap-3 lg:gap-4">
          {PANTRY_ITEMS.map((item) => {
            const isSelected = selectedItems.includes(item.id);
            
            return (
              <Card 
                key={item.id} 
                className={cn(
                  "p-3 lg:p-4 border-gray-100 flex items-center gap-3 transition-colors",
                  isSelected ? "bg-[#F3FAF7] border-primary/20" : "bg-white"
                )}
              >
                {/* Desktop Checkbox & Image */}
                <div className="hidden lg:flex items-center gap-4 shrink-0 w-16">
                   <button 
                     onClick={() => toggleItem(item.id)}
                     className={cn(
                       "w-5 h-5 rounded flex items-center justify-center border transition-colors",
                       isSelected ? "bg-primary border-primary" : "border-gray-300 hover:border-primary"
                     )}
                   >
                     {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                   </button>
                </div>

                {/* Mobile Checkbox */}
                <div 
                   className="w-4 h-4 border-2 border-primary rounded flex items-center justify-center shrink-0 lg:hidden cursor-pointer"
                   onClick={() => toggleItem(item.id)}
                >
                  {isSelected && <div className="w-2 h-2 bg-primary rounded-sm" />}
                </div>

                {/* Common Image */}
                <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                </div>

                {/* Item Details */}
                <div className="flex-1 min-w-0 lg:flex lg:items-center lg:justify-between lg:pr-4">
                  
                  <div className="lg:w-[40%]">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm lg:text-base truncate text-[#1A202C]">{item.name}</h4>
                      <Badge className="hidden lg:inline-flex bg-gray-100 text-[#4A5568] px-2 py-0.5 text-[10px] lowercase font-medium border-none">{item.category}</Badge>
                    </div>
                    <p className="text-[10px] text-text-secondary lg:hidden">{item.category}</p>
                    <p className="hidden lg:flex items-center gap-2 text-xs text-text-secondary mt-1 font-medium">
                       <span className="flex items-center gap-1"><svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12V7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5" /><path d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2z" /><path d="M6 12v3a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-3" /></svg> {item.quantity}</span>
                       <span>•</span>
                       <span className="flex items-center gap-1"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> {item.updatedAt}</span>
                    </p>
                  </div>

                  {/* Mobile Right Side */}
                  <div className="lg:hidden absolute right-3 top-3">
                    <Badge 
                      variant={item.status === 'expired' ? 'danger' : item.status === 'soon' ? 'warning' : 'success'}
                      className="flex items-center gap-1 capitalize py-0.5"
                    >
                      {item.status === 'expired' ? 'Expired' : item.status === 'soon' ? '2d left' : 'Fresh'}
                    </Badge>
                  </div>

                  {/* Desktop Freshness Bar */}
                  <div className="hidden lg:flex flex-col gap-1.5 w-[35%] pl-4 border-l border-gray-100">
                     <div className="flex justify-between items-center text-xs">
                        <Badge variant={item.status === 'expired' ? 'danger' : item.status === 'soon' ? 'warning' : 'default'} className="bg-red-50 text-danger border-none lowercase px-2">
                           {item.status === 'expired' ? 'expired' : item.status === 'soon' ? '2 days left' : '12 days left'}
                        </Badge>
                        <span className="text-text-secondary font-bold">{item.freshness || 10}% fresh</span>
                     </div>
                     <ProgressBar 
                       value={item.freshness || 10} 
                       variant={item.freshness <= 20 ? 'danger' : item.freshness <= 50 ? 'warning' : 'primary'} 
                       className="h-2 bg-primary-light/50" 
                     />
                  </div>

                  <div className="flex justify-between items-center mt-2 lg:hidden">
                     <p className="text-[10px] font-bold text-text-secondary uppercase">{item.expiryDate.split('-').slice(1).join(' ')}</p>
                     <svg className="w-3 h-3 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                     </svg>
                  </div>
                </div>

                {/* Desktop Kebab Menu */}
                <div className="hidden lg:flex justify-end w-8 pl-4">
                  <button className="text-gray-400 hover:text-gray-600 transition-colors">
                     <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

              </Card>
            );
          })}
        </div>
      </div>

      {/* Floating Action Bar (Responsive) */}
      <AnimatePresence>
        {selectedItems.length > 0 && (
          <motion.div 
            initial={{ y: 150, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 150, opacity: 0 }}
            className="fixed bottom-24 left-4 right-4 lg:left-[50%] lg:-translate-x-1/2 lg:w-max lg:bottom-8 z-40 transition-all cursor-default"
          >
            <Card className="shadow-2xl border border-gray-100 py-3 px-4 lg:py-4 lg:px-6 flex items-center justify-between gap-4 lg:gap-8 bg-white/95 backdrop-blur-xl rounded-2xl lg:rounded-[2rem]">
               <div className="flex items-center gap-3 lg:gap-6">
                  <div className="hidden lg:block">
                     <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest leading-none mb-1">Bulk Management</p>
                     <p className="text-base font-black text-text-primary leading-none">{selectedItems.length} items selected</p>
                  </div>
                  <div className="lg:hidden flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center">
                        <Scan className="w-4 h-4 text-primary" />
                     </div>
                     <div>
                        <p className="text-[10px] font-bold">Select All Expiring</p>
                        <p className="text-[10px] text-text-secondary">{selectedItems.length} items selected</p>
                     </div>
                  </div>
                  
                  <div className="hidden lg:block w-px h-10 bg-gray-200" />
                  
                  <Button variant="outline" className="hidden lg:flex h-10 rounded-xl px-6 bg-white border-gray-200 text-text-primary hover:bg-gray-50 focus:bg-gray-50 transition-colors active:scale-95" onClick={toggleAll}>
                    {selectedItems.length === PANTRY_ITEMS.length ? 'Deselect All' : 'Select All Expiring'}
                  </Button>
               </div>
               <Button className="rounded-xl px-4 py-2 lg:h-12 lg:rounded-2xl lg:px-8 flex items-center gap-2 hover:bg-primary/90 focus:bg-primary/90 active:bg-primary/90 transition-colors" onClick={() => {}}>
                 <Target className="w-4 h-4 lg:hidden" /> 
                 <span className="hidden lg:inline"><ChefHat className="w-4 h-4" /></span>
                 AI Recipe for These
               </Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { Pantry };

function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}

