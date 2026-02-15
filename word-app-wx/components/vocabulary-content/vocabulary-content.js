const CATEGORIES = ['推荐词库', '自定义', '按目标', '按场景', '记忆状态', '四级', '六级', '考研', '雅思', '托福', 'GRE'];
const ALL_BOOKS = [
  { id: 'cet4', title: 'CET-4 核心词汇', count: '2450', tag: '必考', tagColor: 'accent', iconColor: 'accent', progress: 45, category: '推荐词库' },
  { id: 'toefl', title: 'TOEFL 高频词汇', count: '3100', tag: '进阶', tagColor: 'purple', iconColor: 'purple', progress: 12, category: '按目标' },
  { id: 'ielts', title: '雅思阅读 8000 词', count: '8000', tag: '挑战', tagColor: 'green', iconColor: 'green', progress: 0, category: '按目标' },
  { id: 'bec', title: '商务英语 BEC', count: '1500', tag: '职场', tagColor: 'primary', iconColor: 'primary', progress: 78, category: '按场景' },
];

Component({
  properties: {
    payload: { type: Object, value: null },
    theme: { type: String, value: 'light' },
  },
  data: {
    activeCategory: 0,
    categories: CATEGORIES,
    allBooks: ALL_BOOKS,
    searchValue: '',
    filteredBooks: [],
  },
  observers: {
    'activeCategory, allBooks': function () {
      const cat = CATEGORIES[this.data.activeCategory];
      const books = this.data.allBooks;
      const filtered = cat === '记忆状态' ? books.filter(b => b.progress > 0) : books.filter(b => b.category === cat);
      this.setData({ filteredBooks: filtered });
    },
  },
  lifetimes: {
    attached() {
      const cat = CATEGORIES[this.data.activeCategory];
      const books = this.data.allBooks;
      const filtered = cat === '记忆状态' ? books.filter(b => b.progress > 0) : books.filter(b => b.category === cat);
      this.setData({ filteredBooks: filtered });
    },
  },
  methods: {
    _emitNavigate(url) {
      this.triggerEvent('navigate', { url });
    },
    _emitTabChange(tab) {
      this.triggerEvent('tabchange', { tab });
    },
    onSearch(e) {
      const v = (e.detail && e.detail.value) || '';
      this.setData({ searchValue: v });
    },
    onCategoryTap(e) {
      const idx = e.currentTarget.dataset.index;
      this.setData({ activeCategory: Number(idx) });
    },
    onImport() {
      this._emitNavigate('/pages/vocabulary-import/vocabulary-import');
    },
    onLearningCard() {
      this._emitTabChange('learning');
    },
    onBookCard(e) {
      const id = e.currentTarget.dataset.id;
      const books = this.data.allBooks;
      const book = id ? books.find(b => b.id === id) : null;
      wx.setStorageSync('selectedBook', book || { title: '新词库', isNew: true });
      this._emitNavigate('/pages/vocabulary-edit/vocabulary-edit');
    },
    onCreateBook() {
      wx.setStorageSync('selectedBook', { title: '新词库', isNew: true });
      this._emitNavigate('/pages/vocabulary-edit/vocabulary-edit');
    },
  },
});
