---
title: Cursor-MCP-数据库
date: 2025-11-16T00:00:00+08:00
updated: 2025-11-26T00:00:00+08:00
author: Crain
email: y252840@163.com
category: MCP
tags:
  - Cursor
  - MCP
---

Cursor 的 MCP（Model Context Protocol）功能允许开发者通过配置 MCP 服务器扩展 AI 工具的能力，以下是详细使用指南：

### 一、基础配置步骤

1. ​**​安装依赖环境​**​
    
    - 确保已安装 Node.js（v18+）和 Git。
    - 升级 Cursor 至最新版本（Early Access 版支持完整 MCP 功能）。
2. ​**​添加 MCP 服务器​**​
    
    - 进入 Cursor 设置 → Features → MCP，点击 ​**​"+ Add New MCP Server"​**​。
    - 选择传输类型：
        - `stdio`：本地命令行工具（如文件操作）
        - `sse`/`WebSocket`：实时数据服务（如网络搜索）。
3. ​**​配置文件示例​**​  
    在项目根目录创建 `.cursor/mcp.json`，参考以下格式：
    
    `{     "mcpServers": {       "web-search": {         "command": "npx",         "args": ["-y", "@smithery/cli@latest", "run", "@mzxrai/mcp-webresearch"]       }     }   }`
    

### 二、热门 MCP 工具配置

1. ​**​Web 搜索工具​**​
    
    - 命令：`npx -y @smithery/cli@latest run @mzxrai/mcp-webresearch`。
    - 支持关键词搜索（如 `cursor mcp server`），返回实时结果。
2. ​**​Brave 搜索（隐私保护）​**​
    
    - 需注册 Brave Search API 获取密钥：
    
    `"args": ["run", "@smithery-ai/brave-search", "--config", "{\"braveApiKey\":\"YOUR_KEY\"}"]`
    
3. ​**​GitHub 操作​**​
    
    - 配置 GitHub MCP 服务器需个人访问令牌（PAT）：
    
    `"env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "your_token" }`
    

### 三、使用技巧

- ​**​调用方式​**​：在 Cursor 的聊天框（左下角 "Edit" 面板）输入指令，如：  
    `@agent Search latest news about MCP`。
- ​**​调试建议​**​：若服务器未响应，检查 Node.js 环境或通过 Cursor AI 输入 `帮我排查 MCP 连接问题`。

### 四、注意事项

- MCP 工具仅限 ​**​Composer Agent​**​ 使用（新版 Cursor 中更名为 "Edit" 面板）。
- Windows 用户需确保命令行工具（如 PowerShell）有执行权限。

更多配置参考：Cursor 官方文档。


```json 
{   "mcpServers": {      

  "MySQL": {      //对应的工具名称  

    "disabled": false,        

    "timeout": 60,         "command": "npx",        

    "args": [          

      "mcprunner",          

    "MYSQL_HOST=118.145.187.193",          

    "MYSQL_PORT=3306",          

     "MYSQL_USER=username",          

     "MYSQL_PASS=123456",          

     "MYSQL_DB=doc_system",          

      "ALLOW_INSERT_OPERATION=true",          

      "ALLOW_UPDATE_OPERATION=true",          

     "ALLOW_DELETE_OPERATION=false",          

      "--",           "npx",           "-y",          

      "@benborla29/mcp-server-mysql"        

     ]    

       }, //以逗号分隔

       "高德": {   //对应的服务名称

        "url": "https://mcp.amap.com/sse?key=5f70d3e999cdd764cb2587c16daf01ff"

      }

       }

  
  

      }
```