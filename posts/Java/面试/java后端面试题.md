---
title: java后端面试题
date: 2025-11-16
draft: false
author: Crain
tags:
  - "#面试"
  - "#Java"
updated: 2025-11-25
category: Java
---


# 1. 多线程相关基础

## 多线程怎么创建？要注意什么

常见方式：

1. 继承 `Thread`，重写 `run()`。`new Thread(...).start()` 启动。
2. 实现 `Runnable` 或 `Callable`（Callable 有返回值/可抛异常），配合 `Thread` 或 `ExecutorService` 使用。
3. 使用 `ExecutorService` / `ThreadPoolExecutor` 创建线程池（推荐生产环境）。
4. Java 8+ 可用 `CompletableFuture` 做异步编排。 注意点：

- 不要用 `run()` 直接调用，要用 `start()`。
- 线程安全：共享变量须加同步/原子操作/并发容器。
- 线程生命周期/资源清理：及时关闭线程池（`shutdown`/`shutdownNow`）。
- 避免死锁、活锁、资源竞争、过度线程切换（线程数不要随意爆炸）。
- 正确处理中断：线程应响应 `interrupt()`（检查 `Thread.interrupted()` 或在阻塞 API 捕获 `InterruptedException` 并恰当处理）。

## Java 中“快速失败”（fail-fast）是什么？

集合在遍历时，如果结构被并发修改（非迭代器自身的 `remove`），迭代器会检测到并抛出 `ConcurrentModificationException`，称为 fail-fast。目的：尽早发现并发修改问题。解决：使用并发集合（`ConcurrentHashMap`、`CopyOnWriteArrayList`）、或在外部加锁、或使用迭代器的安全删除方法。

## 泛型怎么用，它的作用是什么

- 语法如 `List<String>`、`class Box<T> { T val; }`。 作用：
- 编译期类型安全（减少强制转换）。
- 提高代码复用与可读性。
- Java 泛型是类型擦除（运行时无泛型信息），注意不能用泛型创建数组、不能在运行时判断泛型类型（`instanceof`），泛型静态域不能用类型参数。
- 通配符：`? extends T`（上界只读），`? super T`（下界写入安全）。

## Java 中的原子操作怎么实现

- 基本原子类型：`volatile`（可见性、禁止指令重排但非原子）。
- 原子类：`java.util.concurrent.atomic` 包（`AtomicInteger`、`AtomicReference` 等）通过 CAS（Compare-And-Swap）在用户空间实现无锁原子操作。
- 对复杂操作可用 `synchronized` 或 `Lock`。
- `LongAdder`/`LongAccumulator` 解决高并发下原子类的热点争用。

## Java 中的锁

- 内置锁：`synchronized`（JVM 层面，重入、可阻塞、支持 `wait/notify`）。
- 显示锁：`java.util.concurrent.locks.Lock`（如 `ReentrantLock`，支持公平/非公平、可中断锁、尝试获取锁 `tryLock()`）。
- 读写锁：`ReentrantReadWriteLock`（读多写少场景）；
- 偏向锁、轻量级锁、重量级锁（JVM 优化，涉及对象头 markword）。
- 乐观锁：CAS（`Atomic*`），适用于冲突少的场景。
- 悲观锁：`synchronized`/`Lock`，适用于竞争激烈或必须严格互斥时。
- 高级同步器：AQS（AbstractQueuedSynchronizer）是许多锁/同步器（`ReentrantLock`、`Semaphore`、`CountDownLatch`）的底层框架。

## HashMap 底层结构与冲突解决

- Java 8 前后主要结构：数组 + 链表，Java 8 在链表过长时转为红黑树（treeify），以降低最坏 O(n) 到 O(log n)。
- put 流程（简述）：根据 key.hashCode() 计算 hash -> 定位到数组索引 -> 若无元素则插入 -> 若有冲突，遍历链表/树更新或追加 -> 如链表长度超过阈值且数组容量足够，则 treeify -> resize 时会 rehash/迁移。
- 解决冲突：链表（JDK7-）/链表+树（JDK8+），通过扩容/树化减少冲突影响。
- 注意：`HashMap` 不是线程安全的，二次并发修改可能导致死循环（jdk1.7）或数据不一致。

## ThreadLocal 是什么，使用注意

