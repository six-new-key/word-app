import React from 'react';
import { Home, GraduationCap, Library, User } from 'lucide-react';
import { motion as Motion } from 'framer-motion';
import clsx from 'clsx';

const Tabbar = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home', label: '首页', icon: Home },
    { id: 'learning', label: '学习', icon: GraduationCap },
    { id: 'vocabulary', label: '词库', icon: Library },
    { id: 'mine', label: '我的', icon: User },
  ];

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[350px] z-50">
      <div className="relative rounded-[32px] px-4 py-3 flex items-center justify-between bg-[rgba(255,255,255,0.85)] backdrop-blur-xl backdrop-saturate-150 border border-white/50 shadow-[0_14px_34px_rgba(0,0,0,0.14)]">
        <div className="absolute inset-0 rounded-[32px] bg-gradient-to-b from-white/80 via-white/40 to-white/20 pointer-events-none" />
        {/* Gradient overlay removed to ensure consistent white style across all pages */}
        <div className="absolute inset-0 rounded-[32px] opacity-[0.10] mix-blend-overlay pointer-events-none bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.55)_0,rgba(255,255,255,0)_1px)] [background-size:6px_6px]" />
        <div className="absolute inset-0 rounded-[32px] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-1px_0_rgba(0,0,0,0.07)] pointer-events-none" />
        <div className="absolute -bottom-2 left-8 right-8 h-6 bg-black/5 blur-xl rounded-full pointer-events-none" />
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-col items-center justify-center w-[70px] h-[56px]"
            >
              {isActive && (
                <Motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-2xl bg-white/45 border border-white/60 shadow-[0_12px_28px_rgba(0,0,0,0.12)]"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              
              <div className="relative z-10 flex flex-col items-center">
                <Motion.div
                    animate={isActive ? { y: 0, scale: 1.05 } : { y: -2, scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                    <Icon
                    size={isActive ? 26 : 22}
                    strokeWidth={isActive ? 2.5 : 2}
                    className={clsx(
                        'transition-colors duration-300',
                        isActive ? 'text-primary' : 'text-gray-600'
                    )}
                    />
                </Motion.div>
                
                <Motion.span
                    initial={false}
                    animate={isActive ? { opacity: 0, y: 6, height: 0 } : { opacity: 1, y: 0, height: 'auto' }}
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    className="mt-1 text-[10px] font-bold tracking-wide text-gray-700 leading-none overflow-hidden"
                >
                    {tab.label}
                </Motion.span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Tabbar;
