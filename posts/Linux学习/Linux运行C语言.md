---
title: Linux运行C语言
date: '2025-06-17'
category: Linux学习
tags:
- Linux
- 'C语言'
draft: false
author: Crain
---
在 Linux 系统中运行 C 语言程序，一般分为以下几个步骤，从编写、编译到运行都非常高效直观：

---

## ✅ 一、准备环境

### 查看是否已安装 `gcc`：

```bash
gcc --version
```

如果没有安装，执行（以 Ubuntu 为例）：

```bash
sudo apt update
sudo apt install build-essential -y
```

---

## ✅ 二、编写 C 程序

### 1. 创建 `.c` 文件

```bash
nano hello.c
```

### 2. 写入示例代码：

```c
[[include]] <stdio.h>

int main() {
    printf("Hello, Linux!\n");
    return 0;
}
```

按 `Ctrl + O` 保存，`Ctrl + X` 退出 nano。

---

## ✅ 三、编译 C 程序

```bash
gcc hello.c -o hello
```

- `gcc`：GCC 编译器
    
- `hello.c`：源文件名
    
- `-o hello`：输出为 `hello` 可执行文件（不加 `-o` 默认叫 `a.out`）
    

---

## ✅ 四、运行程序

```bash
./hello
```

输出结果应为：

```
Hello, Linux!
```

---

## ✅ 五、常用编译选项（了解）

|命令|含义说明|
|---|---|
|`gcc -Wall hello.c`|编译时开启所有警告提示|
|`gcc -g hello.c`|加入调试信息，便于 `gdb` 调试|
|`gcc -O2 hello.c`|开启优化选项，加快运行速度|
|`gcc -std=c99 hello.c`|使用 C99 标准编译|

---

## ✅ 六、调试支持（可选）

如果你想使用调试器：

```bash
gcc -g hello.c -o hello
gdb ./hello
```

---

## ✅ 七、脚本自动化（进阶）

可以创建一个简单的 Makefile 自动构建项目：

```makefile
# 文件名：Makefile
hello: hello.c
	gcc hello.c -o hello
```

然后在终端运行：

```bash
make
```

---

## ✍️ 总结流程图：

```
编写 -> 编译 -> 运行
hello.c → gcc → hello → ./hello
```

---
```c
[[include]] <stdio.h>
[[include]] <unistd.h>
[[include]] <sys/types.h>
[[include]] <sys/wait.h>

int main() {
    pid_t pid1, pid2;

    // 创建第一个子进程
    pid1 = fork();

    if (pid1 == 0) { // 子进程1
       
		printf("A\n");
    } 
    else {
        // 创建第二个子进程
        pid2 = fork();

        
        if (pid2 == 0) { // 子进程2
            printf("B\n");
        } 
        else {
            // 父进程
            wait(NULL); // 等待子进程1
            wait(NULL); // 等待子进程2
            printf("C\n");
        }
    }

    return 0;
}

```