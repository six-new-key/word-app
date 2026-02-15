const { getResolvedTheme } = require('../../utils/theme.js');

const STORAGE_KEY = 'word-app-notifications-v1';

function readPrefs() {
  try {
    const raw = wx.getStorageSync(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

Page({
  data: {
    theme: 'light',
    prefs: {
      dailyReminder: true,
      friendMessages: true,
      groupUpdates: true,
      systemUpdates: false,
      quietHours: false,
      quietFrom: '22:30',
      quietTo: '08:00'
    }
  },

  onLoad() {
    const saved = readPrefs();
    const prefs = saved || this.data.prefs;
    this.setData({ prefs, theme: getResolvedTheme() });
  },

  onShow() {
    this.setData({ theme: getResolvedTheme() });
  },

  onBack() {
    wx.navigateBack();
  },

  _save() {
    wx.setStorageSync(STORAGE_KEY, JSON.stringify(this.data.prefs));
  },

  onDailyReminder(e) {
    const prefs = { ...this.data.prefs, dailyReminder: e.detail.value };
    this.setData({ prefs });
    this._save();
  },
  onFriendMessages(e) {
    const prefs = { ...this.data.prefs, friendMessages: e.detail.value };
    this.setData({ prefs });
    this._save();
  },
  onGroupUpdates(e) {
    const prefs = { ...this.data.prefs, groupUpdates: e.detail.value };
    this.setData({ prefs });
    this._save();
  },
  onSystemUpdates(e) {
    const prefs = { ...this.data.prefs, systemUpdates: e.detail.value };
    this.setData({ prefs });
    this._save();
  },
  onQuietHours(e) {
    const prefs = { ...this.data.prefs, quietHours: e.detail.value };
    this.setData({ prefs });
    this._save();
  },
  onQuietFromChange(e) {
    const prefs = { ...this.data.prefs, quietFrom: e.detail.value };
    this.setData({ prefs });
    this._save();
  },
  onQuietToChange(e) {
    const prefs = { ...this.data.prefs, quietTo: e.detail.value };
    this.setData({ prefs });
    this._save();
  }
});
