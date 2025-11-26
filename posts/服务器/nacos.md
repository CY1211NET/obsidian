---
title: nacos
date: '2025-11-16 00:00:00+08:00'
updated: '2025-11-16 00:00:00+08:00'
category: Liunx
tags:
- nacos
- 分布式
draft: false
author: Crain
---
要在 CentOS 上安装 Nacos，你可以按照以下步骤进行操作：

### **步骤 1：安装 Java**

Nacos 需要 Java 8 或更高版本。你可以使用以下命令检查当前 Java 版本：

```bash
java -version
```

如果没有安装 Java，按照以下步骤安装：

1. 下载并安装 OpenJDK 8 或 OpenJDK 11：
    
    ```bash
    sudo yum install java-1.8.0-openjdk-devel -y
    ```
    
2. 设置 `JAVA_HOME` 环境变量：
    
    编辑 `/etc/profile` 文件，添加以下内容：
    
    ```bash
    export JAVA_HOME=/usr/lib/jvm/java-1.8.0-openjdk
    export PATH=$JAVA_HOME/bin:$PATH
    ```
    
3. 重新加载配置：
    
    ```bash
    source /etc/profile
    ```
    

### **步骤 2：下载 Nacos**

从 Nacos 的官方 GitHub 页面下载最新版的 Nacos：

```bash
curl -L https://github.com/alibaba/nacos/releases/download/1.4.2/nacos-server-1.4.2.tar.gz -o nacos-server.tar.gz
```

### **步骤 3：解压安装包**

将下载的 tar.gz 文件解压到你想安装的目录：

```bash
tar -zxvf nacos-server.tar.gz
cd nacos
```

### **步骤 4：配置 Nacos**

1. 进入解压后的目录，找到 `conf/application.properties` 文件，编辑此文件进行配置，设置数据库连接等。
    
2. 如果你只是想简单地运行 Nacos 并不需要配置数据库，可以使用默认配置。
    

### **步骤 5：启动 Nacos**

使用以下命令启动 Nacos：

```bash
sh startup.sh -m standalone
```

这将启动一个单机模式的 Nacos 服务。

### **步骤 6：验证安装**

Nacos 启动成功后，你可以通过浏览器访问以下 URL 来验证安装：

```
http://<服务器IP>:8848/nacos
```

默认的用户名和密码是：

- **用户名**: `nacos`
- **密码**: `nacos`

### **步骤 7：设置 Nacos 开机启动**

你可以创建一个 Systemd 服务文件，让 Nacos 在系统启动时自动启动。

1. 创建一个新的 Systemd 服务文件 `/etc/systemd/system/nacos.service`：
    
    ```bash
    sudo nano /etc/systemd/system/nacos.service
    ```
    
2. 添加以下内容：
    
    ```ini
    [Unit]
    Description=Nacos
    After=network.target
    
    [Service]
    Type=forking
    ExecStart=/bin/bash /opt/nacos/bin/startup.sh -m standalone
    ExecStop=/bin/bash /opt/nacos/bin/shutdown.sh
    User=root
    Restart=on-failure
    
    [Install]
    WantedBy=multi-user.target
    ```
    
3. 重新加载 Systemd 配置：
    
    ```bash
    sudo systemctl daemon-reload
    ```
    
4. 启动 Nacos 服务：
    
    ```bash
    sudo systemctl start nacos
    ```
    
5. 设置 Nacos 在开机时自动启动：
    
    ```bash
    sudo systemctl enable nacos
    ```
    

通过这些步骤，你就能在 CentOS 上成功安装并运行 Nacos。如果遇到任何问题，可以查看 Nacos 的日志文件以获得更多信息。                                                                  
从 Nacos 日志中可以看到，出现了 `db-load-error`，错误信息显示 `load jdbc.properties error`。这意味着 Nacos 在加载数据库配置时发生了问题。具体来说，Nacos 无法加载 `jdbc.properties` 配置文件，可能是该文件缺失、配置错误或数据库连接问题。

### 排查和解决步骤

#### 1. **检查 `jdbc.properties` 配置文件**

首先，确保 `jdbc.properties` 文件存在，并且放置在正确的目录下。通常情况下，`jdbc.properties` 文件位于 Nacos 配置目录（`/root/nacos/conf/`）中。

执行以下命令确认文件是否存在：

```bash
ls /root/nacos/conf/jdbc.properties
```

如果文件不存在，你可以参考 Nacos 官方文档提供的模板来创建该文件，内容示例如下（根据你使用的数据库类型进行配置）：

```properties
# 配置 MySQL 数据库
spring.datasource.platform=mysql
db.num=1
db.url.0=jdbc:mysql://localhost:3306/nacos_config?useUnicode=true&characterEncoding=utf-8&serverTimezone=UTC
db.user=root
db.password=your_password
```

如果你没有使用数据库存储配置，Nacos 也支持嵌入式存储，确保你已经在配置文件中设置了正确的存储方式。

#### 2. **检查数据库连接**

如果你已经正确配置了 `jdbc.properties` 文件，确保 Nacos 能够连接到数据库。你可以尝试手动连接到数据库，确保数据库服务正在运行，且用户名和密码正确。

