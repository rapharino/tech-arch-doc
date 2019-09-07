## 关于文档 - 文档的搭建

> 将博客逐渐迁移至vuepress。 @pdai

### brew安装或者更新

https://blog.csdn.net/yemao_guyue/article/details/80575532

更换 Brew 镜像源
https://blog.csdn.net/zhxuan30/article/details/81517446

### 更新node和npm

https://blog.csdn.net/bz151531223/article/details/80081565

https://www.jianshu.com/p/39ef3b51ca6f

方法1： 手动删除/usr/local/bin 下面的node和npm文件 
方法2： 覆盖现有版本brew link --overwrite node

### 全局安装vuepress

```shell
yarn global add vuepress
```

### 拉取示例代码

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

### 完整示例参考

https://segmentfault.com/a/1190000015237352


