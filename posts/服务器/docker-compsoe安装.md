---
title: docker-compsoe安装
date: '2025-11-16 00:00:00+08:00'
category: Linux
tags:
- docker
draft: false
author: Crain
---
从截图来看，`docker-compose --version` 的输出表明你的 Docker Compose 版本为 **1.29.2**，但构建信息显示为 `build unknown`。

这是因为使用系统包管理器（如 `apt`）安装的 Docker Compose 可能缺少构建元数据。这通常不会影响 Docker Compose 的正常使用。

### 如果需要升级到最新版本：

可以安装官方提供的独立版本。以下是步骤：

1. **移除旧版本**（可选，但建议）：
    
    ```bash
    apt remove docker-compose
    ```
    
2. **下载安装最新版本**：
    
    ```bash
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    ```
    
3. **赋予执行权限**：
    
    ```bash
    chmod +x /usr/local/bin/docker-compose
    ```
    
4. **验证安装**：
    
    ```bash
    docker-compose --version
    ```
    

### 注意事项：

- 如果你不需要新功能或特性，当前版本 1.29.2 已经可以正常工作。
- 最新版的 Docker Compose 是以插件形式存在的 `docker compose`（而非 `docker-compose`），可以通过更新 Docker CLI 获取。


![[Pasted image 20241126111221.png]]

1. 你下载的 Docker Compose 安装路径是 `/usr/local/bin/docker-compose`，而系统尝试从 `/usr/bin/docker-compose` 运行程序。
2. 这通常是因为旧版本或其他程序的配置指向了错误的路径。

---

### 解决方案：

1. **验证文件是否存在：**
    
    ```bash
    ls -l /usr/local/bin/docker-compose
    ```
    
    如果文件存在并显示为可执行文件，说明安装成功。
    
2. **添加软链接：** 将新安装的 Docker Compose 链接到 `/usr/bin/`：
    
    ```bash
    ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
    ```
    
3. **再次验证版本：**
    
    ```bash
    docker-compose --version
    ```
    

---

### 可选优化：

如果你发现系统有多个 Docker Compose 安装路径，可以清理旧版本或检查环境变量：

```bash
which docker-compose
```

确保使用的是正确的可执行文件路径。

尝试以上步骤后，如果还有问题，欢迎随时告知！