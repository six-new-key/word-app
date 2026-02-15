const CARDS = [
  { id: 1, word: 'epiphany', phonetic: '/ɪˈpɪf.ən.i/', type: 'n.', mean: '顿悟；突然的灵感', en: 'A moment of sudden revelation or insight.', roots: 'epi (在...上) + phan (出现) → 显现', sentences: ['He had an epiphany about his career direction.'], synonyms: ['revelation', 'insight'] },
  { id: 2, word: 'serendipity', phonetic: '/ˌser.ənˈdɪp.ə.ti/', type: 'n.', mean: '意外发现珍宝的运气', en: 'The occurrence of events by chance in a happy way.', roots: 'coined by Horace Walpole (1754)', sentences: ['It was pure serendipity that we met.'], synonyms: ['chance', 'luck'] },
  { id: 3, word: 'petrichor', phonetic: '/ˈpet.rɪ.kɔːr/', type: 'n.', mean: '雨后泥土的芬芳', en: 'A pleasant smell that frequently accompanies the first rain.', roots: 'petra (石) + ichor (神血)', sentences: ['I love the smell of petrichor in the morning.'], synonyms: ['earthy smell'] },
  { id: 4, word: 'limerence', phonetic: '/ˈlɪm.ər.əns/', type: 'n.', mean: '迷恋', en: 'The state of being infatuated or obsessed with another person.', roots: 'arbitrary coinage by Dorothy Tennov', sentences: ['His feelings for her were more than just limerence.'], synonyms: ['infatuation', 'crush'] },
  { id: 5, word: 'sonder', phonetic: '/ˈsɒn.də/', type: 'n.', mean: '过客感', en: 'The realization that each random passerby is living a life as vivid as your own.', roots: 'from Dictionary of Obscure Sorrows', sentences: ['Standing in the crowd, he felt a deep sense of sonder.'], synonyms: ['realization'] },
];

Component({
  properties: {
    payload: { type: Object, value: null },
    theme: { type: String, value: 'light' },
  },
  lifetimes: {
    attached() {
      this._updateProgress();
    },
  },
  data: {
    cards: [...CARDS],
    history: [],
    bookmarks: {},
    current: 0,
    total: CARDS.length,
    doneCount: 0,
    progress: 0,
  },
  methods: {
    _updateProgress() {
      const { cards } = this.data;
      const total = CARDS.length;
      const len = cards && cards.length || 0;
      const done = total - len;
      const p = total > 0 ? Math.round((done / total) * 100) : 0;
      this.setData({ progress: p, doneCount: done });
    },
    _emitNavigate(url) {
      this.triggerEvent('navigate', { url });
    },
    _emitTabChange(tab) {
      this.triggerEvent('tabchange', { tab });
    },
    onSettings() {
      this._emitNavigate('/pages/settings/settings');
    },
    onUndo() {
      const { history, cards } = this.data;
      if (history.length === 0) return;
      const last = history[history.length - 1];
      this.setData({
        history: history.slice(0, -1),
        cards: [last, ...(cards || [])],
      }, () => this._updateProgress());
    },
    onBookmark() {
      const card = this.data.cards[0];
      if (!card) return;
      const { bookmarks } = this.data;
      const next = { ...bookmarks, [card.id]: !bookmarks[card.id] };
      this.setData({ bookmarks: next });
    },
    onKnow() {
      const { cards, history } = this.data;
      if (!cards || cards.length === 0) return;
      const [curr, ...rest] = cards;
      this.setData({
        cards: rest,
        history: [...history, curr],
      }, () => this._updateProgress());
    },
    onBackHome() {
      this._emitTabChange('home');
    },
  },
});
