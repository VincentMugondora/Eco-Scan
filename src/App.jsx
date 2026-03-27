import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Dashboard } from "./components/screens/Dashboard";
import { Pantry } from "./components/screens/Pantry";
import { Scanner } from "./components/screens/Scanner";
import { Recipes } from "./components/screens/Recipes";
import { BottomNav } from "./components/layout/BottomNav";
import { Sidebar } from "./components/layout/Sidebar";
import { RightSidebar } from "./components/layout/RightSidebar";
import { Globe, Clock, HelpCircle } from "lucide-react";

const App = () => {
  const [activeTab, setActiveTab ] = useState("home"); // Set default to home to see dashboard

  const renderScreen = () => {
    switch (activeTab) {
      case "home":
        return <Dashboard setActiveTab={setActiveTab} />;
      case "pantry":
        return <Pantry />;
      case "scan":
        return <Scanner />;
      case "impact":
        return <Recipes />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="mx-auto min-h-screen bg-[#F8FAFC] flex flex-col lg:grid lg:grid-cols-[260px_1fr_320px] xl:grid-cols-[260px_1fr_350px] shadow-2xl overflow-hidden relative font-sans">
      
      {/* Left Sidebar (Desktop Only) */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Viewport */}
      <main className="flex-1 overflow-y-auto w-full h-screen relative scroll-smooth flex justify-center bg-white lg:bg-white pb-20 lg:pb-[52px]">
         <div className="w-full max-w-4xl lg:px-6">
           <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="w-full h-full"
              >
                {renderScreen()}
              </motion.div>
           </AnimatePresence>
         </div>
      </main>

      {/* Right Sidebar (Desktop Only) */}
      <div className="pb-[52px] h-screen overflow-hidden">
        <RightSidebar activeTab={activeTab} />
      </div>

      {/* Persistent Bottom Nav (Mobile Only) */}
      <div className="lg:hidden">
        {activeTab !== 'scan' && (
          <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
        )}
      </div>
      
      {/* Desktop Footer spanning main area and right sidebar */}
      <div className="hidden lg:flex fixed bottom-0 right-0 left-[260px] h-[52px] bg-white border-t border-[#E2E8F0] z-40 items-center justify-between px-8 text-[11px] font-bold text-[#64748B]">
         <div className="flex items-center gap-6">
            <span className="flex items-center gap-2"><Globe className="w-3.5 h-3.5" strokeWidth={2.5} /> Zimbabwe Dataset v2.4</span>
            <span className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" strokeWidth={2.5} /> Last synced: 2h ago</span>
         </div>
         <div className="flex items-center gap-5">
            <a href="#" className="hover:text-[#0F172A] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#0F172A] transition-colors">Sustainability Terms</a>
            <a href="#" className="flex items-center gap-1.5 text-[#107050] hover:text-[#065A3F] transition-colors"><HelpCircle className="w-3.5 h-3.5" strokeWidth={2.5} /> Help</a>
         </div>
      </div>

      {/* Hide scanner footer padding trick */}
      {activeTab === 'scan' && (
        <div className="fixed top-12 left-6 z-50 lg:hidden">
           <button 
             onClick={() => setActiveTab('home')}
             className="w-10 h-10 bg-black/40 backdrop-blur-lg rounded-full flex items-center justify-center text-white"
           >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
           </button>
        </div>
      )}
    </div>
  );
};

export default App;


