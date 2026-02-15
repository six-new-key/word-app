import React, { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import { Bell, Moon, MessageSquare, Users, Zap } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY = 'word-app-prototype.notifications.v1';

const readPrefs = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const Notifications = ({ onBack }) => {
  const initial = useMemo(
    () =>
      readPrefs() || {
        dailyReminder: true,
        friendMessages: true,
        groupUpdates: true,
        systemUpdates: false,
        quietHours: false,
        quietFrom: '22:30',
        quietTo: '08:00'
      },
    []
  );

  const [prefs, setPrefs] = useState(initial);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      undefined;
    }
  }, [prefs]);

  return (
    <div className="flex flex-col h-full bg-background relative overflow-hidden">
      <div className="absolute -top-24 -left-24 w-[320px] h-[320px] bg-gradient-to-br from-primary/10 via-transparent to-secondary-purple/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[380px] h-[380px] bg-gradient-to-tr from-accent/10 via-transparent to-primary/10 rounded-full blur-3xl pointer-events-none" />

      <Navbar title="消息通知" onBack={onBack} rightIcons={null} className="!bg-transparent" />

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-4 pb-32 space-y-6 z-10">
        {/* Section: Notifications */}
        <div className="space-y-3">
            <div className="px-2 flex items-center gap-2">
                <div className="w-1 h-3 bg-primary rounded-full"></div>
                <h3 className="text-xs font-black text-text-muted uppercase tracking-wider">推送设置</h3>
            </div>
            <Motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="rounded-[24px] bg-white/80 backdrop-blur-md border border-white/70 shadow-sm overflow-hidden"
            >
            <div className="p-1 space-y-1">
                <RowSwitch
                label="每日学习提醒"
                sub="每天早上 8:00 推送"
                checked={prefs.dailyReminder}
                onClick={() => setPrefs((p) => ({ ...p, dailyReminder: !p.dailyReminder }))}
                icon={Bell}
                color="text-blue-500"
                bg="bg-blue-50"
                />
                <div className="h-px bg-gray-50 mx-4" />
                <RowSwitch
                label="好友消息"
                checked={prefs.friendMessages}
                onClick={() => setPrefs((p) => ({ ...p, friendMessages: !p.friendMessages }))}
                icon={MessageSquare}
                color="text-green-500"
                bg="bg-green-50"
                />
                <div className="h-px bg-gray-50 mx-4" />
                <RowSwitch
                label="学习小组动态"
                checked={prefs.groupUpdates}
                onClick={() => setPrefs((p) => ({ ...p, groupUpdates: !p.groupUpdates }))}
                icon={Users}
                color="text-purple-500"
                bg="bg-purple-50"
                />
                <div className="h-px bg-gray-50 mx-4" />
                <RowSwitch
                label="系统更新"
                checked={prefs.systemUpdates}
                onClick={() => setPrefs((p) => ({ ...p, systemUpdates: !p.systemUpdates }))}
                icon={Zap} // Changed to Zap or Settings
                color="text-orange-500"
                bg="bg-orange-50"
                />
            </div>
            </Motion.div>
        </div>

        {/* Section: DND */}
        <div className="space-y-3">
            <div className="px-2 flex items-center gap-2">
                <div className="w-1 h-3 bg-indigo-500 rounded-full"></div>
                <h3 className="text-xs font-black text-text-muted uppercase tracking-wider">免打扰</h3>
            </div>
            <Motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.05 }}
            className="rounded-[24px] bg-white/80 backdrop-blur-md border border-white/70 shadow-sm overflow-hidden p-5 space-y-4"
            >
            <RowSwitch
                label="开启免打扰"
                sub="在指定时间段内静音所有通知"
                checked={prefs.quietHours}
                onClick={() => setPrefs((p) => ({ ...p, quietHours: !p.quietHours }))}
                icon={Moon}
                color="text-indigo-500"
                bg="bg-indigo-50"
            />
            
            <AnimatePresence>
                {prefs.quietHours && (
                    <Motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="pt-2 pb-2 space-y-3 bg-gray-50/50 rounded-2xl p-4 border border-gray-100/50">
                            <div className="flex items-center justify-between">
                            <div className="text-sm font-bold text-text-main">开始时间</div>
                            <input
                                type="time"
                                value={prefs.quietFrom}
                                onChange={(e) => setPrefs((p) => ({ ...p, quietFrom: e.target.value }))}
                                className="h-9 px-3 rounded-lg bg-white border border-gray-200 text-sm font-bold text-text-main outline-none focus:border-primary/50 transition-colors"
                            />
                            </div>
                            <div className="flex items-center justify-between">
                            <div className="text-sm font-bold text-text-main">结束时间</div>
                            <input
                                type="time"
                                value={prefs.quietTo}
                                onChange={(e) => setPrefs((p) => ({ ...p, quietTo: e.target.value }))}
                                className="h-9 px-3 rounded-lg bg-white border border-gray-200 text-sm font-bold text-text-main outline-none focus:border-primary/50 transition-colors"
                            />
                            </div>
                        </div>
                    </Motion.div>
                )}
            </AnimatePresence>
            
            <div className="text-[10px] text-text-muted font-medium leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">
                <span className="font-bold">提示：</span> 免打扰模式仅影响应用内的推送通知，不会修改系统的通知权限设置。
            </div>
            </Motion.div>
        </div>
      </div>
    </div>
  );
};

const RowSwitch = ({ label, sub, checked, onClick, icon: Icon, color, bg }) => (
  <div className="flex items-center justify-between p-3 hover:bg-gray-50/50 rounded-xl transition-colors cursor-pointer" onClick={onClick}>
    <div className="flex items-center gap-3">
      {Icon ? (
        <div className={`w-10 h-10 rounded-2xl ${bg} border border-white/50 shadow-sm flex items-center justify-center ${color}`}>
          <Icon size={18} strokeWidth={2.5} />
        </div>
      ) : null}
      <div className="flex flex-col">
        <div className="text-sm font-bold text-text-main">{label}</div>
        {sub && <div className="text-[10px] text-text-muted font-medium">{sub}</div>}
      </div>
    </div>
    <div
      className={`w-[48px] h-[28px] rounded-full relative transition-colors duration-300 shadow-inner ${
        checked ? 'bg-primary' : 'bg-gray-200'
      }`}
    >
      <div
        className={`absolute top-[2px] w-[24px] h-[24px] bg-white rounded-full shadow-md transition-all duration-300 ${
          checked ? 'left-[22px]' : 'left-[2px]'
        }`}
      />
    </div>
  </div>
);

export default Notifications;
