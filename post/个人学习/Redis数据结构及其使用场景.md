---
author: Crain
date: 2023-05-14
title: Redis数据结构及其使用场景
tags:
  - Redis
  - 底层原理
  - 数据结构
emaili: y252840@163.com
updated:
category: 个人学习
---
Redis 是一个高性能的内存数据库，它不仅仅是一个简单的键值存储，它提供了多种丰富的数据结构，每种结构都有不同的用途和特性。

---

### 1. **String（字符串）**

- **描述**：最简单的类型，一个 key 对应一个字符串 value。
    
- **特性**：
    
    - 可以存储文本或二进制数据（如图片、序列化对象）。
        
    - 最大容量 512 MB。
        
    - 支持原子操作，如 `INCR`、`DECR`、`APPEND`。
        
- **常用命令**：
    
    - `SET key value`：设置值
        
    - `GET key`：获取值
        
    - `INCR key`：自增
        
    - `MGET key1 key2`：批量获取
        
- **应用场景**：缓存网页内容、计数器、会话信息。
    

---

### 2. **Hash（哈希表）**

- **描述**：键值对集合，类似一个小型的字典，适合存储对象。
    
- **特性**：
    
    - 每个 key 对应一个 hash。
        
    - 可以对 hash 内的字段进行单独操作。
        
- **常用命令**：
    
    - `HSET key field value`：设置字段
        
    - `HGET key field`：获取字段值
        
    - `HGETALL key`：获取所有字段
        
    - `HDEL key field`：删除字段
        
- **应用场景**：存储用户信息（如 user:id → {name, age, email}）、商品详情。
    

---

### 3. **List（列表）**

- **描述**：简单的字符串列表，按照插入顺序排序，允许重复。
    
- **特性**：
    
    - 支持从左或右插入/删除。
        
    - 支持阻塞队列操作（如 `BLPOP`）。
        
- **常用命令**：
    
    - `LPUSH key value`：从左插入
        
    - `RPUSH key value`：从右插入
        
    - `LPOP key` / `RPOP key`：弹出元素
        
    - `LRANGE key start stop`：获取区间元素
        
- **应用场景**：消息队列、日志记录、时间线数据。
    

---

### 4. **Set（集合）**

- **描述**：无序且不重复的字符串集合。
    
- **特性**：
    
    - 自动去重。
        
    - 支持集合运算（交集、并集、差集）。
        
- **常用命令**：
    
    - `SADD key member`：添加元素
        
    - `SREM key member`：删除元素
        
    - `SMEMBERS key`：获取所有元素
        
    - `SINTER key1 key2`：交集
        
- **应用场景**：用户标签、好友关系、权限集合。
    

---

### 5. **Sorted Set（有序集合）**

- **描述**：带分数的集合，元素唯一，按分数排序。
    
- **特性**：
    
    - 每个元素都有一个分数（score）。
        
    - 支持按分数或字典序排序。
        
    - 支持范围查询。
        
- **常用命令**：
    
    - `ZADD key score member`：添加元素
        
    - `ZRANGE key start stop [WITHSCORES]`：按索引范围获取
        
    - `ZRANGEBYSCORE key min max`：按分数范围获取
        
    - `ZREM key member`：删除元素
        
- **应用场景**：排行榜、任务调度、延迟队列。
    

---

### 6. **Bitmaps（位图）**

- **描述**：通过位操作存储和统计数据。
    
- **特性**：
    
    - 以二进制位存储状态，占用空间小。
        
    - 支持 `AND`、`OR`、`XOR` 等操作。
        
- **常用命令**：
    
    - `SETBIT key offset value`：设置某一位
        
    - `GETBIT key offset`：获取某一位
        
    - `BITCOUNT key`：统计位为 1 的数量
        
- **应用场景**：签到系统、用户在线状态、布隆过滤器。
    

---

### 7. **HyperLogLog**

- **描述**：基数统计数据结构，主要用于估算唯一值数量。
    
- **特性**：
    
    - 占用内存固定（12 KB）。
        
    - 支持大数据量去重统计，但精度略低。
        
- **常用命令**：
    
    - `PFADD key element`：添加元素
        
    - `PFCOUNT key`：获取估算的基数
        
- **应用场景**：网站 UV 统计、大规模唯一访问量。
    

---

### 8. **Streams（流）**

- **描述**：日志型数据结构，可按时间顺序追加消息。
    
- **特性**：
    
    - 类似 Kafka 消息队列。
        
    - 支持消费组、消息 ID。
        
- **常用命令**：
    
    - `XADD key * field value`：追加消息
        
    - `XRANGE key start end`：按范围获取
        
    - `XREAD GROUP group consumer COUNT 10 STREAMS key >`：消费消息
        
- **应用场景**：实时日志收集、事件流处理、消息队列。
    

---

Redis 的数据结构可以用 **关系图（graph）** 的方式理解，这样更容易看清每种结构的特点和应用场景。

