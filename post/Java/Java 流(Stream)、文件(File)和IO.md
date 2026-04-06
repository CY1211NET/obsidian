---
Author:
  - Crain
tags:
  - Java
from: 2025-06-18
emaili: y252840@163.com
title: Java 流(Stream)、文件(File)和IO
---
# Java 流(Stream)、文件(File)和IO 总结

## 基本概念

Java 中的流(Stream)、文件(File)和IO(输入输出)是处理数据读取和写入的基础设施，允许程序与外部数据(如文件、网络、系统输入等)进行交互。

## 核心包 - java.io

`java.io` 包提供了：

- 处理数据流(字节流和字符流)
- 文件读写
- 序列化
- 数据格式化工具

## 流(Stream)分类

### 字节流(处理二进制数据)

|类名|类型|描述|
|---|---|---|
|InputStream|抽象类(输入流)|所有字节输入流的超类|
|OutputStream|抽象类(输出流)|所有字节输出流的超类|
|FileInputStream|输入流|从文件读取字节数据|
|FileOutputStream|输出流|将字节数据写入文件|
|BufferedInputStream|输入流|提供缓冲功能，提高读取效率|
|BufferedOutputStream|输出流|提供缓冲功能，提高写入效率|
|DataInputStream|输入流|读取Java原生数据类型|
|DataOutputStream|输出流|写入Java原生数据类型|
|ObjectInputStream|输入流|读取序列化对象|
|ObjectOutputStream|输出流|写入序列化对象|

### 字符流(处理文本数据)

|类名|类型|描述|
|---|---|---|
|Reader|抽象类(输入流)|所有字符输入流的超类|
|Writer|抽象类(输出流)|所有字符输出流的超类|
|FileReader|输入流|从文件读取字符数据|
|FileWriter|输出流|将字符数据写入文件|
|BufferedReader|输入流|提供缓冲功能，支持按行读取|
|BufferedWriter|输出流|提供缓冲功能，支持按行写入|
|InputStreamReader|输入流|字节到字符的桥梁|
|OutputStreamWriter|输出流|字符到字节的桥梁|

### 辅助类

|类名|类型|描述|
|---|---|---|
|File|文件和目录操作|表示文件或目录，提供文件操作|
|RandomAccessFile|随机访问文件|支持文件的随机访问|
|Console|控制台输入输出|提供对系统控制台的支持|

## 控制台输入输出

### 读取控制台输入

1. 使用 `BufferedReader`:

```java
BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
char c = (char) br.read();  // 读取单个字符
String str = br.readLine(); // 读取一行字符串
```

2. 使用 `Scanner` (JDK5+):

```java
Scanner scanner = new Scanner(System.in);
String input = scanner.nextLine();
```

### 控制台输出

- `System.out.print()` / `System.out.println()`
- `System.out.write()` (不常用)

## 文件操作

### 文件读写示例

1. 字节流读写:

```java
// 写入文件
FileOutputStream fos = new FileOutputStream("test.txt");
fos.write(data);
fos.close();

// 读取文件
FileInputStream fis = new FileInputStream("test.txt");
int data = fis.read();
fis.close();
```

2. 字符流读写(解决编码问题):

```java
// 写入文件
FileOutputStream fop = new FileOutputStream("a.txt");
OutputStreamWriter writer = new OutputStreamWriter(fop, "UTF-8");
writer.append("中文输入");
writer.close();

// 读取文件
FileInputStream fip = new FileInputStream("a.txt");
InputStreamReader reader = new InputStreamReader(fip, "UTF-8");
int data = reader.read();
reader.close();
```

### 目录操作

1. 创建目录:

```java
File d = new File("/tmp/user/java/bin");
d.mkdir();    // 创建单级目录
d.mkdirs();   // 创建多级目录
```

2. 读取目录内容:

```java
File f1 = new File("/tmp");
if (f1.isDirectory()) {
    String[] files = f1.list();
    for (String file : files) {
        System.out.println(file);
    }
}
```

3. 删除目录或文件:

```java
public static void deleteFolder(File folder) {
    File[] files = folder.listFiles();
    if (files != null) {
        for (File f : files) {
            if (f.isDirectory()) {
                deleteFolder(f);
            } else {
                f.delete();
            }
        }
    }
    folder.delete();
}
```

## 常用方法

### InputStream 方法

|方法|描述|
|---|---|
|`int read()`|读取一个字节的数据|
|`int read(byte[] b)`|读取字节到数组|
|`int read(byte[] b, int off, int len)`|读取字节到数组的指定位置|
|`long skip(long n)`|跳过n个字节|
|`int available()`|返回可读取的字节数|
|`void close()`|关闭流|
|`void mark(int readlimit)`|设置标记|
|`void reset()`|重置到标记位置|

### OutputStream 方法

|方法|描述|
|---|---|
|`void write(int b)`|写入一个字节|
|`void write(byte[] b)`|写入字节数组|
|`void write(byte[] b, int off, int len)`|写入字节数组的一部分|
|`void flush()`|刷新输出流|
|`void close()`|关闭流|

## 最佳实践

1. 总是使用缓冲流(BufferedInputStream/BufferedReader)来提高IO性能
2. 处理文本时明确指定字符编码(如UTF-8)
3. 使用try-with-resources确保流正确关闭
4. 对于大文件，考虑使用NIO(New IO)提高性能
5. 删除目录前确保目录为空