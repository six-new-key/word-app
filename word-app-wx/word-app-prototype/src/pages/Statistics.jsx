import React from 'react';
import Navbar from '../components/Navbar';
import { ArrowLeft, Filter, TrendingUp, Clock, Target, CheckCircle } from 'lucide-react';
import { motion as Motion } from 'framer-motion';

const Statistics = ({ onBack }) => {
  return (
    <div className="flex flex-col h-full bg-background relative">
       {/* Background Decor */}
       <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

      <Navbar
        title="学习统计"
        onBack={onBack}
        className="!bg-transparent"
        rightIcons={
            <div className="w-9 h-9 rounded-full bg-white/50 backdrop-blur-sm border border-white/60 shadow-sm flex items-center justify-center cursor-pointer hover:bg-white transition-colors">
                <Filter size={18} className="text-text-main"/>
            </div>
        }
      />

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-2 pb-8 space-y-8 z-10">
        
        {/* Core Data Cards Grid */}
        <section>
            <div className="flex items-center gap-2 mb-3 px-1">
                <div className="w-1 h-3 rounded-full bg-primary/40"></div>
                <div className="text-xs font-black text-text-muted uppercase tracking-widest">数据概览</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
               <DataCard label="累计词汇" value="2,450" icon={Target} color="text-primary" bg="bg-primary/5" delay={0} />
               <DataCard label="已掌握" value="1,204" icon={CheckCircle} color="text-secondary-green" bg="bg-secondary-green/5" delay={0.1} />
               <DataCard label="学习时长" value="45h" icon={Clock} color="text-accent" bg="bg-accent/5" delay={0.2} />
               <DataCard label="正确率" value="92%" icon={TrendingUp} color="text-secondary-purple" bg="bg-secondary-purple/5" delay={0.3} />
            </div>
        </section>

        {/* Charts Section */}
        <section>
            <div className="flex items-center gap-2 mb-3 px-1">
                <div className="w-1 h-3 rounded-full bg-secondary-purple/40"></div>
                <div className="text-xs font-black text-text-muted uppercase tracking-widest">学习分布</div>
            </div>
            <Motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-[28px] shadow-soft p-6 flex flex-col border border-white/60"
            >
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary"></span>
                        <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">本周趋势</h3>
                    </div>
                    <select className="bg-gray-50 text-[10px] font-bold text-text-muted border border-gray-100 rounded-lg px-2 py-1 outline-none">
                        <option>近7天</option>
                        <option>近30天</option>
                    </select>
                </div>
                
                <div className="h-[180px] flex items-end justify-between gap-3 px-2">
                     {[30, 50, 45, 80, 60, 90, 75].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col justify-end group cursor-pointer h-full">
                            <Motion.div 
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                transition={{ duration: 1, delay: i * 0.1 }}
                                className={`w-full rounded-[6px] relative transition-all duration-300 group-hover:scale-y-105 origin-bottom ${i === 6 ? 'bg-gradient-to-t from-primary to-primary-light shadow-[0_4px_12px_rgba(46,134,171,0.3)]' : 'bg-gray-100 group-hover:bg-gray-200'}`}
                            >
                                {/* Tooltip on Hover (Simulated) */}
                                <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-text-main text-white text-[10px] font-bold px-2 py-1 rounded-lg transition-all shadow-lg whitespace-nowrap z-10 pointer-events-none mb-2">
                                    {h} 分钟
                                    <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-text-main rotate-45"></div>
                                </div>
                            </Motion.div>
                        </div>
                     ))}
                </div>
                <div className="flex justify-between text-[10px] text-text-muted mt-4 font-bold uppercase tracking-wider">
                     <span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span><span>日</span>
                </div>
            </Motion.div>
        </section>

        <section>
            <div className="flex items-center gap-2 mb-3 px-1">
                <div className="w-1 h-3 rounded-full bg-accent/40"></div>
                <div className="text-xs font-black text-text-muted uppercase tracking-widest">掌握程度</div>
            </div>
            <Motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-[28px] shadow-soft p-6 flex flex-col border border-white/60"
            >
                <div className="flex items-center justify-center gap-8 py-2">
                    {/* Ring Chart */}
                    <div className="relative w-36 h-36 flex items-center justify-center">
                        <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 36 36">
                            <path className="text-gray-50" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                            <Motion.path 
                                initial={{ strokeDasharray: "0, 100" }}
                                animate={{ strokeDasharray: "45, 100" }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="text-secondary-green" 
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="3" 
                                strokeLinecap="round" 
                            />
                            <Motion.path 
                                initial={{ strokeDasharray: "0, 100" }}
                                animate={{ strokeDasharray: "25, 100" }}
                                transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                                className="text-primary" 
                                strokeDashoffset="-48"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="3" 
                                strokeLinecap="round" 
                            />
                             <Motion.path 
                                initial={{ strokeDasharray: "0, 100" }}
                                animate={{ strokeDasharray: "15, 100" }}
                                transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
                                className="text-accent" 
                                strokeDashoffset="-76"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="3" 
                                strokeLinecap="round" 
                            />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                             <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider mb-1">已掌握</span>
                             <span className="text-3xl font-black text-text-main">45%</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Legend color="bg-secondary-green" label="已掌握" value="45%" />
                        <Legend color="bg-primary" label="复习中" value="25%" />
                        <Legend color="bg-accent" label="学习中" value="15%" />
                        <Legend color="bg-gray-200" label="新词" value="15%" />
                    </div>
                </div>
            </Motion.div>
        </section>

        {/* AI Insight */}
        <Motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-[24px] p-6 relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
            
            <div className="flex items-center gap-2 mb-3 relative z-10">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-black shadow-md shadow-primary/30">AI</div>
                <h3 className="text-sm font-bold text-primary uppercase tracking-wide">学习建议</h3>
            </div>
            <p className="text-xs text-text-sub leading-relaxed font-medium relative z-10">
               基于您的艾宾浩斯遗忘曲线，建议今天重点关注 <span className="text-accent font-black">四级核心词汇</span> 中的薄弱单词（30个）。您的拼写正确率正在稳步提升！
            </p>
        </Motion.div>
      </div>
    </div>
  );
};

const DataCard = ({ label, value, icon, color, bg, delay }) => (
    <Motion.div 
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay }}
        whileTap={{ scale: 0.98 }}
        className="bg-white rounded-[24px] p-5 shadow-soft border border-white/60 flex flex-col items-center justify-center gap-3 cursor-pointer group hover:shadow-soft-hover transition-all"
    >
        <div className={`w-12 h-12 rounded-[18px] ${bg} flex items-center justify-center ${color} group-hover:scale-110 transition-transform duration-300`}>
            {React.createElement(icon, { size: 24, strokeWidth: 2.5 })}
        </div>
        <div className="text-center">
            <div className={`text-2xl font-black ${color} tracking-tight`}>{value}</div>
            <div className="text-[10px] text-text-muted font-bold uppercase tracking-wide mt-1">{label}</div>
        </div>
    </Motion.div>
);

const Legend = ({ color, label, value }) => (
    <div className="flex items-center gap-3">
        <div className={`w-2.5 h-2.5 rounded-full ${color} shadow-sm`}></div>
        <div className="flex flex-col">
            <span className="text-[11px] text-text-sub font-bold">{label}</span>
            <span className="text-[10px] text-text-muted font-medium">{value}</span>
        </div>
    </div>
);

export default Statistics;
