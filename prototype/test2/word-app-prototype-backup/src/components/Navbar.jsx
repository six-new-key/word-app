import React from 'react';
import { ChevronLeft } from 'lucide-react';

const Navbar = ({ title, leftIcon, rightIcons, onBack, className }) => {
  return (
    <div className={`w-full min-h-[100px] bg-background flex items-end pb-4 px-6 sticky top-0 z-40 ${className}`}>
      <div className="w-full flex items-center justify-between relative">
        {/* Left */}
        <div className="w-10 flex items-center justify-start">
          {leftIcon ? (
            leftIcon
          ) : onBack ? (
            <button onClick={onBack}>
              <ChevronLeft size={24} className="text-text-main" />
            </button>
          ) : null}
        </div>

        {/* Center Title */}
        <div className="absolute left-1/2 -translate-x-1/2 font-bold text-lg text-text-main">
          {title}
        </div>

        {/* Right */}
        <div className="flex items-center justify-end gap-3 min-w-10">
          {rightIcons}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
