## Spring Boot - websoeckt Demo

> 从网上找的例子，说说其中的缺陷：（无所谓了只是一个socket demo而已）@pdai.
+ disruptor配置不合理；
+ 前端日志没有清空，数据量大了，前端卡爆了；
+ 数据量大时消息丢失；

> spring boot系统中使用websocket技术实时输出系统日志到浏览器端，因为是实时输出，所有第一时间就想到了使用webSocket,而且在spring boot中，使用websocket超级方便，阅读本文，你会接触到以下关键词相关技术，WebSocket（stopmp服务端），stomp协议，sockjs.min.js，stomp.min.js（stomp客户端），本文使用到的其实就是使用spring boot自带的webSocket模块提供stomp的服务端，前端使用stomp.min.js做stomp的客户端，使用sockjs来链接，前端订阅后端日志端点的消息，后端实时推送，达到日志实时输出到web页面的目的




### websocket原理

![输入图片说明](/_images/spring/springboot-data-websocket-1.png "屏幕截图.png")


### 代码示例

@See https://github.com/realpdai/springboot-websocket-demo 

一些参考

+ stomp.js客户端：http://jmesnil.net/stomp-websocket/doc/
+ scok.js客户端：https://github.com/sockjs/sockjs-client
+ spring webSocket：https://docs.spring.io/spring/docs/
+ 高性能无锁队列disruptor：https://github.com/LMAX-Exchange/disruptor

