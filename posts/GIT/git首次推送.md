---
title: git首次推送
date: '2025-11-01'
category: GIT
tags:
- GIT
draft: false
author: Crain
---
---

## 🧭 一、初始化与配置阶段

1. **初始化本地仓库**
    
    ```bash
    git init
    ```
    
    ➤ 在本地创建一个新的 Git 仓库。
    
2. **配置用户信息**
    
    ```bash
    git config --global user.name "你的GitHub用户名"
    git config --global user.email "你的GitHub邮箱"
    ```
    
3. **添加远程仓库**
    
    ```bash
    git remote add origin https://github.com/CY1211NET/obsidian.git
    ```
    
    ⚠️ 若提示 `remote origin already exists`，说明远程地址已绑定，用：
    
    ```bash
    git remote set-url origin https://github.com/CY1211NET/obsidian.git
    ```
    
    更新地址。
    

---

## 💾 二、本地提交阶段

1. **查看未跟踪文件**  
    Git 提示：
    
    ```
    nothing added to commit but untracked files present
    ```
    
    表示文件还未被追踪。
    
2. **添加到暂存区并提交**
    
    ```bash
    git add .
    git commit -m "首次推送"
    ```
    

---

## ☁️ 三、推送到 GitHub 阶段

首次推送：

```bash
git push -u origin main
```

出现错误：

```
! [rejected] main -> main (fetch first)
```

说明**远程仓库已有内容**（如默认的 README.md），  
本地需要先同步。

---

## 🔄 四、解决远程冲突与同步问题

### 1️⃣ 先拉取远程更新

```bash
git pull --rebase origin main
```

rebase 方式保持提交历史线性。

---

### 2️⃣ 若出现冲突（如 README.md）

文件中会出现冲突标记：

```text
<<<<<<< HEAD
# 本地版本
=======
# 远程版本
>>>>>>> origin/main
```

解决办法：

- 手动编辑文件，合并内容；
    
- 删除冲突符号；
    
- 保存后执行：
    
    ```bash
    git add README.md
    git rebase --continue
    ```
    

---

### 3️⃣ 再次推送

```bash
git push origin main
```

若仍提示：

```
non-fast-forward
```

说明远程有新的提交，重新执行：

```bash
git pull --rebase origin main
git push origin main
```

---

## 💣 五、强制推送（仅在确定远程可覆盖时使用）

```bash
git push origin main --force
```

此操作会**以本地为准覆盖远程**。

---

## 🧩 六、命令逻辑总结表

|操作目标|命令|说明|
|---|---|---|
|初始化仓库|`git init`|创建本地仓库|
|添加远程地址|`git remote add origin <url>`|绑定 GitHub 仓库|
|修改远程地址|`git remote set-url origin <url>`|替换远程仓库|
|添加文件|`git add .`|添加所有文件|
|提交代码|`git commit -m "msg"`|提交到本地|
|拉取远程内容|`git pull --rebase origin main`|合并远程更新|
|解决冲突|`git add . && git rebase --continue`|手动解决冲突后继续|
|推送代码|`git push origin main`|上传到 GitHub|
|强制覆盖推送|`git push origin main --force`|用本地内容覆盖远程|

---

## ✅ 七、经验与最佳实践

1. **首次推送前先拉取**：避免与远程默认文件冲突。
    
2. **使用 `--rebase` 而非 `--merge`**：保持清晰提交历史。
    
3. **遇冲突先解决、再推送**：不要直接强推除非确定远程不重要。
    
4. **推送后及时检查 GitHub 仓库页面**：确认同步无误。
    
5. **保持 README.md、.gitignore 同步更新**，减少后续合并问题。
    

---
