import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { ArrowLeft, Mic, Send, Gamepad2, ChevronRight, Sparkles, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AiChat = ({ onBack }) => {
  const [messages, setMessages] = useState([
    { id: 1, type: 'ai', content: 'Hi！我是你的AI学习搭子。今天想聊点什么？我们可以一起练习口语，或者玩个单词游戏哦～' },
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), type: 'user', content: inputValue }]);
    setInputValue('');
    // Simulate AI response
    setTimeout(() => {
        setMessages(prev => [...prev, { id: Date.now()+1, type: 'ai', content: '收到！让我们开始吧！' }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-[#F5F7FA] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
         <div className="absolute top-[-10%] right-[-20%] w-[300px] h-[300px] bg-secondary-purple/10 rounded-full blur-3xl"></div>
         <div className="absolute bottom-[20%] left-[-10%] w-[250px] h-[250px] bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      <Navbar
        title="AI 学习助手"
        onBack={onBack}
        className="!bg-white/80 !backdrop-blur-md border-b border-gray-100 z-20"
      />

      <div className="flex-1 flex flex-col overflow-hidden z-10">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-6">
            <div className="text-center py-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 border border-white/50 shadow-sm">
                    <Sparkles size={12} className="text-secondary-purple" />
                    <span className="text-[10px] font-medium text-text-muted">AI 助手已准备就绪</span>
                </div>
            </div>

            <AnimatePresence initial={false}>
                {messages.map((msg) => (
                    <motion.div 
                        key={msg.id} 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start items-end'} gap-2`}
                    >
                        {msg.type === 'ai' && (
                            <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm shrink-0 mb-1">
                                <Bot size={18} className="text-secondary-purple" />
                            </div>
                        )}
                        <div 
                            className={`max-w-[75%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                msg.type === 'user' 
                                ? 'bg-primary text-white rounded-br-none' 
                                : 'bg-white border border-gray-100 text-text-main rounded-bl-none'
                            }`}
                        >
                            {msg.content}
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
        </div>

        {/* Suggestion / Game Entry */}
        <div className="px-4 pb-3">
            <motion.div 
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-secondary-purple/5 to-primary/5 border border-white/60 rounded-2xl p-3 flex items-center justify-between shadow-sm cursor-pointer hover:shadow-md transition-all"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-secondary-purple">
                        <Gamepad2 size={20}/>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-text-main">单词大挑战</span>
                        <span className="text-[10px] text-text-muted">轻松记单词，赢取积分奖励</span>
                    </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-text-muted">
                    <ChevronRight size={16}/>
                </div>
            </motion.div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 pb-8">
            <div className="flex items-end gap-2">
                <div className="flex-1 bg-gray-50 border border-gray-200 rounded-[20px] px-4 py-3 flex items-center transition-colors focus-within:bg-white focus-within:border-primary/30 focus-within:shadow-sm">
                    <input 
                        type="text" 
                        placeholder="输入消息..." 
                        className="flex-1 bg-transparent text-sm outline-none text-text-main placeholder:text-text-muted/70"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                </div>
                <motion.button 
                    whileTap={{ scale: 0.9 }}
                    className="w-11 h-11 rounded-full bg-gray-100 text-text-main hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                    <Mic size={20}/>
                </motion.button>
                <motion.button 
                    whileTap={{ scale: 0.9 }}
                    className={`w-11 h-11 rounded-full flex items-center justify-center transition-all shadow-sm ${
                        inputValue.trim() 
                        ? 'bg-primary text-white shadow-primary/30' 
                        : 'bg-primary/10 text-primary/50'
                    }`}
                    onClick={handleSend}
                    disabled={!inputValue.trim()}
                >
                    <Send size={18} className={inputValue.trim() ? 'ml-0.5' : ''}/>
                </motion.button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AiChat;
