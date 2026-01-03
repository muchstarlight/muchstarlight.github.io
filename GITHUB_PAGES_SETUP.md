# GitHub Pages 部署配置指南

## 1. 配置 GitHub Pages

1. 在 GitHub 仓库中，进入 **Settings** → **Pages**
2. 在 **Build and deployment** 部分：
   - **Source**: 选择 **GitHub Actions**
   - 保存设置

## 2. 更新站点 URL（重要！）

在部署到 GitHub Pages 之前，需要更新 `astro.config.mjs` 中的 `site` 配置：

### 选项 A：使用 GitHub Pages 默认域名
如果你的仓库名为 `fuwari`，用户名为 `muchstarlight`，则 URL 为：
```javascript
site: "https://muchstarlight.github.io/fuwari/",
```

### 选项 B：使用自定义域名
如果你有自定义域名：
```javascript
site: "https://your-custom-domain.com/",
```

### 选项 C：使用项目页面
如果你的仓库是项目页面（username.github.io/repository）：
```javascript
site: "https://muchstarlight.github.io/fuwari/",
base: "/fuwari/",  // 添加 base 路径
```

## 3. 工作流说明

创建的 GitHub Actions 工作流文件 `.github/workflows/deploy.yml` 包含：

### 触发条件
- 推送到 `main` 分支时自动构建和部署
- 创建 Pull Request 到 `main` 分支时只构建检查（不部署）
- 支持手动触发（在 Actions 页面）

### 构建过程
1. 检出代码
2. 设置 Node.js 22 环境
3. 安装 pnpm 9.14.4
4. 安装依赖（使用 frozen lockfile 确保一致性）
5. 执行 `pnpm build`（运行 `astro build && pagefind --site dist`）
6. 上传构建产物到 GitHub Pages

### 部署过程
- 只在 `main` 分支推送时部署
- 使用 GitHub Pages 部署 Action
- 自动设置环境变量和 URL

## 4. 首次部署步骤

1. 提交所有更改到 GitHub：
   ```bash
   git add .
   git commit -m "Add GitHub Pages deployment workflow"
   git push origin main
   ```

2. 在 GitHub 上查看 Actions 运行状态：
   - 进入仓库的 **Actions** 标签页
   - 查看 **Deploy to GitHub Pages** 工作流

3. 等待部署完成（约 2-5 分钟）

4. 访问你的 GitHub Pages 网站：
   - 默认：`https://muchstarlight.github.io/fuwari/`
   - 或在仓库 Settings → Pages 中查看 URL

## 5. 故障排除

### 构建失败
- 检查 Node.js 版本兼容性
- 确保所有依赖正确安装
- 查看 Actions 日志中的具体错误信息

### 页面显示 404
- 确认 `astro.config.mjs` 中的 `site` URL 正确
- 检查是否设置了正确的 `base` 路径（如果是项目页面）
- 等待 GitHub Pages 缓存更新（最多 10 分钟）

### 搜索功能失效
- pagefind 需要完整的 git 历史记录，确保 `fetch-depth: 0` 设置正确
- 检查 dist 目录中是否有 `pagefind` 文件夹

## 6. 自定义配置

### 修改触发分支
如果要使用其他分支（如 `master` 或 `gh-pages`），修改 `.github/workflows/deploy.yml` 中的：
```yaml
on:
  push:
    branches: [ main ]  # 改为你的分支名
```

### 添加环境变量
如果需要环境变量，可以在工作流中添加：
```yaml
env:
  NODE_ENV: production
```

### 使用缓存加速构建
工作流已配置 pnpm 缓存，如需添加更多缓存可参考 GitHub Actions 缓存文档。

## 7. 注意事项

1. **免费额度**：GitHub Actions 每月有免费额度，对于个人项目通常足够
2. **构建时间**：每次推送都会触发构建，请合理控制提交频率
3. **自定义域名**：如需使用自定义域名，还需在仓库 Settings → Pages 中配置
4. **HTTPS**：GitHub Pages 自动提供 HTTPS
5. **限制**：GitHub Pages 有构建大小和流量限制，对于大型项目请留意