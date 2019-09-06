## Maven项目的目录结构
> 在Java开发中，常用构建工具ant,maven和gradle, 其中maven相对主流；本文参考和总结自 http://blog.csdn.net/luanlouis/article/details/50492163, 对maven的理解看这一篇就够。@pDai

### 目录结构

> well,每个项目工程，都有非常繁琐的目录结构，每个目录都有不同的作用。请记住这一点，目录的划分是根据需要来的，每个目录有其特定的功能。目录本质上就是一个文件或文件夹路径而已。那么，我们换一个思路考虑：一个项目的文件结构需要组织什么信息呢？

让我们来看一下功能的划分：

![](/_images/maven_0.jpg)

### 如何修改默认的目录配置
在maven项目工程对应project的 pom.xml中，在`<project>--><build>`节点下，你可以指定自己的目录路径信息：
```xml
<build>  
    <!-- 目录信息维护,用户可以指定自己的目录路径 -->  
    <sourceDirectory>E:\intellis\maven-principle\phase-echo\src\main\java</sourceDirectory>  
    <scriptSourceDirectory>E:\intellis\maven-principle\phase-echo\src\main\scripts</scriptSourceDirectory>  
    <testSourceDirectory>E:\intellis\maven-principle\phase-echo\src\test\java</testSourceDirectory>  
    <outputDirectory>E:\intellis\maven-principle\phase-echo\target\classes</outputDirectory>  
    <testOutputDirectory>E:\intellis\maven-principle\phase-echo\target\test-classes</testOutputDirectory>  
  
    <!-- 注意，对resource而言，可以有很多个resource路径的配置，你只需要指定对应的路径是resource即可 -->  
    <resources>  
      <resource>  
        <directory>E:\intellis\maven-principle\phase-echo\src\main\resources</directory>  
      </resource>  
    </resources>  
  
    <!-- 注意，对resource而言，可以有很多个resource路径的配置，你只需要指定对应的路径是resource即可 -->  
    <testResources>  
      <testResource>  
        <directory>E:\intellis\maven-principle\phase-echo\src\test\resources</directory>  
      </testResource>  
    </testResources>  
  
    <directory>E:\intellis\maven-principle\phase-echo\target</directory>  
   
</build>
```

### 依赖原则

#### 依赖路径最短优先原则

```html
A -> B -> C -> X(1.0)
A -> D -> X(2.0)
```
由于 X(2.0) 路径最短，所以使用 X(2.0)。

#### 声明顺序优先原则

```html
A -> B -> X(1.0)
A -> C -> X(2.0)
```

在 POM 中最先声明的优先，上面的两个依赖如果先声明 B，那么最后使用 X(1.0)。

#### 覆写优先原则

子 POM 内声明的依赖优先于父 POM 中声明的依赖。

### 解决依赖冲突

找到 Maven 加载的 Jar 包版本，使用 `mvn dependency:tree` 查看依赖树，根据依赖原则来调整依赖在 POM 文件的声明顺序。

## Maven 项目生命周期与构建原理
### Maven对项目生命周期的抽象--三大项目生命周期
> Maven从项目的三个不同的角度，定义了单套生命周期，三套生命周期是相互独立的，它们之间不会相互影响。

* 默认构建生命周期（Default Lifeclyle）: 该生命周期表示这项目的构建过程，定义了一个项目的构建要经过的不同的阶段。
* 清理生命周期(Clean Lifecycle): 该生命周期负责清理项目中的多余信息，保持项目资源和代码的整洁性。一般拿来清空directory(即一般的target)目录下的文件。
* 站点管理生命周期(Site Lifecycle) :向我们创建一个项目时，我们有时候需要提供一个站点，来介绍这个项目的信息，如项目介绍，项目进度状态、项目组成成员，版本控制信息，项目javadoc索引信息等等。站点管理生命周期定义了站点管理过程的各个阶段。

![](/_images/maven_1.jpg)

### maven对项目默认生命周期的抽象
Maven将其架构和结构的组织放置到了components.xml 配置文件中，该配置文件的路径是:
apache-maven-${version}\lib\maven-core-${version}.jar\META-INFO\plexus\conponents.xml文件中。其中，我们可以看到关于default生命周期XML节点配置信息：
```xml
<component>  
    <role>org.apache.maven.lifecycle.Lifecycle</role>  
    <implementation>org.apache.maven.lifecycle.Lifecycle</implementation>  
    <role-hint>default</role-hint>  
    <configuration>  
        <id>default</id>  
  
        <phases>  
            <phase>validate</phase>  
            <phase>initialize</phase>  
            <phase>generate-sources</phase>  
            <phase>process-sources</phase>  
            <phase>generate-resources</phase>  
            <phase>process-resources</phase>  
            <phase>compile</phase>  
            <phase>process-classes</phase>  
            <phase>generate-test-sources</phase>  
            <phase>process-test-sources</phase>  
            <phase>generate-test-resources</phase>  
            <phase>process-test-resources</phase>  
            <phase>test-compile</phase>  
            <phase>process-test-classes</phase>  
            <phase>test</phase>  
            <phase>prepare-package</phase>  
            <phase>package</phase>  
            <phase>pre-integration-test</phase>  
            <phase>integration-test</phase>  
            <phase>post-integration-test</phase>  
            <phase>verify</phase>  
            <phase>install</phase>  
            <phase>deploy</phase>  
        </phases>  
  
    </configuration>  
</component> 
```
Maven根据一个项目的生命周期的每个阶段，将一个项目的生命周期抽象成了如上图所示的23个阶段。而每一个阶段应该干什么事情由用户决定。换句话说，maven为每一个阶段设计了接口，你可以为每一阶段自己定义一个接口，进而实现对应阶段应该有的行为。