``` graph TD
                         Redis
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
      String              Hash               List
        │                  │                  │
   key → value       key → {field:value}   key → [v1,v2,v3]
        │                  │                  │
   计数器/缓存        对象存储(用户)        队列/消息
                                            
        ┌──────────────────┼──────────────────┐
        │                  │                  │
       Set            Sorted Set            Bitmap
        │                  │                  │
 key → {v1,v2,v3}    key → {score:value}   key → bit array
   无序不重复            按score排序          位操作
        │                  │                  │
   标签系统           排行榜系统           签到统计

                    │
                HyperLogLog
                    │
            基数统计（UV访问量）

                    │
                  Stream
                    │
              消息流 / MQ
```

---

# 从底层结构角度理解 Redis

Redis 的 **逻辑数据结构** 底层其实是由一些 **基础结构**实现的：

``` graph TD
Redis底层结构
│
├── SDS (简单动态字符串)
│
├── Dict (哈希表)
│
├── LinkedList (双向链表)
│
├── ZipList / ListPack (压缩列表)
│
├── SkipList (跳表)
│
└── IntSet (整数集合)
```

对应关系：

``` graph TD
String       → SDS
Hash         → Dict / ZipList
List         → LinkedList / ZipList
Set          → Dict / IntSet
Sorted Set   → SkipList + Dict
```

---

# 一个完整结构关系图

``` graph TD
                Redis 数据结构
                        │
 ┌───────────────┬───────────────┬───────────────┐
 │               │               │               │
String          Hash            List            Set
 │               │               │               │
SDS        Dict / ZipList   LinkedList     Dict / IntSet
                                │
                           消息队列
                                
                 │
             Sorted Set
                 │
           SkipList + Dict
                 │
              排行榜
```

---

# 典型应用结构图

``` graph TD
用户系统
user:1001
   │
   └── Hash
        ├── name
        ├── age
        └── email


排行榜
rank
   │
   └── SortedSet
        ├── 1000  userA
        ├── 900   userB
        └── 800   userC


消息队列
queue
   │
   └── List
        ├── msg1
        ├── msg2
        └── msg3
```

---

# 面试级总结（非常重要）

Redis 五大核心数据结构：

|数据结构|特点|常见场景|
|---|---|---|
|String|最基础类型|缓存、计数器|
|Hash|key-field-value|对象存储|
|List|有序可重复|消息队列|
|Set|无序不重复|标签系统|
|SortedSet|按 score 排序|排行榜|

高级结构：

|结构|用途|
|---|---|
|Bitmap|签到统计|
|HyperLogLog|UV统计|
|Stream|消息流|

---

Redis 的数据结构可以用 **关系图（graph）** 的方式理解，这样更容易看清每种结构的特点和应用场景。

``` graph TD
                         Redis
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
      String              Hash               List
        │                  │                  │
   key → value       key → {field:value}   key → [v1,v2,v3]
        │                  │                  │
   计数器/缓存        对象存储(用户)        队列/消息
                                            
        ┌──────────────────┼──────────────────┐
        │                  │                  │
       Set            Sorted Set            Bitmap
        │                  │                  │
 key → {v1,v2,v3}    key → {score:value}   key → bit array
   无序不重复            按score排序          位操作
        │                  │                  │
   标签系统           排行榜系统           签到统计

                    │
                HyperLogLog
                    │
            基数统计（UV访问量）

                    │
                  Stream
                    │
              消息流 / MQ
```

---

# 从底层结构角度理解 Redis

Redis 的 **逻辑数据结构** 底层其实是由一些 **基础结构**实现的：

``` graph TD
Redis底层结构
│
├── SDS (简单动态字符串)
│
├── Dict (哈希表)
│
├── LinkedList (双向链表)
│
├── ZipList / ListPack (压缩列表)
│
├── SkipList (跳表)
│
└── IntSet (整数集合)
```

对应关系：

``` graph TD
String       → SDS
Hash         → Dict / ZipList
List         → LinkedList / ZipList
Set          → Dict / IntSet
Sorted Set   → SkipList + Dict
```

---

# 一个完整结构关系图

``` graph TD
                Redis 数据结构
                        │
 ┌───────────────┬───────────────┬───────────────┐
 │               │               │               │
String          Hash            List            Set
 │               │               │               │
SDS        Dict / ZipList   LinkedList     Dict / IntSet
                                │
                           消息队列
                                
                 │
             Sorted Set
                 │
           SkipList + Dict
                 │
              排行榜
```

---

# 典型应用结构图

``` graph TD
用户系统
user:1001
   │
   └── Hash
        ├── name
        ├── age
        └── email


排行榜
rank
   │
   └── SortedSet
        ├── 1000  userA
        ├── 900   userB
        └── 800   userC


消息队列
queue
   │
   └── List
        ├── msg1
        ├── msg2
        └── msg3
```

---

# 面试级总结（非常重要）

Redis 五大核心数据结构：

|数据结构|特点|常见场景|
|---|---|---|
|String|最基础类型|缓存、计数器|
|Hash|key-field-value|对象存储|
|List|有序可重复|消息队列|
|Set|无序不重复|标签系统|
|SortedSet|按 score 排序|排行榜|

高级结构：

|结构|用途|
|---|---|
|Bitmap|签到统计|
|HyperLogLog|UV统计|
|Stream|消息流|

---

