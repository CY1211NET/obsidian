---
author: Crain
date: 2026-08-08
title: Ansible 问题排查思路与 Linux 运维排查实战
tags:
  - "#ansible"
  - "#Linux"
  - "#Docker"
  - "#运维"
email: y252840@163.com
updated:
category: Linux
---

# Ansible 问题排查思路与 Linux 运维排查实战

在日常运维和自动化部署中，**问题排查能力**是区分新手和老手的关键分水岭。本文从 Ansible 自动化场景出发，系统梳理排查思路，并扩展到 Linux 运维中必备的"黄金六件套"命令组合技。

---

## 一、Ansible 常见问题排查思路

### 1.1 排查总纲：五步定位法

遇到 Ansible 执行失败时，按以下顺序逐层排查：

```
连接问题 → 权限问题 → 参数/变量问题 → 依赖问题 → 目标环境问题
```

| 排查阶段 | 关注点 | 常见错误 |
|---------|--------|---------|
| **连接层** | SSH 连接、inventory 配置 | `UNREACHABLE`、连接超时 |
| **权限层** | sudo、become、文件权限 | `Permission denied`、权限不足 |
| **参数层** | 变量未定义、类型错误、模板渲染 | `undefined variable`、`Jinja2` 模板报错 |
| **依赖层** | 软件包、服务、端口 | 包安装失败、服务启动失败、端口冲突 |
| **环境层** | 系统版本、SELinux、防火墙 | 脚本在目标机器行为不一致 |

### 1.2 连接类问题

#### SSH 连接失败

```bash
# 先手动测试 SSH 连通性
ssh -i ~/.ssh/id_rsa -p 22 user@target-host

# Ansible 调试模式，查看详细连接过程
ansible all -m ping -vvv

# 检查 inventory 文件格式
ansible-inventory --list -i inventory.ini
```

**常见原因与解决：**

- **`Host key verification failed`**：目标主机指纹未信任。执行 `ssh-keyscan target-host >> ~/.ssh/known_hosts`，或在 `ansible.cfg` 中设置 `host_key_checking = False`
- **`Connection timed out`**：网络不通或防火墙拦截。用 `ss -tulnp` 或 `telnet` 检查目标端口
- **`Permission denied (publickey)`**：密钥未部署或用户名错误。检查 `ansible_user` 和 `ansible_ssh_private_key_file`

#### Inventory 配置错误

```ini
# inventory.ini 示例 —— 注意分组和变量的作用域
[webservers]
web1 ansible_host=192.168.1.10
web2 ansible_host=192.168.1.11

[webservers:vars]
ansible_user=deploy
ansible_ssh_private_key_file=~/.ssh/deploy_key
http_port=8080
```

```bash
# 验证 inventory 解析是否正确
ansible-inventory -i inventory.ini --graph
ansible-inventory -i inventory.ini --host web1
```

### 1.3 权限类问题

```yaml
# playbook 中使用 become 提权
- hosts: webservers
  become: yes          # 启用 sudo
  become_method: sudo  # 默认就是 sudo，也可用 su
  become_user: root    # 提权到 root

  tasks:
    - name: 确保 nginx 已安装
      yum:
        name: nginx
        state: present
```

**常见问题：**

- **`Missing sudo password`**：目标用户需要密码才能 sudo。解决方案：
  - 在 inventory 中设置 `ansible_become_pass`
  - 或在目标机器配置 `NOPASSWD`：`deploy ALL=(ALL) NOPASSWD: ALL`
- **文件权限不足**：确保 `become: yes` 在 task 或 play 级别正确设置

### 1.4 变量与模板问题

```yaml
# 变量优先级（从低到高）：
# defaults < inventory vars < playbook vars < extra vars (-e)

# 调试变量：查看某个 host 的所有变量
ansible web1 -m debug -a "var=hostvars[inventory_hostname]" -i inventory.ini

# 查看单个变量
ansible web1 -m debug -a "var=http_port" -i inventory.ini
```

