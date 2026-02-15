/**
 * 主题配置
 * mode: light | dark | auto（auto 跟随系统）
 * scheme: 配色方案，当前支持 blue
 */
const STORAGE_KEY = 'app-theme';
const DEFAULT = { mode: 'light', scheme: 'blue' };
const SCHEMES = ['blue'];

module.exports = { STORAGE_KEY, DEFAULT, SCHEMES };
