---
author: Crain
date: 2024-06-14
title: Linux基础运维以及问题排查
tags:
  - Linux
  - "#运维"
emaili: y252840@163.com
updated:
category: Linux
---


---

# 🐧 Linux 高频运维命令速查笔记

## 一、 文件与目录操作

### 1. 基础操作

- `ls -lh`：带权限和大小列表输出
    
- `chmod 755 f`：修改权限为 `rwxr-xr-x`
    
- `chown user:grp f`：修改所属用户和组
    

### 2. 查找命令

- `find / -name "*.log"`：全局查找后缀为 `.log` 的文件
    
- `find . -mtime -1`：查找 1 天内修改过的文件
    

### 3. 文本处理 (高频)

- **搜索**：`grep -rn "err" ./`（递归搜索关键词）
    
- **排除**：`grep -v "DEBUG"`（排除关键词）
    
- **提取列**：`awk '{print $1}'`（默认空格分隔，取第一列）
    
- **替换**：`sed 's/old/new/g'`（替换文本）
    

### 4. 压缩与传输

- `tar -czvf a.tar.gz dir/`：打包并压缩
    
- `tar -xzvf a.tar.gz`：解压
    
- `scp file user@host:/path`：远程复制
    
- `rsync -avz src/ dst/`：增量同步
    

---

## 二、 进程与性能监控

### 1. 进程管理

- `ps aux | grep nginx`：查看特定进程状态
    
- `kill -9 PID`：强制杀掉进程
    
- `top` / `htop`：实时监控系统状态
    

### 2. 性能排查

- `vmstat 1`：每秒刷新 CPU/内存/IO 统计
    
- `iostat -x 1`：详细磁盘 IO 详情
    
- `free -h`：内存使用情况
    
- `df -h`：磁盘空间占用情况
    
- `du -sh *`：各目录大小统计
    
- `lsof -p PID`：查看进程打开的文件
    

### 3. 日志查看

- `tail -f /var/log/app.log`：实时追踪日志内容
    
- `tail -n 100`：查看最后 100 行
    
- `journalctl -u nginx`：查看 systemd 服务日志
    
- `journalctl --since "1h ago"`：查看最近一小时日志
    

---

## 三、 网络诊断与配置

### 1. 网络检测

- `ss -tlnp`：查看监听端口及对应进程
    
- `netstat -antp`：查看所有 TCP 连接
    
- `ping` / `traceroute`：连通性与路由测试
    
- `curl -I http://host`：测试 HTTP 响应头
    
- `tcpdump -i eth0 port 80`：指定网卡和端口抓包
    

### 2. 防火墙 (Firewalld)

- `firewall-cmd --list-all`：查看规则
    
- `firewall-cmd --add-port=80/tcp --permanent`：永久开放端口
    
- `firewall-cmd --reload`：重载规则
    

---

## 四、 服务、用户与权限

### 1. Systemctl 服务管理

- `systemctl start/stop/restart nginx`：启停服务
    
- `systemctl status nginx`：查看服务状态
    
- `systemctl enable nginx`：设置开机自启
    

### 2. 用户管理

- `useradd -m username`：创建用户
    
- `passwd username`：设置密码
    
- `usermod -aG sudo username`：加入 sudo 组
    
- `visudo`：编辑 sudo 权限配置文件
    

---

## 五、 高频故障排查场景 (必考/必会)

### 1. CPU 飙高怎么办？

1. `top`：找最高 CPU 进程，记下 PID。
    
2. `ps -mp PID -o pid,tid,time,%cpu`：找该进程内最耗 CPU 的线程。
    
3. `jstack PID | grep -A5 "tid"`：如果是 Java 应用，查看线程堆栈。
    

### 2. 磁盘满了怎么办？

1. `df -h`：定位哪个分区满了。
    
2. `du -sh /* | sort -rh | head`：找出占用最大的前几个目录。
    
3. `find / -size +500M`：查找超大文件。
    
4. `journalctl --vacuum-size=500M`：清理系统日志。
    

### 3. 端口被占用怎么办？

1. `ss -tlnp | grep :8080`：查找进程。
    
2. `lsof -i :8080`：另一种方式查找。
    
3. `kill -9 $(lsof -t -i:8080)`：直接杀掉占用该端口的进程。
    

### 4. 内存不足 / OOM 怎么办？

1. `free -h`：看内存余量。
    
2. `dmesg | grep -i "oom"`：检查是否有 OOM Killer 杀死进程的历史记录。
    
3. `ps aux --sort=-%mem | head`：找出内存占用 TOP 进程。