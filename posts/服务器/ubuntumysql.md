---
title: Ubuntu-Mysql安装
date: '2024-9-1 00:00:00+08:00'
category: Linux
tags:
- sql
- ubuntu
draft: false
author: Crain
---


---

### 1. **更新软件包索引**

在安装任何新软件前，建议更新系统的软件包索引：

```bash
sudo apt update
```

---

### 2. **安装 MySQL 服务**

运行以下命令安装 MySQL Server：

```bash
sudo apt install mysql-server
```

这将安装默认的 MySQL 版本（通常是 MySQL 8.x 或 5.7，根据你的 Ubuntu 版本）。

---

### 3. **检查 MySQL 服务状态**

安装完成后，MySQL 服务通常会自动启动。你可以检查服务状态：

```bash
sudo systemctl status mysql
```

如果服务未启动，可以手动启动：

```bash
sudo systemctl start mysql
```

---

### 4. **运行安全安装向导**

为了确保 MySQL 的安全性，运行以下命令：

```bash
sudo mysql_secure_installation
```

根据提示完成以下步骤：

- 为 `root` 用户设置密码。
- 删除匿名用户。
- 禁用远程 root 登录（可选）。
- 删除测试数据库。
- 重新加载权限表。

---

### 5. **登录到 MySQL 控制台**

用以下命令登录到 MySQL：

```bash
sudo mysql -u root -p
```

输入刚刚设置的 `root` 密码。

---

### 6. **（可选）允许远程访问 MySQL**

如果需要远程访问 MySQL，可以按以下步骤配置：

1. 编辑 MySQL 配置文件：
    
    ```bash
    sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
    ```
    
2. 找到以下行并注释掉或修改：
    
    ```
    bind-address = 127.0.0.1
    ```
    
    改为：
    
    ```
    bind-address = 0.0.0.0
    ```
    
3. 重启 MySQL 服务：
    
    ```bash
    sudo systemctl restart mysql
    ```
    
4. 在 MySQL 中授予远程访问权限：
    
    ```sql
    CREATE USER 'root'@'%' IDENTIFIED BY '123456789';
    GRANT ALL PRIVILEGES ON *.* TO 'username'@'%' WITH GRANT OPTION;
    FLUSH PRIVILEGES;
    ```
    

---

### 7. **测试 MySQL**

使用以下命令测试 MySQL 是否正常运行：

```bash
mysqladmin -u root -p version
```

---

### 8. **卸载或清理 MySQL（如果需要）**

如果需要卸载 MySQL，可以运行：

```bash
sudo apt remove --purge mysql-server mysql-client mysql-common -y
sudo apt autoremove -y
sudo apt autoclean
```

然后删除 MySQL 数据文件：

```bash
sudo rm -rf /etc/mysql /var/lib/mysql
```

---

如果在安装或配置过程中遇到问题，请告诉我，我可以进一步帮助你！
```sql
create table document  
(  
    object_id       varchar(255) collate utf8mb4_unicode_ci null comment '对应mongodb里面的文档信息',  
    id              bigint                                  not null  
        primary key,  
    name            varchar(255) collate utf8mb4_unicode_ci null comment '文档名称',  
    size            bigint                                  null comment '文件大小',  
    upload_date     datetime                                null comment '上传时间',  
    md5             varchar(255) collate utf8mb4_unicode_ci null comment '根据整个文件生成的MD5值，可以确定文件唯一',  
    transaction_id  varchar(255) collate utf8mb4_unicode_ci null comment '区块链交易Id',  
    trader_address  varchar(255)                            null comment '交易者地址',  
    content_type    varchar(100) collate utf8mb4_unicode_ci null comment '文件类型',  
    suffix          varchar(50) collate utf8mb4_unicode_ci  null comment '文件后缀',  
    gridfs_id       varchar(255) collate utf8mb4_unicode_ci null comment '存在与mongodb里面真正的文件Id',  
    doc_state       varchar(50) collate utf8mb4_unicode_ci  null comment '状态',  
    is_review       varchar(50) collate utf8mb4_unicode_ci  null comment '是否审核',  
    user_id         bigint                                  null comment '文件上传者Id',  
    user_name       varchar(255) collate utf8mb4_unicode_ci null comment '文件上传者姓名',  
    doc_class       varchar(255) collate utf8mb4_unicode_ci null comment '这个文档对应的类路径',  
    error_msg       varchar(255) collate utf8mb4_unicode_ci null comment '错误信息（一般索引出错信息存这里）',  
    description     varchar(255) collate utf8mb4_unicode_ci null comment '描述',  
    abstracts       text collate utf8mb4_unicode_ci         null comment '摘要',  
    preview_file_id varchar(200) collate utf8mb4_unicode_ci null comment '预览文件Id',  
    text_file_id    varchar(200) collate utf8mb4_unicode_ci null comment '从文档提取的纯文本Id',  
    thumb_id        varchar(200) collate utf8mb4_unicode_ci null comment '缩略图Id',  
    STATUS_CD       varchar(6) collate utf8mb4_unicode_ci   null,  
    CREATE_STAFF    bigint                                  null,  
    UPDATE_DATE     datetime                                null,  
    STATUS_DATE     datetime                                null,  
    UPDATE_STAFF    bigint                                  null,  
    CREATE_DATE     datetime                                null,  
    is_deleted      tinyint default 0                       null,  
    archive_type_id bigint                                  null comment '档案类型ID'  
)  
    charset = utf8mb4  
    row_format = DYNAMIC;

```
```sql
create table file_info  
(  
    file_type       varchar(255)                        not null  
        primary key,  
    fields          json                                not null,  
    created_at      timestamp default CURRENT_TIMESTAMP null,  
    updated_at      timestamp default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,  
    archive_type_id bigint                              null,  
    constraint uk_file_info_id  
        unique (archive_type_id)  
);
```

