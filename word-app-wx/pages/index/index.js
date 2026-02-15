const { getResolvedTheme, applyNavigationBarTheme } = require('../../utils/theme.js');

Page({
  data: {
    currentTab: 'home',
    tabPayload: null,
    theme: 'light',
    tabList: [
      { id: 'home', label: '首页', iconPath: '/assets/icons/home.png', selectedIconPath: '/assets/icons/home-active.png' },
      { id: 'learning', label: '学习', iconPath: '/assets/icons/learn.png', selectedIconPath: '/assets/icons/learn-active.png',badge: 3},
      { id: 'vocabulary', label: '词库', iconPath: '/assets/icons/wordBase.png', selectedIconPath: '/assets/icons/wordBase-active.png' },
      { id: 'mine', label: '我的', iconPath: '/assets/icons/about.png', selectedIconPath: '/assets/icons/about-active.png',badge: 1000 },
    ]
  },

  onTabChange(e) {
    const tab = e.detail.tab;
    this.setData({ currentTab: tab });
  },

  onNavigate(e) {
    const url = e.detail && e.detail.url;
    if (!url) return;
    if (url.startsWith('tab:')) {
      this.setData({ currentTab: url.slice(4) });
    } else {
      wx.navigateTo({ url });
    }
  },

  _refreshTheme() {
    const resolved = getResolvedTheme();
    if (this.data.theme !== resolved) {
      this.setData({ theme: resolved });
    }
    this._applyNavBarTheme(resolved);
  },

  _applyNavBarTheme(theme) {
    applyNavigationBarTheme(theme);
  },

  onThemeChange() {
    this._refreshTheme();
  },

  onLoad() {
    const theme = getResolvedTheme();
    this.setData({ theme });
    this._applyNavBarTheme(theme);
  },
  onShow() {
    this._refreshTheme();
  },
  onReady() {},
  onHide() {},
  onUnload() {},
  onPullDownRefresh() {},
  onReachBottom() {},
  onShareAppMessage() {},
});
