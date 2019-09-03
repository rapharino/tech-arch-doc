## Spring Boot - 实现API限流

> 高并发的三板斧：缓存，降级和限流。本文只是关于限流的一个Demo，限流可以有很多方式，具体可以看分布式限流的章节。@pdai

> 注意：
+ RateLimiter只是针对单机方案限流；
+ 分布式通常可以通过Redis+Lua+AOP方案；此方案源码参考：https://github.com/realpdai/springboot-limit-demo
+ 本例子考虑落地，采用一个别人开源的小框架，参考原文：https://www.ctolib.com/forezp-DistributedLimit.html

### 项目目的
> 这个项目是一个Api限流的解决方案，采用的是令牌桶的方式。如果使用的Redis则是分布式限流，如果采用guava的LimitRater，则是本地限流。 分2给维度限流，一个是用户维度，一个Api维度，读者可自定义。仅支持Spring Boot项目。

### 如何使用
在boot-example工程，有完整的案例。可在Controller上限流，也可以在SpringMvc的Interceptor或者Servlet的Filter上限流。

#### 开启限流
在pom文件加上jar包：

```xml
<dependency>
  <groupId>io.github.forezp</groupId>
  <artifactId>distributed-limit-core</artifactId>
  <version>1.0.4</version>
</dependency>
```

有2中方式，本地限流，只需要配置limit.type=local；采用Redis限流，配置limit.type=redis，以及redis的配置，如下：

```json
#limit.type: local
limit.type: redis

spring:
  redis:
    host: localhost
    port: 6379
#    password: ee
    database: 1
    pool:
      max-active: 8
      max-wait: -1
      max-idle: 500
      min-idle: 0
    timeout: 0
```

#### Controller上使用，基于注解、AOP
在Controller上加 @Limit注解，其中identifier为识别身份的，key为限流的key,limtNum为限制的次数，seconds为多少秒，后2个配置的作用是在多少秒最大的请求次数 。其中identifier和key支持Spel表达式。如果仅API纬度，则identifier 为空即可；如果仅用户纬度，key为空即可。

```java
@RestController
public class TestController {

    @GetMapping("/test")
    @Limit(identifier = "forezp", key = "test", limtNum = 10, seconds = 1)
    public String Test() {
        return "11";
    }
}
```

仅次操作就可以限流了。

另外如果是以注解的形式进行限流，如果以identifier即请求用户维度去限流，可以动态的设置的identifier的值，示例如下：


```java
@Component
public class IndentifierInterceptor extends HandlerInterceptorAdapter {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        //获取用户的信息，比如解析Token获取用户名，
        // 这么做主要是在基于@Limit注解在Controller的时候，能都动态设置identifier信息
        // 从而以用户维度进行限流
        String identifier = "forezp";
        IdentifierThreadLocal.set( identifier );
        return true;
    }

}
```

#### 在Web层的Interceptor、Filter上使用
直接贴代码了，比较简单。

```java
@Component
public class WebInterceptor extends HandlerInterceptorAdapter {

    private Map<String, LimitEntity> limitEntityMap = Maps.newConcurrentMap();

    @Autowired
    LimitExcutor limitExcutor;

    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        //限流2个维度： 用户和api维度
        //比如用户名
        String identifier = "forezp";
        //api维度
        String key = request.getRequestURI();
        String composeKey = KeyUtil.compositeKey( identifier, key );
        LimitEntity limitEntity = limitEntityMap.get( composeKey );
        if (limitEntity == null) {
            limitEntity = new LimitEntity();
            limitEntity.setIdentifier( identifier );
            limitEntity.setKey( key );
            //这可以在数据库中配置或者缓存中读取，在这里我写死
            limitEntity.setSeconds( 1 );
            limitEntity.setLimtNum( 10 );
            limitEntityMap.putIfAbsent( composeKey, limitEntity );
        }
        if (!limitExcutor.tryAccess( limitEntity )) {
            throw new LimitException( "you fail access, cause api limit rate ,try it later" );
        }

        return true;
    }
}
```

注册一下Interceptor：

```java
@Configuration
public class WebConfig extends WebMvcConfigurerAdapter {

    @Autowired
    IndentifierInterceptor indentifierInterceptor;

    @Autowired
    WebInterceptor webInterceptor;

    /**
     * 注册 拦截器
     */
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor( indentifierInterceptor );
        registry.addInterceptor( webInterceptor );
    }

}
```