- ThreadLocal 为每个线程提供独立变量副本，常用于保存线程上下文（如用户请求信息、SimpleDateFormat、数据库连接等）。
- 用法：`ThreadLocal<T> tl = ThreadLocal.withInitial(() -> initialValue); tl.get()/tl.set()/tl.remove()`。 注意：
- 必须在适当时机调用 `remove()`，尤其在线程池中，避免内存泄漏（因为线程复用导致旧值长期存在）。
- 存放大型对象或非必要内容会造成内存/泄漏问题。
- ThreadLocal 不会在子线程自动传递（`InheritableThreadLocal` 可以，但要慎用）。

# 2. Java 锁、Synchronized vs ReentrantLock、AQS

## 对 Java 锁的理解

- 锁用于保护共享资源并保证互斥与可见性。不同锁有不同特性（可重入、可中断、公平性、性能开销）。
- JVM 对 `synchronized` 做了大量优化（偏向、轻量级、重量级）。

## `synchronized` 与 `ReentrantLock` 区别（要点）

- `synchronized`：JVM 实现，语法糖（方法或代码块），自动释放锁（异常时也会释放），支持 `wait/notify`，实现较简单，JVM 优化好（偏向/轻量）。
- `ReentrantLock`：Java API 实现，功能更多（`tryLock(timeout, unit)`、可中断 `lockInterruptibly()`、可选择公平锁/非公平锁、可创建 `Condition` 实现类似 `wait/notify` 的多条件等待），需要手动 `unlock()`（要放在 finally）。
- 性能：在高并发下，两者差别依场景和JVM版本而异；`ReentrantLock` 在某些场景可提供更灵活性能策略。

## AQS（AbstractQueuedSynchronizer）原理（简述）

- AQS 提供一个 FIFO 等待队列（双向链表）和一个 `volatile int state` 做资源同步状态。
- 基本思想：将线程请求资源的逻辑（独占/共享）通过继承 AQS 并实现 `tryAcquire/tryRelease` 或 `tryAcquireShared/tryReleaseShared`，AQS 负责将阻塞线程排入队列并唤醒。
- 多个并发组件（`ReentrantLock`、`Semaphore`、`CountDownLatch`、`FutureTask`）都基于 AQS 实现。

# 3. JVM 理解与 1.7 → 1.8 改进（概要）

## 对 JVM 的理解

- JVM 是运行 Java 字节码的虚拟机，包含类加载器子系统、执行引擎（解释器+JIT）、内存管理（堆、方法区、栈、本地方法栈、PC 寄存器）、垃圾回收器与运行时数据区。
- 类加载：双亲委派、类加载器（Bootstrap、Ext、App、自定义）。
- JIT/HotSpot 优化：方法内联、逃逸分析、锁消除/锁粗化等。

## JDK1.7 → JDK1.8 的主要改进（重要点）

- 元空间（Metaspace）：移除 PermGen（永久代），类元数据移出堆，默认使用本地内存（可通过 `-XX:MaxMetaspaceSize` 限制）。目的：解决 PermGen 导致的内存调优痛点。
- Lambda & invokedynamic 支持（语言层面 & invokedynamic 字节码），使得函数式编程、动态语言支持更高效。
- JDK8 库增强：Stream API、Optional、新的日期时间 API（java.time）、并发包增强（`CompletableFuture` 等）。
- String 优化（JDK7 中期把字符串常量池移到堆；JDK8 又做了内部实现调整）：注意细节随具体 update 版本可能变化。
- JIT 和 GC 的许多优化，但总体方向是更好的性能与更少停顿。

## 垃圾回收有哪些改动（简述）

- PermGen -> Metaspace（JDK8）。
- G1 GC 持续改进（后来版本成为默认）。
- CMS 在后续版本开始被弃用，出现更现代的收集器（G1、ZGC、Shenandoah 等）。 （历史细节因 JDK update 不同而细微差别）

# 4. 垃圾回收器比较与 G1 工作原理

## 常见垃圾收集器（简述优缺点）

- Serial（单线程，适合小堆、单核环境，停顿短小系统开销小）。
- Parallel（并行标记-复制，吞吐优先，适合多核批处理）。
- CMS（Concurrent Mark Sweep，尽量减少停顿，但会有浮动垃圾和空间碎片，已逐步被弃用）。
- G1（Garbage-First）：面向大堆、希望有可预测停顿，分区（region）管理，混合回收并发标记，目标停顿设定。
- ZGC / Shenandoah（低停顿收集器，适合超大堆和低停顿需求，分代/并发设计）。 优缺点概览：
- 吞吐优先 vs 停顿优先取舍；并发收集器会占用 CPU 做并发工作但减少停顿；复制算法避免碎片但空间开销大。 （面试时可结合具体场景举例）

