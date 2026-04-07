---
author: Crain
date: 2024-06-14
title: Ollama下载及其使用
tags:
  - "#AI"
  - "#Ollama"
emaili: y252840@163.com
updated:
category: AI
---


### 1. 下载与安装

你可以直接访问官方网站：[ollama.com](https://ollama.com/)

- **Windows / macOS**:
    
    - 在官网点击 **Download** 按钮，下载对应的安装包（`.exe` 或 `.zip`）。
        
    - 双击安装后，Ollama 会在后台运行，终端（CMD/PowerShell/Terminal）即可直接使用 `ollama` 命令。
        
- **Linux**:
    
    - 通过终端执行一行命令即可自动安装：
        
        `curl -fsSL https://ollama.com/install.sh | sh`
        
- **Docker**:
    
    - `docker pull ollama/ollama`
        

---

### 2. 常用管理命令

安装完成后，在终端输入以下命令进行操作：

|**命令**|**用途**|
|---|---|
|**`ollama run <name>`**|**运行模型**：如果本地没有，会自动下载并开启对话界面。|
|**`ollama pull <name>`**|**拉取模型**：只下载模型到本地，不运行。|
|**`ollama list`**|**查看列表**：列出本地已安装的所有模型。|
|**`ollama ps`**|**运行状态**：查看当前正在内存中运行的模型。|
|**`ollama rm <name>`**|**删除模型**：移除本地模型文件以释放空间。|
|**`ollama show <name>`**|**详情查看**：显示模型的参数、层级、License 等信息。|
|**`ollama cp <old> <new>`**|**复制模型**：给模型起个别名或备份。|
|**`ollama serve`**|**启动服务**：手动启动 Ollama 的后台服务器进程。|

---

### 3. 进入对话后的交互指令

当你执行 `ollama run` 进入 AI 对话模式后，可以输入以下指令控制：

- **`/bye`**：退出当前对话并关闭模型（或按 `Ctrl + D`）。
    
- **`/?`**：查看所有的交互指令帮助。
    
- **`/set verbose`**：显示生成详情（如每秒生成的 Token 数、总耗时等）。
    
- **`/set parameter num_ctx 4096`**：临时调整上下文窗口大小。
    
- **`"""` (三引号)**：用于输入多行文本（例如粘贴一段长代码）。
    

---

### 4. 进阶使用：环境变量配置

如果你发现 C 盘空间不够，可以通过设置环境变量来更改模型存放位置：

1. **Windows**: 在系统环境变量中新建 `OLLAMA_MODELS`，变量值为你想要存放的路径（如 `D:\OllamaModels`）。
    
2. **macOS/Linux**: 在 `.bashrc` 或 `.zshrc` 中添加 `export OLLAMA_MODELS="/path/to/models"`。
    
3. **重启 Ollama**: 设置后需要彻底退出并重启 Ollama 才能生效。
    

### 推荐入门模型

- **`ollama run llama3.2`** (轻量级，性能均衡)
    
- **`ollama run qwen2.5`** (阿里出品，中文能力极强)
    
- **`ollama run deepseek-r1`** (适合推理、逻辑和编程任务)