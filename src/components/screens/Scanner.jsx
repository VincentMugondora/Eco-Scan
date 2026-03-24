import React from "react";
import { X, Zap, Image as ImageIcon, Search, Plus } from "lucide-react";
import { Button } from "../ui/Button";

const Scanner = () => {
  return (
    <div className="relative h-screen bg-black overflow-hidden flex flex-col pt-12">
      {/* Top Bar */}
      <div className="absolute top-12 left-0 right-0 px-4 flex justify-between items-center z-20">
        <Button variant="ghost" size="icon" className="bg-black/20 backdrop-blur-md text-white">
          <X className="w-6 h-6" />
        </Button>
        <div className="bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
          <p className="text-white text-xs font-bold uppercase tracking-wider">Searching for fresh items...</p>
        </div>
        <Button variant="ghost" size="icon" className="bg-black/20 backdrop-blur-md text-white">
          <Zap className="w-6 h-6" />
        </Button>
      </div>

      {/* Camera View Overlay (Simulated) */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1543083477-4f7f4ecda004?q=80&w=1200&auto=format&fit=crop" 
          alt="Camera stream" 
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
      </div>

      {/* Scan Reticle */}
      <div className="absolute inset-x-12 top-1/2 -translate-y-1/2 aspect-square z-10">
        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl" />
        <div className="absolute inset-0 flex items-center justify-center">
           <div className="w-full h-0.5 bg-primary/40 animate-pulse shadow-[0_0_15px_rgba(6,122,87,1)]" />
        </div>
      </div>

      {/* Manual Entry Result Overlay */}
      <div className="absolute bottom-48 left-6 right-6 z-20">
         <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl flex items-center justify-between animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-primary-light rounded-xl flex items-center justify-center shadow-sm">
                  <div className="w-5 h-5 border-2 border-primary rounded" />
               </div>
               <div>
                  <h4 className="font-bold text-sm">Spinach (Covo)</h4>
                  <p className="text-[10px] text-text-secondary flex items-center gap-1">
                     <span className="text-primary font-bold">98% Match</span> • Rich in Iron • Use within 4 days
                  </p>
               </div>
            </div>
            <Button size="icon" className="w-10 h-10 bg-primary/20 text-primary border-none shadow-none">
               <Plus className="w-5 h-5 font-bold" />
            </Button>
         </div>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-12 left-0 right-0 flex items-center justify-between px-8 z-30">
        <div className="relative group">
           <div className="w-12 h-12 bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden border border-white/20">
              <img src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover" />
           </div>
           <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border border-black" />
        </div>

        <button className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center group active:scale-90 transition-all">
          <div className="w-16 h-16 bg-white rounded-full group-hover:bg-white/90 shadow-lg" />
        </button>

        <Button variant="ghost" size="icon" className="w-12 h-12 bg-white/10 backdrop-blur-lg text-white rounded-xl border border-white/20">
           <ImageIcon className="w-5 h-5" />
        </Button>
      </div>

      <div className="absolute bottom-36 left-0 right-0 flex justify-center z-30">
        <Button variant="ghost" className="bg-black/40 backdrop-blur-md text-white border border-white/20 rounded-full flex items-center gap-2 py-2 px-6">
           <Search className="w-4 h-4" />
           <span className="text-[10px] font-black uppercase tracking-wider">Manual Entry</span>
        </Button>
      </div>
    </div>
  );
};

export { Scanner };
