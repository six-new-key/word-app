/**
 * Tabbar 可配置底部导航组件
 *
 * 传值启用功能：
 * - list: 自定义 tab 列表，不传则用默认
 * - theme: 'light'|'dark'|'auto' 深色模式
 * - hoverFeedback: 是否启用点击反馈
 * - sidePadding: 左右边距 rpx
 * - iconFallback: 图标加载失败时的兜底路径
 * - badgeMax: 角标最大显示数字，超出显示 badgeMax+
 * - list[].badge: number 显示数字角标，true 显示红点
 * - list[].disabled: 是否禁用
 */

const DEFAULT_LIST = [
  { id: 'home', label: '首页', iconPath: '/assets/icons/home.png', selectedIconPath: '/assets/icons/home-active.png' },
  { id: 'learning', label: '学习', iconPath: '/assets/icons/learn.png', selectedIconPath: '/assets/icons/learn-active.png' },
  { id: 'vocabulary', label: '词库', iconPath: '/assets/icons/wordBase.png', selectedIconPath: '/assets/icons/wordBase-active.png' },
  { id: 'mine', label: '我的', iconPath: '/assets/icons/about.png', selectedIconPath: '/assets/icons/about-active.png' },
];

Component({
  options: {
    styleIsolation: 'shared',
  },

  properties: {
    /** 当前选中的 tab id */
    activeTab: {
      type: String,
      value: 'home',
    },
    /** tab 列表，不传则用默认；每项支持 id, label, iconPath, selectedIconPath, badge, disabled */
    list: {
      type: Array,
      value: [],
    },
    /** 主题：light 浅色 | dark 深色 | auto 跟随系统 */
    theme: {
      type: String,
      value: 'auto',
    },
    /** 是否启用点击/按压反馈 */
    hoverFeedback: {
      type: Boolean,
      value: true,
    },
    /** 左右边距 rpx */
    sidePadding: {
      type: Number,
      value: 24,
    },
    /** 图标加载失败时的兜底路径 */
    iconFallback: {
      type: String,
      value: '',
    },
    /** 角标数字最大值，超出显示 99+ */
    badgeMax: {
      type: Number,
      value: 99,
    },
  },

  data: {
    displayList: [],
    isDark: false,
    failedIconIndices: [], // [false,true,...] 加载失败的图标索引
  },

  lifetimes: {
    attached() {
      this._syncList();
      this._syncTheme();
    },
  },

  observers: {
    'list, list.length, badgeMax': function () {
      this._syncList();
    },
    theme: function () {
      this._syncTheme();
    },
  },

  methods: {
    _syncList() {
      const list = this.properties.list;
      const raw = (list && list.length) ? list : DEFAULT_LIST;
      const badgeMax = this.properties.badgeMax;
      const displayList = raw.map((item) => {
        let badgeText = '';
        if (item.badge === true) badgeText = 'dot';
        else if (typeof item.badge === 'number' && item.badge > 0) {
          badgeText = item.badge > badgeMax ? `${badgeMax}+` : String(item.badge);
        }
        const selectedIconPath = item.selectedIconPath || item.iconPath;
        return { ...item, selectedIconPath, badgeText };
      });
      this.setData({ displayList });
    },

    _syncTheme() {
      const theme = this.properties.theme;
      let isDark = false;
      if (theme === 'dark') {
        isDark = true;
      } else if (theme === 'auto') {
        try {
          const sys = wx.getSystemInfoSync();
          isDark = sys.theme === 'dark';
        } catch {
          isDark = false;
        }
      }
      this.setData({ isDark });
    },

    onTabTap(e) {
      const tab = e.currentTarget.dataset.tab;
      if (!tab) return;
      const item = this.data.displayList.find((t) => t.id === tab);
      if (item && item.disabled) return;
      this.triggerEvent('tabchange', { tab });
    },

    onIconError(e) {
      const idx = e.currentTarget.dataset.index;
      const key = `failedIconIndices[${idx}]`;
      this.setData({ [key]: true });
    },
  },
});
