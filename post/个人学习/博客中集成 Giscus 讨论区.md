---
author: Crain
date: 2024-05-14
title: 集成 Giscus 讨论区
tags:
  - "#博客"
emaili: y252840@163.com
updated:
category: 项目开发
---

---

### 第一步：GitHub 仓库准备
**你需要安装 Giscus GitHub App 插件并把权限分给这个仓库。**

1. **点击进入链接**：[https://github.com/apps/giscus](https://github.com/apps/giscus)
2. **点击 Configure**：在页面右边你会看到一个 **Configure** 按钮（如果是第一次则显示 **Install**）。
3. **选择仓库**：在弹出的页面底部，确保选择了 **"Only select repositories"** 并搜到 **`CY1211NET/obsidian`**，或者直接选择 **"All repositories"**。
4. **点击 Save**：保存权限设置。
5.  **公共仓库**：确保你的博客代码（或专门存放评论的仓库）是 **Public (公开)** 的。
6.  **开启讨论**：进入仓库的 `Settings` -> `General` -> 勾选 **Discussions**。
7.  **安装权限**：访问 [giscus app](https://github.com/apps/giscus)，点击安装并授权访问你的目标仓库。

### 第二步：获取配置 ID
1.  访问 [giscus.app](https://giscus.app/zh-CN)。
2.  输入仓库名（例如 `你的名字/仓库名`）。
3.  **选择分类**：在“分类”中选择一个（推荐 **Announcements**，能过滤非评论讨论）。
4.  **复制关键 ID**：在页面下方的“启用 giscus”部分，记下：
    *   `data-repo-id`
    *   `data-category-id`

### 第三步：代码实现 (以 React 为例)

#### 1. 安装依赖
```bash
npm install @giscus/react
```

#### 2. 抽离配置 (`src/siteConfig.ts`)
将 Giscus 的参数统一管理，方便后续修改：
```typescript
export const siteConfig = {
  // ... 其他配置
  giscus: {
    repo: "CY1211NET/obsidian",
    repoId: "R_kgDOM4jd1g",
    category: "Announcements",
    categoryId: "DIC_kwDOM4jd1s4C6Rn1",
    mapping: "url", // 或 pathname
    theme: "preferred_color_scheme",
    lang: "zh-CN"
  }
};
```

#### 3. 编写评论组件 (`src/App.tsx`)
利用 `@giscus/react` 的组件动态渲染：
```tsx
import Giscus from '@giscus/react';

export const GiscusComments = () => {
  const config = siteConfig.giscus;
  
  return (
    <Giscus
      id="comments"
      repo={config.repo}
      repoId={config.repoId}
      category={config.category}
      categoryId={config.categoryId}
      mapping="url"
      term="Welcome to my blog!"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="bottom"
      theme="light" // 或从全局状态读取 dark/light
      lang="zh-CN"
      loading="lazy"
    />
  );
};
```

### 第四步：进阶功能
*   **主题同步**：监听网站的深色/浅色模式切换，动态更新 `Giscus` 组件的 `theme` 属性（支持 `light`, `dark`, `transparent_dark` 等）。
*   **国际化**：根据网站当前的语言设置（如 `zh` 或 `en`），动态传递 `lang` 参数。

---