## G1 收集器工作原理要点

- 将堆划分为多个相同大小的 region（不再是连续年轻代/老年代的固定分区）。
- 年轻代回收以回收率优先（回收含大量垃圾的 region），并进行并行复制回收（复制算法）。
- 有并发标记阶段：初始标记（和 Young GC 同步）、并发标记（并发扫描活跃对象）、最终标记、并发清理/回收。
- 混合回收会回收年轻代和一些老年代 region，逐步整理堆。
- 可以通过参数调整目标停顿时间（`-XX:MaxGCPauseMillis`）和并发标记触发阈值（`-XX:InitiatingHeapOccupancyPercent`）等。

## 怎么调整老年代阈值（针对 G1）

- G1 控制什么时候触发并发标记（进而影响老年代何时开始回收）：`-XX:InitiatingHeapOccupancyPercent=<n>`（默认约 45），减小会更早触发并发标记，使老年代回收更频繁。
- 也可调整堆大小、年轻代比例、目标停顿时间等参数来影响老年代生长与回收策略。  
    （调优要基于 GC 日志与应用实际行为，先用 `-Xlog:gc*`/`-XX:+PrintGCDetails`/GC 分析工具观察）

# 5. Java 集合理解与相关实现差异

## HashMap / HashSet / LinkedHashMap 底层实现

- `HashMap`：数组 + 链表/树（见上）。key/value 存于 `Entry`/`Node`。允许 null key。
- `HashSet`：内部实际上基于 `HashMap`（把元素作为 key 存入，value 为固定常量）。
- `LinkedHashMap`：继承自 `HashMap`，在每个节点维护双向链表（维护插入顺序或访问顺序），常用于实现 LRU 缓存（结合 `removeEldestEntry()`）。

## ConcurrentHashMap 1.7 -> 1.8 的改进

- JDK1.7：采用 Segment（分段锁）+ 每段内部是 Hashtable 风格，锁粗粒度是 segment。
- JDK1.8：移除了 Segment，引入 CAS + synchronized 结合链表/树化的方式，对单个桶使用 CAS 初始化链表头、对链表插入时使用 synchronized（锁粒度更细）并支持树化（红黑树），并发度更好，内存占用更低，扩容逻辑也改进。

# 6. MySQL 日志与 undo log 原子性

## 常见 MySQL 日志

- error log（错误/启动/停止信息）。
- general query log（记录所有连接与 SQL 请求，调试用，开销大）。
- slow query log（记录耗时 SQL，用于性能分析）。
- binary log（binary log，记录修改数据的事件，主从复制与增量备份用）。
- relay log（从库的中继日志）。
- InnoDB 的事务/崩溃恢复相关日志（重做日志 `ib_logfile`，undo 存储在 undo 表空间）。 用途：诊断、复制、审计、恢复、性能分析。

## undo log 如何保证事务的原子性

- InnoDB 使用 undo log 保存修改前的数据（用于回滚与 MVCC 读取快照）。
- 事务修改先产生 undo（在事务提交前供回滚），数据变更对磁盘的可见性受 redo log 和事务提交控制。
- 若事务回滚，使用 undo log 恢复旧值；若提交，undo 可被清理。结合事务隔离与 redo/undo 机制，保证原子性与可恢复性。

# 7. MySQL 索引、B树 vs B+树、索引失效

## 索引怎么实现

- 常用 B+ 树索引（InnoDB 用聚集索引：主键索引的叶子节点存储行数据；二级索引叶子存储主键指针）；还有哈希索引（如 Memory 的哈希索引）、全文索引、倒排索引、R-Tree（空间索引）等。

## B 树 vs B+ 树区别

- B+ 树：所有数据都存储在叶子节点，内部节点只存键（更扁平、节点数更少）；叶子节点通常通过链表连接，利于范围扫描。
- B 树：内部节点也存数据。 为什么 B+ 树查找快？磁盘 IO 优化：更高的扇区利用率、更少的层级；范围查询只需从叶子顺序遍历，性能好。

## 索引失效常见原因

