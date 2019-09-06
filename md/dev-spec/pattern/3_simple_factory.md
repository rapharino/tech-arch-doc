## 创建型 - 简单工厂(Simple Factory)

> 本文主要分析设计模式 - 简单工厂(Simple Factory)。 @pdai


### 意图

在创建一个对象时不向客户暴露内部细节，并提供一个创建对象的通用接口。

### 类图

简单工厂不是设计模式，更像是一种编程习惯。它把实例化的操作单独放到一个类中，这个类就成为简单工厂类，让简单工厂类来决定应该用哪个具体子类来实例化。

这样做能把客户类和具体子类的实现解耦，客户类不再需要知道有哪些子类以及应当实例化哪个子类。因为客户类往往有多个，如果不使用简单工厂，所有的客户类都要知道所有子类的细节。而且一旦子类发生改变，例如增加子类，那么所有的客户类都要进行修改。

![](/_images/pics/c79da808-0f28-4a36-bc04-33ccc5b83c13.png)

### 实现

```java
public interface Product {
}
```

```java
public class ConcreteProduct implements Product {
}
```

```java
public class ConcreteProduct1 implements Product {
}
```

```java
public class ConcreteProduct2 implements Product {
}
```

以下的 Client 类中包含了实例化的代码，这是一种错误的实现，如果在客户类中存在实例化代码，就需要将代码放到简单工厂中。

```java
public class Client {
    public static void main(String[] args) {
        int type = 1;
        Product product;
        if (type == 1) {
            product = new ConcreteProduct1();
        } else if (type == 2) {
            product = new ConcreteProduct2();
        } else {
            product = new ConcreteProduct();
        }
        // do something with the product
    }
}
```

以下的 SimpleFactory 是简单工厂实现，它被所有需要进行实例化的客户类调用。

```java
public class SimpleFactory {
    public Product createProduct(int type) {
        if (type == 1) {
            return new ConcreteProduct1();
        } else if (type == 2) {
            return new ConcreteProduct2();
        }
        return new ConcreteProduct();
    }
}
```

```java
public class Client {
    public static void main(String[] args) {
        SimpleFactory simpleFactory = new SimpleFactory();
        Product product = simpleFactory.createProduct(1);
        // do something with the product
    }
}
```

### 参考
+ 简单工厂(Simple Factory) https://www.jianshu.com/p/a9f397c4ff98
+ 简单工厂模式（SimpleFactoryPattern）- 最易懂的设计模式解析 https://www.jianshu.com/p/e55fbddc071c

### 总结
> 知识点的东西在上面参考文章中写的非常详细，读完之后问自己下面几个问题，直到可以流利的回答。

+ 使用的场景？

+ 本质是什么？

+ 它解决了什么问题？

+ 它体现了设计模式中什么原则？

+ 存在的缺陷？

+ 你认为与它相关的设计模式有哪些？ 它们之间的区别有哪些？

+ *开源架构中哪些使用了这一模式？