module.exports = {
    port: "3000",
    dest: "docs",
    ga: "UA-85414008-1",
    base: "/",
    markdown: {
        lineNumbers: true,
        externalLinks: {
            target: '_blank', rel: 'noopener noreferrer'
        }
    },
    locales: {
        "/": {
            lang: "zh-CN",
            title: "Java 全栈知识体系",
            description: "Java 全栈知识体系"
        }
    },
    head: [["link", {rel: "icon", href: `/favicon.ico`}]],
    plugins: [
        ['@vuepress/back-to-top', true]
    ],
    themeConfig: {
        repo: "realpdai/tech-arch-doc",
        docsRepo: "realpdai/tech-arch-doc",
        editLinks: true,
        sidebarDepth:0,
        locales: {
            "/": {
                label: "简体中文",
                selectText: "Languages",
                editLinkText: "在 GitHub 上编辑此页",
                lastUpdated: "上次更新",
                nav: [
                    {
                        text: 'Java 相关',
                        items: [
                            {text: 'Java 基础', link: '/md/java/basic/java-basic-oop.md'},
                            {text: 'Java 集合框架', link: '/md/java/collection/java-collection-all.md'},
                            {text: 'Java 多线程与并发', link: '/md/java/thread/java-thread.md'},
                            {text: 'Java IO/NIO/AIO', link: '/md/java/io/java-io.md'},
                            {text: 'Java8 特性详解', link: '/md/java/java8/java8.md'}
                        ]
                    },
                    {
                        text: 'Spring 相关',
                        items: [
                            {text: 'Spring 基础', link: '/md/spring/spring.md'},
                            {text: 'Spring Boot 入门', link: '/md/spring/springboot-helloworld.md'},
                            {text: 'Spring Boot 进阶', link: '/md/spring/springboot-data-multi.md'}
                        ]
                    },
                    {
                        text: '数据库相关',
                        items: [
                            {
                                text: '数据库原理和SQL',
                                items: [
                                    {text: '数据库原理', link: '/md/db/sql/sql-db.md'},
                                    {text: 'SQL语言', link: '/md/db/sql-lan/sql-lan.md'}
                                ]
                            },
                            {
                                text: 'SQL DB',
                                items: [
                                    {text: 'MySQL', link: '/md/db/sql-mysql/sql-mysql-theory.md'}
                                ]
                            },
                            {
                                text: 'NoSQL DB',
                                items: [
                                    {text: 'ElasticSearch', link: '/md/db/nosql-es/elasticsearch.md'},
                                    {text: 'MongoDB', link: '/md/db/nosql-mongo/mongo.md'}
                                ]
                            }
                        ]
                    },
                    {
                        text: '工具与部署',
                        items: [
                            {text: '开发工具', link: '/md/devops/tool/tool-git.md'},
                            {text: 'Linux', link: '/md/devops/linux/linux.md'}
                        ]
                    },
                    {
                        text: '原则|模式|规范',
                        items: [
                            {text: '开发原则,流程,协议', link: '/md/dev-spec/spec/dev-rules.md'},
                            {text: '代码规范', link: '/md/dev-spec/code-style/code-style-alibaba.md'},
                            {text: '设计模式', link: '/md/dev-spec/pattern/1_overview.md'}
                        ]
                    }
                ],
                sidebar: {
                    "/md/spring/": genSidebar4Spring(),
                    "/md/java/": genSidebar4Java(),
                    "/md/db/": genSidebar4DB(),
                    "/md/devops/": genSidebar4Devops(),
                    "/md/dev-spec/": genSidebar4Devspec()
                }
            }
        }
    }
};

