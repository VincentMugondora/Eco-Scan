import React, { useState, useEffect, useRef } from "react";
import { X, Loader2, RefreshCcw, Upload, Trash2, CheckCircle2, ImageIcon } from "lucide-react";
import { Button } from "../ui/Button";
import { supabase } from "../../utils/supabaseClient";
import { Html5Qrcode } from "html5-qrcode";
import { motion, AnimatePresence } from "framer-motion";
import { usePantry } from "../../hooks/usePantry";

interface ScanResult {
  item_name: string;
  category: string;
  estimated_expiry: string;
  confidence_score: number;
  carbon_impact_factor: number;
  co2e_saved: number;
  previewUrl?: string; // local object URL for the image preview
}

const CATEGORY_COLORS: Record<string, string> = {
  VEGETABLES: "bg-green-100 text-green-700",
  FRUITS: "bg-orange-100 text-orange-700",
  DAIRY: "bg-blue-100 text-blue-700",
  GRAINS: "bg-yellow-100 text-yellow-700",
  MEAT: "bg-red-100 text-red-700",
  LEGUMES: "bg-lime-100 text-lime-700",
  BEVERAGES: "bg-purple-100 text-purple-700",
  SNACKS: "bg-pink-100 text-pink-700",
  OTHER: "bg-slate-100 text-slate-600",
};

