// app.js
const { getTheme, getResolvedTheme } = require('./utils/theme.js');

App({
  onLaunch() {
    const theme = getTheme();
    const resolved = getResolvedTheme(theme);
    this.globalData.theme = theme;
    this.globalData.themeResolved = resolved;

    const logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);

    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    });
  },
  globalData: {
    userInfo: null,
    theme: null,
    themeResolved: 'light'
  }
});
