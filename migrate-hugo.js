#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Hugo 文章目录
const hugoContentDir = '/tmp/hugo-blog/content';
// Fuwari 文章目录
const fuwariContentDir = path.join(__dirname, 'src/content/posts');

// 确保目标目录存在
if (!fs.existsSync(fuwariContentDir)) {
  fs.mkdirSync(fuwariContentDir, { recursive: true });
}

// 处理 Hugo frontmatter 到 Fuwari frontmatter 的转换
function convertFrontmatter(hugoFrontmatter) {
  const fuwariFrontmatter = {
    title: hugoFrontmatter.title || 'Untitled',
    published: hugoFrontmatter.date || new Date().toISOString().split('T')[0],
    draft: false,
  };

  // 处理标签
  if (hugoFrontmatter.tags) {
    if (Array.isArray(hugoFrontmatter.tags)) {
      fuwariFrontmatter.tags = hugoFrontmatter.tags;
    } else if (typeof hugoFrontmatter.tags === 'string') {
      fuwariFrontmatter.tags = [hugoFrontmatter.tags];
    }
  }

  // 处理分类
  if (hugoFrontmatter.categories) {
    if (Array.isArray(hugoFrontmatter.categories)) {
      fuwariFrontmatter.category = hugoFrontmatter.categories[0];
    } else if (typeof hugoFrontmatter.categories === 'string') {
      fuwariFrontmatter.category = hugoFrontmatter.categories;
    }
  }

  return fuwariFrontmatter;
}

// 解析 Hugo 文章的 frontmatter
function parseHugoFrontmatter(content) {
  const lines = content.split('\n');
  let inFrontmatter = false;
  let frontmatterLines = [];
  let contentLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.trim() === '---') {
      if (!inFrontmatter) {
        inFrontmatter = true;
      } else {
        // 结束 frontmatter
        contentLines = lines.slice(i + 1);
        break;
      }
    } else if (inFrontmatter) {
      frontmatterLines.push(line);
    }
  }
  
  const frontmatter = {};
  for (const line of frontmatterLines) {
    const match = line.match(/^(\w+):\s*(.+)$/);
    if (match) {
      const key = match[1];
      let value = match[2].trim();
      
      // 处理带引号的字符串值
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.slice(1, -1);
      }
      
      // 处理数组值
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map(v => {
          const trimmed = v.trim();
          if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || 
              (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
            return trimmed.slice(1, -1);
          }
          return trimmed;
        });
      }
      
      frontmatter[key] = value;
    }
  }
  
  return {
    frontmatter,
    content: contentLines.join('\n')
  };
}

// 生成 Fuwari frontmatter 字符串
function generateFuwariFrontmatter(frontmatter) {
  const lines = ['---'];
  
  for (const [key, value] of Object.entries(frontmatter)) {
    if (Array.isArray(value)) {
      lines.push(`${key}: [${value.map(v => `"${v}"`).join(', ')}]`);
    } else if (key === 'published' || key === 'updated') {
      // 日期字段不需要引号
      lines.push(`${key}: ${value}`);
    } else if (typeof value === 'string') {
      lines.push(`${key}: "${value}"`);
    } else if (typeof value === 'boolean') {
      lines.push(`${key}: ${value}`);
    } else {
      lines.push(`${key}: ${value}`);
    }
  }
  
  lines.push('---\n');
  return lines.join('\n');
}

// 主迁移函数
async function migrateHugoPosts() {
  console.log('开始迁移 Hugo 文章到 Fuwari...');
  
  // 查找所有 Hugo 文章
  const hugoPosts = [];
  
  function findPosts(dir) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        findPosts(itemPath);
      } else if (item.endsWith('.md')) {
        hugoPosts.push(itemPath);
      }
    }
  }
  
  findPosts(hugoContentDir);
  
  console.log(`找到 ${hugoPosts.length} 篇文章`);
  
  // 迁移每篇文章
  for (const hugoPostPath of hugoPosts) {
    try {
      const content = fs.readFileSync(hugoPostPath, 'utf-8');
      const { frontmatter, content: markdownContent } = parseHugoFrontmatter(content);
      
      // 转换 frontmatter
      const fuwariFrontmatter = convertFrontmatter(frontmatter);
      
      // 生成新的文件名（使用原始文件名）
      const fileName = path.basename(hugoPostPath);
      const fuwariPostPath = path.join(fuwariContentDir, fileName);
      
      // 生成新的内容
      const fuwariContent = generateFuwariFrontmatter(fuwariFrontmatter) + markdownContent;
      
      // 写入文件
      fs.writeFileSync(fuwariPostPath, fuwariContent, 'utf-8');
      
      console.log(`✓ 迁移: ${fileName}`);
    } catch (error) {
      console.error(`✗ 迁移失败 ${hugoPostPath}:`, error.message);
    }
  }
  
  console.log('迁移完成！');
}

// 执行迁移
migrateHugoPosts().catch(console.error);