- 对列使用函数或表达式（`WHERE DATE(col) = ...`）。
- 前缀不使用（对左边前缀索引有效，对非前缀无效）。
- 使用 `OR` 且没有合适索引。
- 数据类型不匹配导致隐式转换。
- 使用通配符 `%abc`（前导通配符）。
- `NOT IN`、`!=` 等非可索引操作。
- 过度低基数字段（几乎没选择性）索引意义小。 解决策略：重写 SQL、加合适索引、避免在 WHERE 上做函数操作、考虑覆盖索引等。

# 8. Redis 数据类型与底层实现、为什么用跳表实现有序集合

## Redis 常见数据类型与底层

- String：SDS（简单动态字符串），二进制安全，头部存储长度。
- List：`quicklist`（Redis 3.2+，由压缩列表或双向链表的组合实现以节省空间）；早期是双向链表或 ziplist。
- Set：当元素较少可能使用 `intset`（整数集合压缩结构），否则使用哈希表（dict）。
- Hash：小对象用 ziplist，否则用哈希表。
- Sorted Set（有序集合）：内部使用跳表（skiplist）+ 哈希表（用于按 member 查找 score）；跳表用于按分数范围/有序遍历，哈希表用于 O(1) 的按元素查找。

## 为什么用跳表实现有序集合

- 跳表支持 O(log n) 的查找、插入、删除，且结构简单并且并发友好（实现相对容易）。
- AVL/红黑树实现复杂且代码复杂度高；跳表能同时满足范围查询和高效插入删除。
- Redis 使用跳表配合哈希实现既能按成员快速查找（hash），又能按分数做有序遍历（skiplist）。

# 9. Spring Bean 生命周期及循环依赖

## Spring Bean 生命周期（简化）

1. 实例化（`Instantiation`）
2. 设置属性（依赖注入，`Populate`）
3. `BeanNameAware`/`BeanFactoryAware` 等回调
4. `BeanPostProcessor#postProcessBeforeInitialization`
5. `@PostConstruct` / `afterPropertiesSet()`（InitializingBean）
6. `BeanPostProcessor#postProcessAfterInitialization`
7. 使用：容器关闭时触发 `@PreDestroy` / `destroy()` 等

## Spring 如何解决循环依赖

- 单例 bean：通过三级缓存（`singletonObjects`、`earlySingletonObjects`、`singletonFactories`）提前暴露“半成品”引用（early reference），让 A 引用 B 的早期引用，从而解决常见构造之外的 setter 注入循环依赖。
- 注意：构造器注入（constructor）无法通过三级缓存解决，会报循环依赖异常。

## `@Lazy` 能否解决循环依赖？

- `@Lazy` 可以延迟某个 bean 的创建，以避免立即循环依赖（在某些场景可用），但不是万能方案；最佳是重构代码，避免复杂循环依赖。

# 10. 计算机网络 OSI 七层（简述）

1. 物理层（Physical）：比特传输、物理媒体。
2. 数据链路层（Data Link）：帧、MAC 地址、链路可靠性（如以太网）。
3. 网络层（Network）：路由、IP 地址（如 IPv4/IPv6）。
4. 传输层（Transport）：端到端通信、可靠性（TCP）、无连接（UDP）、端口。
5. 会话层（Session）：会话管理、连接保持（现实中常合并到上层）。
6. 表示层（Presentation）：数据表示/编码/加密（如 SSL 的一部分在此层概念上）。
7. 应用层（Application）：HTTP、FTP、DNS、SMTP 等应用协议。

# 11. 线上接口超时排查步骤（实战流程）

1. 查看监控（QPS/RT/错误率、机器资源：CPU、内存、GC、线程数）。
2. 查看服务端日志/慢日志/堆栈（是否有阻塞或异常）。
3. 获取线程快照（`jstack`）看是否处于 BLOCKED/WAITING/IO 等。
4. 排查依赖（DB、缓存、RPC、第三方服务）是否是瓶颈（查看慢查询、慢请求）。
5. 网络问题（丢包、延迟、连接数）。
6. 逐层定位：客户端超时还是服务端超时？若是服务端，细化是请求处理慢还是响应写回慢。
7. 临时缓解措施：限流、熔断、降级、增加实例、扩容资源。
8. 根因处理：优化 SQL、缓存、异步化、批处理、重试策略、微调线程池/连接池参数。

# 12. 设计秒杀系统要点（高概览）

关注点：高并发、短时突发流量、库存一致性、性能与可用性 核心策略：

