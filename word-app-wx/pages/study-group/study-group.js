const { getResolvedTheme } = require('../../utils/theme.js');

const DEFAULT_GROUPS = [
  { id: 'g-ky', name: '考研冲刺打卡组', tag: 'VIP 小组', icon: '🏆', memberCount: 128, todayGoal: 15000, todayDone: 12450, members: [
    { id: 'm-1', name: 'Momo', role: '打卡达人', streak: 30, todayWords: 50 },
    { id: 'm-2', name: 'Leo', role: '学习委员', streak: 18, todayWords: 80 },
    { id: 'm-3', name: 'Nina', role: '氛围组', streak: 12, todayWords: 20 },
    { id: 'm-4', name: 'You', role: '成员', streak: 42, todayWords: 0 }
  ]},
  { id: 'g-ielts', name: '雅思7分互助', tag: '互助', icon: '🎓', memberCount: 56, todayGoal: 4000, todayDone: 2210, members: [
    { id: 'm-1', name: 'Alice', role: '组长', streak: 21, todayWords: 120 },
    { id: 'm-2', name: 'You', role: '成员', streak: 42, todayWords: 0 }
  ]},
  { id: 'g-morning', name: '早起背单词', tag: '每日打卡', icon: '⏰', memberCount: 342, todayGoal: 22000, todayDone: 10340, members: [
    { id: 'm-1', name: 'Ben', role: '组长', streak: 9, todayWords: 90 },
    { id: 'm-2', name: 'You', role: '成员', streak: 42, todayWords: 0 }
  ]},
  { id: 'g-tv', name: '美剧生肉啃噬', tag: '场景词汇', icon: '🎬', memberCount: 89, todayGoal: 6000, todayDone: 3860, members: [
    { id: 'm-1', name: 'Chris', role: '组长', streak: 14, todayWords: 60 },
    { id: 'm-2', name: 'You', role: '成员', streak: 42, todayWords: 0 }
  ]}
];

const DEFAULT_FEEDS = {
  'g-ky': [
    { id: 'p-1', user: { name: 'Momo', badge: '打卡达人', emoji: '👩‍🎓' }, content: '坚持就是胜利！今天的长难句有点难，但是背完感觉很有成就感，大家一起加油！', likes: 12, comments: 3, likedByMe: true, timeLabel: '刚刚' }
  ],
  'g-ielts': [],
  'g-morning': [],
  'g-tv': []
};

let idSeq = 1;

