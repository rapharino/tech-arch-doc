## 关于文档 - 文档的自动部署

> 本文主要介绍 当前文档是如何在我自己的服务器自动编译部署的。@pdai

### 文档编译和部署流程

![](/_images/blog/blog-ssl-cd-1.png)

### 搭建
> 之前购买了一个低配的阿里云虚拟机，系统是CentOS 7.x。

#### 安装NodeJS

+ 添加yum源
```bash
curl -sL https://rpm.nodesource.com/setup_10.x | bash -
```

+ yum install

```bash
yum install -y nodejs
```

其它方式可以参考此文 https://blog.csdn.net/bbwangj/article/details/82253785

#### 清理原有部分服务
> 之前服务器上搭建过gitlab-ee，jenkins，httpd等，由于我自己的代码托管已经切换至github的私有仓库，所以现在需要清理下；不需要清理的，请略过。

+ 清理gitlab-ee

https://blog.csdn.net/huhuhuemail/article/details/80519433

+ 清理httpd

https://www.cnblogs.com/richardcastle/p/8296166.html

#### 安装Nginx和配置

+ 安装

https://www.centos.bz/2018/01/centos-7%EF%BC%8C%E4%BD%BF%E7%94%A8yum%E5%AE%89%E8%A3%85nginx/

+ 配置开机自启
https://www.cnblogs.com/jepson6669/p/9131217.html

+ 配置nginx.conf

https://www.cnblogs.com/alvin-niu/p/9502286.html

+ 配置firewalld

https://blog.csdn.net/benchem/article/details/79605598

#### 部署项目