- 接入层：使用 CDN、WAF、负载均衡；Nginx + 限流（令牌桶、漏桶）与熔断。
- 流量削峰：预热、排队（消息队列/分布式队列）、限速、验证码、白名单、分批放行。
- 缓存与预减库存：先在 Redis 使用原子 Lua 脚本预减库存，成功者放入队列异步做数据库扣减，失败直接返回。
- 下单异步化：把订单写入 MQ，由后台消费、串行化扣减库存与写 DB，避免 DB 并发写冲突。
- 防超卖：原子性的缓存操作（Lua），数据库侧使用乐观锁（版本号/compare-and-swap）、或使用行锁/存储过程；设计幂等（订单号/幂等表）。
- 数据一致性：最终一致性方案，消息可靠投递，幂等消费。
- 性能优化：热点数据分片、压测、限流、读写分离、分库分表、缓存穿透/击穿/雪崩防护。
- 安全：验证用户、限购策略、防刷（IP 限制、行为评分）。

# 13. 算法题：查找两个链表的交点

常见方法：

1. 计算长度法：先算两个链表长度，长链表先走差值步，然后同时向后遍历，首次相同节点即交点（O(n) 时间，O(1) 空间）。
2. 双指针法（更优雅）：指针 a 从链表 A 开始，b 从链表 B 开始，遍历到尾部则跳到另一个链表的头，当 a == b 时即为交点（最终要么同时为 null 要么交汇）。时间 O(n)，空间 O(1)。

# 14. 小题速答（列出答案要点）

1. `Integer a = 500; Integer b = 500; a == b` 返回什么？

- 返回 `false`。因为 `Integer` 缓存仅在 -128 到 127 范围内自动装箱会引用同一对象，500 超出缓存范围，会产生不同对象，`==` 比较引用。

2. `&` 和 `&&` 区别

- `&`：位运算符（整型），或逻辑与（布尔）但不短路（两个操作数都会求值）。
- `&&`：逻辑短路与（布尔），左侧为 false 时右侧不求值。

3. `final` / `finally` / `finalize`

- `final`：修饰类/方法/变量（不可继承/不可重写/不可变）。
- `finally`：异常处理中的块，无论是否抛异常都会执行（常用于资源释放）。
- `finalize()`：`Object` 的方法，垃圾回收时 JVM 可调用（不可靠、已废弃/建议不用），不要依赖它做资源释放，推荐使用 try-with-resources 或显式释放。

4. IO 流有几种？IO 的三种类型（常见分类）

- 按数据单位：字节流（`InputStream`/`OutputStream`）和字符流（`Reader`/`Writer`）。
- 按功能：节点流/处理流（Buffered、Data、Object）。
- IO 模型（三种经典模型）：阻塞 IO（BIO）、非阻塞 IO（NIO）、异步 IO（AIO）。 （面试按题目侧重点可扩展）

5. Java 常见集合

- `List`（ArrayList、LinkedList）、`Set`（HashSet、LinkedHashSet、TreeSet）、`Map`（HashMap、LinkedHashMap、TreeMap）、`Queue`（ArrayDeque、PriorityQueue）、并发集合（ConcurrentHashMap、CopyOnWriteArrayList、BlockingQueue 等）。

6. ArrayList vs LinkedList

- ArrayList 基于动态数组，随机访问 O(1)，插入/删除尾部 O(1)，中间插入删除 O(n)（需要移动元素）。
- LinkedList 基于双向链表，随机访问 O(n)，插入/删除（已定位节点）O(1)，空间开销较大，适合频繁插入删除场景。 选择依据：读多用 ArrayList，插删多用 LinkedList（但实际大多数场景 ArrayList 更常用）。

7. 线程安全的 List 实现方式

- 使用 `Vector`（过时）、`Collections.synchronizedList(list)`（外层同步）、`CopyOnWriteArrayList`（读多写少场景，写时复制）、使用并发队列/集合包装或通过外部锁（`synchronized`/`ReentrantLock`）。

8. HashMap 是否线程安全？

- 不是线程安全的。在并发环境要使用 `ConcurrentHashMap` 或外部加锁。

9. ThreadLocal

- 见前面 ThreadLocal 部分（线程隔离、注意 remove、防内存泄漏）。

10. Java 的线程池是什么，怎么创建

