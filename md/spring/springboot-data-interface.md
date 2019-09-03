## Spring Boot - 访问外部接口
!> 在Spring-Boot项目开发中，存在着本模块的代码需要访问外面模块接口，或外部url链接的需求, 比如调用外部的地图API或者天气API。

> 参考 https://blog.csdn.net/polo2044/article/details/85002282

### 方案一： 采用原生的Http请求
在代码中采用原生的http请求，代码参考如下：

```java
@RequestMapping("/doPostGetJson")
public String doPostGetJson() throws ParseException {
   //此处将要发送的数据转换为json格式字符串
   String jsonText = "{id：1}";
   JSONObject json = (JSONObject) JSONObject.parse(jsonText);
   JSONObject sr = this.doPost(json);
   System.out.println("返回参数：" + sr);
   return sr.toString();
}

public static JSONObject doPost(JSONObject date) {
   HttpClient client = HttpClients.createDefault();
   // 要调用的接口方法
   String url = "http://192.168.1.101:8080/getJson";
   HttpPost post = new HttpPost(url);
   JSONObject jsonObject = null;
   try {
      StringEntity s = new StringEntity(date.toString());
      s.setContentEncoding("UTF-8");
      s.setContentType("application/json");
      post.setEntity(s);
      post.addHeader("content-type", "text/xml");
      HttpResponse res = client.execute(post);
      String response1 = EntityUtils.toString(res.getEntity());
      System.out.println(response1);
      if (res.getStatusLine().getStatusCode() == HttpStatus.SC_OK) {
         String result = EntityUtils.toString(res.getEntity());// 返回json格式：
         jsonObject = JSONObject.parseObject(result);
      }
   } catch (Exception e) {
      throw new RuntimeException(e);
   }
   return jsonObject;
}
```

### 方案二: 采用Feign进行消费
1、在maven项目中添加依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-feign</artifactId>
    <version>1.2.2.RELEASE</version>
</dependency>
```

2、编写接口，放置在service层

这里的decisionEngine.url 是配置在properties中的 是ip地址和端口号
decisionEngine.url=http://10.2.1.148:3333/decision/person 是接口名字

```java
@FeignClient(url = "${decisionEngine.url}",name="engine")
public interface DecisionEngineService {
　　@RequestMapping(value="/decision/person",method= RequestMethod.POST)
　　public JSONObject getEngineMesasge(@RequestParam("uid") String uid,@RequestParam("productCode") String productCode);

}
```

3、在Java的启动类上加上@EnableFeignClients

```java
@EnableFeignClients //参见此处
@EnableDiscoveryClient
@SpringBootApplication
@EnableResourceServer
public class Application   implements CommandLineRunner {
    private static final Logger LOGGER = LoggerFactory.getLogger(Application.class);
    @Autowired
    private AppMetricsExporter appMetricsExporter;

    @Autowired
    private AddMonitorUnitService addMonitorUnitService;

    public static void main(String[] args) {
        new SpringApplicationBuilder(Application.class).web(true).run(args);
    }    
}
```

4、在代码中调用接口即可
```java
@Autowired
private DecisionEngineService decisionEngineService ;
// ...
decisionEngineService.getEngineMesasge("uid" ,  "productCode");
```

### 方案三: 采用RestTemplate方法
> 在Spring-Boot开发中，RestTemplate同样提供了对外访问的接口API，这里主要介绍Get和Post方法的使用。Get请求提供了两种方式的接口getForObject 和 getForEntity，getForEntity提供如下三种方法的实现。

#### Get请求之——getForEntity(Stringurl,Class responseType,Object…urlVariables)

该方法提供了三个参数，其中url为请求的地址，responseType为请求响应body的包装类型，urlVariables为url中的参数绑定，该方法的参考调用如下：

```java
// http://USER-SERVICE/user?name={name)
RestTemplate restTemplate=new RestTemplate();
Map<String,String> params=new HashMap<>();
params.put("name","dada");  //
ResponseEntity<String> responseEntity=restTemplate.getForEntity("http://USERSERVICE/user?name={name}",String.class,params);
```

#### Get请求之——getForEntity(URI url,Class responseType)

该方法使用URI对象来替代之前的url和urlVariables参数来指定访问地址和参数绑定。URI是JDK java.net包下的一个类，表示一个统一资源标识符(Uniform Resource Identifier)引用。参考如下：

```java
RestTemplate restTemplate=new RestTemplate();
UriComponents uriComponents=UriComponentsBuilder.fromUriString("http://USER-SERVICE/user?name={name}")
    .build()
    .expand("dodo")
    .encode();
URI uri=uriComponents.toUri();
ResponseEntity<String> responseEntity=restTemplate.getForEntity(uri,String.class).getBody();
```

#### Get请求之——getForObject

getForObject方法可以理解为对getForEntity的进一步封装，它通过HttpMessageConverterExtractor对HTTP的请求响应体body内容进行对象转换，实现请求直接返回包装好的对象内容。getForObject方法有如下：

```java
getForObject(String url,Class responseType,Object...urlVariables)
getForObject(String url,Class responseType,Map urlVariables)
getForObject(URI url,Class responseType)
```

#### Post 请求
Post请求提供有三种方法，postForEntity、postForObject和postForLocation。其中每种方法都存在三种方法，postForEntity方法使用如下：

```java
RestTemplate restTemplate=new RestTemplate();
User user=newUser("didi",30);
ResponseEntity<String> responseEntity=restTemplate.postForEntity("http://USER-SERVICE/user",user,String.class); //提交的body内容为user对象，请求的返回的body类型为String
String body=responseEntity.getBody();
```

postForEntity存在如下三种方法的重载

```java
postForEntity(String url,Object request,Class responseType,Object... uriVariables)
postForEntity(String url,Object request,Class responseType,Map uriVariables)
postForEntity(URI url,Object request，Class responseType)
```
postForEntity中的其它参数和getForEntity的参数大体相同在此不做介绍。