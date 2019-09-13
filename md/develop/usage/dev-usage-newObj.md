## Java 创建对象的四种方法
> Java 创建对象的四种方法 @pdai

### 使用new 方式创建对象
```java
 public static Worker createWorker() {  
     return new Worker();  
 }  

 public static Worker createWorker(String name, int age) {  
     return new Worker(name, age);  
 }
 ```
 
### 使用反射机制

```java
/*
 * 使用反射机制，不带参数 Class 对象的 newInstance() 方法
 */  
 
    public static Worker createWorker1() {  
 
        Class clazz = null;  
        Worker worker = null;  
        try {  
            clazz = Class.forName("com.lou.creation.Worker");  
            worker = (Worker) clazz.newInstance();  
        } catch (ClassNotFoundException e) {  
            e.printStackTrace();  
        } catch (InstantiationException e) {  
            e.printStackTrace();  
        } catch (IllegalAccessException e) {  
            e.printStackTrace();  
        }  
        return worker;  
    }  
 
    /*
     *  使用反射机制 ， Constructor的 newInstance方法
     */  
 
    public static Worker createWorker2() {  
        Worker worker = null;  
        try {  
            Class clazz = null;  
            clazz = Class.forName("com.lou.creation.Worker");  
 
            // 获取不带参数的构造器  
            Constructor constructor = clazz.getConstructor();  
            // 使用构造器创建对象  
            worker = (Worker) constructor.newInstance();  
 
        } catch (ClassNotFoundException e) {  
            e.printStackTrace();  
        } catch (InstantiationException e) {  
            e.printStackTrace();  
        } catch (IllegalAccessException e) {  
            e.printStackTrace();  
        } catch (SecurityException e) {  
            e.printStackTrace();  
        } catch (NoSuchMethodException e) {  
            e.printStackTrace();  
        } catch (IllegalArgumentException e) {  
            e.printStackTrace();  
        } catch (InvocationTargetException e) {  
            e.printStackTrace();  
        }  
 
        return worker;  
    }  
 
    /*
     * 使用反射机制 ：带参数的构造函数创建新对象
     */  
    public static Worker createWorker3(String name, Integer age) {  
        Worker worker = null;  
        try {  
            Class clazz = null;  
            clazz = Class.forName("com.lou.creation.Worker");  
 
            // 获取不带参数的构造器  
            Constructor constructor = clazz.getConstructor(name.getClass(),  
                    age.getClass());  
            // 使用构造器创建对象  
            worker = (Worker) constructor.newInstance(name, age);  
 
        } catch (ClassNotFoundException e) {  
            e.printStackTrace();  
        } catch (InstantiationException e) {  
            e.printStackTrace();  
        } catch (IllegalAccessException e) {  
            e.printStackTrace();  
        } catch (SecurityException e) {  
            e.printStackTrace();  
        } catch (NoSuchMethodException e) {  
            e.printStackTrace();  
        } catch (IllegalArgumentException e) {  
            e.printStackTrace();  
        } catch (InvocationTargetException e) {  
            e.printStackTrace();  
        }  
        return worker;  
    }  
```
    
### 序列化和反序列化创建对象
```java
    /*
     * 使用序列化和反序列化创建对象，这种方式其实是根据既有的对象进行复制，这个需要事先将可序列化的对象线存到文件里
     */  
    @SuppressWarnings("resource")  
    public static Worker createWorker4(String objectPath) {  
        ObjectInput input = null;  
        Worker worker = null;  
        try {  
            input = new ObjectInputStream(new FileInputStream(objectPath));  
            worker = (Worker) input.readObject();  
        } catch (FileNotFoundException e) {  
            e.printStackTrace();  
        } catch (IOException e) {  
            e.printStackTrace();  
        } catch (ClassNotFoundException e) {  
            e.printStackTrace();  
        }  
        return worker;  
    }  
 
    /*
     * 将创建的对象存入到文件内
     */  
    public static void storeObject2File(String objectPath) {  
        Worker worker = new Worker();  
        ObjectOutputStream objectOutputStream;  
        try {  
            objectOutputStream = new ObjectOutputStream(new FileOutputStream(  
                    objectPath));  
            objectOutputStream.writeObject(worker);  
        } catch (FileNotFoundException e) {  
            // TODO Auto-generated catch block  
            e.printStackTrace();  
        } catch (IOException e) {  
            // TODO Auto-generated catch block  
            e.printStackTrace();  
        }  
    }  
```
### 深拷贝
```java
/*
     * 使用对象的 深拷贝进行复制，创建对象
     */  
    public static Worker createWorker5(Worker worker) {  
        return (Worker) worker.clone();  
    }
```

### worker
```java
import java.io.Serializable;  
 
public class Worker implements Cloneable,Serializable {  
 
    private static final long serialVersionUID = 1L;  
    private String name;  
    private int age;  
      
    public Worker()  
    {  
        this.name = "";  
        this.age = 0;  
    }  
      
    public Worker(String name,int age)  
    {  
        this.name = name;  
        this.age = age;  
    }  
      
    public void work()  
    {  
        System.out.println(name +"is working");  
    }  
      
    public Worker clone()  
    {  
        Worker worker = null;  
        try {  
            return (Worker) super.clone();  
        } catch (CloneNotSupportedException e) {  
            // TODO Auto-generated catch block  
            e.printStackTrace();  
        }  
        return worker;  
    }  
}  
```

### 参考
http://blog.csdn.net/luanlouis/article/details/18228199