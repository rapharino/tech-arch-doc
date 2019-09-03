## Spring Boot - 多个数据源Service层封装

> mysql, es, mongodb 三个数据源用配置文件方式连接，JPA只是正对dao做了封装，本文主要介绍如何对service层进行封装。 @pdai

+ 对多个数据源连接获取数据进行统一封装

+ ES spring-data方式不支持多个Index和Type的查找功能，添加了DynamicESDao支持

+ 大大简化封装之后的调用, 调用方式如下


### 类关系图

![](/_images/spring/springboot-data-multi-1.jpg)

### 封装的一些配置

#### application.yml

```json
banner:
  charset: UTF-8
  location: classpath:banner.txt
server:
  port: 5555
  contextPath: /
  session:
    timeout: 0
spring:
  application:
    name: 'spring-boot-datasource-demo'
  output:
    ansi:
      enabled: DETECT
  messages:
    basename: i18n/messages
  thymeleaf:
    cache: false
  profiles:
    active: dev
  
  # MySQL data source settings
  datasource:
    url: jdbc:mysql://localhost:3306/cdc_standalone?useSSL=false
    username: root
    password: bfXa4Pt2lUUScy8jakXf
  # MySQL JPA settings
  jpa:
    generate-ddl: true
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQLDialect
        format_sql: true
  # NoSQL data source settings  
  data:
    # MongoDB 2.2+ settings
    mongodb:
      uri: mongodb://standalone:fhY1tPt1lpUSbS7jwkTf@10.11.60.4:27017/standalone
    # ElasticSearch settings
    elasticsearch:
      cluster-name: es-logs-01
      cluster-nodes: 10.11.60.5:9300
```

#### pom.xml
```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>
	<groupId>spring-boot-datasource-demo</groupId>
	<artifactId>spring-boot-datasource-demo</artifactId>
	<version>0.0.1-SNAPSHOT</version>
	<name>spring-boot-datasource-demo</name>
	<description>spring-boot-datasource-demo</description>

	<parent>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-parent</artifactId>
		<version>1.4.1.RELEASE</version>
	</parent>

	<properties>
		<project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
		<project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
		<java.version>1.8</java.version>
		<commons.lang.version>3.3.2</commons.lang.version>
		<springfox.version>2.7.0</springfox.version>
	</properties>
	
	<dependencies>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-data-mongodb</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-data-elasticsearch</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-data-jpa</artifactId>
		</dependency>
		<dependency>
			<groupId>mysql</groupId>
			<artifactId>mysql-connector-java</artifactId>
			<scope>runtime</scope>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-web</artifactId>
		</dependency>
		
		<dependency>
			<groupId>io.springfox</groupId>
			<artifactId>springfox-swagger2</artifactId>
			<version>${springfox.version}</version>
		</dependency>
		<dependency>
			<groupId>io.springfox</groupId>
			<artifactId>springfox-swagger-ui</artifactId>
			<version>${springfox.version}</version>
		</dependency>
		
		<dependency>
			<groupId>com.alibaba</groupId>
			<artifactId>fastjson</artifactId>
			<version>1.2.15</version>
		</dependency>
		<dependency>
			<groupId>org.apache.commons</groupId>
			<artifactId>commons-lang3</artifactId>
			<version>${commons.lang.version}</version>
		</dependency>
		<dependency>
			<groupId>org.apache.commons</groupId>
			<artifactId>commons-collections4</artifactId>
			<version>4.1</version>
		</dependency>
		
		<dependency>
			<groupId>com.github.wenhao</groupId>
			<artifactId>jpa-spec</artifactId>
			<version>3.2.3</version>
		</dependency>
		
	</dependencies>

	<build>
		<sourceDirectory>src</sourceDirectory>
		<plugins>
			<plugin>
				<artifactId>maven-compiler-plugin</artifactId>
				<configuration>
					<source>1.8</source>
					<target>1.8</target>
				</configuration>
			</plugin>
		</plugins>
	</build>
</project>
```

### 封装后使用
> 封装之后使用将非常简单，公共的Service行为将被封装处理

#### MySQL 动态数据访问
> 通过几行代码即可实现对MySQL的访问，同时支持动态的条件查询；

+ User

