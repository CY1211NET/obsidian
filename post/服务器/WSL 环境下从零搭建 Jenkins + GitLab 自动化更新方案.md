---
author: Crain
date: 2026-02-13
title: WSL 环境下从零搭建 Jenkins + GitLab 自动化更新方案
tags:
  - 运维
  - jenkins
  - GIT
emaili: y252840@163.com
updated:
category: Linux
---
# WSL 环境下从零搭建 Jenkins + GitLab 自动化更新方案

本方案将指导您在 WSL (Ubuntu) 环境中从零开始搭建 Jenkins，并将其与 GitLab 集成，实现代码提交后的自动构建、镜像打包与部署。

## 用户审核要求

> [!IMPORTANT]
> 1. 请确保您的 Windows 已安装 **Docker Desktop**，并且在设置中开启了 **WSL Integration** (关联到您的 Ubuntu 分发版)。
> 2. 建议 WSL 版本为 **WSL 2**，以获得完整的 `systemd` 支持。

## 第一阶段：WSL 环境准备 (在 Ubuntu 中执行)

我们将安装 Jenkins、Java、Maven 和 Node.js。

### 1. 更新系统并安装 Java
```bash
sudo apt update && sudo apt upgrade -y
# 安装 JDK 17 (根据项目需求选择版本)
sudo apt install openjdk-17-jdk -y
```

### 2. 安装 Jenkins
```bash
# 添加仓库密钥
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | sudo tee /etc/apt/keyrings/jenkins-keyring.asc > /dev/null

# 添加仓库地址
echo "deb [signed-by=/etc/apt/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian-stable binary/" | sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null

# 安装
sudo apt update
sudo apt install jenkins -y

# 启动并设置开机自启
sudo systemctl enable jenkins
sudo systemctl start jenkins
```

### 3. 安装构建工具
```bash
# 安装 Maven
sudo apt install maven -y
# 安装 Node.js (建议使用 nvm 管理，或者直接安装)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

### 4. 权限配置 (非常重要)
为了让 Jenkins 能够运行 Docker 命令：
```bash
sudo usermod -aG docker jenkins
# 重启 Jenkins 使组权限生效
sudo systemctl restart jenkins
```

---

## 第二阶段：Jenkins 初始配置

1.  **访问 Jenkins**：在 Windows 浏览器访问 `http://localhost:8080`。
2.  **解锁**：执行 `sudo cat /var/lib/jenkins/secrets/initialAdminPassword` 获取密码。
3.  **插件安装**：选择 **“安装推荐的插件”**。
4.  **额外插件**：进入 `Manage Jenkins` -> `Plugins` -> `Available Plugins`，搜索并安装：
    -   `GitLab Plugin`
    -   `Generic Webhook Trigger`
    -   `Docker Pipeline`

---

## 第三阶段：项目集成与流水线脚本

在您的项目根目录下创建 `Jenkinsfile`。

#### [NEW] [Jenkinsfile](file:///d:/JAVA-DEVELOPMENT/final/Jenkinsfile)

```groovy
pipeline {
    agent any
    
    // 如果您在 Jenkins 全局工具中配置了这些，可以取消注释
    /*
    tools {
        maven 'maven-3.8' 
        nodejs 'node-18'
    }
    */

    environment {
        // 项目标识
        APP_NAME = "doc-mgmt-system"
    }
    
    stages {
        stage('Checkout') {
            steps {
                // Jenkins 自动从 GitLab 拉取代码到其工作空间
                checkout scm
            }
        }
        
        stage('Backend Build') {
            steps {
                echo 'Building Spring Boot JAR...'
                sh 'mvn clean package -DskipTests'
            }
        }
        
        stage('Frontend Build') {
            steps {
                dir('doc-management-system-web') {
                    echo 'Building Frontend Assets...'
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }
        
        stage('Container Deployment') {
            steps {
                echo 'Redeploying with Docker Compose...'
                // 使用项目根目录下的 docker-compose-app.yml
                sh 'docker-compose -f docker-compose-app.yml up --build -d'
            }
        }
    }
    
    post {
        success {
            echo 'SUCCESS: Project updated successfully.'
        }
        failure {
            echo 'FAILURE: Check Jenkins console output for errors.'
        }
    }
}
```

---

## 第四阶段：GitLab Webhook 连通

1.  **Jenkins 凭据**：在 `Manage Jenkins` -> `Credentials` 中添加您的 GitLab 用户名密码或 SSH 私钥。
2.  **Jenkins 任务**：
    - 创建一个 Pipeline 任务，关联到您的 GitLab 仓库。
    - 在“构建触发器”中勾选 `Build when a change is pushed to GitLab`。
    - 记录下显示的 **GitLab webhook URL**。
3.  **GitLab 配置**：
    - 进入 GitLab 项目的 `Settings` -> `Webhooks`。
    - 填入刚才记录的 URL 和 Secret Token。
    - 勾选 `Push events`。

---

## 开放性问题

> [!QUESTION]
> 1.您的 WSL Ubuntu 分发版版本是多少？（可通过 `wsl -l -v` 查看）。
> 2.您的 GitLab 是部署在本地还是 GitLab.com 官网？（这关系到 Webhook 能否直接访问到您的 localhost 端口，如果是内网环境可能需要内网穿透或使用中转服务）。

## 验证计划

1.  **手动触发**：在 Jenkins 点击 "Build Now"，验证全流程（构建、打包、部署）是否通畅。
2.  **自动触发**：在本地修改代码并 `git push`，观察 Jenkins 是否自动开始构建任务。
3.  **最终检查**：访问应用前端页面，确认内容已更新，且容器状态正常。
