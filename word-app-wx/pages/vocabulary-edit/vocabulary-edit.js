const { getResolvedTheme } = require('../../utils/theme.js');

const MOCK_WORDS = {
  default: [
    { word: 'apple', mean: 'n. 苹果' },
    { word: 'banana', mean: 'n. 香蕉' },
    { word: 'cherry', mean: 'n. 樱桃' },
  ],
  'CET-4': [
    { word: 'abandon', mean: 'v. 放弃，遗弃' },
    { word: 'ability', mean: 'n. 能力，才干' },
    { word: 'abnormal', mean: 'adj. 反常的' },
    { word: 'aboard', mean: 'adv. 在船(车)上' },
    { word: 'absence', mean: 'n. 缺席，不在' },
  ],
  'TOEFL': [
    { word: 'abate', mean: 'v. 减轻，减少' },
    { word: 'aberrant', mean: 'adj. 异常的' },
    { word: 'abeyance', mean: 'n. 中止，搁置' },
  ],
  '雅思': [
    { word: 'academic', mean: 'adj. 学术的' },
    { word: 'accelerate', mean: 'v. 加速' },
    { word: 'access', mean: 'n. 进入；途径' },
  ],
};

function getWords(book) {
  const title = (book && book.title) || '';
  for (const k of Object.keys(MOCK_WORDS)) {
    if (title.includes(k)) return MOCK_WORDS[k];
  }
  return MOCK_WORDS.default;
}

Page({
  data: {
    title: '编辑词库',
    theme: 'light',
    book: { title: '我的自定义词库', category: '自定义', level: '中等' },
    words: MOCK_WORDS.default,
  },
  onLoad() {
    const book = wx.getStorageSync('selectedBook') || { title: '我的自定义词库', category: '自定义', level: '中等' };
    const words = getWords(book);
    this.setData({
      book: { title: book.title || '我的自定义词库', category: book.category || '自定义', level: book.level || '中等' },
      words,
    });
  },
  onShow() {
    this.setData({ theme: getResolvedTheme() });
  },
  onBack() { wx.navigateBack(); },
  onSave() {
    wx.showToast({ title: '已保存', icon: 'success' });
  },
});
