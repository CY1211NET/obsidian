---
title: ssh链接及其参数
date: '2024-10-12 00:00:00+08:00'
category: Linux
tags:
- Linux
- ssh
draft: false
author: Crain
---
当然可以，下面是一篇系统、清晰、可直接用作技术文档的说明，内容涵盖 **SSH 公钥登录启用步骤** 与 **配置文件详解**，适用于 Linux 服务器（如 Ubuntu、CentOS、Debian、Rocky 等），并强调了安全性与最佳实践。

---

# SSH 公钥登录配置与参数详解

## 一、概述

SSH（Secure Shell）是一种加密的远程连接协议，用于安全地登录远程服务器。传统的用户名+密码登录方式容易遭受暴力破解攻击，因此 **使用公钥认证**（Public Key Authentication）是现代服务器的推荐方案。

公钥登录的核心思想是：

- 客户端生成一对密钥（公钥 + 私钥）；
    
- 服务器保存公钥；
    
- 客户端通过私钥证明身份，无需输入密码即可安全登录。
    

---

## 二、启用 SSH 公钥登录的步骤

### 1. 客户端生成密钥对

在你自己的电脑（客户端）上执行：

```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

参数说明：

- `-t rsa`：指定密钥类型为 RSA（也可用 `ed25519`，更安全）。
    
- `-b 4096`：密钥长度（越长越安全）。
    
- `-C`：密钥注释（通常是邮箱或说明信息）。
    

执行后系统会提示保存位置（默认是 `~/.ssh/id_rsa` 和 `~/.ssh/id_rsa.pub`）：

- `id_rsa`：私钥（需妥善保管，**绝对不要泄露**）
    
- `id_rsa.pub`：公钥（可以安全地复制到服务器）
    

---

### 2. 将公钥复制到服务器

推荐使用 `ssh-copy-id` 命令自动完成：

```bash
ssh-copy-id -i ~/.ssh/id_rsa.pub root@服务器IP
```

系统会提示输入 root 密码，成功后公钥会被添加到：

```
/root/.ssh/authorized_keys
```

如果你的系统没有 `ssh-copy-id`，可以手动复制：

```bash
# 在客户端查看公钥
cat ~/.ssh/id_rsa.pub

# 在服务器上执行以下命令（确保目录存在）
mkdir -p /root/.ssh
chmod 700 /root/.ssh
echo "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQ..." >> /root/.ssh/authorized_keys
chmod 600 /root/.ssh/authorized_keys
chown -R root:root /root/.ssh
```

---

### 3. 修改 SSH 配置文件

编辑服务器的配置文件：

```bash
sudo nano /etc/ssh/sshd_config
```

常见路径：

- Ubuntu/Debian：`/etc/ssh/sshd_config`
    
- CentOS/RHEL：`/etc/ssh/sshd_config`
    

确认或修改以下配置项：

```
# 是否启用公钥认证
PubkeyAuthentication yes

# 允许 root 登录
PermitRootLogin prohibit-password

# 禁用密码登录（推荐，只允许公钥）
PasswordAuthentication no

# 禁止空密码账户
PermitEmptyPasswords no

# 日志记录级别
LogLevel INFO

# 提高登录速度（禁用 DNS 反查）
UseDNS no
```

> **注意：**
> 
> - 如果你尚未复制公钥，请先复制完再禁用密码登录，否则可能会锁死自己。
>     
> - `PermitRootLogin prohibit-password` 表示允许 root 用公钥登录，但禁止密码。
>     

保存后，重启 SSH 服务：

```bash
# Ubuntu/Debian
sudo systemctl restart ssh

