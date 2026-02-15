const { getResolvedTheme } = require('../../utils/theme.js');

Page({
  data: {
    title: '拼写测试',
    theme: 'light',
    question: { mean: 'v. 遗弃；放弃；中止', options: ['abandon', 'ability', 'abnormal', 'aboard'] },
    selectedOption: null,
    progress: 30,
    current: 3,
    total: 10,
  },
  onLoad() {},
  onShow() {
    this.setData({ theme: getResolvedTheme() });
  },
  onBack() { wx.navigateBack(); },
  onOptionTap(e) {
    const idx = e.currentTarget.dataset.index;
    this.setData({ selectedOption: idx });
  },
  onSkip() {
    wx.showToast({ title: '已跳过', icon: 'none' });
  },
  onConfirm() {
    wx.showToast({ title: '已提交', icon: 'success' });
  },
});
