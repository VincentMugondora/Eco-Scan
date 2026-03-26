import React from "react";
import { Home, ClipboardList, Scan, Target } from "lucide-react";

/**
 * Bottom navigation for mobile view
 * @param {Object} props
 * @param {string} props.activeTab
 * @param {Function} props.setActiveTab
 */
const BottomNav = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "home", icon: Home, label: "Home" },
    { id: "pantry", icon: ClipboardList, label: "Pantry" },
    { id: "scan", icon: Scan, label: "Scan" },
    { id: "impact", icon: Target, label: "Impact" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/85 backdrop-blur-2xl border-t border-[#E2E8F0]/80 px-4 pb-safe-bottom pt-3 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.05)] z-50 transition-all duration-300">
      {/* Adding a pb-3 or pb-5 explicitly if pb-safe isn't handled by tailwind plugin, using safe-area env directly in inline style if needed, but styling via tailwind for fallback */}
      <div className="flex justify-between items-center max-w-md mx-auto relative pb-3" style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex flex-col items-center gap-1 group relative w-[22%] -mt-1 pt-1"
            >
              {/* Highlight Pill for Active Tab */}
              <div className={cn(
                "absolute inset-0 bg-[#F3FAF7] rounded-[16px] -z-10 transition-all duration-300 scale-90 opacity-0",
                isActive ? "opacity-100 scale-100" : ""
              )}></div>

              <div className={cn(
                "relative z-10 w-12 h-8 rounded-full flex flex-col items-center justify-center transition-all duration-300",
                isActive ? "" : "group-hover:-translate-y-0.5"
              )}>
                <tab.icon
                  className={cn(
                    "w-5 h-5 transition-all duration-300",
                    isActive ? "text-[#107050]" : "text-[#94A3B8] group-hover:text-[#64748B]"
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </div>
              
              <span
                className={cn(
                  "text-[10px] font-bold transition-all duration-300 relative z-10 mt-0.5",
                  isActive ? "text-[#107050] scale-100" : "text-[#94A3B8] scale-95 opacity-80"
                )}
              >
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  );
};

export { BottomNav };

function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}
