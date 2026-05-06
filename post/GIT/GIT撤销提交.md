---
author: Crain
date: 2026-05-06
title: GIT撤销提交
tags:
  - GIT
emaili: y252840@163.com
updated:
category: GIT
---
在 Git 中，“撤销提交”有多种方式，取决于**是否已经推送到远程**、**想不想保留历史**以及**当前分支状态**。

---

## 一、还没 push 到远程（本地提交）

### 1. 彻底删除最近一次提交（不保留修改）

```
git reset --hard HEAD~1
```

- 适合：提交错了，代码也不想要了
    
- ⚠️ 危险操作，修改会丢失
    

---

### 2. 撤销提交，但保留修改在工作区

```
git reset --soft HEAD~1
```

- 提交没了，代码还在暂存区
    
- 常用于：提交信息写错 / 想合并几次提交
    

---

###  3. 撤销提交，代码回到工作区（未 add）

```
git reset --mixed HEAD~1
# 或简写
git reset HEAD~1
```

- 最常用的 reset 方式
    
- 提交撤销 + 修改还在，但未暂存
    

---

## 二、已经 push 到远程（⚠️谨慎）

###  4. 推荐方式：`git revert`（安全）

```
git revert HEAD
```

- 不改变历史
    
- 会生成一个“反向提交”
    
- 适合多人协作 / 已上线代码
    

推送：

```
git push
```

---

###  5. 强制回退（不推荐，除非你确定）

```
git reset --hard HEAD~1
git push -f
```

- 会改写远程历史
    
- 可能影响其他人
    
- 仅限个人分支 / 临时分支
    

---

## 三、只是想改最后一次提交

### 6. 修改最近一次提交（不改内容）

```
git commit --amend
```

- 可修改 commit message
    
- 也可追加文件
    

如果已 push：

```
git push --force-with-lease
```

---

## 四、场景速查表

|场景|推荐命令|
|---|---|
|提交错了，还没 push|`git reset --soft HEAD~1`|
|提交错了，代码也不要了|`git reset --hard HEAD~1`|
|已 push，安全撤销|`git revert HEAD`|
|改提交信息|`git commit --amend`|
|强行回退远程|`git reset + git push -f`|

---

## 五、找回误删的提交

```
git reflog
git reset --hard <commit_id>
```

---
