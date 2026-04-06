---
title: GIT约定式提交
date: '2025-11-01'
category: GIT
tags:
- 'GIT'
draft: false
author: Crain
---
# 使用 `git cz` 进行交互式提交的详细指南

当你使用 `git cz` 代替 `git commit` 时，Commitizen 会提供一个交互式命令行界面，逐步引导你填写符合约定式提交规范的信息。下面是完整的流程说明：

## 安装与配置

首先确保你已经按照前面的步骤安装了 Commitizen：

```bash
npm install -g commitizen
npx commitizen init cz-conventional-changelog --save-dev --save-exact
```

## 交互式提交流程

运行 `git cz` 后，你会看到以下步骤：

### 1. 选择提交类型 (必选)
```
? Select the type of change that you're committing: 
  feat:     新增功能（feature） 
  fix:      修复缺陷（bug fix） 
  docs:     文档更新（documentation） 
  style:    代码格式调整（不影响代码逻辑的修改） 
  refactor: 代码重构（既不是修复bug也不是新增功能） 
  perf:     性能优化（performance improvement） 
  test:     测试相关变更（添加或修改测试用例） 
  build:    构建系统或外部依赖变更 
  ci:       持续集成配置变更 
  chore:    其他不修改源代码或测试的变更 
  revert:   回滚之前的提交 
(使用上下箭头选择，按回车确认)
```
使用上下箭头选择类型，按回车确认。

### 2. 输入作用域 (可选)
```
? What is the scope of this change (e.g. component or file name)? (press enter to skip)
```
输入修改影响的范围（如模块、组件或文件名），或直接回车跳过。

### 3. 输入简短描述 (必填)
```
? Write a short, imperative tense description of the change:
```
用简短的祈使句描述变更，例如：
- "add" 而不是 "added" 或 "adds"
- "fix" 而不是 "fixed" 或 "fixes"

### 4. 输入详细描述 (可选)
```
? Provide a longer description of the change: (press enter to skip)
```
可以在这里详细说明变更的背景、原因或实现细节，回车跳过。

### 5. 标明破坏性变更 (可选)
```
? Are there any breaking changes? (y/N)
```
如果这次提交包含不兼容的变更（会导致主版本号升级），输入 `y`，否则直接回车。

如果选择了 `y`，会继续提示：
```
? Describe the breaking changes:
```
详细描述破坏性变更及其影响。

### 6. 关联问题/需求 (可选)
```
? Does this change affect any open issues? (y/N)
```
如果这次提交解决了某个问题或实现了某个需求，输入 `y`。

然后会提示：
```
? Add issue references (e.g. "fix #123", "closes #124, #125"):
```
按照格式输入关联的问题编号，例如：
- "fix #123"（修复问题123）
- "closes #124"（关闭问题124）
- "fix #123, closes #124"（多个关联）

## 完整示例

假设你添加了一个新的用户管理功能，并修复了相关问题：

```
? Select the type of change that you're committing: feat
? What is the scope of this change? user
? Write a short description: add admin role management
? Provide a longer description: 
Added CRUD operations for admin roles with permission assignments
? Are there any breaking changes? No
? Does this change affect any open issues? Yes
? Add issue references: closes #42, fixes #43
```

生成的提交信息将是：

```
feat(user): add admin role management

Added CRUD operations for admin roles with permission assignments

Closes #42, fixes #43
```

## 小技巧

1. 你可以使用 `git cz -a` 自动暂存所有已跟踪文件的更改并直接进入交互界面
2. 在项目根目录添加 `.cz-config.js` 可以自定义提示文本和选项
3. 团队可以在项目中共享配置，确保所有成员使用相同的提交规范


