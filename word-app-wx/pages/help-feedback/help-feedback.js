const { getResolvedTheme } = require('../../utils/theme.js');

const STORAGE_KEY = 'word-app-helpFeedback-v1';

function readState() {
  try {
    const raw = wx.getStorageSync(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

const FAQ = [
  { key: 'q1', q: '学习计划怎么生效？', a: '进入“学习计划”设置目标与提醒，系统会按计划给你提示。' },
  { key: 'q2', q: '好友列表里为什么看不到消息？', a: '这是原型版本。你可以先在“消息通知”里开启好友消息提醒。' },
  { key: 'q3', q: '如何导入词库？', a: '进入“词库管理”，选择导入入口并按照引导操作。' }
];

Page({
  data: {
    theme: 'light',
    faq: FAQ,
    openFaq: 'q1',
    state: { feedback: '', email: '' },
    toast: ''
  },

  onLoad() {
    const saved = readState();
    const state = saved || this.data.state;
    this.setData({ state, theme: getResolvedTheme() });
  },

  onShow() {
    this.setData({ theme: getResolvedTheme() });
  },

  onBack() {
    wx.navigateBack();
  },

  onFaqTap(e) {
    const key = e.currentTarget.dataset.key;
    this.setData({ openFaq: this.data.openFaq === key ? '' : key });
  },

  onEmailInput(e) {
    const state = { ...this.data.state, email: e.detail.value };
    this.setData({ state });
    wx.setStorageSync(STORAGE_KEY, JSON.stringify(state));
  },

  onFeedbackInput(e) {
    const state = { ...this.data.state, feedback: e.detail.value };
    this.setData({ state });
    wx.setStorageSync(STORAGE_KEY, JSON.stringify(state));
  },

  onSubmit() {
    const text = (this.data.state.feedback || '').trim();
    if (!text) {
      this.setData({ toast: '请先写点内容' });
      setTimeout(() => this.setData({ toast: '' }), 1600);
      return;
    }
    const state = { ...this.data.state, feedback: '' };
    this.setData({ state, toast: '已提交，感谢反馈' });
    wx.setStorageSync(STORAGE_KEY, JSON.stringify(state));
    setTimeout(() => this.setData({ toast: '' }), 1600);
  }
});
