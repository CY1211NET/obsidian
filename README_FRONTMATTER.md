# Front Matter 批量管理工具使用说明

## 功能介绍

这个 Python 脚本可以帮助你批量检查和修改 `posts` 目录下所有 Markdown 文件的 front matter 字段。

### 支持的字段

| 字段            | 用途                | 处理方式 |
| ------------- | ----------------- | ---- |
| `title`       | 文章标题（必须）          | 如果缺失，使用文件名 |
| `description` | SEO 摘要，Google 会显示 | 可选字段 |
| `date`        | 创建时间，决定文章顺序       | 如果缺失，使用文件修改时间 |
| `updated`     | 更新日期              | 可选字段 |
| `tags`        | 多标签               | 如果缺失，添加空数组 |
| `category`    | 分类（一般 1 个）        | 如果缺失，使用所在目录名 |
| `draft`       | 草稿，不会发布           | 默认 false |
| `author`      | 作者名               | 默认 "Crain" |
| `cover`       | 封面图 URL           | 可选字段 |

## 安装依赖

```bash
pip install -r requirements.txt
```

或者直接安装：

```bash
pip install PyYAML
```

## 使用方法

### 1. 交互模式（推荐）

逐个文件检查，每次询问是否应用更改：

```bash
python frontmatter_manager.py
```

### 2. 指定目录

```bash
python frontmatter_manager.py --dir ./posts
```

### 3. 自动模式

自动应用所有更改，不询问：

```bash
python frontmatter_manager.py --auto
```

## 使用示例

### 交互模式示例

```
🚀 Front Matter 批量管理工具 ========================================

📂 扫描目录: d:\JAVA-DEVELOPMENT\blog\posts
📊 找到 50 个 Markdown 文件

[1/50] ================================================================================
📄 文件: BTC/BTC节点和独立运行的意义.md
================================================================================
原始 Front Matter                         | 修改后 Front Matter
--------------------------------------------------------------------------------
title: BTC节点和独立运行的意义              | title: BTC节点和独立运行的意义
date: 2025-11-16                          | description: ''
tags: ["#BTC"]                            | date: 2025-11-16
                                          | category: BTC
                                          | tags: ["#BTC"]
                                          | draft: false
                                          | author: Crain
--------------------------------------------------------------------------------

📝 将要添加/修改的字段:
   • description: ''
   • category: BTC
   • draft: false
   • author: Crain

是否应用更改? (y/n/s=跳过所有): y
✅ 已更新: BTC/BTC节点和独立运行的意义.md
```

### 功能特点

1. **并排对比显示**：左侧显示原始 front matter，右侧显示修改后的版本
2. **智能建议**：
   - 缺少 `title` 时使用文件名
   - 缺少 `date` 时使用文件修改时间
   - 缺少 `category` 时使用所在目录名
   - 自动添加默认作者
3. **交互式确认**：每个文件都可以选择是否应用更改
4. **批量跳过**：输入 `s` 可以跳过剩余所有文件
5. **彩色高亮**：差异部分会用颜色高亮显示（红色=原始，绿色=修改后）

## 注意事项

⚠️ **使用前建议**：
1. 先提交当前的 Git 更改，以便出错时可以回滚
2. 第一次使用建议用交互模式，检查几个文件确认无误后再用自动模式
3. 脚本会保留原有字段，只添加缺失的字段

## 命令行参数

```bash
python frontmatter_manager.py --help
```

- `--dir <目录>`: 指定 Markdown 文件所在目录（默认: ./posts）
- `--auto`: 自动模式，不询问直接应用所有更改
