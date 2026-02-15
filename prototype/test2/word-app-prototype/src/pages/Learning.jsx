import React, { useReducer, useRef } from 'react';
import Navbar from '../components/Navbar';
import { Volume2, Bookmark, Check, X, RotateCcw, Settings2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';

const MotionDiv = motion.div;
const MotionButton = motion.button;

const initialCards = [
  {
    id: 1,
    word: 'epiphany',
    phonetic: '/ɪˈpɪf.ən.i/',
    type: 'n.',
    mean: '顿悟；突然的灵感',
    en: 'A moment of sudden revelation or insight.',
    roots: 'epi (在...上) + phan (出现) → 显现',
    sentences: ['He had an epiphany about his career direction.', 'The idea came to her in a sudden epiphany.'],
    synonyms: ['revelation', 'insight', 'realization']
  },
  {
    id: 2,
    word: 'serendipity',
    phonetic: '/ˌser.ənˈdɪp.ə.ti/',
    type: 'n.',
    mean: '意外发现珍宝的运气',
    en: 'The occurrence of events by chance in a happy way.',
    roots: 'coined by Horace Walpole (1754)',
    sentences: ['It was pure serendipity that we met.', 'Nature has created wonderful serendipity.'],
    synonyms: ['chance', 'luck', 'fortune']
  },
  {
    id: 3,
    word: 'petrichor',
    phonetic: '/ˈpet.rɪ.kɔːr/',
    type: 'n.',
    mean: '雨后泥土的芬芳',
    en: 'A pleasant smell that frequently accompanies the first rain.',
    roots: 'petra (石) + ichor (神血)',
    sentences: ['I love the smell of petrichor in the morning.', 'The air was filled with petrichor.'],
    synonyms: ['earthy smell', 'rain smell']
  },
  {
    id: 4,
    word: 'limerence',
    phonetic: '/ˈlɪm.ər.əns/',
    type: 'n.',
    mean: '迷恋',
    en: 'The state of being infatuated or obsessed with another person.',
    roots: 'arbitrary coinage by Dorothy Tennov',
    sentences: ['His feelings for her were more than just limerence.', 'Limerence can be an overwhelming emotion.'],
    synonyms: ['infatuation', 'crush', 'passion']
  },
  {
    id: 5,
    word: 'sonder',
    phonetic: '/ˈsɒn.də/',
    type: 'n.',
    mean: '过客感',
    en: 'The realization that each random passerby is living a life as vivid as your own.',
    roots: 'from Dictionary of Obscure Sorrows',
    sentences: ['Standing in the crowd, he felt a deep sense of sonder.', 'Sonder reminds us of our shared humanity.'],
    synonyms: ['realization', 'awareness']
  }
];

const initialState = {
  cards: initialCards,
  history: [],
  bookmarks: new Set(),
  exitDirection: 'right'
};

function reducer(state, action) {
  switch (action.type) {
    case 'REMOVE_CARD': {
      const { id, dir } = action;
      const cardIndex = state.cards.findIndex((c) => c.id === id);
      if (cardIndex === -1) {
        return { ...state, exitDirection: dir };
      }
      const cardToRemove = state.cards[cardIndex];
      return {
        ...state,
        exitDirection: dir,
        cards: state.cards.filter((c) => c.id !== id),
        history: [...state.history, cardToRemove]
      };
    }
    case 'UNDO': {
      if (state.history.length === 0) return state;
      const lastCard = state.history[state.history.length - 1];
      return {
        ...state,
        history: state.history.slice(0, -1),
        cards: [lastCard, ...state.cards]
      };
    }
    case 'TOGGLE_BOOKMARK': {
      const bookmarks = new Set(state.bookmarks);
      if (bookmarks.has(action.id)) {
        bookmarks.delete(action.id);
      } else {
        bookmarks.add(action.id);
      }
      return { ...state, bookmarks };
    }
    default:
      return state;
  }
}

const Learning = ({ navigateTo }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const removeCard = (id, dir) => dispatch({ type: 'REMOVE_CARD', id, dir });
  const undo = () => dispatch({ type: 'UNDO' });
  const toggleBookmark = (id) => dispatch({ type: 'TOGGLE_BOOKMARK', id });

  // Only show top 3 cards for performance and stack effect
  const visibleCards = state.cards.slice(0, 3);
  const currentCard = visibleCards[0];

  return (
    <div className="flex flex-col h-full bg-[#F5F7FA] relative overflow-hidden font-sans">
        {/* Rich Background */}
        <div className="absolute inset-0 pointer-events-none z-0">
            <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] bg-gradient-to-br from-blue-100/40 to-transparent rounded-full blur-[80px]"></div>
            <div className="absolute bottom-[-20%] right-[-20%] w-[500px] h-[500px] bg-gradient-to-tl from-purple-100/40 to-transparent rounded-full blur-[80px]"></div>
            <div className="absolute top-[20%] right-[-10%] w-[300px] h-[300px] bg-gradient-to-bl from-yellow-100/30 to-transparent rounded-full blur-[60px]"></div>
            {/* Bottom Gradient Mask for Tabbar Clarity */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#F5F7FA] via-[#F5F7FA]/80 to-transparent"></div>
        </div>

      <Navbar
        title="今日复习"
        leftIcon={<div className="w-6"></div>} // Empty placeholder
        rightIcons={
            <button className="w-9 h-9 rounded-full bg-white/60 hover:bg-white flex items-center justify-center transition-colors backdrop-blur-sm shadow-sm border border-white/50">
                <Settings2 size={18} className="text-text-main" />
            </button>
        }
        className="z-20 !bg-transparent"
      />

      {/* Progress Header - Adds Hierarchy */}
      <div className="px-6 py-2 flex flex-col z-10 shrink-0">
          <div className="flex justify-between items-end mb-2">
            <div>
                <div className="flex items-center gap-2 mb-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    <span className="text-xs font-bold text-text-muted uppercase tracking-widest">雅思核心词汇</span>
                </div>
                <h1 className="text-2xl font-black text-text-main tracking-tight">Day 12</h1>
            </div>
            <div className="flex flex-col items-end">
                <span className="text-2xl font-black text-primary leading-none">20<span className="text-sm text-text-muted font-bold ml-1">/ 50</span></span>
            </div>
          </div>
          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
             <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '40%' }}
                className="h-full bg-primary rounded-full"
             />
          </div>
      </div>

      {/* Main Content Area - Floating Card Layout */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full px-4 py-4">
        
        {/* Card Stack Container */}
        <div className="w-full max-w-[360px] aspect-[3/4.4] relative perspective-1000">
            <AnimatePresence custom={state.exitDirection}>
                {visibleCards.map((card, index) => {
                    const isTop = index === 0;
                    return (
                        <SwipeCard 
                            key={card.id} 
                            card={card} 
                            index={index}
                            isTop={isTop}
                            onSwipe={(dir) => {
                              if (dir === 'left') removeCard(card.id, 'left');
                            }}
                            onUndo={undo}
                            canUndo={state.history.length > 0}
                            onBookmark={() => toggleBookmark(card.id)}
                            isBookmarked={state.bookmarks.has(card.id)}
                            custom={state.exitDirection}
                        />
                    );
                }).reverse()} 
            </AnimatePresence>
            
            {/* Completion State */}
            {state.cards.length === 0 && (
                <MotionDiv 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute inset-0 flex flex-col items-center justify-center text-center bg-white/60 backdrop-blur-md rounded-[32px] border border-white/60 shadow-xl p-8"
                >
                    <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-50 rounded-full flex items-center justify-center text-4xl mb-6 shadow-inner border border-white">
                        🎉
                    </div>
                    <h3 className="text-2xl font-black text-gray-800 mb-2 tracking-tight">今日目标达成!</h3>
                    <p className="text-gray-500 text-sm mb-8 font-medium">离梦想又近了一步，明天见！</p>
                    <button 
                        className="w-full py-4 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20 font-bold text-base hover:scale-[1.02] active:scale-95 transition-all"
                        onClick={() => navigateTo('home')}
                    >
                        返回首页
                    </button>
                </MotionDiv>
            )}
        </div>
      </div>

      {/* Bottom Control Bar - Fills the void and adds utility */}
      <div className="px-6 pb-8 pt-2 z-20 shrink-0">
         {state.cards.length > 0 ? (
             <div className="flex items-center justify-between gap-5">
                 <MotionButton
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 h-[68px] rounded-[24px] bg-white border border-red-100 shadow-soft flex flex-col items-center justify-center gap-1 group hover:bg-red-50/50 transition-colors"
                    onClick={() => currentCard && removeCard(currentCard.id, 'left')}
                 >
                    <X size={24} strokeWidth={3} className="text-red-400 group-hover:text-red-500 transition-colors" />
                    <span className="text-xs font-bold text-red-400 group-hover:text-red-500 transition-colors">不认识</span>
                 </MotionButton>

                 <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-gray-400 cursor-pointer hover:bg-gray-200 hover:text-gray-600 transition-colors" onClick={undo}>
                    <RotateCcw size={20} />
                 </div>

                 <MotionButton
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 h-[68px] rounded-[24px] bg-primary text-white shadow-lg shadow-primary/20 flex flex-col items-center justify-center gap-1 group hover:bg-primary-dark transition-colors"
                    onClick={() => currentCard && removeCard(currentCard.id, 'right')}
                 >
                    <Check size={24} strokeWidth={3} className="text-white" />
                    <span className="text-xs font-bold text-white/90">认识</span>
                 </MotionButton>
             </div>
         ) : <div className="h-[68px]"></div>}
      </div>
    </div>
  );
};

