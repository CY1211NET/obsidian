---
author: Crain
date: 2023-05-14
title: Ollama开放API
tags:
  - AI
  - Ollama
  - "#LLM"
emaili: y252840@163.com
updated:
category: AI
---


默认情况下，Ollama 仅监听在 `127.0.0.1:11434`，这意味着只有你的本机可以访问。

---

## 1. 修改环境变量（核心步骤）

开放 API 的关键在于设置环境变量 `OLLAMA_HOST` 为 `0.0.0.0`，这表示监听所有网络接口。

### Windows 操作系统

1. 在任务栏搜索框输入 **“环境变量”**，选择“编辑系统环境变量”。
    
2. 点击 **“环境变量”** 按钮。
    
3. 在 **“用户变量”** 或 **“系统变量”** 中点击“新建”：
    
    - 变量名：`OLLAMA_HOST`
        
    - 变量值：`0.0.0.0`
        
4. **非常重要**：在任务栏右下角找到 Ollama 图标，点击 **Quit Ollama** 退出，然后重新启动它。
    

### macOS 操作系统

1. 打开终端，输入以下命令临时设置并启动：
    
    Bash
    
    ```
    OLLAMA_HOST=0.0.0.0 ollama serve
    ```
    
2. 若要永久生效，需在 `~/.zshrc` 或 `~/.bash_profile` 中添加 `export OLLAMA_HOST=0.0.0.0`。
    

### Linux 操作系统

1. 如果使用 `systemd` 管理服务，执行：
    
    Bash
    
    ```
    sudo systemctl edit ollama.service
    ```
    
2. 在打开的文件中添加以下内容：
    
    Ini, TOML
    
    ```
    [Service]
    Environment="OLLAMA_HOST=0.0.0.0"
    ```
    
3. 保存并退出，然后重载并重启服务：
    
    Bash
    
    ```
    sudo systemctl daemon-reload
    sudo systemctl restart ollama
    ```
    

---

## 2. 配置跨域访问 (CORS)

如果你打算从网页浏览器（例如自己开发的 Web 前端）调用 API，还需要开启跨域支持。

- **变量名**：`OLLAMA_ORIGINS`
    
- **变量值**：`*` （允许所有来源）或者指定具体的域名。
    

---

## 3. 测试 API 是否开放成功

在另一台设备或本机终端运行以下命令（将 `<Your-IP>` 替换为运行 Ollama 电脑的局域网 IP）：

Bash

```
curl http://<Your-IP>:11434/api/tags
```

如果返回了你本地模型的 JSON 列表数据，说明 API 已成功开放。

---

## 4. 安全提醒

- **无身份验证**：Ollama 的原生 API 目前**没有**内置密码保护或 API Key。
    
- **风险**：一旦你将 `OLLAMA_HOST` 设置为 `0.0.0.0` 并在防火墙开启了 $11434$ 端口，任何能连接到你 IP 的人都可以使用你的算力。
    
- **建议**：
    
    - 仅在局域网内开放。
        
    - 如果需要外网访问，强烈建议在前面加一个 **Nginx 反向代理**并配置 `auth_basic`（账号密码）或使用 VPN/内网穿透工具。
        

## 5. 常用 API 端点示例

Ollama 兼容部分 OpenAI 格式，最常用的端点是：

- **生成对话**：`POST /api/chat`
    
- **生成补全**：`POST /api/generate`
    
- **OpenAI 兼容接口**：`POST /v1/chat/completions`
    