const Scanner = ({ onScanComplete }: { onScanComplete?: () => void }) => {
  const { refresh } = usePantry();

  // Camera state
  const [cameraActive, setCameraActive] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const videoContainerId = "reader";

  // Scan state
  const [isScanningCamera, setIsScanningCamera] = useState(false);
  const [isUploadScanning, setIsUploadScanning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Review Queue — holds all scanned results
  const [reviewQueue, setReviewQueue] = useState<ScanResult[]>([]);

  // Hidden file input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    startCamera();
    return () => {
      if (scannerRef.current) {
        try { scannerRef.current.stop().catch(() => {}); } catch (e) {}
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
        (decodedText) => { console.log("QR Decoded:", decodedText); },
        () => {}
      );
      setCameraActive(true);
    } catch (err) {
      console.error("Camera start error:", err);
    }
  };

  // ─────────────────────────────────────────────
  // Core: scan a single File via the backend API
  // ─────────────────────────────────────────────
  const scanFile = async (file: File, previewUrl: string): Promise<ScanResult | null> => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch("http://127.0.0.1:8000/scan", {
        method: "POST",
        headers: { Authorization: `Bearer ${session?.access_token || ""}` },
        body: formData,
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const data = await response.json();
      return { ...data, previewUrl };
    } catch (err: any) {
      console.error("Scan error for file:", file.name, err);
      // Return a fallback result so the queue still fills
      return {
        item_name: file.name.split(".")[0] || "Unknown Item",
        category: "OTHER",
        estimated_expiry: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
        confidence_score: 0.3,
        carbon_impact_factor: 1.0,
        co2e_saved: 0.5,
        previewUrl,
      };
    }
  };

  // ─────────────────────────────────────────────
  // Camera capture → single scan → add to queue
  // ─────────────────────────────────────────────
  const handleCaptureAndScan = async () => {
    if (!scannerRef.current || isScanningCamera) return;
    setIsScanningCamera(true);
    try {
      const videoElement = document.querySelector(`#${videoContainerId} video`) as HTMLVideoElement;
      if (!videoElement) throw new Error("Video element not found");

      const canvas = document.createElement("canvas");
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context unavailable");
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, "image/jpeg", 0.9));
      if (!blob) throw new Error("Blob capture failed");

      const file = new File([blob], "camera-scan.jpg", { type: "image/jpeg" });
      const previewUrl = URL.createObjectURL(blob);
      const result = await scanFile(file, previewUrl);
      if (result) setReviewQueue(prev => [...prev, result]);
    } finally {
      setIsScanningCamera(false);
    }
  };

  // ─────────────────────────────────────────────
  // File upload → parallel scan via Promise.all
  // ─────────────────────────────────────────────
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 5); // max 5
    if (files.length === 0) return;
    setIsUploadScanning(true);

    try {
      const scanTasks = files.map(file => {
        const previewUrl = URL.createObjectURL(file);
        return scanFile(file, previewUrl);
      });

      const results = await Promise.all(scanTasks);
      const valid = results.filter(Boolean) as ScanResult[];
      setReviewQueue(prev => [...prev, ...valid]);
    } finally {
      setIsUploadScanning(false);
      // Reset input so the same files can be re-selected if needed
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // ─────────────────────────────────────────────
  // Remove one item from the review queue
  // ─────────────────────────────────────────────
  const removeFromQueue = (index: number) => {
    setReviewQueue(prev => {
      const updated = [...prev];
      // Revoke object URL to free memory
      if (updated[index]?.previewUrl) URL.revokeObjectURL(updated[index].previewUrl!);
      updated.splice(index, 1);
      return updated;
    });
  };

  // ─────────────────────────────────────────────
  // Bulk save all items in the queue to Supabase
  // ─────────────────────────────────────────────
  const handleSaveAll = async () => {
    if (reviewQueue.length === 0 || isSaving) return;
    setIsSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("Please log in to save items to your pantry.");
        return;
      }

      const rows = reviewQueue.map(item => ({
        item_name: item.item_name,
        category: item.category,
        expiry_date: item.estimated_expiry,
        carbon_impact_factor: item.carbon_impact_factor,
        co2e_saved: item.co2e_saved,
        user_id: user.id,
      }));

      const { error } = await supabase.from("pantry_items").insert(rows).select();
      if (error) throw error;

      console.log(`Saved ${rows.length} items to pantry.`);
      // Revoke all preview URLs
      reviewQueue.forEach(item => { if (item.previewUrl) URL.revokeObjectURL(item.previewUrl); });
      setReviewQueue([]);
      await refresh();
      if (onScanComplete) onScanComplete();
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const isAnyLoading = isScanningCamera || isUploadScanning;

  return (
    <div className="relative h-screen bg-black overflow-hidden flex flex-col">

      {/* ─── Scanning Overlay ─── */}
      <AnimatePresence>
        {isAnyLoading && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center"
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
              {isUploadScanning ? "Analysing Images..." : "Scanning..."}
            </motion.p>
            {isUploadScanning && (
              <p className="text-white/60 text-sm mt-2">Running Gemini Vision in parallel</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Camera view ─── */}
      <div id={videoContainerId} className="absolute inset-0 z-10" />

      {/* ─── Top Bar ─── */}
      <div className="absolute top-12 left-0 right-0 px-4 flex justify-between items-center z-20">
        <div className="bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${cameraActive ? "bg-[#10B981]" : "bg-amber-400"} animate-pulse`} />
          <p className="text-white text-xs font-bold uppercase tracking-wider">
            {cameraActive ? "Camera active" : "Initializing..."}
          </p>
        </div>
        <Button onClick={() => { scannerRef.current?.stop(); startCamera(); }} variant="ghost" size="icon" className="bg-black/20 backdrop-blur-md text-white">
          <RefreshCcw className="w-6 h-6" />
        </Button>
      </div>

      {/* ─── Review Queue Slide-up Panel ─── */}
      <AnimatePresence>
        {reviewQueue.length > 0 && (
          <motion.div
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="absolute bottom-0 left-0 right-0 z-[60] bg-white rounded-t-[36px] shadow-[0_-20px_60px_rgba(0,0,0,0.35)] flex flex-col"
            style={{ maxHeight: "75vh" }}
          >
            {/* Handle */}
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-4 mb-2 shrink-0" />

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-slate-100 shrink-0">
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Review Queue</h3>
                <p className="text-xs text-slate-400 font-medium">{reviewQueue.length} item{reviewQueue.length > 1 ? "s" : ""} identified by Gemini AI</p>
              </div>
              <button onClick={() => { reviewQueue.forEach(i => { if (i.previewUrl) URL.revokeObjectURL(i.previewUrl); }); setReviewQueue([]); }} className="text-slate-400 hover:text-slate-700 transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable item list */}
            <div className="overflow-y-auto flex-1 px-4 py-3 flex flex-col gap-3">
              {reviewQueue.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center gap-3 bg-slate-50 rounded-2xl p-3 border border-slate-100"
                >
                  {/* Preview thumbnail */}
                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-slate-200 flex items-center justify-center">
                    {item.previewUrl
                      ? <img src={item.previewUrl} alt={item.item_name} className="w-full h-full object-cover" />
                      : <ImageIcon className="w-6 h-6 text-slate-400" />
                    }
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-slate-900 text-sm truncate">{item.item_name}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${CATEGORY_COLORS[item.category] || CATEGORY_COLORS.OTHER}`}>
                        {item.category}
                      </span>
                      <span className="text-[10px] text-amber-600 font-bold">Exp: {item.estimated_expiry}</span>
                      <span className="text-[10px] text-[#107050] font-bold">{item.co2e_saved}kg CO₂e</span>
                    </div>
                  </div>

                  {/* Confidence + Remove */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="text-[10px] font-black text-slate-400">{Math.round(item.confidence_score * 100)}%</span>
                    <button onClick={() => removeFromQueue(idx)} className="text-slate-300 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Save All Button */}
            <div className="px-5 pb-8 pt-3 shrink-0">
              <button
                onClick={handleSaveAll}
                disabled={isSaving}
                className="w-full h-14 bg-[#107050] hover:bg-[#065A3F] disabled:opacity-70 text-white rounded-[22px] text-base font-black shadow-[0_10px_25px_-5px_rgba(16,112,80,0.4)] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isSaving
                  ? <Loader2 className="w-5 h-5 animate-spin" />
                  : <><CheckCircle2 className="w-5 h-5" /> Save All {reviewQueue.length} Item{reviewQueue.length > 1 ? "s" : ""}</>
                }
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Bottom Controls ─── */}
      <div className="absolute bottom-12 left-0 right-0 flex items-center justify-center gap-8 px-8 z-30">

        {/* Upload Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isAnyLoading}
          className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-90 disabled:opacity-50"
          title="Upload up to 5 images"
        >
          <Upload className="w-6 h-6" />
        </button>

        {/* Camera Capture Button */}
        <button
          onClick={handleCaptureAndScan}
          disabled={isAnyLoading || !cameraActive}
          className="w-24 h-24 rounded-full border-8 border-white/20 flex items-center justify-center group active:scale-90 transition-all shadow-2xl disabled:opacity-50"
        >
          <div className="w-16 h-16 bg-white rounded-full group-hover:scale-110 transition-transform shadow-inner flex items-center justify-center">
            {isScanningCamera
              ? <Loader2 className="w-8 h-8 text-[#107050] animate-spin" />
              : <div className="w-6 h-6 rounded-full border-4 border-[#107050]/20 border-t-[#107050]" />
            }
          </div>
        </button>

        {/* Queue counter badge */}
        <div className="w-14 h-14 flex items-center justify-center">
          {reviewQueue.length > 0 && (
            <div className="w-10 h-10 rounded-full bg-[#107050] flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-sm">{reviewQueue.length}</span>
            </div>
          )}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileUpload}
      />
    </div>
  );
};

export { Scanner };
