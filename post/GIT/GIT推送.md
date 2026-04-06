---
title: GIT推送
date: '2025-04-08'
category: GIT
tags:
- GIT
draft: false
author: Crain
---
## Git 推送远程分支的详细命令及使用场景说明：

---

### **1. 基本推送命令**
#### 推送当前分支到远程仓库（同名分支）：
```bash
git push origin 本地分支名
```
**示例**：
```bash
git push origin feature/login  # 将本地的 feature/login 分支推送到远程
```

#### 如果本地分支已关联远程分支（通常首次推送后自动关联）：
```bash
git push
```
（需确保当前分支已通过 `git branch --set-upstream-to=origin/远程分支名` 设置关联）

---

### **2. 推送并建立关联（首次推送推荐）**
首次推送本地新分支时，同时建立与远程分支的追踪关系：
```bash
git push -u origin 本地分支名
# 或
git push --set-upstream origin 本地分支名
```
**示例**：
```bash
git checkout -b new-feature  # 创建并切换到新分支
git push -u origin new-feature  # 推送并关联远程分支
```
- 后续可直接用 `git push` 推送该分支。

---

### **3. 强制推送（谨慎使用）**
覆盖远程分支（适用于分支历史变更后的强制同步）：
```bash
git push --force origin 分支名
# 或（更安全，保留被覆盖的提交记录）
git push --force-with-lease origin 分支名
```
**适用场景**：
- 本地分支 `rebase` 后需覆盖远程分支。
- 修正错误的提交历史。

---

### **4. 删除远程分支**
```bash
git push origin --delete 远程分支名
```
**示例**：
```bash
git push origin --delete old-feature  # 删除远程的 old-feature 分支
```

---

### **5. 推送所有本地分支到远程**
```bash
git push --all origin
```
（不常用，通常推荐按需推送特定分支）

---

### **6. 常见问题解决**
#### **问题1：提示 `no upstream branch`**
**报错**：
```
fatal: The current branch 'xxx' has no upstream branch.
```
**解决**：
```bash
git push -u origin 分支名  # 首次推送时建立关联
```

#### **问题2：权限不足**
**报错**：
```
remote: Permission to user/repo.git denied to user.
```
**解决**：
1. 检查 SSH 密钥或账号权限。
2. 使用 HTTPS 协议时需输入密码或 Personal Access Token。

---

### **命令总结**
| 场景 | 命令 |
|------|------|
| 常规推送 | `git push origin 分支名` |
| 首次推送并关联 | `git push -u origin 分支名` |
| 强制推送 | `git push --force origin 分支名` |
| 删除远程分支 | `git push origin --delete 分支名` |
| 查看远程分支 | `git branch -r` |

---

### **完整工作流示例**
```bash
# 1. 创建并切换到新分支
git checkout -b fix-bug

# 2. 修改代码后提交
git add .
git commit -m "fix: resolve login page crash"

# 3. 首次推送到远程（建立关联）
git push -u origin fix-bug

# 4. 后续继续开发并推送
git push  # 直接推送（因已关联）
```

---

### **注意事项**
1. **强制推送风险**：`--force` 会覆盖远程历史，团队协作中需谨慎。
2. **分支命名一致性**：建议本地与远程分支同名，减少混淆。
3. **推送前拉取更新**：避免冲突：
   ```bash
   git pull origin 分支名
   ```