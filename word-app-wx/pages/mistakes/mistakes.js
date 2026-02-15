const { getResolvedTheme } = require('../../utils/theme.js');

const MISTAKES = [
  { word: 'epiphany', mean: '顿悟；突然的灵感', count: 3 },
  { word: 'serendipity', mean: '意外发现珍奇事物的本领', count: 2 },
  { word: 'ethereal', mean: '超凡脱俗的；飘渺的', count: 2 },
  { word: 'mellifluous', mean: '声音甜美的；悦耳的', count: 1 },
  { word: 'ineffable', mean: '不可言喻的', count: 1 },
];

Page({
  data: {
    title: '错题本',
    theme: 'light',
    mistakes: MISTAKES,
    pendingCount: 12,
    masteredCount: 45,
  },
  onLoad() {},
  onShow() {
    this.setData({ theme: getResolvedTheme() });
  },
  onBack() { wx.navigateBack(); },
  onStartReview() {
    wx.showToast({ title: '开始复习', icon: 'none' });
  },
});
