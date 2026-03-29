---
Author:
  - Crain
tags:
  - Java
from: 2025-06-04
emaili: y252840@163.com
title: Static的使用
---
在Java中，内部类（在另一个类中定义的类）可以声明为`static`或非`static`（普通内部类）。这里我们讨论`class teacher`在`ArrayListDemo1`类中定义时，加`static`和不加`static`的区别。

---

## ​**​1. `static` 内部类（静态内部类）​**​

### ​**​特点：​**​

- 使用`static`修饰的内部类。
- ​**​不持有外部类的引用​**​，因此：
    - 不能直接访问外部类的非静态成员（实例变量/方法）。
    - 可以独立于外部类实例存在。
- 通常用于​**​与外部类逻辑相关但不需要访问外部类实例​**​的情况。

### ​**​示例：​**​

```java
static class Teacher {
    private String name;
    private String subject;

    public Teacher(String name, String subject) {
        this.name = name;
        this.subject = subject;
    }

    @Override
    public String toString() {
        return "Teacher{name='" + name + "', subject='" + subject + "'}";
    }
}
```

### ​**​使用方式：​**​

```
// 可以直接创建，不需要外部类实例
ArrayListDemo1.Teacher teacher = new ArrayListDemo1.Teacher("赵老师", "JavaEE");
```

---

## ​**​2. 非`static` 内部类（普通内部类）​**​

### ​**​特点：​**​

- 不加`static`修饰的内部类。
- ​**​隐式持有外部类的引用​**​，因此：
    - 可以直接访问外部类的所有成员（包括`private`成员）。
    - 必须先创建外部类实例，才能创建内部类实例。
- 通常用于​**​需要与外部类实例紧密交互​**​的情况。

### ​**​示例：​**​

```java
class Teacher {
    private String name;
    private String subject;

    public Teacher(String name, String subject) {
        this.name = name;
        this.subject = subject;
    }

    @Override
    public String toString() {
        return "Teacher{name='" + name + "', subject='" + subject + "'}";
    }
}
```

### ​**​使用方式：​**​

```
// 必须先创建外部类实例
ArrayListDemo1 demo = new ArrayListDemo1();
ArrayListDemo1.Teacher teacher = demo.new Teacher("赵老师", "JavaEE"); // 注意语法
```

---

## ​**​3. 关键区别对比​**​

|​**​特性​**​|​**​`static` 内部类​**​|​**​非`static` 内部类​**​|
|---|---|---|
|​**​是否持有外部类引用​**​|❌ 不持有|✅ 隐式持有|
|​**​访问外部类成员​**​|❌ 不能直接访问非静态成员|✅ 可以直接访问所有成员|
|​**​实例化方式​**​|`Outer.Inner obj = new Outer.Inner()`|`Outer.Inner obj = outer.new Inner()`|
|​**​内存占用​**​|更小（无额外引用）|更大（隐含外部类引用）|
|​**​适用场景​**​|独立工具类、不依赖外部类|紧密耦合、需要访问外部类状态|

---

## ​**​4. 你的代码分析​**​

你的代码中：

```
static class Teacher { ... }
```

- 使用了`static`修饰，说明`Teacher`不依赖`ArrayListDemo1`的实例。
- 可以直接通过`ArrayListDemo1.Teacher`创建对象，无需先创建`ArrayListDemo1`实例。
- 适用于​**​不需要访问外部类成员​**​的情况。

### ​**​如果去掉`static`：​**​

```
class Teacher { ... } // 非static
```

- 必须先创建`ArrayListDemo1`实例：
    
    ```
    ArrayListDemo1 demo = new ArrayListDemo1();
    ArrayListDemo1.Teacher teacher = demo.new Teacher("赵老师", "JavaEE");
    ```
    
- 适用于​**​需要访问外部类成员​**​的情况。

---

## ​**​5. 如何选择？​**​

- ​**​用`static`​**​：如果`Teacher`是独立工具类，不需要访问`ArrayListDemo1`的成员。
- ​**​不用`static`​**​：如果`Teacher`需要访问`ArrayListDemo1`的实例变量或方法。

在你的例子中，`Teacher`只是存储姓名和科目，不依赖外部类，因此​**​`static`更合适​**​。

---

## ​**​6. 修正后的代码​**​

你的`Teacher`构造函数没有初始化字段，`toString()`格式也不太规范，修正如下：

```
static class Teacher {
    private String name;
    private String subject;

    public Teacher(String name, String subject) {
        this.name = name;
        this.subject = subject;
    }

    // Getter & Setter ...

    @Override
    public String toString() {
        return "Teacher{name='" + name + "', subject='" + subject + "'}";
    }
}
```

好的！我来用通俗易懂的方式解释 ​**​`static`方法​**​ 和 ​**​`static`变量​**​，并对比它们与非`static`成员的区别。


## ​**​📌 1. `static`变量（静态变量）​**​

### ​**​特点：​**​

- ​**​属于类本身​**​，而不是某个对象。
- ​**​所有对象共享同一份`static`变量​**​（修改一处，所有对象都受影响）。
- 可以直接通过 ​**​`类名.变量名`​**​ 访问，不需要创建对象。

### ​**​例子：学校的学生总数​**​