Page({
  data: {
    theme: 'light',
    view: 'list',
    tab: 'feed',
    search: '',
    groups: DEFAULT_GROUPS,
    myGroupIds: ['g-ky'],
    activeGroupId: 'g-ky',
    activeGroup: DEFAULT_GROUPS[0],
    joinedGroups: [],
    recommendedGroups: [],
    allGroupsFiltered: [],
    mixedFeed: [],
    activeFeed: [],
    feedsByGroupId: DEFAULT_FEEDS,
    createOpen: false,
    createName: '',
    createTag: '打卡',
    createGoal: '150',
    checkinOpen: false,
    checkinWords: '50',
    postText: '',
    toast: ''
  },

  onLoad() {
    this.setData({ theme: getResolvedTheme() });
    this._setComputed();
  },

  onShow() {
    this.setData({ theme: getResolvedTheme() });
  },

  onBack() {
    if (this.data.view === 'space') {
      this.setData({ view: 'list' });
      return;
    }
    if (this.data.view === 'all') {
      this.setData({ view: 'list' });
      return;
    }
    wx.navigateBack();
  },

  _setComputed() {
    const { groups, myGroupIds, activeGroupId, search } = this.data;
    const joinedGroups = groups.filter((g) => myGroupIds.includes(g.id));
    const recommendedGroups = groups.filter((g) => !myGroupIds.includes(g.id));
    const activeGroup = groups.find((g) => g.id === activeGroupId) || groups[0];
    const key = (search || '').trim().toLowerCase();
    const allGroupsFiltered = key ? groups.filter((g) => g.name.toLowerCase().includes(key) || g.tag.toLowerCase().includes(key)) : groups;
    const mixedFeed = joinedGroups.flatMap((g) => {
      const feed = this.data.feedsByGroupId[g.id] || [];
      return feed.map((p) => ({ ...p, groupId: g.id, groupName: g.name }));
    }).sort((a, b) => (b.id || '').localeCompare(a.id || '')).slice(0, 8);
    const activeFeed = (this.data.feedsByGroupId[activeGroupId] || []);
    this.setData({
      joinedGroups,
      recommendedGroups,
      activeGroup,
      allGroupsFiltered,
      mixedFeed,
      activeFeed
    });
  },

  onNavCreate() {
    this.setData({ createOpen: true, createName: '', createTag: '打卡', createGoal: '150' });
  },

  onCloseCreate() {
    this.setData({ createOpen: false });
  },

  onCreateNameInput(e) {
    this.setData({ createName: e.detail.value });
  },
  onCreateTagTap(e) {
    this.setData({ createTag: e.currentTarget.dataset.tag });
  },
  onCreateGoalInput(e) {
    this.setData({ createGoal: e.detail.value.replace(/\D/g, '') });
  },
  onGoalRecommend() {
    this.setData({ createGoal: '150' });
  },

  onCreateConfirm() {
    const name = (this.data.createName || '').trim();
    const goal = parseInt(this.data.createGoal, 10) || 150;
    if (name.length < 2) {
      this.setData({ toast: '小组名称至少 2 个字' });
      setTimeout(() => this.setData({ toast: '' }), 1600);
      return;
    }
    const id = 'g-' + idSeq++;
    const newGroup = {
      id,
      name,
      tag: this.data.createTag,
      icon: '✨',
      memberCount: 1,
      todayGoal: goal,
      todayDone: 0,
      members: [{ id: 'm-you', name: 'You', role: '组长', streak: 42, todayWords: 0 }]
    };
    const groups = [newGroup, ...this.data.groups];
    const feedsByGroupId = { ...this.data.feedsByGroupId, [id]: [] };
    const myGroupIds = [id, ...this.data.myGroupIds];
    this.setData({
      groups,
      feedsByGroupId,
      myGroupIds,
      activeGroupId: id,
      createOpen: false,
      view: 'space',
      tab: 'feed',
      toast: '小组创建成功'
    });
    this._setComputed();
    setTimeout(() => this.setData({ toast: '' }), 1600);
  },

  onSearchInput(e) {
    this.setData({ search: e.detail.value });
    this._setComputed();
  },

  onClearSearch() {
    this.setData({ search: '' });
    this._setComputed();
  },

  onSetActiveGroup(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({ activeGroupId: id });
    this._setComputed();
  },

  goGroupSpace(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({ activeGroupId: id, view: 'space', tab: 'feed' });
    this._setComputed();
  },

  goDiscover() {
    this.setData({ view: 'all' });
    this._setComputed();
  },

  joinGroup(e) {
    const id = e.currentTarget.dataset.id;
    if (this.data.myGroupIds.includes(id)) {
      this.goGroupSpace({ currentTarget: { dataset: { id } } });
      return;
    }
    const myGroupIds = [id, ...this.data.myGroupIds];
    this.setData({ myGroupIds, activeGroupId: id, toast: '已加入小组' });
    this._setComputed();
    setTimeout(() => this.setData({ toast: '' }), 1600);
  },

  leaveGroup() {
    const id = this.data.activeGroupId;
    const myGroupIds = this.data.myGroupIds.filter((x) => x !== id);
    const nextId = myGroupIds[0];
    this.setData({ myGroupIds, activeGroupId: nextId || (this.data.groups[0] && this.data.groups[0].id), view: 'list' });
    this._setComputed();
    this.setData({ toast: '已退出小组' });
    setTimeout(() => this.setData({ toast: '' }), 1600);
  },

  setTab(e) {
    this.setData({ tab: e.currentTarget.dataset.tab });
  },

  onPostInput(e) {
    this.setData({ postText: e.detail.value });
  },

  onPublishPost() {
    const text = (this.data.postText || '').trim();
    const groupId = this.data.activeGroupId;
    if (!text || !groupId) return;
    const post = {
      id: 'p-' + idSeq++,
      user: { name: 'You', badge: '成员', emoji: '🧑‍💻' },
      content: text,
      likes: 0,
      comments: 0,
      likedByMe: false,
      timeLabel: '刚刚'
    };
    const list = [post, ...(this.data.feedsByGroupId[groupId] || [])];
    const feedsByGroupId = { ...this.data.feedsByGroupId, [groupId]: list };
    this.setData({ feedsByGroupId, postText: '', toast: '已发布动态' });
    this._setComputed();
    setTimeout(() => this.setData({ toast: '' }), 1600);
  },

  onLike(e) {
    const { groupId, postId } = e.currentTarget.dataset;
    const list = (this.data.feedsByGroupId[groupId] || []).map((p) => {
      if (p.id !== postId) return p;
      const liked = !p.likedByMe;
      return { ...p, likedByMe: liked, likes: Math.max(0, (p.likes || 0) + (liked ? 1 : -1)) };
    });
    this.setData({ feedsByGroupId: { ...this.data.feedsByGroupId, [groupId]: list } });
    this._setComputed();
  },

  onCheckinOpen() {
    this.setData({ checkinOpen: true, checkinWords: '50' });
  },

  onCheckinClose() {
    this.setData({ checkinOpen: false });
  },

  onCheckinWordsInput(e) {
    this.setData({ checkinWords: e.detail.value.replace(/\D/g, '') });
  },

  onCheckinQuick(e) {
    const add = parseInt(e.currentTarget.dataset.add, 10);
    const cur = parseInt(this.data.checkinWords, 10) || 0;
    this.setData({ checkinWords: String(cur + add) });
  },

  onCheckinSubmit() {
    const n = parseInt(this.data.checkinWords, 10);
    const groupId = this.data.activeGroupId;
    if (!groupId || !Number.isFinite(n) || n <= 0) return;
    const groups = this.data.groups.map((g) => {
      if (g.id !== groupId) return g;
      return { ...g, todayDone: Math.min(g.todayGoal, g.todayDone + n) };
    });
    const post = {
      id: 'p-' + idSeq++,
      user: { name: 'You', badge: '成员', emoji: '🧑‍💻' },
      content: `我今天完成了 ${n} 个单词，继续冲！`,
      likes: 0,
      comments: 0,
      likedByMe: false,
      timeLabel: '刚刚'
    };
    const list = [post, ...(this.data.feedsByGroupId[groupId] || [])];
    const feedsByGroupId = { ...this.data.feedsByGroupId, [groupId]: list };
    this.setData({ groups, feedsByGroupId, checkinOpen: false });
    this._setComputed();
    this.setData({ toast: '打卡成功' });
    setTimeout(() => this.setData({ toast: '' }), 1600);
  }
});
