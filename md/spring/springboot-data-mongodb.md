## Spring Boot - MongoDB CRUD
> 本例展示一个Mongo CURD 的Demo, 由于我在[springboot多数据源](md/spring/springboot-data-multi.md)示例中已经使用了JPA形式的MongoRepository，所以在这个例子中我将只展示使用MongoTemplate（MongoOptions）方式。 @pdai

### 注意事项

+ MongoDB 可以直接使用java mongo.jar，也可以使用spring data封装的，还可以直接使用Springboot starter自动配置；在写代码时，你可以直接调用原生的接口，也可以调用MongoTemplate（MongoOptions）, 还可以调用JPA形式的MongoRepository类；

### 简单示例相关代码
+ Pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.pdai</groupId>
    <artifactId>springboot-mongodb-demo</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <packaging>jar</packaging>

    <name>springboot-mongodb-demo</name>
    <description>springboot-mongodb-demo CRUD</description>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>1.5.10.RELEASE</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
        <java.version>1.8</java.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-mongodb</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>fastjson</artifactId>
            <version>1.2.4</version>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-surefire-plugin</artifactId>
                <configuration>
                    <skip>true</skip>
                    <testFailureIgnore>true</testFailureIgnore>
                </configuration>
            </plugin>
        </plugins>
    </build>

</project>
```

+ application.yml

```json
spring:
  application:
    name: springboot-mongodb-demo
  data:
    mongodb:
      uri: mongodb://192.168.252.121:20000,192.168.252.122:20000,192.168.252.12:20000/demo
```

+ Entity

```java

```

+ Dao

```java
package com.pdai.springboot.mongodb.dao;

import com.pdai.springboot.mongodb.entity.DemoEntity;

public interface DemoDao {

    void saveDemo(DemoEntity demoEntity);

    void removeDemo(Long id);

    void updateDemo(DemoEntity demoEntity);

    DemoEntity findDemoById(Long id);
}
```

+ DaoImpl

```java
package com.pdai.springboot.mongodb.dao;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Component;

import com.pdai.springboot.mongodb.entity.DemoEntity;

import javax.annotation.Resource;

@Component
public class DemoDaoImpl implements DemoDao {

	@Resource
	private MongoTemplate mongoTemplate;

	@Override
	public void saveDemo(DemoEntity demoEntity) {
		mongoTemplate.save(demoEntity);
	}

	@Override
	public void removeDemo(Long id) {
		mongoTemplate.remove(id);
	}

	@Override
	public void updateDemo(DemoEntity demoEntity) {
		Query query = new Query(Criteria.where("id").is(demoEntity.getId()));

		Update update = new Update();
		update.set("title", demoEntity.getTitle());
		update.set("description", demoEntity.getDescription());
		update.set("by", demoEntity.getBy());
		update.set("url", demoEntity.getUrl());

		mongoTemplate.updateFirst(query, update, DemoEntity.class);
	}

	@Override
	public DemoEntity findDemoById(Long id) {
		Query query = new Query(Criteria.where("id").is(id));
		DemoEntity demoEntity = mongoTemplate.findOne(query, DemoEntity.class);
		return demoEntity;
	}

}
```

+ app

```java
package com.pdai.springboot.mongodb;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {
	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}
}
```





### 示例代码


@See https://github.com/realpdai/springboot-data-mongo-demo