// Dev-spec page
function genSidebar4Devspec(){
    return [
        {
            title: "开发原则,流程,协议",
            collapsable: false,
            sidebarDepth: 0, 
            children: [
                "spec/dev-rules.md",
                "spec/dev-workflow.md", 
                "spec/dev-opensource.md", 
                "spec/dev-knowledge.md"
            ]
        },
        {
            title: "代码规范",
            collapsable: false,
            sidebarDepth: 0, 
            children: [
                "code-style/code-style-alibaba.md", 
                "code-style/code-style-twitter.md"
            ]
        },
        {
            title: "设计模式",
            collapsable: false,
            sidebarDepth: 0, 
            children: [
                "pattern/1_overview.md", 
                "pattern/2_singleton.md", 
                "pattern/3_simple_factory.md", 
                "pattern/4_factory_method.md",
                "pattern/5_abstract_factory.md",
                "pattern/6_builder.md",
                "pattern/7_prototype.md",
                "pattern/8_facade.md",
                "pattern/9_adapter.md",
                "pattern/10_bridge.md",
                "pattern/11_compsite.md",
                "pattern/12_decorator.md",
                "pattern/13_flyweight.md",
                "pattern/14_proxy.md",
                "pattern/15_chain.md",
                "pattern/16_strategy.md",
                "pattern/17_template.md",
                "pattern/18_command.md",
                "pattern/19_observer.md",
                "pattern/20_visitor.md",
                "pattern/21_state.md",
                "pattern/22_interpreter.md",
                "pattern/23_iterator.md",
                "pattern/24_mediator.md",
                "pattern/25_memento.md"
            ]
        }
    ];
}

// DevOPS page
function genSidebar4Devops(){
    return [
        {
            title: "开发工具",
            collapsable: false,
            sidebarDepth: 0, 
            children: [
                "tool/tool.md",
                "tool/tool-git.md", 
                "tool/tool-ide.md", 
                "tool/tool-maven.md", 
                "tool/tool-jenkins-gitlab.md"
            ]
        },
        {
            title: "Linux",
            collapsable: false,
            sidebarDepth: 0, 
            children: [
                "linux/linux.md", 
                "linux/linux-usage.md", 
                "linux/linux-curl.md", 
                "linux/linux-service.md"
            ]
        }
    ];
}

// DB page
function genSidebar4DB(){
    return [
        {
            title: "数据库基础和原理",
            collapsable: false,
            sidebarDepth: 0, 
            children: [
                "sql/sql-db.md", 
                "sql/sql-db-theory.md", 
                "sql/sql-db-transaction.md"
            ]
        },
        {
            title: "SQL 语言",
            collapsable: false,
            sidebarDepth: 0, 
            children: [
                "sql-lan/sql-lan.md", 
                "sql-lan/sql-lan-pratice.md",
                "sql-lan/sql-lan-leetcode.md",
                "sql-lan/sql-lan-optimize.md"
            ]
        },
        {
            title: "SQL - MySQL",
            collapsable: false,
            sidebarDepth: 0, 
            children: [
                "sql-mysql/sql-mysql-theory.md"
            ]
        },
        {
            title: "NoSQL - ElasticSearch",
            collapsable: false,
            sidebarDepth: 0, 
            children: [
                "nosql-es/elasticsearch.md", 
                "nosql-es/elasticsearch-theory.md", 
                "nosql-es/elasticsearch-setup.md", 
                "nosql-es/elasticsearch-dsl.md",
                "nosql-es/elasticsearch-wrapper-query.md"
            ]
        },
        {
            title: "NoSQL - MongoDB",
            collapsable: false,
            sidebarDepth: 0, 
            children: [ 
                "nosql-mongo/mongo.md",
                "nosql-mongo/mongo-performance-improve.md"
            ]
        }
        
    ];
}

