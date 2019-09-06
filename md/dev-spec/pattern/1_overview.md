## 设计模式 - Overview

> 在软件开发中，前人对软件系统的设计和开发总结了一些原则和模式， 不管用什么语言做开发，都将对我们系统设计和开发提供指导意义。本文主要将对24种设计模式和7个设计原则进行总结，和具体阐述意义。 @pdai

### 参考
+ 设计模式六大原则 http://www.uml.org.cn/sjms/201211023.asp
+ 设计模式原则详解 http://blog.csdn.net/hguisu/article/details/7571617
+ 一张图24种设计模式&7种设计原则 https://www.jianshu.com/p/6ee99cf66e4d
+ 真正的深入浅出“设计模式” - 最易懂的设计模式解析 https://www.jianshu.com/p/6e5eda3a51af
+ Java设计模式Gitbook https://gof.quanke.name/
+ Java设计模式源码 https://github.com/quanke/design-pattern-java-source-code


### 24大设计模式和7个原则
#### 7个原则
单一职责原则【SINGLE RESPONSIBILITY PRINCIPLE】：一个类负责一项职责。

里氏替换原则【LISKOV SUBSTITUTION PRINCIPLE】：继承与派生的规则。

依赖倒置原则【DEPENDENCE INVERSION PRINCIPLE】：高层模块不应该依赖低层模块，二者都应该依赖其抽象；抽象不应该依赖细节；细节应该依赖抽象。即针对接口编程，不要针对实现编程。

接口隔离原则【INTERFACE SEGREGATION PRINCIPLE】：建立单一接口，不要建立庞大臃肿的接口，尽量细化接口，接口中的方法尽量少。

迪米特法则【LOW OF DEMETER】：低耦合，高内聚。

开闭原则【OPEN CLOSE PRINCIPLE】：一个软件实体如类、模块和函数应该对扩展开放，对修改关闭。

组合/聚合复用原则【Composition/Aggregation Reuse Principle(CARP) 】：尽量使用组合和聚合少使用继承的关系来达到复用的原则。

#### 24大设计模式

![](/_images/design_part/design_overview_0.jpg)

###### 创建型模式
抽象工厂模式(Abstract factory pattern): 提供一个接口, 用于创建相关或依赖对象的家族, 而不需要指定具体类.

生成器模式(Builder pattern): 使用生成器模式封装一个产品的构造过程, 并允许按步骤构造. 将一个复杂对象的构建与它的表示分离, 使得同样的构建过程可以创建不同的表示.

工厂模式(factory method pattern): 定义了一个创建对象的接口, 但由子类决定要实例化的类是哪一个. 工厂方法让类把实例化推迟到子类.

原型模式(prototype pattern): 当创建给定类的实例过程很昂贵或很复杂时, 就使用原形模式.

单例模式(Singleton pattern): 确保一个类只有一个实例, 并提供全局访问点.

多例模式(Multition pattern): 在一个解决方案中结合两个或多个模式, 以解决一般或重复发生的问题.

###### 结构型模式
适配器模式(Adapter pattern): 将一个类的接口, 转换成客户期望的另一个接口. 适配器让原本接口不兼容的类可以合作无间. 对象适配器使用组合, 类适配器使用多重继承.

桥接模式(Bridge pattern): 使用桥接模式通过将实现和抽象放在两个不同的类层次中而使它们可以独立改变.

组合模式(composite pattern): 允许你将对象组合成树形结构来表现"整体/部分"层次结构. 组合能让客户以一致的方式处理个别对象以及对象组合.

装饰者模式(decorator pattern): 动态地将责任附加到对象上, 若要扩展功能, 装饰者提供了比继承更有弹性的替代方案.

外观模式(facade pattern): 提供了一个统一的接口, 用来访问子系统中的一群接口. 外观定义了一个高层接口, 让子系统更容易使用.

享元模式(Flyweight Pattern): 如想让某个类的一个实例能用来提供许多"虚拟实例", 就使用蝇量模式.

代理模式(Proxy pattern): 为另一个对象提供一个替身或占位符以控制对这个对象的访问.

###### 行为型模式
责任链模式(Chain of responsibility pattern): 通过责任链模式, 你可以为某个请求创建一个对象链. 每个对象依序检查此请求并对其进行处理或者将它传给链中的下一个对象.

命令模式(Command pattern): 将"请求"封闭成对象, 以便使用不同的请求,队列或者日志来参数化其他对象. 命令模式也支持可撤销的操作.

解释器模式(Interpreter pattern): 使用解释器模式为语言创建解释器.

迭代器模式(iterator pattern): 提供一种方法顺序访问一个聚合对象中的各个元素, 而又不暴露其内部的表示.

中介者模式(Mediator pattern) : 使用中介者模式来集中相关对象之间复杂的沟通和控制方式.

备忘录模式(Memento pattern): 当你需要让对象返回之前的状态时(例如, 你的用户请求"撤销"), 你使用备忘录模式.

观察者模式(observer pattern): 在对象之间定义一对多的依赖, 这样一来, 当一个对象改变状态, 依赖它的对象都会收到通知, 并自动更新.

状态模式(State pattern): 允许对象在内部状态改变时改变它的行为, 对象看起来好象改了它的类.

策略模式(strategy pattern): 定义了算法族, 分别封闭起来, 让它们之间可以互相替换, 此模式让算法的变化独立于使用算法的客户.

模板方法模式(Template pattern): 在一个方法中定义一个算法的骨架, 而将一些步骤延迟到子类中. 模板方法使得子类可以在不改变算法结构的情况下, 重新定义算法中的某些步骤.

访问者模式(visitor pattern): 当你想要为一个对象的组合增加新的能力, 且封装并不重要时, 就使用访问者模式.


#### 关联关系

![](/_images/design_part/design_overview_3.png)

#### 知识体系图

![](/_images/design_part/design_overview_1.png)



