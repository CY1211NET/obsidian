

---

# 🟥 1. 内置锁：`synchronized`

### 👉 JVM 层面同步机制（隐式锁）

你可以把 `synchronized` 想象成：

> **厕所门上的“已占用”牌子：门锁着别人就进不来。**

### ✔ 特点

- **可重入**：你已经在厕所里了，还可以进小隔间（递归调用）
    
- **阻塞式**：别人来了只能在外面排队
    
- **wait/notify**：像敲门通知里面的人“好了没”
    

### ✔ 例子

```java
public synchronized void buy() {
    System.out.println("买票中");
}
```

---

# 🟥 2. 显式锁：`Lock`（如 `ReentrantLock`）

### 👉 手动锁，更灵活（自己上锁、自己开锁）

生活例子：

> **你自己买了个高科技智能锁，功能多，可以设置密码、指纹、远程开锁。**

比 `synchronized` 更高级的地方：

### ✔ 特性

- **公平锁/非公平锁**  
    公平锁 = 先来先服务  
    非公平锁 = 插队（性能高）
    
- **tryLock()**  
    不想排队时试一下锁：
    
    > “有空我就干，没空我就走。”
    
- **可中断锁**  
    被别人喊一声你可以“放弃等待”
    

### ✔ 示例

```java
Lock lock = new ReentrantLock(true); // 公平锁
if (lock.tryLock()) {
    try {
        doSomething();
    } finally {
        lock.unlock();
    }
}
```

---

# 🟥 3. 读写锁：`ReentrantReadWriteLock`

### 👉 读多写少时效率极高

生活例子：

> **图书馆：很多人能一起看书（读锁），但只有管理员能往书架放书（写锁）。**

### ✔ 特性

- 多个读线程可以同时读
    
- 写线程必须“独占”
    
- 适合缓存、查询服务、配置信息
    

### ✔ 示例

```java
ReadWriteLock rw = new ReentrantReadWriteLock();
rw.readLock().lock();
try {
    readData();
} finally {
    rw.readLock().unlock();
}
```

---

# 🟥 4. 锁优化：偏向锁 / 轻量级锁 / 重量级锁

这些是 JVM 对 `synchronized` 的优化，不用你写代码，是 JVM 自动升级的。

### 你可以把它理解为：

> **厕所的智能门锁，自动根据排队人数选择开锁方式。**

### ✔ 偏向锁

- 没有竞争的时候（只有一个人使用）
    
- **连“看门人”都不配了，直接信任这一个线程**
    

（性能最高）

---

### ✔ 轻量级锁

- 有一些竞争，但不严重
    
- 多个线程尝试 CAS 自旋抢锁（不阻塞）
    

---

### ✔ 重量级锁

- 很多人排队
    
- JVM 直接进入“阻塞模式”（monitor）
    

（性能最差）

---

### 👉 这些锁反映在对象头的 **Mark Word** 中

你可以理解为：

> **锁的模式写在对象的“身份证”里。**

---

# 🟥 5. 乐观锁：CAS（Atomic*）

### 👉 无锁方案，“认为别人不会来抢”

生活例子：

> **你冰箱里有瓶可乐，你拿之前“瞟一眼（CAS）”，  
> 如果还在，就拿走；如果别人刚拿了，失败，再试一次。**

### ✔ CAS 原理

```
if (value == expectedValue) {
    value = newValue;
}
```

### ✔ 用途

- AtomicInteger
    
- AtomicReference
    
- 高并发计数器
    
- 乐观并发，不阻塞线程
    

### ✔ 优点

- 性能极高（无阻塞）
    

### ✔ 缺点

- ABA 问题
    
- 自旋消耗 CPU
    

---

# 🟥 6. 悲观锁：synchronized / Lock

### 👉 假设“别人肯定来抢”，先锁上再说

生活例子：

> **你去冰箱直接锁门：不让我独占谁也别碰。**

### ✔ 场景

- 竞争激烈
    
- 必须互斥
    
- 保证严格同步正确性
    

---

# 🟥 7. AQS（AbstractQueuedSynchronizer）

### 👉 Java 所有高级锁的“底层框架”

生活例子：

> **银行排队系统：每个来办事的人排队等待，被叫号后进入窗口。**

AQS 的作用就是：

- 维护一个 **等待队列（CLH 队列）**
    
- 使用 **CAS** 控制获取锁状态
    
- **park/unpark** 挂起与唤醒线程
    

### ✔ 基于 AQS 的组件

|组件|作用|
|---|---|
|`ReentrantLock`|基本锁|
|`ReentrantReadWriteLock`|读写锁|
|`Semaphore`|限制线程数量|
|`CountDownLatch`|等待多个任务结束|
|`FutureTask`|异步任务|

---

# 🟥 总结：一句话串起来（面试版）

```
Java 中的锁体系由 synchronized 和 Lock 为核心。
synchronized 是 JVM 内置锁，支持重入和阻塞，并且 wait/notify 基于它实现。
ReentrantLock 是显式锁，支持公平锁、可中断、定时获取锁等高级特性。
读写多时使用 ReentrantReadWriteLock，实现读共享写独占。
synchronized 底层依赖对象头 MarkWord，通过偏向锁、轻量级锁、重量级锁作性能优化。
乐观锁通过 CAS（Atomic 类）实现，适合低竞争场景；悲观锁使用 synchronized/Lock。
更高级的同步工具（Semaphore、CountDownLatch）都基于 AQS 框架实现。
```

---
