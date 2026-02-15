import React, { useEffect, useMemo, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import { UserPlus, Search, Zap, MessageCircle, X, Send, Trash2, ChevronRight } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';

const avatarUrl = (seed) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;

const Friends = ({ onBack }) => {
  const idSeqRef = useRef(100);
  const [query, setQuery] = useState('');
  const [toast, setToast] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeFriendId, setActiveFriendId] = useState(null);

  const [friends, setFriends] = useState(() => ([
    { id: 'f-1', name: 'LearningBot 小助', level: 10, progress: 1, isOnline: true, streak: 30 },
    { id: 'f-2', name: 'Alice 小艾', level: 3, progress: 0.45, isOnline: true, streak: 7 },
    { id: 'f-3', name: 'Ming 小明', level: 4, progress: 0.6, isOnline: false, streak: 12 },
    { id: 'f-4', name: 'Charlie 查理', level: 2, progress: 0.12, isOnline: false, streak: 3 },
    { id: 'f-5', name: 'David 大卫', level: 5, progress: 0.88, isOnline: true, streak: 18 },
    { id: 'f-6', name: 'Eva 小伊', level: 1, progress: 0, isOnline: false, streak: 0 }
  ]));

  const [messagesByFriendId, setMessagesByFriendId] = useState(() => ({
    'f-1': [
      { id: 'm-1', from: 'friend', text: '要不要来一轮互助复习？' },
      { id: 'm-2', from: 'me', text: '可以，给我出 10 个高频词。' }
    ],
    'f-2': [{ id: 'm-1', from: 'friend', text: '今天打卡了吗？' }]
  }));

  useEffect(() => {
    if (!toast) return undefined;
    const t = window.setTimeout(() => setToast(null), 1600);
    return () => window.clearTimeout(t);
  }, [toast]);

  const activeFriend = useMemo(() => friends.find((f) => f.id === activeFriendId) || null, [friends, activeFriendId]);

  const filteredFriends = useMemo(() => {
    const key = query.trim().toLowerCase();
    if (!key) return friends;
    return friends.filter((f) => f.name.toLowerCase().includes(key));
  }, [friends, query]);

  const onlineFriends = useMemo(() => friends.filter((f) => f.isOnline), [friends]);

  const openProfile = (friendId) => {
    setActiveFriendId(friendId);
    setProfileOpen(true);
  };

  const openChat = (friendId) => {
    setActiveFriendId(friendId);
    setChatOpen(true);
    setProfileOpen(false);
  };

  const addFriend = ({ name }) => {
    const n = name.trim();
    if (n.length < 2) return;
    const existed = friends.some((f) => f.name.toLowerCase() === n.toLowerCase());
    if (existed) {
      setToast('好友已存在');
      return;
    }
    const id = `f-${idSeqRef.current++}`;
    setFriends((prev) => [{ id, name: n, level: 1, progress: 0, isOnline: true, streak: 0 }, ...prev]);
    setActiveFriendId(id);
    setToast('已添加好友');
    setAddOpen(false);
  };

  const removeFriend = (friendId) => {
    setFriends((prev) => prev.filter((f) => f.id !== friendId));
    setToast('已移除好友');
    if (activeFriendId === friendId) {
      setActiveFriendId(null);
      setProfileOpen(false);
      setChatOpen(false);
    }
  };

  const assistReview = (friendId) => {
    const f = friends.find((x) => x.id === friendId);
    setToast(f ? `已向 ${f.name} 发起互助` : '已发起互助');
  };

  const sendMessage = (friendId, text) => {
    const t = text.trim();
    if (!t) return;
    setMessagesByFriendId((prev) => {
      const list = prev[friendId] || [];
      const id = `m-${idSeqRef.current++}`;
      return { ...prev, [friendId]: [...list, { id, from: 'me', text: t }] };
    });
  };

  return (
    <div className="flex flex-col h-full bg-background relative">
       <div className="absolute top-0 left-0 w-full h-[220px] bg-gradient-to-br from-[#E0F7FA] via-[#E1F5FE] to-[#F3E5F5] z-0 rounded-b-[40px]"></div>
       <div className="absolute top-[-40px] right-[-40px] w-56 h-56 bg-primary/15 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
       <div className="absolute top-[120px] left-[-40px] w-44 h-44 bg-secondary-green/10 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

      <Navbar
        title="我的好友"
        onBack={onBack}
        className="!bg-transparent"
        rightIcons={
            <Motion.button 
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1 text-primary text-sm font-bold bg-white/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/70 shadow-soft"
                onClick={() => setAddOpen(true)}
            >
                <UserPlus size={16}/>
                添加
            </Motion.button>
        }
      />

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-2 pb-10 space-y-4 z-10">
        <div className="bg-white/80 backdrop-blur-md border border-white/70 rounded-[18px] h-12 flex items-center px-4 gap-3 shadow-soft sticky top-0 z-20">
          <Search size={18} className="text-primary"/>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="搜索好友账号/昵称"
            className="flex-1 bg-transparent text-sm outline-none text-text-main placeholder:text-text-muted font-medium"
          />
          {query.trim() && (
            <button onClick={() => setQuery('')} className="w-8 h-8 rounded-full hover:bg-gray-50 flex items-center justify-center">
              <X size={16} className="text-text-muted" />
            </button>
          )}
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-[24px] border border-white/70 shadow-soft p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-text-muted font-bold uppercase tracking-wider">在线</div>
              <div className="text-sm font-extrabold text-text-main mt-1">{onlineFriends.length} 人在线</div>
            </div>
            <div className="text-xs text-primary font-bold">{friends.length} 位好友</div>
          </div>
          <div className="mt-4 flex gap-3 overflow-x-auto no-scrollbar">
            {onlineFriends.length === 0 ? (
              <div className="text-xs text-text-muted font-medium">暂无在线好友</div>
            ) : (
              onlineFriends.map((f) => (
                <button
                  key={f.id}
                  onClick={() => openProfile(f.id)}
                  className="shrink-0 flex flex-col items-center gap-2"
                >
                  <div className="relative w-12 h-12 rounded-full bg-white border border-gray-100 shadow-sm overflow-hidden">
                    <img src={avatarUrl(f.name)} alt={f.name} className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-secondary-green border-[2px] border-white rounded-full"></div>
                  </div>
                  <div className="text-[10px] font-bold text-text-sub w-14 truncate text-center">{f.name}</div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Friend List */}
        <div className="space-y-3 pt-1">
          {filteredFriends.length === 0 ? (
            <div className="bg-white rounded-[24px] p-6 shadow-soft border border-white/70">
              <div className="text-sm font-extrabold text-text-main">没有匹配的好友</div>
              <div className="text-xs text-text-muted mt-2">换个关键词试试，或点击右上角添加。</div>
            </div>
          ) : (
            filteredFriends.map((f, idx) => (
              <FriendCard
                key={f.id}
                friend={f}
                idx={idx}
                onOpen={() => openProfile(f.id)}
                onAssist={() => assistReview(f.id)}
                onChat={() => openChat(f.id)}
              />
            ))
          )}
        </div>
      </div>

      <AnimatePresence>
        {addOpen && (
          <ModalShell title="添加好友" onClose={() => setAddOpen(false)}>
            <AddFriendForm onSubmit={addFriend} onCancel={() => setAddOpen(false)} />
          </ModalShell>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {profileOpen && activeFriend && (
          <BottomSheet title="好友资料" onClose={() => setProfileOpen(false)}>
            <FriendProfile
              friend={activeFriend}
              onAssist={() => assistReview(activeFriend.id)}
              onChat={() => openChat(activeFriend.id)}
              onRemove={() => removeFriend(activeFriend.id)}
            />
          </BottomSheet>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {chatOpen && activeFriend && (
          <BottomSheet title="聊天" onClose={() => setChatOpen(false)}>
            <FriendChat
              friend={activeFriend}
              messages={messagesByFriendId[activeFriend.id] || []}
              onSend={(text) => sendMessage(activeFriend.id, text)}
            />
          </BottomSheet>
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

const FriendCard = ({ friend, idx, onOpen, onAssist, onChat }) => {
  const progressPct = `${Math.round(friend.progress * 100)}%`;
  return (
    <Motion.div 
      initial={{ y: 14, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: Math.min(0.2, idx * 0.04) }}
      whileTap={{ scale: 0.99 }}
      className="bg-white rounded-[24px] p-4 shadow-soft border border-white/70"
    >
      <div className="flex items-start gap-4">
        <button onClick={onOpen} className="shrink-0 relative w-14 h-14 rounded-full bg-white border border-gray-100 shadow-sm overflow-hidden">
          <img src={avatarUrl(friend.name)} alt={friend.name} className="w-full h-full object-cover" />
          {friend.isOnline && (
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-secondary-green border-[3px] border-white rounded-full"></div>
          )}
        </button>

        <div className="flex-1 min-w-0 pt-0.5">
          <div className="flex items-center justify-between mb-3">
             <div className="flex flex-col gap-1 min-w-0">
               <div className="flex items-center gap-2">
                 <div className="font-extrabold text-text-main text-base truncate max-w-[120px]">{friend.name}</div>
                 <span className="shrink-0 text-[10px] bg-gray-100 text-text-sub px-2 py-0.5 rounded-full font-bold">Lv.{friend.level}</span>
               </div>
               <div className="flex items-center gap-1">
                   <Zap size={10} className="fill-orange-500 text-orange-500" />
                   <span className="text-[10px] text-orange-600 font-bold">连续 {friend.streak} 天</span>
               </div>
             </div>
             
             {/* Action Buttons moved to top right to save space below */}
             <div className="flex items-center gap-2">
                <button onClick={onAssist} className="w-8 h-8 rounded-full bg-primary/5 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                    <Zap size={14}/>
                </button>
                <button onClick={onChat} className="w-8 h-8 rounded-full bg-gray-50 text-text-sub flex items-center justify-center hover:bg-gray-100 transition-colors">
                    <MessageCircle size={14}/>
                </button>
             </div>
          </div>

          <div className="space-y-1.5">
               <div className="flex items-center justify-between text-[10px] font-bold text-text-muted">
                 <span>今日学习进度</span>
                 <span>{progressPct}</span>
               </div>
               <div className="h-2 bg-gray-100 rounded-full overflow-hidden w-full">
                  <div className="h-full bg-primary rounded-full" style={{ width: progressPct }} />
               </div>
          </div>
        </div>
      </div>
    </Motion.div>
  );
};

const ModalShell = ({ title, onClose, children }) => (
  <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[90] flex items-end justify-center">
    <div className="absolute inset-0 bg-black/30" onClick={onClose} />
    <Motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 30, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      className="relative w-full max-w-[420px] rounded-t-[28px] bg-white px-5 pt-4 pb-6 shadow-2xl"
    >
      <div className="flex items-center justify-between">
        <div className="text-sm font-extrabold text-text-main">{title}</div>
        <button onClick={onClose} className="w-9 h-9 rounded-full hover:bg-gray-50 flex items-center justify-center">
          <X size={18} className="text-text-muted" />
        </button>
      </div>
      <div className="mt-4">{children}</div>
    </Motion.div>
  </Motion.div>
);

const BottomSheet = ({ title, onClose, children }) => (
  <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[90] flex items-end justify-center">
    <div className="absolute inset-0 bg-black/30" onClick={onClose} />
    <Motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 40, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      className="relative w-full max-w-[420px] rounded-t-[28px] bg-white px-5 pt-4 pb-6 shadow-2xl"
    >
      <div className="flex items-center justify-between">
        <div className="text-sm font-extrabold text-text-main">{title}</div>
        <button onClick={onClose} className="w-9 h-9 rounded-full hover:bg-gray-50 flex items-center justify-center">
          <X size={18} className="text-text-muted" />
        </button>
      </div>
      <div className="mt-4">{children}</div>
    </Motion.div>
  </Motion.div>
);

const AddFriendForm = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const canSubmit = name.trim().length >= 2;
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="text-xs font-bold text-text-muted">好友账号 / 昵称</div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="例如：Momo"
          className="w-full h-11 px-3 rounded-2xl bg-gray-50 border border-gray-100 text-sm outline-none text-text-main placeholder:text-text-muted"
        />
      </div>
      <div className="grid grid-cols-2 gap-3 pt-2">
        <button onClick={onCancel} className="h-11 rounded-2xl bg-gray-100 text-text-main text-sm font-extrabold">
          取消
        </button>
        <button
          disabled={!canSubmit}
          onClick={() => onSubmit({ name })}
          className={`h-11 rounded-2xl text-sm font-extrabold ${canSubmit ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'}`}
        >
          添加
        </button>
      </div>
    </div>
  );
};

const FriendProfile = ({ friend, onAssist, onChat, onRemove }) => {
  const progressPct = `${Math.round(friend.progress * 100)}%`;
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-[24px] border border-white/70 shadow-soft p-4">
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 rounded-full bg-white border border-gray-100 shadow-sm overflow-hidden">
            <img src={avatarUrl(friend.name)} alt={friend.name} className="w-full h-full object-cover" />
            {friend.isOnline && (
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-secondary-green border-[3px] border-white rounded-full"></div>
            )}
          </div>
          <div className="flex-1">
            <div className="text-base font-extrabold text-text-main flex items-center gap-2">
              {friend.name}
              <span className="text-[10px] bg-gray-100 text-text-sub px-2 py-0.5 rounded-full font-bold">Lv.{friend.level}</span>
            </div>
            <div className="text-xs text-text-muted font-bold mt-1">连续 {friend.streak} 天 · 今日进度 {progressPct}</div>
          </div>
        </div>
        <div className="mt-4 w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full" style={{ width: progressPct }} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Motion.button whileTap={{ scale: 0.98 }} onClick={onAssist} className="h-12 rounded-[20px] bg-primary/10 text-primary font-extrabold text-sm flex items-center justify-center gap-2">
          <Zap size={18} />
          互助复习
        </Motion.button>
        <Motion.button whileTap={{ scale: 0.98 }} onClick={onChat} className="h-12 rounded-[20px] bg-primary text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
          <MessageCircle size={18} />
          发消息
        </Motion.button>
      </div>

      <Motion.button whileTap={{ scale: 0.98 }} onClick={onRemove} className="w-full h-12 rounded-[20px] bg-white border border-red-100 text-red-500 font-extrabold text-sm flex items-center justify-center gap-2">
        <Trash2 size={18} />
        移除好友
      </Motion.button>
    </div>
  );
};

const FriendChat = ({ friend, messages, onSend }) => {
  const [text, setText] = useState('');
  return (
    <div className="space-y-3">
      <div className="bg-white rounded-[20px] border border-white/70 shadow-soft p-4">
        <div className="text-sm font-extrabold text-text-main">与 {friend.name} 的对话</div>
        <div className="mt-3 space-y-2 max-h-[280px] overflow-y-auto no-scrollbar pr-1">
          {messages.length === 0 ? (
            <div className="text-xs text-text-muted font-medium">还没有消息，发一句试试。</div>
          ) : (
            messages.map((m) => (
              <div key={m.id} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`${m.from === 'me' ? 'bg-primary text-white' : 'bg-gray-100 text-text-main'} px-3 py-2 rounded-2xl text-sm font-medium max-w-[80%]`}>
                  {m.text}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-white rounded-[20px] border border-white/70 shadow-soft p-3 flex items-end gap-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="输入消息…"
          className="flex-1 min-h-[42px] max-h-[110px] bg-gray-50 border border-gray-100 rounded-2xl px-3 py-2 text-sm outline-none text-text-main placeholder:text-text-muted resize-none"
        />
        <button
          onClick={() => {
            onSend(text);
            setText('');
          }}
          className="w-11 h-11 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/25"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default Friends;
