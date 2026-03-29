---
Author:
  - Crain
tags:
  - Java
date: 2025-06-30
emaili: y252840@163.com
title: String类常用方法
---


---

## 🧩 一、基本方法

### 1. `length()`

> 获取字符串长度

```java
String s = "hello";
System.out.println(s.length());  // 5
```

---

### 2. `charAt(int index)`

> 获取指定位置的字符（从 0 开始）

```java
String s = "hello";
System.out.println(s.charAt(1));  // 'e'
```

---

### 3. `substring(int beginIndex)` / `substring(int beginIndex, int endIndex)`

> 截取字符串（左闭右开）

```java
String s = "hello";
System.out.println(s.substring(2));     // "llo"
System.out.println(s.substring(1, 4));  // "ell"
```

---

### 4. `equals(String other)` 和 `equalsIgnoreCase(String other)`

> 比较字符串是否相等（是否区分大小写）

```java
String a = "Hello";
String b = "hello";

System.out.println(a.equals(b));           // false
System.out.println(a.equalsIgnoreCase(b)); // true
```

---

### 5. `compareTo(String other)`

> 按字典序比较字符串大小

```java
String a = "apple";
String b = "banana";

System.out.println(a.compareTo(b));  // 负数（a < b）
```

---

## 🛠 二、查找方法

### 6. `contains(String str)`

> 判断是否包含某个子串

```java
String s = "hello world";
System.out.println(s.contains("world"));  // true
```

---

### 7. `indexOf(String str)` / `lastIndexOf(String str)`

> 查找子串第一次/最后一次出现的位置

```java
String s = "ababcab";
System.out.println(s.indexOf("ab"));       // 0
System.out.println(s.lastIndexOf("ab"));   // 4
```

---

## ✂️ 三、修改字符串

### 8. `replace(char oldChar, char newChar)` / `replaceAll(String regex, String replacement)`

> 替换字符或子串（支持正则）

```java
String s = "banana";
System.out.println(s.replace('a', 'o'));       // "bonono"
System.out.println(s.replaceAll("an", "xy"));  // "bxyxya"
```

---

### 9. `trim()`

> 去除首尾空格（不去中间空格）

```java
String s = "  hello world  ";
System.out.println(s.trim());  // "hello world"
```

---

### 10. `toUpperCase()` / `toLowerCase()`

> 字母大小写转换

```java
String s = "Hello";
System.out.println(s.toLowerCase());  // "hello"
System.out.println(s.toUpperCase());  // "HELLO"
```

---

## 🧵 四、分割与拼接

### 11. `split(String regex)`

> 按规则分割字符串（结果是数组）

```java
String s = "apple,banana,pear";
String[] arr = s.split(",");
System.out.println(Arrays.toString(arr));  // [apple, banana, pear]
```

---

### 12. `join(String delimiter, ...)`

> 把多个字符串拼接为一个字符串（从 Java 8 开始）

```java
String result = String.join("-", "2025", "06", "30");
System.out.println(result);  // "2025-06-30"
```

---

## 🌟 Bonus：字符串转数组 / 数组转字符串

### 字符串转字符数组

```java
String s = "hello";
char[] arr = s.toCharArray();
System.out.println(Arrays.toString(arr));  // [h, e, l, l, o]
```

### 字符数组转字符串

```java
char[] arr = {'h', 'e', 'l', 'l', 'o'};
String s = new String(arr);
System.out.println(s);  // "hello"
```

---

## ✅ 小练习 Demo

```java
public class StringDemo {
    public static void main(String[] args) {
        String str = " Hello Java World! ";
        System.out.println("原始字符串: " + str);

        // 去空格 + 转小写
        str = str.trim().toLowerCase();
        System.out.println("处理后: " + str);

        // 截取 "java"
        String javaWord = str.substring(6, 10);
        System.out.println("截取部分: " + javaWord);

        // 判断是否包含
        System.out.println("是否包含 world: " + str.contains("world"));

        // 替换空格为下划线
        System.out.println("替换: " + str.replace(" ", "_"));
    }
}
```

---

## 📌 总结表格

|方法名|作用说明|
|---|---|
|`length()`|获取字符串长度|
|`charAt(i)`|获取指定位置字符|
|`substring(i,j)`|截取子串|
|`equals()`|判断是否相等|
|`contains()`|判断是否包含子串|
|`indexOf()`|返回子串第一次出现位置|
|`replace()`|替换字符或子串|
|`trim()`|去除首尾空格|
|`split()`|字符串转数组|
|`join()`|数组转字符串|

---