![](/_images/maven_2.jpg)

在经历这些生命周期的阶段中，每个阶段会理论上会有相应的处理操作。但是，在实际的项目开发过程中， 并不是所有的生命周期阶段都是必须的。
基于类似的约定，maven默认地为一些不同类型的maven项目生命周期的阶段实现了默认的行为。

Maven 在设计上将生命周期阶段的抽象和对应阶段应该执行的行为实现分离开，maven这些实现放到了插件中，这些插件本质上是实现了maven留在各个生命周期阶段的接口。
如下图所示，maven针对不同打包类型的maven项目的生命周期阶段绑定了对应的默认行为：

![](/_images/maven_3.jpg)

### Maven各生命阶段行为绑定
maven会根据Mojo功能的划分，将具有相似功能的Mojo放到一个插件中。并且某一个特定的Mojo能实现的功能称为 goal,即目标，表明该Mojo能实现什么目标。

![](/_images/maven_4.jpg)

例如，我们项目生命周期有两个阶段：compile 和 test-compile,这两阶段都是需要将Java源代码编译成class文件中，相对应地，compile和test-compiler分别被绑定到了org.apache.maven.plugin.compiler.CompilerMojo 和org.apache.maven.plugin.compiler.TestCompilerMojo上：

![](/_images/maven_5.jpg)

### 如何查看maven各个生命周期阶段和插件的绑定情况
maven默认实现上，会为各个常用的生命周期根据约定绑定特定的插件目标。maven将这些配置放置到了：
apache-maven-${version}\lib\maven-core-${version}.jar\META-INFO\plexus\default-binds.xml文件中，针对不同打包类型的项目，其默认绑定情况也会不一样，我们先看一下常用的jar包类型和war包类型的项目默认绑定情况：

```xml
    <!-- jar包格式的项目生命周期各个阶段默认绑定情况 -->  
    <component>  
        <role>org.apache.maven.lifecycle.mapping.LifecycleMapping</role>  
        <role-hint>jar</role-hint>  
        <implementation>org.apache.maven.lifecycle.mapping.DefaultLifecycleMapping</implementation>  
        <configuration>  
            <lifecycles>  
                <lifecycle>  
                    <id>default</id>  
                    <!-- START SNIPPET: jar-lifecycle -->  
                    <phases>  
                        <!-- 插件绑定的格式：  <plugin-groupid>:<plugin-artifactid>:<version>:goal  -->   
                        <process-resources>  
                    org.apache.maven.plugins:maven-resources-plugin:2.6:resources  
                        </process-resources>  
                        <compile>  
                    org.apache.maven.plugins:maven-compiler-plugin:3.1:compile  
                        </compile>  
                        <process-test-resources>  
                    org.apache.maven.plugins:maven-resources-plugin:2.6:testResources  
                        </process-test-resources>  
                        <test-compile>  
                    org.apache.maven.plugins:maven-compiler-plugin:3.1:testCompile  
                        </test-compile>  
                        <test>  
                    org.apache.maven.plugins:maven-surefire-plugin:2.12.4:test  
                        </test>  
                        <package>  
                    org.apache.maven.plugins:maven-jar-plugin:2.4:jar  
                        </package>  
                        <install>  
                    org.apache.maven.plugins:maven-install-plugin:2.4:install  
                        </install>  
                        <deploy>  
                    org.apache.maven.plugins:maven-deploy-plugin:2.7:deploy  
                        </deploy>  
                    </phases>  
                    <!-- END SNIPPET: jar-lifecycle -->  
                </lifecycle>  
            </lifecycles>  
        </configuration>  
    </component>  
      
    <!-- war包格式的项目生命周期各个阶段默认绑定情况 -->  
    <component>  
        <role>org.apache.maven.lifecycle.mapping.LifecycleMapping</role>  
        <role-hint>war</role-hint>  
        <implementation>org.apache.maven.lifecycle.mapping.DefaultLifecycleMapping</implementation>  
        <configuration>  
            <lifecycles>  
                <lifecycle>  
                    <id>default</id>  
                    <!-- START SNIPPET: war-lifecycle -->  
                    <phases>  
                        <process-resources>  
                    org.apache.maven.plugins:maven-resources-plugin:2.6:resources  
                        </process-resources>  
                        <compile>  
                    org.apache.maven.plugins:maven-compiler-plugin:3.1:compile  
                        </compile>  
                        <process-test-resources>  
                    org.apache.maven.plugins:maven-resources-plugin:2.6:testResources  
                        </process-test-resources>  
                        <test-compile>  
                    org.apache.maven.plugins:maven-compiler-plugin:3.1:testCompile  
                        </test-compile>  
                        <test>  
                    org.apache.maven.plugins:maven-surefire-plugin:2.12.4:test  
                        </test>  
                        <package>  
                    org.apache.maven.plugins:maven-war-plugin:2.2:war  
                        </package>  
                        <install>  
                    org.apache.maven.plugins:maven-install-plugin:2.4:install  
                        </install>  
                        <deploy>  
                    org.apache.maven.plugins:maven-deploy-plugin:2.7:deploy  
                        </deploy>  
                    </phases>  
                    <!-- END SNIPPET: war-lifecycle -->  
                </lifecycle>  
            </lifecycles>  
        </configuration>  
    </component>  
```

