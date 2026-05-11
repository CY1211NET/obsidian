---
author: Crain
date: 2026-05-11
title: K8s常用命令
tags:
  - k8s
emaili: y252840@163.com
updated:
category: Linux
---


---

# 一、集群信息查看

## 查看集群信息

```bash
kubectl cluster-info
```

## 查看节点

```bash
kubectl get nodes
```

## 查看节点详细信息

```bash
kubectl describe node 节点名
```

## 查看 Kubernetes 版本

```bash
kubectl version
```

---

# 二、Pod 操作（最核心）

## 查看 Pod

```bash
kubectl get pods
```

## 查看所有命名空间 Pod

```bash
kubectl get pods -A
```

## 实时查看 Pod 状态

```bash
kubectl get pods -w
```

## 查看 Pod 详细信息

```bash
kubectl describe pod pod名称
```

## 查看 Pod 日志

```bash
kubectl logs pod名称
```

## 持续查看日志

```bash
kubectl logs -f pod名称
```

## 进入 Pod 容器

```bash
kubectl exec -it pod名称 -- /bin/bash
```

有些镜像没有 bash：

```bash
kubectl exec -it pod名称 -- sh
```

## 删除 Pod

```bash
kubectl delete pod pod名称
```

---

# 三、Deployment 操作

Deployment 是最常用的应用部署方式。

## 查看 Deployment

```bash
kubectl get deploy
```

## 创建 Deployment

```bash
kubectl create deployment nginx --image=nginx
```

## 扩容副本数

```bash
kubectl scale deployment nginx --replicas=3
```

## 查看 Deployment 详情

```bash
kubectl describe deployment nginx
```

## 重启 Deployment

```bash
kubectl rollout restart deployment nginx
```

## 查看发布状态

```bash
kubectl rollout status deployment nginx
```

## 回滚版本

```bash
kubectl rollout undo deployment nginx
```

---

# 四、Service 操作

Service 用于暴露服务。

## 查看 Service

```bash
kubectl get svc
```

## 暴露 Deployment

```bash
kubectl expose deployment nginx --port=80 --type=NodePort
```

## 查看 Service 详情

```bash
kubectl describe svc nginx
```

---

# 五、YAML 配置管理（生产最重要）

K8s 真正常用的是 YAML。

---

## 创建资源

```bash
kubectl apply -f app.yaml
```

## 删除资源

```bash
kubectl delete -f app.yaml
```

## 查看 YAML

```bash
kubectl get pod pod名 -o yaml
```

## 导出 YAML 模板

```bash
kubectl create deployment nginx --image=nginx --dry-run=client -o yaml
```

---

# 六、Namespace（命名空间）

## 查看命名空间

```bash
kubectl get ns
```

## 创建命名空间

```bash
kubectl create ns dev
```

## 指定命名空间

```bash
kubectl get pods -n dev
```

## 删除命名空间

```bash
kubectl delete ns dev
```

---

# 七、资源监控

需要安装 metrics-server。

## 查看节点资源

```bash
kubectl top nodes
```

## 查看 Pod 资源

```bash
kubectl top pods
```

---

# 八、配置与上下文

## 查看当前上下文

```bash
kubectl config current-context
```

## 查看所有集群

```bash
kubectl config get-contexts
```

## 切换集群

```bash
kubectl config use-context 集群名
```

---

# 九、排错常用命令（非常重要）

## 查看所有异常 Pod

```bash
kubectl get pods -A
```

关注：

- CrashLoopBackOff
    
- ImagePullBackOff
    
- Pending
    
- Error
    

---

## 查看事件

```bash
kubectl get events
```

## 查看某 Pod 具体错误

```bash
kubectl describe pod pod名
```

## 查看日志

```bash
kubectl logs pod名
```

---

# 十、常见删除操作

## 删除 Deployment

```bash
kubectl delete deploy nginx
```

## 删除 Service

```bash
kubectl delete svc nginx
```

## 删除所有资源

```bash
kubectl delete all --all
```

---

# 十一、K3s 常用命令

如果你后面准备使用 K3s：

## 查看 K3s 状态

```bash
systemctl status k3s
```

## 重启 K3s

```bash
systemctl restart k3s
```

## K3s 自带 kubectl

```bash
k3s kubectl get nodes
```

## 查看 K3s 日志

```bash
journalctl -u k3s -f
```

---

# 十二、生产环境高频命令

## 查看所有资源

```bash
kubectl get all
```

## 查看所有命名空间资源

```bash
kubectl get all -A
```

## 查看 Pod 所在节点

```bash
kubectl get pod -o wide
```

## 查看镜像

```bash
kubectl describe pod pod名 | grep Image
```

---

# 十三、推荐学习顺序（很重要）

建议你按下面顺序学：

1. Docker
    
2. Pod
    
3. Deployment
    
4. Service
    
5. Ingress
    
6. Volume
    
7. ConfigMap/Secret
    
8. Helm
    
9. CI/CD
    
10. K3s/K8s 高可用
    

---

# 十四、建议你重点掌握的能力

如果你以后想走：

- Java后端
    
- SRE
    
- 运维开发
    
- 云原生
    
- DevOps
    

建议重点学：

- Linux
    
- Docker
    
- Kubernetes
    
- Jenkins
    
- GitLab CI
    
- Helm
    
- Prometheus
    
- Grafana
    
- Nginx
    
- Terraform
    

这些已经是现在云原生岗位的核心技术栈。

---

官方文档：

- [Kubernetes 官方文档](https://kubernetes.io/zh-cn/docs/home/?utm_source=chatgpt.com)
    
- [K3s 官方网站](https://k3s.io/?utm_source=chatgpt.com)