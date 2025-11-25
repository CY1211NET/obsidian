---
title: GIT取消暂存及保存单文件或者文件夹
date: '2025-04-08'
category: GIT
tags:
- GIT
draft: false
author: Crain
---
## 在 Git 中取消 `git add .` 的暂存操作方法

---

### **1. 取消所有暂存的文件（恢复到未 `add` 的状态）**
```bash
git reset
```
或（效果相同）：
```bash
git reset HEAD
```
- **作用**：将所有已暂存的文件从暂存区移除，但**保留工作目录的修改**（文件内容不会丢失）。

---

### **2. 取消特定文件的暂存（只移除部分文件）**
```bash
git reset 文件名
```
例如：
```bash
git reset src/main.js  # 只取消 src/main.js 的暂存
```

---

### **3. 彻底撤销修改（慎用！会丢失工作区更改）**
如果不仅想取消暂存，还想**直接丢弃工作目录的修改**：
```bash
git checkout -- 文件名
```
或（Git 2.23+ 推荐）：
```bash
git restore 文件名
```
- **警告**：这会永久撤销文件的更改，无法恢复！

---

### **4. 查看当前暂存状态（确认操作前检查）**
```bash
git status
```
- 暂存的文件会显示在 `Changes to be committed` 下方。

---

### **操作示例**
#### **场景 1：误运行 `git add .`，想取消所有暂存**
```bash
git reset        # 取消所有暂存
git status       # 确认文件已回到 "Untracked" 或 "Modified" 状态
```

#### **场景 2：只想取消某个文件的暂存**
```bash
git reset config.yml   # 仅取消 config.yml 的暂存
git status            # 检查结果
```

#### **场景 3：撤销修改并取消暂存（危险操作！）**
```bash
git reset README.md    # 取消暂存
git checkout -- README.md  # 丢弃工作区修改
```

---

### **总结**
| 需求 | 命令 |
|------|------|
| 取消所有暂存 | `git reset` |
| 取消特定文件暂存 | `git reset 文件名` |
| 彻底丢弃修改 | `git checkout -- 文件名` 或 `git restore 文件名` |
| 查看状态 | `git status` |

**注意**：  
- `git reset` 只影响暂存区，不会删除文件内容。  
- `git checkout -- 文件名` 会覆盖工作区修改，谨慎使用！
 
##   Git 中，暂存（`git add`）**特定文件夹**下的所有修改（包括新增、修改和删除的文件

---

### **1. 暂存整个文件夹的所有变更**
```bash
git add 文件夹路径/
```
#### 示例：
```bash
git add src/          # 暂存 src 目录下的所有变更
git add public/css/   # 暂存 public/css 目录下的所有变更
```
- **注意**：路径末尾的 `/` 是可选的（`git add src` 和 `git add src/` 效果相同）。

---

### **2. 暂存文件夹下的特定类型文件**
如果只想暂存该文件夹下的某类文件（如所有 `.js` 文件）：
```bash
git add 文件夹路径/*.js
```
#### 示例：
```bash
git add src/*.js      # 暂存 src 目录下所有 .js 文件
```

---

### **3. 交互式暂存（精确控制）**
如果需要更精细地选择文件夹中的部分文件：
```bash
git add -p 文件夹路径/
```
- Git 会逐个显示文件夹内的变更，并询问是否暂存（输入 `y` 或 `n` 选择）。

---

### **4. 查看暂存状态**
运行以下命令确认暂存结果：
```bash
git status
```
- 已暂存的文件会显示在 **`Changes to be committed`** 部分。

---

### **注意事项**
1. **不递归子目录**：  
   `git add 文件夹/` 默认会递归暂存该文件夹下的**所有子目录**内容。如果只想暂存顶层文件（不包含子目录），需明确指定文件：
   ```bash
   git add 文件夹/*
   ```

2. **排除特定文件**：  
   若文件夹中有不想暂存的文件，可以先暂存整个文件夹，再取消特定文件：
   ```bash
   git add src/           # 暂存整个 src 目录
   git reset src/config.yml  # 取消暂存 src/config.yml
   ```

3. **路径区分大小写**：  
   在 Linux/macOS 中路径是大小写敏感的，Windows 默认不敏感（但 Git 会保留大小写）。

---

### **常见问题**
#### **Q：为什么 `git add 文件夹/` 没效果？**
- 可能原因：
  1. 文件夹路径拼写错误。
  2. 文件夹内没有变更（可用 `git status` 检查）。
  3. 文件夹被 `.gitignore` 忽略。

#### **Q：如何暂存空文件夹？**
- Git 默认不跟踪空文件夹。如需保留，可在文件夹内创建空占位文件（如 `.gitkeep`）：
  ```bash
  mkdir -p logs/ && touch logs/.gitkeep
  git add logs/
  ```

---

### **总结**
| 需求 | 命令 |
|------|------|
| 暂存整个文件夹 | `git add 文件夹路径/` |
| 暂存文件夹下某类文件 | `git add 文件夹/*.扩展名` |
| 交互式暂存 | `git add -p 文件夹/` |
| 暂存后检查 | `git status` |

通过以上方法，你可以精准控制只暂存目标文件夹的内容！