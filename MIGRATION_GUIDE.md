# Hugo 到 Fuwari 迁移指南

## 迁移完成情况

✅ 已完成以下迁移工作：

1. **配置本地化**
   - 更新站点标题为 "Muchstarlight's blog"
   - 设置语言为中文 (zh_CN)
   - 更新导航栏和个人资料信息
   - 配置作者信息和链接

2. **文章迁移**
   - 迁移了 4 篇文章：
     - `about.md` - 关于页面
     - `Markdown.md` - Markdown 示例
     - `log-2025-05-26.md` - 日志
     - `sql-read.md` - SQL 教程
   - 自动转换 Hugo frontmatter 到 Fuwari 格式
   - 保留所有文章内容和格式

3. **GitHub Actions 配置**
   - 创建了自动部署工作流
   - 配置了 Node.js 20 环境
   - 使用 pnpm 包管理器
   - 集成 pagefind 搜索索引
   - 自动部署到 GitHub Pages

4. **项目配置**
   - 更新站点 URL 为 `https://blog.muchstarlight.top/`
   - 配置了中文本地化翻译
   - 保留了所有 Fuwari 主题功能

## 下一步操作

### 1. 清理临时文件
```bash
./cleanup.sh
```

### 2. 准备 Git 提交
```bash
./prepare-git.sh
```

### 3. 推送到原仓库
```bash
# 添加远程仓库
git remote add origin https://github.com/muchstarlight/muchstarlight.github.io.git

# 强制推送（覆盖原内容）
git push -f origin main
```

### 4. 配置 GitHub Pages
1. 访问仓库设置：https://github.com/muchstarlight/muchstarlight.github.io/settings/pages
2. 设置 Source 为 "GitHub Actions"
3. 保存设置

### 5. 自定义域名（可选）
如果需要保持原来的域名 `blog.muchstarlight.top`：
1. 在仓库设置中添加自定义域名
2. 或者在 `dist` 目录创建 `CNAME` 文件，内容为 `blog.muchstarlight.top`

## 项目结构说明

```
fuwari/
├── src/
│   ├── content/posts/     # 迁移的文章
│   ├── config.ts          # 站点配置
│   ├── i18n/              # 多语言翻译
│   └── ...
├── .github/workflows/     # GitHub Actions 配置
├── astro.config.mjs       # Astro 配置
├── package.json          # 项目依赖
└── ...
```

## 功能特性

- ✅ 响应式设计
- ✅ 深色/浅色主题
- ✅ 文章搜索（pagefind）
- ✅ RSS 订阅
- ✅ 代码高亮
- ✅ 数学公式支持（KaTeX）
- ✅ 图片灯箱
- ✅ 多语言支持
- ✅ 平滑页面过渡

## 开发命令

```bash
# 开发模式
pnpm run dev

# 构建项目
pnpm run build

# 预览构建结果
pnpm run preview

# 代码格式化
pnpm run format

# 代码检查
pnpm run lint
```

## 注意事项

1. **SQL 代码高亮警告**：当前有关于 SQL 语言高亮的警告，这是正常的，不影响功能
2. **文章数量**：只迁移了 4 篇文章，如需迁移更多文章，请将 Hugo 文章放入 `/tmp/hugo-blog/content/` 并重新运行迁移
3. **自定义样式**：可以在 `src/styles/` 目录中修改样式
4. **组件定制**：所有组件都在 `src/components/` 目录中

## 问题解决

如果遇到问题：

1. **构建失败**：检查 frontmatter 格式是否正确
2. **部署失败**：检查 GitHub Actions 日志
3. **样式问题**：检查浏览器控制台错误

## 联系信息

如有问题，请参考：
- Fuwari 文档：https://fuwari.vercel.app/
- Astro 文档：https://docs.astro.build/
- GitHub Issues：https://github.com/muchstarlight/muchstarlight.github.io/issues