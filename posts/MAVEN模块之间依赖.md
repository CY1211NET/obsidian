---
title: 模块之间相互引入依赖
date: '2025-11-16 00:00:00+08:00'
updated: '2025-11-26 00:00:00+08:00'
category: 项目开发
tags:
- Maven
- Spring Boot
draft: false
author: Crain
---
在多个模块之间引入相互依赖时，通常是在微服务架构、模块化设计或多模块项目中使用。以下是一些常见的做法，用于管理模块间的依赖关系。

### 1. **在多模块的 Spring Boot 项目中引入模块依赖**

假设你有多个模块，如 `module-a` 和 `module-b`，你希望 `module-a` 使用 `module-b` 的功能。

#### a. **使用 Maven 或 Gradle 管理模块依赖**

##### Maven 示例：

如果你使用 Maven 来管理多模块项目，你需要在父级 `pom.xml` 中定义模块，并在子模块之间声明依赖。

- **父级 POM (`pom.xml`)：**
    

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.chenyu</groupId>
    <artifactId>multi-module-demo</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>pom</packaging>

    <modules>
        <module>module-a</module>
        <module>module-b</module>
    </modules>
</project>
```

- **子模块 A (`module-a/pom.xml`)：**
    

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>com.chenyu</groupId>
        <artifactId>multi-module-demo</artifactId>
        <version>1.0-SNAPSHOT</version>
        <relativePath>../pom.xml</relativePath> <!-- 这行指定了父级 POM 文件的位置 -->
    </parent>

    <artifactId>module-a</artifactId>

    <dependencies>
        <dependency>
            <groupId>com.chenyu</groupId>
            <artifactId>module-b</artifactId>
            <version>1.0-SNAPSHOT</version> <!-- 确保版本号正确 -->
        </dependency>
    </dependencies>
</project>
```

- **子模块 B (`module-b/pom.xml`)：**
    

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>com.chenyu</groupId>
        <artifactId>multi-module-demo</artifactId>
        <version>1.0-SNAPSHOT</version>
        <relativePath>../pom.xml</relativePath> <!-- 这行指定了父级 POM 文件的位置 -->
    </parent>

    <artifactId>module-b</artifactId>
</project>
```

这样，`module-a` 就可以使用 `module-b` 中的类和方法了。Maven 会处理模块间的依赖关系。

##### Gradle 示例：

如果你使用 Gradle 来管理多模块项目，首先在根目录的 `settings.gradle` 文件中列出所有模块：

- **`settings.gradle` 文件：**
    

```groovy
include 'module-a', 'module-b'
```

然后，在子模块 A 的 `build.gradle` 文件中添加对模块 B 的依赖：

- **`module-a/build.gradle` 文件：**
    

```groovy
dependencies {
    implementation project(':module-b') // 引入 module-b 作为依赖
}
```

- **`module-b/build.gradle` 文件：**
    

```groovy
dependencies {
    // 这里可以根据需要添加其他依赖
}
```

### 2. **Spring Boot 中的模块依赖关系**

在 Spring Boot 项目中，模块之间通常通过 **Spring Bean** 进行依赖注入，或者通过 **Java 类库** 的形式直接引用。

#### a. **模块 A 引用模块 B 的服务或组件**

假设你有两个模块：`module-a` 和 `module-b`，你希望在 `module-a` 中调用 `module-b` 提供的服务或功能。可以通过以下方式实现：

1. **在 `module-b` 中定义一个服务：**
    
    `module-b/src/main/java/com/chenyu/moduleb/ServiceB.java`
    
    ```java
    @Service
    public class ServiceB {
        public String getData() {
            return "数据来自 module-b";
        }
    }
    ```
    
2. **在 `module-a` 中引用 `module-b` 的服务：**
    
    `module-a/src/main/java/com/chenyu/modulea/ControllerA.java`
    
    ```java
    @RestController
    @RequestMapping("/api/a")
    public class ControllerA {
    
        private final ServiceB serviceB;
    
        @Autowired
        public ControllerA(ServiceB serviceB) {
            this.serviceB = serviceB;
        }
    
        @GetMapping("/getData")
        public String getData() {
            return serviceB.getData();  // 调用 module-b 中的服务
        }
    }
    ```
    
3. **确保 `module-a` 引入了 `module-b` 的依赖：**
    
    在 `module-a/pom.xml` 中添加：
    
    ```xml
    <dependency>
        <groupId>com.chenyu</groupId>
        <artifactId>module-b</artifactId>
        <version>1.0-SNAPSHOT</version>
    </dependency>
    ```
    

### 3. **模块间的自定义配置**

在一些复杂的应用中，你可能希望不同模块的配置互相依赖。例如，模块 A 和模块 B 可能有共享配置。可以使用 Spring 的 **`@Configuration`** 类和 **`@Import`** 注解来引入另一个模块的配置。

- **模块 A 引入模块 B 的配置类：**
    

```java
@Configuration
@Import(ModuleBConfig.class) // 引入模块 B 的配置类
public class ModuleAConfig {
    // A模块的配置
}
```

### 4. **避免循环依赖**

在模块间引入相互依赖时，可能会发生循环依赖的情况，尤其是在使用依赖注入（如 Spring）时。例如，`module-a` 依赖于 `module-b`，而 `module-b` 又依赖于 `module-a`。

为避免循环依赖，通常有以下几种解决办法：

- **使用接口和实现类解耦：** 将依赖关系通过接口和实现类分离，避免直接引用。
    
- **懒加载（Lazy Injection）：** 使用 Spring 的 `@Lazy` 注解来懒加载某些依赖。
    
- **重新设计模块结构：** 如果循环依赖是不可避免的，可能需要重新设计系统架构，将功能进行更合理的拆分。
    

### 总结

- 使用 **Maven** 或 **Gradle** 来管理多模块依赖。
    
- 通过 **`@Autowired`** 和 **Spring Bean** 实现模块间的依赖注入。
    
- 设计时要避免 **循环依赖**，可以使用接口解耦或者懒加载。