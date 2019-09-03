## Spring Boot - Elatiscsearch CRUD
> 本例展示一个ElasticSearch CURD 的Demo。 @pdai

### 注意事项

+ ElasticSearch 可以直接使用java elasticsearch.jar，也可以使用spring data封装的，还可以直接使用Springboot starter自动配置；在写代码时，你可以直接调用原生的接口，也可以调用ElasticSearchTemplate(ElasticSearchOptions), 还可以调用JPA形式的ElasticSearchRepository类；

+ 常规来说，采用spring-boot-starter-data-elasticsearch会简单很多，但是在有些动态的复合查询时，或者结合多index动态查询时，需要考虑一定的业务二次封装；可以参考我在[springboot多数据源](md/spring/springboot-data-multi.md)中针对ElasticSearch封装代码。

+ 需要注意jar和es版本匹配问题，比如现在最新的Springboot 2.1.7中使用的版本是ES 6.4.3; 而在本例中Springboot 1.5.8.RELEASE使用的对应的ES版本是2.4.x;

+ 在新的ES版本中提供的了性能的提升和功能增强（比如增加了keyword防止默认分词），底层Luence版本提升等等。所以在升级ES版本的时候需要考虑下游应用的兼容性问题，看是否需要同步提升Spring相关组件的版本，及接口适配等。

### 简单示例相关代码
+ Pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>

	<groupId>org.nasir</groupId>
	<artifactId>spring-boot-elasticsearch-data-demo</artifactId>
	<version>0.0.1-SNAPSHOT</version>
	<packaging>jar</packaging>

	<name>spring-boot-elasticsearch-data-demo</name>
	<description>Integration of Elasticsearch with SpringData</description>

	<parent>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-parent</artifactId>
		<version>1.5.8.RELEASE</version>
		<relativePath/> <!-- lookup parent from repository -->
	</parent>

	<properties>
		<project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
		<java.version>1.8</java.version>
	</properties>

	<dependencies>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-data-elasticsearch</artifactId>
		</dependency>

		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-web</artifactId>
		</dependency>

        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <scope>provided</scope>
        </dependency>

		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-test</artifactId>
			<scope>test</scope>
		</dependency>
		
		<dependency>
			<groupId>io.springfox</groupId>
			<artifactId>springfox-swagger2</artifactId>
			<version>2.9.2</version>
		</dependency>
		<!-- 
		<dependency> 
			<groupId>io.springfox</groupId>
			<artifactId>springfox-swagger-ui</artifactId> 
			<version>2.9.2</version> 
		</dependency> -->
		
		<!-- https://mvnrepository.com/artifact/com.github.xiaoymin/swagger-bootstrap-ui -->
		<dependency>
			<groupId>com.github.xiaoymin</groupId>
			<artifactId>swagger-bootstrap-ui</artifactId>
			<version>1.9.5</version>
		</dependency>
		
	</dependencies>
	
	<build>
		<plugins>
			<plugin>
				<groupId>org.springframework.boot</groupId>
				<artifactId>spring-boot-maven-plugin</artifactId>
			</plugin>
		</plugins>
	</build>
	

</project>
```

+ application.yml

```json
spring:
  data:
    elasticsearch:
      cluster-name: es-logs-01
      cluster-nodes: 10.11.60.5:9300
      repositories:
        enabled: true
```

+ Swagger 配置

```java
package com.pdai.elasticsearch.springdata.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@Configuration
@EnableSwagger2
public class SwaggerConfig {

	@Bean
	public Docket createRestApi() {
		return new Docket(DocumentationType.SWAGGER_2).apiInfo(apiInfo()).select()
				.apis(RequestHandlerSelectors.basePackage("com.pdai.elasticsearch")).paths(PathSelectors.any()).build();
	}

	private ApiInfo apiInfo() {
		return new ApiInfoBuilder().title("Pdai's API").description("swagger-bootstrap-ui")
				.termsOfServiceUrl("http://localhost:8080/").version("1.0").build();
	}
}
```

+ App

```java
package com.pdai.elasticsearch.springdata;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.pdai.elasticsearch.springdata.model.Director;
import com.pdai.elasticsearch.springdata.model.Genre;
import com.pdai.elasticsearch.springdata.model.Movie;
import com.pdai.elasticsearch.springdata.service.MovieService;

import springfox.documentation.swagger2.annotations.EnableSwagger2;

/**
 * <b>ClassName</b>: ElasticsearchSpringDataApplication <br/>
 *
 * <b>Description</b>: ElasticsearchSpringDataApplication <br/>
 *
 * <b>Date</b>: Jan 8, 2019 4:46:36 PM <br/>
 * 
 * @author pdai
 * @version Jan 8, 2019
 *
 */
@SpringBootApplication
@EnableSwagger2
public class ElasticsearchSpringDataApplication implements CommandLineRunner {

	private static final Logger logger = LoggerFactory.getLogger(ElasticsearchSpringDataApplication.class);

	@Autowired
	private MovieService movieService;

	public static void main(String[] args) {
		SpringApplication.run(ElasticsearchSpringDataApplication.class, args);
	}

