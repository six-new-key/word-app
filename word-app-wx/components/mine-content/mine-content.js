const { toggleMode } = require('../../utils/theme.js');

const QUICK_ITEMS = [
  { key: 'study-group', title: '学习小组', sub: '冲刺 · 排行 · 打卡', icon: 'user' },
  { key: 'friends', title: '好友列表', sub: '消息 · 互助 · 聊天', icon: 'chat' },
  { key: 'study-plan', title: '学习计划', sub: '目标 · 习惯 · 提醒', icon: 'books' },
  { key: 'ai-chat', title: 'AI 个性化', sub: '对话 · 陪练 · 建议', icon: 'chat' },
  { key: 'vocabulary', title: '词库管理', sub: '导入 · 编辑 · 分类', icon: 'books' },
  { key: 'notifications', title: '消息通知', sub: '提醒 · 频道 · 免打扰', icon: 'notification' },
  { key: 'help-feedback', title: '帮助与反馈', sub: 'FAQ · 反馈 · 联系', icon: 'help-circle' },
];

Component({
  properties: {
    payload: { type: Object, value: null },
    theme: { type: String, value: 'light' },
  },
  data: {
    isDark: false,
    profile: {
      name: '学习用户',
      level: 5,
      isVip: true,
      streakDays: 42,
      masteredTotal: 1204,
      masteryRate: 42,
      bio: '今天也要坚持打卡',
    },
    quickItems: QUICK_ITEMS,
  },
  lifetimes: {
    attached() {
      this.setData({ isDark: this.properties.theme === 'dark' });
    },
  },
  observers: {
    'theme': function (v) {
      this.setData({ isDark: v === 'dark' });
    },
  },
  methods: {
    _emitNavigate(url) {
      this.triggerEvent('navigate', { url });
    },
    _emitTabChange(tab) {
      this.triggerEvent('tabchange', { tab });
    },
    onToggleTheme() {
      toggleMode();
      this.triggerEvent('themechange');
    },
    onSettings() {
      this._emitNavigate('/pages/settings/settings');
    },
    onQuickTap(e) {
      const key = e.currentTarget.dataset.key;
      if (key === 'vocabulary') {
        this._emitTabChange('vocabulary');
        return;
      }
      if (key === 'ai-chat') {
        this._emitNavigate('/pages/ai-chat/ai-chat');
        return;
      }
      const urlMap = {
        'study-group': '/pages/study-group/study-group',
        'friends': '/pages/friends/friends',
        'study-plan': '/pages/study-plan/study-plan',
        'notifications': '/pages/notifications/notifications',
        'help-feedback': '/pages/help-feedback/help-feedback',
      };
      const url = urlMap[key];
      if (url) this._emitNavigate(url);
    },
  },
});
