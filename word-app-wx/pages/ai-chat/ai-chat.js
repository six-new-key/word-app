const { getResolvedTheme } = require('../../utils/theme.js');

Page({
  data: {
    title: 'AI 学习助手',
    theme: 'light',
    messages: [
      { id: 1, type: 'ai', content: 'Hi！我是你的AI学习搭子。今天想聊点什么？我们可以一起练习口语，或者玩个单词游戏哦～' },
    ],
    inputValue: '',
  },
  onLoad() {},
  onShow() {
    this.setData({ theme: getResolvedTheme() });
  },
  onBack() { wx.navigateBack(); },
  onInput(e) {
    this.setData({ inputValue: e.detail.value || '' });
  },
  onSend() {
    const { inputValue, messages } = this.data;
    const text = (inputValue || '').trim();
    if (!text) return;
    const newMsg = { id: Date.now(), type: 'user', content: text };
    this.setData({
      messages: [...messages, newMsg],
      inputValue: '',
    }, () => {
      setTimeout(() => {
        const aiMsg = { id: Date.now() + 1, type: 'ai', content: '收到！让我们开始吧！' };
        this.setData({ messages: [...this.data.messages, aiMsg] });
      }, 800);
    });
  },
});
