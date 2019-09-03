---
sidebarDepth: 0
---

## Spring Boot - ORM Mybatis

> 国内使用MyBatis还是挺多的，本例展示通过注解方式连接MyBatis。@pdai

> 注意下MySQL版本和SpringBoot默认使用mysql driver的差异：SpringBoot2中默认使用MySQl8的版本，driver不一样。

### 学习MyBatis的路线

+ 了解ORM和iBatis

+ 基于xml配置方式的MyBatis

+ 基于注解配置方式的MyBatis

+ MyBatis 多表关联

+ MyBatis 多数据源

+ MyBatis 分页，方言

+ MyBatis Code Generator

+ MyBatis Plus + IDEA 插件

+ MyBatis 原理和基本组件

+ MyBatis 源码

> 更加推荐JPA，但是MyBatis原理和源码值得一读，请参考ORM MyBatis源码解读。


### Demo

+ 创建shema - mybatis-demo

+ 创建表

```sql
DROP TABLE IF EXISTS `mybatis-demo`.`users`;
CREATE TABLE `users` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `userName` varchar(32) DEFAULT NULL COMMENT '用户名',
  `passWord` varchar(32) DEFAULT NULL COMMENT '密码',
  `user_sex` varchar(32) DEFAULT NULL,
  `nick_name` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8;
```

+ 创建应用

![](/_images/spring/springboot-mybatis-1.png)

+ App入口

```java
@SpringBootApplication
@MapperScan("com.pdai.springboot.mybatis.mapper")
@EnableSwaggerBootstrapUI
public class SpringbootMybatisApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringbootMybatisApplication.class, args);
    }

}
```

+ User

```java
package com.pdai.springboot.mybatis.entity;

import java.io.Serializable;

public class User implements Serializable {

    private static final long serialVersionUID = 1L;
    private Long id;
    private String userName;
    private String passWord;
    private UserSexEnum userSex;
    private String nickName;

    public User() {
        super();
    }

    public User(String userName, String passWord, UserSexEnum userSex) {
        super();
        this.passWord = passWord;
        this.userName = userName;
        this.userSex = userSex;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassWord() {
        return passWord;
    }

    public void setPassWord(String passWord) {
        this.passWord = passWord;
    }

    public UserSexEnum getUserSex() {
        return userSex;
    }

    public void setUserSex(UserSexEnum userSex) {
        this.userSex = userSex;
    }

    public String getNickName() {
        return nickName;
    }

    public void setNickName(String nickName) {
        this.nickName = nickName;
    }

    @Override
    public String toString() {
        // TODO Auto-generated method stub
        return "userName " + this.userName + ", pasword " + this.passWord + "sex " + userSex.name();
    }

}
```

+ Mappper

```java
package com.pdai.springboot.mybatis.mapper;

import com.pdai.springboot.mybatis.entity.User;
import com.pdai.springboot.mybatis.entity.UserSexEnum;
import org.apache.ibatis.annotations.*;

import java.util.List;

public interface UserMapper {

    @Select("SELECT * FROM users")
    @Results({
            @Result(property = "userSex",  column = "user_sex", javaType = UserSexEnum.class),
            @Result(property = "nickName", column = "nick_name")
    })
    List<User> getAll();

    @Select("SELECT * FROM users WHERE id = #{id}")
    @Results({
            @Result(property = "userSex",  column = "user_sex", javaType = UserSexEnum.class),
            @Result(property = "nickName", column = "nick_name")
    })
    User getOne(Long id);

    @Insert("INSERT INTO users(userName,passWord,user_sex) VALUES(#{userName}, #{passWord}, #{userSex})")
    void insert(User user);

    @Update("UPDATE users SET userName=#{userName},nick_name=#{nickName} WHERE id =#{id}")
    void update(User user);

    @Delete("DELETE FROM users WHERE id =#{id}")
    void delete(Long id);

}
```

+ Controller

```java
package com.pdai.springboot.mybatis.controller;

import com.pdai.springboot.mybatis.entity.User;
import com.pdai.springboot.mybatis.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class UserController {

    @Autowired
    private UserMapper userMapper;

    @RequestMapping("/getUsers")
    public List<User> getUsers() {
        List<User> users=userMapper.getAll();
        return users;
    }

    @RequestMapping("/getUser")
    public User getUser(Long id) {
        User user=userMapper.getOne(id);
        return user;
    }

    @RequestMapping("/add")
    public void save(User user) {
        userMapper.insert(user);
    }

    @RequestMapping(value="update")
    public void update(User user) {
        userMapper.update(user);
    }

    @RequestMapping(value="/delete/{id}")
    public void delete(@PathVariable("id") Long id) {
        userMapper.delete(id);
    }

}
```


## 示例源码

https://github.com/ityouknow/spring-boot-examples/tree/master/spring-boot-mybatis

