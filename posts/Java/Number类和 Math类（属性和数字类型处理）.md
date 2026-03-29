---
Author:
  - Crain
tags:
  - Java
from: 2025-06-30
emaili: y252840@163.com
title: Number类和 Math类（属性和数字类型处理）
---


---

## ✅ 一、`Number` 类

### 1. **简介**

`Number` 是一个 **抽象类**，它是 Java 所有包装类（如 `Integer`、`Double`、`Long` 等）的父类。它为不同类型的数值提供了统一的接口方法，允许我们将各种不同的数字类型（如 `int`、`float`、`double` 等）封装成对象，并提供了数值的转换方法。

### 2. **常用方法**

`Number` 类本身并不提供直接的数值操作方法，但它提供了以下几个方法来获取不同类型的数值：

|方法|说明|
|---|---|
|`int intValue()`|将 `Number` 对象转换为 `int` 类型|
|`long longValue()`|将 `Number` 对象转换为 `long` 类型|
|`float floatValue()`|将 `Number` 对象转换为 `float` 类型|
|`double doubleValue()`|将 `Number` 对象转换为 `double` 类型|

这些方法用于将 `Number` 对象转换为其对应的基本数据类型。

### 3. **常见子类**

- **Integer**：封装 `int` 类型。
    
- **Long**：封装 `long` 类型。
    
- **Double**：封装 `double` 类型。
    
- **Float**：封装 `float` 类型。
    
- **Byte**：封装 `byte` 类型。
    
- **Short**：封装 `short` 类型。
    

### 4. **示例：`Number` 类的使用**

```java
public class NumberDemo {
    public static void main(String[] args) {
        // 创建不同类型的 Number 对象
        Number num1 = new Integer(100);
        Number num2 = new Double(45.67);
        
        // 转换为基本数据类型
        int intVal = num1.intValue();
        double doubleVal = num2.doubleValue();
        
        System.out.println("Integer value: " + intVal);      // 100
        System.out.println("Double value: " + doubleVal);    // 45.67
    }
}
```

---

## ✅ 二、`Math` 类

### 1. **简介**

`Math` 类是一个 **数学工具类**，提供了许多常用的数学计算方法，所有的方法都是 **静态方法**，可以直接通过类名调用而不需要实例化对象。`Math` 类的功能非常广泛，包含了数学常量、常见的数学运算、三角函数、对数计算、随机数等。

### 2. **常用方法**

|方法|说明|
|---|---|
|`Math.abs(x)`|返回 `x` 的绝对值|
|`Math.pow(x, y)`|返回 `x` 的 `y` 次方|
|`Math.sqrt(x)`|返回 `x` 的平方根|
|`Math.max(a, b)`|返回 `a` 和 `b` 中的最大值|
|`Math.min(a, b)`|返回 `a` 和 `b` 中的最小值|
|`Math.random()`|返回一个 [0.0, 1.0) 范围内的随机数|
|`Math.round(x)`|四舍五入返回 `x` 的最接近的整数（返回 `long` 类型）|
|`Math.sin(x)`|返回 `x`（以弧度表示）的正弦值|
|`Math.cos(x)`|返回 `x`（以弧度表示）的余弦值|
|`Math.toDegrees(x)`|将弧度 `x` 转换为度数|
|`Math.toRadians(x)`|将角度 `x` 转换为弧度|
|`Math.log(x)`|返回 `x` 的自然对数（以 e 为底）|
|`Math.log10(x)`|返回 `x` 的以 10 为底的对数|
|`Math.ceil(x)`|返回大于或等于 `x` 的最小整数|
|`Math.floor(x)`|返回小于或等于 `x` 的最大整数|
|`Math.ulp(x)`|返回 `x` 的最小有效数字（最小增量）|

### 3. **常用常量**

|常量|说明|
|---|---|
|`Math.PI`|圆周率π（约等于 3.14159）|
|`Math.E`|自然常数e（约等于 2.71828）|

### 4. **示例：`Math` 类常用方法**

```java
public class MathDemo {
    public static void main(String[] args) {
        // 绝对值
        System.out.println("绝对值: " + Math.abs(-10));    // 10

        // 3的4次方
        System.out.println("3 的 4 次方: " + Math.pow(3, 4)); // 81.0

        // 平方根
        System.out.println("25 的平方根: " + Math.sqrt(25)); // 5.0

        // 最大值
        System.out.println("最大值: " + Math.max(10, 20));  // 20

        // 最小值
        System.out.println("最小值: " + Math.min(10, 20));  // 10

        // 随机数
        System.out.println("随机数: " + Math.random());     // 0.0 <= 随机数 < 1.0

        // 四舍五入
        System.out.println("四舍五入: " + Math.round(3.6));   // 4

        // 角度转弧度
        double radian = Math.toRadians(45); // 45 度转换为弧度
        System.out.println("45 度转弧度: " + radian);  // 0.7853981633974483

        // 正弦
        System.out.println("30 度的正弦: " + Math.sin(Math.toRadians(30))); // 0.49999999999999994
    }
}
```

### 5. **进阶用法：生成随机数**

`Math.random()` 返回一个 **[0.0, 1.0) 之间**的随机数。如果你需要生成特定范围的随机数，可以按照以下方法进行转换：

```java
// 生成 [min, max] 之间的随机数
int min = 5;
int max = 15;
int randomNum = min + (int)(Math.random() * (max - min + 1));
System.out.println("随机数: " + randomNum);
```

### 6. **角度和弧度的转换**

```java
double degree = 45;
double radian = Math.toRadians(degree); // 角度转弧度
System.out.println(degree + " 度转为弧度: " + radian); // 0.7853981633974483

radian = Math.PI / 4;  // 45度的弧度
degree = Math.toDegrees(radian); // 弧度转角度
System.out.println(radian + " 弧度转为度数: " + degree); // 45.0
```

---

## ✅ 三、`Number` 类与 `Math` 类的对比

|类名|主要作用|常用方法|示例代码|
|---|---|---|---|
|`Number`|数值封装类，提供了数值类型的转换方法|`intValue()`, `longValue()`, `doubleValue()` 等|`Number n = new Integer(5); int val = n.intValue();`|
|`Math`|提供各种数学计算功能，如四则运算、三角函数等|`abs()`, `sqrt()`, `pow()`, `random()` 等|`double result = Math.pow(2, 3);`|

---

## 📌 小结

- **`Number` 类**：用于封装数字对象，并提供将 `Number` 类型转换为不同基本数据类型的方法。常用于处理数字对象的转换。
    
- **`Math` 类**：提供了常用的数学运算方法，适用于四则运算、三角函数、对数计算、随机数等多种数学运算。
    
- **使用场景**：`Number` 类通常用于封装和转换数字对象，而 `Math` 类则在数值计算、数学运算时非常有用。
    

---
