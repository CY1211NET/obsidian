---
title: GIT分支选择
date: 2025-04-08
category: GIT
tags:
  - GIT
draft: false
author: Crain
updated:
---
如果你想将当前的提交（commit）切换到一个新的分支，而不是直接提交到 `main`/`master` 分支，可以按照以下步骤操作：

---

## **方法 1：当前有未提交的更改，想存到新分支**
### **步骤**
1. **暂存当前更改**（如果没有暂存）：
   ```bash
   git add .
   ```
2. **创建新分支并切换过去**：
   ```bash
   git checkout -b 新分支名
   ```
3. **提交更改到新分支**：
   ```bash
   git commit -m "feat: 提交信息"
   ```
   （或者用 `git cz` 交互式提交）

---

## **方法 2：已经提交到 `main`，想移到新分支**
如果你不小心提交到了 `main` 分支，但想把它移到新分支：

### **步骤**
1. **创建新分支**（保留当前提交）：
   ```bash
   git branch 新分支名
   ```
2. **切换回 `main` 分支**：
   ```bash
   git checkout main
   ```
3. **撤销 `main` 上的提交**（可选，如果不想保留）：
   ```bash
   git reset --hard HEAD~1
   ```
   （`HEAD~1` 表示回退到上一个提交）

4. **切换到新分支继续工作**：
   ```bash
   git checkout 新分支名
   ```

---

## **方法 3：还未提交，但想直接存到新分支**
如果你正在开发，但还没 `git commit`，想直接存到新分支：

### **步骤**
1. **暂存更改**：
   ```bash
   git add .
   ```
2. **创建并切换到新分支**：
   ```bash
   git checkout -b 新分支名
   ```
3. **提交到新分支**：
   ```bash
   git commit -m "feat: 提交信息"
   ```

---

## **示例场景**
### **场景 1：正在开发，但不想污染 `main` 分支**
```bash
# 1. 开发了一些代码，但还没提交
git add .

# 2. 创建并切换到新分支
git checkout -b feature/login

# 3. 提交到新分支
git commit -m "feat(login): 添加用户登录功能"
```

### **场景 2：不小心提交到 `main`，想移到新分支**
```bash
# 1. 已经提交到 main
git log  # 查看提交记录

# 2. 创建新分支（保留提交）
git branch feature/login

# 3. 回退 main 分支
git checkout main
git reset --hard HEAD~1  # 彻底删除提交（谨慎使用！）

# 4. 切换到新分支
git checkout feature/login
```

---

## **关键命令总结**
| 操作 | 命令 |
|------|------|
| 创建并切换分支 | `git checkout -b 新分支名` |
| 仅创建分支 | `git branch 新分支名` |
| 切换分支 | `git checkout 分支名` |
| 撤销 `main` 的提交 | `git reset --hard HEAD~1` |
| 提交到新分支 | `git commit -m "提交信息"` |

---

## **注意事项**
1. **`git reset --hard` 会彻底删除提交**，确保你已经备份或推送到新分支。
2. 如果代码已经推送到远程 `main`，需要用 `git push -f` 强制覆盖（不推荐，除非你知道后果）。
3. 推荐工作流：
   - 永远在 **新分支** 开发，而不是直接改 `main`。
   - 用 `git checkout -b 新分支名` 开始新功能。

这样，你的 `main` 分支就能保持干净，所有新功能都在独立分支开发！ 🚀