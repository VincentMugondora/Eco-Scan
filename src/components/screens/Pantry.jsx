import { usePantry } from "../../hooks/usePantry";

const Pantry = () => {
  const { items, loading, markAsCooked } = usePantry();
  const [filter, setFilter] = useState("all");
  const [selectedItems, setSelectedItems] = useState([]);

  const urgentItems = items.filter(item => {
    const days = Math.floor((new Date(item.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days <= 2 && !item.is_cooked;
  });

  const toggleItem = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map(i => i.id));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-32 lg:pt-10 lg:px-6">
      
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
           <h1 className="text-[24px] font-black text-[#0F172A] leading-tight">Pantry Command</h1>
           <p className="text-[14px] text-[#64748B] mt-1 font-medium">Manage your high-utility inventory and reduce waste</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search inventory..." 
              className="w-full h-10 bg-[#F8FAFC] border-none shadow-[inset_0_1px_3px_0_rgba(0,0,0,0.05)] rounded-2xl pl-10 pr-4 text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#107050]/20 transition-all font-medium"
            />
          </div>
          <Button variant="outline" className="h-10 w-10 p-0 rounded-full bg-white border-[#E2E8F0] text-[#4A5568] flex items-center justify-center shadow-sm hover:bg-[#F8FAFC]">
            <Filter className="w-4 h-4 text-[#94A3B8]" />
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

      {/* Search & Filter - Mobile */}
      <div className="px-4 flex gap-2 lg:hidden">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search items or categories..." 
            className="w-full h-12 bg-white border border-[#E2E8F0] rounded-2xl pl-10 pr-4 text-[13px] focus:outline-none transition-all font-medium"
          />
        </div>
        <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl bg-white border-[#E2E8F0]">
          <Filter className="w-5 h-5 text-[#94A3B8]" />
        </Button>
      </div>

      {/* Top Cards: Weekly Impact & AI Tip */}
      <div className="px-4 lg:px-2 mt-2 lg:mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        
        {/* Weekly Impact Card */}
        <Card className="p-6 bg-white border-[#E2E8F0] shadow-sm rounded-[24px] relative overflow-hidden flex justify-between items-center">
          <div className="w-[55%]">
             <Badge className="bg-[#E6F4F0] text-[#107050] text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border-none mb-4 rounded-md">WEEKLY IMPACT</Badge>
             <h3 className="text-[32px] font-black text-[#0F172A] leading-[1.1] mb-1">12.4kg</h3>
             <p className="text-[18px] text-[#64748B] mb-4">CO2e<br/>Saved</p>
             <p className="text-[11px] text-[#64748B] leading-[1.5] mb-4">
               You are performing 18%<br/>better than your 2025<br/>average!
             </p>
             <button className="text-[12px] font-bold text-[#107050] flex items-center gap-1 hover:underline">
               View full report <ArrowRight className="w-3 h-3" strokeWidth={3} />
             </button>
          </div>
          <div className="w-[45%] flex justify-center items-center">
             <div className="relative w-[120px] h-[120px]">
               <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
                 <circle cx="50" cy="50" r="40" fill="transparent" stroke="#F1F5F9" strokeWidth="12" />
                 <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10B981" strokeWidth="12" strokeDasharray="251" strokeDashoffset={251 - (251 * 82) / 100} strokeLinecap="round" />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[22px] font-black text-[#0F172A]">82%</span>
                  <span className="text-[9px] font-bold text-[#64748B] uppercase tracking-widest">GOAL</span>
               </div>
             </div>
          </div>
        </Card>

        {/* AI Pantry Tip Card */}
        <Card className="p-6 bg-[#1A202C] border-none shadow-[0_10px_30px_-10px_rgba(26,32,44,0.4)] rounded-[24px] text-white relative flex flex-col justify-between overflow-hidden">
          {/* Decorative Sparkles background pattern */}
          <div className="absolute -bottom-10 -right-10 opacity-[0.05]">
             <svg width="200" height="200" viewBox="0 0 24 24" fill="currentColor">
               <path d="M12 2l2.4 7.6H22l-6.2 4.5 2.4 7.6-6.2-4.5-6.2 4.5 2.4-7.6-6.2-4.5h7.6z"/>
             </svg>
          </div>

          <div>
             <h3 className="text-[20px] font-black mb-3 text-white">AI Pantry Tip</h3>
             <p className="text-[13px] text-white/80 leading-[1.6]">
               Your <span className="text-[#A7F3D0] font-bold">Mealie-meal</span> stock is high. AI Chef suggests preparing a large batch of Sadza for the community meal to avoid moisture spoilage.
             </p>
          </div>
          <div className="mt-6">
             <Button className="bg-[#10B981] hover:bg-[#059669] text-white font-bold text-[13px] px-5 py-2.5 h-auto rounded-[12px] border-none shadow-none">
               Try Bulk Recipe
             </Button>
          </div>
        </Card>
      </div>

      {/* Action Required Section */}
      <div className="px-4 lg:px-2 lg:mt-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
             <AlertCircle className="w-5 h-5 text-[#EF4444]" strokeWidth={2.5} />
             <h3 className="text-[16px] font-black text-[#0F172A]">Action Required</h3>
             <Badge className="bg-[#FEF2F2] text-[#EF4444] text-[10px] font-bold px-2 py-0 border-none shadow-none">Expiring {'<'} 48h</Badge>
          </div>
          <button className="text-[12px] font-bold text-[#64748B] hover:text-[#0F172A] transition-colors">View All</button>
        </div>

        <div className="flex flex-col gap-3">
          {urgentItems.map((item) => (
             <Card key={item.id} className="p-3 lg:px-4 lg:py-3 flex items-center justify-between border-[#E2E8F0] shadow-sm bg-white rounded-2xl">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#F1F5F9]">
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover mix-blend-multiply opacity-90" />
                   </div>
                   <div>
                      <h4 className="font-bold text-[14px] text-[#0F172A]">{item.name}</h4>
                      <p className="text-[11px] text-[#64748B]">{item.quantity}</p>
                   </div>
                </div>
                <div className="flex items-center gap-6">
                   <Badge className="bg-[#FEF2F2] text-[#EF4444] border-none font-bold text-[11px] px-3">
                    {Math.floor((new Date(item.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}d left
                   </Badge>
                   <button className="text-[#94A3B8] hover:text-[#0F172A]">
                      <MoreVertical className="w-4 h-4" />
                   </button>
                </div>
             </Card>
          ))}
        </div>
      </div>

      {/* Inventory List */}
      <div className="px-4 lg:px-2 lg:mt-6">
        <div className="flex justify-between items-center mb-4 lg:mb-5">
          <h3 className="text-[10px] lg:text-[16px] lg:capitalize lg:font-black lg:tracking-normal font-black uppercase tracking-widest text-[#0F172A] flex items-center gap-3">
             <span className="lg:hidden text-[#64748B]">All Items ({items.length})</span>
             <span className="hidden lg:inline">Inventory Summary</span>
          </h3>
          <div className="text-primary text-[10px] lg:text-[12px] font-bold lg:font-bold lg:tracking-normal lg:text-[#64748B] uppercase tracking-widest flex items-center gap-1.5 cursor-pointer">
            <span className="hidden lg:inline font-medium text-[#64748B]">Sorted by:</span> <span className="lg:text-[#107050]">Expiry (Closest)</span> <svg className="w-3 h-3 hidden lg:block text-[#107050]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:gap-3">
          {items.map((item) => {
            const isSelected = selectedItems.includes(item.id);
            
            return (
              <Card 
                key={item.id} 
                className={cn(
                  "p-3 lg:py-4 lg:px-5 flex items-center gap-4 lg:gap-6 transition-colors border",
                  isSelected 
                    ? "bg-[#F3FAF7] border-[#107050]/20 shadow-[0_2px_10px_-4px_rgba(16,112,80,0.1)]" 
                    : "bg-white border-[#E2E8F0] shadow-sm hover:border-gray-300"
                )}
              >
                {/* Desktop Checkbox */}
                <div className="hidden lg:flex items-center shrink-0">
                   <button 
                     onClick={() => toggleItem(item.id)}
                     className={cn(
                       "w-4 h-4 rounded-[4px] flex items-center justify-center border transition-colors",
                       isSelected ? "bg-white border-[#107050]" : "bg-white border-[#CBD5E1] hover:border-[#94A3B8]"
                     )}
                   >
                     {isSelected && <Check className="w-3 h-3 text-[#107050]" strokeWidth={4} />}
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
                <div className="w-12 h-12 lg:w-[48px] lg:h-[48px] rounded-[16px] overflow-hidden shrink-0 bg-[#F1F5F9] border border-[#E2E8F0]">
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover mix-blend-multiply opacity-90" />
                </div>

                {/* Item Details */}
                <div className="flex-1 min-w-0 flex flex-col lg:flex-row lg:items-center justify-between">
                  
                  {/* Info column */}
                  <div className="flexflex-col justify-center min-w-[300px]">
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <h4 className="font-black text-sm lg:text-[14px] truncate text-[#0F172A]">{item.name}</h4>
                      <Badge className="hidden lg:inline-flex bg-[#F1F5F9] text-[#64748B] px-2 py-0 text-[9px] uppercase tracking-wider font-black border-none h-[18px] shadow-none items-center">{item.category}</Badge>
                    </div>
                    <p className="text-[10px] text-text-secondary lg:hidden">{item.category}</p>
                    <div className="hidden lg:flex items-center gap-3 text-[11px] text-[#94A3B8] font-black">
                       <span className="flex items-center gap-1.5"><svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12V7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5" /><path d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2z" /><path d="M6 12v3a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-3" /></svg> {item.weight_kg}kg</span>
                       <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" strokeWidth={2.5} /> Live</span>
                    </div>
                  </div>

                  {/* Desktop Right Side: Expiry Text + Freshness Bar */}
                  <div className="flex flex-col lg:flex-row lg:items-center gap-8 pl-4 lg:w-[350px] justify-between">
                     
                     {/* Expiry Text */}
                     <div className="w-[80px]">
                        <span className={cn(
                          "text-[10px] font-black whitespace-nowrap",
                          item.status === 'expired' ? "text-[#EF4444]" : "text-[#107050]"
                        )}>
                          {Math.floor((new Date(item.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}d left
                        </span>
                     </div>

                     {/* Freshness Bar */}
                     <div className="flex items-center gap-4 w-[140px]">
                        <ProgressBar 
                          value={item.freshness_percentage || 10} 
                          variant={item.status === 'expired' ? 'danger' : 'primary'} 
                          className="h-[4px] bg-[#E2E8F0] flex-1" 
                        />
                        <span className="font-black text-[10px] text-[#94A3B8] w-[50px] text-right">{item.freshness_percentage || 10}% fresh</span>
                     </div>
                  </div>

                </div>

                {/* Desktop Kebab Menu */}
                <div className="hidden lg:flex justify-end w-6 shrink-0 pl-2">
                  <button className="text-[#94A3B8] hover:text-[#0F172A] p-1 rounded-lg transition-colors">
                     <MoreVertical className="w-4 h-4" strokeWidth={2} />
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
            className="fixed bottom-24 left-4 right-4 lg:left-[55%] lg:-translate-x-1/2 lg:w-[600px] lg:bottom-12 z-40 transition-all cursor-default"
          >
            <Card className="shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-[#E2E8F0] p-3 flex items-center justify-between gap-4 lg:gap-8 bg-white/95 backdrop-blur-xl rounded-[24px] lg:rounded-[20px] w-full mx-2">
               <div className="flex items-center justify-between w-full">
                  
                  {/* Left Side: Label */}
                  <div className="hidden lg:flex flex-col pl-4">
                     <p className="text-[9px] font-black text-[#94A3B8] uppercase tracking-widest leading-tight mb-0.5">Bulk Management</p>
                     <p className="text-[13px] font-black text-[#107050] leading-tight flex items-center gap-1.5">
                       {selectedItems.length} items selected
                     </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Button variant="outline" className="hidden lg:flex h-10 rounded-[12px] px-6 border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC] focus:bg-[#F8FAFC] transition-colors active:scale-95 font-bold text-[13px]" onClick={toggleAll}>
                      Select All Expiring
                    </Button>
                    <Button className="rounded-xl px-4 py-2 lg:h-10 lg:rounded-[12px] lg:px-6 flex items-center gap-2 bg-[#107050] hover:bg-[#065A3F] text-white shadow-md shadow-[#107050]/20 focus:outline-none transition-colors">
                      <span className="hidden lg:inline"><ChefHat className="w-4 h-4" strokeWidth={2.5} /></span>
                      <span className="font-bold text-[13px] hidden lg:inline">AI Recipe for These</span>
                    </Button>
                  </div>
               </div>
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

