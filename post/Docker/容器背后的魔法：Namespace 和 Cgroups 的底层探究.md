---
title: 容器背后的魔法：Namespace 和 Cgroups 的底层探究
date: '2023-05-12'
updated: '2023-05-12'
category: Docker
tags:
- Docker
- Linux
- Namespace
- Cgroups
- 底层原理
draft: false
author: Crain
---

每一个第一次接触 Docker 的人，都会被这种“轻量级虚拟机”的体验所震撼。启动一个容器只需要几百毫秒，而一个真正的虚拟机可能需要几分钟。

很多人觉得 Docker 是一种黑科技，但当我深入 Linux 内核源码后才发现：**所谓的容器，其实只是 Linux 系统中一个被“加了限制”的特殊进程。** 它背后没有昂贵的 Hypervisor，只有三个核心技术：**Namespace (隔离)**、**Cgroups (限制)** 以及 **UnionFS (层级文件系统)**。

今天，我想把时光倒回到 2023 年，带大家一起拆解一下这套驱动云原生时代的底层魔法。

## 1. Namespace：看不见的墙 (Isolation)

如果说容器是一个房间，那么 Namespace 就是建造房间的砖墙。它让一个进程以为自己拥有独立的宇宙。

### PID Namespace：谁才是 1 号进程？
在 Linux 操作系统中，PID 1（Init 进程）是所有进程的祖先。但在容器里，你会发现你的应用进程 PID 也是 1。
底层原理是：**内核对 PID 树进行了视图劫持**。通过 `CLONE_NEWPID` 参数创建进程时，内核会为该进程及其子进程创建一个独立的 PID 映射表。在容器内部看是 1，在宿主机上看可能是一个普通的 12345。这种伪装让容器化的应用觉得自己在独享整个操作系统。

### Network Namespace：属于自己的网卡
通过 `CLONE_NEWNET`，容器拥有了独立的 IP 地址、端口范围和路由表。
底层原理是：**内核将网络协议栈进行了实例化**。宿主机与容器之间通常通过 `Veth Pair`（虚拟网卡对）连接，一端在容器里，一端在宿主机的 `docker0` 网桥上。这就像是在物理交换机上插了两根交叉线，实现了网络层的完全隔离。

### 其他核心 Namespace
- **Mount Namespace**：让容器拥有独立的挂载点目录。
- **UTS Namespace**：独立的 hostname。
- **User Namespace**：容器里的 root 用户在外面其实只是个普通用户，保证了安全性。

**感悟**：Namespace 并没有提供真正的物理隔离，它只是提供了一层“视图过滤”。这就解释了为什么容器的安全性永远不如虚拟机——因为它们共享同一个 Linux 内核。

## 2. Cgroups：权力的枷锁 (Resource Limitation)

如果只有 Namespace，一个容器崩溃可能会吃光宿主机所有的 CPU 和内存，导致其他容器一起陪葬。**Cgroups (Control Groups)** 解决了这个问题。

### 底层实现：VFS 的目录树
你会惊讶地发现，Cgroups 的配置是通过文件系统完成的。在 `/sys/fs/cgroup/` 目录下，你可以看到 `cpu`, `memory` 等子系统。
当你限制一个容器只能使用 512MB 内存时，Docker 本质上是在对应的 `/sys/fs/cgroup/memory/docker/<container_id>/memory.limit_in_bytes` 文件里写下了一个数字。

### 调度算法：CFS (Completely Fair Scheduler)
以 CPU 限制为例，底层使用的是 **完全公平调度算法**。
- `cpu.shares`：定义权重的相对比例。
- `cpu.cfs_period_us` 和 `cpu.cfs_quota_us`：定义在一段时间周期内，该进程最多能占用 CPU 多少微妙。
这是一种极其精确的配额策略。内核在每次时钟中断时，都会检查该进程的“额度”是否用完，如果用完，立刻将其挂起，直到下一个周期。

**这就是容器不卡顿的秘诀**：这种限制是极其细粒度且几乎零延迟的，因为它不涉及任何模拟层的指令转换。

## 3. UnionFS：积木式的文件系统

为什么 Docker 镜像可以那么快地分层下载和复用？答案是 **Union File System (联合文件系统)**。

### 写时复制 (Copy-on-Write)
当你启动一个容器时，Docker 会把镜像的多个只读层（Read-Only layers）堆叠在一起，并在最上面加一个可读写层（Read-Write-layer）。
底层原理是：当你修改一个文件时，UnionFS 会先从只读层把文件“拷贝（Copy）”到最上面的读写层，然后在那里进行修改。
这种设计不仅省空间（多个容器共享同一个基础镜像），更实现了**不可变基础设施**的理念。

## 4. 容器 vs 虚拟机：底层差异的终极对比

通过上面的探究，我们可以清楚地看到两者的物理底座差异：

- **虚拟机 (VM)**：运行在 Hypervisor 之上，有自己的内核，需要模拟整套硬件指令（中断、寄存器、内存分配）。
- **容器 (Container)**：运行在原生的 Linux 内核上，直接调用内核系统调用（Syscalls）。

**一句话总结**：虚拟机是在硬件层面模拟出来的，而容器是在操作系统层面隔离出来的。这也解释了为什么容器无法在不提供兼容层的情况下，在 Linux 上运行 Windows 镜像（内核不兼容）。

## 5. 总结：理解原理的意义

在 2023 年，Docker 已经成了我们开发的日常工具。但了解 Namespace 和 Cgroup 的意义在于：
当你的容器因为内存抖动被 OOM Kill 时，你会知道去查 `/sys/fs/cgroup`；
当你的容器网络不通时，你会去思考 `Veth Pair` 和 `iptables` 规则的冲突。

**容器不再是黑盒，而是 Linux 内核精妙设计下的一场视觉戏法。** 把握住这些底层原理，你才能在未来的 K8s 和 Serveless 浪潮中，真正做到游刃有余。

---
*本文是个人对 Linux 容器底层技术的深度学习心得，整理于 2023 年 5 月。*