例如，如果你使用的是 MySQL，可以使用以下命令进行连接测试：

```bash
mysql -u root -p
```

然后输入密码，确保能够成功连接。

#### 3. **数据库表结构检查**

确保数据库中已经创建了 Nacos 所需的表结构。如果你使用的是 MySQL，可以参考 Nacos 官方提供的数据库初始化脚本来创建表：

```bash
# 进入 Nacos 安装目录
cd /root/nacos

# 执行数据库初始化脚本（例如，MySQL）
sh init-database.sh -h <数据库主机> -u <数据库用户名> -p <数据库密码> -d <数据库名称>
```

#### 4. **重新启动 Nacos**

在修改完 `jdbc.properties` 配置文件后，重新启动 Nacos 服务：

```bash
cd /root/nacos
sh shutdown.sh
sh startup.sh
```

#### 5. **检查日志**

重新启动 Nacos 后，再次查看日志文件，确认是否还有数据库连接相关的错误。

```bash
tail -f /root/nacos/logs/nacos.log
```

### 总结

- 确认 `jdbc.properties` 配置文件是否存在并正确配置。
- 确认 Nacos 是否能够连接到数据库，数据库服务是否正常运行。
- 确保数据库中已创建 Nacos 所需的表结构。

如果问题仍然存在，请提供更多的日志信息，尤其是与数据库连接相关的错误。

在 Ubuntu 上安装 Nacos，以下是具体的步骤。Nacos 是阿里巴巴开源的分布式配置管理和服务发现平台，运行在 Java 环境下。

---

### **1. 安装 Java 环境**

Nacos 需要 Java 运行时环境，通常推荐 JDK 8 或更高版本。

#### 检查是否安装了 Java：

```bash
java -version
```

#### 如果未安装 Java，可以运行以下命令安装 OpenJDK：

```bash
sudo apt update
sudo apt install openjdk-11-jdk -y
```

验证安装：

```bash
java -version
```

---

### **2. 下载 Nacos**

从 Nacos 的官方 GitHub 下载最新版本的压缩包。

#### 下载 Nacos：

```bash
curl -L "https://github.com/alibaba/nacos/releases/download/2.2.3/nacos-server-2.2.3.zip" -o nacos-server.zip
```

（替换版本号为最新版本，可以到 [Nacos Releases](https://github.com/alibaba/nacos/releases) 查看最新版本。）

#### 解压文件：

```bash
unzip nacos-server.zip -d /opt/nacos
```

如果未安装 `unzip`，可以先运行以下命令安装：

```bash
sudo apt install unzip -y
```

---

### **3. 配置 Nacos 数据库（可选）**

Nacos 支持运行时使用默认的嵌入式数据库，也可以配置外部 MySQL 数据库。

#### 如果使用 MySQL：

1. 确保已安装 MySQL（参考上一条消息）。
    
2. 登录 MySQL 创建数据库：
    
    ```sql
    CREATE DATABASE nacos_config DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
    ```
    
3. 下载 `nacos-mysql.sql` 脚本：
    
    ```bash
    curl -L "https://github.com/alibaba/nacos/blob/develop/distribution/conf/nacos-mysql.sql" -o nacos-mysql.sql
    ```
    
    然后将脚本导入数据库：
    
    ```bash
    mysql -u root -p nacos_config < nacos-mysql.sql
    ```
    
4. 修改配置文件： 编辑 `/opt/nacos/conf/application.properties` 或 `/opt/nacos/conf/application.yml`，添加 MySQL 配置：
    
    ```properties
    spring.datasource.platform=mysql
    db.num=1
    db.url.0=jdbc:mysql://127.0.0.1:3306/nacos_config?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true
    db.user=root
    db.password=你的密码
    ```
    

---

### **4. 启动 Nacos**

进入 Nacos 解压目录并启动服务：

#### 单机模式启动：

```bash
cd /opt/nacos/bin
sh startup.sh -m standalone
```

#### 集群模式启动（如果有多节点）：

配置集群节点后，运行以下命令：

```bash
sh startup.sh
```

---

### **5. 验证 Nacos 是否运行**

Nacos 默认运行在端口 `8848`。打开浏览器访问：

```
http://<你的服务器IP>:8848/nacos
```

默认的用户名和密码为：

- 用户名：`nacos`
- 密码：`nacos`

---

### **6. 配置服务管理（可选）**

为了让 Nacos 在服务器启动时自动运行，可以使用 Systemd 服务管理。

#### 创建 Systemd 配置文件：

```bash
sudo nano /etc/systemd/system/nacos.service
```

添加以下内容：

```ini
[Unit]
Description=Nacos Server
After=network.target

[Service]
User=root
Type=forking
ExecStart=/opt/nacos/bin/startup.sh -m standalone
ExecStop=/opt/nacos/bin/shutdown.sh
Restart=always
WorkingDirectory=/opt/nacos

[Install]
WantedBy=multi-user.target
```

#### 重新加载 Systemd：

```bash
sudo systemctl daemon-reload
```

#### 启动 Nacos 服务：

```bash
sudo systemctl start nacos
```

#### 设置开机自启：

```bash
sudo systemctl enable nacos
```

---

如果有任何安装或配置问题，请告诉我！