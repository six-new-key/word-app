const { getResolvedTheme } = require('../../utils/theme.js');

const STORAGE_KEY = 'word-app-studyPlan-v1';

function readPlan() {
  try {
    const raw = wx.getStorageSync(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function clampInt(value, min, max) {
  const n = parseInt(String(value || ''), 10);
  if (isNaN(n)) return min;
  return Math.max(min, Math.min(max, n));
}

Page({
  data: {
    theme: 'light',
    plan: {
      dailyNew: 30,
      dailyReview: 60,
      remindEnabled: true,
      remindTime: '20:00',
      days: [1, 2, 3, 4, 5, 6, 0]
    },
    dayLabels: [
      { label: '日', value: 0 },
      { label: '一', value: 1 },
      { label: '二', value: 2 },
      { label: '三', value: 3 },
      { label: '四', value: 4 },
      { label: '五', value: 5 },
      { label: '六', value: 6 }
    ],
    toast: ''
  },

  onLoad() {
    const saved = readPlan();
    const plan = saved || this.data.plan;
    this.setData({ plan, theme: getResolvedTheme() });
  },

  onShow() {
    this.setData({ theme: getResolvedTheme() });
  },

  onBack() {
    wx.navigateBack();
  },

  onDailyNewMinus() {
    const plan = this.data.plan;
    plan.dailyNew = clampInt(plan.dailyNew - 5, 5, 300);
    this.setData({ plan });
  },
  onDailyNewPlus() {
    const plan = this.data.plan;
    plan.dailyNew = clampInt(plan.dailyNew + 5, 5, 300);
    this.setData({ plan });
  },
  onDailyReviewMinus() {
    const plan = this.data.plan;
    plan.dailyReview = clampInt(plan.dailyReview - 10, 10, 800);
    this.setData({ plan });
  },
  onDailyReviewPlus() {
    const plan = this.data.plan;
    plan.dailyReview = clampInt(plan.dailyReview + 10, 10, 800);
    this.setData({ plan });
  },

  onToggleDay(e) {
    const day = parseInt(e.currentTarget.dataset.day, 10);
    const plan = this.data.plan;
    const idx = plan.days.indexOf(day);
    const days = idx >= 0 ? plan.days.filter((d) => d !== day) : [...plan.days, day].sort((a, b) => a - b);
    this.setData({ plan: { ...plan, days } });
  },

  onRemindSwitch(e) {
    const plan = this.data.plan;
    plan.remindEnabled = e.detail.value;
    this.setData({ plan });
  },

  onRemindTimeChange(e) {
    const plan = this.data.plan;
    plan.remindTime = e.detail.value;
    this.setData({ plan });
  },

  onSave() {
    const plan = this.data.plan;
    try {
      wx.setStorageSync(STORAGE_KEY, JSON.stringify(plan));
    } catch (_) {}
    this.setData({ toast: '保存成功' });
    setTimeout(() => this.setData({ toast: '' }), 1600);
  }
});