	@Override
	public void run(String... strings) throws Exception {
		addMovies();

		List<Movie> dabanggNamedQuery = movieService.getByName("Batman");
		logger.info("Content of Batman name movie {}", dabanggNamedQuery);

		List<Movie> readyMovieQuery = movieService.getByName("Batman");
		logger.info("Content of Batman name movie {}", readyMovieQuery);

		List<Movie> byRating = movieService.getByRatingInterval(7d, 9d);
		logger.info("Content of movie by rating 7 9 {}", byRating);
	}

	private void addMovies() {
		Movie movie1 = getFirstMovie();
		movieService.addMovie(movie1);

		Movie movie2 = getSecondMovie();
		movieService.addMovie(movie2);

		Movie mvoie3 = getThirdMovie();
		movieService.addMovie(mvoie3);

		Movie movie4 = getForthMovie();
		movieService.addMovie(movie4);
	}

	private Movie getFirstMovie() {
		Movie firstMovie = new Movie();
		firstMovie.setId(1l);
		firstMovie.setRating(8.4d);
		firstMovie.setName("Batman v Superman: Dawn of Justice");

		Director director = new Director("Zack Snyder");
		firstMovie.setDirector(director);

		List<Genre> genres = new ArrayList<Genre>();
		genres.add(new Genre("DRAMA"));
		genres.add(new Genre("ACTION"));

		firstMovie.setGenre(genres);

		return firstMovie;
	}

	private Movie getSecondMovie() {
		Movie secondMovie = new Movie();
		secondMovie.setId(2l);
		secondMovie.setRating(9.4d);
		secondMovie.setName("The Dark Knight Rises");

		Director director = new Director("Christopher Nolan");
		secondMovie.setDirector(director);

		List<Genre> genres = new ArrayList<Genre>();
		genres.add(new Genre("ROMANTIC"));
		genres.add(new Genre("ACTION"));

		secondMovie.setGenre(genres);

		return secondMovie;
	}

	private Movie getThirdMovie() {
		Movie thirdMovie = new Movie();
		thirdMovie.setId(3l);
		thirdMovie.setRating(8d);
		thirdMovie.setName("Batman Begins");

		Director director = new Director("Christopher Nolan");
		thirdMovie.setDirector(director);

		List<Genre> genres = new ArrayList<Genre>();
		genres.add(new Genre("ROMANTIC"));
		genres.add(new Genre("ACTION"));

		thirdMovie.setGenre(genres);

		return thirdMovie;
	}

	private Movie getForthMovie() {
		Movie forthMovie = new Movie();
		forthMovie.setId(4l);
		forthMovie.setRating(8d);
		forthMovie.setName("Batman & Robin");

		Director director = new Director("Joel Schumacher");
		forthMovie.setDirector(director);

		List<Genre> genres = new ArrayList<Genre>();
		genres.add(new Genre("ROMANTIC"));
		genres.add(new Genre("ACTION"));

		forthMovie.setGenre(genres);

		return forthMovie;
	}
}
```

+ Entity

```java
package com.pdai.elasticsearch.springdata.model;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * <b>ClassName</b>: Movie <br/>
 *
 * <b>Description</b>: Movie <br/>
 *
 * <b>Date</b>: Jan 8, 2019 4:46:05 PM <br/>
 * 
 * @author pdai
 * @version Jan 8, 2019
 *
 */
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Document(indexName = "movie-store", type = "movie", shards = 1, replicas = 0)
public class Movie {

	@Id
	private Long id;

	private String name;

	@Field(type = FieldType.Nested)
	private List<Genre> genre;

	private Double rating;

	@Field(type = FieldType.Nested)
	private Director director;

}
```

```java
package com.pdai.elasticsearch.springdata.model;

import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;
import lombok.ToString;

/** 
 * <b>ClassName</b>: Genre <br/> 
 *
 * <b>Description</b>: Genre <br/> 
 *
 * <b>Date</b>: Jan 8, 2019 4:45:54 PM <br/> 
 * 
 * @author pdai
 * @version Jan 8, 2019
 *
 */
@Getter
@Setter
@ToString
public class Genre {

    @NonNull
    private String name;

    public Genre() {
    	
    }
	public Genre(String name) {
		super();
		this.name = name;
	}
}
```

```java
package com.pdai.elasticsearch.springdata.model;

import java.util.List;

import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;
import lombok.ToString;

/** 
 * <b>ClassName</b>: Director <br/> 
 *
 * <b>Description</b>: Director <br/> 
 *
 * <b>Date</b>: Jan 8, 2019 4:45:47 PM <br/> 
 * 
 * @author pdai
 * @version Jan 8, 2019
 *
 */
@Getter
@Setter
@ToString
public class Director {

    @NonNull
    private String name;

    private List<Movie> movies;

    public Director() {
    	
    }
    public Director(String name) {
    	super();
		this.name = name;
    }
	public Director(String name, List<Movie> movies) {
		super();
		this.name = name;
		this.movies = movies;
	}
    
}
```

+ Dao

```java
package com.pdai.elasticsearch.springdata.repository;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import com.pdai.elasticsearch.springdata.model.Director;
import com.pdai.elasticsearch.springdata.model.Movie;

