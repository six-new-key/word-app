import React, { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import { BookOpen, CalendarDays, Bell, Minus, Plus, Check } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY = 'word-app-prototype.studyPlan.v1';

const readPlan = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const clampInt = (value, min, max) => {
  const n = Number.parseInt(String(value || ''), 10);
  if (Number.isNaN(n)) return min;
  return Math.max(min, Math.min(max, n));
};

const dayLabels = ['日', '一', '二', '三', '四', '五', '六'];

const StudyPlan = ({ onBack }) => {
  const initialPlan = useMemo(
    () =>
      readPlan() || {
        dailyNew: 30,
        dailyReview: 60,
        remindEnabled: true,
        remindTime: '20:00',
        days: [1, 2, 3, 4, 5, 6, 0]
      },
    []
  );

  const [plan, setPlan] = useState(initialPlan);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
    } catch {
      undefined;
    }
  }, [plan]);

  useEffect(() => {
    if (!toast) return undefined;
    const t = window.setTimeout(() => setToast(null), 1600);
    return () => window.clearTimeout(t);
  }, [toast]);

  const toggleDay = (d) => {
    setPlan((p) => {
      const exists = p.days.includes(d);
      const nextDays = exists ? p.days.filter((x) => x !== d) : [...p.days, d];
      return { ...p, days: nextDays };
    });
  };

  return (
    <div className="flex flex-col h-full bg-background relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-[320px] h-[320px] bg-gradient-to-br from-primary/10 via-secondary-purple/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[380px] h-[380px] bg-gradient-to-tr from-accent/10 via-primary/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <Navbar title="Study Plan" onBack={onBack} rightIcons={null} className="!bg-transparent" />

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-2 pb-32 space-y-8 z-10">
        <section>
             <div className="flex items-center gap-2 mb-3 px-1">
                 <div className="w-1 h-3 rounded-full bg-primary/40"></div>
                 <div className="text-xs font-black text-text-muted uppercase tracking-widest">Daily Goals</div>
             </div>
            <Motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="rounded-[28px] bg-white/75 backdrop-blur-md border border-white/70 shadow-soft overflow-hidden p-5"
            >
              <div className="grid grid-cols-2 gap-4">
                <CounterCard
                  label="New Words"
                  value={plan.dailyNew}
                  onMinus={() => setPlan((p) => ({ ...p, dailyNew: clampInt(p.dailyNew - 5, 5, 300) }))}
                  onPlus={() => setPlan((p) => ({ ...p, dailyNew: clampInt(p.dailyNew + 5, 5, 300) }))}
                  color="text-primary"
                  bg="bg-primary/5"
                />
                <CounterCard
                  label="Review"
                  value={plan.dailyReview}
                  onMinus={() => setPlan((p) => ({ ...p, dailyReview: clampInt(p.dailyReview - 10, 10, 800) }))}
                  onPlus={() => setPlan((p) => ({ ...p, dailyReview: clampInt(p.dailyReview + 10, 10, 800) }))}
                  color="text-secondary-purple"
                  bg="bg-secondary-purple/5"
                />
              </div>
            </Motion.div>
        </section>

        <section>
            <div className="flex items-center gap-2 mb-3 px-1">
                 <div className="w-1 h-3 rounded-full bg-secondary-purple/40"></div>
                 <div className="text-xs font-black text-text-muted uppercase tracking-widest">Schedule</div>
             </div>
            <Motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.05 }}
              className="rounded-[28px] bg-white/75 backdrop-blur-md border border-white/70 shadow-soft overflow-hidden p-5"
            >
              <div className="flex flex-wrap gap-2 justify-between">
                {dayLabels.map((label, idx) => {
                  const day = idx === 0 ? 0 : idx;
                  const active = plan.days.includes(day);
                  return (
                    <Motion.button
                      key={label}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleDay(day)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs transition-all duration-300 ${
                        active ? 'bg-primary text-white shadow-md shadow-primary/30' : 'bg-gray-50 text-text-muted hover:bg-gray-100'
                      }`}
                    >
                      {label}
                    </Motion.button>
                  );
                })}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2">
                 <CalendarDays size={14} className="text-secondary-purple" />
                 <span className="text-[11px] text-text-muted font-bold">
                    {plan.days.length ? `Selected ${plan.days.length} days` : 'Select at least 1 day'}
                 </span>
              </div>
            </Motion.div>
        </section>

        <section>
             <div className="flex items-center gap-2 mb-3 px-1">
                 <div className="w-1 h-3 rounded-full bg-accent/40"></div>
                 <div className="text-xs font-black text-text-muted uppercase tracking-widest">Reminders</div>
             </div>
            <Motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="rounded-[28px] bg-white/75 backdrop-blur-md border border-white/70 shadow-soft overflow-hidden p-5 space-y-5"
            >
              <RowSwitch
                label="Daily Reminder"
                checked={plan.remindEnabled}
                onClick={() => setPlan((p) => ({ ...p, remindEnabled: !p.remindEnabled }))}
              />
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold text-text-main">Time</div>
                <div className="relative">
                    <input
                        type="time"
                        value={plan.remindTime}
                        onChange={(e) => setPlan((p) => ({ ...p, remindTime: e.target.value }))}
                        className="h-9 px-3 rounded-xl bg-gray-50 border border-gray-100 text-sm font-bold text-text-main outline-none focus:border-primary/50 transition-colors"
                    />
                </div>
              </div>
            </Motion.div>
        </section>

        <Motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setToast('Saved Successfully')}
          className="w-full h-[56px] rounded-[24px] bg-primary text-white font-black shadow-lg shadow-primary/30 flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors"
        >
          <Check size={20} strokeWidth={3} />
          Save Plan
        </Motion.button>
      </div>

      <AnimatePresence>
        {toast && (
          <Motion.div
            initial={{ y: 20, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.9 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[80] px-6 py-3 rounded-full bg-black/80 backdrop-blur-md text-white text-sm font-bold shadow-xl flex items-center gap-2"
          >
            <Check size={16} className="text-green-400" strokeWidth={3} />
            {toast}
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CounterCard = ({ label, value, onMinus, onPlus, color, bg }) => (
  <div className={`rounded-[24px] border border-white/60 shadow-sm p-4 flex flex-col items-center justify-center gap-3 ${bg}`}>
    <div className="text-[10px] font-black uppercase tracking-widest text-text-muted">{label}</div>
    <div className={`text-3xl font-black ${color}`}>{value}</div>
    <div className="flex items-center gap-3 w-full justify-center">
      <Motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onMinus}
        className="w-8 h-8 rounded-full bg-white border border-white/60 shadow-sm flex items-center justify-center text-text-muted hover:text-text-main hover:shadow-md transition-all"
      >
        <Minus size={14} strokeWidth={3} />
      </Motion.button>
      <Motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onPlus}
        className="w-8 h-8 rounded-full bg-white border border-white/60 shadow-sm flex items-center justify-center text-text-main hover:bg-primary hover:text-white hover:border-primary transition-all hover:shadow-md"
      >
        <Plus size={14} strokeWidth={3} />
      </Motion.button>
    </div>
  </div>
);

const RowSwitch = ({ label, checked, onClick }) => (
  <div className="flex items-center justify-between">
    <div className="text-sm font-bold text-text-main">{label}</div>
    <Motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-[44px] h-[26px] rounded-full relative transition-colors duration-300 ${
        checked ? 'bg-primary' : 'bg-gray-200'
      }`}
    >
      <div
        className={`absolute top-[3px] w-[20px] h-[20px] bg-white rounded-full shadow-sm transition-all duration-300 ${
          checked ? 'left-[21px]' : 'left-[3px]'
        }`}
      />
    </Motion.button>
  </div>
);

export default StudyPlan;
