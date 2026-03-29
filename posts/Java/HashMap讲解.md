---
Author:
  - Crain
tags:
  - "#Java"
from: 2025-06-27
emaili: y252840@163.com
title: HashMap讲解
---


---

非常好，你希望将这次关于 `HashMap` 的学习内容整理为**完整、系统化的笔记**，不仅包括底层原理，还要涵盖 **使用方法、常用 API、遍历方式、注意事项等**。下面是最终整理版本，内容全面，适合作为复习与学习资料保存：

---

# 📘 Java `HashMap` 使用与底层原理全笔记

---

## 🧱 一、什么是 HashMap？

- `HashMap` 是 Java 中基于哈希表实现的 **键值对存储结构**。
    
- 允许 **key 和 value 都为 null**（最多一个 null key）。
    
- 非线程安全，适用于单线程场景。
    

---

## 🔧 二、常用构造方法

```java
HashMap<K, V> map = new HashMap<>();             // 默认容量 16，负载因子 0.75
HashMap<K, V> map = new HashMap<>(32);           // 指定初始容量
HashMap<K, V> map = new HashMap<>(32, 0.6f);     // 指定容量 + 负载因子
HashMap<K, V> map = new HashMap<>(otherMap);     // 复制另一个 Map
```

---

## 🛠️ 三、常用 API 方法

|方法|说明|
|---|---|
|`put(K key, V value)`|添加键值对（若 key 已存在会覆盖）|
|`get(Object key)`|获取 key 对应的 value|
|`remove(Object key)`|删除指定 key 的 entry|
|`containsKey(Object key)`|判断是否包含 key|
|`containsValue(Object value)`|判断是否包含 value|
|`size()`|返回元素个数|
|`isEmpty()`|判断是否为空|
|`clear()`|清空所有元素|

---

## 🔁 四、遍历方式

```java
// 1. 遍历键
for (K key : map.keySet()) {
    System.out.println(key);
}

// 2. 遍历值
for (V value : map.values()) {
    System.out.println(value);
}

// 3. 遍历键值对
for (Map.Entry<K, V> entry : map.entrySet()) {
    System.out.println(entry.getKey() + " => " + entry.getValue());
}
```

---

## 🧠 五、底层实现原理

### 5.1 底层结构

```java
Node<K, V>[] table;  // 本质是一个数组
```

- 每个数组元素是一个“桶”，桶中可能是：
    
    - 单个节点（无冲突）
        
    - 链表（冲突不多）
        
    - 红黑树（冲突多时优化）
        

---

### 5.2 哈希计算方式

```java
int hash = hash(key.hashCode());         // hash扰动函数
int index = (table.length - 1) & hash;   // 计算桶位置
```

- 使用位运算替代取模，前提：容量必须为 2 的幂。
    

---

### 5.3 冲突处理方式

|情况|处理方式|
|---|---|
|同一桶多个元素|链表方式存储|
|同桶元素 > 8 且数组容量 ≥ 64|转换为红黑树，提高查找性能|

---

### 5.4 负载因子（Load Factor）

- **定义**：`元素数量 / 数组容量`
    
- **默认值**：`0.75`（性能与空间利用的折中）
    
- 超过负载阈值 → 触发扩容（resize）
    

```java
threshold = capacity * loadFactor;
```

---

### 5.5 扩容机制

触发扩容时：

1. 数组容量扩大为原来的 2 倍
    
2. 重新计算所有 key 的 hash 并分配到新数组
    
3. 可能重新组织链表或红黑树结构
    

🧨 注意：扩容代价高，应尽量避免频繁触发。

---

## 📏 六、容量设置建议

### 6.1 默认行为

```java
HashMap<String, String> map = new HashMap<>();
// 默认容量 16，负载因子 0.75，threshold = 12
```

### 6.2 建议设置方式

```java
int expectedSize = 10000;
int capacity = (int) (expectedSize / 0.75f) + 1;
HashMap<K, V> map = new HashMap<>(capacity);
```

🔍 JDK 会自动将设置的容量向上调整为最近的 2 的幂次方（如 20 → 32）

---

## ⚖️ 七、容量设置 vs 多次扩容（对比）

|维度|一开始设置容量|多次扩容|
|---|---|---|
|性能|插入平稳，效率高|插入过程中卡顿，效率下降|
|内存使用|初始多占一点内存|初期占用少，但可能不稳定|
|CPU 占用|一次 hash 计算|多次重算 hash 与复制操作|
|编程质量|明确预测行为|缺乏规划，可能后期崩溃|

---

## ⚠️ 八、使用注意事项

- HashMap **不是线程安全的**，多线程下请使用 `ConcurrentHashMap`。
    
- `null` key 最多只能有一个。
    
- 若不指定初始容量，**大量插入数据会频繁扩容，严重影响性能**。
    
- 若频繁 remove 操作，大量链表节点可能无法及时回收，需注意内存。
    

---

## 🧪 九、应用示例（TwoSum）

```java
public int[] twoSum(int[] nums, int target) {
    HashMap<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int diff = target - nums[i];
        if (map.containsKey(diff)) {
            return new int[] { map.get(diff), i };
        }
        map.put(nums[i], i);
    }
    return new int[] {};
}
```

---

## 🧩 十、相关扩展

|类名|特点|
|---|---|
|`TreeMap`|有序（基于红黑树）|
|`LinkedHashMap`|有序（维护插入顺序）|
|`ConcurrentHashMap`|并发安全，适用于多线程环境|

---
好的！我们现在将这份 HashMap 学习笔记进一步扩展，**加入测试用例、底层源码解析、经典面试题复盘**三大板块，完整且深入，助你真正掌握这一核心知识点。
___

