---
Author:
  - Crain
tags:
  - Java
from: 2025-06-27
emaili: y252840@163.com
title: (列表）lists
category: Java
---


---

# Java 列表（List）

---

## 一、介绍

- List 是 Java 集合框架中的接口，继承自 Collection，表示有序的元素集合。
    
- 元素可以重复，且元素有明确的顺序（根据插入顺序维护）。
    
- 常见实现类有：
    
    - `ArrayList`（基于动态数组，随机访问快）
        
    - `LinkedList`（基于双向链表，插入删除快）
        
    - `Vector`（类似 ArrayList，但线程安全，已较少使用）
        

---

## 二、特点

- **有序**：元素按照插入顺序排列。
    
- **允许重复元素**：不同于 Set，不要求唯一性。
    
- **可动态调整大小**：实现类会自动扩容。
    
- **支持索引访问**：可通过索引获取、修改元素。
    
- **支持 null 元素**：允许存储 null。
    
- **接口定义丰富操作**：如插入、删除、遍历、查找等。
    

---

## 三、注意事项

- `ArrayList` 访问效率高，增删元素时如果非尾部位置操作性能差（因为需要移动元素）。
    
- `LinkedList` 插入和删除操作效率较高，随机访问性能较低（需要遍历链表）。
    
- `Vector` 是线程安全版本，但性能较低，建议用 `Collections.synchronizedList` 或并发集合替代。
    
- 使用 List 时，尽量面向接口编程，声明为 `List` 类型，便于实现替换。
    
- 迭代过程中修改 List 需用迭代器的 `remove()` 方法，否则会抛异常。
    

---

## 四、常用方法

|方法|说明|
|---|---|
|`add(E e)`|添加元素到列表末尾|
|`add(int index, E element)`|在指定位置插入元素|
|`get(int index)`|获取指定索引的元素|
|`set(int index, E element)`|修改指定索引的元素|
|`remove(int index)`|删除指定位置元素|
|`remove(Object o)`|删除首次出现的指定元素|
|`size()`|返回元素数量|
|`contains(Object o)`|是否包含指定元素|
|`indexOf(Object o)`|返回指定元素首次出现的索引|
|`lastIndexOf(Object o)`|返回指定元素最后一次出现的索引|
|`clear()`|清空列表|
|`isEmpty()`|是否为空|
|`toArray()`|转换为数组|
|`iterator()`|返回迭代器|

---

## 五、示例代码

```java
import java.util.*;

public class ListDemo {
    public static void main(String[] args) {
        // 1. 声明和初始化
        List<String> list = new ArrayList<>();

        // 2. 添加元素
        list.add("Java");
        list.add("Python");
        list.add("C++");
        list.add(1, "JavaScript"); // 索引1插入

        // 3. 获取和修改元素
        System.out.println("第2个元素：" + list.get(1));
        list.set(2, "Go");

        // 4. 遍历列表
        for (String lang : list) {
            System.out.println(lang);
        }

        // 5. 删除元素
        list.remove("Python");
        list.remove(0);

        // 6. 其他操作
        System.out.println("列表大小：" + list.size());
        System.out.println("是否包含 C++: " + list.contains("C++"));

        // 7. 转数组
        String[] arr = list.toArray(new String[0]);
        System.out.println("数组形式：" + Arrays.toString(arr));
    }
}
```


---

# Java LinkedList 及列表高级内容总结

---

## 一、LinkedList 相关特殊方法

`LinkedList` 实现了 `List` 和 `Deque` 接口，除了普通的列表操作，还有一些双端队列操作方法：

|方法|说明|
|---|---|
|`addFirst(E e)`|在链表头部插入元素|
|`addLast(E e)`|在链表尾部插入元素（等同于 `add(E e)`）|
|`offer(E e)`|添加元素到尾部，返回是否成功|
|`offerFirst(E e)`|添加元素到头部|
|`offerLast(E e)`|添加元素到尾部|
|`getFirst()`|获取第一个元素，不移除，若空抛异常|
|`getLast()`|获取最后一个元素，不移除，若空抛异常|
|`peek()`|获取第一个元素，不移除，若空返回 null|
|`peekFirst()`|获取第一个元素，不移除，若空返回 null|
|`peekLast()`|获取最后一个元素，不移除，若空返回 null|
|`poll()`|获取并移除第一个元素，若空返回 null|
|`pollFirst()`|获取并移除第一个元素，若空返回 null|
|`pollLast()`|获取并移除最后一个元素，若空返回 null|
|`remove()`|移除第一个元素，若空抛异常|
|`removeFirst()`|移除第一个元素，若空抛异常|
|`removeLast()`|移除最后一个元素，若空抛异常|

---

### 示例：

```java
LinkedList<String> list = new LinkedList<>();
list.addFirst("A");          // 链表头部插入
list.addLast("B");           // 链表尾部插入
System.out.println(list.peek());        // A
System.out.println(list.pollLast());    // 移除并返回 B
System.out.println(list.getFirst());    // A
```

---

## 二、线程安全列表的创建与使用

### 1. 使用 `Collections.synchronizedList`

```java
List<String> list = new ArrayList<>();
List<String> syncList = Collections.synchronizedList(list);

// 使用时需要额外同步遍历
synchronized(syncList) {
    Iterator<String> it = syncList.iterator();
    while(it.hasNext()) {
        System.out.println(it.next());
    }
}
```

### 2. 使用 `CopyOnWriteArrayList`

- 线程安全的 `List` 实现，适合读多写少场景
    
- 写操作会复制整个底层数组，写开销大但读不加锁
    

```java
CopyOnWriteArrayList<String> cowList = new CopyOnWriteArrayList<>();
cowList.add("Hello");
cowList.add("World");
```

---

## 三、列表与数组的性能对比

|操作|数组（Array）|列表（List）|
|---|---|---|
|访问元素|O(1)（通过索引直接访问）|O(1) 对于 ArrayList；O(n) 对于 LinkedList|
|插入尾部|固定大小数组需扩容（开销较大）|ArrayList：均摊 O(1)；LinkedList：O(1)|
|插入头部|O(n)（元素移动）|ArrayList：O(n)；LinkedList：O(1)|
|删除尾部|O(1)|ArrayList：O(1)；LinkedList：O(n)|
|删除头部|O(n)|ArrayList：O(n)；LinkedList：O(1)|
|内存使用|数组占用连续内存，开销较小|LinkedList 需要额外指针空间，开销较大|
|随机访问|高效|LinkedList 随机访问慢|

---

## 四、常见面试题及解析

### 1. **ArrayList 和 LinkedList 的区别？**

**答：**

- ArrayList 底层是动态数组，随机访问快，增删操作慢（尤其是中间元素）。
    
- LinkedList 底层是双向链表，增删操作快，随机访问慢。
    
- 根据需求选择：频繁随机访问用 ArrayList，频繁插入删除（特别是头尾）用 LinkedList。
    

---

### 2. **如何实现线程安全的 List？**

**答：**

- 使用 `Collections.synchronizedList()` 包装已有 List。
    
- 使用并发集合 `CopyOnWriteArrayList`。
    
- 手动加锁同步访问。
    

---

### 3. **为什么 LinkedList 可以用作队列？**

**答：**

- LinkedList 实现了 `Deque` 接口，支持双端队列操作（头尾插入、删除）。
    
- 适合实现队列（FIFO）和栈（LIFO）结构。
    

---

### 4. **List 遍历时修改元素，如何避免 ConcurrentModificationException？**

**答：**

- 使用迭代器的 `remove()` 方法。
    
- 使用 `ListIterator` 进行增删改。
    
- 使用 `CopyOnWriteArrayList`（迭代时不抛异常）。
    

---

### 5. **ArrayList 扩容机制是什么？**

**答：**

- 默认容量为 10。
    
- 扩容时，容量变为原来的 1.5 倍。
    
- 扩容涉及创建新数组和复制元素，开销较大，预估容量可避免频繁扩容。
    

---
---
