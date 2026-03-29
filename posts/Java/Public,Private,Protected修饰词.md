---
Author:
  - Crain
tags:
  - Java
from: 2025-06-04
emaili: y252840@163.com
title: Public,Private,Protected修饰词
---
在Java中，​**​四大修饰符（访问控制修饰符）​**​用于控制类、变量、方法的可见性和访问权限。它们分别是：

1. ​**​`public`​**​
2. ​**​`protected`​**​
3. ​**​`private`​**​
4. ​**​`默认（无修饰符）`​**​

---

## ​**​📌 1. `public`（公开的）​**​

### ​**​特点：​**​

- ​**​任何地方都可以访问​**​（跨类、跨包、跨模块）。
- 适用于需要全局访问的类、方法、变量。

### ​**​示例：​**​

```
public class Animal {
    public String name; // 公开变量

    public void eat() { // 公开方法
        System.out.println("Eating...");
    }
}
```

​**​使用场景：​**​

- 工具类方法（如`Math.max()`）。
- 常量（如`public static final double PI = 3.14`）。
- 主类（`public class Main`）。

---

## ​**​📌 2. `protected`（受保护的）​**​

### ​**​特点：​**​

- ​**​仅限本类、子类、同包类访问​**​。
- 常用于​**​继承体系​**​中，允许子类访问父类成员。

### ​**​示例：​**​

```java
public class Animal {
    protected String species; // 子类可访问

    protected void sleep() { // 子类可调用
        System.out.println("Sleeping...");
    }
}

class Dog extends Animal {
    void bark() {
        System.out.println(species); // 子类可访问protected变量
        sleep(); // 子类可调用protected方法
    }
}
```

​**​使用场景：​**​

- 父类中希望子类重写的方法（如`clone()`）。
- 子类需要访问的父类属性。

---

## ​**​📌 3. `private`（私有的）​**​

### ​**​特点：​**​

- ​**​仅限本类内部访问​**​，外部类、子类、同包类均不可见。
- 用于​**​封装​**​，隐藏实现细节。

### ​**​示例：​**​

```java
public class BankAccount {
    private double balance; // 私有变量，外部无法直接访问

    public void deposit(double amount) { // 通过公有方法间接访问
        if (amount > 0) {
            balance += amount;
        }
    }

    public double getBalance() { // 提供getter方法
        return balance;
    }
}
```

​**​使用场景：​**​

- 类的内部状态（如`balance`）。
- 不希望外部直接修改的变量（通过`getter/setter`控制）。

---

## ​**​📌 4. `默认（无修饰符）`（包级私有）​**​

### ​**​特点：​**​

- ​**​仅限同包内访问​**​，不同包的类（即使子类）也无法访问。
- 适用于​**​包内工具类​**​或​**​内部组件​**​。

### ​**​示例：​**​

```java
class Logger { // 默认修饰符，仅同包可访问
    void log(String message) {
        System.out.println("[LOG] " + message);
    }
}
```

​**​使用场景：​**​

- 包内工具类（如日志工具`Logger`）。
- 不希望被其他包使用的辅助类。

---

## ​**​📊 四大修饰符访问权限对比​**​

|​**​修饰符​**​|​**​本类​**​|​**​同包类​**​|​**​子类​**​|​**​其他包类​**​|
|---|---|---|---|---|
|`public`|✅|✅|✅|✅|
|`protected`|✅|✅|✅|❌|
|`默认`|✅|✅|❌|❌|
|`private`|✅|❌|❌|❌|

---

## ​**​💡 如何选择修饰符？​**​

1. ​**​`public`​**​：需要全局访问时（如工具类、常量）。
2. ​**​`protected`​**​：允许子类扩展，但不想完全公开时。
3. ​**​`private`​**​：封装内部实现，避免外部直接修改。
4. ​**​`默认`​**​：仅限同包使用，隐藏包内细节。

​**​示例：​**​

```java
public class Car {
    private String engine; // 私有：隐藏发动机细节
    protected String model; // 子类可访问
    public String color; // 公开：任何地方可修改
    int year; // 默认：仅同包可访问
}
```

---

## ​**​🚨 常见错误​**​

1. ​**​滥用`public`​**​：
    
    ```java
    public class User {
        public String password; // 危险！密码应私有
    }
    ```
    
    ​**​修正：​**​
    
    ```java
    private String password;
    public void setPassword(String pwd) { /* 安全校验 */ }
    ```
    
2. ​**​误用`protected`​**​：
    
    ```java
    protected class Util { } // 无意义，类不能用protected
    ```
    
    ​**​正确：​**​ `protected`仅用于成员变量/方法。
    

---

## ​**​🎯 总结​**​

- ​**​`public`​**​ → 完全开放。
- ​**​`protected`​**​ → 对子类和同包开放。
- ​**​`private`​**​ → 仅限本类。
- ​**​`默认`​**​ → 仅限同包。

​**​核心原则：​**​  
​**​“尽量收紧权限”​**​（优先用`private`，必要时逐步放宽）。