## 🧪 十一、常用测试案例

以下是一些典型使用场景的单元测试示例：

### ✔️ 1. 基本插入与查询

```java
Map<String, Integer> map = new HashMap<>();
map.put("apple", 3);
map.put("banana", 5);
System.out.println(map.get("apple"));  // 输出 3
```

### ✔️ 2. 键覆盖（覆盖旧值）

```java
map.put("apple", 10);  // 原值 3 被覆盖
System.out.println(map.get("apple"));  // 输出 10
```

### ✔️ 3. null 键与 null 值

```java
map.put(null, 999);
map.put("orange", null);
System.out.println(map.get(null));     // 输出 999
System.out.println(map.containsValue(null));  // true
```

### ✔️ 4. 遍历输出所有键值对

```java
for (Map.Entry<String, Integer> entry : map.entrySet()) {
    System.out.println(entry.getKey() + " => " + entry.getValue());
}
```

---

## 🧬 十二、底层源码解读（JDK 1.8）

我们来看核心源码（部分关键逻辑简化注释）：

### 🔍 put() 方法

```java
public V put(K key, V value) {
    return putVal(hash(key), key, value, false, true);
}
```

### 🔍 hash() 方法

```java
static final int hash(Object key) {
    int h;
    return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
}
```

👉 **扰动函数**：降低哈希碰撞概率，提高 hash 分布均匀性。

### 🔍 putVal() 内部逻辑

核心步骤如下：

1. **计算 hash**
    
2. **查找 table[index] 桶**
    
3. 如果为空，直接插入新节点
    
4. 如果不为空：
    
    - 遍历链表或红黑树，查找是否已有 key
        
    - 如果 key 存在，则覆盖 value
        
    - 否则插入尾部
        
5. **检查是否超过 threshold，若是则 resize**
    

---

### 🔍 resize() 扩容逻辑

```java
final Node<K,V>[] resize() {
    Node<K,V>[] oldTab = table;
    int oldCap = (oldTab == null) ? 0 : oldTab.length;
    int newCap = oldCap << 1; // 容量 x2
    int newThr = (int)(newCap * loadFactor);
    ...
    table = newTab;
    // rehash 所有旧节点
}
```

扩容后**所有节点重新定位到新数组**，是非常耗时的操作。

---

## 💼 十三、面试高频问题复盘

### ❓1. HashMap 为什么线程不安全？

**答：**

- 多线程同时 put 可能导致链表/红黑树结构损坏；
    
- JDK1.7 存在“死循环”问题；
    
- 推荐使用 `ConcurrentHashMap` 替代。
    

---

### ❓2. HashMap 初始容量设置为何是 2 的幂？

**答：**  
便于通过位运算 `index = hash & (n - 1)` 快速计算桶索引，性能更高。

---

### ❓3. JDK1.8 中为何引入红黑树？

**答：**  
当哈希冲突严重时，链表会退化为 O(n) 时间复杂度。使用红黑树可以将查找、插入时间降为 O(log n)。

---

### ❓4. put 的时候为什么要扰动哈希值？

**答：**  
原始 `hashCode()` 可能分布不均，用位运算提高分布均匀性，减少冲突。

---

### ❓5. HashMap 的扩容会影响性能吗？如何避免？

**答：**

- 会。每次扩容会重新分配、重哈希、复制所有节点。
    
- 可通过 **预估数据量 → 提前设置初始容量** 避免频繁扩容。
    

---

## 🧠 十四、经典实战题目推荐

|题目名称|考察点|
|---|---|
|Two Sum（两数之和）|HashMap 快速查找 key|
|字符串中第一个唯一字符|使用 HashMap 计数|
|LRU Cache|LinkedHashMap 或自定义链表+HashMap|
|Top K Frequent Elements|使用 HashMap 计数 + 堆|

---

## ✅ 十五、知识点总表（思维导图结构）

```
HashMap
├── 使用方法
│   ├── put / get / remove / containsKey
│   ├── 遍历 keySet / values / entrySet
├── 底层结构
│   ├── 数组 + 链表/红黑树
│   ├── Node<K,V>[] table
├── 哈希处理
│   ├── hash() 扰动函数
│   ├── index = (n - 1) & hash
├── 冲突处理
│   ├── 链表 → 红黑树
│   ├── 阈值：8 → 树化；6 → 链表化
├── 扩容机制
│   ├── 触发条件：size ≥ threshold
│   ├── resize() → 容量 x2
├── 初始化优化
│   ├── 容量设置：expectedSize / 0.75f + 1
│   ├── 避免频繁扩容
├── 面试问题
│   ├── 线程安全 / 扩容过程 / 红黑树原因
```

---

## 📦 十六、建议学习顺序

1. 掌握基本使用 → put/get/remove
    
2. 理解遍历方式 → entrySet 最全
    
3. 深入哈希计算与冲突处理
    
4. 理解扩容和初始容量设置
    
5. 掌握红黑树条件与原因
    
6. 复习面试题与源码分析
    

---

是否需要我：

- ✅ 导出为 Markdown 或 PDF？
    
- ✅ 生成脑图版本（XMind 可用）？
    
- ✅ 生成可打印版复习表？
    

告诉我你的偏好，我可以立即帮你生成。
## ✅ 总结关键词

- 哈希函数 & 哈希冲突
    
- 链表 → 红黑树（JDK 1.8 优化）
    
- 扩容机制 & 阈值判断
    
- 合理设置初始容量以提升性能
    
- `put()`、`get()`、`containsKey()`、`entrySet()` 等常用方法
    

---

是否需要我将这份笔记导出为 Markdown / PDF 文件？  
或者你希望加入测试案例、底层源码解读、面试题复盘等内容？可以继续扩展 👍