- 线程池是 `ExecutorService` 接口（避免频繁创建销毁线程）。
- 创建方式：
    - `Executors.newFixedThreadPool(n)`、`newCachedThreadPool()`、`newSingleThreadExecutor()`、`newScheduledThreadPool()`。
    - 更推荐直接使用 `new ThreadPoolExecutor(corePoolSize, maxPoolSize, keepAliveTime, TimeUnit, BlockingQueue, ThreadFactory, RejectedExecutionHandler)` 以便精细化控制。

11. Java 并发工具类（常见）

- `CountDownLatch`, `CyclicBarrier`, `Semaphore`, `Exchanger`, `Phaser`
- `ConcurrentHashMap`, `CopyOnWriteArrayList`, `BlockingQueue`（`ArrayBlockingQueue`、`LinkedBlockingQueue`、`PriorityBlockingQueue`）
- `Atomic*` 系列、`Lock`（`ReentrantLock`）、`ReadWriteLock`、`ForkJoinPool`、`CompletableFuture`。

12. 线程池 `execute` 与 `submit` 区别

- `execute(Runnable)`：返回 void，异常在 `execute` 中由线程处理（会到 `UncaughtExceptionHandler`）。
- `submit(Callable/Runnable)`：返回 `Future`，可以获取结果/异常，异常会被封装在 Future 中（调用 `get()` 会抛出 ExecutionException）。

13. Spring 常见注解

- `@Component/@Service/@Repository/@Controller/@RestController`、`@Autowired/@Qualifier/@Resource`、`@Configuration/@Bean`、`@Value`、`@Scope`、`@PostConstruct/@PreDestroy`、`@Transactional`、`@Aspect`（AOP）等。

14. Spring 用到的设计模式

- 依赖注入（IoC）、单例模式（bean 默认单例）、代理模式（AOP）、模板方法（JdbcTemplate）、工厂模式（BeanFactory/FactoryBean）、观察者（ApplicationEvent）等。

15. Spring AOP 可以做的事 & 示例

- 横切关注点：事务管理、日志、权限校验、性能监控、缓存切面等。
- 示例：用 `@Transactional` 在方法前开启事务，方法异常回滚。AOP 可通过代理在方法前后织入代码。

16. Redis 数据结构（见第8点）
    
17. Redis 持久化方式
    

- RDB（快照，点时间恢复，恢复快，占用少但可能丢失数据）、AOF（Append Only File，逐条记录写操作，数据恢复更完整，但文件变大、恢复慢）、两者混合（可同时开启），AOF 可配置 fsync 策略。

18. MySQL 与 Redis 缓存一致性 常见策略：

- Cache Aside（应用写 DB 后删除缓存或先删后写）——推荐但需处理并发（double delete + 延迟再删除或消息队列保证顺序）。
- Write Through / Write Behind（写缓存同时写 DB/异步刷 DB）。
- 使用分布式锁或版本号、乐观锁保证一致性。
- 异步场景需保证幂等与可靠投递。

19. Redis 用缓存时间保证一致性？

- 缓存过期可以减少长期不一致，但不能保证实时一致。常用结合策略：缓存失效/双删策略/短 TTL + 后续延迟删除/消息队列保证顺序写等。

20. MySQL 日志类型（见第6点）
    
21. MySQL 慢查询方法
    

- 开启慢查询日志、使用 `EXPLAIN`、`SHOW PROCESSLIST`、`performance_schema`、`pt-query-digest` 分析、开启 `slow_query_log` 并设置 `long_query_time`。

22. 如何根据 EXPLAIN 优化 SQL 看关键字段：`type`、`possible_keys`、`key`、`rows`、`Extra`（如 Using filesort、Using temporary）：

- 确认是否用到索引，若没用考虑添加合适索引或改写 WHERE、避免函数在列上、避免 `SELECT *`、避免大量 `OR`、使用覆盖索引、优化 JOIN 顺序等。

23. 创建索引注意点

- 选择高选择性列、尽量用覆盖索引、注意索引顺序（组合索引），避免给更新频繁的列过多索引（影响写性能），避免过长前缀索引，评估索引大小与内存占用。

24. 索引越多越好吗？

- 不是。索引越多写操作开销越大（插入/更新/删除都要维持索引），且占用更大内存。需权衡读写比。

25. 分布式事务实现方式

- 两阶段提交（2PC / XA）：强一致性，但性能差且容易阻塞。
- TCC（Try-Confirm-Cancel）：业务粒度控制，需开发支撑。
- SAGA（基于补偿事务）：最终一致性，适合长事务。
- 基于消息（可靠消息/事务消息）：异步最终一致性方案。

