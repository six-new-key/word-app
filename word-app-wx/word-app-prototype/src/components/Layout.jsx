import React, { useEffect, useState } from 'react';
import Tabbar from './Tabbar';
import { motion as Motion, AnimatePresence } from 'framer-motion';

const NIGHT_MODE_STORAGE_KEY = 'word-app-prototype.nightMode';
const NIGHT_MODE_EVENT = 'wordapp:nightmode';

const readNightMode = () => {
  try {
    return window.localStorage.getItem(NIGHT_MODE_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
};

const Layout = ({ children, activeTab, onTabChange, showTabbar, currentView }) => {
  const [nightMode, setNightMode] = useState(readNightMode);

  useEffect(() => {
    const onNightMode = (e) => setNightMode(Boolean(e?.detail));
    const onStorage = (e) => {
      if (e?.key === NIGHT_MODE_STORAGE_KEY) setNightMode(e?.newValue === '1');
    };
    window.addEventListener(NIGHT_MODE_EVENT, onNightMode);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(NIGHT_MODE_EVENT, onNightMode);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {/* iPhone 15 Frame Simulation */}
      <div className="relative w-[390px] h-[844px] bg-background shadow-2xl overflow-hidden sm:rounded-[40px] border-8 border-gray-900">
        
        {/* Dynamic Island Area (Top Safe Area) */}
        <div className="absolute top-0 left-0 right-0 h-[59px] z-50 pointer-events-none flex justify-center pt-2">
            <div className="w-[120px] h-[35px] bg-black rounded-full"></div>
        </div>
        
        {/* Content Area */}
        <div className="w-full h-full flex flex-col relative">
          <div className="flex-1 overflow-hidden relative">
            <AnimatePresence mode="wait">
              <Motion.div
                key={currentView || activeTab || 'page'} // Use currentView as key for transitions to ensure unique key for every page
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full"
              >
                {children}
              </Motion.div>
            </AnimatePresence>
            {nightMode && <div className="absolute inset-0 z-40 pointer-events-none bg-black/35 mix-blend-multiply" />}
          </div>
          
          {/* Bottom Tabbar Overlay */}
          {showTabbar && (
             <Tabbar activeTab={activeTab} onTabChange={onTabChange} />
          )}
        </div>
        
      </div>
    </div>
  );
};

export default Layout;
