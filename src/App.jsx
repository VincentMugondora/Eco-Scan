import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Dashboard } from "./components/screens/Dashboard";
import { Pantry } from "./components/screens/Pantry";
import { Scanner } from "./components/screens/Scanner";
import { Recipes } from "./components/screens/Recipes";
import { BottomNav } from "./components/layout/BottomNav";
import { Sidebar } from "./components/layout/Sidebar";
import { RightSidebar } from "./components/layout/RightSidebar";

const App = () => {
  const [activeTab, setActiveTab ] = useState("home");

  const renderScreen = () => {
    switch (activeTab) {
      case "home":
        return <Dashboard />;
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
      <main className="flex-1 overflow-y-auto w-full h-screen relative scroll-smooth flex justify-center bg-[#F8FAFC] pb-20 lg:pb-0">
         <div className="w-full max-w-4xl lg:px-10">
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
      <RightSidebar />

      {/* Persistent Bottom Nav (Mobile Only) */}
      <div className="lg:hidden">
        {activeTab !== 'scan' && (
          <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
        )}
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