26. RabbitMQ 死信交换机（DLX）及其他用途

- 消费者拒绝（`basic.reject` / `basic.nack`）或 TTL 到期或队列容量满等情形可将消息转发到死信交换机。
- 用途：重新试验、延迟队列（借助 TTL + 死信转发实现）、记录失败消息、实现死信队列分析/告警。

27. ES 在项目中使用

- 全文检索、模糊匹配、聚合分析、日志检索、实时分析、Autocomplete、推荐/相似检索等；需注意 mapping 设计、分片/副本、倒排索引与一致性、近实时特性、索引量与内存消耗。

# 附加：Object 的常见方法（如 equals）

- `equals(Object obj)`：对象等价判断，默认实现（Object）比较引用，类通常重写（如 `String`、实体类）需同时重写 `hashCode()`。`equals` 与 `hashCode` 的约定：相等的对象必须有相同的 `hashCode()`。
- `hashCode()`：用于 hash 容器定位，需保持稳定性。
- `toString()`：字符串表示，方便调试。
- `finalize()`：见上（不推荐使用）。
- `clone()`：浅拷贝（需要实现 `Cloneable` 并重写 `clone()`，一般推荐使用 copy ctor 或序列化实现深拷贝）。

# sync 锁（synchronized）补充

- 是基于对象监视器（monitor）的互斥锁，支持重入（同一线程可重复获取）。
- JVM 有偏向/轻量级/重量级锁优化，减少无竞争时的同步开销。
- 可用于方法（锁对象为 `this` 或类对象）或代码块（指定锁对象）。
- 配合 `wait/notify/notifyAll` 做线程协作（必须在锁内调用）。

# ThreadLocal 实际应用场景与问题

场景：保存请求上下文（如用户 id、traceId）、数据库连接（非推荐）、格式化工具（`SimpleDateFormat`）的线程安全替代、日志上下文（MDC）。 问题：在使用线程池时若不 `remove()` 会造成内存泄漏或旧数据穿透到后续任务；还要避免把大对象放入 ThreadLocal 中。

# Spring AOP 更具体一点的例子

- 场景：统一日志记录（进入/退出方法、耗时统计）、自动记录异常、权限校验（方法拦截判断角色）、缓存注解实现（在切面中先读缓存，未命中再调用目标方法、写回缓存）。
- 实现：Spring AOP 基于代理（JDK 动态代理或 CGLIB），织入点表达式匹配目标方法，然后在代理前后执行切面逻辑。

# MVCC（MySQL/InnoDB）

- 多版本并发控制（MVCC）通过保存数据的多个版本（undo log）给每个事务一个快照视图，读操作无需加锁（快照读），写操作使用行锁（或乐观机制）。
- 实现细节：InnoDB 使用 undo log 来生成快照，事务根据 `transaction id` 和 undo 记录判断数据可见性，隔离级别影响可见性（Read Committed、Repeatable Read）。

# 在 MySQL 中如何实现乐观锁

- 常用做法：使用版本号字段（`version`）或时间戳。更新时带上旧版本 `UPDATE table SET ... , version = version + 1 WHERE id = ? AND version = oldVersion`，若受影响行数为 0 则说明冲突，需重试或失败处理。

# HashMap 存储结构与 put 流程（简述）

- 详见前面的 HashMap 部分（hash -> index -> 如果为空插入 -> 否则遍历链表/树更新或追加 -> 根据阈值扩容/ treeify）。

# 当在浏览器输入 URL 时发生什么（简要端到端）

1. DNS 解析域名得到 IP（本地缓存、hosts、DNS 服务器、CNAME）。
2. 建立 TCP 连接（三次握手）。
3. 若是 HTTPS，进行 TLS 握手（证书验证、密钥协商）。
4. 发送 HTTP 请求（请求行、头、Body）。
5. 服务器接收、路由到对应应用、处理（可能访问 DB/缓存/后端服务）。
6. 服务器返回 HTTP 响应。
7. 浏览器解析响应（HTML/CSS/JS），发起子资源请求，执行脚本渲染页面。
8. 连接复用（keep-alive）、缓存、CDN 等会影响整体过程。

---

如果你需要我针对某一项**展开到面试级别的回答（含示例代码、常见追问及回答要点）**，告诉我具体序号或主题，我把那一部分扩展成练习题与答案示例。你想先从哪几题强化？