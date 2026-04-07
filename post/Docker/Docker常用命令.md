---
Author:
  - Crain
tags:
  - "#Docker"
  - "#运维"
author: Crain
date: 2023-05-14
emaili: y252840@163.com
title: Docker常用命令
category: Linux
---

---

## 1. 镜像管理 (Images)
镜像就像是类（Class），是静态的模板。

| 命令 | 说明 | 示例 |
| :--- | :--- | :--- |
| `docker pull` | 从仓库下载镜像 | `docker pull nginx:latest` |
| `docker images` | 列出本地所有镜像 | `docker images` |
| `docker rmi` | 删除镜像 | `docker rmi image_id` |
| **`docker tag`** | **给镜像打标签（重命名）** | `docker tag old:v1 new:v1` |
| `docker build` | 通过 Dockerfile 构建镜像 | `docker build -t my-app:1.0 .` |
| `docker save` | 将镜像导出成 tar 文件 | `docker save -o img.tar my-img` |
| `docker load` | 从 tar 文件导入镜像 | `docker load -i img.tar` |

---

## 2. 容器生命周期 (Containers)
容器是镜像运行后的实例（Instance）。

| 命令 | 说明 | 常用参数 |
| :--- | :--- | :--- |
| `docker run` | **创建并启动**一个容器 | `-d` (后台), `-p` (端口映射), `--name` (命名) |
| `docker ps` | 列出运行中的容器 | `-a` (查看所有容器，包括已停止的) |
| `docker stop` | 停止运行中的容器 | `docker stop container_id` |
| `docker start` | 启动已停止的容器 | `docker start container_id` |
| `docker restart` | 重启容器 | `docker restart container_id` |
| `docker rm` | 删除容器 | `-f` (强制删除正在运行的) |
| `docker pause` | 暂停容器内的所有进程 | `docker pause container_id` |

---

## 3. 容器运维与交互 (Operational)
当你需要进入容器内部或者排查问题时使用。

* **进入容器内部**：
    `docker exec -it <container_id> /bin/bash` (或者 `sh`)
* **查看容器日志**：
    `docker logs -f <container_id>` (`-f` 表示实时追踪日志)
* **查看容器资源占用**：
    `docker stats` (查看 CPU、内存、网络 IO)
* **拷贝文件**：
    `docker cp <local_path> <container_id>:<path>` (本地传到容器)
* **查看容器详细配置**：
    `docker inspect <container_id>` (查看 IP 地址、挂载卷等)

---

## 4. 数据卷与网络 (Volumes & Network)

* **数据卷管理**：
    * `docker volume ls`：列出数据卷。
    * `docker volume prune`：清理无用的数据卷。
* **网络管理**：
    * `docker network ls`：查看 Docker 网络。
    * `docker network create -d bridge my-net`：创建一个桥接网络。

---

## 5. 系统清理 (Cleanup)
Docker 运行久了会产生大量占用磁盘的废弃资源。

* **一键清理**：
    `docker system prune`
    > 注意：这会删除所有已停止的容器、未使用的网络和悬空镜像（dangling images）。
* **清理所有无用镜像**：
    `docker image prune -a`

---

## 💡 进阶：一个最常用的运行命令组合
如果你要运行一个 Redis 并映射端口，命令通常长这样：
```bash
docker run -d \ 
  --name my-redis \ //容器名称
  -p 6379:6379 \  //端口的映射
  -v /my/data:/data \ //挂载的目录
  --restart always \ //是否重启
  redis:latest //镜像名称及其版本
```
* `-d`: 后台运行。
* `-p`: 宿主机端口:容器端口。
* `-v`: 宿主机目录:容器目录 (数据持久化)。
* `--restart always`: 挂了或者重启 Docker 后自动启动。
