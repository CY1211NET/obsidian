# 博客内容创作指南

欢迎使用 Dark Sci-Fi 博客系统。本文档将指导您如何创建新的博客文章、格式化内容以及管理元数据。

## 1. 创建新文章

所有文章都存储在 `posts/` 目录下。要创建新文章，请在该目录下创建一个以 `.md` 结尾的文件。文件名将作为文章的 URL 路径（Slug）。

例如：`posts/my-new-post.md` -> `your-site.com/blog/my-new-post`

## 2. 文章格式 (Frontmatter)

每篇文章的开头必须包含元数据块（Frontmatter），使用三条短横线包裹。请务必填写以下字段：

```yaml
---
title: "文章标题"
date: "2025-11-23"
excerpt: "这是一段简短的文章摘要，将显示在文章列表中。"
category: "分类名称"
tags: ["标签1", "标签2"]
readTime: "5 MIN READ"
---
```

### 字段说明：
- **title**: 文章的标题。
- **date**: 发布日期，格式为 YYYY-MM-DD。
- **excerpt**: 文章摘要，建议控制在 100 字以内。
- **category**: 文章分类（如：PHILOSOPHY, HARDWARE, DESIGN）。
- **tags**: 标签列表，用于筛选。
- **readTime**: 预计阅读时间（如：5 MIN READ）。

## 3. 内容编写

正文部分支持标准的 Markdown 语法。

### 标题
```markdown
# 一级标题 (通常不使用，因为已有文章标题)
## 二级标题
### 三级标题
```

### 文本样式
- **加粗**: `**文本**`
- *斜体*: `*文本*`
- `代码`: `` `代码` ``

### 代码块
支持语法高亮，请指定语言：

\`\`\`javascript
function hello() {
  console.log("Hello World");
}
\`\`\`

### 引用
> 这是一个引用块。

### 列表
- 项目 1
- 项目 2

1. 步骤 1
2. 步骤 2

## 4. 示例

```markdown
---
title: "赛博朋克美学指南"
date: "2025-11-24"
excerpt: "探索霓虹灯下的阴影，解析赛博朋克风格的核心视觉元素。"
category: "DESIGN"
tags: ["Aesthetics", "Cyberpunk", "Art"]
readTime: "6 MIN READ"
---

## 霓虹与黑暗

赛博朋克的核心在于**高科技与低生活**的对比。视觉上，这通常表现为黑暗的背景与明亮的霓虹灯光的强烈反差。

> "The sky above the port was the color of television, tuned to a dead channel."

### 关键元素

1. **故障艺术 (Glitch Art)**
2. **全息投影**
3. **网格系统**

\`\`\`css
.neon-text {
  text-shadow: 0 0 5px #00f3ff;
}
\`\`\`
```
