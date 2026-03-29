---
Author:
  - Crain
tags:
  - Java
from: 2025-06-30
emaili: y252840@163.com
title: "`Vector` 类"
---
`Vector` 类是 Java 中一种实现了 **List** 接口的集合类，属于 **Java Collection Framework** 的一部分。它是一个可以动态扩展的数组，类似于 **ArrayList**，但不同的是，`Vector` 在扩展时会自动增加其大小，以容纳更多元素。`Vector` 最初是作为 **遗留类**（legacy class）在早期的 Java 中引入的，但在后来的版本中，`ArrayList` 已经逐渐取代了 `Vector`，因为 `Vector` 的性能较差，特别是在多线程环境下。

### ✅ 一、Vector 类的特点

1. **动态扩展**：`Vector` 内部使用数组来存储元素，当数组空间不够时，`Vector` 会自动扩展其容量。默认的扩展大小是原来大小的 2 倍。
    
2. **线程安全**：`Vector` 是线程安全的，因为它的 **方法是同步的**，即在多个线程同时访问 `Vector` 时，可以保证线程安全。然而，这种同步机制会导致性能损失。对于单线程或不需要同步的应用，`ArrayList` 更为高效。
    
3. **元素访问**：与 `ArrayList` 类似，`Vector` 也可以使用索引访问元素，并且支持增、删、查等操作。
    

### ✅ 二、常用方法

`Vector` 类继承自 `AbstractList` 类，并实现了 `List` 接口。它包含了常用的集合方法：

|方法|说明|
|---|---|
|`add(E e)`|添加一个元素到 `Vector` 的末尾。|
|`add(int index, E element)`|在指定位置插入一个元素。|
|`remove(Object o)`|删除指定的元素。|
|`remove(int index)`|删除指定位置的元素。|
|`get(int index)`|获取指定位置的元素。|
|`set(int index, E element)`|设置指定位置的元素。|
|`size()`|获取 `Vector` 中元素的个数。|
|`isEmpty()`|判断 `Vector` 是否为空。|
|`clear()`|清空 `Vector` 中的所有元素。|
|`contains(Object o)`|判断 `Vector` 是否包含某个元素。|
|`indexOf(Object o)`|返回指定元素第一次出现的索引位置，若不存在返回 -1。|
|`toArray()`|将 `Vector` 转换为一个数组。|
|`elementAt(int index)`|获取指定位置的元素（与 `get()` 相似，但不推荐使用）。|

### ✅ 三、示例代码

下面是一个简单的 `Vector` 使用示例，展示了如何操作 `Vector` 的常见方法：

```java
import java.util.Vector;

public class VectorDemo {
    public static void main(String[] args) {
        // 创建一个空的 Vector
        Vector<Integer> vector = new Vector<>();

        // 添加元素
        vector.add(10);
        vector.add(20);
        vector.add(30);
        System.out.println("Vector: " + vector);  // 输出: Vector: [10, 20, 30]

        // 在指定位置插入元素
        vector.add(1, 15);
        System.out.println("After inserting at index 1: " + vector);  // 输出: [10, 15, 20, 30]

        // 获取元素
        int value = vector.get(2);
        System.out.println("Element at index 2: " + value);  // 输出: Element at index 2: 20

        // 修改指定位置的元素
        vector.set(0, 100);
        System.out.println("After setting index 0 to 100: " + vector);  // 输出: [100, 15, 20, 30]

        // 删除指定位置的元素
        vector.remove(1);
        System.out.println("After removing element at index 1: " + vector);  // 输出: [100, 20, 30]

        // 删除指定的元素
        vector.remove(Integer.valueOf(30));
        System.out.println("After removing element 30: " + vector);  // 输出: [100, 20]

        // 判断是否为空
        System.out.println("Is vector empty? " + vector.isEmpty());  // 输出: false

        // 获取元素个数
        System.out.println("Size of vector: " + vector.size());  // 输出: 2

        // 转换为数组
        Object[] arr = vector.toArray();
        System.out.print("Converted array: ");
        for (Object obj : arr) {
            System.out.print(obj + " ");  // 输出: 100 20
        }
    }
}
```

### ✅ 四、Vector 与 ArrayList 的比较

|特性|Vector|ArrayList|
|---|---|---|
|**线程安全性**|线程安全，方法同步|非线程安全|
|**扩容方式**|默认扩容为原容量的 2 倍|默认扩容为原容量的 1.5 倍|
|**性能**|性能较差（由于同步机制）|性能较优（没有同步开销）|
|**常用场景**|多线程环境中需要同步操作的场景|单线程或不需要同步的场景|

### ✅ 五、Vector 的线程安全性

`Vector` 是线程安全的，因为它的大部分方法都加了同步锁（`synchronized`）。这意味着在多个线程并发访问 `Vector` 时，Java 会确保每次只有一个线程能够访问其方法。尽管这保证了线程安全性，但同步机制会带来性能开销，因此 **如果没有并发需求，建议使用 `ArrayList`**。

### ✅ 六、何时使用 `Vector`

1. **多线程环境**：`Vector` 在多线程环境中有线程安全保障。如果你的应用程序需要多个线程同时访问和修改同一个集合，而你不想手动管理同步机制，可以使用 `Vector`。
    
2. **需要动态扩展的数组**：`Vector` 提供了动态扩展数组的功能，虽然 `ArrayList` 也具备这个功能，但 `Vector` 在扩容时的行为与 `ArrayList` 略有不同。
    

但是，**如果你不需要线程安全**，在大多数情况下，**推荐使用 `ArrayList`**，因为它没有同步开销，性能更好。

---

## 📌 总结

- `Vector` 是一种线程安全的动态数组，支持自动扩展容量。
    
- 它提供了多种操作，如增、删、查、遍历等。
    
- `Vector` 的性能相对较差，因为它的大部分方法都进行了同步处理。在多线程环境中使用时可能有优势，但在单线程或不需要同步的情况下，`ArrayList` 会更合适。
    
- 对于大部分现代 Java 应用，推荐使用 `ArrayList` 而不是 `Vector`，除非有特殊的线程安全需求。
    

如果你有进一步的问题或需要更详细的示例，随时告诉我！