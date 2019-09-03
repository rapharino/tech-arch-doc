## Spring Boot - Logback配置日志
> 出于性能等原因，Logback 目前是springboot应用日志的标配； 当然有时候在生产环境中也会考虑和三方中间件采用统一处理方式。@pdai

### 配置时考虑点

+ 支持日志路径，日志level等配置
+ 日志控制配置通过application.yml下发
+ 按天生成日志，当天的日志>50MB回滚
+ 最多保存10天日志
+ 生成的日志中Pattern自定义
+ Pattern中添加用户自定义的MDC字段，比如用户信息（当前日志是由哪个用户的请求产生），request信息。此种方式可以通过AOP切面控制，在MDC中添加requestID，在spring-logback.xml中配置Pattern。
+ 根据不同的运行环境设置Profile - dev，test，product
+ 对控制台，Err和全量日志分别配置
+ 对第三方包路径日志控制


### 实现范例
> 如下两个例子基本包含了上述的考虑点：

#### 综合范例
+ application.yml

```json
logging:
  level:
    root: debug
  path: C:/data/logs/springboot-logback-demo
server:
  port: 8080
spring:
  application:
    name: springboot-logback-demo
debug: false
```
+ Spring-logback.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>

    <!-- 日志根目录-->
    <springProperty scope="context" name="LOG_HOME" source="logging.path" defaultValue="/data/logs/springboot-logback-demo"/>

    <!-- 日志级别 -->
    <springProperty scope="context" name="LOG_ROOT_LEVEL" source="logging.level.root" defaultValue="DEBUG"/>

    <!--  标识这个"STDOUT" 将会添加到这个logger -->
    <springProperty scope="context" name="STDOUT" source="log.stdout" defaultValue="STDOUT"/>

    <!-- 日志文件名称-->
    <property name="LOG_PREFIX" value="spring-boot-logback" />

    <!-- 日志文件编码-->
    <property name="LOG_CHARSET" value="UTF-8" />

    <!-- 日志文件路径+日期-->
    <property name="LOG_DIR" value="${LOG_HOME}/%d{yyyyMMdd}" />

    <!--对日志进行格式化-->
    <property name="LOG_MSG" value="- | [%X{requestUUID}] | [%d{yyyyMMdd HH:mm:ss.SSS}] | [%level] | [${HOSTNAME}] | [%thread] | [%logger{36}] | --> %msg|%n "/>

    <!--文件大小，默认10MB-->
    <property name="MAX_FILE_SIZE" value="50MB" />

    <!-- 配置日志的滚动时间 ，表示只保留最近 10 天的日志-->
    <property name="MAX_HISTORY" value="10"/>

    <!--输出到控制台-->
    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <!-- 输出的日志内容格式化-->
        <layout class="ch.qos.logback.classic.PatternLayout">
            <pattern>${LOG_MSG}</pattern>
        </layout>
    </appender>

    <!--输出到文件-->
    <appender name="0" class="ch.qos.logback.core.rolling.RollingFileAppender">
    </appender>

    <!-- 定义 ALL 日志的输出方式:-->
    <appender name="FILE_ALL" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <!--日志文件路径，日志文件名称-->
        <File>${LOG_HOME}/all_${LOG_PREFIX}.log</File>

        <!-- 设置滚动策略，当天的日志大小超过 ${MAX_FILE_SIZE} 文件大小时候，新的内容写入新的文件， 默认10MB -->
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">

            <!--日志文件路径，新的 ALL 日志文件名称，“ i ” 是个变量 -->
            <FileNamePattern>${LOG_DIR}/all_${LOG_PREFIX}%i.log</FileNamePattern>

            <!-- 配置日志的滚动时间 ，表示只保留最近 10 天的日志-->
            <MaxHistory>${MAX_HISTORY}</MaxHistory>

            <!--当天的日志大小超过 ${MAX_FILE_SIZE} 文件大小时候，新的内容写入新的文件， 默认10MB-->
            <timeBasedFileNamingAndTriggeringPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedFNATP">
                <maxFileSize>${MAX_FILE_SIZE}</maxFileSize>
            </timeBasedFileNamingAndTriggeringPolicy>

        </rollingPolicy>

        <!-- 输出的日志内容格式化-->
        <layout class="ch.qos.logback.classic.PatternLayout">
            <pattern>${LOG_MSG}</pattern>
        </layout>
    </appender>

    <!-- 定义 ERROR 日志的输出方式:-->
    <appender name="FILE_ERROR" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <!-- 下面为配置只输出error级别的日志 -->
        <filter class="ch.qos.logback.classic.filter.LevelFilter">
            <level>ERROR</level>
            <OnMismatch>DENY</OnMismatch>
            <OnMatch>ACCEPT</OnMatch>
        </filter>
        <!--日志文件路径，日志文件名称-->
        <File>${LOG_HOME}/err_${LOG_PREFIX}.log</File>

        <!-- 设置滚动策略，当天的日志大小超过 ${MAX_FILE_SIZE} 文件大小时候，新的内容写入新的文件， 默认10MB -->
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">

            <!--日志文件路径，新的 ERR 日志文件名称，“ i ” 是个变量 -->
            <FileNamePattern>${LOG_DIR}/err_${LOG_PREFIX}%i.log</FileNamePattern>

            <!-- 配置日志的滚动时间 ，表示只保留最近 10 天的日志-->
            <MaxHistory>${MAX_HISTORY}</MaxHistory>

            <!--当天的日志大小超过 ${MAX_FILE_SIZE} 文件大小时候，新的内容写入新的文件， 默认10MB-->
            <timeBasedFileNamingAndTriggeringPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedFNATP">
                <maxFileSize>${MAX_FILE_SIZE}</maxFileSize>
            </timeBasedFileNamingAndTriggeringPolicy>
        </rollingPolicy>

        <!-- 输出的日志内容格式化-->
        <layout class="ch.qos.logback.classic.PatternLayout">
            <Pattern>${LOG_MSG}</Pattern>
        </layout>
    </appender>

    <!-- additivity 设为false,则logger内容不附加至root ，配置以配置包下的所有类的日志的打印，级别是 ERROR-->
    <logger name="org.springframework"     level="ERROR" />
    <logger name="org.apache.commons"      level="ERROR" />
    <logger name="org.apache.zookeeper"    level="ERROR"  />
    <logger name="com.alibaba.dubbo.monitor" level="ERROR"/>
    <logger name="com.alibaba.dubbo.remoting" level="ERROR" />

    <!-- ${LOG_ROOT_LEVEL} 日志级别 -->
    <root level="${LOG_ROOT_LEVEL}">

        <!-- 标识这个"${STDOUT}"将会添加到这个logger -->
        <appender-ref ref="${STDOUT}"/>

        <!-- FILE_ALL 日志输出添加到 logger -->
        <appender-ref ref="FILE_ALL"/>

        <!-- FILE_ERROR 日志输出添加到 logger -->
        <appender-ref ref="FILE_ERROR"/>
    </root>

