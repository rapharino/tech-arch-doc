## Java 基础IO相关

> 理解Java基础IO相关的知识，需要从以下几个点取理解。@pdai
> + 什么是IO流？
> + Java IO基础类是怎么设计的，从数据传输方式，数据操作上分析？
> + Java IO基础四个抽象类和其实现源码？
> + Java IO涉及的设计模式？

### IO相关概念

### IO理解分类 - 从传输方式上

从数据传输方式或者说是运输方式角度看，可以将 IO 类分为：

1、字节流
2、字符流

![](/_images/io/java-io-2.png)

#### 字节流和字符流的区别：
+ 字节流读取单个字节，字符流读取单个字符（一个字符根据编码的不同，对应的字节也不同，如 UTF-8 编码是 3 个字节，中文编码是 2 个字节。）
+ 字节流用来处理二进制文件（图片、MP3、视频文件），字符流用来处理文本文件（可以看做是特殊的二进制文件，使用了某种编码，人可以阅读）。

> 简而言之，字节是个计算机看的，字符才是给人看的。

#### 字节转字符Input/OutputStreamReader/Writer
编码就是把字符转换为字节，而解码是把字节重新组合成字符。

如果编码和解码过程使用不同的编码方式那么就出现了乱码。

- GBK 编码中，中文字符占 2 个字节，英文字符占 1 个字节；
- UTF-8 编码中，中文字符占 3 个字节，英文字符占 1 个字节；
- UTF-16be 编码中，中文字符和英文字符都占 2 个字节。

UTF-16be 中的 be 指的是 Big Endian，也就是大端。相应地也有 UTF-16le，le 指的是 Little Endian，也就是小端。

Java 使用双字节编码 UTF-16be，这不是指 Java 只支持这一种编码方式，而是说 char 这种类型使用 UTF-16be 进行编码。char 类型占 16 位，也就是两个字节，Java 使用这种双字节编码是为了让一个中文或者一个英文都能使用一个 char 来存储。

![](/_images/io/java-io-1.png)

### IO理解分类 - 从数据操作上

从数据来源或者说是操作对象角度看，IO 类可以分为：

+ 文件（file）：FileInputStream、FileOutputStream、FileReader、FileWriter

+ 数组（[]）：
	+ 字节数组（byte[]）：ByteArrayInputStream、ByteArrayOutputStream
	+ 字符数组（char[]）：CharArrayReader、CharArrayWriter

+ 管道操作：PipedInputStream、PipedOutputStream、PipedReader、PipedWriter

+ 基本数据类型：DataInputStream、DataOutputStream

+ 缓冲操作：BufferedInputStream、BufferedOutputStream、BufferedReader、BufferedWriter

+ 打印：PrintStream、PrintWriter

+ 对象序列化反序列化：ObjectInputStream、ObjectOutputStream

+ 转换：InputStreamReader、OutputStreWriter

+ 字符串（String）Java8中已废弃：StringBufferInputStream、StringBufferOutputStream、StringReader、StringWriter

![](/_images/io/java-io-3.jpg)

### IO核心四个超类和常用方法

基本的是 4 个抽象类：InputStream、OutputStream、Reader、Writer。最基本的方法也就是一个读 read() 方法、一个写 write() 方法。

+ InputStream 类

```java
public abstract int read() 
// 读取数据

public int read(byte b[]) 
// 将读取到的数据放在 byte 数组中，该方法实际上是根据下面的方法实现的，off 为 0，len 为数组的长度

public int read(byte b[], int off, int len) 
// 从第 off 位置读取 len 长度字节的数据放到 byte 数组中，流是以 -1 来判断是否读取结束的

public long skip(long n) 
// 跳过指定个数的字节不读取，想想看电影跳过片头片尾

public int available() 
// 返回可读的字节数量

public void close() 
// 读取完，关闭流，释放资源

public synchronized void mark(int readlimit) 
// 标记读取位置，下次还可以从这里开始读取，使用前要看当前流是否支持，可以使用 markSupport() 方法判断

public synchronized void reset() 
// 重置读取位置为上次 mark 标记的位置

public boolean markSupported() 
// 判断当前流是否支持标记流，和上面两个方法配套使用
```

