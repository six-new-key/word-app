const { getResolvedTheme } = require('../../utils/theme.js');

Page({
  data: { title: '设置', theme: 'light' },
  onLoad() {},
  onShow() {
    this.setData({ theme: getResolvedTheme() });
  },
  onBack() { wx.navigateBack(); },
  onLogout() { wx.showToast({ title: '已退出', icon: 'success' }); },
});