```java
@Entity
@Table(name = "tb_user")
public class User extends BaseEntity {

	private static final long serialVersionUID = 1L;

	/**
	 * 用户id
	 */
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "id", nullable = false)
	private Integer id;
	private String userName;
	private String nickName;
	private String password;
	private Integer sex;
	private String telephone;
	private String email;
	private String address;
	private Integer deleteStatus;
	private Integer locked = 0;
	private String description;
	
	@JSONField(format = "yyyy-MM-dd HH:mm:ss")
	private Date createTime;
	@JSONField(format = "yyyy-MM-dd HH:mm:ss")
	private Date updateTime;

	@ManyToMany(cascade = { CascadeType.REFRESH }, fetch = FetchType.LAZY)
	@JoinTable(name = "tb_user_role", joinColumns = { @JoinColumn(name = "user_id") }, inverseJoinColumns = {
			@JoinColumn(name = "role_id") })
	private java.util.Set<Role> roles;

	// getter & setter
}
```

+ Dao

```java
@Repository
public interface IUserDao extends IBaseJpaDao<User, Integer>{
}
```

+ Service

```java
public interface IUserService extends IBaseJpaService<User, Integer> {
}
@Service
public class UserServiceImpl extends BaseJpaServiceImpl<User, Integer> implements IUserService {
	@Autowired
	private IUserDao userDao;
	@Override
	public IBaseJpaDao<User, Integer> getBaseDao() {
		return this.userDao;
	}
	@Override
	public void delete(Integer id) {
		User user = find(id);
		Assert.state(!"admin".equals(user.getUserName()), "超级管理员用户不能删除");
		super.delete(id);
	}
}
```

+ Controller

```java
@RestController
@RequestMapping("/admin/user")
public class UserController {

	/**
	 * user service
	 */
	@Autowired
	private IUserService userService;

	/**
	 * @param searchText
	 * @param user
	 * @param model
	 * @return
	 */
	@GetMapping(value = "/list")
	public List<User> list(@RequestParam(value = "searchText", required = false, defaultValue="a") String searchText) {
		return userService.findAll(Specifications.<User>and().like("userName", "%" + searchText + "%").build());
	}
}
```

### Mongo 动态数据访问
> 通过几行代码即可实现对Mongo的访问，同时支持动态的条件查询；

+ Entity

```java
@Document(collection = "security_alert_rules")
public class EventRule extends BaseEntity {

	private static final long serialVersionUID = -2013673868028645757L;
	
	public static final int EVENT_STATUS_ENABLE = 0, EVENT_STATUS_DISABLE = 1;

	private String component;
	private String name;
	private String eventId;
	private String ciaLevel;
	private String remarks;
	private String script;
	private long threshold;
	private long timeWindow;
	private String parseEsResultKeys;
	private String nameCN;
	private String remarkCN;
	private String ruleType;
	private String redisEventKey;
	private int status = EVENT_STATUS_ENABLE;

	// getter & setter
}
```

+ Dao

```java
@Repository
public interface IEventRuleDao extends IBaseMongoDao<EventRule, String> {
}
```

+ Service

```java
public interface IEventRuleService extends IBaseMongoService<EventRule, String> {
}
@Service
public class EventRuleServiceImpl extends BaseMongoServiceImpl<EventRule, String> implements IEventRuleService {
	@Autowired
	IEventRuleDao eventRuleDao;
	@Override
	public IBaseMongoDao<EventRule, String> getBaseDao() {
		return eventRuleDao;
	}
}
```

+ Controller

```java
@RestController
@RequestMapping("/admin/eventRule")
public class EventRuleController {

	/**
	 */
	@Autowired
	private IEventRuleService eventRuleService;

	/**
	 * @param searchText
	 * @param user
	 * @param model
	 * @return
	 */
	@GetMapping(value = "/list")
	public List<EventRule> list(@RequestParam(value = "searchText", required = false) String searchText) {
		EventRule param = new EventRule();
		param.setName(searchText);
//		Example<EventRule> rule = Example.<EventRule>of(param,
//				ExampleMatcher.matching().withMatcher("name", ExampleMatcher.GenericPropertyMatchers.exact()));
		Example<EventRule> rule = Example.<EventRule>of(param, ExampleMatcher.matching().withIgnoreCase("name","nameCN"));
		return eventRuleService.findAll(rule);
	}
}
```

### ElasticSearch 动态数据访问(单个index+type)
> 通过几行代码即可实现对ElasticSearch的访问，同时支持动态的条件查询；
适合数据类型比较固定，且index和type独立的，比如强类型映射的实体类；

