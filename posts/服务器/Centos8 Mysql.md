---
title: Centos8 Mysql
date: '2025-11-16 00:00:00+08:00'
updated: '2025-11-16'
category: Liunx
tags:
- sql
- centos
draft: false
author: Crain
---
在 CentOS 8 上安装 MySQL 的步骤如下：

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

### 8. 配置防火墙（可选）

如果你需要远程访问 MySQL 数据库，可能需要打开 MySQL 的端口（默认是 3306）。

```bash
sudo firewall-cmd --zone=public --add-port=3306/tcp --permanent
sudo firewall-cmd --reload
```

这样，MySQL 就安装并配置完成了。如果你有其他问题或需要进一步帮助，请告诉我！