## Spring Boot - 使用第三方Jar
!> 在项目中我们经常需要使用第三方的Jar,出现这种情况的原因在于，即便我们有Nexus或者其他Artifactory. @pdai

!> 注意：在Springboot+JavaFx中，引入第三方jar并编译成可执行文件，方式上有差别。

### 方案一
#### 本地编译
> 本地编译只是表示能够让IDE解析Jar, 不出现红叉；

![](/_images/1490167490125_Capture.png)

#### Maven编译
> 需要告诉Maven编译的插件，指定当前的项目编译所依赖的Jars.

```xml
<plugin>
    <artifactId>maven-compiler-plugin</artifactId>
        <configuration>
            <source>1.8</source>
            <target>1.8</target>
            <encoding>UTF-8</encoding>
            <compilerArguments>
            <extdirs>${basedir}/libs</extdirs>
        </compilerArguments>
    </configuration>
</plugin>
```

#### Spring Boot Jar run
> 你以为这么就能让Spring boot 打出的Jar直接运行了？ 其实并没有，Maven编译和运行依赖Jar是两码事, 所以还需要指定Spring Boot中运行所需要的jar依赖（resources）

```xml
<resources>
    <resource>
        <filtering>true</filtering>
        <directory>${basedir}/src/main/resources</directory>
        <includes>
            <include>**/application*.yml</include>
            <include>**/application*.properties</include>
        </includes>
    </resource>
    <resource>
        <directory>${basedir}/src/main/resources</directory>
        <excludes>
            <exclude>**/application*.yml</exclude>
            <exclude>**/application*.properties</exclude>
        </excludes>
    </resource>
    <resource>
        <directory>src/main/resources</directory>
        <targetPath>BOOT-INF/lib/</targetPath>
        <includes>
            <include>**/*.jar</include>
        </includes>
    </resource>
</resources>
```

### 方案二
使用systemPath属性，`<scope>system</scope>`, 其它gav三元组是可以随意填写的。
```xml
<dependency>
    <groupId>com.aliyun</groupId>
    <artifactId>taobao-sdk-java</artifactId>
    <version>1.0.0</version>
    <scope>system</scope>
    <systemPath>${project.basedir}/libs/taobao-sdk-java-auto_1479188381469-20180831.jar</systemPath>
</dependency>
```

springboot在打包的时候，调用spring-boot-maven-plugin，执行repackage把tomcat和resource，lib等合成一个新的jar。想要将系统jar打进去，必须配置includeSystemScope。最终会将lib放入BOOT-INF\lib
```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
            <configuration>
                <includeSystemScope>true</includeSystemScope>
            </configuration>
            <executions>
                <execution>
                    <goals>
                        <goal>build-info</goal>
                        <goal>repackage</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```