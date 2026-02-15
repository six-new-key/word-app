import React from 'react';
import Navbar from '../components/Navbar';
import { Search, Import, Book, ChevronRight, Sparkles, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const Motion = motion;

const Vocabulary = ({ navigateTo, setSelectedBook }) => {
  const [activeCategory, setActiveCategory] = React.useState(0);
  const categories = ['推荐词库', '自定义', '按目标', '按场景', '记忆状态', '四级', '六级', '考研', '雅思', '托福', 'GRE'];

  const allBooks = [
    { id: 'cet4', title: "CET-4 核心词汇", count: "2450", tag: "必考", tagColor: "bg-accent", iconColor: "text-accent", progress: 45, category: '推荐词库' },
    { id: 'toefl', title: "TOEFL 高频词汇", count: "3100", tag: "进阶", tagColor: "bg-secondary-purple", iconColor: "text-secondary-purple", progress: 12, category: '按目标' },
    { id: 'ielts', title: "雅思阅读 8000 词", count: "8000", tag: "挑战", tagColor: "bg-secondary-green", iconColor: "text-secondary-green", progress: 0, category: '按目标' },
    { id: 'bec', title: "商务英语 BEC", count: "1500", tag: "职场", tagColor: "bg-primary", iconColor: "text-primary", progress: 78, category: '按场景' },
  ];

  const filteredBooks = allBooks.filter(book => {
      const currentCat = categories[activeCategory];
      if (currentCat === '记忆状态') return book.progress > 0;
      return book.category === currentCat;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="flex flex-col h-full bg-background relative overflow-hidden">
        {/* Background Decorative Gradient */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-bl from-secondary-purple/10 to-transparent pointer-events-none z-0 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-gradient-to-tr from-primary/10 to-transparent pointer-events-none z-0 rounded-full blur-3xl"></div>

      <Navbar
        title="词库"
        leftIcon={null}
        rightIcons={
            <div className="flex items-center gap-2 w-full pl-4 pr-2">
                <div className="flex-1 h-9 bg-white/50 backdrop-blur-md border border-white/60 shadow-sm rounded-full flex items-center px-4 gap-2 transition-all focus-within:bg-white focus-within:shadow-md focus-within:ring-2 focus-within:ring-primary/20">
                    <Search size={16} className="text-text-muted"/>
                    <input 
                        type="text" 
                        placeholder="搜索单词/词库" 
                        className="bg-transparent border-none outline-none text-xs text-text-main w-full placeholder:text-text-muted"
                    />
                </div>
                <motion.button 
                    whileTap={{ scale: 0.9 }}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-100 text-primary"
                    onClick={() => navigateTo && navigateTo('vocab-import')}
                >
                    <Import size={18}/>
                </motion.button>
            </div>
        }
        className="!justify-start z-20 !bg-transparent" 
      />

      <div className="flex-1 overflow-y-auto no-scrollbar pb-32 z-10">
        
        {/* 1. Featured / Current Learning Section (Hierarchy Booster) */}
        <div className="px-5 mt-2 mb-6">
            <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-3 rounded-full bg-primary/40"></div>
                <div className="text-xs font-black text-text-muted uppercase tracking-widest">正在学习</div>
            </div>
            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="w-full bg-gradient-to-br from-primary to-primary-dark rounded-[32px] shadow-lg shadow-primary/20 p-6 relative overflow-hidden text-white cursor-pointer group"
                onClick={() => {
                     if (setSelectedBook) setSelectedBook(allBooks[0]);
                     if (navigateTo) navigateTo('learning');
                }}
            >
                {/* Decor */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>
                
                <div className="flex justify-between items-start relative z-10">
                    <div>
                        <span className="px-2 py-0.5 rounded-lg bg-white/20 backdrop-blur-md border border-white/10 text-[10px] font-bold mb-2 inline-block">
                            当前进度 45%
                        </span>
                        <h2 className="text-2xl font-black tracking-tight mb-1">CET-4 核心词汇</h2>
                        <p className="text-white/70 text-xs font-medium">剩余 1350 词 · 预计 15 天完成</p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl border border-white/10 shadow-inner">
                        📖
                    </div>
                </div>

                <div className="mt-6">
                     <button className="w-full py-3 bg-white text-primary rounded-xl font-black text-sm shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 group-hover:scale-[1.02] active:scale-95 duration-200">
                        继续学习 <ChevronRight size={16} />
                     </button>
                </div>
            </motion.div>
        </div>

        {/* 2. Categories Sticky Header */}
        <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-md pb-2 pt-2">
             <div className="px-5 mb-2">
                <div className="flex items-center gap-2">
                    <div className="w-1 h-3 rounded-full bg-secondary-purple/40"></div>
                    <div className="text-xs font-black text-text-muted uppercase tracking-widest">发现词库</div>
                </div>
             </div>
             <div className="flex overflow-x-auto no-scrollbar gap-2 px-5 pb-2">
                {categories.map((cat, i) => (
                    <motion.button 
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => setActiveCategory(i)}
                        className={`whitespace-nowrap shrink-0 px-4 py-2 rounded-full border text-xs font-bold transition-all ${
                            activeCategory === i
                            ? 'bg-text-main text-white border-text-main shadow-md transform scale-105' 
                            : 'bg-white border-gray-200 text-text-sub hover:bg-gray-50'
                        }`}
                    >
                        {cat}
                    </motion.button>
                ))}
             </div>
        </div>

        {/* 3. Book Grid List */}
        <motion.div 
            className="px-5 grid grid-cols-2 gap-4 mt-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            key={activeCategory}
        >
           {/* Custom Book Create Card */}
           {(categories[activeCategory] === '自定义' || categories[activeCategory] === '推荐词库') && (
               <motion.div 
                 variants={itemVariants}
                 className="aspect-[4/5] rounded-[24px] bg-white border-2 border-dashed border-gray-200 hover:border-primary/50 cursor-pointer group flex flex-col items-center justify-center gap-3 transition-all hover:bg-primary/5"
                 onClick={() => {
                     if (setSelectedBook) setSelectedBook({ title: '新词库', isNew: true });
                     if (navigateTo) navigateTo('vocab-edit');
                 }}
               >
                    <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-primary/20 flex items-center justify-center text-gray-400 group-hover:text-primary transition-colors">
                        <Plus size={24} />
                    </div>
                    <span className="text-xs font-bold text-text-muted group-hover:text-primary transition-colors">创建词库</span>
               </motion.div>
           )}

           {filteredBooks.map((book) => (
               <BookCard 
                 key={book.id}
                 {...book}
                 variants={itemVariants}
                 onClick={() => {
                     if (setSelectedBook) setSelectedBook(book);
                     if (navigateTo) navigateTo('vocab-edit');
                 }}
               />
           ))}
        </motion.div>
           
        {filteredBooks.length === 0 && categories[activeCategory] !== '自定义' && (
            <div className="text-center py-10 text-text-muted text-sm col-span-2">
                暂无相关词库
            </div>
        )}
      </div>
    </div>
  );
};

const BookCard = ({ title, count, tag, tagColor, iconColor, progress, onClick, variants }) => (
  <motion.div 
    variants={variants}
    whileHover={{ y: -5 }}
    whileTap={{ scale: 0.98 }}
    className="aspect-[4/5] bg-white rounded-[24px] shadow-sm p-4 cursor-pointer relative overflow-hidden group border border-gray-100 flex flex-col justify-between"
    onClick={onClick}
  >
    <div className="flex justify-between items-start">
        <div className={`w-10 h-10 rounded-xl ${iconColor.replace('text-', 'bg-')}/10 flex items-center justify-center ${iconColor}`}>
            <Book size={20}/>
        </div>
        <span className={`px-2 py-1 rounded-md text-[9px] font-bold text-white ${tagColor}`}>{tag}</span>
    </div>
    
    <div>
        <h3 className="text-text-main font-bold text-sm mb-1 leading-tight line-clamp-2">{title}</h3>
        <div className="text-[10px] text-text-muted flex items-center gap-1">
            <Sparkles size={10} />
            <span>{count} 词</span>
        </div>
    </div>
    
    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mt-2">
        <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className={`h-full rounded-full ${tagColor}`}
        ></motion.div>
    </div>

    {/* Hover Effect */}
    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
  </motion.div>
);

export default Vocabulary;
