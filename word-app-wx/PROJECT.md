# 项目文档

CET 单词微信小程序项目。本文档重点说明**主题系统**的完整逻辑、相关文件及作用。

---

## 一、主题系统概述

项目支持**明亮 / 暗黑**两种主题，支持手动切换或跟随系统。主题配置持久化到本地存储，并在应用内统一生效。

### 1.1 核心概念

| 概念 | 说明 |
|------|------|
| **mode** | 主题模式：`light` 明亮、`dark` 暗黑、`auto` 跟随系统 |
| **scheme** | 配色方案：当前仅 `blue` |
| **resolvedTheme** | 最终生效的主题：`light` 或 `dark`（mode=auto 时由系统决定） |

### 1.2 主题切换流程

```
用户点击切换
    → toggleMode() / setTheme()
    → 写入 wx.setStorageSync('app-theme')
    → 更新 app.globalData.theme / themeResolved
    → 触发 bind:themechange
    → 各页面 onShow / _refreshTheme 读取 getResolvedTheme()
    → setData({ theme }) 驱动 wxml 中 theme-{{theme}} 切换 class
    → CSS 变量（.theme-light / .theme-dark）切换
```

---

## 二、主题相关文件及作用

### 2.1 配置与变量

| 文件 | 作用 |
|------|------|
| **theme/config.js** | 存储 key `app-theme`、默认 mode/scheme、配色方案列表 |
| **theme/schemes/blue.js** | 蓝色配色的变量映射（light/dark），为 TDesign 和自定义 `--app-*` 提供值 |
| **theme/variables.wxss** | 产出 `.theme-light` / `.theme-dark` 的 CSS 变量，被 `app.wxss` 引入 |
| **theme.json** | 微信框架用，`app.json` 中 `@navBgColor`、`@navTxtStyle` 引用，仅随**系统**主题变化 |

### 2.2 工具与逻辑

| 文件 | 作用 |
|------|------|
| **utils/theme.js** | 主题读写、切换、解析、导航栏应用等核心逻辑 |
| **app.js** | 启动时读取主题并写入 `globalData.theme` / `themeResolved` |

### 2.3 全局样式

| 文件 | 作用 |
|------|------|
| **app.wxss** | 引入 TDesign 主题变量和 `theme/variables.wxss`，定义 page 默认变量 |

### 2.4 页面与组件

| 文件 | 作用 |
|------|------|
| **pages/index/index.js** | 首页：维护 `theme`、`_refreshTheme`、`_applyNavBarTheme`，使用 `applyNavigationBarTheme` |
| **pages/index/index.wxml** | 壳容器挂载 `class="shell theme-{{theme}}"`，传递 `theme` 给 tabbar、子内容 |
| **components/home-content** | 首页内容，提供主题切换按钮，调用 `toggleMode()` 并触发 `themechange` |
| **components/mine-content** | 我的页，同样提供主题切换，调用 `toggleMode()` 并触发 `themechange` |
| **components/tabbar** | 底部导航，接收 `theme`，内部用 `isDark` 切换 `.tabbar--dark` 样式 |

---

## 三、utils/theme.js 核心 API

| API | 说明 |
|-----|------|
| `getTheme()` | 从本地存储读取 `{ mode, scheme }` |
| `setTheme({ mode, scheme })` | 写入存储并更新 `globalData` |
| `getResolvedTheme(config?)` | 得到实际生效的 `'light'` 或 `'dark'`（auto 时读系统） |
| `toggleMode()` | 在 light/dark 间切换并写回 |
| `applyNavigationBarTheme(resolvedTheme?)` | 用 `wx.setNavigationBarColor` 等 API 同步原生导航栏与主题 |

---

## 四、theme.json 与 原生导航栏

### 4.1 theme.json 的作用

- 被 `app.json` 通过 `"themeLocation": "theme.json"` 和 `@navBgColor`、`@navTxtStyle` 引用
- **仅响应系统主题**（手机/模拟器切换亮/暗），不响应应用内手动切换
- 配色与 `theme/schemes/blue.js` 保持一致

### 4.2 为何需要 applyNavigationBarTheme

当用户在应用内手动切换主题时，`theme.json` 不会更新。因此首页（使用原生导航栏）需在 `onLoad`、`onShow`、`onThemeChange` 中调用 `applyNavigationBarTheme()`，通过 `wx.setNavigationBarColor` 动态设置导航栏颜色，使其与当前主题一致。

---

## 五、新页面适配主题的步骤

1. **wxml 根节点**：添加 `class="page-root theme-{{theme}}"`
2. **页面 data**：`theme: 'light'`
3. **onShow**：`this.setData({ theme: getResolvedTheme() })`
4. **wxss**：使用 `var(--app-bg-page)`、`var(--app-text-primary)` 等主题变量，避免硬编码颜色

---

## 六、常用主题变量

| 用途 | 变量 |
|------|------|
| 页面背景 | `var(--app-bg-page)`、`var(--app-bg-page-gradient, var(--app-bg-page))` |
| 主文字 | `var(--app-text-primary)` |
| 次要文字 | `var(--app-text-secondary)` |
| 主色 | `var(--app-primary)` |
| 毛玻璃 | `var(--app-glass-bg)`、`var(--app-glass-border)`、`var(--app-glass-blur)` |
| 容器背景 | `var(--td-bg-color-container)` |
