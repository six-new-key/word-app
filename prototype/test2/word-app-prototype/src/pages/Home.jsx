import React from 'react';
import Navbar from '../components/Navbar';
import { Settings, Moon, RefreshCw, Brain, MessageCircle, XCircle, TrendingUp, ChevronRight } from 'lucide-react';
import { motion as Motion } from 'framer-motion';

const Home = ({ navigateTo }) => {
  return (
    <div className="flex flex-col h-full bg-background relative">
        {/* Background Decorative Gradient */}
        <div className="absolute top-0 left-0 w-full h-[350px] bg-gradient-to-b from-primary/15 to-transparent pointer-events-none z-0"></div>

      <Navbar
        title=""
        leftIcon={
          <div className="ml-2 flex flex-col justify-center whitespace-nowrap min-w-max">
            <span className="text-primary font-black text-2xl tracking-tight leading-none">你好，同学</span>
            <span className="text-text-muted text-[10px] font-bold uppercase tracking-widest mt-1">今天也要加油哦！</span>
          </div>
        }
        rightIcons={
          <div className="flex gap-3">
            <button className="w-10 h-10 rounded-full bg-white/50 backdrop-blur-sm border border-white/60 flex items-center justify-center hover:bg-white transition-colors shadow-sm">
                <Moon size={20} className="text-text-main" />
            </button>
            <button className="w-10 h-10 rounded-full bg-white/50 backdrop-blur-sm border border-white/60 flex items-center justify-center hover:bg-white transition-colors shadow-sm" onClick={() => navigateTo && navigateTo('settings')}>
                <Settings size={20} className="text-text-main" />
            </button>
          </div>
        }
        className="z-10 !bg-transparent pt-2" // Transparent navbar
      />
      
      <div className="px-5 pt-4 pb-24 space-y-8 overflow-y-auto no-scrollbar z-10 flex-1">
        
        {/* AI Learning Card (Redesigned) */}
        <section>
            <div className="flex items-center gap-2 mb-3 px-1">
                <div className="w-1 h-3 rounded-full bg-primary/40"></div>
                <div className="text-xs font-black text-text-muted uppercase tracking-widest">今日目标</div>
            </div>
            <Motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              whileTap={{ scale: 0.98 }}
              className="w-full min-h-[220px] bg-gradient-to-br from-primary via-[#3da9d4] to-secondary-purple rounded-[32px] shadow-[0_20px_40px_-12px_rgba(46,134,171,0.5)] p-6 flex flex-col justify-between relative overflow-hidden group cursor-pointer"
              onClick={() => navigateTo && navigateTo('learning')}
            >
                {/* Dynamic Background Elements */}
                <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-white/10 rounded-full blur-[60px] -mr-10 -mt-10 pointer-events-none mix-blend-overlay"></div>
                <div className="absolute bottom-0 left-0 w-[180px] h-[180px] bg-accent/20 rounded-full blur-[50px] -ml-10 -mb-10 pointer-events-none mix-blend-overlay"></div>
                
                {/* 3D Glass Card Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>

                <div className="flex justify-between items-start z-10 relative">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-bold border border-white/20 shadow-sm flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
                                每日计划
                            </span>
                        </div>
                        <h3 className="text-4xl font-black text-white tracking-tight leading-[1.1] drop-shadow-sm">
                            开启<br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/80">学习之旅</span>
                        </h3>
                    </div>
                    
                    {/* 3D Floating Element Placeholder */}
                    <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-[24px] border border-white/30 shadow-xl flex items-center justify-center text-4xl animate-float group-hover:scale-110 transition-transform duration-500 relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-[24px] pointer-events-none"></div>
                        🚀
                    </div>
                </div>

                <div className="z-10 mt-6 relative">
                    <div className="flex justify-between text-xs mb-2 font-bold tracking-wide text-white/90">
                        <span className="flex items-center gap-1.5">
                            <TrendingUp size={14} className="text-accent" />
                            当前进度
                        </span>
                        <span className="font-black text-lg">65<span className="text-xs font-bold opacity-60">%</span></span>
                    </div>
                    
                    {/* Custom Progress Bar */}
                    <div className="w-full bg-black/20 h-4 rounded-full overflow-hidden p-[3px] backdrop-blur-sm shadow-inner border border-white/10">
                        <Motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '65%' }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="bg-gradient-to-r from-accent to-orange-400 h-full rounded-full shadow-lg relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/30 animate-[shimmer_1.5s_infinite]"></div>
                        </Motion.div>
                    </div>
                    
                    <div className="mt-5 flex gap-4">
                        <div className="flex-1 bg-white/10 backdrop-blur-md rounded-xl p-2.5 border border-white/10 flex items-center gap-3">
                             <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-lg shadow-sm">🌱</div>
                             <div className="flex flex-col text-white">
                                 <span className="text-[10px] opacity-70 font-bold uppercase">新词</span>
                                 <span className="text-sm font-black leading-none">20</span>
                             </div>
                        </div>
                        <div className="flex-1 bg-white/10 backdrop-blur-md rounded-xl p-2.5 border border-white/10 flex items-center gap-3">
                             <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-lg shadow-sm">🔄</div>
                             <div className="flex flex-col text-white">
                                 <span className="text-[10px] opacity-70 font-bold uppercase">复习</span>
                                 <span className="text-sm font-black leading-none">30</span>
                             </div>
                        </div>
                    </div>
                </div>
            </Motion.div>
        </section>
        
        {/* Shortcuts Grid (Redesigned) */}
        <section>
            <div className="flex items-center gap-2 mb-3 px-1">
                <div className="w-1 h-3 rounded-full bg-secondary-purple/40"></div>
                <div className="text-xs font-black text-text-muted uppercase tracking-widest">快捷入口</div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <ShortcutCard icon={RefreshCw} label="每日" sub="复习" onClick={() => navigateTo && navigateTo('learning')} color="text-primary" bg="bg-primary/5" delay={0.1} />
              <ShortcutCard icon={Brain} label="记忆" sub="测试" onClick={() => navigateTo && navigateTo('test')} color="text-secondary-purple" bg="bg-secondary-purple/5" delay={0.2} />
              <ShortcutCard icon={MessageCircle} label="AI" sub="助手" onClick={() => navigateTo && navigateTo('ai-chat')} color="text-accent" bg="bg-accent/5" delay={0.3} />
              <ShortcutCard icon={XCircle} label="错题" sub="本" onClick={() => navigateTo && navigateTo('mistakes')} color="text-red-500" bg="bg-red-50" delay={0.4} />
            </div>
        </section>
        
        {/* Progress Preview (Redesigned) */}
        <section>
             <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                    <div className="w-1 h-3 rounded-full bg-accent/40"></div>
                    <div className="text-xs font-black text-text-muted uppercase tracking-widest">本周趋势</div>
                </div>
                <div className="text-[10px] font-bold text-primary flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full cursor-pointer" onClick={() => navigateTo && navigateTo('statistics')}>
                    完整报告 <ChevronRight size={10}/>
                </div>
             </div>
             
            <div 
               className="w-full bg-white rounded-[28px] shadow-soft p-6 cursor-pointer border border-white/60 relative overflow-hidden"
               onClick={() => navigateTo && navigateTo('statistics')}
            >
              {/* Background Graph Decor */}
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent opacity-50 pointer-events-none"></div>

              {/* Enhanced Chart */}
              <div className="flex items-end justify-between gap-3 h-[120px] relative z-10">
                {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col justify-end group h-full">
                     <Motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ duration: 0.6, delay: i * 0.08 }}
                        className={`w-full rounded-[6px] transition-all duration-300 group-hover:scale-y-105 origin-bottom ${i === 5 ? 'bg-gradient-to-t from-primary to-primary-light shadow-[0_4px_12px_rgba(46,134,171,0.3)]' : 'bg-gray-100 group-hover:bg-gray-200'}`}
                     ></Motion.div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-text-muted mt-4 font-bold uppercase tracking-wider relative z-10">
                 <span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span><span>日</span>
              </div>
            </div>
        </section>
      </div>
    </div>
  );
};

const ShortcutCard = ({ icon, label, sub, onClick, color, bg, delay }) => (
  <Motion.div 
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay }}
    whileTap={{ scale: 0.9 }}
    className="flex flex-col items-center gap-2 cursor-pointer group"
    onClick={onClick}
  >
    <div className={`w-[68px] h-[68px] rounded-[24px] shadow-sm flex items-center justify-center ${color} ${bg} border border-white/50 group-hover:shadow-md transition-all duration-300 group-hover:-translate-y-1`}>
        {React.createElement(icon, { size: 28, strokeWidth: 2.5 })}
    </div>
    <div className="flex flex-col items-center leading-none gap-0.5">
        <span className="text-text-main text-[11px] font-bold">{label}</span>
        {sub && <span className="text-text-muted text-[9px] font-bold">{sub}</span>}
    </div>
  </Motion.div>
);

export default Home;