### 项目中Run Package命令
加入Jacoo测试统计的插件, pre-test和post-test两个阶段：
```xml
	<build>
		<plugins>
			<plugin>
				<groupId>org.springframework.boot</groupId>
				<artifactId>spring-boot-maven-plugin</artifactId>
			</plugin>
			<plugin>
				<groupId>org.jacoco</groupId>
				<artifactId>jacoco-maven-plugin</artifactId>
				<version>${jacoco.version}</version>
				<executions>
					<execution>
						<id>pre-test</id>
						<goals>
							<goal>prepare-agent</goal>
						</goals>
					</execution>
					<execution>
						<id>post-test</id>
						<phase>test</phase>
						<goals>
							<goal>report</goal>
						</goals>
					</execution>
				</executions>
			</plugin>
		</plugins>
		<defaultGoal>compile</defaultGoal>
	</build>
```

```text
[INFO] Scanning for projects...
[INFO]                                                                         
[INFO] ------------------------------------------------------------------------
[INFO] Building cdc-common-config 1.0.1-RELEASE
[INFO] ------------------------------------------------------------------------
[INFO] 
[INFO] --- jacoco-maven-plugin:0.7.7.201606060606:prepare-agent (pre-test) @ cdc-common-config ---
[INFO] argLine set to -javaagent:C:\\Users\\Z003MRZB\\.m2\\repository\\org\\jacoco\\org.jacoco.agent\\0.7.7.201606060606\\org.jacoco.agent-0.7.7.201606060606-runtime.jar=destfile=D:\\git_cdc2\\cdc-backend-services\\cdc-common-config\\target\\jacoco.exec
[INFO] 
[INFO] --- maven-resources-plugin:2.6:resources (default-resources) @ cdc-common-config ---
[INFO] Using 'UTF-8' encoding to copy filtered resources.
[INFO] Copying 1 resource
[INFO] Copying 5 resources
[INFO] 
[INFO] --- maven-compiler-plugin:3.5.1:compile (default-compile) @ cdc-common-config ---
[INFO] Nothing to compile - all classes are up to date
[INFO] 
[INFO] --- maven-resources-plugin:2.6:testResources (default-testResources) @ cdc-common-config ---
[INFO] Using 'UTF-8' encoding to copy filtered resources.
[INFO] skip non existing resourceDirectory D:\git_cdc2\cdc-backend-services\cdc-common-config\src\test\resources
[INFO] 
[INFO] --- maven-compiler-plugin:3.5.1:testCompile (default-testCompile) @ cdc-common-config ---
[INFO] Nothing to compile - all classes are up to date
[INFO] 
[INFO] --- maven-surefire-plugin:2.19.1:test (default-test) @ cdc-common-config ---
...
Results :

Tests run: 1, Failures: 0, Errors: 0, Skipped: 0

[INFO] 
[INFO] --- jacoco-maven-plugin:0.7.7.201606060606:report (post-test) @ cdc-common-config ---
[INFO] Loading execution data file D:\git_cdc2\cdc-backend-services\cdc-common-config\target\jacoco.exec
[INFO] Analyzed bundle 'cdc-common-config' with 1 classes
[INFO] 
[INFO] --- maven-jar-plugin:2.6:jar (default-jar) @ cdc-common-config ---
[INFO] Building jar: D:\git_cdc2\cdc-backend-services\cdc-common-config\target\cdc-common-config-1.0.1-RELEASE.jar
[INFO] 
[INFO] --- spring-boot-maven-plugin:1.4.1.RELEASE:repackage (default) @ cdc-common-config ---
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time: 10.372 s
[INFO] Finished at: 2017-03-02T15:43:05+08:00
[INFO] Final Memory: 34M/497M
[INFO] ------------------------------------------------------------------------

```

## 参考
- [POM Reference](http://maven.apache.org/pom.html#Dependency_Version_Requirement_Specification)