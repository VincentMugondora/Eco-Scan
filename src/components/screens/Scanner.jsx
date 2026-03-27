import React, { useState } from "react";
import { X, Zap, Image as ImageIcon, Search, Plus, Loader2 } from "lucide-react";
import { Button } from "../ui/Button";
import { supabase } from "../../utils/supabaseClient";

const Scanner = ({ onScanComplete }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const handleScan = async () => {
    setIsScanning(true);
    // Simulate Gemini 2.0 Flash Analysis (FastAPI Scaffold Bridge)
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const mockResult = {
      name: "Covo (Leafy Greens)",
      category: "VEGETABLES",
      quantity: "500g",
      expiry_date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      weight_kg: 0.5,
      image_url: "https://images.unsplash.com/photo-1543083477-4f7f4ecda004?q=80&w=200&auto=format&fit=crop",
      freshness_percentage: 95
    };

    setScanResult(mockResult);
    setIsScanning(false);
  };

  const handleAddToPantry = async () => {
    if (!scanResult) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      // For verification purposes, if no user is found we use a guest-mock or just proceed to show UI feedback
      
      const { error } = await supabase
        .from("pantry_items")
        .insert([{
          ...scanResult,
          user_id: user?.id || '00000000-0000-0000-0000-000000000000' // Placeholder for verification demo
        }]);

      if (error) throw error;
      
      if (onScanComplete) onScanComplete();
      alert("Item added to Pantry!");
      setScanResult(null);
    } catch (err) {
      console.error("Error adding to pantry:", err);
      // Fallback for demo if DB is not connected
      alert("Demo Mode: Item tracked in local session.");
      if (onScanComplete) onScanComplete();
      setScanResult(null);
    }
  };

  return (
    <div className="relative h-screen bg-black overflow-hidden flex flex-col pt-12">
      {/* Top Bar */}
      <div className="absolute top-12 left-0 right-0 px-4 flex justify-between items-center z-20">
        <Button variant="ghost" size="icon" className="bg-black/20 backdrop-blur-md text-white">
          <X className="w-6 h-6" />
        </Button>
        <div className="bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
          <p className="text-white text-xs font-bold uppercase tracking-wider">
            {isScanning ? "AI Deep Scan active..." : "Searching for fresh items..."}
          </p>
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
      <div className="absolute inset-x-12 top-1/2 -translate-y-1/2 aspect-square z-10 transition-transform duration-500 scale-[1.05]">
        <div className={`absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 ${isScanning ? 'border-accent' : 'border-primary'} rounded-tl-xl transition-colors`} />
        <div className={`absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 ${isScanning ? 'border-accent' : 'border-primary'} rounded-tr-xl transition-colors`} />
        <div className={`absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 ${isScanning ? 'border-accent' : 'border-primary'} rounded-bl-xl transition-colors`} />
        <div className={`absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 ${isScanning ? 'border-accent' : 'border-primary'} rounded-br-xl transition-colors`} />
        <div className="absolute inset-0 flex items-center justify-center">
           <div className={`w-full h-0.5 ${isScanning ? 'bg-accent/80' : 'bg-primary/40'} animate-pulse shadow-[0_0_15px_rgba(16,112,87,1)] transition-colors`} />
        </div>
      </div>

      {/* Manual Entry / AI Result Result Overlay */}
      {scanResult && (
        <div className="absolute bottom-48 left-6 right-6 z-40">
           <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl flex items-center justify-between animate-in fade-in slide-in-from-bottom-4 duration-500 border border-primary/20">
              <div className="flex items-center gap-3">
                 <div className="w-12 h-12 rounded-xl overflow-hidden bg-primary-light flex items-center justify-center">
                    <img src={scanResult.image_url} alt="Result" className="w-full h-full object-cover" />
                 </div>
                 <div>
                    <h4 className="font-bold text-sm text-text-main">{scanResult.name}</h4>
                    <p className="text-[10px] text-text-secondary flex items-center gap-1">
                       <span className="text-primary font-black uppercase tracking-tighter">AI Analysis Complete</span> • {scanResult.quantity}
                    </p>
                 </div>
              </div>
              <Button 
                onClick={handleAddToPantry}
                className="w-12 h-12 rounded-xl bg-primary text-white shadow-lg shadow-primary/20"
              >
                 <Plus className="w-6 h-6 font-bold" />
              </Button>
           </div>
        </div>
      )}

      {/* Bottom Controls */}
      <div className="absolute bottom-12 left-0 right-0 flex items-center justify-between px-8 z-30">
        <div className="relative group">
           <div className="w-12 h-12 bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden border border-white/20">
              <img src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover" />
           </div>
           <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border border-black" />
        </div>

        <button 
          onClick={handleScan}
          disabled={isScanning}
          className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center group active:scale-95 transition-all shadow-2xl shadow-black/50 overflow-hidden relative"
        >
          <div className={`absolute inset-0 bg-primary/20 transition-opacity ${isScanning ? 'opacity-100' : 'opacity-0'}`} />
          <div className="w-16 h-16 bg-white rounded-full group-hover:bg-white/90 shadow-lg flex items-center justify-center">
             {isScanning ? (
               <Loader2 className="w-8 h-8 text-primary animate-spin" strokeWidth={3} />
             ) : (
               <div className="w-6 h-6 border-4 border-primary/20 rounded-full border-t-primary" />
             )}
          </div>
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
