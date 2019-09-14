## 关于文档 - 文档的自动编译

> 文档托管在Github，有几种选择：Github自带的Github Actions，或者插件Travis CI， 或者插件Circle CI。@pdai


### Travis CI

> 注意：Travis CI有个坑爹的地方要注意：它有travis.com和travis.org两个网站，一个是对公有项目，一个是对私有项目；然后，github是可以在公有和私有项目中切换的，于是在切换后，一些配置可能无法正确设置。

#### Github 启用插件

进入 https://github.com/marketplace/travis-ci

![](/_images/blog/blog-ci-1.png)

#### 配置插件

![](/_images/blog/blog-ci-2.png)

#### 添加.travis.yml

> 注意：这里只是简单做编译操作，您可以将编译的结果（静态的html文件）强制推送至当前仓库专门放编译后文件的分支；也可以在自己的服务器上安装travis-cli，在travis.com(注意不是travis.org)生成证书信息（自动生成相关环境变量），来进行自动化部署。


这里上述两种方案都没有采用，是因为：
+ 1）travis-cli对私有项目自动添加证书信息支持不够；
+ 2）同时本文档中静态资源较多，拉取编译结果较大；
+ 3）github 拉较大资源速度稳定性无法保障，原因你懂的；相对来说用webhook方式已经够了。

```json
language: node_js

sudo: false

node_js:
  - "12"

cache:
  yarn: true
  directories:
    - node_modules

branches:
  only:
    - master

env:
  global:
    - GITHUB_REPO: github.com/realpdai/tech-arch-doc.git

before_install:
  - export TZ=Asia/Shanghai

script:
  - vuepress build
```
#### 触发编译

![](/_images/blog/blog-ci-4.png)

#### 查看最后提交编译状况

![](/_images/blog/blog-ci-5.png)


![](/_images/blog/blog-ci-6.png)


