# 主题系统

## 目录结构

```
theme/
├── config.js       # 存储 key、默认 mode/scheme、配色方案列表
├── schemes/
│   └── blue.js     # 蓝色配色方案（light/dark 变量映射）
├── variables.wxss  # 编译后的 CSS 变量（.theme-light / .theme-dark）
└── README.md
```

## 使用方式

### 1. 壳页面挂载主题 class

根节点添加 `class="theme-{{theme}}"`，`theme` 为 `getResolvedTheme()` 的返回值（`'light'` | `'dark'`）。

### 2. 切换主题

```js
const { toggleMode, setTheme, setScheme } = require('../../utils/theme.js');

// 切换亮/暗
toggleMode();

// 指定 mode
setTheme({ mode: 'dark' });

// 指定配色方案（当前仅 blue）
setTheme({ scheme: 'blue' });
```

### 3. 使用主题变量

在 wxss/scss 中使用：

- `var(--app-bg-page)` 页面背景
- `var(--app-text-primary)` 主文字
- `var(--app-text-secondary)` 次要文字
- `var(--app-primary)` 主色
- `var(--td-brand-color)` TDesign 主色

### 4. 新增配色方案

1. 在 `schemes/` 下新建 `green.js`，格式同 `blue.js`
2. 在 `config.js` 的 `SCHEMES` 中注册
3. 在 `utils/theme.js` 的 `SCHEME_MAP` 中注册
4. 在 `variables.wxss` 中补充 `.theme-light.theme-green` 等（或按需扩展生成逻辑）

### 5. 新增页面如何适配主题色

新增页面时，按以下步骤即可自动适配主题：

**① 在页面根节点添加主题 class**

在 wxml 最外层 view 上添加 `theme-{{theme}}`，例如：

```html
<view class="page-root theme-{{theme}}">
  <!-- 页面内容 -->
</view>
```

**② 在页面 JS 中注入并更新 theme**

```js
const { getResolvedTheme } = require('../../utils/theme.js');

Page({
  data: {
    theme: 'light',
    // 其他数据...
  },
  onShow() {
    this.setData({ theme: getResolvedTheme() });
  },
  // 监听主题切换（从设置页返回时生效）
  onThemeChange() {
    this.setData({ theme: getResolvedTheme() });
  },
});
```

在 `app.json` 中为页面配置 `"onThemeChange": true` 时，可在页面的 `onThemeChange` 中更新 theme。

**③ 使用主题变量替代硬编码颜色**

在 wxss 中统一使用主题变量：

| 用途 | 变量名 |
|------|--------|
| 页面背景 | `var(--app-bg-page)` 或 `var(--app-bg-page-gradient, var(--app-bg-page))` |
| 主文字 | `var(--app-text-primary)` |
| 次要文字 | `var(--app-text-secondary)` |
| 主色 | `var(--app-primary)` |
| 主色上的文字（如按钮） | `var(--app-text-on-primary)` |
| 毛玻璃卡片 | `var(--app-glass-bg)`、`var(--app-glass-border)`、`var(--app-glass-blur)` |
| 危险/错误色 | `var(--app-danger)`、`var(--app-danger-bg)`、`var(--app-danger-border)` |
| 成功色 | `var(--app-success)` |
| 强调暖色（如 VIP 金） | `var(--app-accent-warm)` |

**④ 毛玻璃卡片样式**

卡片统一使用毛玻璃效果时：

```css
.my-card {
  background: var(--app-glass-bg);
  backdrop-filter: var(--app-glass-blur);
  -webkit-backdrop-filter: var(--app-glass-blur);
  border: 1rpx solid var(--app-glass-border);
}
```

或使用通用类 `.app-glass`（见 `app.wxss`）。

**⑤ 避免使用的写法**

- ❌ 不要使用 `color: #fff`、`color: #333` 等硬编码颜色
- ❌ 不要使用 `background: #fff` 作为卡片背景（应使用 `var(--td-bg-color-container)` 或毛玻璃变量）
- ✅ 主色按钮上的白色文字统一使用 `var(--app-text-on-primary)`
