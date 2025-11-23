---
title: "Java 数组"
date: "2025-11-23"
author: "Crain"
updated: "2025-11-23"
excerpt: "深入解析 Java 数组的特性、用法和最佳实践。"
category: "TECHNOLOGY"
tags: ["Java", "Arrays", "Programming"]
readTime: "8 MIN READ"
---

## 一、介绍

- Java 数组是存储固定大小、同一类型元素的容器。
    
- 是一种对象，数组变量保存的是数组对象的引用。
    
- 支持一维和多维数组。
    
- Java 数组由 JVM 管理内存，具有自动边界检查。
    

---

## 二、特点

- **固定长度**：创建时确定大小，无法动态扩容。
    
- **类型统一**：数组中所有元素必须为同一数据类型。
    
- **连续内存**：底层通过连续内存存储，支持高效索引访问。
    
- **对象属性**：数组有 `length` 属性获取长度。
    
- **自动初始化**：元素会被自动初始化（如 int 默认 0，引用默认 null）。
    
- **支持多维数组**：实际上是数组的数组。
    
- **内存安全**：访问越界会抛出 `ArrayIndexOutOfBoundsException`。
    

---

## 三、注意事项

- **长度固定不可变**，若需动态容量，推荐使用集合类如 `ArrayList`。
    
- 数组元素访问越界会导致运行时异常。
    
- 多维数组每一维的大小可以不同（不必是规则矩阵）。
    
- 数组是对象，传递时传递的是引用，修改会影响原数组。
    
- 不同于 C 语言，Java 数组有边界检查，更安全但有性能开销。
    
- 对象数组存储的是引用，不是对象本身。
    

---

## 四、常用方法（主要来自 `java.util.Arrays` 工具类）

|方法|说明|
|---|---|
|`Arrays.sort(array)`|对数组进行排序|
|`Arrays.binarySearch(array, key)`|二分查找，数组必须已排序|
|`Arrays.fill(array, val)`|用指定值填充整个数组|
|`Arrays.equals(arr1, arr2)`|判断两个数组是否相等|
|`Arrays.copyOf(array, length)`|拷贝数组到指定长度的新数组|
|`Arrays.copyOfRange(array, from, to)`|拷贝数组指定范围到新数组|
|`Arrays.toString(array)`|返回数组元素的字符串表示|
|`Arrays.deepToString(array)`|多维数组的字符串表示|

---

## 五、示例代码

```java
import java.util.Arrays;

public class ArrayDemo {
    public static void main(String[] args) {
        // 1. 声明和初始化
        int[] nums = new int[5];               // 默认值全为0
        int[] primes = {2, 3, 5, 7, 11};      // 静态初始化

        // 2. 访问和赋值
        nums[0] = 10;
        nums[1] = 20;

        // 3. 遍历
        for (int num : nums) {
            System.out.print(num + " ");
        }
        System.out.println();

        // 4. 数组长度
        System.out.println("长度：" + primes.length);

        // 5. 排序
        int[] arr = {5, 3, 9, 1, 4};
        Arrays.sort(arr);
        System.out.println("排序后：" + Arrays.toString(arr));

        // 6. 二分查找
        int index = Arrays.binarySearch(arr, 4);
        System.out.println("元素4索引：" + index);

        // 7. 填充
        int[] fillArr = new int[5];
        Arrays.fill(fillArr, 7);
        System.out.println("填充后：" + Arrays.toString(fillArr));

        // 8. 数组拷贝
        int[] copyArr = Arrays.copyOf(arr, arr.length);
        System.out.println("拷贝数组：" + Arrays.toString(copyArr));

        // 9. 多维数组
        int[][] matrix = {{1, 2}, {3, 4}};
        System.out.println("多维数组：" + Arrays.deepToString(matrix));
    }
}
```

---


---

### 🔸 1. 什么是“自定义类数组”

### 🔸 2. 如何定义和使用

### 🔸 3. 如何配合 **增强 for 循环（for-each）** 使用

### 🔸 4. 一个完整示例（含输出）

---

## ✅ 1. 什么是“自定义类数组”？

在 Java 中，你可以创建自己的类，然后用这个类去创建一个数组，称为“自定义类数组”。

比如你定义了一个 `Student` 类，就可以创建一个 `Student[]` 数组，里面每一个元素都是 `Student` 类型的对象。

---

## ✅ 2. 自定义类 + 数组创建

### 示例：定义一个 `Student` 类

```java
public class Student {
    String name;
    int age;

    // 构造方法
    public Student(String name, int age) {
        this.name = name;
        this.age = age;
    }

    // 展示信息
    public void showInfo() {
        System.out.println("姓名: " + name + ", 年龄: " + age);
    }
}
```

---

## ✅ 3. 创建 `Student[]` 数组并使用

```java
public class Test {
    public static void main(String[] args) {
        // 创建一个数组，存储多个 Student 对象
        Student[] students = new Student[3];

        // 给数组中的每个元素赋值
        students[0] = new Student("张三", 18);
        students[1] = new Student("李四", 20);
        students[2] = new Student("王五", 19);

        // 使用普通 for 循环
        for (int i = 0; i < students.length; i++) {
            students[i].showInfo();
        }
    }
}
```

---

## ✅ 4. 使用 **增强 for 循环（for-each）**

增强 for 循环语法更简洁，常用于遍历数组、集合。

```java
for (Student stu : students) {
    stu.showInfo();
}
```

### 📌 说明：

- `stu` 是数组中每个元素（类型为 `Student`）
    
- `students` 是你定义的 `Student[]` 数组
    
- 每次循环中，`stu` 就代表数组中的一个 `Student` 对象
    

---

## ✅ 完整代码（结合使用）

```java
public class Student {
    String name;
    int age;

    public Student(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public void showInfo() {
        System.out.println("姓名: " + name + ", 年龄: " + age);
    }
}

public class Test {
    public static void main(String[] args) {
        Student[] students = new Student[3];
        students[0] = new Student("张三", 18);
        students[1] = new Student("李四", 20);
        students[2] = new Student("王五", 19);

        // 增强型 for 循环
        for (Student stu : students) {
            stu.showInfo();
        }
    }
}
```

---

## 🧠 小结表格

|名称|示例|说明|
|---|---|---|
|定义自定义类|`class Student {}`|创建你自己的类|
|创建数组|`Student[] arr = new Student[3];`|创建一个类数组|
|初始化数组元素|`arr[0] = new Student("张三", 18);`|每个元素是一个对象|
|增强 for 循环遍历|`for (Student s : arr)`|更简洁、安全地遍历所有元素|

---

## 🎓 小练习题（自测）

1. 定义一个 `Book` 类，包含书名、作者；
    
2. 创建 `Book[]` 数组，添加 3 本书；
    
3. 使用增强 for 循环打印每本书信息。
    

---

是否需要我生成一张结构图，来展示“类 → 对象数组 → 遍历”的内存关系？或者是否要把它改成列表（`ArrayList<Student>`）来比较？