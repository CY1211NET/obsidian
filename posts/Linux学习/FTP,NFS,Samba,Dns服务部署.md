---
title: FTP,NFS,Samba,Dns服务部署
date: '2025-06-19'
category: Linux学习
tags:
- Linux
draft: false
author: Crain
---
以下是根据你提供的实验内容，整理出的 **Ubuntu系统下的对应实验步骤汇总**，涵盖了 Samba、NFS、FTP、DNS、Web 服务的安装与配置过程，适用于教学实验环境。

---

## 一、Samba 服务配置（Windows 客户端访问 Ubuntu 共享）

### 步骤：

1. **安装 Samba**
    
    ```bash
    sudo apt update
    sudo apt install samba
    smbd -V   # 查看版本
    ```
    
2. **创建共享目录并设置权限**
    
    ```bash
    sudo mkdir -p /srv/samba/share
    sudo chmod 777 /srv/samba/share
    ```
    
3. **配置 `/etc/samba/smb.conf`**  
    在文件末尾添加：
    
``` ini
    [share]
    path = /srv/samba/share
    read only = no
    guest ok = yes
```

4. **创建 Samba 用户**（系统中该用户必须存在）
    
    ```bash
    sudo smbpasswd -a yourusername
    ```
    
5. **重启 Samba 服务**
    
    ```bash
    sudo systemctl restart smbd
    ```
    
6. **在 Windows 上访问**  
    浏览器或资源管理器输入：
    
    ```
    \\Ubuntu_IP\share
    ```
    

---

## 二、NFS 服务配置（Ubuntu ↔ Ubuntu）

### 服务器端配置（server）：

1. **安装 NFS 服务**
    
    ```bash
    sudo apt install nfs-kernel-server
    ```
    
2. **创建共享目录并设置权限**
    
    ```bash
    sudo mkdir -p /home/ubuntu/myshare
    sudo chmod 777 /home/ubuntu/myshare
    ```
    
3. **配置 `/etc/exports`**
    
    ```bash
    sudo nano /etc/exports
    ```
    
    添加：
    
    ```
    /home/ubuntu/myshare  *(rw,sync,no_subtree_check)
    ```
    
4. **启动 NFS 服务**
    
    ```bash
    sudo systemctl restart nfs-kernel-server
    ```
    
5. **查看共享目录**
    
    ```bash
    showmount -e
    ```
    

### 客户端配置（client）：

6. **安装 NFS 客户端工具**
    
    ```bash
    sudo apt install nfs-common
    ```
    
7. **验证连接**
    
    ```bash
    showmount -e <server_ip>
    ```
    
8. **挂载目录测试**
    
    ```bash
    sudo mkdir /mnt/othershare
    sudo mount 192.168.194.138:/home/ubuntu/myshare /mnt/othershare
    cd /mnt/othershare
    touch mytest.txt
    ```
    
9. **服务端查看**
    
    ```bash
    ls /home/ubuntu/myshare
    ```
    
10. **取消挂载**
    

```bash
sudo umount /mnt/othershare
```

---

## 三、FTP 服务配置（允许匿名与本地用户）

### 1. 安装 FTP 服务

```bash
sudo apt update
sudo apt install vsftpd
vsftpd -version
```

### 2. 修改配置文件

```bash
sudo nano /etc/vsftpd.conf
```

设置：

```ini
anonymous_enable=YES
local_enable=YES
write_enable=YES
anon_root=/home/ftp
```

创建文件目录：

```bash
sudo mkdir -p /home/ftp/up
sudo chmod 777 /home/ftp/up
echo "Hello FTP" | sudo tee /home/ftp/testftp.txt
```

### 3. 重启服务并测试

```bash
sudo systemctl restart vsftpd
```

使用 Windows 或 FileZilla 登录：

```
ftp://<Ubuntu_IP>
```

---

## 四、DNS 服务器配置（BIND9）

好的，以下是 **基于 Ubuntu 22.04** 环境下，使用 BIND9 搭建局域网 DNS 服务器的完整部署步骤，以及配置客户端和常见错误排查，帮助你快速搭建和排除问题。

---


---

### 1. DNS 服务器（192.168.194.138）配置

### 1.1 安装 BIND9

```bash
sudo apt update
sudo apt install bind9 bind9utils bind9-doc
```

### 1.2 配置主配置文件 `/etc/bind/named.conf.local`

编辑文件：

```bash
sudo nano /etc/bind/named.conf.local
```

添加：

```conf
zone "mytest.com" {
    type master;
    file "/etc/bind/db.mytest.com";
};

zone "194.168.192.in-addr.arpa" {
    type master;
    file "/etc/bind/db.194.168.192";
};
```

### 1.3 准备区域文件

#### 1.3.1 创建正向解析文件 `/etc/bind/db.mytest.com`

复制模板：

```bash
sudo cp /etc/bind/db.local /etc/bind/db.mytest.com
sudo nano /etc/bind/db.mytest.com
```

修改内容为：

```dns
$TTL 604800
@       IN      SOA     ns.mytest.com. root.mytest.com. (
                              2         ; Serial (更新时递增)
                         604800         ; Refresh
                          86400         ; Retry
                        2419200         ; Expire
                         604800 )       ; Negative Cache TTL
;
@       IN      NS      ns.mytest.com.
ns      IN      A       192.168.194.138
www     IN      A       192.168.194.139
```

#### 1.3.2 创建反向解析文件 `/etc/bind/db.194.168.192`

```bash
sudo cp /etc/bind/db.127 /etc/bind/db.194.168.192
sudo nano /etc/bind/db.194.168.192
```

修改内容：

