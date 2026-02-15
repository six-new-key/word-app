const { getResolvedTheme } = require('../../utils/theme.js');

Page({
  data: {
    title: '学习统计',
    theme: 'light',
    trendData: [30, 50, 45, 80, 60, 90, 75],
  },
  onLoad() {},
  onShow() {
    this.setData({ theme: getResolvedTheme() });
  },
  onBack() { wx.navigateBack(); },
});
