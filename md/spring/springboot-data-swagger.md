## Spring Boot - Swagger UI

> 本例也是一个Spring Boot的Hello World 应用。@pdai
> 包含, 对用户基本数据增删查改：
> + SpringBoot
> + JPA
> + H2
> + Swagger


> 另外注意：使用swagger还有插件来生成一个wiki页面，使用如下：
> + 使用swagger2markup-maven-plugin将/v2/api-docs生成ASCIIDOC；
> + 使用asciidoctor-maven-plugin，将ASCIIDOC转成HTML页面；


### 实现效果

接口描述

![](/_images/spring/springboot-swagger-1.png)

接口调试

![](/_images/spring/springboot-swagger-2.png)

模型展示

![](/_images/spring/springboot-swagger-3.png)

### 代码
+ pom.xml中添加Swagger-ui

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>

	<groupId>com.pdai</groupId>
	<artifactId>springboot-swagger-demo</artifactId>
	<version>0.0.1-SNAPSHOT</version>
	<packaging>jar</packaging>

	<name>springboot-swagger-demo</name>
	<url>http://maven.apache.org</url>

	<parent>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-parent</artifactId>
		<version>1.5.9.RELEASE</version>
		<relativePath />
	</parent>

	<properties>
		<project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
		<project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
		<java.version>1.8</java.version>
	</properties>

	<dependencies>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-web</artifactId>
		</dependency>
		<dependency>
			<groupId>com.h2database</groupId>
			<artifactId>h2</artifactId>
			<scope>runtime</scope>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-data-jpa</artifactId>
		</dependency>

		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-test</artifactId>
			<scope>test</scope>
		</dependency>
		<dependency>
			<groupId>io.springfox</groupId>
			<artifactId>springfox-swagger2</artifactId>
			<version>2.9.2</version>
		</dependency>
		<!-- 
		<dependency> 
			<groupId>io.springfox</groupId>
			<artifactId>springfox-swagger-ui</artifactId> 
			<version>2.9.2</version> 
		</dependency> -->
		
		<!-- https://mvnrepository.com/artifact/com.github.xiaoymin/swagger-bootstrap-ui -->
		<dependency>
			<groupId>com.github.xiaoymin</groupId>
			<artifactId>swagger-bootstrap-ui</artifactId>
			<version>1.9.5</version>
		</dependency>

	</dependencies>

	<build>
		<plugins>
			<plugin>
				<groupId>org.springframework.boot</groupId>
				<artifactId>spring-boot-maven-plugin</artifactId>
			</plugin>
		</plugins>
	</build>
</project>
```


+ swaggerConfig

```java
package com.pdai.swagger.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@Configuration
@EnableSwagger2
public class SwaggerConfig {

	@Bean
	public Docket createRestApi() {
		return new Docket(DocumentationType.SWAGGER_2).apiInfo(apiInfo()).select()
				.apis(RequestHandlerSelectors.basePackage("com.pdai.swagger")).paths(PathSelectors.any()).build();
	}

	private ApiInfo apiInfo() {
		return new ApiInfoBuilder().title("Pdai's API").description("swagger-bootstrap-ui")
				.termsOfServiceUrl("http://localhost:8080/").version("1.0").build();
	}
}
```

+ application.yml

```json
spring:
  datasource:
    data: classpath:db/data.sql
    driverClassName: org.h2.Driver
    password: sa
    platform: h2
    schema: classpath:db/schema.sql
    url: jdbc:h2:mem:dbtest
    username: sa
  h2:
    console:
      enabled: true
      path: /h2
      settings:
        web-allow-others: true
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
```

+ 对应SQL文件如下

data.sql

```sql
INSERT INTO tb_user (USER_ID,USER_NAME) VALUES(1,'赵一');
```

schema.sql

```sql
create table if not exists tb_user (
USER_ID int not null primary key auto_increment,
USER_NAME varchar(100)
);
```

+ Service, Dao, Entity

略

### 代码示例

@See https://github.com/realpdai/springboot-swagger-demo