import java.util.List;

/**
 * <b>ClassName</b>: MovieRepository <br/>
 *
 * <b>Description</b>: MovieRepository <br/>
 *
 * <b>Date</b>: Jan 8, 2019 4:45:31 PM <br/>
 * 
 * @author pdai
 * @version Jan 8, 2019
 *
 */
@Repository
public interface MovieRepository extends ElasticsearchRepository<Movie, Long> {

	List<Movie> findByName(String name);

	List<Movie> findByRatingBetween(Double start, Double end);

	List<Movie> findByDirector(Director director);
}
```

+ Service

```java
package com.pdai.elasticsearch.springdata.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pdai.elasticsearch.springdata.model.Director;
import com.pdai.elasticsearch.springdata.model.Movie;
import com.pdai.elasticsearch.springdata.repository.MovieRepository;

/** 
 * <b>ClassName</b>: MovieService <br/> 
 *
 * <b>Description</b>: MovieService <br/> 
 *
 * <b>Date</b>: Jan 8, 2019 4:45:19 PM <br/> 
 * 
 * @author pdai
 * @version Jan 8, 2019
 *
 */
@Service
public class MovieService {

	@Autowired
	private MovieRepository movieRepository;

	public List<Movie> getByName(String name) {
		return movieRepository.findByName(name);
	}

	public List<Movie> getByRatingInterval(Double start, Double end) {
		return movieRepository.findByRatingBetween(start, end);
	}

	public Movie addMovie(Movie movie) {
		return movieRepository.save(movie);
	}

	public void deleteMovie(Long id) {
		movieRepository.delete(id);
	}

	public List<Movie> findByDirector(Director director) {
		return movieRepository.findByDirector(director);
	}

}
```

+ Controller - ElasticResource

```java
package com.pdai.elasticsearch.springdata.api;

import java.util.Map;

import org.elasticsearch.client.Client;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.ElasticsearchTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pdai.elasticsearch.springdata.model.Movie;

/** 
 * <b>ClassName</b>: ElasticResource <br/> 
 *
 * <b>Description</b>: ElasticResource <br/> 
 *
 * <b>Date</b>: Jan 8, 2019 4:46:25 PM <br/> 
 * 
 * @author pdai
 * @version Jan 8, 2019
 *
 */
@RestController
public class ElasticResource {

    @Autowired
    private ElasticsearchOperations elasticsearchOperations;

    @Autowired
    private ElasticsearchTemplate elasticsearchTemplate;


    @GetMapping("/elastic/details")
    public ResponseEntity<Map<String, String>> getElasticInformation() {

        Client client = elasticsearchOperations.getClient();
        Map<String, String> asMap = client.settings().getAsMap();
        return ResponseEntity.ok(asMap);
    }

    @PutMapping("/elastic/clear-indices")
    public void clearIndices() {
        elasticsearchTemplate.deleteIndex(Movie.class);
        elasticsearchTemplate.createIndex(Movie.class);
        elasticsearchTemplate.putMapping(Movie.class);
        elasticsearchTemplate.refresh(Movie.class);
    }
}
```

+ Controller - MovieResource

```java
package com.pdai.elasticsearch.springdata.api;

import java.net.URI;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.pdai.elasticsearch.springdata.model.Movie;
import com.pdai.elasticsearch.springdata.service.MovieService;

/** 
 * <b>ClassName</b>: MovieResource <br/> 
 *
 * <b>Description</b>: MovieResource <br/> 
 *
 * <b>Date</b>: Jan 8, 2019 4:46:13 PM <br/> 
 * 
 * @author pdai
 * @version Jan 8, 2019
 *
 */
@RestController
public class MovieResource {

    private MovieService movieService;

    @Autowired
    public MovieResource(MovieService movieService) {
        this.movieService = movieService;
    }

    @PostMapping("/movie/add")
    public ResponseEntity<Movie> addMovie(@RequestBody  Movie newMovie) {
        Movie savedMovie = movieService.addMovie(newMovie);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path(
                "/{id}").buildAndExpand(savedMovie.getId()).toUri();
        return ResponseEntity.created(location).body(savedMovie);
    }

    @DeleteMapping("/movie/{id}/delete")
    public ResponseEntity<String> deleteMovie(@PathVariable("id") Long movieId) {
        movieService.deleteMovie(movieId);
        return ResponseEntity.ok("Deleted");
    }

    @GetMapping("/movie/get-by-name/{name}")
    public ResponseEntity<List<Movie>> findMovieByName(@PathVariable("name") String movieName) {
        List<Movie> fetchedMovie = movieService.getByName(movieName);
        return ResponseEntity.ok(fetchedMovie);
    }
}

```

+ 示例
* http://localhost:8080/elastic/clear-indices
* http://localhost:8080/elastic/details

### 源码示例

@See https://github.com/realpdai/springboot-data-es-demo