// java page
function genSidebar4Java(){
    return [
        {
            title: "Java 基础",
            collapsable: false,
            sidebarDepth: 0, 
            children: [
                "basic/java-basic-oop.md", 
                "basic/java-basic-lan-basic.md",
                "basic/java-basic-lan-sum.md"
            ]
        },
        {
            title: "Java 集合框架",
            collapsable: false,
            sidebarDepth: 0, 
            children: [
                "collection/java-collection-all.md", 
                "collection/java-collection-ArrayList.md",
                "collection/java-collection-LinkedList.md",
                "collection/java-collection-Queue&Stack.md",
                "collection/java-collection-PriorityQueue.md",
                "collection/java-map-HashMap&HashSet.md",
                "collection/java-map-LinkedHashMap&LinkedHashSet.md",
                "collection/java-map-TreeMap&TreeSet.md",
                "collection/java-map-WeakHashMap.md",
            ]
        },
        {
            title: "Java 多线程与并发",
            collapsable: false,
            sidebarDepth: 1, 
            children: [
                "thread/java-thread.md", 
                "thread/java-thread-status.md", 
                "thread/java-thread-concurrent-basic.md", 
                "thread/java-thread-concurrent-class.md", 
                "thread/java-thread-threadlocal.md"
            ]
        },
        {
            title: "Java IO/NIO/AIO",
            collapsable: false,
            sidebarDepth: 0, 
            children: [
                "io/java-io.md", 
                "io/java-io-basic.md",
                "io/java-io-basic2.md",
                "io/java-io-basic3.md",
                "io/java-io-model.md",
                "io/java-io-nio.md",
                "io/java-io-nio-netty.md"
            ]
        },
        {
            title: "Java8 特性详解",
            collapsable: false,
            sidebarDepth: 0, 
            children: [
                "java8/java8.md", 
                "java8/java8-stream.md", 
                "java8/java8-optional.md", 
                "java8/java8-default.md", 
                "java8/java8-type-anno.md", 
                "java8/java8-anno-repeat.md", 
                "java8/java8-type.md", 
                "java8/java8-jre.md",
                "java8/java8-permgen.md",
                "java8/java8-stampedlock.md",
                "java8/java8-localdatetime.md",
                "java8/java8-javafx.md",
                "java8/java8-others.md"
            ]
        }
    ];
}

// spring page
function genSidebar4Spring() {
    return [
        {
            title: "Spring 基础",
            collapsable: false,
            sidebarDepth: 0, 
            children: [
                "spring", 
                "springmvc",
                "spring-bean-lifecycle",
                "spring-aop",
            ]
        },
        {
            title: "Spring Boot 入门",
            collapsable: false,
            children: [
                "springboot-helloworld",
                "springboot-data-swagger",
                "springboot-data-logback",
                "springboot-data-mybatis",
                "springboot-data-mongodb",
                "springboot-data-es",
                "springboot-data-websocket",
                "springboot-data-interface",
                "springboot-data-ratelimit",
                "springboot-data-quartz",
            ]
        },
        {
            title: "Spring Boot 进阶",
            collapsable: false,
            children: [
                "springboot-data-multi",
                "springboot-javaConfig",
                "springboot-jar-3rd",
                "springboot-starter-demo",
                "springboot-javafx-native"
            ]
        }
    ]
}

// TODO below
function _getNav(){

}
function _getSidebar(){

}
function _getSidebarPage(_pagePath){
    return _getSidebarGroups(_pagePath, 
        ["Java 基础","Java 集合框架","Java IO/NIO/AIO"],
        ["basic/", "collection/", 'io/'],
        [
            ["java-basic-oop.md", "java-basic-lan-basic.md", "java-basic-lan-sum.md"],
            ["java-collection-all.md", "java-collection-ArrayList.md", "java-collection-LinkedList.md", 
                "java-collection-Queue&Stack.md", "java-collection-PriorityQueue.md", "java-map-HashMap&HashSet.md",
                "java-map-LinkedHashMap&LinkedHashSet.md", "java-map-TreeMap&TreeSet.md", "java-map-WeakHashMap.md",
            ],
            [
                "java-io.md", 
                "java-io-basic.md",
                "java-io-basic2.md",
                "java-io-basic3.md",
                "java-io-model.md",
                "java-io-nio.md",
                "java-io-nio-netty.md"
            ]
        ]
    );
}
function _getSidebarGroups(_pagePath, _titles, _pathPrefixs, _contents){
    var groups = [];
    for(var i = 0; i<_ti.length; i++){
        groups.push(_getSidebarGroup(_pagePath, _titles[i], _pathPrefixs[i], _contents[i]));
    }
    return groups;
}
function _getSidebarGroup(_pagePath, _title, _prefixPath, _content){
    var content = [];
    for(var i = 0; i<_content.length; i++){
        content.push(_pagePath + _prefixPath + _content[i]);
    }
    return {
        title: _title,
        collapsable: false,
        sidebarDepth: 0, 
        children: content
    };
}