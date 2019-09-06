## 创建型 - 原型模式(Prototype)

> 本文主要分析设计模式 - 原型模式(Prototype)。 @pdai


### 意图

使用原型实例指定要创建对象的类型，通过复制这个原型来创建新对象。

### 类图

![](/_images/pics/a40661e4-1a71-46d2-a158-ff36f7fc3331.png)

### 实现

```java
public abstract class Prototype {
    abstract Prototype myClone();
}
```

```java
public class ConcretePrototype extends Prototype {

    private String filed;

    public ConcretePrototype(String filed) {
        this.filed = filed;
    }

    @Override
    Prototype myClone() {
        return new ConcretePrototype(filed);
    }

    @Override
    public String toString() {
        return filed;
    }
}
```

```java
public class Client {
    public static void main(String[] args) {
        Prototype prototype = new ConcretePrototype("abc");
        Prototype clone = prototype.myClone();
        System.out.println(clone.toString());
    }
}
```

```html
abc
```

### JDK

- [java.lang.Object#clone()](http://docs.oracle.com/javase/8/docs/api/java/lang/Object.html#clone%28%29)

### 参考
+ 原型模式(Prototype) https://www.jianshu.com/p/1638e7b068c1
+ 原型模式(Prototype)- 最易懂的设计模式解析 https://www.jianshu.com/p/7deb64f902db

### 总结
> 知识点的东西在上面参考文章中写的非常详细，读完之后问自己下面几个问题，直到可以流利的回答。

+ 使用的场景？

+ 本质是什么？

+ 它解决了什么问题？

+ 它体现了设计模式中什么原则？

+ 存在的缺陷？

+ 你认为与它相关的设计模式有哪些？ 它们之间的区别有哪些？

+ *开源架构中哪些使用了这一模式？