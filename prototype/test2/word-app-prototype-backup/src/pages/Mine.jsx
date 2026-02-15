import React, { useEffect, useMemo, useState } from 'react';
import { Settings, BookOpen, Bell, Brain, Moon, HelpCircle, ChevronRight, Users, MessageSquare, Crown, Edit3, X } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';

const PROFILE_STORAGE_KEY = 'word-app-prototype.profile.v1';
const NIGHT_MODE_STORAGE_KEY = 'word-app-prototype.nightMode';
const NIGHT_MODE_EVENT = 'wordapp:nightmode';
const avatarSeeds = ['Felix', 'Momo', 'Ava', 'Leo', 'Nova', 'Yuki', 'Ming', 'Luna', 'Kai', 'Zoe'];
const avatarUrl = (seed) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;

const Mine = ({ navigateTo }) => {
  const defaultProfile = useMemo(
    () => ({
      name: '学习用户',
      level: 5,
      isVip: true,
      streakDays: 42,
      masteredTotal: 1204,
      masteryRate: 0.42,
      reviewCount: 120,
      notebookCount: 34,
      bio: '今天也要坚持打卡',
      avatarSeed: 'Felix'
    }),
    []
  );

  const [profile, setProfile] = useState(() => {
    try {
      const raw = window.localStorage.getItem(PROFILE_STORAGE_KEY);
      if (!raw) return defaultProfile;
      const parsed = JSON.parse(raw);
      return { ...defaultProfile, ...parsed };
    } catch {
      return defaultProfile;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } catch {
      undefined;
    }
  }, [profile]);

  const [toast, setToast] = useState(null);
  useEffect(() => {
    if (!toast) return undefined;
    const t = window.setTimeout(() => setToast(null), 1600);
    return () => window.clearTimeout(t);
  }, [toast]);

  const [nightMode, setNightMode] = useState(() => {
    try {
      return window.localStorage.getItem(NIGHT_MODE_STORAGE_KEY) === '1';
    } catch {
      return false;
    }
  });

  const toggleNightMode = () => {
    const next = !nightMode;
    setNightMode(next);
    try {
      window.localStorage.setItem(NIGHT_MODE_STORAGE_KEY, next ? '1' : '0');
    } catch {
      undefined;
    }
    try {
      window.dispatchEvent(new CustomEvent(NIGHT_MODE_EVENT, { detail: next }));
    } catch {
      undefined;
    }
    setToast(next ? '已开启夜间模式' : '已关闭夜间模式');
  };

  const [editOpen, setEditOpen] = useState(false);
  const [draft, setDraft] = useState(profile);

  const openEdit = () => {
    setDraft(profile);
    setEditOpen(true);
  };

  const saveDraft = () => {
    const name = draft.name.trim();
    const avatarSeed = draft.avatarSeed.trim();
    const level = Number.isFinite(Number(draft.level)) ? Math.max(1, Math.min(99, parseInt(draft.level, 10))) : profile.level;
    const streakDays = Number.isFinite(Number(draft.streakDays)) ? Math.max(0, parseInt(draft.streakDays, 10)) : profile.streakDays;
    const masteredTotal = Number.isFinite(Number(draft.masteredTotal)) ? Math.max(0, parseInt(draft.masteredTotal, 10)) : profile.masteredTotal;
    const masteryRateRaw = Number.isFinite(Number(draft.masteryRate)) ? Number(draft.masteryRate) : profile.masteryRate;
    const masteryRate = Math.max(0, Math.min(1, masteryRateRaw));
    const reviewCount = Number.isFinite(Number(draft.reviewCount)) ? Math.max(0, parseInt(draft.reviewCount, 10)) : profile.reviewCount;
    const notebookCount = Number.isFinite(Number(draft.notebookCount)) ? Math.max(0, parseInt(draft.notebookCount, 10)) : profile.notebookCount;
    const bio = draft.bio.trim().slice(0, 30);

    setProfile((p) => ({
      ...p,
      name: name.length >= 2 ? name : p.name,
      level,
      streakDays,
      masteredTotal,
      masteryRate,
      reviewCount,
      notebookCount,
      bio,
      avatarSeed: avatarSeed.length >= 1 ? avatarSeed : p.avatarSeed,
      isVip: !!draft.isVip
    }));
    setEditOpen(false);
  };

  const masteryPct = Math.round(profile.masteryRate * 100);

  return (
    <div className="flex flex-col h-full bg-background relative">
      <div className="absolute top-0 left-0 w-full h-[320px] z-0">
        <div className="absolute inset-0 bg-background" />
        <div
          className="absolute -top-10 left-0 w-[110%] h-[270px] rounded-b-[48px]"
          style={{
            clipPath: 'polygon(0 0, 100% 0, 100% 72%, 0 100%)',
            background: 'linear-gradient(135deg, #BEEBFF 0%, #CAD6FF 45%, #FFD5F0 100%)'
          }}
        />
        <div className="absolute top-[-70px] right-[-70px] w-72 h-72 bg-primary/20 rounded-full blur-3xl opacity-55 pointer-events-none" />
        <div className="absolute top-[140px] left-[-60px] w-56 h-56 bg-secondary-green/15 rounded-full blur-3xl opacity-65 pointer-events-none" />
        <div
          className="absolute top-[112px] left-[-40px] w-[120%] h-10 bg-white/50 blur-sm opacity-60 pointer-events-none"
          style={{ transform: 'rotate(-10deg)' }}
        />
      </div>

      <div className="pt-[59px] px-5 pb-4 relative z-10">
        <Motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.05 }}
          className="rounded-[28px] bg-white/70 backdrop-blur-md border border-white/70 shadow-soft overflow-hidden relative"
        >
          <Motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => navigateTo && navigateTo('settings')}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/70 backdrop-blur-md border border-white/70 shadow-soft flex items-center justify-center z-10"
          >
            <Settings size={18} className="text-text-main opacity-90" />
          </Motion.button>

          <div
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(15, 23, 42, 0.06) 1px, transparent 0)',
              backgroundSize: '14px 14px'
            }}
          />
          <div className="absolute top-4 right-4 h-[110px] w-[1px] bg-gradient-to-b from-transparent via-black/10 to-transparent" />
          <div
            className="absolute top-4 right-1 text-[9px] font-black tracking-[0.35em] text-black/25 select-none"
            style={{ writingMode: 'vertical-rl' }}
          >
            PROFILE
          </div>

          <div className="relative p-5">
            <div className="flex items-start gap-4">
              <Motion.button
                whileTap={{ scale: 0.98 }}
                onClick={openEdit}
                className="relative shrink-0"
              >
                <div className="w-[88px] h-[88px] rounded-[24px] bg-white border-2 border-white shadow-xl overflow-hidden"
                  style={{ transform: 'rotate(-3deg)' }}
                >
                  <img src={avatarUrl(profile.avatarSeed)} alt="avatar" className="w-full h-full object-cover" />
                </div>
                <div
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-primary text-white border-[3px] border-white shadow-md flex items-center justify-center"
                >
                  <Edit3 size={14} />
                </div>
              </Motion.button>

              <div className="flex-1 min-w-0 pt-1">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="text-2xl font-black text-text-main truncate">{profile.name}</div>
                  {profile.isVip && <Crown size={18} className="text-yellow-500 fill-yellow-500 shrink-0" />}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] bg-gradient-to-r from-gray-100 to-gray-50 border border-gray-100 px-2.5 py-1 rounded-full font-extrabold text-text-sub uppercase tracking-wider shadow-sm">
                    LV.{profile.level}
                  </span>
                  {profile.isVip && (
                    <span className="text-[10px] bg-gradient-to-r from-yellow-100 to-amber-50 text-yellow-700 px-2.5 py-1 rounded-full font-extrabold shadow-sm">
                      VIP
                    </span>
                  )}
                </div>
                <div className="mt-3 text-xs text-text-muted font-bold truncate opacity-80">{profile.bio}</div>
              </div>
            </div>

            <div className="mt-6">
               <div className="flex items-center gap-2 mb-3 px-1">
                  <div className="w-1 h-3 rounded-full bg-primary/40"></div>
                  <div className="text-xs font-black text-text-muted uppercase tracking-widest">Data Overview</div>
               </div>
               <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-[22px] bg-gradient-to-b from-white/80 to-white/40 border border-white/60 px-4 py-3 shadow-sm flex flex-col items-center justify-center">
                    <div className="text-[10px] text-text-muted font-bold uppercase tracking-wider mb-1">累计学习</div>
                    <div className="text-lg font-black text-text-main">{profile.masteredTotal.toLocaleString()}</div>
                  </div>
                  <div className="rounded-[22px] bg-gradient-to-b from-white/80 to-white/40 border border-white/60 px-4 py-3 shadow-sm flex flex-col items-center justify-center">
                    <div className="text-[10px] text-text-muted font-bold uppercase tracking-wider mb-1">掌握率</div>
                    <div className="text-lg font-black text-primary">{masteryPct}%</div>
                  </div>
                  <div className="rounded-[22px] bg-gradient-to-b from-white/80 to-white/40 border border-white/60 px-4 py-3 shadow-sm flex flex-col items-center justify-center">
                    <div className="text-[10px] text-text-muted font-bold uppercase tracking-wider mb-1">坚持天数</div>
                    <div className="text-lg font-black text-text-main">{profile.streakDays}</div>
                  </div>
               </div>
            </div>
          </div>
        </Motion.div>
      </div>

      <div className="flex-1 px-5 space-y-5 overflow-y-auto no-scrollbar pb-32 z-10">
        <QuickLauncher
          nightMode={nightMode}
          onToggleNightMode={toggleNightMode}
          onNavigate={(view) => navigateTo && navigateTo(view)}
        />
         
         <div className="text-center text-[10px] text-text-muted pb-4">
            Version 2.1.0 (Build 20240520)
         </div>
      </div>

      <AnimatePresence>
        {editOpen && (
          <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[90] flex items-end justify-center">
            <div className="absolute inset-0 bg-black/30" onClick={() => setEditOpen(false)} />
            <Motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className="relative w-full max-w-[420px] rounded-t-[28px] bg-white px-5 pt-4 pb-6 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-extrabold text-text-main">编辑资料</div>
                <button onClick={() => setEditOpen(false)} className="w-9 h-9 rounded-full hover:bg-gray-50 flex items-center justify-center">
                  <X size={18} className="text-text-muted" />
                </button>
              </div>

              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-4 bg-gray-50 border border-gray-100 rounded-[20px] p-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-white border border-gray-100 shadow-sm">
                    <img src={avatarUrl(draft.avatarSeed || profile.avatarSeed)} alt="avatar" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-text-muted mb-1">头像 Seed</div>
                    <input
                      value={draft.avatarSeed}
                      onChange={(e) => setDraft((d) => ({ ...d, avatarSeed: e.target.value }))}
                      placeholder="例如：Felix"
                      className="w-full h-10 px-3 rounded-2xl bg-white border border-gray-100 text-sm outline-none text-text-main placeholder:text-text-muted"
                    />
                  </div>
                  <Motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() =>
                      setDraft((d) => {
                        const idx = Math.max(0, avatarSeeds.indexOf((d.avatarSeed || '').trim()));
                        const nextSeed = avatarSeeds[(idx + 1) % avatarSeeds.length];
                        return { ...d, avatarSeed: nextSeed };
                      })
                    }
                    className="shrink-0 h-10 px-4 rounded-2xl bg-primary/10 text-primary font-extrabold text-sm"
                  >
                    换一个
                  </Motion.button>
                </div>

                <Field label="昵称">
                  <input
                    value={draft.name}
                    onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                    placeholder="例如：学习用户"
                    className="w-full h-11 px-3 rounded-2xl bg-gray-50 border border-gray-100 text-sm outline-none text-text-main placeholder:text-text-muted"
                  />
                </Field>

                <Field label="个性签名（30字以内）">
                  <input
                    value={draft.bio}
                    onChange={(e) => setDraft((d) => ({ ...d, bio: e.target.value }))}
                    placeholder="例如：每天 10 个新词"
                    className="w-full h-11 px-3 rounded-2xl bg-gray-50 border border-gray-100 text-sm outline-none text-text-main placeholder:text-text-muted"
                  />
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="等级">
                    <input
                      value={draft.level}
                      onChange={(e) => setDraft((d) => ({ ...d, level: e.target.value }))}
                      inputMode="numeric"
                      className="w-full h-11 px-3 rounded-2xl bg-gray-50 border border-gray-100 text-sm outline-none text-text-main"
                    />
                  </Field>
                  <Field label="打卡天数">
                    <input
                      value={draft.streakDays}
                      onChange={(e) => setDraft((d) => ({ ...d, streakDays: e.target.value }))}
                      inputMode="numeric"
                      className="w-full h-11 px-3 rounded-2xl bg-gray-50 border border-gray-100 text-sm outline-none text-text-main"
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="累计单词">
                    <input
                      value={draft.masteredTotal}
                      onChange={(e) => setDraft((d) => ({ ...d, masteredTotal: e.target.value }))}
                      inputMode="numeric"
                      className="w-full h-11 px-3 rounded-2xl bg-gray-50 border border-gray-100 text-sm outline-none text-text-main"
                    />
                  </Field>
                  <Field label="掌握率（0~1）">
                    <input
                      value={draft.masteryRate}
                      onChange={(e) => setDraft((d) => ({ ...d, masteryRate: e.target.value }))}
                      inputMode="decimal"
                      className="w-full h-11 px-3 rounded-2xl bg-gray-50 border border-gray-100 text-sm outline-none text-text-main"
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="待复习">
                    <input
                      value={draft.reviewCount}
                      onChange={(e) => setDraft((d) => ({ ...d, reviewCount: e.target.value }))}
                      inputMode="numeric"
                      className="w-full h-11 px-3 rounded-2xl bg-gray-50 border border-gray-100 text-sm outline-none text-text-main"
                    />
                  </Field>
                  <Field label="生词本">
                    <input
                      value={draft.notebookCount}
                      onChange={(e) => setDraft((d) => ({ ...d, notebookCount: e.target.value }))}
                      inputMode="numeric"
                      className="w-full h-11 px-3 rounded-2xl bg-gray-50 border border-gray-100 text-sm outline-none text-text-main"
                    />
                  </Field>
                </div>

                <div className="bg-gray-50 border border-gray-100 rounded-[20px] p-4 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-extrabold text-text-main">VIP 会员</div>
                    <div className="text-[10px] text-text-muted font-medium mt-1">开启后显示皇冠与会员标识</div>
                  </div>
                  <button
                    onClick={() => setDraft((d) => ({ ...d, isVip: !d.isVip }))}
                    className={`w-12 h-7 rounded-full relative transition-colors ${draft.isVip ? 'bg-primary' : 'bg-gray-200'}`}
                  >
                    <span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${draft.isVip ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button onClick={() => setEditOpen(false)} className="h-12 rounded-[20px] bg-gray-100 text-text-main text-sm font-extrabold">
                    取消
                  </button>
                  <button onClick={saveDraft} className="h-12 rounded-[20px] bg-primary text-white text-sm font-extrabold shadow-lg shadow-primary/20">
                    保存
                  </button>
                </div>
              </div>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>

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

const Field = ({ label, children }) => (
  <div className="space-y-2">
    <div className="text-xs font-bold text-text-muted">{label}</div>
    {children}
  </div>
);

const QuickLauncher = ({ nightMode, onToggleNightMode, onNavigate }) => {
  const items = [
    { key: 'study-group', title: '学习小组', sub: '冲刺 · 排行 · 打卡', icon: Users, tone: 'purple' },
    { key: 'friends', title: '好友列表', sub: '消息 · 互助 · 聊天', icon: MessageSquare, tone: 'blue' },
    { key: 'study-plan', title: '学习计划', sub: '目标 · 习惯 · 提醒', icon: BookOpen, tone: 'amber' },
    { key: 'ai-chat', title: 'AI 个性化', sub: '对话 · 陪练 · 建议', icon: Brain, tone: 'green' },
    { key: 'vocabulary', title: '词库管理', sub: '导入 · 编辑 · 分类', icon: BookOpen, tone: 'slate' },
    { key: 'notifications', title: '消息通知', sub: '提醒 · 频道 · 免打扰', icon: Bell, tone: 'sky' },
    { key: 'night', title: '夜间模式', sub: nightMode ? '已开启 · 点击关闭' : '已关闭 · 点击开启', icon: Moon, tone: 'midnight' },
    { key: 'help-feedback', title: '帮助与反馈', sub: 'FAQ · 反馈 · 联系', icon: HelpCircle, tone: 'pink' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div className="text-[10px] font-black tracking-[0.35em] text-black/35">QUICK</div>
        <div className="text-[10px] font-extrabold text-text-muted">快捷入口</div>
      </div>
      <div className="flex flex-col gap-3">
        {items.map((it, idx) => (
          <QuickTile
            key={it.key}
            item={it}
            index={idx}
            onClick={() => {
              if (it.key === 'night') onToggleNightMode();
              else onNavigate(it.key);
            }}
          />
        ))}
      </div>
    </div>
  );
};

const QuickTile = ({ item, index, onClick }) => {
  const toneMap = {
    purple: { bg: 'linear-gradient(135deg, rgba(155,81,224,0.1) 0%, rgba(255,255,255,0.8) 100%)', icon: 'text-secondary-purple bg-secondary-purple/10' },
    blue: { bg: 'linear-gradient(135deg, rgba(46,134,171,0.1) 0%, rgba(255,255,255,0.8) 100%)', icon: 'text-primary bg-primary/10' },
    amber: { bg: 'linear-gradient(135deg, rgba(245,166,35,0.1) 0%, rgba(255,255,255,0.8) 100%)', icon: 'text-accent bg-accent/10' },
    green: { bg: 'linear-gradient(135deg, rgba(39,174,96,0.1) 0%, rgba(255,255,255,0.8) 100%)', icon: 'text-secondary-green bg-secondary-green/10' },
    slate: { bg: 'linear-gradient(135deg, rgba(148,163,184,0.1) 0%, rgba(255,255,255,0.8) 100%)', icon: 'text-text-sub bg-text-sub/10' },
    sky: { bg: 'linear-gradient(135deg, rgba(56,189,248,0.1) 0%, rgba(255,255,255,0.8) 100%)', icon: 'text-primary bg-primary/10' },
    midnight: { bg: 'linear-gradient(135deg, rgba(15,23,42,0.05) 0%, rgba(255,255,255,0.8) 100%)', icon: 'text-text-main bg-text-main/10' },
    pink: { bg: 'linear-gradient(135deg, rgba(236,72,153,0.1) 0%, rgba(255,255,255,0.8) 100%)', icon: 'text-accent bg-accent/10' }
  };
  const t = toneMap[item.tone] || toneMap.blue;

  return (
    <Motion.button
      whileTap={{ scale: 0.98 }}
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: Math.min(0.15, index * 0.03) }}
      onClick={onClick}
      className="relative w-full h-[72px] rounded-[24px] overflow-hidden border border-white/60 shadow-sm group"
    >
      <div className="absolute inset-0 bg-white/60 backdrop-blur-md" />
      <div className="absolute inset-0 opacity-40 transition-opacity group-hover:opacity-60" style={{ background: t.bg }} />

      <div className="relative h-full px-4 flex items-center gap-4">
        <div className={`shrink-0 w-12 h-12 rounded-[18px] flex items-center justify-center ${t.icon}`}>
          {React.createElement(item.icon, { size: 22 })}
        </div>
        
        <div className="flex-1 min-w-0 flex flex-col items-start justify-center gap-0.5">
          <div className="text-sm font-black text-text-main truncate w-full text-left">{item.title}</div>
          <div className="text-[11px] text-text-muted font-bold truncate w-full text-left opacity-70">{item.sub}</div>
        </div>

        <div className="shrink-0 w-8 h-8 rounded-full bg-white/50 flex items-center justify-center text-text-muted/50">
          <ChevronRight size={16} />
        </div>
      </div>
    </Motion.button>
  );
};

export default Mine;
