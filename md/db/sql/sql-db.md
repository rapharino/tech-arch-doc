## SQL DB - 资料汇总

> 本文主要总结了在开发中需要了解的SQL数据库原理的知识结构，由于分布式开发的崛起， 我这里重点介绍与并发编程相关的锁机制和事务隔离性等知识。 最后基于这些知识点，拓展引入所有数据库原理的知识结构。


### 知识体系结构

> 首先需要对数据库原理相关的知识有个基本的了解，请看如下的文章和知识点：

[如果有人问你数据库的原理，叫他看这篇文章](http://blog.jobbole.com/100349/?from=timeline)

![](/_images/arch_sqlyuanli.png)


> 基于上述知识体系，对锁的概念再进行补充：
+ 在数据库系统领域，并发控制机制主要有两种，即锁和多版本机制。

[数据库锁机制](http://blog.csdn.net/samjustin1/article/details/52210125)

[锁协议和多版本机制](http://www.cnblogs.com/zszmhd/p/3365220.html)

![](/_images/arch_sqlyuanli_lock.png)


> 基于上述知识体系，对事务隔离级别的概念再进行补充：

[MySQL事务隔离级别详解](http://xm-king.iteye.com/blog/770721)

[数据库事务隔离级别](http://singo107.iteye.com/blog/1175084)


> 基于上述知识体系，主要还是围绕着并发方面的知识点，下面将重点阐述其它相关的知识体系：

+ 脏读(Drity Read)：某个事务已更新一份数据，另一个事务在此时读取了同一份数据，由于某些原因，前一个RollBack了操作，则后一个事务所读取的数据就会是不正确的。

+ 不可重复读(Non-repeatable read): 在一个事务的两次查询之中数据不一致，这可能是两次查询过程中间插入了一个事务更新的原有的数据。

+ 幻读(Phantom Read): 在一个事务的两次查询中数据笔数不一致，例如有一个事务查询了几列(Row)数据，而另一个事务却在此时插入了新的几列数据，先前的事务在接下来的查询中，就会发现有几列数据是它先前所没有的。 

![](/_images/arch_sqlyuanli_geli.jpg)

### 文章
* 	[mysql中int长度的意义](http://blog.csdn.net/qmhball/article/details/51544484)
* 	[MySQL主从复制详解与实践](http://blog.csdn.net/wangyuanjun008/article/details/79420131)


### 业界动态

* 	[NoSQL 没毛病，为什么 MySQL 还是“王”：8 篇值得回顾的技术热文](https://mp.weixin.qq.com/s/g0eqJpZoHDh-c2XdKJkFXw)
* 	[阿里下一代数据库技术：把数据库装入容器不再是神话](https://mp.weixin.qq.com/s/AIZQ5-F5AngdIESNCXngWw)



