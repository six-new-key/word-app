import React, { useEffect, useMemo, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import { Plus, Users, MessageSquare, ThumbsUp, ChevronRight, Trophy, Search, X, Send, LogOut, Target, Sparkles } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';

const StudyGroup = ({ onBack }) => {
  const [view, setView] = useState('list');
  const [tab, setTab] = useState('feed');
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [checkinOpen, setCheckinOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const idSeqRef = useRef(1);
  const [clockMinute, setClockMinute] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setClockMinute((m) => m + 1);
    }, 60 * 1000);
    return () => window.clearInterval(id);
  }, []);

  const [groups, setGroups] = useState(() => ([
    {
      id: 'g-ky',
      name: '考研冲刺打卡组',
      tag: 'VIP 小组',
      icon: '🏆',
      memberCount: 128,
      todayGoal: 15000,
      todayDone: 12450,
      themeFrom: 'from-primary',
      themeTo: 'to-secondary-purple',
      members: [
        { id: 'm-1', name: 'Momo', role: '打卡达人', streak: 30, todayWords: 50 },
        { id: 'm-2', name: 'Leo', role: '学习委员', streak: 18, todayWords: 80 },
        { id: 'm-3', name: 'Nina', role: '氛围组', streak: 12, todayWords: 20 },
        { id: 'm-4', name: 'You', role: '成员', streak: 42, todayWords: 0 }
      ]
    },
    {
      id: 'g-ielts',
      name: '雅思7分互助',
      tag: '互助',
      icon: '🎓',
      memberCount: 56,
      todayGoal: 4000,
      todayDone: 2210,
      themeFrom: 'from-sky-500',
      themeTo: 'to-indigo-500',
      members: [
        { id: 'm-1', name: 'Alice', role: '组长', streak: 21, todayWords: 120 },
        { id: 'm-2', name: 'You', role: '成员', streak: 42, todayWords: 0 }
      ]
    },
    {
      id: 'g-morning',
      name: '早起背单词',
      tag: '每日打卡',
      icon: '⏰',
      memberCount: 342,
      todayGoal: 22000,
      todayDone: 10340,
      themeFrom: 'from-orange-500',
      themeTo: 'to-rose-500',
      members: [
        { id: 'm-1', name: 'Ben', role: '组长', streak: 9, todayWords: 90 },
        { id: 'm-2', name: 'You', role: '成员', streak: 42, todayWords: 0 }
      ]
    },
    {
      id: 'g-tv',
      name: '美剧生肉啃噬',
      tag: '场景词汇',
      icon: '🎬',
      memberCount: 89,
      todayGoal: 6000,
      todayDone: 3860,
      themeFrom: 'from-fuchsia-500',
      themeTo: 'to-violet-500',
      members: [
        { id: 'm-1', name: 'Chris', role: '组长', streak: 14, todayWords: 60 },
        { id: 'm-2', name: 'You', role: '成员', streak: 42, todayWords: 0 }
      ]
    }
  ]));

  const [myGroupIds, setMyGroupIds] = useState(() => ['g-ky']);
  const [activeGroupId, setActiveGroupId] = useState(() => 'g-ky');

  const [feedsByGroupId, setFeedsByGroupId] = useState(() => ({
    'g-ky': [
      {
        id: 'p-1',
        user: { name: 'Momo', badge: '打卡达人', emoji: '👩‍🎓' },
        createdAtMinute: -2,
        content: '坚持就是胜利！今天的长难句有点难，但是背完感觉很有成就感，大家一起加油！',
        likes: 12,
        comments: 3,
        likedByMe: true
      }
    ],
    'g-ielts': [],
    'g-morning': [],
    'g-tv': []
  }));

  const activeGroup = useMemo(() => groups.find((g) => g.id === activeGroupId) || groups[0], [groups, activeGroupId]);
  const joinedGroups = useMemo(() => groups.filter((g) => myGroupIds.includes(g.id)), [groups, myGroupIds]);
  const recommendedGroups = useMemo(() => groups.filter((g) => !myGroupIds.includes(g.id)), [groups, myGroupIds]);

  const allGroupsFiltered = useMemo(() => {
    const key = search.trim().toLowerCase();
    if (!key) return groups;
    return groups.filter((g) => g.name.toLowerCase().includes(key) || g.tag.toLowerCase().includes(key));
  }, [groups, search]);

  const mixedFeed = useMemo(() => {
    const items = joinedGroups.flatMap((g) => {
      const feed = feedsByGroupId[g.id] || [];
      return feed.map((p) => ({ ...p, groupId: g.id, groupName: g.name }));
    });
    return items.sort((a, b) => (b.createdAtMinute ?? 0) - (a.createdAtMinute ?? 0)).slice(0, 8);
  }, [joinedGroups, feedsByGroupId]);

  const formatTime = (createdAtMinute) => {
    const diffMinute = Math.max(0, clockMinute - (createdAtMinute ?? 0));
    if (diffMinute < 1) return '刚刚';
    if (diffMinute < 60) return `${diffMinute} 分钟前`;
    if (diffMinute < 24 * 60) return `${Math.floor(diffMinute / 60)} 小时前`;
    return `${Math.floor(diffMinute / (24 * 60))} 天前`;
  };

  const showToast = (message) => {
    setToast(message);
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), 1800);
  };

  const goGroupSpace = (groupId) => {
    setActiveGroupId(groupId);
    setView('space');
    setTab('feed');
  };

  const joinGroup = (groupId) => {
    setMyGroupIds((prev) => (prev.includes(groupId) ? prev : [groupId, ...prev]));
    setActiveGroupId(groupId);
    showToast('已加入小组');
  };

  const leaveGroup = (groupId) => {
    setMyGroupIds((prev) => prev.filter((id) => id !== groupId));
    showToast('已退出小组');
    setView('list');
    const next = myGroupIds.filter((id) => id !== groupId)[0];
    if (next) setActiveGroupId(next);
  };

  const createGroup = ({ name, tag, todayGoal }) => {
    const id = `g-${idSeqRef.current++}`;
    const newGroup = {
      id,
      name,
      tag,
      icon: '✨',
      memberCount: 1,
      todayGoal,
      todayDone: 0,
      themeFrom: 'from-emerald-500',
      themeTo: 'to-cyan-500',
      members: [{ id: 'm-you', name: 'You', role: '组长', streak: 42, todayWords: 0 }]
    };
    setGroups((prev) => [newGroup, ...prev]);
    setFeedsByGroupId((prev) => ({ ...prev, [id]: [] }));
    setMyGroupIds((prev) => [id, ...prev]);
    setActiveGroupId(id);
    setCreateOpen(false);
    showToast('小组创建成功');
    setView('space');
    setTab('feed');
  };

  const addPost = (groupId, content) => {
    const text = content.trim();
    if (!text) return;
    const post = {
      id: `p-${idSeqRef.current++}`,
      user: { name: 'You', badge: '成员', emoji: '🧑‍💻' },
      createdAtMinute: clockMinute,
      content: text,
      likes: 0,
      comments: 0,
      likedByMe: false
    };
    setFeedsByGroupId((prev) => ({ ...prev, [groupId]: [post, ...(prev[groupId] || [])] }));
    showToast('已发布动态');
  };

  const toggleLike = (groupId, postId) => {
    setFeedsByGroupId((prev) => {
      const list = prev[groupId] || [];
      return {
        ...prev,
        [groupId]: list.map((p) => {
          if (p.id !== postId) return p;
          const liked = !p.likedByMe;
          return { ...p, likedByMe: liked, likes: Math.max(0, p.likes + (liked ? 1 : -1)) };
        })
      };
    });
  };

  const recordCheckin = (groupId, words) => {
    const n = Number(words);
    if (!Number.isFinite(n) || n <= 0) return;
    setGroups((prev) => prev.map((g) => (g.id === groupId ? { ...g, todayDone: Math.min(g.todayGoal, g.todayDone + n) } : g)));
    addPost(groupId, `我今天完成了 ${n} 个单词，继续冲！`);
    setCheckinOpen(false);
  };

  const internalBack = () => {
    if (view === 'space') {
      setView('list');
      return;
    }
    if (view === 'all') {
      setView('list');
      return;
    }
    onBack?.();
  };

  return (
    <div className="flex flex-col h-full bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-secondary-purple/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-primary/10 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2"></div>

      <Navbar
        title={view === 'space' ? activeGroup?.name || '小组空间' : '学习小组'}
        onBack={internalBack}
        className="bg-white/50 backdrop-blur-md"
        rightIcons={
          view === 'list' ? (
            <Motion.button 
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1 text-white text-xs font-bold bg-gradient-to-r from-primary to-primary-light px-3 py-1.5 rounded-full shadow-lg shadow-primary/30"
              onClick={() => setCreateOpen(true)}
            >
              <Plus size={14}/>
              创建小组
            </Motion.button>
          ) : null
        }
      />

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-2 pb-24 space-y-6 z-10">
        {view === 'list' && (
          <>
            {joinedGroups.length > 0 ? (
              <Motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`w-full bg-gradient-to-br ${activeGroup.themeFrom} ${activeGroup.themeTo} rounded-[26px] p-6 text-white shadow-lg shadow-primary/15 relative overflow-hidden`}
              >
                <div className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-full blur-2xl -mr-12 -mt-12"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full blur-2xl -ml-16 -mb-16"></div>

                <div className="flex items-start justify-between relative z-10">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-white/20 px-2 py-0.5 rounded-lg text-[10px] font-bold backdrop-blur-sm">{activeGroup.tag}</span>
                      <div className="flex items-center gap-1 text-xs text-white/90 font-medium">
                        <Users size={12}/>
                        <span>{activeGroup.memberCount}人</span>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-lg">{activeGroup.icon}</div>
                      <h3 className="text-2xl font-bold tracking-tight">{activeGroup.name}</h3>
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-white/15 backdrop-blur-md rounded-full flex items-center justify-center">
                    <Trophy size={20} className="text-yellow-200" />
                  </div>
                </div>

                <div className="mt-5 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 relative z-10">
                  <div className="flex justify-between items-center text-xs text-white/85 mb-2">
                    <span>今日全组目标</span>
                    <span className="font-bold">{activeGroup.todayGoal.toLocaleString()} 词</span>
                  </div>
                  <div className="w-full bg-black/20 h-2.5 rounded-full overflow-hidden">
                    <Motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, Math.round((activeGroup.todayDone / activeGroup.todayGoal) * 100))}%` }}
                      transition={{ delay: 0.2, duration: 0.8 }}
                      className="bg-white h-full rounded-full shadow-[0_0_10px_rgba(255,255,255,0.35)]"
                    />
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex -space-x-2">
                      {activeGroup.members.slice(0, 4).map((m) => (
                        <div key={m.id} className="w-7 h-7 rounded-full border border-white/25 bg-white/20 backdrop-blur-sm flex items-center justify-center text-[10px] font-bold">
                          {m.name.slice(0, 1).toUpperCase()}
                        </div>
                      ))}
                    </div>
                    <span className="text-xs font-bold">已完成 {activeGroup.todayDone.toLocaleString()} 词</span>
                  </div>
                </div>

                {joinedGroups.length > 1 && (
                  <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar relative z-10">
                    {joinedGroups.map((g) => (
                      <button
                        key={g.id}
                        onClick={() => setActiveGroupId(g.id)}
                        className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold border transition-colors ${g.id === activeGroupId ? 'bg-white text-gray-900 border-white/60' : 'bg-white/10 text-white border-white/15 hover:bg-white/15'}`}
                      >
                        {g.name}
                      </button>
                    ))}
                  </div>
                )}

                <div className="mt-4 grid grid-cols-2 gap-3 relative z-10">
                  <Motion.button 
                    whileTap={{ scale: 0.98 }}
                    className="py-3 bg-white text-primary font-bold rounded-2xl shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center gap-2"
                    onClick={() => goGroupSpace(activeGroup.id)}
                  >
                    进入小组空间 <ChevronRight size={16}/>
                  </Motion.button>
                  <Motion.button
                    whileTap={{ scale: 0.98 }}
                    className="py-3 bg-white/10 text-white font-bold rounded-2xl border border-white/15 hover:bg-white/15 transition-colors flex items-center justify-center gap-2"
                    onClick={() => setView('all')}
                  >
                    发现更多 <Search size={16}/>
                  </Motion.button>
                </div>
              </Motion.div>
            ) : (
              <div className="bg-white rounded-[24px] p-6 shadow-soft border border-white/60">
                <div className="text-sm font-bold text-text-main">还没有加入小组</div>
                <div className="text-xs text-text-muted mt-2 leading-relaxed">加入一个小组，和同伴一起打卡、互助复习、分享进展。</div>
                <button onClick={() => setView('all')} className="mt-4 w-full py-3 rounded-2xl bg-primary text-white font-bold">
                  去发现小组
                </button>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h4 className="text-sm font-bold text-text-main">推荐小组</h4>
                <button onClick={() => setView('all')} className="text-xs text-primary font-bold">
                  查看全部
                </button>
              </div>

              {recommendedGroups.slice(0, 3).map((g) => (
                <GroupCard
                  key={g.id}
                  group={g}
                  joined={false}
                  onPrimary={() => joinGroup(g.id)}
                  onOpen={() => goGroupSpace(g.id)}
                />
              ))}
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-bold text-text-main px-1">小组动态</h4>
              {mixedFeed.length === 0 ? (
                <div className="bg-white rounded-[20px] p-5 shadow-soft border border-white/50">
                  <div className="text-sm font-bold text-text-main">还没有动态</div>
                  <div className="text-xs text-text-muted mt-2">加入小组后，大家的打卡和分享会显示在这里。</div>
                </div>
              ) : (
                <div className="space-y-3">
                  {mixedFeed.map((p) => (
                    <FeedCard
                      key={p.id}
                      post={p}
                      subtitle={p.groupName}
                      onLike={() => toggleLike(p.groupId, p.id)}
                      timeLabel={formatTime(p.createdAtMinute)}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {view === 'all' && (
          <>
            <div className="bg-white rounded-[18px] border border-gray-100 h-11 flex items-center px-3 gap-2 shadow-soft">
              <Search size={16} className="text-text-muted"/>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="搜索小组名称 / 标签"
                className="flex-1 bg-transparent text-sm outline-none text-text-main placeholder:text-text-muted"
              />
              {search.trim() && (
                <button onClick={() => setSearch('')} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-50">
                  <X size={16} className="text-text-muted" />
                </button>
              )}
            </div>

            <div className="space-y-3">
              {allGroupsFiltered.map((g) => {
                const joined = myGroupIds.includes(g.id);
                return (
                  <GroupCard
                    key={g.id}
                    group={g}
                    joined={joined}
                    onPrimary={() => (joined ? goGroupSpace(g.id) : joinGroup(g.id))}
                    onOpen={() => goGroupSpace(g.id)}
                  />
                );
              })}
            </div>
          </>
        )}

        {view === 'space' && activeGroup && (
          <>
            <div className={`w-full bg-gradient-to-br ${activeGroup.themeFrom} ${activeGroup.themeTo} rounded-[26px] p-5 text-white shadow-lg shadow-primary/15 relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -mr-14 -mt-14"></div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center text-xl">{activeGroup.icon}</div>
                  <div>
                    <div className="text-[11px] font-bold text-white/85 flex items-center gap-2">
                      <span className="bg-white/20 px-2 py-0.5 rounded-lg">{activeGroup.tag}</span>
                      <span className="flex items-center gap-1"><Users size={12}/> {activeGroup.memberCount}</span>
                    </div>
                    <div className="text-lg font-extrabold mt-1">{activeGroup.name}</div>
                  </div>
                </div>
                <button
                  onClick={() => leaveGroup(activeGroup.id)}
                  className="w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center hover:bg-white/15 transition-colors"
                >
                  <LogOut size={18} className="text-white" />
                </button>
              </div>

              <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                <div className="flex items-center justify-between text-xs text-white/85">
                  <span className="flex items-center gap-1"><Target size={14}/> 今日目标</span>
                  <span className="font-bold">{activeGroup.todayGoal.toLocaleString()} 词</span>
                </div>
                <div className="mt-3 w-full bg-black/20 h-2.5 rounded-full overflow-hidden">
                  <Motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, Math.round((activeGroup.todayDone / activeGroup.todayGoal) * 100))}%` }}
                    transition={{ duration: 0.7 }}
                    className="bg-white h-full rounded-full shadow-[0_0_10px_rgba(255,255,255,0.35)]"
                  />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs font-bold">已完成 {activeGroup.todayDone.toLocaleString()} 词</span>
                  <Motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCheckinOpen(true)}
                    className="px-3 py-1.5 rounded-full bg-white text-primary text-xs font-extrabold shadow-lg"
                  >
                    记录打卡
                  </Motion.button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[22px] p-1.5 border border-white/70 shadow-soft flex">
              <TabBtn active={tab === 'feed'} onClick={() => setTab('feed')} label="动态" icon={MessageSquare} />
              <TabBtn active={tab === 'members'} onClick={() => setTab('members')} label="成员" icon={Users} />
              <TabBtn active={tab === 'goal'} onClick={() => setTab('goal')} label="目标" icon={Trophy} />
            </div>

            {tab === 'feed' && (
              <GroupFeed
                groupId={activeGroup.id}
                items={feedsByGroupId[activeGroup.id] || []}
                onPost={(text) => addPost(activeGroup.id, text)}
                onLike={(postId) => toggleLike(activeGroup.id, postId)}
                timeLabel={formatTime}
              />
            )}

            {tab === 'members' && (
              <div className="space-y-3">
                <div className="bg-white rounded-[20px] p-4 shadow-soft border border-white/60">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-bold text-text-main">成员</div>
                    <div className="text-xs text-text-muted font-bold">{activeGroup.members.length} 人</div>
                  </div>
                  <div className="mt-4 space-y-3">
                    {activeGroup.members.map((m) => (
                      <div key={m.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xs font-extrabold text-text-sub">
                            {m.name.slice(0, 1).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-text-main flex items-center gap-2">
                              {m.name}
                              {m.role !== '成员' && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-bold">{m.role}</span>
                              )}
                            </div>
                            <div className="text-[11px] text-text-muted mt-0.5">连续 {m.streak} 天 · 今日 {m.todayWords} 词</div>
                          </div>
                        </div>
                        <div className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">
                          +关注
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {tab === 'goal' && (
              <div className="space-y-3">
                <div className="bg-white rounded-[20px] p-4 shadow-soft border border-white/60">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-bold text-text-main">今日排行榜</div>
                    <div className="text-xs text-text-muted font-bold">按完成词数</div>
                  </div>
                  <div className="mt-4 space-y-3">
                    {[...activeGroup.members]
                      .sort((a, b) => b.todayWords - a.todayWords)
                      .map((m, idx) => (
                        <div key={m.id} className="flex items-center justify-between bg-gray-50 rounded-2xl px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold ${idx === 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-white text-text-sub border border-gray-100'}`}>
                              {idx + 1}
                            </div>
                            <div className="text-sm font-bold text-text-main">{m.name}</div>
                          </div>
                          <div className="text-sm font-extrabold text-primary">{m.todayWords} 词</div>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="bg-white rounded-[20px] p-4 shadow-soft border border-white/60">
                  <div className="flex items-center gap-2 text-sm font-bold text-text-main">
                    <Sparkles size={16} className="text-secondary-purple" />
                    一句话建议
                  </div>
                  <div className="text-xs text-text-muted mt-2 leading-relaxed">
                    把今天的目标拆成 3 次小打卡（例如 50/50/50），更容易坚持也更有反馈感。
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <AnimatePresence>
        {createOpen && (
          <ModalShell title="创建小组" onClose={() => setCreateOpen(false)}>
            <CreateGroupForm onSubmit={createGroup} onCancel={() => setCreateOpen(false)} />
          </ModalShell>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {checkinOpen && activeGroup && (
          <ModalShell title="记录打卡" onClose={() => setCheckinOpen(false)}>
            <CheckinForm onSubmit={(n) => recordCheckin(activeGroup.id, n)} onCancel={() => setCheckinOpen(false)} />
          </ModalShell>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <Motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[80] px-4 py-2 rounded-full bg-black/70 text-white text-xs font-bold shadow-lg"
          >
            {toast}
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const GroupCard = ({ group, joined, onPrimary, onOpen }) => {
  const progress = Math.min(100, Math.round((group.todayDone / group.todayGoal) * 100));
  return (
    <Motion.div 
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-[20px] p-4 shadow-soft border border-white/60"
    >
      <button onClick={onOpen} className="w-full flex items-center justify-between text-left">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-[16px] flex items-center justify-center text-2xl shadow-sm bg-gray-50`}>
            {group.icon}
          </div>
          <div>
            <div className="font-bold text-text-main text-sm">{group.name}</div>
            <div className="flex items-center gap-3 text-xs text-text-muted mt-1">
              <span className="flex items-center gap-1"><Users size={10}/> {group.memberCount}</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span className="font-bold">{group.tag}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-text-muted font-bold">{progress}%</div>
          <div className="w-16 bg-gray-100 h-1.5 rounded-full overflow-hidden mt-1">
            <div className="bg-primary h-full" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </button>

      <div className="mt-3 flex items-center justify-between">
        <div className="text-[11px] text-text-muted font-medium">
          今日 {group.todayDone.toLocaleString()} / {group.todayGoal.toLocaleString()}
        </div>
        <button
          onClick={onPrimary}
          className={`h-9 px-3 rounded-full text-xs font-extrabold transition-colors ${joined ? 'bg-primary text-white' : 'bg-primary/10 text-primary hover:bg-primary/15'}`}
        >
          {joined ? '进入' : '加入'}
        </button>
      </div>
    </Motion.div>
  );
};

const FeedCard = ({ post, subtitle, onLike, timeLabel }) => (
  <div className="bg-white rounded-[20px] p-4 shadow-soft border border-white/60">
    <div className="flex gap-3">
      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg shadow-inner">
        {post.user.emoji}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-text-main">{post.user.name}</span>
          {post.user.badge && (
            <span className="text-[10px] px-1.5 py-0.5 bg-secondary-green/10 text-secondary-green rounded font-bold">{post.user.badge}</span>
          )}
          {subtitle && (
            <span className="text-[10px] px-1.5 py-0.5 bg-primary/10 text-primary rounded font-bold">{subtitle}</span>
          )}
          <span className="ml-auto text-[10px] text-text-muted font-bold">{timeLabel}</span>
        </div>
        <div className="mt-3 bg-gray-50 rounded-xl p-3 text-sm text-text-sub leading-relaxed font-medium">
          {post.content}
        </div>
        <div className="mt-3 flex items-center gap-5">
          <button onClick={onLike} className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${post.likedByMe ? 'text-primary' : 'text-text-muted hover:text-text-main'}`}>
            {React.createElement(ThumbsUp, { size: 16, className: post.likedByMe ? 'fill-primary' : '' })}
            {post.likes}
          </button>
          <div className="flex items-center gap-1.5 text-xs font-bold text-text-muted">
            <MessageSquare size={16} />
            {post.comments}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const TabBtn = ({ active, onClick, label, icon }) => (
  <button
    onClick={onClick}
    className={`flex-1 h-10 rounded-[18px] flex items-center justify-center gap-2 text-xs font-extrabold transition-colors ${active ? 'bg-primary text-white shadow-[0_10px_24px_rgba(46,134,171,0.22)]' : 'text-text-sub hover:bg-gray-50'}`}
  >
    {React.createElement(icon, { size: 16 })}
    {label}
  </button>
);

const GroupFeed = ({ items, onPost, onLike, timeLabel }) => {
  const [text, setText] = useState('');
  return (
    <div className="space-y-3">
      <div className="bg-white rounded-[20px] p-4 shadow-soft border border-white/60">
        <div className="text-sm font-bold text-text-main">发一条动态</div>
        <div className="mt-3 flex items-end gap-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="分享今天的学习进展/方法/心得…"
            className="flex-1 min-h-[44px] max-h-[120px] bg-gray-50 border border-gray-100 rounded-2xl px-3 py-2 text-sm outline-none text-text-main placeholder:text-text-muted resize-none"
          />
          <button
            onClick={() => {
              onPost(text);
              setText('');
            }}
            className="w-11 h-11 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/25"
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-[20px] p-5 shadow-soft border border-white/60">
          <div className="text-sm font-bold text-text-main">还没有动态</div>
          <div className="text-xs text-text-muted mt-2">发布第一条动态，带动小组氛围。</div>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((p) => (
            <FeedCard key={p.id} post={p} onLike={() => onLike(p.id)} timeLabel={timeLabel(p.createdAtMinute)} />
          ))}
        </div>
      )}
    </div>
  );
};

const ModalShell = ({ title, onClose, children }) => (
  <Motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="absolute inset-0 z-[90] flex items-end justify-center"
  >
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

const CreateGroupForm = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [tag, setTag] = useState('打卡');
  const [goal, setGoal] = useState('150');
  const canSubmit = name.trim().length >= 2 && Number(goal) > 0;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="text-xs font-bold text-text-muted">小组名称</div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="例如：考研英语长难句"
          className="w-full h-11 px-3 rounded-2xl bg-gray-50 border border-gray-100 text-sm outline-none text-text-main placeholder:text-text-muted"
        />
      </div>

      <div className="space-y-2">
        <div className="text-xs font-bold text-text-muted">标签</div>
        <div className="flex gap-2 flex-wrap">
          {['打卡', '互助', '场景词汇', '背诵计划', '真题'].map((t) => (
            <button
              key={t}
              onClick={() => setTag(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-extrabold border transition-colors ${tag === t ? 'bg-primary text-white border-primary' : 'bg-white text-text-sub border-gray-100 hover:bg-gray-50'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-xs font-bold text-text-muted">今日目标（词）</div>
        <div className="flex items-center gap-2">
          <input
            value={goal}
            onChange={(e) => setGoal(e.target.value.replace(/[^\d]/g, ''))}
            className="flex-1 h-11 px-3 rounded-2xl bg-gray-50 border border-gray-100 text-sm outline-none text-text-main"
            inputMode="numeric"
          />
          <button onClick={() => setGoal('150')} className="h-11 px-4 rounded-2xl bg-primary/10 text-primary text-xs font-extrabold">
            推荐
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2">
        <button onClick={onCancel} className="h-11 rounded-2xl bg-gray-100 text-text-main text-sm font-extrabold">
          取消
        </button>
        <button
          disabled={!canSubmit}
          onClick={() => onSubmit({ name: name.trim(), tag, todayGoal: Number(goal) })}
          className={`h-11 rounded-2xl text-sm font-extrabold ${canSubmit ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'}`}
        >
          创建并加入
        </button>
      </div>
    </div>
  );
};

const CheckinForm = ({ onSubmit, onCancel }) => {
  const [words, setWords] = useState('50');
  const n = Number(words);
  const canSubmit = Number.isFinite(n) && n > 0;

  return (
    <div className="space-y-4">
      <div className="text-xs font-bold text-text-muted">我今天完成了（词）</div>
      <input
        value={words}
        onChange={(e) => setWords(e.target.value.replace(/[^\d]/g, ''))}
        className="w-full h-12 px-4 rounded-2xl bg-gray-50 border border-gray-100 text-base font-extrabold outline-none text-text-main"
        inputMode="numeric"
      />
      <div className="flex gap-2 flex-wrap">
        {[10, 30, 50, 80, 120].map((v) => (
          <button key={v} onClick={() => setWords(String(v))} className="px-3 py-2 rounded-2xl bg-primary/10 text-primary text-xs font-extrabold">
            +{v}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 pt-2">
        <button onClick={onCancel} className="h-11 rounded-2xl bg-gray-100 text-text-main text-sm font-extrabold">
          取消
        </button>
        <button
          disabled={!canSubmit}
          onClick={() => onSubmit(n)}
          className={`h-11 rounded-2xl text-sm font-extrabold ${canSubmit ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'}`}
        >
          提交
        </button>
      </div>
    </div>
  );
};

export default StudyGroup;
