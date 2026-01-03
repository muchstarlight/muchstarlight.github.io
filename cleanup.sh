#!/bin/bash

# 清理脚本 - 删除迁移过程中创建的临时文件

echo "=== 清理临时文件 ==="

# 删除迁移脚本
if [ -f "migrate-hugo.js" ]; then
    echo "删除 migrate-hugo.js"
    rm migrate-hugo.js
fi

# 删除临时 Hugo 博客目录
if [ -d "/tmp/hugo-blog" ]; then
    echo "删除 /tmp/hugo-blog"
    rm -rf /tmp/hugo-blog
fi

# 删除示例文章（保留迁移的文章）
echo "保留迁移的文章在 src/content/posts/"
echo "如果需要删除示例文章，请手动删除："
echo "  rm src/content/posts/draft.md"
echo "  rm src/content/posts/expressive-code.md"
echo "  rm src/content/posts/markdown-extended.md"
echo "  rm src/content/posts/video.md"
echo "  rm -rf src/content/posts/guide/"

echo ""
echo "=== 清理完成 ==="
echo "现在你可以运行 prepare-git.sh 来准备 Git 提交"