```nginx
worker_processes 1;

  

events { worker_connections 1024; }

  

http {

    include       mime.types;

    default_type  application/octet-stream;

  

    sendfile        on;

    keepalive_timeout  65;

    server {

       listen 80;

       server_name archiveschain.com www.archiveschain.com 118.145.187.193;

  

       root /usr/share/nginx/html;

       index index.html;

  

       location / {

           try_files $uri $uri/ /index.html;

       }

  

       # 避免favicon.ico 404错误（确保dist目录下有该文件）

       location = /favicon.ico {

           log_not_found off;

           access_log off;

       }

  

       # 强制跳转到 HTTPS

       #return 301 https://$host$request_uri;

   }

  

   #server {

    #  listen 443 ssl;

    #  server_name archiveschain.com www.archiveschain.com;

  

    #  ssl_certificate /etc/letsencrypt/live/archiveschain.com/fullchain.pem;

    #  ssl_certificate_key /etc/letsencrypt/live/archiveschain.com/privkey.pem;

  

    #  ssl_session_cache shared:SSL:1m;

    #  ssl_session_timeout 10m;

  

    #  ssl_protocols TLSv1.2 TLSv1.3;

    #  ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256';

    #  ssl_prefer_server_ciphers on;

  

    #  root /usr/share/nginx/html;

    #  index index.html;

  

    #  location / {

    #       try_files $uri $uri/ /index.html;

    #  }

  

    #  location = /favicon.ico {

    #        log_not_found off;

    #        access_log off;

    #    }

  

      # 代理后端 API 请求（关键部分）

    #  location /api/ {

    #      proxy_pass http://118.145.187.193:8088/;  # 后端服务地址

    #      proxy_set_header Host $host;

    #      proxy_set_header X-Real-IP $remote_addr;

    #      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

    #      proxy_set_header X-Forwarded-Proto https;  # 告诉后端请求来自 HTTPS

    # }

    #}

}
```

```nginx
worker_processes 1;

events { worker_connections 1024; }

http {
    include       mime.types;
    default_type  application/octet-stream;

    sendfile        on;
    keepalive_timeout  65;

    # 添加CORS配置
    map $http_origin $cors_origin {
        default "";
        "~^https?://.*\.archiveschain\.com$" "$http_origin";
        "~^https?://localhost(:[0-9]+)?$" "$http_origin";
    }

    server {
        listen 80;
        server_name archiveschain.com www.archiveschain.com 118.145.187.193;

        root /usr/share/nginx/html;
        index index.html;

        # 添加CORS headers
        add_header 'Access-Control-Allow-Origin' $cors_origin always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE' always;
        add_header 'Access-Control-Allow-Headers' 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization' always;

        # 处理OPTIONS预检请求
        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' $cors_origin;
            add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE';
            add_header 'Access-Control-Allow-Headers' 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization';
            add_header 'Access-Control-Max-Age' 1728000;
            add_header 'Content-Type' 'text/plain charset=UTF-8';
            add_header 'Content-Length' 0;
            return 204;
        }

        location / {
            try_files $uri $uri/ /index.html;
        }

        # 代理 dynamic-table 接口
        location /dynamic-table/ {
            proxy_pass http://localhost:8585/dynamic-table/;  # 假设后端服务运行在8088端口
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            # 增加超时时间，适应文件上传需求
            proxy_connect_timeout 300s;
            proxy_send_timeout 300s;
            proxy_read_timeout 300s;
        }

        # 避免favicon.ico 404错误
        location = /favicon.ico {
            log_not_found off;
            access_log off;
        }

        # 处理大文件上传
        client_max_body_size 20M;
    }

    # HTTPS server配置（目前注释掉，需要时可以启用）
    #server {
    #    listen 443 ssl;
    #    server_name archiveschain.com www.archiveschain.com;
    #
    #    ssl_certificate /etc/letsencrypt/live/archiveschain.com/fullchain.pem;
    #    ssl_certificate_key /etc/letsencrypt/live/archiveschain.com/privkey.pem;
    #
    #    ssl_session_cache shared:SSL:1m;
    #    ssl_session_timeout 10m;
    #
    #    ssl_protocols TLSv1.2 TLSv1.3;
    #    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256';
    #    ssl_prefer_server_ciphers on;
    #
    #    root /usr/share/nginx/html;
    #    index index.html;
    #
    #    # 复制上面HTTP server中的location配置
    #    location / {
    #        try_files $uri $uri/ /index.html;
    #    }
    #
    #    location /dynamic-table/ {
    #        proxy_pass http://localhost:8088/dynamic-table/;
    #        proxy_http_version 1.1;
    #        proxy_set_header Host $host;
    #        proxy_set_header X-Real-IP $remote_addr;
    #        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    #        proxy_set_header X-Forwarded-Proto https;
    #    }
    #}
}

```