```dns
$TTL 604800
@       IN      SOA     ns.mytest.com. root.mytest.com. (
                              2         ; Serial
                         604800
                          86400
                        2419200
                         604800 )
;
@       IN      NS      ns.mytest.com.
138     IN      PTR     ns.mytest.com.
139     IN      PTR     www.mytest.com.
```

### 1.4 检查配置文件语法并重启服务

```bash
sudo named-checkconf
sudo named-checkzone mytest.com /etc/bind/db.mytest.com
sudo named-checkzone 194.168.192.in-addr.arpa /etc/bind/db.194.168.192
sudo systemctl restart bind9
sudo systemctl status bind9
```

---

### 2. 目标主机（192.168.194.139）

- 只需确保 IP 地址静态，网络可达。
    
- 可运行 web 或其他服务供访问。
    

---

### 3. 客户端（192.168.194.140）配置

### 3.1 配置静态 IP 和 DNS

编辑 Netplan 配置：

```bash
sudo nano /etc/netplan/00-installer-config.yaml
```

内容示例：

```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    ens33:                   # 修改为你的网卡名
      dhcp4: no
      addresses: [192.168.194.140/24]
      gateway4: 192.168.194.1
      nameservers:
        addresses: [192.168.194.138]
```

应用配置：

```bash
sudo netplan apply
```

### 3.2 关闭 systemd-resolved 干扰

```bash
sudo systemctl stop systemd-resolved
sudo systemctl disable systemd-resolved
sudo rm /etc/resolv.conf
echo "nameserver 192.168.194.138" | sudo tee /etc/resolv.conf
sudo chattr +i /etc/resolv.conf   # 防止自动覆盖（可选）
```

---

### 4. 测试

- 在客户端执行：
    

```bash
ping www.mytest.com
dig www.mytest.com
dig -x 192.168.194.139
```

- 在服务器执行：
    

```bash
dig @localhost www.mytest.com
```

---

### 二、常见错误与排查

|错误现象|可能原因|解决方案|
|---|---|---|
|ping 域名返回公网 IP|DNS 服务器 zone 名配置不匹配|确认客户端访问域名与 DNS zone 一致|
|ping 域名解析失败|客户端 DNS 配置错误或未生效|检查客户端 `/etc/resolv.conf`，关闭 systemd-resolved|
|dig 查询无结果|BIND 配置文件语法错误|使用 `named-checkconf` 和 `named-checkzone` 检查配置|
|BIND9 服务未运行|服务未启动或崩溃|`sudo systemctl restart bind9`|
|客户端无法访问 DNS 服务器|防火墙阻止53端口 UDP/TCP|放行防火墙端口，如 `sudo ufw allow 53`|
|反向解析失败|反向区域配置错误或未声明|检查反向区域配置和文件|
|`/etc/resolv.conf` 被覆盖|systemd-resolved 管理|关闭 systemd-resolved 或修改 Netplan DNS 配置|

---

### 三、总结

- **确保域名一致**：DNS 配置的 zone 和客户端访问的域名必须匹配。
    
- **关闭 systemd-resolved**：避免系统自动覆盖 DNS 设置，确保使用指定 DNS 服务器。
    
- **检查防火墙**：开放 DNS 服务端口，确保客户端能访问 DNS。
    
- **配置文件语法校验**：使用 BIND 自带工具检查配置，防止语法错误导致服务异常。
    
- **静态 IP 配置准确**：服务器、客户端均需静态 IP 保持网络稳定。
    

---

## 五、WEB服务器（JDK + Tomcat）


---

### Tomcat 安装与配置总结（Ubuntu 系统）

---

### 1. 环境准备

- 安装 Java（JDK 或 JRE），Tomcat 依赖 Java 运行环境
    
    ```bash
    sudo apt update
    sudo apt install openjdk-11-jdk -y
    ```
    
- 验证 Java 安装
    
    ```bash
    java -version
    ```
    

---

### 2. 安装 Tomcat

- 使用系统包管理器安装 Tomcat9（推荐）
    
    ```bash
    sudo apt install tomcat9 -y
    ```
    

---

### 3. 配置环境变量

- 确认 `JAVA_HOME` 设置（Tomcat 默认配置文件 `/etc/default/tomcat9`）
    
- 编辑文件设置 JAVA_HOME
    
    ```bash
    sudo nano /etc/default/tomcat9
    ```
    
- 添加或修改
    
    ```
    JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
    ```
    
- 保存后退出
    

---

### 4. 启动并设置开机启动

```bash
sudo systemctl start tomcat9
sudo systemctl enable tomcat9
sudo systemctl status tomcat9
```

---

### 5. 防火墙设置

- 允许 Tomcat 默认端口 8080
    
    ```bash
    sudo ufw allow 8080/tcp
    sudo ufw reload
    ```
    

---

### 6. 访问验证

- 通过浏览器访问
    
    ```
    http://服务器IP:8080/
    ```
    
- 显示 Tomcat 欢迎页面即表示成功
    

---

## 7. 常见问题及解决

|问题|解决方案|
|---|---|
|Tomcat 启动失败|检查 JAVA_HOME 是否正确配置|
|服务端口被占用|检查 8080 端口使用情况，修改端口或释放端口|
|防火墙阻止访问|配置防火墙放行端口 8080|
|无法访问 Web 页面|确认 Tomcat 已启动且无报错|

---

## 8. 额外配置（管理后台）

- 修改 `/etc/tomcat9/tomcat-users.xml` 添加管理账号和权限
    
- 访问 `/manager/html` 管理页面（默认未开启）
    

---

这份总结覆盖了安装、启动、访问、问题排查的全流程，适合 Ubuntu 下快速部署 Tomcat。  
如果需要详细脚本或管理后台配置，随时告诉我。