**Jinja2 模板常见报错：**

```yaml
# ❌ 错误：变量未定义会直接报错
- name: 输出信息
  debug:
    msg: "端口是 {{ http_port }}"

# ✅ 正确：使用 default 过滤器兜底
- name: 输出信息（带默认值）
  debug:
    msg: "端口是 {{ http_port | default(80) }}"
```

### 1.5 Task 执行类问题

#### 使用 `--check` 和 `--diff` 预览变更

```bash
# 干跑模式：只预览，不实际执行
ansible-playbook deploy.yml --check

# 显示文件差异（配合 template/copy 模块）
ansible-playbook deploy.yml --diff --check

# 从指定 task 开始执行（跳过前面已完成的步骤）
ansible-playbook deploy.yml --start-at-task="重启 nginx"
```

#### 失败时进入调试

```yaml
# 当 task 失败时，自动进入 debug
- name: 检查服务状态
  shell: systemctl status nginx
  register: result
  ignore_errors: yes

- name: 打印失败详情
  debug:
    var: result
  when: result.rc != 0
```

#### 使用 `rescue` 做异常处理

```yaml
- block:
    - name: 尝试部署新版本
      copy:
        src: app-new.tar.gz
        dest: /opt/app/

    - name: 重启服务
      systemd:
        name: myapp
        state: restarted

  rescue:
    - name: 部署失败，回滚到旧版本
      copy:
        src: app-old.tar.gz
        dest: /opt/app/

    - name: 重启服务
      systemd:
        name: myapp
        state: restarted

  always:
    - name: 无论成功失败都记录日志
      shell: echo "{{ ansible_date_time.iso8601 }} deploy result: {{ ansible_failed_task | default('success') }}" >> /var/log/deploy.log
```

### 1.6 Ansible 排查命令速查

```bash
# 基础连通性测试
ansible all -m ping

# 查看模块用法
ansible-doc yum
ansible-doc template

# 列出所有可用模块
ansible-doc -l | grep service

# 执行单个 ad-hoc 命令
ansible webservers -m shell -a "df -h" -f 10

# Playbook 调试等级
ansible-playbook site.yml -v      # 基本输出
ansible-playbook site.yml -vvv    # 详细调试
ansible-playbook site.yml -vvvv   # 连接级调试（含 SSH 细节）

# 语法检查（不执行）
ansible-playbook site.yml --syntax-check

# 列出所有将执行的 task
ansible-playbook site.yml --list-tasks

# 列出所有目标主机
ansible-playbook site.yml --list-hosts
```

---

## 二、Linux 运维排查：黄金命令速查

以下是 Linux/DevOps 工程师最常用的排查命令。单独使用只是基本功，**将它们通过管道符 `|` 组合起来，才是解决复杂排查场景的杀手锏。**

### 2.1 ls —— 不只是看文件，更是筛选器

```bash
# DevOps 最常用的组合
ls -lath
# l: 长格式  a: 含隐藏文件  t: 按修改时间排序（最新在前）  h: 带单位

# 强制单列输出，适合管道传给其他命令
ls -1

# 只看目录
ls -d */

# 按大小排序（找大文件）
ls -lhS

# 只看最近 10 分钟修改过的文件
find . -maxdepth 1 -mmin -10 -ls
```

### 2.2 tail —— 追踪文件的尾巴

```bash
# 实时滚动追踪
tail -f /var/log/nginx/access.log

# 比 -f 更强：日志轮转时自动追踪新文件
tail -F /var/log/app.log

# 快速看最后 1000 行
tail -n 1000 /var/log/syslog

# 实时追踪并过滤关键词
tail -f /var/log/app.log | grep --line-buffered "ERROR"

# 同时追踪多个文件
tail -f /var/log/nginx/*.log
```

### 2.3 grep —— 文本过滤心脏

