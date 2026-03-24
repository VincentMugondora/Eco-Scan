import React, { useState } from "react";
import { Search, Filter, Scan, Target, Check, MoreVertical, Clock } from "lucide-react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { ProgressBar } from "../ui/ProgressBar";
import { Button } from "../ui/Button";
import { PANTRY_ITEMS } from "../../data/mockData";
import { motion, AnimatePresence } from "framer-motion";

const Pantry = () => {
  const [filter, setFilter] = useState("all");
  const [selectedItems, setSelectedItems] = useState([1, 2]); // Simulate the screenshot

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
    <div className="flex flex-col gap-6 pb-32 lg:pt-10 lg:px-2">
      
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
      <div className="hidden lg:flex justify-between items-end px-2">
        <div>
           <h1 className="text-[28px] font-black text-[#0F172A] leading-tight">Pantry Command</h1>
           <p className="text-[15px] text-[#64748B] mt-1 font-medium">Manage your high-utility inventory and reduce waste</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search inventory..." 
              className="w-full h-11 bg-white border border-[#E2E8F0] shadow-sm rounded-xl pl-10 pr-4 text-[14px] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
            />
          </div>
          <Button variant="outline" className="h-11 rounded-xl bg-white border-[#E2E8F0] text-[#4A5568] px-4 font-bold flex gap-2 h-11 text-[14px] shadow-sm hover:bg-[#F8FAFC]">
            <Filter className="w-4 h-4 text-[#94A3B8]" /> Filters
          </Button>
          <div className="relative w-11 h-11 ml-3 cursor-pointer select-none">
             <img 
               src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop" 
               alt="Profile" 
               className="w-full h-full rounded-full border-2 border-white shadow-sm object-cover"
             />
             <div className="absolute top-0 right-0 w-3 h-3 bg-[#10B981] border-2 border-white rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Search & Filter - Mobile */}
      <div className="px-4 flex gap-2 lg:hidden">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search items or categories..." 
            className="w-full h-12 bg-white border border-gray-100 rounded-2xl pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
          />
        </div>
        <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl bg-white border-gray-100">
          <Filter className="w-5 h-5 text-[#94A3B8]" />
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
      <div className="px-4 lg:px-2 lg:mt-6">
        <div className="flex justify-between items-center mb-4 lg:mb-5">
          <h3 className="text-[10px] lg:text-[18px] lg:capitalize lg:font-black lg:tracking-normal font-black uppercase tracking-widest text-[#0F172A] flex items-center gap-3">
             <span className="lg:hidden text-[#64748B]">All Items ({PANTRY_ITEMS.length})</span>
             <span className="hidden lg:inline">Current Inventory</span>
             <Badge className="hidden lg:flex bg-[#E6F4F0] text-primary text-[12px] px-2.5 py-0.5 rounded-md font-bold border-none shadow-none">{PANTRY_ITEMS.length} Items Total</Badge>
          </h3>
          <div className="text-primary text-[10px] lg:text-[13px] font-bold lg:font-bold lg:tracking-normal lg:text-[#64748B] uppercase tracking-widest flex items-center gap-1.5 cursor-pointer">
            <span className="hidden lg:inline font-medium">Sorted by:</span> <span className="lg:text-[#0F172A]">Expiry (Closest)</span> <Filter className="w-3 h-3 lg:hidden" /> <svg className="w-4 h-4 hidden lg:block text-[#94A3B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:gap-3.5">
          {PANTRY_ITEMS.map((item) => {
            const isSelected = selectedItems.includes(item.id);
            
            return (
              <Card 
                key={item.id} 
                className={cn(
                  "p-3 lg:py-3 lg:px-4 flex items-center gap-3 transition-colors border",
                  isSelected 
                    ? "bg-[#F3FAF7] border-primary/30 shadow-[0_2px_10px_-4px_rgba(6,122,87,0.1)]" 
                    : "bg-white border-[#E2E8F0] shadow-sm hover:border-gray-300"
                )}
              >
                {/* Desktop Checkbox */}
                <div className="hidden lg:flex items-center shrink-0 w-8">
                   <button 
                     onClick={() => toggleItem(item.id)}
                     className={cn(
                       "w-5 h-5 rounded-[4px] flex items-center justify-center border transition-colors",
                       isSelected ? "bg-primary border-primary" : "bg-white border-[#CBD5E1] hover:border-[#94A3B8]"
                     )}
                   >
                     {isSelected && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
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
                <div className="w-12 h-12 lg:w-[52px] lg:h-[52px] rounded-xl overflow-hidden shrink-0 bg-[#F1F5F9] border border-[#E2E8F0]">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply opacity-90" />
                </div>

                {/* Item Details */}
                <div className="flex-1 min-w-0 flex flex-col lg:flex-row lg:items-center">
                  
                  {/* Info column */}
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className="font-black text-sm lg:text-[15px] truncate text-[#0F172A]">{item.name}</h4>
                      <Badge className="hidden lg:inline-flex bg-[#F1F5F9] text-[#64748B] px-2 py-0 text-[10px] uppercase tracking-wider font-bold border-none h-5 shadow-none items-center">{item.category}</Badge>
                    </div>
                    <p className="text-[10px] text-text-secondary lg:hidden">{item.category}</p>
                    <div className="hidden lg:flex items-center gap-3 text-[12px] text-[#64748B] font-medium">
                       <span className="flex items-center gap-1.5"><svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12V7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5" /><path d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2z" /><path d="M6 12v3a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-3" /></svg> {item.quantity}</span>
                       <span className="w-1 h-1 rounded-full bg-[#CBD5E1]"></span>
                       <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" strokeWidth={2.5} /> {item.updatedAt}</span>
                    </div>
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

                  {/* Desktop Right Side: Expiry Badge + Freshness */}
                  <div className="hidden lg:flex items-center gap-8 pl-4 w-[280px] justify-end">
                     
                     {/* Expiry Badge */}
                     <div className="w-[100px] flex justify-end">
                        <Badge 
                           variant="outline" 
                           className={cn(
                              "text-[12px] font-bold px-3 py-1 border-none shadow-none whitespace-nowrap",
                              item.status === 'expired' ? 'bg-[#FEF2F2] text-[#EF4444]' : 
                              item.status === 'soon' ? 'bg-[#FFFBEB] text-[#F59E0B]' : 
                              'bg-[#F0FDF4] text-[#10B981]'
                           )}
                        >
                           {item.status === 'expired' ? 'Expired' : item.status === 'soon' ? `2 days left` : `12 days left`}
                        </Badge>
                     </div>

                     {/* Freshness Bar */}
                     <div className="flex flex-col gap-1.5 w-[140px]">
                        <div className="flex justify-between items-center text-[11px]">
                           <span className="text-[#64748B] font-bold tracking-wide uppercase">Freshness</span>
                           <span className={cn(
                              "font-black",
                              item.freshness <= 20 ? 'text-[#EF4444]' : item.freshness <= 50 ? 'text-[#F59E0B]' : 'text-[#10B981]'
                           )}>{item.freshness || 10}%</span>
                        </div>
                        <ProgressBar 
                          value={item.freshness || 10} 
                          variant={item.freshness <= 20 ? 'danger' : item.freshness <= 50 ? 'warning' : 'primary'} 
                          className="h-[6px] bg-[#F1F5F9]" 
                        />
                     </div>
                  </div>

                  {/* Mobile Expiry bottom text */}
                  <div className="flex justify-between items-center mt-2 lg:hidden">
                     <p className="text-[10px] font-bold text-[#94A3B8] uppercase">{item.expiryDate.split('-').slice(1).join(' ')}</p>
                     <svg className="w-3 h-3 text-[#94A3B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                     </svg>
                  </div>
                </div>

                {/* Desktop Kebab Menu */}
                <div className="hidden lg:flex justify-end w-8 pl-2">
                  <button className="text-[#94A3B8] hover:text-[#0F172A] p-1.5 rounded-lg hover:bg-[#F1F5F9] transition-colors">
                     <MoreVertical className="w-5 h-5" strokeWidth={2} />
                  </button>
                </div>

              </Card>
            );
          })}
        </div>
      </div>

      {/* Floating Action Bar (Responsive Desktop) */}
      <AnimatePresence>
        {selectedItems.length > 0 && (
          <motion.div 
            initial={{ y: 150, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 150, opacity: 0 }}
            className="fixed bottom-24 left-4 right-4 lg:left-0 lg:right-0 lg:max-w-4xl lg:mx-auto lg:bottom-12 z-40 transition-all cursor-default flex justify-center lg:px-10"
          >
            <Card className="shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-[#E2E8F0] p-3 lg:p-4 flex items-center justify-between gap-4 lg:gap-8 bg-white/95 backdrop-blur-xl rounded-[24px] lg:rounded-full w-full mx-2">
               <div className="flex items-center gap-3 lg:gap-6 lg:pl-4">
                  
                  {/* Desktop Label */}
                  <div className="hidden lg:flex flex-col">
                     <p className="text-[10px] font-black text-[#64748B] uppercase tracking-widest leading-tight mb-0.5">Bulk Management</p>
                     <p className="text-[15px] font-black text-[#0F172A] leading-tight flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
                       {selectedItems.length} items selected
                     </p>
                  </div>
                  
                  {/* Mobile Label */}
                  <div className="lg:hidden flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center">
                        <Scan className="w-4 h-4 text-primary" />
                     </div>
                     <div>
                        <p className="text-[10px] font-bold">Select All Expiring</p>
                        <p className="text-[10px] text-text-secondary">{selectedItems.length} items selected</p>
                     </div>
                  </div>
                  
                  <div className="hidden lg:block w-[1px] h-10 bg-[#E2E8F0] ml-2" />
                  
                  <Button variant="outline" className="hidden lg:flex h-11 rounded-full px-6 bg-white border-[#E2E8F0] text-[#4A5568] hover:bg-[#F8FAFC] focus:bg-[#F8FAFC] transition-colors active:scale-95 font-bold text-[14px]" onClick={toggleAll}>
                    {selectedItems.length === PANTRY_ITEMS.length ? 'Deselect All' : 'Select All Expiring'}
                  </Button>
               </div>
               
               <Button className="rounded-xl px-4 py-2 lg:h-12 lg:rounded-full lg:px-8 flex items-center gap-2.5 bg-primary hover:bg-[#056648] text-white shadow-md shadow-primary/20 focus:outline-none transition-colors" onClick={() => {}}>
                 <Target className="w-4 h-4 lg:hidden" /> 
                 <span className="hidden lg:inline"><ChefHat className="w-5 h-5" strokeWidth={2.5} /></span>
                 <span className="font-bold text-[15px] hidden lg:inline pt-0.5">AI Recipe for These</span>
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

