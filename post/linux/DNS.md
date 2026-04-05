---
title: DNS
date: '2025-06-20'
category: Linux
tags:
- Linux
draft: false
author: Crain
---
下面为你详细整理 **三台 Ubuntu 主机（或虚拟机）** 在本地 DNS 服务器配置实验中的完整配置与操作步骤，IP 地址使用你提供的：

- **DNS服务器**：`192.168.194.138`
    
- **被解析主机**：`192.168.194.139`
    
- **客户端**：`192.168.194.140`
    

---

## 🖥️ 一、DNS服务器（192.168.194.138）

### 🔧 1.1 设置静态 IP 地址

```bash
sudo nano /etc/network/interfaces
```

添加：

```ini
auto lo
iface lo inet loopback

auto ens33
iface ens33 inet static
    address 192.168.194.138
    netmask 255.255.255.0
    gateway 192.168.194.1
```

保存并执行：

```bash
sudo systemctl restart networking
```

---

### 🔧 1.2 安装 BIND9

```bash
sudo apt update
sudo apt install bind9 -y
```

验证安装：

```bash
dpkg -l bind9
```

---

### 🔧 1.3 配置主配置文件 `/etc/bind/named.conf.local`

```bash
sudo nano /etc/bind/named.conf.local
```

添加内容：

```bash
zone "mytest.com" {
    type master;
    file "/var/cache/bind/db.mytest.com";
};

zone "194.168.192.in-addr.arpa" {
    type master;
    notify no;
    file "/var/cache/bind/reverse/db.194.168.192";
};
```

---

### 🔧 1.4 创建区域数据文件

#### ① 创建目录并复制模板

```bash
sudo mkdir -p /var/cache/bind/reverse
sudo cp /etc/bind/db.local /var/cache/bind/db.mytest.com
sudo cp /etc/bind/db.127 /var/cache/bind/reverse/db.194.168.192
```

#### ② 编辑正向文件 `/var/cache/bind/db.mytest.com`

```bash
sudo nano /var/cache/bind/db.mytest.com
```

修改为：

```bash
$TTL    604800
@       IN      SOA     mytest.com. root.mytest.com. (
                            2         ; Serial
                       604800         ; Refresh
                        86400         ; Retry
                      2419200         ; Expire
                       604800 )       ; Negative Cache TTL
;
@       IN      NS      ns.mytest.com.
ns      IN      A       192.168.194.139
www     IN      A       192.168.194.139
```

#### ③ 编辑反向文件 `/var/cache/bind/reverse/db.194.168.192`

```bash
sudo nano /var/cache/bind/reverse/db.194.168.192
```

修改为：

```bash
$TTL    604800
@       IN      SOA     mytest.com. root.mytest.com. (
                            2         ; Serial
                       604800         ; Refresh
                        86400         ; Retry
                      2419200         ; Expire
                       604800 )       ; Negative Cache TTL
;
@       IN      NS      ns.mytest.com.
139     IN      PTR     www.mytest.com.
```

---

### 🔧 1.5 修改 DNS 指向本机

```bash
sudo nano /etc/resolv.conf
```

添加：

```bash
nameserver 127.0.0.1
```

如有 NetworkManager 自动覆盖，可运行：

```bash
sudo chattr +i /etc/resolv.conf
```

---

### 🔧 1.6 重启 BIND9 服务

```bash
sudo systemctl restart bind9
sudo systemctl status bind9
```

---

## 🖥️ 二、被解析主机（192.168.194.139）

### 🔧 2.1 设置静态 IP 地址

```bash
sudo nano /etc/network/interfaces
```

添加：

```ini
auto lo
iface lo inet loopback

auto ens33
iface ens33 inet static
    address 192.168.194.139
    netmask 255.255.255.0
    gateway 192.168.194.1
```

重启网卡：

```bash
sudo systemctl restart networking
```

---

### 🔧 2.2 设置主机名

```bash
sudo hostnamectl set-hostname ubox
```

---

### 🔧 2.3 （可选）搭建 HTTP 服务模拟目标主机

```bash
sudo apt install apache2 -y
```

此时你访问 `http://www.mytest.com` 实际就指向了此主机。

---

## 🖥️ 三、客户端（192.168.194.140）

### 🔧 3.1 设置静态 IP 地址

```bash
sudo nano /etc/network/interfaces
```

添加：

```ini
auto lo
iface lo inet loopback

auto ens33
iface ens33 inet static
    address 192.168.194.140
    netmask 255.255.255.0
    gateway 192.168.194.1
```

重启网卡：

```bash
sudo systemctl restart networking
```

---

### 🔧 3.2 设置 DNS 指向 DNS 服务器（138）

```bash
sudo nano /etc/resolv.conf
```

添加：

```bash
nameserver 192.168.194.138
```

如需防止被覆盖：

```bash
sudo chattr +i /etc/resolv.conf
```

---

## 🧪 四、测试操作与预期结果

### ✅ DNS服务器上测试

```bash
ping www.mytest.com           # 应返回 192.168.194.139
dig www.mytest.com
dig -x 192.168.194.139        # 反向解析测试
```

### ✅ 客户端上测试

```bash
ping www.mytest.com           # 应返回 192.168.194.139
dig www.mytest.com
nslookup www.mytest.com
```

### ✅ 模拟主机关机测试

关闭目标主机（139）后，在客户端上执行：

```bash
ping www.mytest.com
```

> 输出应提示 `Destination Host Unreachable`，但域名依然能解析（DNS缓存存在）。

---

是否需要我将这些配置生成 `.sh` 脚本供你快速部署？也可提供 `dig` 报文解析结果详解用于测试报告。