```bash
# 忽略大小写
grep -i "error" /var/log/app.log

# 反向过滤（排除干扰信息）
grep -v "HealthCheck" /var/log/app.log

# 高级正则（同时匹配多种模式）
grep -E "Timeout|Exception|OOM" /var/log/app.log

# 打印匹配行的前后上下文
grep -A 5 -B 5 "NullPointerException" /var/log/app.log
# -A: After（后 5 行）  -B: Before（前 5 行）  -C: Context（前后各 N 行）

# 递归搜索目录下所有文件
grep -rn "TODO" /opt/app/src/

# 只显示匹配的文件名
grep -rl "password" /etc/

# 统计匹配行数
grep -c "200" /var/log/nginx/access.log

# 显示行号
grep -n "Fatal" /var/log/app.log
```

### 2.4 ss —— 现代版 netstat，看网络和端口

```bash
# 极高频命令：查看所有监听端口
ss -tulnp
# t: TCP  u: UDP  l: Listening  n: 不解析域名（更快）  p: 显示进程

# 查看某个端口被谁占用
ss -tulnp | grep :8080

# 查看所有 ESTABLISHED 连接
ss -tnp state established

# 查看连接数统计（排查连接泄漏）
ss -s

# 查看目标 IP 的连接
ss -tn dst 192.168.1.100
```

### 2.5 curl —— 命令行浏览器与 API 测试器

```bash
# 只拿 HTTP Header（快速探测服务状态）
curl -I http://localhost:8080/health

# 详细调试模式（看完整握手过程）
curl -v https://api.example.com/v1/status

# 静默模式 + 跟随重定向
curl -sL https://example.com/install.sh | bash

# 带超时控制
curl -s --connect-timeout 5 --max-time 10 http://localhost:8080/health

# POST 请求带 JSON Body
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"name":"test"}' http://localhost:8080/api/create

# 带认证 Header
curl -s -H "Authorization: Bearer <token>" https://api.example.com/me

# 查看 DNS 解析 + TLS 握手 + 总耗时
curl -sL -o /dev/null -w "DNS: %{time_namelookup}s\nConnect: %{time_connect}s\nTLS: %{time_appconnect}s\nTotal: %{time_total}s\n" https://example.com
```

### 2.6 docker —— 容器操纵手

```bash
# 自定义精简输出（比默认好看百倍）
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# 提取容器内网 IP
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' <容器名>

# 查看容器日志（最后 1000 行 + 实时追踪）
docker logs --tail 1000 -f <容器名>

# 进入运行中的容器
docker exec -it <容器名> /bin/bash

# 查看容器资源占用
docker stats --no-stream

# 查看容器的环境变量
docker exec <容器名> env

# 查看容器的端口映射
docker port <容器名>
```

---

## 三、高阶组合技：命令管道实战

### 场景 1：精准狙击 Docker 容器内的报错日志

```bash
# 查看容器最后 1000 行日志中的异常（合并 stderr）
docker logs --tail 1000 <容器名> 2>&1 | grep -iC 5 "exception"
```

> `2>&1` 是因为有些容器应用会把错误日志打到标准错误流 stderr，必须合并到 stdout 才能被 grep 抓到。

### 场景 2：找出占用端口的进程并清理

```bash
# 查看 8080 端口被谁占用
ss -tulnp | grep :8080

# 输出类似：users:(("java",pid=12345,fd=15))
# 直接杀掉
kill -9 12345
```

### 场景 3：找到最近修改的日志并动态追踪

```bash
# 逻辑：ls -t 按时间排序 → head -n 1 取最新文件 → tail -f 实时追踪
ls -t /var/log/app/*.log | head -n 1 | xargs tail -f
```

### 场景 4：用 curl 穿透 Nginx 测试 Docker 内部网络

```bash
# 外部 502 时，直接请求容器 IP 确认是 Nginx 问题还是容器问题
curl -I http://$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' <容器名>):8080/health
```

