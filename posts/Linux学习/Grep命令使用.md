---
title: Grep命令使用
date: '2025-05-15'
category: Linux
tags:
- Linux
draft: false
author: Crain
---
下面是整理后的《`grep` 命令详解》笔记版本，结构清晰、便于学习和查阅：

---

# 🧠 `grep` 命令详解：Linux 文本搜索利器

`grep`（**G**lobal **R**egular **E**xpression **P**rint）是 Linux 中最常用的文本搜索工具之一，用于在文件中查找包含特定模式的行。

---

## 🧩 1. 基本语法

```bash
grep [选项] "搜索模式" 文件名
```

---

## 🛠️ 2. 常用选项

|选项|说明|
|---|---|
|`-i`|忽略大小写|
|`-v`|反向匹配（显示不包含模式的行）|
|`-n`|显示匹配行的行号|
|`-c`|显示匹配行的总数|
|`-l`|只显示包含匹配项的文件名|
|`-r`|递归搜索目录|
|`-w`|匹配整个单词|
|`-A n`|显示匹配行及其后 n 行|
|`-B n`|显示匹配行及其前 n 行|
|`-C n`|显示匹配行及其前后各 n 行|

---

## 📚 3. 实用示例

### ✅ 基本搜索

```bash
grep "error" logfile.txt           # 搜索包含 "error" 的行
grep -i "error" logfile.txt        # 忽略大小写
```

### 🔍 显示上下文

```bash
grep -A 2 "error" logfile.txt      # 匹配行及其后2行
grep -C 1 "error" logfile.txt      # 匹配行及其前后各1行
```

### 🗂️ 递归搜索目录

```bash
grep -r "error" /path/to/dir       # 当前目录及子目录递归查找
```

### 🧠 高级匹配（正则）

```bash
grep "^error" logfile.txt                          # 匹配以 "error" 开头的行
grep "^$" logfile.txt                              # 匹配空行
grep -E "[0-9]{1,3}(\.[0-9]{1,3}){3}" logfile.txt   # 匹配IP地址
```

---

## 🔗 4. 与其他命令组合使用

```bash
history | grep "ssh"                      # 从历史命令中过滤出 ssh 相关
ps aux | grep "nginx"                     # 查看 nginx 进程
grep -c "error" logfile.txt               # 统计包含 error 的行数
grep "error" logfile.txt > errors.txt     # 导出匹配结果到文件
```

---

## 🧮 5. 正则表达式支持

|表达式|含义|
|---|---|
|`^`|行首|
|`$`|行尾|
|`.`|任意单字符|
|`*`|前一个字符重复0次以上|
|`[]`|匹配字符集中的任意一个|
|`\`|转义特殊字符|
|`|`|

### 示例

```bash
grep -E "error|warning" logfile.txt      # 匹配 "error" 或 "warning"
grep "^[0-9]" logfile.txt                # 匹配以数字开头的行
```

---

## 🚀 6. 性能优化建议（处理大文件）

```bash
grep -F "固定字符串" largefile.log       # 使用固定字符串，加快速度
grep --include="*.log" -r "pattern" /path -m 100  # 限制匹配100行，多线程版本更快
```

---

需要我把这份笔记保存为 Markdown 或 PDF 文件吗？