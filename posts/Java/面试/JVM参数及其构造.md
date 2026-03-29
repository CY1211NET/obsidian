---
title: 笔记模板
date: 2025-11-16
draft: false
author: Crain
tags:
updated: 2025-11-25
category:
---
下面我为你整理一份 **「JVM 参数 + JVM 内存结构」的完整总结文档**，内容清晰、可直接背诵、可用于面试或项目实战。

这是你前面学习内容的总汇版，非常适合作为最终笔记。

---

# 📘《JVM 参数 + JVM 内存结构 · 全面总结》

---

# 🟥 第一部分：JVM 内存结构（Runtime Data Area）

JVM 内存分为两大类：

---

## ✔ 一、线程共享（所有线程可访问）

### 1）堆（Heap）

- Java 最大的内存区域
    
- 存放对象实例、数组、几乎所有 new 出来的东西
    
- GC 主要作用区域
    

堆的分代结构：

- 新生代：Eden + Survivor0 + Survivor1
    
- 老年代：Old
    
- 大对象可能直接进入老年代
    

典型 OOM：

```
OutOfMemoryError: Java heap space
```

---

### 2）方法区（Method Area / Metaspace）

- 存放类元数据（Class 信息）
    
- 方法字节码
    
- 静态变量（static）
    
- 常量池（包括字符串常量）
    
- JIT 编译后的代码
    

JDK 8 之后使用 **Metaspace（本地内存）**

典型 OOM：

```
OutOfMemoryError: Metaspace
```

---

## ✔ 二、线程私有（每个线程独立）

### 1）虚拟机栈（JVM Stack）

- 存局部变量、方法栈帧、操作数栈
    
- 方法调用时创建栈帧
    

常见错误：

```
StackOverflowError
```

---

### 2）程序计数器（PC Register）

- 保存线程下一条要执行的字节码指令位置
    
- JVM 中唯一不会 OOM 的区域
    

---

### 3）本地方法栈（Native Method Stack）

- 用于执行 JNI（C/C++ 方法）
    
- 也可能出现 SOE / OOM
    

---

# 🟦 第二部分：各内存区域“存什么”的总结表

|区域|存什么|是否共享|
|---|---|---|
|**堆（Heap）**|对象实例、数组|✔|
|**方法区（Metaspace）**|类元信息、常量池、静态变量|✔|
|**虚拟机栈**|局部变量、方法调用栈帧|❌|
|**程序计数器 PC**|当前执行指令位置|❌|
|**本地方法栈**|JNI 本地方法调用|❌|

---

# 🟥 第三部分：JVM 参数配置总览

JVM 启动命令通常如下：

```
java [JVM参数] -jar app.jar
```

JVM 参数分三类：

1. 标准参数（如 -Xmx）
    
2. -X 参数（非标准）
    
3. -XX 参数（高级、细粒度控制）
    

---

# 🟩 一、堆内存参数（最常用）

```
-Xms1024m        # 初始堆大小
-Xmx1024m        # 最大堆大小
```

**建议：**

```
-Xms = Xmx
```

避免扩容导致性能抖动。

---

# 🟩 二、栈内存参数

```
-Xss1m           # 每个线程的栈空间大小
```

栈太小 → StackOverflowError  
栈太大 → 一台机器只能开很少线程

---

# 🟩 三、方法区（Metaspace）参数（JDK 8+）

```
-XX:MetaspaceSize=128m
-XX:MaxMetaspaceSize=256m
```

---

# 🟩 四、GC 垃圾回收参数

### 选择 GC：

```
-XX:+UseG1GC               # 默认，低延迟，现代应用推荐
-XX:+UseZGC                # 超低延迟（大内存用）
```

---

### 打 GC 日志：

```
-Xlog:gc*:file=gc.log
```

有助于分析性能。

---

# 🟩 五、直接内存（Netty/NIO）

```
-XX:MaxDirectMemorySize=512m
```

---

# 🟩 六、OOM 调试参数（生产必备）

```
-XX:+HeapDumpOnOutOfMemoryError
-XX:HeapDumpPath=/data/logs/oom.hprof
```

OOM 发生时自动 dump 堆文件。

---

# 🟩 七、容器（Docker）相关参数

```
-XX:+UseContainerSupport
-XX:MaxRAMPercentage=75
```

避免容器 OOMKilled。

---

# 🟩 八、诊断 & 性能监控

```
-XX:+PrintFlagsFinal
-XX:+UnlockDiagnosticVMOptions
```

---

# 🟥 第四部分：项目启动 JVM 参数常用模板

适用于大多数 SpringBoot / 微服务：

```
java \
-Xms1024m -Xmx1024m \
-Xss1m \
-XX:MetaspaceSize=128m \
-XX:MaxMetaspaceSize=256m \
-XX:+UseG1GC \
-Xlog:gc*:file=./gc.log \
-XX:+HeapDumpOnOutOfMemoryError \
-XX:HeapDumpPath=./oom.hprof \
-XX:+UseContainerSupport \
-XX:MaxRAMPercentage=75 \
-jar app.jar
```

---

# 🟥 第五部分：如何根据项目决定 JVM 参数？

步骤：

### ✔ 1. 根据业务类型估 Memory 起点：

- CRUD：512M–1G
    
- 微服务：1–4G
    
- 缓存/大对象：4–16G
    

### ✔ 2. 压测

观察 Full GC 后的 **Live Set**（存活对象大小）

### ✔ 3. Heap 配置为 LiveSet * 1.5～2

### ✔ 4. 预留：

- 栈
    
- Metaspace
    
- DirectMemory
    
- JVM 自身开销
    

### ✔ 5. 在容器中使用 MaxRAMPercentage

---

# 🟥 第六部分：一句话总结（面试标准版）

```
JVM 运行时内存由堆、方法区、线程栈、程序计数器和本地方法栈构成，
堆用于存放对象，方法区用于存放类元数据，线程栈用于方法调用过程。

JVM 参数主要控制内存大小（-Xms、-Xmx、Metaspace、栈大小）、GC 策略、
日志以及容器适配。常见的调优方式包括：根据 LiveSet 决定堆大小、
设置合适的栈空间和元空间，并使用 G1 或 ZGC 收集器。
```

---

如果你愿意，我还可以继续给你：

✔ JVM 结构图高清版  
✔ JVM 20 道高频面试题  
✔ JVM 进阶调优指南（GC 调优 + 内存调优）  
✔ 帮你根据实际项目估算 JVM 配置

你想继续哪个？