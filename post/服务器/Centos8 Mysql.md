---
title: Centos8-Mysql安装
date: '2023-11-16 00:00:00+08:00'
updated: '2025-11-16'
category: Liunx
tags:
- sql
- centos
draft: false
author: Crain
---


### 1. 安装 MySQL 官方仓库

CentOS 8 默认没有提供 MySQL 的官方仓库，而是使用 MariaDB。首先需要安装 MySQL 官方仓库。

```bash
wget https://dev.mysql.com/get/mysql80-community-release-el8-1.noarch.rpm
sudo rpm -ivh mysql80-community-release-el8-1.noarch.rpm
```

### 2. 安装 MySQL

添加完仓库后，可以通过 `dnf` 命令来安装 MySQL 8.0。

```bash
sudo dnf install mysql-server
```

### 3. 启动 MySQL 服务

安装完成后，需要启动 MySQL 服务，并设置为开机自启动。

```bash
sudo systemctl start mysqld
sudo systemctl enable mysqld
```

### 4. 查看 MySQL 服务状态

确保 MySQL 服务已成功启动。

```bash
sudo systemctl status mysqld
```

### 5. 获取临时根密码

MySQL 安装完成后，会为 `root` 用户生成一个临时密码。你可以通过以下命令查看该密码：

```bash
sudo grep 'temporary password' /var/log/mysqld.log
```

### 6. 安全配置 MySQL

使用 `mysql_secure_installation` 命令来进行基本的安全设置，比如修改 `root` 密码，删除匿名用户，禁止远程登录等。

```bash
sudo mysql_secure_installation
```

按照提示输入你获取到的临时密码，然后设置新的 `root` 密码，并选择其他安全选项。

### 7. 登录 MySQL

使用 `root` 用户登录 MySQL。

```bash
mysql -u root -p
```

输入你设置的 `root` 密码后，就可以进入 MySQL 的命令行界面了。
### 8.远程登陆mysql
要在 MySQL 中开启远程连接，通常需要完成三个步骤：**修改监听地址**、**授予用户远程权限** 以及 **配置防火墙**。

根据你之前的截图，如果你是在 Linux 宿主机上直接运行 MySQL，请按照以下步骤操作：

---

### 1. 修改配置文件 (bind-address)

默认情况下，MySQL 只监听 `127.0.0.1`（本地回环）。你需要让它监听所有 IP。

1. 打开配置文件（通常在 `/etc/mysql/mysql.conf.d/mysqld.cnf` 或 `/etc/mysql/my.cnf`）：
    
    
    
    ```Bash
    vim /etc/mysql/mysql.conf.d/mysqld.cnf
    ```
    
2. 找到 `bind-address` 这一行，将其修改为：
    
    
    
    ```Ini, TOML
    bind-address = 0.0.0.0
    ```
    
3. 保存退出并**重启 MySQL 服务**：
    
 
    
    ```Bash
    systemctl restart mysql
    ```
    

---

### 2. 授予用户远程访问权限

你需要告诉 MySQL，允许某个用户从远程 IP 登录。

1. 进入 MySQL 命令行：
    
    
    
    ```Bash
    mysql -u root -p
    ```
    
2. 执行以下 SQL 语句（将 `your_password` 换成你的实际密码）：
    
    
    
    ```SQL
    -- 创建用户并允许从任何 IP (%) 连接
    CREATE USER 'root'@'%' IDENTIFIED BY 'your_password';
    
    -- 授予所有数据库的所有权限
    GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
    
    -- 刷新权限使之生效
    FLUSH PRIVILEGES;
    ```
    
    _> **注意**：出于安全考虑，生产环境建议将 `%` 替换为具体的远程 IP 地址，并避免直接使用 root 用户进行远程连接。_
    

---

### 3. 配置防火墙

如果你的服务器开启了防火墙（如 `ufw` 或云服务器的安全组），需要放行 **3306** 端口。

- **如果是 ufw：**
    
    Bash
    
    ```
    ufw allow 3306/tcp
    ```
    
- **如果是云服务器（如阿里云、腾讯云）：**
    
    请登录控制台，在“安全组”中添加一条入站规则，允许 TCP 协议的 3306 端口。
    

---

### 💡 如果你的 MySQL 是在 Docker 中运行

看你之前有 `elasticsearch` 的 Docker 容器，如果 MySQL 也是 Docker 运行的，情况会有所不同：

1. **映射端口**：启动容器时必须使用 `-p 3306:3306`。
    
2. **无需改 bind-address**：大部分官方 MySQL 镜像默认已经配置为 `0.0.0.0`。
    
3. **权限**：依然需要执行上面的 `GRANT` 语句。
    

你现在的 MySQL 是直接装在 Linux 系统上的，还是也是一个 Docker 容器？

### 8. 配置防火墙（可选）

如果你需要远程访问 MySQL 数据库，可能需要打开 MySQL 的端口（默认是 3306）。

```bash
sudo firewall-cmd --zone=public --add-port=3306/tcp --permanent
sudo firewall-cmd --reload
```