+ Entity

```java
@Document(indexName="syslog", type="logs")
public class SysLog extends BaseEntity {

	private static final long serialVersionUID = -4491916941883088972L;
	
	@Id
	private String _id;

	private Set<String> phyPorts = new LinkedHashSet<>();

	private Set<String> ports = new LinkedHashSet<>();
	private String sensor;
	private int vlan;
	private Set<String> ip = new LinkedHashSet<>();
	private Set<String> mac = new LinkedHashSet<>();
	private String description;
	private String type;
	private String vendor;
	private long timestamp;
	private String name;
	private String chassisId;

	// getter & setter

}
```

+ Dao

```java
@Repository
public interface ISysLogDao extends IBaseESDao<SysLog, String> {
}
```

+ Service

```java
public interface ILogService extends IBaseESService<SysLog, String> {
}
@Service
public class LogServiceImpl extends BaseESServiceImpl<SysLog, String> implements ILogService {
	@Autowired
	ISysLogDao sysLogDao;
	@Override
	public IBaseESDao<SysLog, String> getBaseDao() {
		return sysLogDao;
	}
}
```

+ Controller

```java
@RestController
@RequestMapping("/admin/log")
public class LogController {
	/**
	 * user service
	 */
	@Autowired
	private ILogService logService;

	/**
	 * @param searchText
	 * @param user
	 * @param model
	 * @return
	 */
	@GetMapping(value = "/list")
	public Page<SysLog> list(@RequestParam(value = "searchText", required = false) String searchText) {
		return logService.search(QueryBuilders.matchQuery("_all", searchText), new PageRequest(0, 100));
	}
}
```



### ElasticSearch 动态数据访问(多个index+type)
> 通过几行代码即可实现对ElasticSearch的访问，同时支持动态的条件查询；
适合数据类型不固定，且index和type有多个，这些index具备相同结构类型，比如syslog-EVERY-DATE（由于日志量大，将每天的日志单独存放在一个Index中）；

+ Entity

```java
@Document(indexName="syslog", type="logs")
public class SysLog extends BaseEntity {

	private static final long serialVersionUID = -4491916941883088972L;
	
	@Id
	private String _id;

	private Set<String> phyPorts = new LinkedHashSet<>();

	private Set<String> ports = new LinkedHashSet<>();
	private String sensor;
	private int vlan;
	private Set<String> ip = new LinkedHashSet<>();
	private Set<String> mac = new LinkedHashSet<>();
	private String description;
	private String type;
	private String vendor;
	private long timestamp;
	private String name;
	private String chassisId;

	// getter & setter

}
```

+ Dao

```java
public interface IDymLogDao extends IDynamicEsDao<SysLog, String> {
}
@Repository
public class DymLogDaoImpl extends SimpleDynamicEsDaoImpl<SysLog, String> implements IDymLogDao {
	@Autowired
	protected ElasticsearchTemplate elasticsearchTemplate;
	@Override
	public ElasticsearchOperations getElasticsearchOperations() {
		return elasticsearchTemplate;
	}
}
```

+ Service

```java
public interface IDymLogService extends IDynamicESService<SysLog, String> {
}
@Service
public class DymLogServiceImpl extends DynamicESServiceImpl<SysLog, String> implements IDymLogService {
	@Autowired
	IDymLogDao sysLogDao;
	@Override
	public IDynamicEsDao<SysLog, String> getBaseDao() {
		return sysLogDao;
	}
}
```

+ Controller

```java
@RestController
@RequestMapping("/admin/dymLog")
public class DymLogController {

	/**
	 * logService
	 */
	@Autowired
	private IDymLogService logService;

	/**
	 * @param searchText
	 * @param user
	 * @param model
	 * @return
	 */
	@GetMapping(value = "/list")
	public Page<SysLog> list(
			@RequestParam(value = "searchText", required = false, defaultValue = "Siemens") String searchText) {
		QueryBuilder queryBuilder = QueryBuilders.matchQuery("vendor", searchText);
		return logService.search(new NativeSearchQueryBuilder().withIndices("syslog-2018-12-17").withTypes("logs")
				.withQuery(queryBuilder).build());
	}
}
```

### 源代码托管

https://github.com/realpdai/springboot-data-multidatasource-demo

