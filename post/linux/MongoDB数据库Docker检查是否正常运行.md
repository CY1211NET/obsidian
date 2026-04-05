---
title: MongoDB数据库Docker检查是否正常运行
date: 2025-11-16T00:00:00+08:00
lastmod: 2025-11-16T00:00:00+08:00
author: Crain
email: y252840@163.com
tags:
  - "Docker"
  - "MongoDB"
  - "Linux"
---

---

## ✅ 1. **查看容器是否在运行**

```bash
docker ps | grep mongo
```

确保你能看到 MongoDB 容器，并且状态是 `Up`。

---

## ✅ 2. **进入容器查看 MongoDB 日志**

```bash
docker logs <mongo容器名或ID> --tail 100
```

看是否有类似 `waiting for connections on port 27017` 的提示，说明 MongoDB 启动正常并正在监听连接。

---

## ✅ 3. **进入容器内部测试连接**

```bash
docker exec -it <mongo容器名或ID> mongosh
```

进入 Mongo shell 后执行：

```javascript
db.stats()
```

输出应该包含 `collections`, `objects`, `ok: 1` 等字段，表示数据库工作正常。

---

## ✅ 4. **在宿主机测试访问 MongoDB**

如果你的 Java 项目部署在宿主机或其他容器，需要确保能连接 MongoDB：

```bash
telnet 127.0.0.1 27017
# 或者
nc -zv 127.0.0.1 27017
```

如果你设置了 Docker 网络，记得使用容器的桥接地址或自定义网络名称连接。

---

## ✅ 5. **使用 Spring Boot 检查连接**

如果你的项目配置了 Spring Boot 连接 MongoDB，你可以在 Java 项目启动日志中看到类似：

```
Connected to MongoDB at mongodb://...
```

或者在服务中调用以下代码测试：

```java
@Autowired
MongoTemplate mongoTemplate;

public boolean isMongoAlive() {
    try {
        mongoTemplate.getDb().runCommand(new Document("ping", 1));
        return true;
    } catch (Exception e) {
        return false;
    }
}
```