### 场景 5：清理所有失败或退出的废弃容器

```bash
# docker ps 过滤退出状态 → -q 只输出 ID → docker rm 批量删除
docker rm -f $(docker ps -a -q -f status=exited)
```

### 场景 6：批量查找大日志文件并清理

```bash
# 找到 /var/log 下超过 500M 的文件
find /var/log -type f -size +500M -exec ls -lh {} \;

# 只清理 30 天前的日志
find /var/log -type f -name "*.log" -mtime +30 -delete
```

### 场景 7：Nginx 502/504 分层排查

```bash
# 第一步：看 Nginx 错误日志
tail -100 /var/log/nginx/error.log | grep -E "502|504|upstream"

# 第二步：确认 upstream 服务是否存活
curl -I http://localhost:8080/health

# 第三步：检查端口是否在监听
ss -tulnp | grep :8080

# 第四步：如果用 Docker，检查容器状态
docker ps | grep myapp

# 第五步：检查容器日志
docker logs --tail 50 myapp 2>&1 | grep -i "error\|fatal\|panic"
```

### 场景 8：Ansible 批量执行后的结果分析

```bash
# 批量执行并记录输出
ansible webservers -m shell -a "df -h | grep '/$'" > /tmp/disk_usage.txt

# 分析哪些机器磁盘使用率超过 80%
grep -E "8[0-9]%|9[0-9]%|100%" /tmp/disk_usage.txt

# 批量检查服务状态
ansible webservers -m shell -a "systemctl is-active nginx" 2>&1 | grep -v "SUCCESS"
```

---

## 四、效率提升：配置常用 Alias

每次手敲长命令太低效，配置 Bash/Zsh 缩写：

```bash
# 编辑 ~/.bashrc 或 ~/.zshrc，加入以下内容：

# === 网络与端口 ===
alias port='ss -tulnp | grep'
alias myip='curl -s ifconfig.me'

# === Docker 快捷操作 ===
alias dps='docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"'
alias dlog='docker logs --tail 200 -f'
alias dexec='docker exec -it'
alias dprune='docker system prune -f'

# === 文件快速查看 ===
alias lt='ls -lath'
alias lg='ls -lhS'    # 按大小排序

# === Ansible 快捷 ===
alias ap='ansible-playbook'
alias aping='ansible all -m ping'
alias adoc='ansible-doc'

# === 日志追踪 ===
alias tailf='tail -f'
alias tailerr='tail -f | grep --line-buffered -i "error\|exception\|fatal"'
```

```bash
# 保存后生效
source ~/.bashrc

# 使用示例
port 9451          # 瞬间查看 9451 端口状态
dlog mysql-config  # 瞬间滚动 mysql-config 日志
aping              # 快速测试所有主机连通性
```

---

## 五、排查思路总结

### 问题排查通用框架

```
1. 收集现象：错误信息是什么？什么时候开始的？影响范围？
2. 缩小范围：是网络问题？权限问题？配置问题？代码问题？
3. 验证假设：用最小化命令快速验证你的猜测
4. 修复问题：只改必要的配置，记录变更
5. 复盘总结：记录排查过程，更新文档
```

### Ansible 问题排查 Checklist

```
□ SSH 连通性正常？(ansible all -m ping)
□ inventory 文件格式正确？(ansible-inventory --graph)
□ 变量定义完整？(debug 模块打印变量)
□ 权限配置正确？(become, sudoers)
□ 依赖服务就绪？(前置 task 检查)
□ 目标机器环境一致？(OS 版本、SELinux、防火墙)
□ Playbook 语法正确？(--syntax-check)
□ 使用 --check 预览过变更？
```

---

> **总结**：排查问题的核心不是记住所有命令，而是建立**分层排查的思维框架**。从连接层开始，逐层往下定位，用最小化命令快速验证假设。这些命令和组合技，熟练后能在几分钟内定位到大多数运维问题。
