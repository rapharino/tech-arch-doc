## ElasticSearch - WrapperQuery
> 在工作中遇到ElasticSearch版本升级时出现Java High Level接口变更导致的兼容性问题：之前使用的是2.4.x，考虑性能和功能的增强，需要更换为6.4.x; 2.4.x中我们使用DSL语句直接查询（数据的不确定性和方便动态建立查询规则等因素），而新的ES Java 高阶API中去掉了相关接口的支持。 此文主要记录通过 ES Wrapper Query实现对6.x版本中 Java high-level transport client对json DSL查询对支持。 @pdai


### 实现方式理论基础

+ Wrapper Query 官网说明

https://www.elastic.co/guide/en/elasticsearch/reference/6.4/query-dsl-wrapper-query.html

> This query is more useful in the context of the Java high-level REST client or transport client to also accept queries as json formatted string. In these cases queries can be specified as a json or yaml formatted string or as a query builder (which is a available in the Java high-level REST client).

```json
GET /_search
{
    "query" : {
        "wrapper": {
            "query" : "eyJ0ZXJtIiA6IHsgInVzZXIiIDogIktpbWNoeSIgfX0=" // Base64 encoded string: {"term" : { "user" : "Kimchy" }}
        }
    }
}
```


+ 将DSL JSON语句 转成 map

https://blog.csdn.net/qq_41370896/article/details/83658948

```java
String dsl = "";
Map maps = (Map)JSON.parse(dsl);  
maps.get("query");// dsl query string
```

+ Java 代码

https://blog.csdn.net/tcyzhyx/article/details/84566734

https://www.jianshu.com/p/216ca70d9e62

```java
StringBuffer dsl = new StringBuffer();
dsl.append("{\"bool\": {");
dsl.append("      \"must\": [");
dsl.append("        {");
dsl.append("          \"term\": {");
dsl.append("            \"mdid.keyword\": {");
dsl.append("              \"value\": \"2fa9d41e1af460e0d47ce36ca8a98737\"");
dsl.append("            }");
dsl.append("          }");
dsl.append("        }");
dsl.append("      ]");
dsl.append("    }");
dsl.append("}");
WrapperQueryBuilder wqb = QueryBuilders.wrapperQuery(dsl.toString());
SearchResponse searchResponse = client.prepareSearch(basicsysCodeManager.getYjzxYjxxIndex())
.setTypes(basicsysCodeManager.getYjzxYjxxType()).setQuery(wqb).setSize(10).get();
SearchHit[] hits = searchResponse.getHits().getHits();
for(SearchHit hit : hits){
	String content = hit.getSourceAsString();
	System.out.println(content);
}
```

+ query + agg 应该怎么写

http://www.itkeyword.com/doc/1009692843717298639/wrapperquerybuilder-aggs-query-throwing-query-malformed-exception

```json
"{\"query\":{\"match_all\": {}},\"aggs\":{\"avg1\":{\"avg\":{\"field\":\"age\"}}}}"
```


```java
SearchSourceBuilder ssb = new SearchSourceBuilder();

// add the query part
String query ="{\"match_all\": {}}";
WrapperQueryBuilder wrapQB = new WrapperQueryBuilder(query);
ssb.query(wrapQB);

// add the aggregation part
AvgBuilder avgAgg = AggregationBuilders.avg("avg1").field("age");
ssb.aggregation(avgAgg);
```


### 实现示例

略


