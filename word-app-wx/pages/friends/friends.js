const { getResolvedTheme } = require('../../utils/theme.js');

const DEFAULT_FRIENDS = [
  { id: 'f-1', name: 'LearningBot 小助', level: 10, progress: 1, isOnline: true, streak: 30 },
  { id: 'f-2', name: 'Alice 小艾', level: 3, progress: 0.45, isOnline: true, streak: 7 },
  { id: 'f-3', name: 'Ming 小明', level: 4, progress: 0.6, isOnline: false, streak: 12 },
  { id: 'f-4', name: 'Charlie 查理', level: 2, progress: 0.12, isOnline: false, streak: 3 },
  { id: 'f-5', name: 'David 大卫', level: 5, progress: 0.88, isOnline: true, streak: 18 },
  { id: 'f-6', name: 'Eva 小伊', level: 1, progress: 0, isOnline: false, streak: 0 }
];

const DEFAULT_MESSAGES = {
  'f-1': [
    { id: 'm-1', from: 'friend', text: '要不要来一轮互助复习？' },
    { id: 'm-2', from: 'me', text: '可以，给我出 10 个高频词。' }
  ],
  'f-2': [{ id: 'm-1', from: 'friend', text: '今天打卡了吗？' }]
};

let idSeq = 100;

Page({
  data: {
    theme: 'light',
    query: '',
    friends: DEFAULT_FRIENDS,
    messagesByFriendId: DEFAULT_MESSAGES,
    onlineCount: 0,
    onlineFriends: [],
    filteredFriends: [],
    addOpen: false,
    addName: '',
    sheetOpen: false,
    sheetMode: 'profile',
    activeFriendId: null,
    activeFriend: null,
    activeMessages: [],
    chatText: '',
    chatScrollId: '',
    toast: ''
  },

  onLoad() {
    this.setData({ theme: getResolvedTheme() });
    this._setDerived();
  },

  onShow() {
    this.setData({ theme: getResolvedTheme() });
  },

  onBack() {
    wx.navigateBack();
  },

  _setDerived() {
    const friends = this.data.friends;
    const onlineCount = friends.filter((f) => f.isOnline).length;
    const onlineFriends = friends.filter((f) => f.isOnline);
    const q = (this.data.query || '').trim().toLowerCase();
    const filteredFriends = q ? friends.filter((f) => f.name.toLowerCase().includes(q)) : friends;
    this.setData({ onlineCount, onlineFriends, filteredFriends });
  },

  onSearchInput(e) {
    this.setData({ query: e.detail.value });
    this._setDerived();
  },

  onClearSearch() {
    this.setData({ query: '' });
    this._setDerived();
  },

  onAddTap() {
    this.setData({ addOpen: true, addName: '' });
  },

  onCloseAdd() {
    this.setData({ addOpen: false });
  },

  onAddNameInput(e) {
    this.setData({ addName: e.detail.value });
  },

  onAddConfirm() {
    const name = (this.data.addName || '').trim();
    if (name.length < 2) {
      this.setData({ toast: '请输入至少 2 个字符' });
      setTimeout(() => this.setData({ toast: '' }), 1600);
      return;
    }
    const exists = this.data.friends.some((f) => f.name.toLowerCase() === name.toLowerCase());
    if (exists) {
      this.setData({ toast: '好友已存在' });
      setTimeout(() => this.setData({ toast: '' }), 1600);
      return;
    }
    const id = 'f-' + idSeq++;
    const friends = [{ id, name, level: 1, progress: 0, isOnline: true, streak: 0 }, ...this.data.friends];
    const messagesByFriendId = { ...this.data.messagesByFriendId, [id]: [] };
    this.setData({
      friends,
      messagesByFriendId,
      addOpen: false,
      addName: '',
      toast: '已添加好友',
      activeFriendId: id,
      activeFriend: { id, name, level: 1, progress: 0, isOnline: true, streak: 0 },
      sheetOpen: true,
      sheetMode: 'profile'
    });
    this._setDerived();
    setTimeout(() => this.setData({ toast: '' }), 1600);
  },

  onFriendTap(e) {
    const id = e.currentTarget.dataset.id;
    const friend = this.data.friends.find((f) => f.id === id);
    if (!friend) return;
    this.setData({
      activeFriendId: id,
      activeFriend: friend,
      sheetOpen: true,
      sheetMode: 'profile',
      activeMessages: this.data.messagesByFriendId[id] || []
    });
  },

  onCloseSheet() {
    this.setData({ sheetOpen: false, activeFriendId: null, activeFriend: null, chatText: '' });
  },

  onAssistTap(e) {
    const id = e.currentTarget ? e.currentTarget.dataset.id : this.data.activeFriendId;
    const friend = this.data.friends.find((f) => f.id === id);
    this.setData({ toast: friend ? `已向 ${friend.name} 发起互助` : '已发起互助' });
    setTimeout(() => this.setData({ toast: '' }), 1600);
  },

  onChatTap(e) {
    const id = e.currentTarget.dataset.id;
    const friend = this.data.friends.find((f) => f.id === id);
    if (!friend) return;
    this.setData({
      activeFriendId: id,
      activeFriend: friend,
      sheetOpen: true,
      sheetMode: 'chat',
      activeMessages: this.data.messagesByFriendId[id] || []
    });
  },

  onOpenChat() {
    this.setData({ sheetMode: 'chat', activeMessages: this.data.messagesByFriendId[this.data.activeFriendId] || [] });
  },

  onRemoveFriend() {
    const id = this.data.activeFriendId;
    const friends = this.data.friends.filter((f) => f.id !== id);
    const messagesByFriendId = { ...this.data.messagesByFriendId };
    delete messagesByFriendId[id];
    this.setData({
      friends,
      messagesByFriendId,
      sheetOpen: false,
      activeFriendId: null,
      activeFriend: null,
      toast: '已移除好友'
    });
    this._setDerived();
    setTimeout(() => this.setData({ toast: '' }), 1600);
  },

  onChatInput(e) {
    this.setData({ chatText: e.detail.value });
  },

  onSendMsg() {
    const text = (this.data.chatText || '').trim();
    const id = this.data.activeFriendId;
    if (!text || !id) return;
    const msgId = 'm-' + idSeq++;
    const list = [...(this.data.messagesByFriendId[id] || []), { id: msgId, from: 'me', text }];
    const messagesByFriendId = { ...this.data.messagesByFriendId, [id]: list };
    this.setData({
      messagesByFriendId,
      activeMessages: list,
      chatText: '',
      chatScrollId: 'msg-' + msgId
    });
  }
});
