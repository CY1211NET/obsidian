---
Author:
  - Crain
tags:
  - "#Java"
from:
emaili: y252840@163.com
title:
---




好的 👍 那我们来整理一份 **不包含 JVM 的 Java 常考面试题与详解**，重点放在语法、面向对象、集合、异常、IO、多线程、关键字、以及项目实践等核心知识点上。

---

## 🧩 一、Java 基础语法篇

### 1️⃣ Java 的基本数据类型有哪些？

- **整型**：`byte`（1 字节）、`short`（2 字节）、`int`（4 字节）、`long`（8 字节）
    
- **浮点型**：`float`（4 字节）、`double`（8 字节）
    
- **字符型**：`char`（2 字节，Unicode）
    
- **布尔型**：`boolean`（1 位）
    

📌 **面试常考陷阱：**

```java
System.out.println(0.1 + 0.2 == 0.3); // false
```

👉 因为浮点型有精度误差。

---

### 2️⃣ == 与 equals() 的区别？

|对比项|==|equals()|
|:--|:--|:--|
|比较内容|比较地址|比较内容（可重写）|
|适用类型|基本类型 & 引用类型|仅引用类型|
|String 特例|字符串常量池中可能相等|比较字符串内容|

示例：

```java
String a = "abc";
String b = new String("abc");
System.out.println(a == b);      // false
System.out.println(a.equals(b)); // true
```

---

### 3️⃣ String、StringBuilder、StringBuffer 区别？

|类|是否可变|线程安全|性能|
|:--|:--|:--|:--|
|String|不可变|安全|慢|
|StringBuilder|可变|不安全|快|
|StringBuffer|可变|安全|较慢|

---

## 🧠 二、面向对象 OOP 篇

### 1️⃣ 面向对象的三大特性？

- **封装**：隐藏实现细节，暴露接口（`private`、`public`）
    
- **继承**：复用代码，支持多态
    
- **多态**：父类引用指向子类对象，调用时动态绑定方法实现
    

---

### 2️⃣ 重载与重写的区别？

|特性|重载 Overload|重写 Override|
|:--|:--|:--|
|作用|同类中方法名相同参数不同|子类重写父类方法|
|参数列表|必须不同|必须相同|
|返回值|可不同|必须兼容|
|访问权限|无限制|不能低于父类|

---

### 3️⃣ 接口与抽象类的区别？

|比较项|抽象类|接口|
|:--|:--|:--|
|关键字|abstract class|interface|
|成员变量|可定义变量|默认 `public static final`|
|方法|可有普通方法|默认 `public abstract`（Java 8 之后可有默认实现）|
|继承|单继承|多实现|

---

## 🧺 三、集合框架（重点考点）

### 1️⃣ List、Set、Map 区别？

|类型|是否有序|是否允许重复|常用实现类|
|:--|:--|:--|:--|
|List|有序|允许|ArrayList、LinkedList|
|Set|无序（或有序 TreeSet）|不允许|HashSet、TreeSet|
|Map|键无序|键不重复|HashMap、TreeMap、LinkedHashMap|

---

### 2️⃣ ArrayList 和 LinkedList 区别？

|比较项|ArrayList|LinkedList|
|:--|:--|:--|
|底层结构|动态数组|双向链表|
|查找|快（随机访问）|慢（需遍历）|
|插入删除|慢（移动元素）|快（只改指针）|
|线程安全|否|否|

---

### 3️⃣ HashMap 原理（简版）

- **底层结构**：数组 + 链表（JDK8 后链表长度 > 8 时转红黑树）
    
- **哈希冲突**：通过 `hashCode()` + `equals()` 解决
    
- **扩容机制**：容量超过 `0.75 * 16` 时自动扩容为两倍
    

---

## ⚙️ 四、异常机制篇

### 1️⃣ 异常分类

- **Checked Exception**：编译期异常（如 IOException、SQLException）
    
- **Unchecked Exception**：运行时异常（如 NullPointerException、ArrayIndexOutOfBoundsException）
    

### 2️⃣ 常见异常面试点

- NullPointerException：空对象调用方法
    
- ConcurrentModificationException：在遍历集合时修改集合
    
- ClassCastException：错误类型转换
    

---

## 🧾 五、IO与序列化

### 1️⃣ IO 分类

|类型|示例类|功能|
|:--|:--|:--|
|字节流|InputStream / OutputStream|处理二进制文件|
|字符流|Reader / Writer|处理文本文件|

### 2️⃣ 序列化与反序列化

- 使用 `Serializable` 接口
    
- 通过 `ObjectOutputStream`、`ObjectInputStream` 读写对象
    
- 用 `transient` 关键字排除不需要序列化的字段
    

---

## 🧵 六、多线程与并发基础

### 1️⃣ 创建线程的三种方式

1. 继承 Thread 类
    
2. 实现 Runnable 接口
    
3. 使用 Callable + FutureTask（有返回值）
    

### 2️⃣ 线程状态

新建 → 就绪 → 运行 → 阻塞 → 终止

### 3️⃣ 关键字：`synchronized` 与 `volatile`

- `synchronized`：保证线程安全（锁机制）
    
- `volatile`：保证可见性，不保证原子性
    

---

## 🧰 七、关键字与语法考点

|关键字|功能|
|:--|:--|
|`final`|修饰变量（常量）、类（不可继承）、方法（不可重写）|
|`static`|修饰类成员共享|
|`transient`|禁止序列化|
|`this`|当前对象引用|
|`super`|调用父类构造或方法|

---

## 💡 八、综合性面试题举例

**题 1：** `HashMap` 的 key 为什么建议重写 `equals()` 和 `hashCode()`？

> 因为 HashMap 先根据 hashCode 定位桶，再用 equals 判断是否为同一 key，若不重写会导致存取不一致。

**题 2：** Java 中值传递还是引用传递？

> Java **只有值传递**，对象传递的是“引用的副本”，不是指针本身。

**题 3：** 说说 Java 中的封装体现？

> 通过访问修饰符（private/protected/public）隐藏实现细节，只暴露必要接口。

---

要不要我帮你把这些内容整理成一份「高频 Java 面试速记笔记表」（带简答 + 面试思路版本）？那样你可以打印或导入笔记工具随时复习。