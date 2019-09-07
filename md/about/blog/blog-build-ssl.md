## 关于文档 - 文档的域名，HTTPS，备案

> 本文主要记录 本文档的域名，HTTPS，备案。 @pdai

文档的域名，HTTPS，备案 这三个步骤不能反，因为存在依赖关系。

### 申请域名

+ 申请：万网

![](/_images/blog/blog-ssl-ali-8.png)

+ 申请域名

![](/_images/blog/blog-ssl-ali-9.png)

### https

+ 阿里云上：SSL证书

![](/_images/blog/blog-ssl-ali-0.png)

+ 申请证书

![](/_images/blog/blog-ssl-ali-1.png)

+ 证书审核
> 30分钟之内就审核完成

![](/_images/blog/blog-ssl-ali-2.png)

+ 证书详情
> 这个详情页面在备案的时候需要拍照上传。

![](/_images/blog/blog-ssl-ali-7.png)

+ 证书下载

![](/_images/blog/blog-ssl-ali-6.png)

### 备案

> 80/443端口通过域名直接访问是需要备案的，在18年的时候我搭建过的个人网站是不要备案的。

+ 备案前访问 www.pdai.tech

![](/_images/blog/blog-ssl-ali-3.png)

+ 进入备案

![](/_images/blog/blog-ssl-ali-4.png)

> 期间需要手机通过阿里云人脸认证，并上传 身份证，域名和证书拍照等。

+ 备案审核

![](/_images/blog/blog-ssl-ali-5.png)

> 注意备案初审由阿里云代理的，要求：个人网站必须命名为`xxxx的个人博客`或者`xxx的个人主页`，否则备案不通过。

### 服务器资源选择
> 那么搭建这样的网站需要多少服务器资源呢，阿里云坑的地方是新用户首年都便宜，后面续费就贵了。

+ 看下搭建需要多少资源

![](/_images/blog/blog-ssl-ali-10.png)

+ 看下费用

> 推荐选择1CPU，1-2G内存即可；1Core-1GB一年价格287多，选择五年也就642多；后期如有需求，可以在线`增加配置`

![](/_images/blog/blog-ssl-ali-11.png)

+ 关于续费，我之前选择是2CPU，4GB内存；当初一年是780，续费价格是2363；

![](/_images/blog/blog-ssl-ali-12.png)