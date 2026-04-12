---
author: Crain
date: 2024-10-12
title: jenkins实现自动部署和搭建
tags:
  - GIT
  - Docker
  - 运维
  - "#jenkins"
emaili: y252840@163.com
updated:
category: Linux
---
**需要预备的知识（Docker,springboot,git**）

---

# 一、整体架构（WSL本地版）

```
GitHub
   │
   │ push
   ▼
Jenkins (WSL)
   │
   │ pipeline
   ▼
Docker Build
   │
   ▼
Docker Run
   │
   ▼
本地服务运行
```

WSL 里同时运行

```
Jenkins
Docker
你的项目
```

---

# 二、WSL需要准备的软件

在 WSL Ubuntu 中安装：

### 1 Docker

```bash
sudo apt update

sudo apt install docker.io -y
```

启动

```bash
sudo service docker start
```

测试

```bash
docker ps
```

---

### 2 Git

```bash
sudo apt install git -y
```

---

### 3 Maven（Java项目）

```bash
sudo apt install maven -y
```

---

# 三、在 WSL 启动 Jenkins

最简单方法：用 Docker 启动 Jenkins

```bash
docker run -d \
-p 8080:8080 \
-p 50000:50000 \
-v jenkins_home:/var/jenkins_home \
--name jenkins \
jenkins/jenkins:lts
```

浏览器访问

```
http://localhost:8080
```

---

# 四、创建测试项目

例如 SpringBoot

目录

```
demo-project
 ├─ src
 ├─ pom.xml
 ├─ Dockerfile
 └─ Jenkinsfile
```

---

# 五、Dockerfile 示例

```dockerfile
FROM openjdk:17

WORKDIR /app #容器内工作目录

COPY target/demo.jar demo.jar 

EXPOSE 8080 #暴露的端口

ENTRYPOINT ["java","-jar","demo.jar"]#运行命令
```

---

# 六、Jenkinsfile（自动部署脚本）

```groovy
pipeline {
    agent any

    stages {

        stage('拉取代码') {
            steps {
                git 'https://github.com/你的仓库/demo-project.git'
            }
        }

        stage('项目打包') {
            steps {
                sh 'mvn clean package -DskipTests'
            }
        }

        stage('构建Docker镜像') {
            steps {
                sh 'docker build -t demo-app .'
            }
        }

        stage('运行容器') {
            steps {
                sh '''
                docker stop demo-app || true
                docker rm demo-app || true

                docker run -d \
                -p 8081:8080 \
                --name demo-app \
                demo-app
                '''
            }
        }

    }
}
```

---

# 七、GitHub 自动触发

进入 GitHub

```
Settings
Webhooks
```

添加

```
http://你的IP:8080/github-webhook/
```

如果是本地 WSL，可以用

```
ngrok
```

做端口映射：

```
ngrok http 8080
```

GitHub webhook 填：

```
https://xxxxx.ngrok.io/github-webhook/
```

---

# 八、完整流程

你执行

```
git push
```

自动流程

```
GitHub push
    │
    ▼
Webhook
    │
    ▼
Jenkins Pipeline
    │
    ├─ Git pull
    ├─ Maven build
    ├─ Docker build
    └─ Docker run
```

最终：

```
http://localhost:8081
```

可以访问服务。

---

# 九、WSL练习DevOps的推荐架构

更真实一点可以这样模拟：

```
WSL
 │
 ├─ Jenkins
 ├─ Docker
 │
 ├─ Registry（Harbor）
 │
 └─ Kubernetes（k3s / minikube）
```

完整 CI/CD

```
GitHub
   │
   ▼
Jenkins
   │
   ▼
Docker Build
   │
   ▼
Harbor
   │
   ▼
Kubernetes
```

---
