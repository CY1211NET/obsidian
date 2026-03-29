---
Author:
  - Crain
tags:
  - Java
from: 2025-06-30
emaili: y252840@163.com
title: 栈（Stack）
---
栈（Stack）是一种 **线性数据结构**，它遵循 **后进先出（LIFO, Last In First Out）** 原则，即最后被插入栈中的元素最先被移除。栈通常具有两个主要操作：

- **push**：将元素添加到栈顶。
    
- **pop**：从栈顶移除并返回元素。
    

除此之外，栈还可能有一些其他操作，如：

- **peek**：查看栈顶的元素，但不从栈中移除它。
    
- **isEmpty**：检查栈是否为空。
    
- **size**：获取栈中元素的数量。
    

栈是非常常见的数据结构，广泛应用于算法和程序设计中，尤其是在**递归调用**、**表达式求值**（如括号匹配）以及**浏览器历史记录**等场景中。

---

## ✅ 一、栈的实现

在 Java 中，栈可以使用 `Stack` 类来实现。`Stack` 类继承自 `Vector` 类，提供了常用的栈操作。

### 1. **常用方法**

|方法|说明|
|---|---|
|`push(E item)`|将元素 `item` 添加到栈顶。|
|`pop()`|移除栈顶元素并返回它。|
|`peek()`|返回栈顶元素，但不移除它。|
|`empty()`|判断栈是否为空。|
|`search(Object o)`|查找指定元素在栈中的位置（从栈顶开始）。|

### 2. **栈的示例**

```java
import java.util.Stack;

public class StackDemo {
    public static void main(String[] args) {
        Stack<Integer> stack = new Stack<>();

        // 入栈操作
        stack.push(10);
        stack.push(20);
        stack.push(30);
        System.out.println("栈中的元素: " + stack);

        // 查看栈顶元素但不移除
        System.out.println("栈顶元素: " + stack.peek());  // 30

        // 出栈操作
        System.out.println("出栈元素: " + stack.pop());   // 30
        System.out.println("栈中的元素: " + stack);

        // 检查栈是否为空
        System.out.println("栈是否为空? " + stack.empty());  // false
    }
}
```

### 输出：

```
栈中的元素: [10, 20, 30]
栈顶元素: 30
出栈元素: 30
栈中的元素: [10, 20]
栈是否为空? false
```

---

## ✅ 二、栈的应用

栈在许多算法中都有应用，常见的包括：

1. **括号匹配**：检查一段代码中的括号是否匹配（例如：`({[ ]}())`）。
    
2. **逆序输出**：栈可以用来反转数据或字符串。
    
3. **深度优先搜索（DFS）**：在图的深度优先搜索中，栈常常用来模拟递归过程。
    
4. **递归调用栈**：系统在进行递归时使用栈来保存每个函数调用的状态。
    

---

## ✅ 三、栈的常见问题和测试题

### **测试题1：括号匹配**

**问题描述**：  
给定一个字符串，包含 `'('`、`')'`、`'{'`、`'}'`、`'['`、`']'` 等括号字符，判断括号是否成对匹配，并且顺序正确。

**解法思路**：  
使用栈来实现，遍历字符串时：

1. 遇到左括号时，压入栈中。
    
2. 遇到右括号时，检查栈顶元素是否为匹配的左括号。如果匹配则弹出栈顶元素，如果不匹配则返回 false。
    

```java
import java.util.Stack;

public class ParenthesisMatcher {
    public boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        for (char c : s.toCharArray()) {
            // 如果是左括号，压入栈
            if (c == '(' || c == '{' || c == '[') {
                stack.push(c);
            } 
            // 如果是右括号，检查栈顶元素
            else if (c == ')' && !stack.isEmpty() && stack.peek() == '(') {
                stack.pop();
            } else if (c == '}' && !stack.isEmpty() && stack.peek() == '{') {
                stack.pop();
            } else if (c == ']' && !stack.isEmpty() && stack.peek() == '[') {
                stack.pop();
            } else {
                return false;  // 不匹配的情况
            }
        }
        return stack.isEmpty();  // 如果栈为空，说明括号匹配正确
    }

    public static void main(String[] args) {
        ParenthesisMatcher matcher = new ParenthesisMatcher();
        System.out.println(matcher.isValid("()[]{}"));  // true
        System.out.println(matcher.isValid("(]"));      // false
        System.out.println(matcher.isValid("([)]"));    // false
        System.out.println(matcher.isValid("{[]}"));    // true
    }
}
```

### **测试题2：逆序输出**

**问题描述**：  
给定一个字符串，使用栈将其反转并输出。

**解法思路**：

1. 将字符串的每个字符逐个压入栈中。
    
2. 然后依次从栈中弹出字符，拼接成一个新的字符串，即为反转后的字符串。
    

```java
import java.util.Stack;

public class ReverseString {
    public String reverseString(String s) {
        Stack<Character> stack = new Stack<>();
        for (char c : s.toCharArray()) {
            stack.push(c);  // 入栈
        }
        
        StringBuilder reversed = new StringBuilder();
        while (!stack.isEmpty()) {
            reversed.append(stack.pop());  // 出栈
        }
        return reversed.toString();
    }

    public static void main(String[] args) {
        ReverseString reverser = new ReverseString();
        System.out.println(reverser.reverseString("hello"));  // "olleh"
    }
}
```

---

### **测试题3：栈的最小值问题**

**问题描述**：  
设计一个支持常数时间内 **push**、**pop**、**top** 和 **getMin** 操作的栈。`getMin()` 方法返回栈中的最小元素。

**解法思路**：  
我们可以使用两个栈：

- 一个普通栈用于存储元素。
    
- 另一个辅助栈用于存储栈中每个时刻的最小值。
    

```java
import java.util.Stack;

public class MinStack {
    private Stack<Integer> stack;
    private Stack<Integer> minStack;

    public MinStack() {
        stack = new Stack<>();
        minStack = new Stack<>();
    }

    public void push(int x) {
        stack.push(x);
        // 更新最小栈
        if (minStack.isEmpty() || x <= minStack.peek()) {
            minStack.push(x);
        } else {
            minStack.push(minStack.peek());
        }
    }

    public void pop() {
        stack.pop();
        minStack.pop();
    }

    public int top() {
        return stack.peek();
    }

    public int getMin() {
        return minStack.peek();
    }

    public static void main(String[] args) {
        MinStack minStack = new MinStack();
        minStack.push(-2);
        minStack.push(0);
        minStack.push(-3);
        System.out.println(minStack.getMin());  // -3
        minStack.pop();
        System.out.println(minStack.top());     // 0
        System.out.println(minStack.getMin());  // -2
    }
}
```

---

## ✅ 四、栈的时间复杂度

- **push**：O(1) — 将元素压入栈顶，时间复杂度是常数时间。
    
- **pop**：O(1) — 从栈顶移除元素，时间复杂度是常数时间。
    
- **peek**：O(1) — 查看栈顶元素，时间复杂度是常数时间。
    
- **isEmpty**：O(1) — 检查栈是否为空，时间复杂度是常数时间。
    

---

## 📌 总结

- **栈**：遵循 **后进先出**（LIFO）原则，常用于递归、括号匹配、浏览器历史记录等场景。
    
- 栈的常见操作有 `push`、`pop`、`peek`、`isEmpty` 等。
    
- **应用实例**：括号匹配、逆序输出、栈的最小值查询等。
    
