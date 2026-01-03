#!/bin/bash

# 准备 Git 仓库替换脚本
# 这个脚本将帮助你将 Fuwari 项目推送到原来的 Hugo 博客仓库

echo "=== 准备 Git 仓库替换 ==="
echo "注意：这个操作将会覆盖原来的 Hugo 博客仓库"
echo ""

# 检查当前目录是否是 Git 仓库
if [ ! -d ".git" ]; then
    echo "错误：当前目录不是 Git 仓库"
    echo "请先初始化 Git 仓库：git init"
    exit 1
fi

# 添加所有文件到 Git
echo "1. 添加所有文件到 Git..."
git add .

# 提交更改
echo "2. 提交更改..."
git commit -m "迁移 Hugo 博客到 Fuwari

- 将 Hugo 博客迁移到 Fuwari 静态站点生成器
- 更新配置为中文本地化
- 迁移所有文章内容
- 配置 GitHub Actions 自动部署
- 更新站点配置和个人信息"

# 添加远程仓库（原来的 Hugo 博客仓库）
echo "3. 添加远程仓库..."
echo "请确保你已经备份了原来的 Hugo 博客内容"
echo ""
echo "要添加远程仓库，请运行："
echo "  git remote add origin https://github.com/muchstarlight/muchstarlight.github.io.git"
echo ""
echo "然后强制推送到 main 分支："
echo "  git push -f origin main"
echo ""
echo "注意：这将覆盖原来的 Hugo 博客仓库内容"
echo ""
echo "4. 推送完成后，需要启用 GitHub Pages："
echo "   - 访问 https://github.com/muchstarlight/muchstarlight.github.io/settings/pages"
echo "   - 设置 Source 为 'GitHub Actions'"
echo "   - 保存设置"
echo ""
echo "5. 自定义域名配置（如果需要）："
echo "   - 在仓库设置中添加 CNAME: blog.muchstarlight.top"
echo "   - 或者在 dist 目录创建 CNAME 文件"
echo ""
echo "=== 准备完成 ==="
echo "请按照上述步骤操作来完成迁移。"