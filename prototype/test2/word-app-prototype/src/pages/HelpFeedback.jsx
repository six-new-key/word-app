import React, { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import { HelpCircle, Mail, Send, ChevronDown } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY = 'word-app-prototype.helpFeedback.v1';

const readState = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const HelpFeedback = ({ onBack }) => {
  const initial = useMemo(
    () =>
      readState() || {
        feedback: '',
        email: ''
      },
    []
  );

  const [state, setState] = useState(initial);
  const [open, setOpen] = useState('q1');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      undefined;
    }
  }, [state]);

  useEffect(() => {
    if (!toast) return undefined;
    const t = window.setTimeout(() => setToast(null), 1600);
    return () => window.clearTimeout(t);
  }, [toast]);

  const faq = [
    { key: 'q1', q: '学习计划怎么生效？', a: '进入“学习计划”设置目标与提醒，系统会按计划给你提示。' },
    { key: 'q2', q: '好友列表里为什么看不到消息？', a: '这是原型版本。你可以先在“消息通知”里开启好友消息提醒。' },
    { key: 'q3', q: '如何导入词库？', a: '进入“词库管理”，选择导入入口并按照引导操作。' }
  ];

  const submit = () => {
    const text = String(state.feedback || '').trim();
    if (!text) {
      setToast('请先写点内容');
      return;
    }
    setState((s) => ({ ...s, feedback: '' }));
    setToast('已提交，感谢反馈');
  };

  return (
    <div className="flex flex-col h-full bg-background relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-[320px] h-[320px] bg-gradient-to-br from-secondary-purple/10 via-transparent to-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[380px] h-[380px] bg-gradient-to-tr from-accent/10 via-transparent to-secondary-purple/10 rounded-full blur-3xl pointer-events-none" />

      <Navbar title="帮助与反馈" onBack={onBack} rightIcons={null} className="!bg-transparent" />

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-2 pb-32 space-y-4 z-10">
        <Motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="rounded-[26px] bg-white/75 backdrop-blur-md border border-white/70 shadow-soft overflow-hidden"
        >
          <div className="px-5 py-4 flex items-center gap-2">
            <HelpCircle size={18} className="text-primary" />
            <div className="text-sm font-black text-text-main">常见问题</div>
          </div>
          <div className="px-5 pb-5 space-y-2">
            {faq.map((it) => {
              const active = open === it.key;
              return (
                <Motion.button
                  key={it.key}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setOpen((k) => (k === it.key ? null : it.key))}
                  className="w-full text-left rounded-[20px] bg-white/70 border border-white/70 overflow-hidden"
                >
                  <div className="px-4 py-4 flex items-center justify-between gap-3">
                    <div className="text-sm font-black text-text-main">{it.q}</div>
                    <Motion.div animate={active ? { rotate: 180 } : { rotate: 0 }} transition={{ duration: 0.18 }}>
                      <ChevronDown size={18} className="text-text-muted" />
                    </Motion.div>
                  </div>
                  <AnimatePresence initial={false}>
                    {active && (
                      <Motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.18 }}
                      >
                        <div className="px-4 pb-4 text-[12px] text-text-sub font-bold leading-relaxed">{it.a}</div>
                      </Motion.div>
                    )}
                  </AnimatePresence>
                </Motion.button>
              );
            })}
          </div>
        </Motion.div>

        <Motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.05 }}
          className="rounded-[26px] bg-white/75 backdrop-blur-md border border-white/70 shadow-soft overflow-hidden"
        >
          <div className="px-5 py-4 flex items-center gap-2">
            <Mail size={18} className="text-accent" />
            <div className="text-sm font-black text-text-main">反馈</div>
          </div>
          <div className="px-5 pb-5 space-y-3">
            <input
              value={state.email}
              onChange={(e) => setState((s) => ({ ...s, email: e.target.value }))}
              placeholder="邮箱（可选）"
              className="w-full h-11 px-4 rounded-[16px] bg-white/70 border border-white/70 text-sm font-bold text-text-main outline-none placeholder:text-text-muted/70"
            />
            <textarea
              value={state.feedback}
              onChange={(e) => setState((s) => ({ ...s, feedback: e.target.value }))}
              placeholder="写下你的想法、问题或建议…"
              rows={4}
              className="w-full px-4 py-3 rounded-[18px] bg-white/70 border border-white/70 text-sm font-bold text-text-main outline-none placeholder:text-text-muted/70 resize-none"
            />
            <Motion.button
              whileTap={{ scale: 0.98 }}
              onClick={submit}
              className="w-full h-[52px] rounded-[20px] bg-primary text-white font-black shadow-soft flex items-center justify-center gap-2"
            >
              <Send size={18} />
              提交反馈
            </Motion.button>
          </div>
        </Motion.div>
      </div>

      <AnimatePresence>
        {toast && (
          <Motion.div
            initial={{ y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 18, opacity: 0 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[80] px-4 py-2 rounded-full bg-black/70 text-white text-xs font-bold shadow-lg"
          >
            {toast}
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HelpFeedback;
