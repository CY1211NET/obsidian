---
Author:
  - Crain
tags:
  - Java
emaili: y252840@163.com
date: 2025-06-30
title: Java StringBuffer 和 StringBuilder 类
---
在 Java 中，`StringBuffer` 和 `StringBuilder` 是两个非常有用的类，它们都用于处理可变的字符串。它们的主要作用是解决 **字符串不可变** 带来的性能问题，尤其在频繁修改字符串的场景下。这两个类有很多相似之处，但它们也有一些重要的区别，特别是 **线程安全性**。

---

## ✅ 一、StringBuffer 和 StringBuilder 区别

### **1. 线程安全性**

- **StringBuffer** 是 **线程安全** 的，它的所有方法都经过同步处理，保证了在多线程环境下的安全性，但性能相对较差。
    
- **StringBuilder** 是 **非线程安全** 的，因此性能比 `StringBuffer` 更高，适用于单线程环境或不需要线程安全的场景。
    

### **2. 性能**

- **StringBuilder** 在大多数情况下，性能优于 `StringBuffer`，因为它没有线程同步的开销。
    
- 如果你的应用是多线程的且多个线程会同时修改同一个字符串，那么使用 `StringBuffer` 更安全；否则推荐使用 `StringBuilder`，它的性能更好。
    

### **3. 适用场景**

- **StringBuffer**：需要保证线程安全的场景，如多线程同时修改同一字符串。
    
- **StringBuilder**：不需要线程安全的场景，如单线程处理、日志拼接等。
    

---

## ✅ 二、常用方法

`StringBuffer` 和 `StringBuilder` 都继承自 `AbstractStringBuilder` 类，因此它们提供了一些相同的方法，下面是一些常用方法：

|方法|说明|
|---|---|
|`append(String str)`|将指定的字符串追加到 `StringBuffer`/`StringBuilder` 的末尾。|
|`insert(int offset, String str)`|将指定的字符串插入到指定位置。|
|`delete(int start, int end)`|删除指定位置范围内的字符。|
|`reverse()`|反转字符串。|
|`replace(int start, int end, String str)`|替换指定范围内的字符为指定字符串。|
|`capacity()`|返回 `StringBuffer`/`StringBuilder` 当前的容量。|
|`toString()`|返回 `StringBuffer`/`StringBuilder` 的字符串表示。|

---

## ✅ 三、常用方法示例 Demo

### 示例：`StringBuffer` 和 `StringBuilder` 常用方法

```java
public class StringBufferBuilderDemo {
    public static void main(String[] args) {
        // StringBuffer 示例
        StringBuffer sb1 = new StringBuffer("Hello");
        
        // append() 方法
        sb1.append(" World");
        System.out.println("StringBuffer append: " + sb1);  // "Hello World"
        
        // insert() 方法
        sb1.insert(5, ",");
        System.out.println("StringBuffer insert: " + sb1);  // "Hello, World"
        
        // delete() 方法
        sb1.delete(5, 6);  // 删除第 5 到 6 个字符
        System.out.println("StringBuffer delete: " + sb1);  // "Hello World"
        
        // reverse() 方法
        sb1.reverse();
        System.out.println("StringBuffer reverse: " + sb1);  // "dlroW olleH"
        
        // replace() 方法
        sb1.replace(0, 5, "Hi");
        System.out.println("StringBuffer replace: " + sb1);  // "Hi olleH"
        
        // capacity() 方法
        System.out.println("StringBuffer capacity: " + sb1.capacity());  // 32 (默认容量)

        // toString() 方法
        String str1 = sb1.toString();
        System.out.println("StringBuffer toString: " + str1);  // "Hi olleH"
        
        // StringBuilder 示例（与 StringBuffer 方法相同）
        StringBuilder sb2 = new StringBuilder("Java");
        
        // append() 方法
        sb2.append(" Programming");
        System.out.println("StringBuilder append: " + sb2);  // "Java Programming"
        
        // insert() 方法
        sb2.insert(4, " Language");
        System.out.println("StringBuilder insert: " + sb2);  // "Java Language Programming"
        
        // delete() 方法
        sb2.delete(4, 13);  // 删除 "Language"
        System.out.println("StringBuilder delete: " + sb2);  // "Java Programming"
        
        // reverse() 方法
        sb2.reverse();
        System.out.println("StringBuilder reverse: " + sb2);  // "gnimmargorP avaJ"
        
        // replace() 方法
        sb2.replace(0, 6, "Hello");
        System.out.println("StringBuilder replace: " + sb2);  // "Hello gnimmargorP"
        
        // capacity() 方法
        System.out.println("StringBuilder capacity: " + sb2.capacity());  // 36
    }
}
```

### 输出：

```
StringBuffer append: Hello World
StringBuffer insert: Hello, World
StringBuffer delete: Hello World
StringBuffer reverse: dlroW olleH
StringBuffer replace: Hi olleH
StringBuffer capacity: 32
StringBuffer toString: Hi olleH
StringBuilder append: Java Programming
StringBuilder insert: Java Language Programming
StringBuilder delete: Java Programming
StringBuilder reverse: gnimmargorP avaJ
StringBuilder replace: Hello gnimmargorP
StringBuilder capacity: 36
```

---

## ✅ 四、使用场景总结

|场景类型|使用 `StringBuffer`|使用 `StringBuilder`|
|---|---|---|
|多线程操作|必须使用（线程安全）|不推荐使用（非线程安全）|
|单线程操作|可选（线程安全，但性能较差）|推荐使用（性能更好）|
|频繁字符串拼接|使用 `append` 或 `insert` 方法|使用 `append` 或 `insert` 方法|
|字符串反转|使用 `reverse()`|使用 `reverse()`|
|替换字符|使用 `replace()`|使用 `replace()`|
|删除字符|使用 `delete()`|使用 `delete()`|

---

## 📌 总结

- **`StringBuffer`**：适用于 **多线程环境**，需要保证线程安全。
    
- **`StringBuilder`**：适用于 **单线程环境**，性能较好。
    
- 常用方法：`append()`、`insert()`、`delete()`、`replace()`、`reverse()`、`toString()`。
    
- 适用场景：字符串拼接、修改、反转、删除、替换等操作。
    

---

如果你有其他问题，或者想了解更多的性能优化方法（例如通过 `StringBuilder` 解决性能瓶颈），随时告诉我！