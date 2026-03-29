---
title: 节点（node）
date: 2023-02-26
category: Java
tags:
  - Java
draft: false
author: Crain
---
---

# 链表讲解 + 测试题

---

## 一、链表简介

链表（Linked List）是一种**线性数据结构**，由多个节点组成，每个节点包含数据部分和指向下一个节点的指针（或引用）。

- **与数组不同**，链表节点不需要连续内存，通过指针串联，灵活易扩展。
    
- 常见链表类型有单向链表、双向链表和循环链表。
    

---

## 二、链表结构

```java
class Node {
    int data;      // 数据
    Node next;     // 指向下一个节点的引用

    Node(int data) {
        this.data = data;
        this.next = null;
    }
}
```

---

## 三、链表常见操作

|操作|说明|复杂度|
|---|---|---|
|遍历链表|从头节点开始依次访问各节点|O(n)|
|插入节点（头部）|新节点指向原头节点，更新头指针|O(1)|
|插入节点（尾部）|找到尾节点，尾节点指向新节点|O(n)|
|删除节点|找到待删节点前驱，跳过待删节点|O(n)|
|查找节点|依次比较直到找到目标节点|O(n)|

---

## 四、简单示例代码 — 单向链表插入和遍历

```java
class LinkedList {
    Node head;

    // 在链表头插入新节点
    public void insertAtHead(int data) {
        Node newNode = new Node(data);
        newNode.next = head;
        head = newNode;
    }

    // 遍历链表
    public void printList() {
        Node current = head;
        while (current != null) {
            System.out.print(current.data + " -> ");
            current = current.next;
        }
        System.out.println("null");
    }
}
```

---

以下是你提出的 6 道链表练习题的完整实现，**使用自定义的 `ListNode` 类**，并附带讲解与测试方法。

---

## ✅ 统一的链表节点类 `ListNode`

```java
class ListNode {
    int val;
    ListNode next;
    ListNode(int val) {
        this.val = val;
    }
}
```

---

## 1️⃣ 尾部插入节点：`insertAtTail(int data)`

```java
public ListNode insertAtTail(ListNode head, int data) {
    ListNode newNode = new ListNode(data);
    if (head == null) return newNode;
    ListNode curr = head;
    while (curr.next != null) {
        curr = curr.next;
    }
    curr.next = newNode;
    return head;
}
```

---

## 2️⃣ 删除值为 `key` 的第一个节点：`deleteNode(int key)`

```java
public ListNode deleteNode(ListNode head, int key) {
    if (head == null) return null;
    if (head.val == key) return head.next; // 删除头结点

    ListNode curr = head;
    while (curr.next != null && curr.next.val != key) {
        curr = curr.next;
    }

    if (curr.next != null) {
        curr.next = curr.next.next; // 跳过目标节点
    }

    return head;
}
```

---

## 3️⃣ 查找链表是否包含某值：`contains(int key)`

```java
public boolean contains(ListNode head, int key) {
    ListNode curr = head;
    while (curr != null) {
        if (curr.val == key) return true;
        curr = curr.next;
    }
    return false;
}
```

---

## 4️⃣ 链表反转：`reverse()`

```java
public ListNode reverse(ListNode head) {
    ListNode prev = null;
    ListNode curr = head;

    while (curr != null) {
        ListNode next = curr.next; // 暂存下一个节点
        curr.next = prev;          // 当前节点指向前一个
        prev = curr;
        curr = next;
    }

    return prev; // 新的头节点
}
```

---

## 5️⃣ 判断链表是否有环（快慢指针法）

```java
public boolean hasCycle(ListNode head) {
    ListNode slow = head;
    ListNode fast = head;

    while (fast != null && fast.next != null) {
        slow = slow.next;           // 一步
        fast = fast.next.next;      // 两步
        if (slow == fast) return true; // 相遇表示有环
    }

    return false;
}
```

---

## 6️⃣ 合并两个有序链表（LeetCode 21）

```java
public ListNode mergeTwoLists(ListNode l1, ListNode l2) {
    ListNode dummy = new ListNode(-1);
    ListNode curr = dummy;

    while (l1 != null && l2 != null) {
        if (l1.val <= l2.val) {
            curr.next = l1;
            l1 = l1.next;
        } else {
            curr.next = l2;
            l2 = l2.next;
        }
        curr = curr.next;
    }

    curr.next = (l1 != null) ? l1 : l2;
    return dummy.next;
}
```

---

## ✅ 附加：链表打印函数（调试用）

```java
public void printList(ListNode head) {
    while (head != null) {
        System.out.print(head.val + " -> ");
        head = head.next;
    }
    System.out.println("null");
}
```

---

## ✅ 如何测试这些方法？

你可以在 `main` 方法中调用：

```java
public static void main(String[] args) {
    Solution s = new Solution();

    ListNode head = null;
    head = s.insertAtTail(head, 1);
    head = s.insertAtTail(head, 2);
    head = s.insertAtTail(head, 3);
    s.printList(head); // 1 -> 2 -> 3 -> null

    head = s.deleteNode(head, 2);
    s.printList(head); // 1 -> 3 -> null

    System.out.println(s.contains(head, 3)); // true

    head = s.reverse(head);
    s.printList(head); // 3 -> 1 -> null
}
```

---

如你想把这些方法封装进一个 `LinkedList` 类或加上递归版，也可以告诉我继续扩展。是否要我打包为完整的 Java 类文件？
---

## 六、参考思路提示

- **尾插入**：遍历到尾节点，尾节点的 `next` 指向新节点。
    
- **删除节点**：找到待删节点的前一个节点，修改前驱节点的 `next` 跳过待删节点。
    
- **查找节点**：遍历链表，比较节点值与目标值。
    
- **链表反转**：使用三个指针（前驱、当前、后继）依次反转指向。
    
- **判断环**：快慢指针（龟兔赛跑）法。
    
- **合并链表**：双指针法，逐个比较插入。
    

---

如果需要，我可以帮你写以上测试题的详细代码和解析，也可以帮你设计更多题目！你想先从哪题开始？