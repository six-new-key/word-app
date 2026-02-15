const { getResolvedTheme } = require('../../utils/theme.js');

Page({
  data: { title: '导入词库', theme: 'light' },
  onLoad() {},
  onShow() {
    this.setData({ theme: getResolvedTheme() });
  },
  onBack() { wx.navigateBack(); },
  onCamera() { wx.showToast({ title: '拍照导入开发中', icon: 'none' }); },
  onText() { wx.showToast({ title: '文本导入开发中', icon: 'none' }); },
  onLink() { wx.showToast({ title: '链接导入开发中', icon: 'none' }); },
  onHelp() { wx.showToast({ title: '查看帮助', icon: 'none' }); },
});
