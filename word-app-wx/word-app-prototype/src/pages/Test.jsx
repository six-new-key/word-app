import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { ArrowLeft, CheckCircle, XCircle, Volume2 } from 'lucide-react';
import clsx from 'clsx';
import { motion as Motion, AnimatePresence } from 'framer-motion';

const Test = ({ onBack }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const options = ['abandon', 'ability', 'abnormal', 'aboard'];

  return (
    <div className="flex flex-col h-full bg-background relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-[200px] bg-gradient-to-b from-primary/5 to-transparent z-0"></div>
        <div className="absolute top-20 right-[-50px] w-40 h-40 bg-secondary-purple/10 rounded-full blur-3xl"></div>

      <Navbar
        title="拼写测试"
        onBack={onBack}
        className="!bg-transparent"
        rightIcons={
          <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/50">
             <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
               <Motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: '30%' }}
                 transition={{ duration: 1 }}
                 className="h-full bg-primary rounded-full"
               ></Motion.div>
             </div>
             <span className="text-xs text-primary font-bold">3/10</span>
          </div>
        }
      />

      <div className="flex-1 flex flex-col px-6 pt-4 pb-8 z-10">
        {/* Question Area */}
        <div className="flex-1 flex flex-col items-center justify-center mb-8 relative">
           <Motion.div
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="w-full bg-white rounded-[32px] shadow-soft p-8 flex flex-col items-center justify-center min-h-[200px] border border-white/50 relative overflow-hidden"
           >
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary-purple"></div>
               
               <button className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4 hover:scale-110 transition-transform">
                    <Volume2 size={24} />
               </button>

               <h2 className="text-2xl text-text-main font-bold text-center mb-2 tracking-tight">
                 v. 遗弃；放弃；中止
               </h2>
               <div className="text-text-muted text-sm font-medium bg-gray-50 px-3 py-1 rounded-full">
                   请选择对应的英文单词
               </div>
           </Motion.div>
        </div>

        {/* Options */}
        <div className="space-y-4 mb-8">
           {options.map((opt, idx) => (
             <Motion.button
               key={idx}
               initial={{ x: -20, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               transition={{ delay: idx * 0.1 }}
               whileTap={{ scale: 0.98 }}
               onClick={() => setSelectedOption(idx)}
               className={clsx(
                 "w-full py-4 px-6 rounded-[20px] text-lg font-bold transition-all text-left flex items-center justify-between border-2 shadow-sm",
                 selectedOption === idx 
                   ? "bg-primary/5 border-primary text-primary shadow-md" 
                   : "bg-white border-transparent text-text-main hover:border-gray-100 hover:shadow-soft"
               )}
             >
                <span className="tracking-wide">{opt}</span>
                {selectedOption === idx ? (
                    <CheckCircle size={20} className="fill-primary text-white" />
                ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-200"></div>
                )}
             </Motion.button>
           ))}
        </div>

        {/* Bottom Actions */}
        <div className="flex gap-4">
           <Motion.button 
             whileTap={{ scale: 0.95 }}
             className="flex-1 py-4 rounded-[20px] border-2 border-gray-100 text-text-sub font-bold hover:bg-gray-50 transition-colors"
           >
             跳过
           </Motion.button>
           <Motion.button 
             whileTap={{ scale: 0.95 }}
             className="flex-[2] py-4 rounded-[20px] bg-gradient-to-r from-primary to-primary-light text-white font-bold shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
           >
             确认提交
           </Motion.button>
        </div>
      </div>
    </div>
  );
};

export default Test;
