---
title: VMware配置ssh服务
date: '2025-06-16'
category: Linux
tags:
- Linux
draft: false
author: Crain
---
好的，以下是针对 Ubuntu 系统中 **SSH 服务的配置步骤及常见错误解决方案总结**，涵盖初学者常见问题、排错命令与进阶建议，便于你日后快速定位问题。

---

## ✅ 一、SSH 服务配置全流程（Ubuntu）

### 1. 安装 OpenSSH Server

```bash
sudo apt update
sudo apt install openssh-server
```

### 2. 启动 SSH 服务并设置开机自启

```bash
sudo systemctl start ssh
sudo systemctl enable ssh
```

### 3. 检查 SSH 服务状态

```bash
sudo systemctl status ssh
```

- **active (running)**：正常
    
- **inactive (dead)**：服务未运行，需手动启动
    

### 4. 查看是否监听 22 端口

```bash
sudo ss -tulnp | grep 22
# 或
sudo lsof -i :22
```

- 若无输出，说明服务未监听端口 → 需检查服务是否启动 / 配置文件错误
    

### 5. 开放防火墙端口（UFW 示例）

```bash
sudo ufw allow 22/tcp
sudo ufw enable       # 如果尚未启用
sudo ufw status       # 查看当前规则
```

---

## ⚠️ 二、常见错误及解决方案

|问题|表现|解决方案|
|---|---|---|
|服务未安装|`systemctl: not found` 或找不到服务|`sudo apt install openssh-server`|
|服务未运行|`status ssh` 显示 `inactive (dead)`|`sudo systemctl start ssh`|
|无监听端口|`ss -tulnp|grep 22` 无输出|
|防火墙阻断|SSH 客户端连接被拒绝|`sudo ufw allow 22/tcp` 并重启服务|
|配置语法错误|启动失败、无监听|`sudo sshd -t` 检查配置文件错误|
|被错误配置监听IP限制|只能本地访问|检查 `ListenAddress` 配置项，确保为 `0.0.0.0` 或未注释|
|使用非默认端口|客户端无法连接|修改 `Port` 并确保防火墙放行相应端口|
|SSH 连接被拒|`Connection refused` 或 `ECONNREFUSED`|目标主机无服务监听、IP错误、防火墙未放行|

---

## 🔍 三、连接测试命令

### 1. 本地端口连通性

```bash
nc -zv 127.0.0.1 22
# 或 bash 内置：
timeout 1 bash -c "</dev/tcp/127.0.0.1/22" && echo "OK" || echo "FAIL"
```

### 2. 外部测试 SSH 是否正常

```bash
ssh youruser@192.168.x.x -v   # -v 显示连接详细过程
```

---

## 🔧 四、配置文件路径及修改建议

配置文件路径：

```bash
/etc/ssh/sshd_config
```

### 常见可调整项：

```bash
Port 22
PermitRootLogin no
PasswordAuthentication yes
```

### 修改配置后，重启服务生效：

```bash
sudo systemctl restart ssh
```

---

## 🧪 五、完整一键调试流程（可直接复制执行）：

```bash
# 安装服务
sudo apt update && sudo apt install -y openssh-server

# 启动服务
sudo systemctl start ssh
sudo systemctl enable ssh

# 检查服务状态
sudo systemctl status ssh

# 检查监听端口
sudo ss -tulnp | grep ssh

# 放行防火墙端口
sudo ufw allow 22/tcp
sudo ufw enable
sudo ufw status

# 测试本地端口
nc -zv 127.0.0.1 22
```

---