```java
public class Student {
    String name;
    static int totalStudents = 0; // 所有学生共享的计数器

    public Student(String name) {
        this.name = name;
        totalStudents++; // 每创建一个学生，总数+1
    }

    public static void printTotal() {
        System.out.println("全校学生总数：" + totalStudents);
    }
}
```

​**​使用方式：​**​

```java
Student s1 = new Student("张三");
Student s2 = new Student("李四");

// 直接通过类名访问static变量
System.out.println(Student.totalStudents); // 输出: 2

// 也可以通过对象访问（但不推荐）
System.out.println(s1.totalStudents); // 输出: 2（但容易混淆）
```

​**​关键点：​**​

- `totalStudents` 是所有`Student`对象共享的。
- 如果`totalStudents`不是`static`，每个`Student`对象都会有自己独立的`totalStudents`，无法正确统计总数。

---

## ​**​📌 2. `static`方法（静态方法）​**​

### ​**​特点：​**​

- ​**​属于类本身​**​，而不是某个对象。
- ​**​不能直接访问非`static`成员（变量/方法）​**​，因为非`static`成员依赖对象实例。
- 可以直接通过 ​**​`类名.方法名()`​**​ 调用，不需要创建对象。

### ​**​例子：学校的工具方法​**​

```java
public class School {
    String name; // 非static变量（属于对象）

    public School(String name) {
        this.name = name;
    }

    // static方法：计算两个数的和（不依赖对象）
    public static int add(int a, int b) {
        return a + b;
    }

    // 非static方法：打印学校名字（依赖对象）
    public void printName() {
        System.out.println("学校名称：" + this.name);
    }
}
```

​**​使用方式：​**​

```java
// 直接调用static方法，无需创建对象
int sum = School.add(3, 5); // 输出: 8

// 非static方法必须先创建对象
School school = new School("清华大学");
school.printName(); // 输出: 学校名称：清华大学
```

​**​关键点：​**​

- `add()` 是`static`方法，​**​不依赖`School`对象​**​，可以直接调用。
- `printName()` 是普通方法，​**​必须通过对象调用​**​，因为它需要访问`this.name`。

---

## ​**​📌 3. `static` vs 非`static` 对比​**​

|​**​特性​**​|​**​`static`成员（变量/方法）​**​|​**​非`static`成员（变量/方法）​**​|
|---|---|---|
|​**​归属​**​|属于类|属于对象|
|​**​内存分配​**​|类加载时分配，全局唯一|每创建一个对象，分配一份|
|​**​访问方式​**​|`类名.变量名` / `类名.方法名()`|`对象名.变量名` / `对象名.方法名()`|
|​**​能否访问非`static`成员​**​|❌ 不能（因为不依赖对象）|✅ 能（因为依赖对象）|
|​**​典型用途​**​|全局配置、工具方法、计数器|对象特有的属性、行为|

---

## ​**​📌 4. 什么时候用`static`？​**​

### ​**​适合用`static`的场景：​**​

1. ​**​共享数据​**​（如计数器、全局配置）
    
    ```
    static int userCount = 0; // 统计用户总数
    ```
    
2. ​**​工具方法​**​（如`Math.max()`、`Arrays.sort()`）
    
    ```
    public static boolean isEmpty(String str) {
        return str == null || str.isEmpty();
    }
    ```
    
3. ​**​常量​**​（如`Math.PI`）
    
    ```
    public static final double PI = 3.1415926;
    ```
    

### ​**​不适合用`static`的场景：​**​

1. ​**​对象特有的属性​**​（如`Student.name`）
    
    ```
    String name; // 每个学生名字不同，不能用static
    ```
    
2. ​**​需要访问对象状态的方法​**​（如`student.getAge()`）
    
    ```
    public int getAge() { // 依赖对象，不能用static
        return this.age;
    }
    ```
    

---

## ​**​📌 5. 常见误区​**​

### ❌ ​**​错误1：在`static`方法里访问非`static`成员​**​

```java
public class Test {
    int x = 10; // 非static变量

    public static void printX() {
        System.out.println(x); // 编译错误！不能直接访问非static变量
    }
}
```

​**​修正：​**​

```java
public static void printX(Test obj) {
    System.out.println(obj.x); // 通过对象访问
}
```

### ❌ ​**​错误2：滥用`static`导致数据混乱​**​

```java
public class User {
    static String name; // 所有用户共享同一个name！

    public static void setName(String name) {
        User.name = name;
    }
}
```

​**​问题：​**​

- 如果`User.setName("张三")`，所有用户都会变成“张三”！

​**​正确做法：​**​

```java
public class User {
    String name; // 每个用户有自己的名字

    public void setName(String name) {
        this.name = name;
    }
}
```

---

## ​**​🎯 总结​**​

- ​**​`static`变量​**​ → ​**​全局共享数据​**​（如计数器、配置）。
- ​**​`static`方法​**​ → ​**​工具方法​**​（不依赖对象状态）。
- ​**​非`static`成员​**​ → ​**​对象特有的属性和行为​**​。

​**​记住：​**​

- ​**​`static`属于类，非`static`属于对象。​**​
- ​**​`static`方法不能直接访问非`static`成员。​**​
- ​**​滥用`static`会导致数据混乱，谨慎使用！​**​
