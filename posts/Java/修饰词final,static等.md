---
Author:
  - Crain
tags:
  - Java
from: 2025-06-04
emaili: y252840@163.com
title: 修饰词final,static等
---
# Java 修饰方法或变量的关键词详解

## 1. `final` 关键字

### 1.1 `final` 修饰变量

- ​**​特点​**​：一旦赋值后就不能再修改
- ​**​应用场景​**​：
    - 定义常量
    - 防止参数被修改
    - 防止对象引用被改变

```java
// 基本类型常量
final int MAX_VALUE = 100;

// 引用类型常量（引用不可变，但对象内容可变）
final List<String> names = new ArrayList<>();
names.add("Alice");  // 允许
// names = new ArrayList<>();  // 编译错误
```

### 1.2 `final` 修饰方法

- ​**​特点​**​：不能被子类重写
- ​**​应用场景​**​：
    - 防止关键方法被修改
    - 确保方法行为不变

```java
class Parent {
    final void show() {
        System.out.println("这是最终方法");
    }
}

class Child extends Parent {
    // void show() {}  // 编译错误，不能重写final方法
}
```

### 1.3 `final` 修饰类

- ​**​特点​**​：不能被继承
- ​**​应用场景​**​：
    - 安全考虑（如String类）
    - 设计上不希望被扩展的类

```java
final class ImmutableClass {
    // 类内容
}
// class SubClass extends ImmutableClass {}  // 编译错误
```

## 2. `static` 关键字

### 2.1 `static` 修饰变量

- ​**​特点​**​：
    - 属于类而非实例
    - 所有实例共享同一变量
- ​**​应用场景​**​：
    - 类级别的共享数据
    - 计数器等

```java
class Employee {
    static int count = 0;  // 统计员工数量
    
    Employee() {
        count++;
    }
}
```

### 2.2 `static` 修饰方法

- ​**​特点​**​：
    - 属于类而非实例
    - 只能访问静态成员
- ​**​应用场景​**​：
    - 工具方法
    - 工厂方法

```java
class MathUtils {
    static double add(double a, double b) {
        return a + b;
    }
}

// 使用方式
double result = MathUtils.add(3.5, 4.2);
```

### 2.3 `static` 代码块

- ​**​特点​**​：类加载时执行一次
- ​**​应用场景​**​：初始化静态资源

```java
class Database {
    static Connection conn;
    
    static {
        try {
            conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/mydb");
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
```

## 3. `final static` 组合使用

### 3.1 定义常量

- ​**​特点​**​：
    - 类级别的常量
    - 不可修改
    - 命名规范：全大写，下划线分隔

```java
class Constants {
    public static final double PI = 3.1415926;
    public static final int MAX_USERS = 1000;
}
```

### 3.2 单例模式

```java
class Singleton {
    private static final Singleton INSTANCE = new Singleton();
    
    private Singleton() {}
    
    public static Singleton getInstance() {
        return INSTANCE;
    }
}
```

## 4. 其他相关修饰符

### 4.1 `volatile`

- ​**​特点​**​：
    - 保证多线程环境下的可见性
    - 不保证原子性
- ​**​应用场景​**​：多线程共享变量

```java
class SharedData {
    volatile boolean flag = true;
}
```

### 4.2 `transient`

- ​**​特点​**​：序列化时忽略该字段
- ​**​应用场景​**​：敏感数据或临时数据

```java
class User implements Serializable {
    private String username;
    private transient String password;  // 不会被序列化
}
```

## 5. 修饰符使用建议

1. ​**​最小权限原则​**​：尽量使用最严格的访问控制
2. ​**​`final` 优先​**​：除非需要修改，否则声明为final
3. ​**​`static` 慎用​**​：避免滥用导致代码难以测试和维护
4. ​**​常量命名规范​**​：`static final` 常量使用全大写
5. ​**​线程安全考虑​**​：多线程环境下注意`volatile`和同步机制

## 6. 修饰符组合示例

```java
public class Example {
    // 公共静态常量
    public static final String VERSION = "1.0";
    
    // 私有静态变量
    private static int instanceCount = 0;
    
    // 实例常量
    private final long createTime;
    
    // 私有静态final集合（内容可变但引用不可变）
    private static final List<String> DEFAULT_NAMES = 
        Collections.unmodifiableList(Arrays.asList("A", "B", "C"));
    
    public Example() {
        this.createTime = System.currentTimeMillis();
        instanceCount++;
    }
    
    // 公共静态方法
    public static int getInstanceCount() {
        return instanceCount;
    }
    
    // 最终实例方法
    public final long getCreateTime() {
        return createTime;
    }
}
```
