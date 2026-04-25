# Firefly — Agent 项目指南

> 本文件面向 AI Coding Agent 编写。阅读者被假设为完全不了解本项目。所有信息均基于项目实际内容，不做假设或泛化。

---

## 项目概述

**Firefly（流萤）** 是一款基于 [Astro](https://astro.build) 框架开发的静态博客主题模板，最初 Fork 自 [saicaca/fuwari](https://github.com/saicaca/fuwari)，由 [CuteLeaf](https://github.com/CuteLeaf) 二次开发并维护。项目定位为面向技术爱好者和内容创作者的清新美观、现代化个人博客主题，具有高度可配置性和丰富的功能模块。

项目语言：配置文件、注释和文档以**简体中文**为主；UI 支持 i18n 多语言（简体中文、繁体中文、英文、日文、俄文）。

---

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Astro 6.0.8（静态站点生成） |
| UI 框架 | Svelte 5（交互组件）、Astro 组件（布局与页面） |
| 样式 | Tailwind CSS 4、Stylus、原生 CSS |
| 语言 | TypeScript 5.9.2（严格模式，ESNext 模块） |
| 包管理器 | pnpm 9.14.4（**强制**，通过 `preinstall` 脚本阻止 npm/yarn） |
| 运行时要求 | Node.js ≥ 22 |
| 搜索 | Pagefind（构建后静态索引，客户端搜索） |
| 代码高亮 | Expressive Code + Shiki |
| 数学公式 | KaTeX（含 mhchem 扩展） |
| 图表 | Mermaid（Remark + Rehype 插件渲染） |
| 页面过渡 | Swup（Astro 集成） |
| 图标 | Iconify（构建时扫描 + 内联 SVG 生成） |
| 图像处理 | Sharp（Astro 内置） |
| 格式化/检查 | Biome 2.4.8（**替代 ESLint + Prettier**） |

---

## 构建与开发命令

所有命令均在项目根目录执行，使用 `pnpm`：

```bash
# 安装依赖（必须使用 pnpm）
pnpm install

# 启动开发服务器（localhost:4321）
pnpm dev
# 或 pnpm start

# 类型检查（不输出文件）
pnpm type-check

# 构建生产版本（生成图标 → Astro 构建 → Pagefind 索引）
pnpm build

# 本地预览构建产物
pnpm preview

# Astro 诊断检查
pnpm check

# 代码格式化（Biome）
pnpm format

# 代码检查与自动修复（Biome）
pnpm lint

# 手动生成图标内联数据
pnpm icons

# 创建新文章
pnpm new-post <filename>
```

### 构建流程说明

`pnpm build` 实际执行三步：

1. `node scripts/generate-icons.js` — 扫描 `src/` 下所有 `.svelte` 文件，提取使用的 Iconify 图标，生成 `src/constants/icons.ts` 内联 SVG 数据。
2. `astro build` — 静态站点构建，输出到 `dist/`。
3. `pagefind --site dist` — 为 `dist/` 生成全文搜索索引。

> **注意**：`generateOgImages`（OpenGraph 图片生成）在 `siteConfig.ts` 中默认关闭，因为本地调试时渲染耗时极长。仅在 CI/生产环境视需要开启。

---

## 项目结构与代码组织

```
Firefly/
├── astro.config.mjs          # Astro 主配置（集成、Remark/Rehype 插件、Vite）
├── biome.json                # 代码风格与检查规则（替代 ESLint/Prettier）
├── tsconfig.json             # TypeScript 配置（含路径别名）
├── vercel.json               # Vercel 部署配置（含安全响应头）
├── pagefind.yml              # Pagefind 搜索索引排除规则
├── postcss.config.mjs        # PostCSS（import + nesting）
├── svelte.config.js          # Svelte 预处理配置
├── scripts/
│   ├── generate-icons.js     # 构建时图标扫描与生成
│   └── new-post.js           # 新文章 Frontmatter 模板生成
├── src/
│   ├── assets/               # 图片等资源（可被 Astro 优化）
│   ├── components/           # 组件目录（按功能分类，见下方）
│   ├── config/               # 配置文件目录（模块化，每个功能独立文件）
│   ├── constants/            # 常量（图标、链接预设、主题常量等）
│   ├── content/              # 内容集合（posts/、spec/）
│   ├── content.config.ts     # Astro Content Collections 定义（Zod Schema）
│   ├── i18n/                 # 国际化：翻译函数 + 各语言文件
│   ├── layouts/              # Astro 布局（Layout.astro、MainGridLayout.astro）
│   ├── pages/                # Astro 页面路由（文件即路由）
│   ├── plugins/              # 自定义 Remark/Rehype/Markdown 插件
│   ├── styles/               # 全局样式（CSS、Stylus、Tailwind 基础）
│   ├── types/                # TypeScript 类型定义
│   ├── utils/                # 工具函数
│   ├── env.d.ts              # Astro 客户端类型扩展
│   └── global.d.ts           # 全局 Window/HTMLElement 类型扩展
├── public/                   # 静态资源（不经过构建处理）
└── dist/                     # 构建输出目录
```

### 组件目录分类 (`src/components/`)

| 目录 | 职责 |
|------|------|
| `layout/` | 页面框架组件（Navbar、Footer、Sidebar、PostCard、PostPage 等） |
| `controls/` | 用户交互控件（搜索、主题切换、布局切换、返回顶部、目录等） |
| `common/` | 通用可复用 UI（Button、Icon、CoverImage、Pagination、Dropdown 等） |
| `widget/` | 侧边栏小部件（Profile、Tags、Categories、Calendar、Music、SiteStats 等） |
| `features/` | 全局功能管理器（Fancybox、FontManager、KatexManager、MusicManager、SakuraEffect、Live2D/Spine 等） |
| `pages/` | 特定页面专用组件（如 Bangumi、Gallery、高级搜索） |
| `comment/` | 评论系统集成（Twikoo、Waline、Giscus、Disqus、Artalk） |
| `analytics/` | 统计代码集成（Google Analytics、Microsoft Clarity、Umami、51la） |
| `misc/` | 杂项（License、SharePoster） |

### 配置系统 (`src/config/`)

项目采用**高度模块化的配置驱动架构**。所有用户可自定义的功能均通过 `src/config/` 下的独立文件配置：

- `siteConfig.ts` — 站点核心配置（标题、URL、主题色、分页、页面开关、分析 ID 等）
- `profileConfig.ts` — 博主资料（头像、昵称、社交链接）
- `sidebarConfig.ts` — 侧边栏布局与组件编排
- `backgroundWallpaper.ts` — 壁纸/横幅模式、图片、轮播、水波纹
- `commentConfig.ts` — 评论系统选型与参数
- `navBarConfig.ts` — 导航栏链接与搜索配置
- `fontConfig.ts` — 自定义字体加载
- `musicConfig.ts` — 音乐播放器（Meting API 或本地音乐）
- `sakuraConfig.ts` — 樱花飘落特效参数
- `pioConfig.ts` — Live2D / Spine 看板娘配置
- `expressiveCodeConfig.ts` — 代码块高亮主题与插件
- `friendsConfig.ts`、`galleryConfig.ts`、`sponsorConfig.ts`、`coverImageConfig.ts` 等

统一通过 `src/config/index.ts` 导出。组件中推荐：

```ts
import { siteConfig, profileConfig } from "@/config";
```

---

## 内容约定

### 文章 Frontmatter (`src/content/posts/`)

使用 Astro Content Collections，`src/content.config.ts` 定义 Zod Schema。支持字段：

```yaml
---
title: 文章标题
published: 2024-01-01
updated: 2024-01-02        # 可选
description: 描述
image: ./cover.jpg         # 或使用 "api" 启用随机封面
tags: [Foo, Bar]
category: 分类名
draft: false
lang: zh-CN                # 仅当与站点语言不同时需要
pinned: false              # 置顶
comment: true              # 是否允许评论
password: ""               # 文章加密密码
passwordHint: ""           # 密码提示
---
```

### 特殊页面 (`src/content/spec/`)

- `about.md` — 关于页面内容
- `friends.mdx` — 友链页面自定义内容
- `guestbook.md` — 留言板内容

### Markdown 扩展语法

项目通过自定义 Remark/Rehype 插件支持以下扩展：

- **Admonitions/Callouts**（提醒块）：支持 GitHub、Obsidian、VitePress 三种主题风格，在 `siteConfig.rehypeCallouts.theme` 配置。
- **GitHub 仓库卡片**：`:github{repo="owner/repo"}` 语法。
- **图片网格**：通过 Remark 插件实现。
- **Mermaid 图表**：代码块标记为 `mermaid` 即可渲染。
- **数学公式**：`$...$` 行内、`$$...$$` 块级，使用 KaTeX。
- **Email 保护**：自动对邮件链接进行 Base64/ROT13 编码。
- **外部链接**：自动添加 `target="_blank"` 和 `rel="noopener noreferrer"`。

---

## 代码风格指南

### 格式化与检查工具

- **Biome 2.4.8** 统一负责 Format 和 Lint。
- 不使用 ESLint 或 Prettier。
- 配置位于 `biome.json`。

### 关键规则

- **缩进**：Tab（非空格）。
- **引号**：双引号（`"`）。
- **import 排序**：Biome assist 自动组织 import（`organizeImports: "on"`）。
- **严格规则**：`noParameterAssign`、`useAsConstAssertion`、`useSelfClosingElements`、`noUnusedTemplateLiteral` 等设为 error。
- **框架文件豁免**：`.svelte`、`.astro`、`.vue` 文件中关闭 `useConst`、`useImportType`、`noUnusedVariables`、`noUnusedImports` 规则。
- **忽略文件**：`src/**/*.css`、`src/public/**/*`、`dist/`、`node_modules/`、`src/constants/icons.ts`。

### TypeScript 约定

- `strictNullChecks: true`
- `allowJs: false`
- `declaration: true`
- 路径别名（`tsconfig.json`）：
  - `@components/*` → `src/components/*`
  - `@assets/*` → `src/assets/*`
  - `@constants/*` → `src/constants/*`
  - `@utils/*` → `src/utils/*`
  - `@i18n/*` → `src/i18n/*`
  - `@layouts/*` → `src/layouts/*`
  - `@/*` → `src/*`

### 样式约定

- Tailwind CSS 4 通过 `@tailwindcss/vite` 插件集成。
- 全局样式位于 `src/styles/`，包含 `.css` 和 `.styl` 文件。
- `src/styles/main.css` 是 Tailwind 基础引入文件。
- PostCSS 插件：`postcss-import`、`postcss-nesting`。

---

## 测试策略

**本项目当前没有集成任何测试框架**（无 Vitest、Jest、Playwright 等）。没有 `.test.*` 或 `.spec.*` 文件存在于项目源码中。

质量保障依赖：

1. `pnpm type-check` — TypeScript 编译器严格检查（`--noEmit --isolatedDeclarations`）。
2. `pnpm check` — Astro 内置诊断。
3. `pnpm lint` — Biome 静态检查。
4. `pnpm build` — 构建过程本身作为集成验证。

---

## 部署流程

### 静态输出

Astro 配置中未使用 SSR 适配器，输出为纯静态站点（`dist/` 目录）。

### 支持的平台

- **Vercel**：已配置 `vercel.json`，构建命令 `pnpm build`，输出目录 `dist`，框架预设 `astro`。附带安全响应头（X-Content-Type-Options、X-Frame-Options、X-XSS-Protection、Referrer-Policy）和静态资源长期缓存。
- **GitHub Pages**：`.github/workflows/deploy.yml` 提供完整 CI/CD，在 `push` 到 `main` 分支时自动构建并部署。
- **Netlify / Cloudflare Pages / EdgeOne Pages**：参考 Astro 官方部署指南即可，构建命令 `pnpm build`，输出目录 `dist`。

---

## 安全注意事项

1. **邮箱保护**：`rehype-email-protection.mjs` 在构建时对邮件链接进行编码（默认 `base64`，可选 `rot13`），防止爬虫采集。
2. **外部链接**：`rehype-external-links.mjs` 自动为外部链接添加 `noopener noreferrer`。
3. **防盗链图片**：`siteConfig.imageOptimization.noReferrerDomains` 可为指定域名图片注入 `referrerpolicy="no-referrer"`，客户端通过内联脚本 + `MutationObserver` 动态处理。
4. **Vercel 安全头**：已配置 `X-Frame-Options: DENY`、`X-Content-Type-Options: nosniff` 等。
5. **控制台清理**：Vite 构建配置中 `esbuildOptions.drop: ["console", "debugger"]` 会移除生产代码中的 `console.log` 和 `debugger`。

---

## Agent 需要了解的关键机制

### 1. 图标系统（构建时生成）

不要手动编辑 `src/constants/icons.ts`。该文件由 `scripts/generate-icons.js` 在构建时自动生成：扫描所有 `.svelte` 文件中的 `icon="..."`、`getIconSvg("...")` 等模式，从 `node_modules/@iconify-json/*` 提取 SVG 并内联。

如果在 Svelte 组件中新增图标引用，需要运行 `pnpm icons` 或 `pnpm build` 来更新 `icons.ts`，否则运行时图标可能缺失。

### 2. Swup 页面过渡与生命周期

项目使用 `@swup/astro` 实现无刷新页面过渡。全局的 `window.swup` 对象在 `Layout.astro` 中通过 Swup hooks 管理：

- `link:click` — 处理导航栏隐藏/显示、同页链接判断。
- `visit:start` — 进度条、banner 高度切换、移动端 banner 显隐。
- `content:replace` — 重新初始化 TOC、IconLoader、KaTeX 滚动容器等。

**新增需要 DOM 初始化的客户端功能时**，务必在 `content:replace` hook 中添加重新初始化逻辑，否则页面过渡后功能失效。

### 3. 主题与壁纸模式（客户端优先）

`Layout.astro` 的 `<head>` 中包含一段内联 `<script is:inline>`，在页面渲染前从 `localStorage` 读取并应用：

- 亮色/暗色/系统主题
- 主题色相（`--hue`）
- 壁纸模式（banner / overlay / none）
- 卡片透明度、水波纹、横幅标题等状态

修改这些配置的相关代码时，需要同时检查 `Layout.astro` 中的内联脚本和 `src/utils/setting-utils.ts` 中的运行时函数，确保两者一致。

### 4. Content Collections

Astro 内容集合定义在 `src/content.config.ts`。`posts` 集合使用 `glob` loader 加载 `src/content/posts/` 下所有 `.md`/`.mdx` 文件，Schema 包含完整的 Frontmatter 字段。`spec` 集合用于 about/friends/guestbook 等特殊页面。

修改 Schema 后需要运行 `pnpm check` 或重启开发服务器使类型生效。

### 5. i18n 实现

不是使用 Astro 官方 i18n，而是自研的简单 key-based 系统：

- `src/i18n/i18nKey.ts` — 定义所有翻译 key 的枚举。
- `src/i18n/languages/*.ts` — 各语言翻译表。
- `src/i18n/translation.ts` — `i18n(key)` 函数，按 `siteConfig.lang` 返回对应字符串，未命中时回退到中文，再回退到英文。

新增 UI 文本时，需要在 `i18nKey.ts` 添加 key，并在五个语言文件中补充翻译。

### 6. 音乐播放器架构

采用**单例管理器 + 多视图**模式：

- `MusicManager.astro` — 全局单例，管理唯一的 `<audio>` 元素和播放状态，通过 `CustomEvent` 同步状态。
- `MusicPlayer.astro` — 纯 UI 视图控制器，可存在多个实例（如导航栏和侧边栏），所有操作委托给 `MusicManager`。
- 全局可通过 `window.__fireflyMusic` API 访问播放状态和控制方法。

---

## 常见修改场景指引

| 场景 | 应该修改的位置 |
|------|--------------|
| 修改站点标题/描述/URL | `src/config/siteConfig.ts` |
| 修改博主信息/头像/社交链接 | `src/config/profileConfig.ts` |
| 调整侧边栏组件/顺序 | `src/config/sidebarConfig.ts` |
| 更换横幅/壁纸图片 | `src/config/backgroundWallpaper.ts` |
| 新增/修改导航栏菜单 | `src/config/navBarConfig.ts` |
| 切换评论系统 | `src/config/commentConfig.ts` |
| 新增文章 | `src/content/posts/` 或 `pnpm new-post <文件名>` |
| 修改代码高亮主题 | `src/config/expressiveCodeConfig.ts` |
| 调整页面过渡行为 | `src/layouts/Layout.astro` 中的 Swup hooks |
| 新增 Markdown 插件 | `astro.config.mjs` 的 `markdown.remarkPlugins` / `rehypePlugins` |
| 新增全局样式 | `src/styles/` 目录，并在 `Layout.astro` 引入 |
| 新增图标（Svelte 组件中） | 直接写 `icon="material-symbols:xxx"`，然后运行 `pnpm icons` |

---

## 许可与版权

- 项目采用 **MIT License**。
- 原始模板版权：`saicaca/fuwari`
- Firefly 修改版权：`CuteLeaf/Firefly`
- 流萤相关图片素材版权归《崩坏：星穹铁道》开发商米哈游所有。
