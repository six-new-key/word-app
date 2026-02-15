# Tabbar 组件

可配置的底部导航组件，支持红点/角标、深色模式、点击反馈、图标容错、无障碍等，传值即可启用。

## 基本用法

```html
<tabbar activeTab="{{currentTab}}" bind:tabchange="onTabChange" />
```

## 配置项（Properties）

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| activeTab | String | `'home'` | 当前选中的 tab id |
| list | Array | 默认 4 项 | tab 列表，不传则用内置默认 |
| theme | String | `'auto'` | 主题：`light` 浅色 \| `dark` 深色 \| `auto` 跟随系统 |
| hoverFeedback | Boolean | `true` | 是否启用点击/按压反馈 |
| sidePadding | Number | `24` | 左右边距 rpx |
| iconFallback | String | `''` | 图标加载失败时的兜底路径 |
| badgeMax | Number | `99` | 角标数字最大值，超出显示 `99+` |

## list 项结构

```js
{
  id: 'home',           // 必填，唯一标识
  label: '首页',        // 必填，显示文案
  iconPath: '/path',    // 必填，未选中图标
  selectedIconPath: '/path', // 可选，选中图标，缺省用 iconPath
  badge: 3,             // 可选，number 显示数字角标，true 显示红点
  disabled: false       // 可选，是否禁用
}
```

## 自定义 list 示例

```html
<tabbar
  activeTab="{{currentTab}}"
  list="{{tabList}}"
  theme="auto"
  hoverFeedback="{{true}}"
  sidePadding="{{24}}"
  iconFallback="/assets/icons/default.png"
  badgeMax="{{99}}"
  bind:tabchange="onTabChange"
/>
```

```js
// 页面 data
tabList: [
  { id: 'home', label: '首页', iconPath: '/assets/icons/home.png', selectedIconPath: '/assets/icons/home-active.png' },
  { id: 'learning', label: '学习', iconPath: '/assets/icons/learn.png', selectedIconPath: '/assets/icons/learn-active.png', badge: 5 },
  { id: 'vocabulary', label: '词库', iconPath: '/assets/icons/wordBase.png' },
  { id: 'mine', label: '我的', iconPath: '/assets/icons/about.png', badge: true },
]
```

## 事件

| 事件 | 说明 | 回调参数 |
|------|------|----------|
| tabchange | 点击 tab 时触发 | `e.detail.tab` 当前点击的 tab id |

## 功能说明

- **红点/角标**：`list[].badge` 为 `number` 显示数字，为 `true` 显示红点
- **深色模式**：`theme="dark"` 或 `theme="auto"` 且系统为深色时应用深色样式
- **点击反馈**：`hoverFeedback` 为 `true` 时按压有缩放反馈
- **图标容错**：设置 `iconFallback` 后，图标加载失败会使用兜底图
- **无障碍**：内置 `role="tablist"`、`aria-label`、`aria-selected` 等
