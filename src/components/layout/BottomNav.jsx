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
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 px-6 py-4 flex justify-between items-center z-50">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className="flex flex-col items-center gap-1 group relative pb-2"
        >
          <tab.icon
            className={cn(
              "w-6 h-6 transition-all",
              activeTab === tab.id ? "text-primary scale-110" : "text-[#94A3B8] group-hover:text-primary/70"
            )}
            strokeWidth={activeTab === tab.id ? 2.5 : 2}
          />
          <span
            className={cn(
              "text-[10px] font-bold transition-all",
              activeTab === tab.id ? "text-primary opacity-100" : "text-[#94A3B8] opacity-100"
            )}
          >
            {tab.label}
          </span>
          {activeTab === tab.id && (
            <div className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full" />
          )}
        </button>
      ))}
    </div>
  );
};

export { BottomNav };

function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}