+ OutputStream 类

```java
public abstract void write(int b)
// 写入一个字节，可以看到这里的参数是一个 int 类型，对应上面的读方法，int 类型的 32 位，只有低 8 位才写入，高 24 位将舍弃。

public void write(byte b[])
// 将数组中的所有字节写入，和上面对应的 read() 方法类似，实际调用的也是下面的方法。

public void write(byte b[], int off, int len)
// 将 byte 数组从 off 位置开始，len 长度的字节写入

public void flush()
// 强制刷新，将缓冲中的数据写入

public void close()
// 关闭输出流，流被关闭后就不能再输出数据了
```


+ Reader 类

```java
public int read(java.nio.CharBuffer target)
// 读取字节到字符缓存中

public int read()
// 读取单个字符

public int read(char cbuf[])
// 读取字符到指定的 char 数组中

abstract public int read(char cbuf[], int off, int len)
// 从 off 位置读取 len 长度的字符到 char 数组中

public long skip(long n)
// 跳过指定长度的字符数量

public boolean ready()
// 和上面的 available() 方法类似

public boolean markSupported()
// 判断当前流是否支持标记流

public void mark(int readAheadLimit)
// 标记读取位置，下次还可以从这里开始读取，使用前要看当前流是否支持，可以使用 markSupport() 方法判断

public void reset()
// 重置读取位置为上次 mark 标记的位置

abstract public void close()
// 关闭流释放相关资源
```

+ Writer 类

```java
public void write(int c)
// 写入一个字符

public void write(char cbuf[])
// 写入一个字符数组

abstract public void write(char cbuf[], int off, int len)
// 从字符数组的 off 位置写入 len 数量的字符

public void write(String str)
// 写入一个字符串

public void write(String str, int off, int len)
// 从字符串的 off 位置写入 len 数量的字符

public Writer append(CharSequence csq)
// 追加吸入一个字符序列

public Writer append(CharSequence csq, int start, int end)
// 追加写入一个字符序列的一部分，从 start 位置开始，end 位置结束

public Writer append(char c)
// 追加写入一个 16 位的字符

abstract public void flush()
// 强制刷新，将缓冲中的数据写入

abstract public void close()
// 关闭输出流，流被关闭后就不能再输出数据了
```

### IO设计模式 - 外观设计模式

Java I/O 使用了装饰者模式来实现。以 InputStream 为例，

- InputStream 是抽象组件；
- FileInputStream 是 InputStream 的子类，属于具体组件，提供了字节流的输入操作；
- FilterInputStream 属于抽象装饰者，装饰者用于装饰组件，为组件提供额外的功能。例如 BufferedInputStream 为 FileInputStream 提供缓存的功能。

![image](/_images/pics/DP-Decorator-java.io.png)

实例化一个具有缓存功能的字节流对象时，只需要在 FileInputStream 对象上再套一层 BufferedInputStream 对象即可。

```java
FileInputStream fileInputStream = new FileInputStream(filePath);
BufferedInputStream bufferedInputStream = new BufferedInputStream(fileInputStream);
```

DataInputStream 装饰者提供了对更多数据类型进行输入的操作，比如 int、double 等基本类型。

### IO常见类的使用
Java 的 I/O 大概可以分成以下几类：

- 磁盘操作：File
- 字节操作：InputStream 和 OutputStream
- 字符操作：Reader 和 Writer
- 对象操作：Serializable
- 网络操作：Socket


#### File相关
File 类可以用于表示文件和目录的信息，但是它不表示文件的内容。

递归地列出一个目录下所有文件：

```java
public static void listAllFiles(File dir) {
    if (dir == null || !dir.exists()) {
        return;
    }
    if (dir.isFile()) {
        System.out.println(dir.getName());
        return;
    }
    for (File file : dir.listFiles()) {
        listAllFiles(file);
    }
}
```

#### 字节流相关

