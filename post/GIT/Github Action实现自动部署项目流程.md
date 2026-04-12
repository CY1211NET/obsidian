---
author: Crain
date: 2025-06-12
title: Github Action实现自动部署项目流程（以springboot项目为例）
tags:
  - GIT
  - 运维
emaili: y252840@163.com
updated:
category: 个人学习
---
对于 Spring Boot 项目，使用 GitHub Actions 的逻辑大同小异，但由于 Java 项目通常涉及 **JDK 环境配置**、**Maven/Gradle 依赖管理**以及 **Jar 包运行**，配置上会有一些特定细节。

以下是针对 Spring Boot 项目的自动化部署方案。

---

## 1. 工作流图解

## 2. GitHub Actions 配置文件 (`.github/workflows/maven-deploy.yml`)

在项目根目录下创建该文件，建议使用以下经过优化的配置：

YAML

```
name: Java CI/CD with Spring Boot

on:
  push:
    branches:
      - main # 仅在代码推送到 main 分支时触发

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      # 1. 检出代码
      - name: Checkout code
        uses: actions/checkout@v4

      # 2. 设置 JDK 环境
      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'
          cache: 'maven' # 自动缓存 Maven 依赖，极大提升二次构建速度

      # 3. 编译并打包 (跳过测试以加快速度，如需测试请删除 -DskipTests)
      - name: Build with Maven
        run: mvn clean package -DskipTests

      # 4. 将 Jar 包发送到服务器
      - name: Copy Jar to Server
        uses: appleboy/scp-action@v0.1.7
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          # target 指向服务器上的部署目录
          source: "target/*.jar"
          target: "/home/project/app"
          strip_components: 1 # 只传输 jar 报本身，不传输 target 文件夹

      # 5. 远程执行命令重启应用
      - name: Restart Spring Boot App
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          script: |
            cd /home/project/app
            # 停止旧进程（根据端口号或文件名，这里假设端口是 8080）
            fuser -k 8080/tcp || true
            # 后台启动新的 Jar 包
            nohup java -jar *.jar > app.log 2>&1 &
```

---

## 3. 针对 Spring Boot 的加速与优化技巧

### ⚡ 解决“构建时间长”的痛点

1. **利用 Maven 缓存**：在上面的脚本中，`cache: 'maven'` 非常关键。GitHub 会将 `~/.m2/repository` 目录缓存起来。
    
    - **效果**：首次构建可能需要 3 分钟（下载所有依赖），开启缓存后，后续构建通常只需 30-60 秒。
        
2. **分层构建（高级）**：如果你的项目非常大，可以考虑使用 **Docker 分层构建**。由于 Spring Boot 的依赖包（BOOT-INF/lib）变动频率低于业务代码，Docker 可以缓存依赖层，每次部署只上传几十 KB 的业务代码改动。
    

### 🛡️ 部署安全性

- **不硬编码配置**：Spring Boot 的 `application.yml` 中通常包含数据库密码。建议不要把这些敏感文件传到 GitHub。
    
- **解决方案**：在服务器上放置一个独立的 `application-prod.yml`，然后在启动命令中指定：
    
    `java -jar *.jar --spring.config.location=/path/to/application-prod.yml`
    

---

## 4. 常见问题排查

- **Permission Denied**：如果 SCP 或 SSH 步骤报错，请检查服务器目标文件夹的权限，确保 `SERVER_USER` 有权写入该目录。
    
- **fuser 命令不存在**：如果 `fuser -k` 报错，可以改用 `ps -ef | grep java | grep -v grep | awk '{print $2}' | xargs kill -9` 这种更通用的方式来杀掉旧进程。
    