import React from 'react';
import { motion as Motion } from 'framer-motion';
import { ArrowLeft, BookOpen, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const Mistakes = ({ onBack }) => {
  const mistakes = [
    { word: 'epiphany', mean: '顿悟；突然的灵感', count: 3 },
    { word: 'serendipity', mean: '意外发现珍奇事物的本领', count: 2 },
    { word: 'ethereal', mean: '超凡脱俗的；飘渺的', count: 2 },
    { word: 'mellifluous', mean: '声音甜美的；悦耳的', count: 1 },
    { word: 'ineffable', mean: '不可言喻的', count: 1 },
  ];

  return (
    <div className="h-full bg-background flex flex-col relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-red-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="px-6 pt-12 pb-4 flex items-center justify-between z-10">
        <Motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center text-text-main"
        >
          <ArrowLeft size={20} />
        </Motion.button>
        <h1 className="text-xl font-bold text-text-main">错题本</h1>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-8 space-y-4 z-10 no-scrollbar">
        {/* Stats */}
        <div className="flex gap-4 mb-6">
            <div className="flex-1 bg-gradient-to-br from-red-500 to-red-600 rounded-[24px] p-5 text-white shadow-lg shadow-red-500/20 relative overflow-hidden">
                <div className="relative z-10">
                    <div className="text-white/80 text-xs font-medium mb-1">待复习</div>
                    <div className="text-3xl font-bold">12</div>
                </div>
                <div className="absolute right-0 bottom-0 opacity-20 transform translate-x-2 translate-y-2">
                    <AlertCircle size={60} />
                </div>
            </div>
            <div className="flex-1 bg-white rounded-[24px] p-5 shadow-soft border border-white/50 relative overflow-hidden">
                <div className="relative z-10">
                    <div className="text-text-sub text-xs font-medium mb-1">已掌握</div>
                    <div className="text-3xl font-bold text-green-500">45</div>
                </div>
                <div className="absolute right-0 bottom-0 text-green-500 opacity-10 transform translate-x-2 translate-y-2">
                    <CheckCircle size={60} />
                </div>
            </div>
        </div>

        {/* List */}
        <div className="space-y-3">
            {mistakes.map((item, idx) => (
                <Motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-[20px] p-4 shadow-soft border border-gray-100 flex items-center justify-between group"
                >
                    <div>
                        <h3 className="text-lg font-bold text-text-main mb-1">{item.word}</h3>
                        <p className="text-xs text-text-sub">{item.mean}</p>
                    </div>
                    <div className="flex items-center gap-3">
                         <div className="px-2 py-1 bg-red-50 text-red-500 text-[10px] font-bold rounded-lg">
                            错 {item.count} 次
                         </div>
                         <button className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-green-50 hover:text-green-500 transition-colors">
                            <CheckCircle size={18} />
                         </button>
                    </div>
                </Motion.div>
            ))}
        </div>
      </div>
      
      {/* Bottom Action */}
      <div className="px-6 pb-8 pt-4 bg-gradient-to-t from-background via-background/90 to-transparent sticky bottom-0 z-20">
        <Motion.button
            whileTap={{ scale: 0.95 }}
            className="w-full h-14 bg-text-main text-white rounded-[24px] font-bold text-lg shadow-lg flex items-center justify-center gap-2"
        >
            <BookOpen size={20} />
            开始复习
        </Motion.button>
      </div>
    </div>
  );
};

export default Mistakes;
