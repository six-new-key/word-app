const { toggleMode } = require('../../utils/theme.js');

Component({
  options: {
    multipleSlots: true,
  },
  properties: {
    payload: {
      type: Object,
      value: null,
    },
  },
  data: {
    goalProgress: 65,
    goalNew: 20,
    goalReview: 30,
    trendData: [40, 60, 30, 80, 50, 90, 70],
  },
  methods: {
    _emitNavigate(url) {
      this.triggerEvent('navigate', { url });
    },
    _emitTabChange(tab) {
      this.triggerEvent('tabchange', { tab });
    },
    onThemeClick() {
      toggleMode();
      this.triggerEvent('themechange');
    },
    onSettingsClick() {
      this._emitNavigate('/pages/settings/settings');
    },
    onGoalCardTap() {
      this._emitTabChange('learning');
    },
    onShortcutTap(e) {
      const url = e.currentTarget.dataset.url;
      if (!url) return;
      if (url.startsWith('tab:')) {
        this._emitTabChange(url.slice(4));
      } else {
        this._emitNavigate(url);
      }
    },
    onReportTap() {
      this._emitNavigate('/pages/statistics/statistics');
    },
  },
});
