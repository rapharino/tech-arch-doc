## Java 8 - 重复注解

> 理解Java 8 重复注解需理解几个问题：----@pdai
> + Jdk8之前对重复注解是怎么做的？
> + Jdk8对重复注解添加了什么支持？

### 什么是重复注解

允许在同一申明类型（类，属性，或方法）的多次使用同一个注解

#### JDK8之前
java 8之前也有重复使用注解的解决方案，但可读性不是很好，比如下面的代码：

```
public @interface Authority {
     String role();
}

public @interface Authorities {
    Authority[] value();
}

public class RepeatAnnotationUseOldVersion {

    @Authorities({@Authority(role="Admin"),@Authority(role="Manager")})
    public void doSomeThing(){
    }
}
```

由另一个注解来存储重复注解，在使用时候，用存储注解Authorities来扩展重复注解。

#### Jdk8重复注解

我们再来看看java 8里面的做法：

```java
@Repeatable(Authorities.class)
public @interface Authority {
     String role();
}

public @interface Authorities {
    Authority[] value();
}

public class RepeatAnnotationUseNewVersion {
    @Authority(role="Admin")
    @Authority(role="Manager")
    public void doSomeThing(){ }
}
```

不同的地方是，创建重复注解Authority时，加上@Repeatable,指向存储注解Authorities，在使用时候，直接可以重复使用Authority注解。从上面例子看出，java 8里面做法更适合常规的思维，可读性强一点


### 总结

JEP120没有太多内容，是一个小特性，仅仅是为了提高代码可读性。这次java 8对注解做了2个方面的改进（JEP 104,JEP120），相信注解会比以前使用得更加频繁了。