```java
public static void copyFile(String src, String dist) throws IOException {

    FileInputStream in = new FileInputStream(src);
    FileOutputStream out = new FileOutputStream(dist);
    byte[] buffer = new byte[20 * 1024];

    // read() 最多读取 buffer.length 个字节
    // 返回的是实际读取的个数
    // 返回 -1 的时候表示读到 eof，即文件尾
    while (in.read(buffer, 0, buffer.length) != -1) {
        out.write(buffer);
    }

    in.close();
    out.close();
}
```

#### 实现逐行输出文本文件的内容

```java
public static void readFileContent(String filePath) throws IOException {

    FileReader fileReader = new FileReader(filePath);
    BufferedReader bufferedReader = new BufferedReader(fileReader);

    String line;
    while ((line = bufferedReader.readLine()) != null) {
        System.out.println(line);
    }

    // 装饰者模式使得 BufferedReader 组合了一个 Reader 对象
    // 在调用 BufferedReader 的 close() 方法时会去调用 Reader 的 close() 方法
    // 因此只要一个 close() 调用即可
    bufferedReader.close();
}
```

#### 序列化 & Serializable & transient

序列化就是将一个对象转换成字节序列，方便存储和传输。

- 序列化：ObjectOutputStream.writeObject()
- 反序列化：ObjectInputStream.readObject()

不会对静态变量进行序列化，因为序列化只是保存对象的状态，静态变量属于类的状态。

__Serializable__

序列化的类需要实现 Serializable 接口，它只是一个标准，没有任何方法需要实现，但是如果不去实现它的话而进行序列化，会抛出异常。

```java
public static void main(String[] args) throws IOException, ClassNotFoundException {
    A a1 = new A(123, "abc");
    String objectFile = "file/a1";
    ObjectOutputStream objectOutputStream = new ObjectOutputStream(new FileOutputStream(objectFile));
    objectOutputStream.writeObject(a1);
    objectOutputStream.close();

    ObjectInputStream objectInputStream = new ObjectInputStream(new FileInputStream(objectFile));
    A a2 = (A) objectInputStream.readObject();
    objectInputStream.close();
    System.out.println(a2);
}

private static class A implements Serializable {
    private int x;
    private String y;

    A(int x, String y) {
        this.x = x;
        this.y = y;
    }

    @Override
    public String toString() {
        return "x = " + x + "  " + "y = " + y;
    }
}
```

__transient__

transient 关键字可以使一些属性不会被序列化。

ArrayList 中存储数据的数组 elementData 是用 transient 修饰的，因为这个数组是动态扩展的，并不是所有的空间都被使用，因此就不需要所有的内容都被序列化。通过重写序列化和反序列化方法，使得可以只序列化数组中有内容的那部分数据。

```java
private transient Object[] elementData;
```

#### Java 中的网络支持：

- InetAddress：用于表示网络上的硬件资源，即 IP 地址；
- URL：统一资源定位符；
- Sockets：使用 TCP 协议实现网络通信；
- Datagram：使用 UDP 协议实现网络通信。

##### InetAddress

没有公有的构造函数，只能通过静态方法来创建实例。

```java
InetAddress.getByName(String host);
InetAddress.getByAddress(byte[] address);
```

##### URL

可以直接从 URL 中读取字节流数据。

```java
public static void main(String[] args) throws IOException {

    URL url = new URL("http://www.baidu.com");

    /* 字节流 */
    InputStream is = url.openStream();

    /* 字符流 */
    InputStreamReader isr = new InputStreamReader(is, "utf-8");

    /* 提供缓存功能 */
    BufferedReader br = new BufferedReader(isr);

    String line;
    while ((line = br.readLine()) != null) {
        System.out.println(line);
    }

    br.close();
}
```

##### Sockets

- ServerSocket：服务器端类
- Socket：客户端类
- 服务器和客户端通过 InputStream 和 OutputStream 进行输入输出。

![image](/_images/pics/ClienteServidorSockets1521731145260.jpg)

##### Datagram

- DatagramSocket：通信类
- DatagramPacket：数据包类


### 常见问题

+ Java 字节读取流的read方法返回int的原因 

https://blog.csdn.net/congwiny/article/details/18922847

### 参考文章


