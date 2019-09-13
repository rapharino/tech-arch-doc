## 指纹自动登录实战

> 在一个项目中需要指纹登录系统，比如自助的仓库管理系统，用户自己刷指纹开门，系统检测到这一行为进行自动登录系统；用户接下来可以在系统中刷RFID进行借取操作。 @pdai


### 准备工作
采购的是中控一体机，刷卡指纹等


### B/S端调用

### 服务端调用

#### jacob
https://mvnrepository.com/artifact/net.sf.jacob-project/jacob

#### selenium
selenium基本实用

https://www.cnblogs.com/annieyu/p/3901638.html

#### WebDriver
使用WebDriver在Chrome浏览器上进行测试时，需要从http://chromedriver.storage.googleapis.com/index.html网址中下载与本机chrome浏览器对应的驱动程序，驱动程序名为chromedriver；

chromedriver的版本需要和本机的chrome浏览器对应，才能正常使用；

chromedriver与chrome的对应关系表https://blog.csdn.net/huilan_same/article/details/51896672

参考
https://blog.csdn.net/u010366748/article/details/72872190/


#### 问题汇总

##### Firefox

```shell
Selenium 2.46.0 org.openqa.selenium.firefox.NotConnectedException: Unable to connect to host 127.0.0.1 on port 7055 after 45000 ms.
```

https://stackoverflow.com/questions/43380124/selenium-2-46-0-org-openqa-selenium-firefox-notconnectedexception-unable-to-con

##### chromedriver目录位置问题

将chromedriver下载放到自己的一个目录中，并在代码中设置
```java
System.setProperty("webdriver.chrome.driver", "D:\\chromedriver.exe");
```


出现如下异常：


```java
org.openqa.selenium.remote.UnreachableBrowserException: Could not start a new session. Possible causes are invalid address of the remote server or browser start-up failure.
Build info: version: 'dfb1306b85be4934d23c123122e06e602a15e446', revision: 'unknown', time: '2013-01-17 15:05:54'
System info: os.name: 'Windows 7', os.arch: 'amd64', os.version: '6.1', java.version: '1.7.0'
Driver info: driver.version: ChromeDriver
at org.openqa.selenium.remote.RemoteWebDriver.execute(RemoteWebDriver.java:527)
at org.openqa.selenium.remote.RemoteWebDriver.startSession(RemoteWebDriver.java:216)
at org.openqa.selenium.remote.RemoteWebDriver.<init>(RemoteWebDriver.java:111)
at org.openqa.selenium.remote.RemoteWebDriver.<init>(RemoteWebDriver.java:115)
at org.openqa.selenium.chrome.ChromeDriver.<init>(ChromeDriver.java:161)
at org.openqa.selenium.chrome.ChromeDriver.<init>(ChromeDriver.java:107)
at com.zoneland.ysj.webTest.ChromeTest.setUp(ChromeTest.java:26)
at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:95)
at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:56)
at java.lang.reflect.Method.invoke(Method.java:620)
at org.junit.runners.model.FrameworkMethod$1.runReflectiveCall(FrameworkMethod.java:50)
```

需要将下载到的ChromeDriver.exe放在了chrome同级目录下

##### selenumu-java版本问题
```java
Caused by: java.lang.NoSuchMethodError: com.google.common.collect.MapMaker.expireAfterWrite(JLjava/util/concurrent/TimeUnit;)Lcom/google/common/collect/MapMaker;
        at com.taobao.treasure.client.TreasureClientImpl.<init>(TreasureClientImpl.java:31)
        at com.taobao.treasure.client.TreasureClientFactory$1.getPipeline(TreasureClientFactory.java:95)
        at org.jboss.netty.bootstrap.ClientBootstrap.co

nnect(ClientBootstrap.java:212)
```

版本可能导致的问题：
+ 和浏览器版本不一致
+ 和driver版本不一致
+ 引入的第三方的包版本不一致，比如3.40版本中guva是25.0-jre，导致类似的找不到类的错误。