# CentOS/RHEL
sudo systemctl restart sshd
```

---

### 4. 客户端测试连接

```bash
ssh root@服务器IP
```

如果使用了非默认端口（例如 2222）：

```bash
ssh -p 2222 root@服务器IP
```

首次登录时若不需输入密码，即表示公钥认证成功。

---

## 三、sshd_config 配置参数详解

以下是 SSH 服务配置文件中常见关键参数说明：

|参数名|示例值|作用说明|
|---|---|---|
|`Port`|22|SSH 服务监听端口（可修改为 2222 提高安全性）|
|`ListenAddress`|0.0.0.0|指定监听地址（可限制仅内网访问）|
|`PermitRootLogin`|`yes` / `no` / `prohibit-password`|是否允许 root 登录|
|`PasswordAuthentication`|`yes` / `no`|是否允许密码登录|
|`PubkeyAuthentication`|`yes` / `no`|是否启用公钥认证|
|`AuthorizedKeysFile`|`.ssh/authorized_keys`|指定公钥文件路径|
|`PermitEmptyPasswords`|`no`|是否允许空密码（必须为 no）|
|`ChallengeResponseAuthentication`|`no`|禁用质询应答认证|
|`UsePAM`|`yes`|是否使用 PAM 模块进行登录控制|
|`LoginGraceTime`|60|登录超时（秒）|
|`MaxAuthTries`|3|最大认证尝试次数|
|`MaxSessions`|10|每个连接允许的最大会话数|
|`AllowUsers`|`user1 user2`|仅允许指定用户登录|
|`UseDNS`|`no`|禁止反向 DNS 查询，加快登录速度|
|`SyslogFacility`|`AUTHPRIV`|SSH 日志分类|
|`LogLevel`|`INFO` / `VERBOSE` / `DEBUG`|控制日志详细程度|

---

## 四、安全建议

1. **关闭密码登录**：  
    完成公钥配置后，将 `PasswordAuthentication` 设为 `no`。
    
2. **修改默认端口**：  
    改成非 22，例如：
    
    ```bash
    Port 2222
    ```
    
3. **限制登录用户**：  
    可通过 `AllowUsers` 指定允许 SSH 登录的账户：
    
    ```
    AllowUsers root admin
    ```
    
4. **开启防火墙规则**：  
    Ubuntu：
    
    ```bash
    sudo ufw allow 2222/tcp
    sudo ufw reload
    ```
    
    CentOS：
    
    ```bash
    sudo firewall-cmd --permanent --add-port=2222/tcp
    sudo firewall-cmd --reload
    ```
    
5. **启用 fail2ban 防暴力破解**：  
    安装并配置 fail2ban，可自动封禁多次失败的 IP。
    

---

## 五、常见问题排查

|问题|可能原因|解决方案|
|---|---|---|
|无法登录（提示“Permission denied”）|`authorized_keys` 权限错误|确保 `/root/.ssh` 为 700、`authorized_keys` 为 600|
|登录卡顿|DNS 反查导致|在 sshd_config 设置 `UseDNS no`|
|修改配置后服务无法启动|语法错误|用 `sshd -t` 检查配置语法|
|公钥不生效|公钥文件路径不对|确认 `AuthorizedKeysFile` 指向 `.ssh/authorized_keys`|

---

## 六、总结

启用 SSH 公钥登录能显著提升服务器安全性：

- 无需密码，防止暴力破解；
    
- 登录速度快，支持多层信任机制；
    
- 配合 `PermitRootLogin prohibit-password` 实现安全的 root 登录；
    
- 建议同时启用防火墙、fail2ban、日志监控，形成完整防护体系。
    

---

是否希望我帮你把这篇内容排成一份可发布的 Markdown 教程（带代码高亮与目录）？  
这样你可以直接放进博客、Wiki 或运维手册中使用。
version: '3.8'

services:
  waline:
    image: lizheming/waline:latest
    container_name: waline
    restart: always
    ports:
      - "8360:8360"
    environment:
      TZ: "Asia/Shanghai"

      # 指向“你已安装”的 MySQL
      MYSQL_HOST: 172.28.58.126
      MYSQL_PORT: 3306
      MYSQL_USER: "Crain"
      MYSQL_PASSWORD: "ryL4pHScWHBp3eih"
      MYSQL_DB: "waline"
      MYSQL_PREFIX: "wl_"
      # MYSQL_SSL: "false"   # 如需 SSL 改为 "true" 并配置证书

      SITE_NAME: "你的站点名称"
SITE_URL: "http://47.114.103.174:8360"      # Waline 对外访问地址（若有反代则调成 https://域名）
SECURE_DOMAINS: "47.114.103.174"            # 或者 "47.114.103.174:80" 等，写成前端访问地址
JWT_TOKEN: "随机且保密的长字符串"
AUTHOR_EMAIL: "你的管理员邮箱"




```
docker run -d \
  --name waline \
  -p 8360:8360 \
  -e LEAN_ID=xxx \
  -e LEAN_KEY=xxx \
  -e MYSQL_HOST=172.28.58.126 \
  -e MYSQL_USER=Crain \
  -e MYSQL_PASSWORD=ryL4pHScWHBp3eih\
  -e MYSQL_DB=waline \
  -e SITE_URL=http://47.114.103.174:4399 \
  -v /data/waline:/app/data \
  lizheming/waline

```