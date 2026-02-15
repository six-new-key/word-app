/**
 * 主题工具：读写、切换、解析
 */
const { STORAGE_KEY, DEFAULT, SCHEMES } = require('../theme/config.js');
const blueScheme = require('../theme/schemes/blue.js');

const SCHEME_MAP = {
  blue: blueScheme,
};

/**
 * 获取当前主题配置
 */
export function getTheme() {
  try {
    const raw = wx.getStorageSync(STORAGE_KEY);
    if (raw && typeof raw === 'object') {
      return {
        mode: raw.mode || DEFAULT.mode,
        scheme: SCHEMES.includes(raw.scheme) ? raw.scheme : DEFAULT.scheme,
      };
    }
  } catch (_) {}
  return { ...DEFAULT };
}

/**
 * 保存主题配置
 */
export function setTheme({ mode, scheme }) {
  const next = getTheme();
  if (mode !== undefined) next.mode = mode;
  if (scheme !== undefined && SCHEMES.includes(scheme)) next.scheme = scheme;
  wx.setStorageSync(STORAGE_KEY, next);
  const app = getApp();
  if (app && app.globalData) {
    app.globalData.theme = next;
    app.globalData.themeResolved = getResolvedTheme(next);
  }
  return next;
}

/**
 * 解析得到实际亮/暗（mode=auto 时跟随系统）
 */
export function getResolvedTheme(config) {
  const cfg = config || getTheme();
  if (cfg.mode === 'auto') {
    try {
      const sys = wx.getSystemInfoSync();
      return sys.theme === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  }
  return cfg.mode;
}

/**
 * 切换亮/暗
 */
export function toggleMode() {
  const t = getTheme();
  const next = t.mode === 'dark' ? 'light' : 'dark';
  return setTheme({ mode: next });
}

/**
 * 设置配色方案
 */
export function setScheme(scheme) {
  return setTheme({ scheme });
}

/**
 * 获取当前配色方案的变量对象（用于生成 CSS）
 */
export function getSchemeVariables(config) {
  const cfg = config || getTheme();
  const scheme = SCHEME_MAP[cfg.scheme] || blueScheme;
  const resolved = getResolvedTheme(cfg);
  return scheme[resolved] || scheme.light;
}

/** 导航栏亮/暗色值（与 theme.json、theme/schemes/blue.js 一致） */
const NAV_LIGHT = { bg: '#f9f7f5', front: '#000000', textStyle: 'black' };
const NAV_DARK = { bg: '#1E1E1E', front: '#ffffff', textStyle: 'white' };

/**
 * 根据当前主题应用导航栏样式（用于使用原生导航栏的页面）
 * 解决 app 内手动切换主题时，原生导航栏不随 theme.json 变化的问题
 */
export function applyNavigationBarTheme(resolvedTheme) {
  const theme = resolvedTheme || getResolvedTheme();
  const nav = theme === 'dark' ? NAV_DARK : NAV_LIGHT;
  wx.setBackgroundColor({ backgroundColor: nav.bg });
  wx.setBackgroundTextStyle({ textStyle: nav.textStyle });
  wx.setNavigationBarColor({
    backgroundColor: nav.bg,
    frontColor: nav.front,
    animation: { duration: 200, timingFunc: 'easeOut' },
  });
}