</configuration>
```

Profile 相关的配置可以参考：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <include resource="org/springframework/boot/logging/logback/base.xml" />
    
     <!-- roll by day -->
     <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">   
    	<rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">   
      		<fileNamePattern>logs/springboot-logback-demo.%d{yyyy-MM-dd}.log</fileNamePattern>   
      		<maxHistory>30</maxHistory>  
    	</rollingPolicy>   
    	<encoder>   
      		<pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{35} - %msg%n</pattern>   
    	</encoder>  
  	</appender> 
   
    <!-- dev -->
	<logger name="org.springframework.web" level="INFO"/>
		<root level="INFO">
		<appender-ref ref="FILE" />
	</root>

    <!-- test or production -->
    <springProfile name="test,prod">
        <logger name="org.springframework.web" level="INFO"/>
        <logger name="com.pdai.springboot" level="INFO"/>
        <root level="INFO">
        	<appender-ref ref="FILE" />
        </root>
    </springProfile>
  	 
</configuration>
```

#### 在配置前可以参考如下文章

https://www.cnblogs.com/warking/p/5710303.html



### 參考文档

+ Logback官网

https://logback.qos.ch/manual/layouts.html#conversionWord

+ Logback官网 文档

https://logback.qos.ch/manual/index.html

+ Logback中Encoder Pattern

```xml
<encoder>
	<pattern>%d{HH:mm:ss} [%thread][%X{traceId}] %-5level %logger{36} - %msg%n</pattern>
</encoder>
```

https://logback.qos.ch/manual/layouts.html#conversionWord

### 代码示例

@See https://github.com/realpdai/springboot-logback-demo