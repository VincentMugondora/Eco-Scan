import React, { useState, useEffect, useRef } from "react";
import { X, Loader2, RefreshCcw, Upload, Trash2, CheckCircle2, ImageIcon, AlertTriangle, RotateCcw, LogIn } from "lucide-react";
import { Button } from "../ui/Button";
import { supabase } from "../../utils/supabaseClient";
import { Html5Qrcode } from "html5-qrcode";
import { motion, AnimatePresence } from "framer-motion";
import { usePantry } from "../../hooks/usePantry";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Types
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface ScanResult {
  item_name: string;
  category: string;
  estimated_expiry: string;
  confidence_score: number;
  carbon_impact_factor: number;
  co2e_saved: number;
  is_expired: boolean;
  freshness_grade: number;
  analysis_reasoning: string;
  previewUrl?: string;
  // Error & retry fields
  _error?: string;
  _file?: File;
  _retrying?: boolean;
  // Rate-limit fields
  _throttled?: boolean;
  _retryAfter?: number;
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

const PENDING_STORAGE_KEY = "eco_scan_pending";

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

  // Rate-limit / throttle state
  const [isThrottled, setIsThrottled] = useState(false);
  const [throttleCountdown, setThrottleCountdown] = useState(0);

  // Sequential scan progress
  const [scanProgress, setScanProgress] = useState<{ current: number; total: number } | null>(null);

  // Review Queue — holds all scanned results (including errored items)
  const [reviewQueue, setReviewQueue] = useState<ScanResult[]>([]);

  // Auth-gated save
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

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

  // Throttle countdown timer
  useEffect(() => {
    if (throttleCountdown <= 0) {
      setIsThrottled(false);
      return;
    }
    const timer = setInterval(() => {
      setThrottleCountdown(prev => {
        if (prev <= 1) {
          setIsThrottled(false);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [throttleCountdown]);

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
  const scanFile = async (file: File, previewUrl: string): Promise<ScanResult> => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch("http://127.0.0.1:8000/scan", {
        method: "POST",
        headers: { Authorization: `Bearer ${session?.access_token || ""}` },
        body: formData,
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({ detail: response.statusText }));

        // ── 429 Rate Limit ──
        if (response.status === 429) {
          const retryAfter = Math.ceil(errorBody?.detail?.retry_after ?? 60);
          setIsThrottled(true);
          setThrottleCountdown(retryAfter);
          return {
            item_name: file.name.split(".")[0] || "Unknown Item",
            category: "OTHER",
            estimated_expiry: "",
            confidence_score: 0,
            carbon_impact_factor: 0,
            co2e_saved: 0,
            is_expired: false,
            freshness_grade: 0,
            analysis_reasoning: "",
            previewUrl,
            _error: "Rate limited by Gemini API",
            _file: file,
            _throttled: true,
            _retryAfter: retryAfter,
          };
        }

        const statusLabel =
          response.status === 422 ? "AI Parse Error" :
          response.status === 503 ? "AI Service Unavailable" :
          `Error ${response.status}`;
        throw new Error(`${statusLabel}: ${typeof errorBody.detail === 'string' ? errorBody.detail : response.statusText}`);
      }

      const data = await response.json();
      return { ...data, previewUrl, _file: file };
    } catch (err: any) {
      console.error("[Scan Error]", file.name, err);
      return {
        item_name: file.name.split(".")[0] || "Unknown Item",
        category: "OTHER",
        estimated_expiry: "",
        confidence_score: 0,
        carbon_impact_factor: 0,
        co2e_saved: 0,
        is_expired: false,
        freshness_grade: 0,
        analysis_reasoning: "",
        previewUrl,
        _error: err.message || "Scan failed — unknown error",
        _file: file,
      };
    }
  };

  // ─────────────────────────────────────────────
  // Retry a single failed item
  // ─────────────────────────────────────────────
  const retryItem = async (index: number) => {
    const item = reviewQueue[index];
    if (!item._file || item._retrying) return;

    // Don't retry if globally throttled
    if (isThrottled) return;

    // Mark as retrying, clear throttle flag
    setReviewQueue(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], _retrying: true, _throttled: false };
      return updated;
    });

    const result = await scanFile(item._file, item.previewUrl || "");

    // Replace the item in-place
    setReviewQueue(prev => {
      const updated = [...prev];
      updated[index] = result;
      return updated;
    });
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
      setReviewQueue(prev => [...prev, result]);
    } finally {
      setIsScanningCamera(false);
    }
  };

  // ─────────────────────────────────────────────
  // File upload → sequential scan with cooldown
  // ─────────────────────────────────────────────
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 5);
    if (files.length === 0) return;
    setIsUploadScanning(true);
    setScanProgress({ current: 0, total: files.length });

    try {
      for (let i = 0; i < files.length; i++) {
        setScanProgress({ current: i + 1, total: files.length });
        const file = files[i];
        const previewUrl = URL.createObjectURL(file);
        const result = await scanFile(file, previewUrl);
        setReviewQueue(prev => [...prev, result]);

        // If rate limited, stop processing remaining files
        if (result._throttled) break;

        // 2-second cooldown between requests (skip after last)
        if (i < files.length - 1) {
          await new Promise(r => setTimeout(r, 2000));
        }
      }
    } finally {
      setIsUploadScanning(false);
      setScanProgress(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // ─────────────────────────────────────────────
  // Remove one item from the review queue
  // ─────────────────────────────────────────────
  const removeFromQueue = (index: number) => {
    setReviewQueue(prev => {
      const updated = [...prev];
      if (updated[index]?.previewUrl) URL.revokeObjectURL(updated[index].previewUrl!);
      updated.splice(index, 1);
      return updated;
    });
  };

  // ─────────────────────────────────────────────
  // Auth check + Bulk save to Supabase
  // ─────────────────────────────────────────────
  const handleSaveAll = async () => {
    const saveable = reviewQueue.filter(item => !item._error);
    if (saveable.length === 0 || isSaving) return;
    setIsSaving(true);

    try {
      // ── Auth Gate ──
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // Cache items in localStorage for recovery after login
        const toCache = saveable.map(({ previewUrl, _file, _retrying, ...rest }) => rest);
        localStorage.setItem(PENDING_STORAGE_KEY, JSON.stringify(toCache));
        setShowLoginPrompt(true);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();

      // ── Zero-ID Prevention ──
      if (!user?.id) {
        console.error("[Save] user.id is undefined — aborting insert.");
        const toCache = saveable.map(({ previewUrl, _file, _retrying, ...rest }) => rest);
        localStorage.setItem(PENDING_STORAGE_KEY, JSON.stringify(toCache));
        setShowLoginPrompt(true);
        return;
      }

      const rows = saveable.map(item => ({
        item_name: item.item_name,
        category: item.category,
        expiry_date: item.estimated_expiry,
        carbon_impact_factor: item.carbon_impact_factor,
        co2e_saved: item.co2e_saved,
        user_id: user.id,
      }));

      const { error } = await supabase.from("pantry_items").insert(rows).select();
      if (error) throw error;

      console.log(`[Save] Saved ${rows.length} items to pantry.`);

      // Revoke all preview URLs for saved items
      saveable.forEach(item => { if (item.previewUrl) URL.revokeObjectURL(item.previewUrl); });

      // Keep only errored items in the queue
      setReviewQueue(prev => prev.filter(item => !!item._error));

      localStorage.removeItem(PENDING_STORAGE_KEY);
      await refresh();
      if (onScanComplete) onScanComplete();
    } catch (err) {
      console.error("[Save Error]", err);
    } finally {
      setIsSaving(false);
    }
  };

  const isAnyLoading = isScanningCamera || isUploadScanning;
  const saveableCount = reviewQueue.filter(i => !i._error).length;
  const errorCount = reviewQueue.filter(i => !!i._error).length;

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
              {isUploadScanning
                ? scanProgress
                  ? `Scanning ${scanProgress.current}/${scanProgress.total}…`
                  : "Preparing…"
                : "Scanning..."}
            </motion.p>
            {isUploadScanning && (
              <p className="text-white/60 text-sm mt-2">Processing sequentially with cooldown</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Login Prompt Modal ─── */}
      <AnimatePresence>
        {showLoginPrompt && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center">
                  <LogIn className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Sign In Required</h3>
                  <p className="text-xs text-slate-400">Your items have been saved locally</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                You need to be signed in to save items to your pantry. Your scanned items have been cached and will be
                available after you sign in.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLoginPrompt(false)}
                  className="flex-1 h-12 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-sm font-bold transition-colors"
                >
                  Continue as Guest
                </button>
                <button
                  onClick={() => {
                    setShowLoginPrompt(false);
                    // Trigger navigation to sign-in by reloading (auth state will redirect)
                    window.location.reload();
                  }}
                  className="flex-1 h-12 bg-[#107050] hover:bg-[#065A3F] text-white rounded-2xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" /> Sign In
                </button>
              </div>
            </motion.div>
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
                <p className="text-xs text-slate-400 font-medium">
                  {saveableCount} item{saveableCount !== 1 ? "s" : ""} ready
                  {errorCount > 0 && <span className="text-red-500 ml-1">· {errorCount} failed</span>}
                </p>
              </div>
              <button onClick={() => { reviewQueue.forEach(i => { if (i.previewUrl) URL.revokeObjectURL(i.previewUrl); }); setReviewQueue([]); }} className="text-slate-400 hover:text-slate-700 transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable item list */}
            <div className="overflow-y-auto flex-1 px-4 py-3 flex flex-col gap-3">
              {reviewQueue.map((item, idx) => {
                const isError = !!item._error;
                const isRetrying = !!item._retrying;

                // ── Throttled Card (amber rate-limit variant) ──
                if (item._throttled) {
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex flex-col gap-2 rounded-2xl p-3 border bg-amber-50 border-amber-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-amber-100 flex items-center justify-center">
                          {item.previewUrl
                            ? <img src={item.previewUrl} alt={item.item_name} className="w-full h-full object-cover opacity-50" />
                            : <AlertTriangle className="w-6 h-6 text-amber-400" />
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-sm text-amber-700 truncate">{item.item_name}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[9px] font-black bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">RATE LIMITED</span>
                            {throttleCountdown > 0 && (
                              <span className="text-[11px] font-bold text-amber-600">Try again in {throttleCountdown}s</span>
                            )}
                          </div>
                        </div>
                        <button onClick={() => removeFromQueue(idx)} className="text-slate-300 hover:text-amber-500 transition-colors shrink-0">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => retryItem(idx)}
                        disabled={isRetrying || isThrottled}
                        className="w-full text-[11px] font-black text-amber-700 bg-amber-100 hover:bg-amber-200 disabled:opacity-60 rounded-xl py-2.5 transition-colors flex items-center justify-center gap-1.5"
                      >
                        {isRetrying
                          ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Retrying…</>
                          : isThrottled
                            ? <><AlertTriangle className="w-3.5 h-3.5" /> Wait {throttleCountdown}s</>
                            : <><RotateCcw className="w-3.5 h-3.5" /> Retry This Item</>
                        }
                      </button>
                    </motion.div>
                  );
                }

                // ── Error Card ──
                if (isError) {
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex flex-col gap-2 rounded-2xl p-3 border bg-red-50 border-red-200"
                    >
                      <div className="flex items-center gap-3">
                        {/* Preview */}
                        <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-red-100 flex items-center justify-center">
                          {item.previewUrl
                            ? <img src={item.previewUrl} alt={item.item_name} className="w-full h-full object-cover opacity-50" />
                            : <AlertTriangle className="w-6 h-6 text-red-400" />
                          }
                        </div>
                        {/* Error info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-sm text-red-700 truncate">{item.item_name}</p>
                          <p className="text-[11px] text-red-500 leading-snug mt-0.5 line-clamp-2">{item._error}</p>
                        </div>
                        {/* Remove */}
                        <button onClick={() => removeFromQueue(idx)} className="text-slate-300 hover:text-red-500 transition-colors shrink-0">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {/* Retry Button */}
                      <button
                        onClick={() => retryItem(idx)}
                        disabled={isRetrying}
                        className="w-full text-[11px] font-black text-red-700 bg-red-100 hover:bg-red-200 disabled:opacity-60 rounded-xl py-2.5 transition-colors flex items-center justify-center gap-1.5"
                      >
                        {isRetrying
                          ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Retrying…</>
                          : <><RotateCcw className="w-3.5 h-3.5" /> Retry This Item</>
                        }
                      </button>
                    </motion.div>
                  );
                }

                // ── Normal Card ──
                const expired = item.is_expired;
                const cookNow = !expired && item.freshness_grade < 4;
                const cardBg = expired
                  ? "bg-red-50 border-red-200"
                  : cookNow
                  ? "bg-amber-50 border-amber-200"
                  : "bg-slate-50 border-slate-100";

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`flex flex-col gap-2 rounded-2xl p-3 border ${cardBg}`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Preview thumbnail */}
                      <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-slate-200 flex items-center justify-center relative">
                        {item.previewUrl
                          ? <img src={item.previewUrl} alt={item.item_name} className="w-full h-full object-cover" />
                          : <ImageIcon className="w-6 h-6 text-slate-400" />
                        }
                        {expired && (
                          <div className="absolute inset-0 bg-red-500/60 flex items-center justify-center">
                            <span className="text-white text-lg">⚠️</span>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`font-black text-sm truncate ${expired ? "text-red-700" : "text-slate-900"}`}>{item.item_name}</p>
                          {expired && <span className="text-[9px] font-black bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full shrink-0">EXPIRED</span>}
                          {cookNow && <span className="text-[9px] font-black bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full shrink-0">USE SOON</span>}
                        </div>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${CATEGORY_COLORS[item.category] || CATEGORY_COLORS.OTHER}`}>
                            {item.category}
                          </span>
                          <span className={`text-[10px] font-bold ${expired ? "text-red-600" : "text-amber-600"}`}>Exp: {item.estimated_expiry}</span>
                        </div>

                        {/* Freshness grade bar */}
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[9px] font-black text-slate-400 w-14">Freshness</span>
                          <div className="flex-1 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                item.freshness_grade >= 7 ? "bg-emerald-500"
                                : item.freshness_grade >= 4 ? "bg-amber-400"
                                : "bg-red-500"
                              }`}
                              style={{ width: `${(item.freshness_grade / 10) * 100}%` }}
                            />
                          </div>
                          <span className={`text-[10px] font-black w-4 ${
                            item.freshness_grade >= 7 ? "text-emerald-600"
                            : item.freshness_grade >= 4 ? "text-amber-600"
                            : "text-red-600"
                          }`}>{item.freshness_grade}</span>
                        </div>
                      </div>

                      {/* Remove */}
                      <button onClick={() => removeFromQueue(idx)} className="text-slate-300 hover:text-red-500 transition-colors shrink-0">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Analysis Reasoning */}
                    {item.analysis_reasoning && (
                      <p className={`text-[11px] font-medium leading-snug px-1 ${
                        expired ? "text-red-600" : cookNow ? "text-amber-700" : "text-slate-500"
                      }`}>
                        🔍 {item.analysis_reasoning}
                      </p>
                    )}

                    {/* Cook Now CTA */}
                    {cookNow && (
                      <button className="w-full text-[11px] font-black text-amber-700 bg-amber-100 hover:bg-amber-200 rounded-xl py-2 transition-colors flex items-center justify-center gap-1.5">
                        🍳 Cook Now — Use Before It's Too Late!
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Save All Button */}
            <div className="px-5 pb-8 pt-3 shrink-0">
              <button
                onClick={handleSaveAll}
                disabled={isSaving || saveableCount === 0}
                className="w-full h-14 bg-[#107050] hover:bg-[#065A3F] disabled:opacity-70 text-white rounded-[22px] text-base font-black shadow-[0_10px_25px_-5px_rgba(16,112,80,0.4)] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isSaving
                  ? <Loader2 className="w-5 h-5 animate-spin" />
                  : <><CheckCircle2 className="w-5 h-5" /> Save {saveableCount} Item{saveableCount !== 1 ? "s" : ""}</>
                }
              </button>
              {errorCount > 0 && (
                <p className="text-center text-[11px] text-red-500 font-bold mt-2">
                  {errorCount} item{errorCount !== 1 ? "s" : ""} failed — retry or remove before saving
                </p>
              )}
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