const SwipeCard = ({ card, index, isTop, onSwipe, custom, onUndo, canUndo, onBookmark, isBookmarked }) => {
    const x = useMotionValue(0);
    const isSettlingRef = useRef(false);
    const rotate = useTransform(x, [-200, 200], [-10, 10]);
    const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
    const leftHintOpacity = useTransform(x, [0, -100], [0, 1]);
    const rightHintOpacity = useTransform(x, [0, 100], [0, 1]);
    
    // Swipe feedback colors
    const border = useTransform(
        x, 
        [-150, 0, 150], 
        ["2px solid rgba(239, 68, 68, 0.5)", "2px solid rgba(255, 255, 255, 0)", "2px solid rgba(16, 185, 129, 0.5)"]
    );

    const handleDragEnd = (event, info) => {
        if (isSettlingRef.current) return;
        const threshold = 100;
        if (info.offset.x > threshold) {
            if (!canUndo) {
                animate(x, 0, { type: 'spring', stiffness: 520, damping: 42 });
                return;
            }
            isSettlingRef.current = true;
            const controls = animate(x, 420, { duration: 0.16, ease: 'easeOut' });
            controls.finished.then(() => {
                onUndo?.();
                x.set(0);
                isSettlingRef.current = false;
            });
        } else if (info.offset.x < -threshold) {
            onSwipe('left');
        } else {
            animate(x, 0, { type: 'spring', stiffness: 520, damping: 42 });
        }
    };

    const variants = {
        top: { 
            zIndex: 3, 
            scale: 1, 
            y: 0, 
            opacity: 1,
            transition: { type: 'spring', stiffness: 300, damping: 25 }
        },
        second: { 
            zIndex: 2, 
            scale: 0.95, 
            y: 15, 
            opacity: 0.5,
            transition: { duration: 0.2 } 
        },
        third: { 
            zIndex: 1, 
            scale: 0.9, 
            y: 30, 
            opacity: 0.2,
            transition: { duration: 0.2 }
        },
        hidden: {
            zIndex: 0,
            scale: 0.85,
            y: 45,
            opacity: 0
        },
        exit: (direction) => ({
            x: direction === 'right' ? 400 : -400,
            opacity: 0,
            rotate: direction === 'right' ? 15 : -15,
            transition: { duration: 0.3, ease: "easeInOut" }
        })
    };

    const state = index === 0 ? 'top' : index === 1 ? 'second' : index === 2 ? 'third' : 'hidden';

    return (
        <MotionDiv
            style={isTop ? { x, rotate, opacity, border } : {}}
            variants={variants}
            initial="hidden"
            animate={state}
            exit="exit"
            custom={custom}
            drag={isTop ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragEnd={handleDragEnd}
            className={`absolute inset-0 bg-white rounded-[32px] shadow-[0_12px_40px_rgba(0,0,0,0.08)] flex flex-col overflow-hidden ${isTop ? 'cursor-grab active:cursor-grabbing' : ''}`}
        >
            {/* Swipe Indicators - Minimalist */}
            {isTop && (
                <>
                    <MotionDiv style={{ opacity: leftHintOpacity }} className="absolute top-20 right-8 z-20 pointer-events-none">
                         <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center text-red-500 shadow-sm border border-red-100">
                            <X size={28} strokeWidth={3} />
                         </div>
                    </MotionDiv>
                    <MotionDiv style={{ opacity: rightHintOpacity }} className="absolute top-20 left-8 z-20 pointer-events-none">
                         <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center text-green-500 shadow-sm border border-green-100">
                            <Check size={28} strokeWidth={3} />
                         </div>
                    </MotionDiv>
                </>
            )}

            {/* Card Content - Left Aligned Editorial Style */}
            <div className="flex-1 flex flex-col p-8 relative z-10 overflow-hidden">
                {isTop && (
                    <div className="flex items-center justify-between mb-6 shrink-0">
                        <button
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (canUndo) onUndo?.();
                            }}
                            disabled={!canUndo}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border shadow-sm ${canUndo ? 'bg-white border-gray-100 text-text-main hover:bg-gray-50' : 'bg-gray-50 border-gray-100 text-gray-300'}`}
                        >
                            <RotateCcw size={18} />
                        </button>

                        <button
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                                e.stopPropagation();
                                onBookmark?.();
                            }}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border shadow-sm ${isBookmarked ? 'bg-yellow-50 border-yellow-100 text-yellow-500' : 'bg-white border-gray-100 text-text-muted hover:text-yellow-500'}`}
                        >
                            <Bookmark size={18} className={isBookmarked ? "fill-yellow-500" : ""} />
                        </button>
                    </div>
                )}
                
                {/* Header */}
                <div className="flex flex-col items-start mb-6 shrink-0">
                    <div className="flex items-start justify-between w-full">
                         <h2 className="text-4xl font-black text-text-main tracking-tight mb-2">{card.word}</h2>
                         <div className="px-2 py-1 bg-gray-100 rounded-md text-xs font-bold text-text-muted uppercase tracking-wide">{card.type}</div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-text-muted cursor-pointer hover:text-primary transition-colors group">
                        <span className="text-base font-serif italic">{card.phonetic}</span>
                        <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            <Volume2 size={14} />
                        </div>
                    </div>
                </div>

                <div className="w-full h-px bg-gray-100 mb-6 shrink-0"></div>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto no-scrollbar pb-8 mask-image-b">
                    {/* Meaning */}
                    <div className="mb-6">
                        <h3 className="text-xl text-text-main font-bold leading-snug mb-2">{card.mean}</h3>
                        <p className="text-sm text-text-muted leading-relaxed font-medium">"{card.en}"</p>
                    </div>

                    {/* Details Sections */}
                    <div className="space-y-5">
                        {/* Roots */}
                        {card.roots && (
                            <div className="bg-secondary-purple/5 rounded-xl p-3 border border-secondary-purple/10">
                                <div className="text-[10px] font-bold text-secondary-purple uppercase tracking-widest mb-1 flex items-center gap-1.5">
                                    <Sparkles size={10} />
                                    词根记忆
                                </div>
                                <p className="text-xs text-text-main leading-relaxed font-medium">{card.roots}</p>
                            </div>
                        )}

                        {/* Sentences */}
                        {card.sentences && (
                            <div>
                                <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                    例句
                                </div>
                                <div className="space-y-2">
                                    {card.sentences.map((s, i) => (
                                        <div key={i} className="pl-3 border-l-2 border-gray-100">
                                            <p className="text-sm text-text-main leading-relaxed">{s}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {/* Synonyms */}
                        {card.synonyms && (
                            <div>
                                <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-secondary-green"></div>
                                    同义词
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {card.synonyms.map((s, i) => (
                                        <span key={i} className="text-xs text-text-sub bg-gray-50 px-2 py-1 rounded-lg border border-gray-100 font-medium">{s}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Bottom Fade */}
                <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none z-20"></div>
            </div>
        </MotionDiv>
    );
};

export default Learning;
