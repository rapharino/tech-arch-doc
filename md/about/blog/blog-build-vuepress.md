## 关于文档 - 文档的搭建

> 将博客逐渐迁移至vuepress。 @pdai

### 文档基础搭建
> 文档的搭建比较简单，主要记录流程。

先看下其整体的插件架构案例：https://vuepress.vuejs.org/zh/plugin/

![](/_images/blog/blog-architecture.png)




#### brew安装或者更新

https://blog.csdn.net/yemao_guyue/article/details/80575532

更换 Brew 镜像源
https://blog.csdn.net/zhxuan30/article/details/81517446

#### 更新node和npm

https://blog.csdn.net/bz151531223/article/details/80081565

https://www.jianshu.com/p/39ef3b51ca6f

方法1： 手动删除/usr/local/bin 下面的node和npm文件 
方法2： 覆盖现有版本brew link --overwrite node

#### 全局安装vuepress

```shell
yarn global add vuepress
```

#### 拉取示例代码
> 我参考了mybatis-plus的文档，在此基础上搭建更容易些。

+ 示例代码

https://github.com/baomidou/mybatis-plus-doc

+ 运行效果

https://mybatis.plus/

+ 查看package.json

进入项目目录

```json
{
  "name": "mybatis-plus-doc",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "vuepress dev",
    "build": "vuepress build"
  },
  "devDependencies": {
    "vuepress": "^1.0.2"
  }
}
```

+ 要生成静态的 HTML 文件，运行：

> 默认情况下，文件将会被生成在 .vuepress/dist，当然，你也可以通过 .vuepress/config.js 中的 dest 字段来修改，生成的文件可以部署到任意的静态文件服务器上

请参考官网 https://vuepress.vuejs.org/zh/guide/getting-started.html#%E5%85%A8%E5%B1%80%E5%AE%89%E8%A3%85

```shell
yarn build 
```

#### 完整示例参考

https://segmentfault.com/a/1190000015237352


### 文档搭建插件和配置
> 这里主要介绍文档搭建除了默认加载的配置和插件之外，新增加的插件和配置。

#### 文档附加样式配置：主题

最佳配置请参考：（其它官网的配置都没有更新）

https://vuepress.vuejs.org/zh/miscellaneous/design-concepts.html#overriding

+ index.styl - 覆盖的样式
```stylus
.custom-page-class{
    /* 自定义的样式 */
}

// markdown blockquote
blockquote
  font-size 1rem
  color #2c3e50;
  border-left .5rem solid #42b983
  background-color #f3f5f7
  margin 1rem 0
  padding 1rem 0 1rem 1rem

  & > p
    margin 0

// markdown h2
h2
  font-size 1.65rem
  padding-bottom 1rem
  border-bottom 1px solid $borderColor
```

+ palette.styl - 样式配置覆盖
```stylus
// 内容的宽度
$contentWidth = 100%

// 颜色
$accentColor = #3eaf7c
$textColor = #2c3e50
$borderColor = #eaecef
$codeBgColor = #282c34
```

#### 添加返回最上插件

https://vuepress.vuejs.org/zh/plugin/official/plugin-back-to-top.html#%E5%AE%89%E8%A3%85

#### 添加图片缩放插件

https://vuepress.vuejs.org/zh/plugin/official/plugin-medium-zoom.html

#### 添加评论插件

https://vssue.js.org/guide/#how-vssue-works

#### 添加文档的导出

自己写了文档PDF的导出功能：Page = Group1+...GroupN, Group = Current1+...CurrentN
+ 当前页面导出
+ Group页面导出
+ Page页面导出

#### 添加svg label标签

https://shields.io/


<p align="center">
  <a href="https://travis-ci.com/realpdai/tech-arch-doc.svg?branch=master" target="_blank">
    <img src="https://travis-ci.com/realpdai/tech-arch-doc.svg?branch=master">
  </a>
  <a href="https://github.com/realpdai/tech-arch-doc/blob/master/LICENSE" target="_blank">
    <img src="https://img.shields.io/github/license/realpdai/tech-arch-doc">
  </a>
<a href="https://github.com/realpdai/tech-arch-doc" target="_blank">
    <img src="https://img.shields.io/badge/pdai-full%20stack-blue">
  </a>
  	
</p>