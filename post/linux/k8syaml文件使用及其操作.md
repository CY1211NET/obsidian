---
author: Crain
date: 2026-05-04
title: k8syaml文件使用及其操作
tags:
  - k8s
emaili: y252840@163.com
updated:
category: Linux
---


---

```yaml
apiVersion: apps/v1        # API版本（Deployment固定用 apps/v1）
kind: Deployment           # 资源类型：部署

metadata:
  name: mongodb           # Deployment名称（kubectl 管理用）
  labels:
    app: mongodb          # 标签：用于筛选/关联资源

spec:
  replicas: 1             # Pod副本数（1=只运行一个实例）

  selector:
    matchLabels:
      app: mongodb       # 必须和下面 Pod 的 labels 一致，否则找不到Pod

  template:               # Pod模板（Deployment根据它创建Pod）
    metadata:
      labels:
        app: mongodb     # Pod标签（必须和 selector 匹配）

    spec:
      containers:
        - name: mongodb   # 容器名称（Pod内部标识）
          image: mongo    # 镜像（MongoDB官方镜像）

          ports:
            - containerPort: 27017   # 容器内部端口（Mongo默认端口）

          env:
            - name: MONGO_INITDB_ROOT_USERNAME  # 环境变量：初始化用户名
              value: root

            - name: MONGO_INITDB_ROOT_PASSWORD  # 环境变量：初始化密码
              value: "123456"

          resources:
            limits:                   # 资源上限（防止占满机器）
              memory: "512Mi"        # 最大内存512MB
              cpu: "500m"            # 最大0.5核CPU

            requests:                # 最低保证资源（调度用）
              memory: "256Mi"        # 至少256MB
              cpu: "250m"           # 至少0.25核CPU
```

---

# 你要重点记住的逻辑（很关键）

### 1️⃣ Deployment → 管 Pod

```text
Deployment = 管理者
Pod = 实际运行的容器
```

---

### 2️⃣ selector 必须匹配 labels

```text
selector.matchLabels
        ↓
template.metadata.labels
```

不一致 = Deployment 找不到 Pod

---

### 3️⃣ env = 容器启动参数

Mongo / MySQL / Redis 都靠它初始化

---

### 4️⃣ resources = 限制性能

防止一个 Pod 把服务器拖死

---


