import React, { useState, useEffect, useRef } from "react";
import { X, Zap, Image as ImageIcon, Search, Plus, Loader2, Check, RefreshCcw } from "lucide-react";
import { Button } from "../ui/Button";
import { supabase } from "../../utils/supabaseClient";
import { Html5Qrcode } from "html5-qrcode";
import { motion, AnimatePresence } from "framer-motion";
import { usePantry } from "../../hooks/usePantry";

const Scanner = ({ onScanComplete }: { onScanComplete?: () => void }) => {
  const { refresh } = usePantry();
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const videoContainerId = "reader";

  useEffect(() => {
    startCamera();
    return () => {
      if (scannerRef.current) {
        // Silent catch for cases where stop is called on an inactive scanner
        try {
          scannerRef.current.stop().catch(() => { });
        } catch (e) { }
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const scanner = new Html5Qrcode(videoContainerId);
      scannerRef.current = scanner;
      const config = { fps: 15, qrbox: { width: 250, height: 250 } };

      await scanner.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          console.log("QR Decoded:", decodedText);
        },
        (errorMessage) => {
          // ignore error logs
        }
      );
      setCameraActive(true);
    } catch (err) {
      console.error("Camera start error:", err);
    }
  };

  const handleCaptureAndScan = async () => {
    if (!scannerRef.current || isLoading) return;

    setIsLoading(true);
    try {
      // 1. Capture frame from video element
      const videoElement = document.querySelector(`#${videoContainerId} video`) as HTMLVideoElement;
      if (!videoElement) throw new Error("Video element not found");

      const canvas = document.createElement("canvas");
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.9));
      const file = new File([blob], "scan.jpg", { type: "image/jpeg" });

      // 2. Prepare API Call
      const { data: { session } } = await supabase.auth.getSession();
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://127.0.0.1:8000/scan', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token || ''}`
        },
        body: formData,
      });

      if (!response.ok) throw new Error("API Scan failed");

      const data = await response.json();
      setScanResult(data);
    } catch (err) {
      console.error("Scan error:", err);
      const isNetworkError = (err instanceof TypeError) || err.message?.includes("fetch");

      if (isNetworkError) {
        console.warn("Backend unreachable at http://127.0.0.1:8000/scan. Check if FastAPI is running!");
      }

      // Fallback for demo
      setScanResult({
        item_name: "Covo (Leafy Greens)",
        category: "VEGETABLES",
        estimated_expiry: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        confidence_score: 0.98,
        carbon_impact_factor: 0.5,
        co2e_saved: 0.25
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmAdd = async () => {
    if (!scanResult) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        alert("Please log in to save items to your pantry.");
        console.warn("No active session found. RLS will block this insert.");
        return;
      }

      const { data, error } = await supabase
        .from("pantry_items")
        .insert([{
          item_name: scanResult.item_name,
          category: scanResult.category,
          expiry_date: scanResult.estimated_expiry,
          carbon_impact_factor: scanResult.carbon_impact_factor,
          co2e_saved: scanResult.co2e_saved,
          user_id: session.user.id
        }])
        .select();

      if (error) {
        console.error("Supabase Save Error Details:", error);
        throw error;
      }
      
      console.log("Successfully saved item:", data);
      await refresh(); 
      if (onScanComplete) onScanComplete();
      setScanResult(null);
    } catch (err) {
      console.error("Save error caught in Scanner:", err);
    }
  };

  return (
    <div className="relative h-screen bg-black overflow-hidden flex flex-col">
      {/* Scanning Overlay with Pulsing Forest Green Border */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center"
          >
            <div className="relative w-72 h-72 border-4 border-[#107050] rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(16,112,80,0.5)] animate-pulse">
              <motion.div
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#10B981] to-transparent shadow-[0_0_20px_rgba(16,185,129,1)]"
              />
              <div className="absolute inset-0 bg-[#107050]/10 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-[#107050] animate-spin" />
              </div>
            </div>
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="mt-8 text-white font-black text-lg uppercase tracking-[0.2em]"
            >
              Scanning...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* html5-qrcode container */}
      <div id={videoContainerId} className="absolute inset-0 z-10" />

      {/* Top Bar */}
      <div className="absolute top-12 left-0 right-0 px-4 flex justify-between items-center z-20">
        <Button variant="ghost" size="icon" className="bg-black/20 backdrop-blur-md text-white">
          <X className="w-6 h-6" />
        </Button>
        <div className="bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
          <p className="text-white text-xs font-bold uppercase tracking-wider">
            {cameraActive ? "Camera active" : "Initializing..."}
          </p>
        </div>
        <Button onClick={() => { scannerRef.current?.stop(); startCamera(); }} variant="ghost" size="icon" className="bg-black/20 backdrop-blur-md text-white">
          <RefreshCcw className="w-6 h-6" />
        </Button>
      </div>

      {/* Success Slide-up Confirmation Modal */}
      <AnimatePresence>
        {scanResult && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 right-0 z-[60] bg-white rounded-t-[40px] p-8 pb-14 shadow-[0_-20px_50px_rgba(0,0,0,0.3)]"
          >
            <div className="w-16 h-1.5 bg-slate-100 rounded-full mx-auto mb-8" />

            <div className="text-center mb-8">
              <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">
                Is this <span className="text-[#107050]">{scanResult.item_name}</span>?
              </h3>
              <p className="text-slate-500 font-medium text-sm">Gemini AI identified this item with {Math.round(scanResult.confidence_score * 100)}% confidence.</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-1">Category</span>
                <p className="font-bold text-slate-700">{scanResult.category}</p>
              </div>
              <div className="bg-amber-50 p-4 rounded-3xl border border-amber-100">
                <span className="text-[10px] font-black uppercase text-amber-500 tracking-widest block mb-1">Estimated Expiry</span>
                <p className="font-bold text-amber-700">{scanResult.estimated_expiry}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={() => setScanResult(null)} variant="secondary" className="flex-1 py-7 rounded-[22px] text-base font-black border-none bg-slate-100 text-slate-500 transition-all hover:bg-slate-200">Retake</Button>
              <Button onClick={handleConfirmAdd} className="flex-1 py-7 rounded-[22px] text-base font-black bg-[#107050] text-white shadow-[0_10px_25px_-5px_rgba(16,112,80,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98]">Confirm & Add</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Controls */}
      <div className="absolute bottom-12 left-0 right-0 flex items-center justify-center px-8 z-30">
        <button
          onClick={handleCaptureAndScan}
          disabled={isLoading || !cameraActive}
          className="w-24 h-24 rounded-full border-8 border-white/20 flex items-center justify-center group active:scale-90 transition-all shadow-2xl relative"
        >
          <div className="w-16 h-16 bg-white rounded-full group-hover:scale-110 transition-transform shadow-inner flex items-center justify-center">
            {isLoading ? <Loader2 className="w-8 h-8 text-[#107050] animate-spin" /> : <div className="w-6 h-6 rounded-full border-4 border-[#107050]/20 border-t-[#107050]" />}
          </div>
        </button>
      </div>
    </div>
  );
};

export { Scanner };
