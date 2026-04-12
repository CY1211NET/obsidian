---
author: Crain
date: 2024-04-15
title: K8s 入门操作指南：从下载到部署容器
tags:
  - "#Kubernetes"
  - 运维
emaili: y252840@163.com
updated:
category: Linux
---


---

#  一、完整 Kubernetes 安装流程（含下载）

整体分 8 步：

---

# ① 下载基础组件（最开始一步）

## 🔹 1. 安装 containerd（运行时）

### Ubuntu / Debian：

```bash
apt update
apt install -y containerd
```

---

### CentOS / RHEL：

```bash
yum install -y containerd.io
```

---

## 🔹 2. 安装 kubeadm / kubelet / kubectl

### 添加 Kubernetes 源（国内推荐）

```bash
cat <<EOF | sudo tee /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://mirrors.aliyun.com/kubernetes-new/core/stable/v1.30/rpm/
enabled=1
gpgcheck=0
EOF
```

---

### 安装三件套：

```bash
yum install -y kubelet kubeadm kubectl
```

---

### 启动 kubelet：

```bash
systemctl enable kubelet
```

---

# ② 系统环境初始化（必须）

```bash
swapoff -a
```

```bash
modprobe br_netfilter
modprobe overlay
```

```bash
cat <<EOF | tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-iptables=1
net.ipv4.ip_forward=1
net.bridge.bridge-nf-call-ip6tables=1
EOF

sysctl --system
```

---

# ③ containerd 配置（关键）

## 生成配置：

```bash
containerd config default > /etc/containerd/config.toml
```

---

## 修改 1：启用 systemd

```toml
SystemdCgroup = true
```

---

## 修改 2：sandbox 镜像（因为国内链接容易超时，也可替代为其他源）

```toml
sandbox_image = "registry.cn-hangzhou.aliyuncs.com/google_containers/pause:3.9"
```

---

## 重启：

```bash
systemctl restart containerd
systemctl restart kubelet
```

---

# ④ kubeadm 初始化（master）

---

## 你的命令：

```bash
kubeadm init \
--pod-network-cidr=10.244.0.0/16 \
--image-repository=registry.cn-hangzhou.aliyuncs.com/google_containers
```

---

# 参数详细解释（重点）

---

## 🔹 1. kubeadm init

作用：

> 初始化 Kubernetes 控制平面（apiserver / etcd / scheduler）

---

## 🔹 2. --pod-network-cidr

```text
10.244.0.0/16
```

### 作用：

 给 Pod 分配 IP 的网段

---

### 为什么必须设置？

因为 CNI（Flannel/Calico）需要统一网络规划

---

### 常见对应关系：

|CNI|CIDR|
|---|---|
|Flannel ✔|10.244.0.0/16|
|Calico|192.168.0.0/16|

---

## 🔹 3. --image-repository

```text
registry.cn-hangzhou.aliyuncs.com/google_containers
```

### 作用：

替换 Kubernetes 默认镜像源

---

### 默认情况：

```text
registry.k8s.io ❌（国外）
```

---

### 改成阿里云后：

- apiserver
    
- etcd
    
- controller-manager
    
- scheduler
    

全部走国内镜像

---

# ⑤ kubelet 启动控制平面

kubeadm 自动生成：

```text
/etc/kubernetes/manifests/
```

里面包括：

- kube-apiserver.yaml
    
- etcd.yaml
    
- controller-manager.yaml
    
- scheduler.yaml
    

---

👉 kubelet 自动监听这个目录（核心机制）

---

# ⑥ 配置 kubectl

```bash
mkdir -p $HOME/.kube
cp /etc/kubernetes/admin.conf ~/.kube/config
```

---

# ⑦ 安装 CNI 网络插件（关键步骤）

你这里必须做，否则：

```text
Node = NotReady
```

---

## Flannel 安装：

```bash
kubectl apply -f https://github.com/flannel-io/flannel/releases/latest/download/kube-flannel.yml
```

---

# ⑧ 集群成功

```bash
kubectl get nodes
```

---



---

# 一键安装 Kubernetes（kubeadm + containerd + flannel）

> 适用于：Ubuntu / Debian / CentOS 近版本  
> Kubernetes：v1.30  
> 目标：单节点 Master（可后续 join worker）

---

## 📜 脚本（直接复制执行）

```bash
#!/bin/bash

set -e

echo "🚀 开始安装 Kubernetes..."

# =========================
# 1. 关闭 swap
# =========================
swapoff -a
sed -i '/swap/d' /etc/fstab

# =========================
# 2. 内核模块
# =========================
modprobe br_netfilter
modprobe overlay

cat <<EOF | tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-iptables=1
net.ipv4.ip_forward=1
net.bridge.bridge-nf-call-ip6tables=1
EOF

sysctl --system

# =========================
# 3. 安装 containerd
# =========================
apt update -y || yum update -y

apt install -y containerd || yum install -y containerd.io

containerd config default > /etc/containerd/config.toml

# 修改 containerd 配置
sed -i 's/SystemdCgroup = false/SystemdCgroup = true/' /etc/containerd/config.toml

# 修改 sandbox 镜像（关键）
sed -i 's#registry.k8s.io/pause:3.8#registry.cn-hangzhou.aliyuncs.com/google_containers/pause:3.9#g' /etc/containerd/config.toml
sed -i 's#sandbox_image = .*#sandbox_image = "registry.cn-hangzhou.aliyuncs.com/google_containers/pause:3.9"#g' /etc/containerd/config.toml

systemctl restart containerd
systemctl enable containerd

# =========================
# 4. 安装 kubeadm kubelet kubectl
# =========================
cat <<EOF | tee /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://mirrors.aliyun.com/kubernetes-new/core/stable/v1.30/rpm/
enabled=1
gpgcheck=0
EOF

apt install -y kubelet kubeadm kubectl || yum install -y kubelet kubeadm kubectl

systemctl enable kubelet

# =========================
# 5. kubeadm 初始化
# =========================
kubeadm init \
--pod-network-cidr=10.244.0.0/16 \
--image-repository=registry.cn-hangzhou.aliyuncs.com/google_containers

# =========================
# 6. kubectl 配置
# =========================
mkdir -p $HOME/.kube
cp -f /etc/kubernetes/admin.conf $HOME/.kube/config

# =========================
# 7. 安装 Flannel 网络
# =========================
kubectl apply -f https://github.com/flannel-io/flannel/releases/latest/download/kube-flannel.yml

echo "✅ Kubernetes 安装完成！"
echo "👉 使用：kubectl get nodes"
```

---

# 📌 使用方法

```bash
chmod +x k8s-install.sh
bash k8s-install.sh
```

---
