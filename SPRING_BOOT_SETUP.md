# Configurazione Spring Boot per il Frontend

## Aggiungere CORS Configuration

Crea un file `CorsConfig.java` nel tuo progetto Spring Boot:

```java
package com.example.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173", "http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("Content-Type", "Authorization")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

## Properties per Session

Nel file `application.properties` o `application.yml`:

### application.properties
```properties
# Session Configuration
server.servlet.session.cookie.http-only=true
server.servlet.session.cookie.same-site=lax
server.servlet.session.cookie.name=JSESSIONID

# Security Headers
server.servlet.session.tracking-modes=cookie
```

### application.yml
```yaml
server:
  servlet:
    session:
      cookie:
        http-only: true
        same-site: lax
        name: JSESSIONID
      tracking-modes: cookie
```

## Struttura Consigliata del Progetto Spring Boot

```
src/main/java/com/example/
├── config/
│   ├── CorsConfig.java
│   └── SecurityConfig.java
├── controller/
│   ├── AuthController.java
│   ├── BlogController.java
│   └── PostController.java
├── service/
│   ├── AuthService.java
│   ├── BlogService.java
│   └── PostService.java
├── model/
│   ├── User.java
│   ├── Blog.java
│   └── BlogPost.java
├── repository/
│   ├── UserRepository.java
│   ├── BlogRepository.java
│   └── PostRepository.java
└── PortfoliosAppApplication.java
```

## Dipendenze Maven da Aggiungere

Nel `pom.xml`:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>

<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>runtime</scope>
</dependency>

<!-- Per JWT (opzionale) -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.3</version>
</dependency>

<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.12.3</version>
    <scope>runtime</scope>
</dependency>

<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.12.3</version>
    <scope>runtime</scope>
</dependency>
```

## API Response Formato

Mantieni coerenza con il frontend. Ecco i format attesi:

### Login Response (200 OK)
```json
{
  "id": "user-123",
  "email": "user@example.com",
  "name": "John Doe"
}
```

### Auth Me Response (200 OK)
```json
{
  "id": "user-123",
  "email": "user@example.com",
  "name": "John Doe"
}
```

### Auth Me Response (401 Unauthorized)
```json
{
  "message": "Unauthorized"
}
```

### Blogs List Response (200 OK)
```json
[
  {
    "id": "blog-1",
    "title": "Mio Blog",
    "description": "Descrizione del blog",
    "author": "John Doe",
    "authorId": "user-123",
    "createdAt": "2026-02-05T10:00:00Z",
    "updatedAt": "2026-02-05T10:00:00Z",
    "postCount": 5
  }
]
```

### Posts My Response (200 OK)
```json
[
  {
    "id": "post-1",
    "title": "Primo Post",
    "content": "Contenuto del post...",
    "createdAt": "2026-02-05T10:00:00Z",
    "updatedAt": "2026-02-05T10:00:00Z"
  }
]
```

### Error Response (4xx/5xx)
```json
{
  "message": "Descrizione dell'errore",
  "timestamp": "2026-02-05T10:00:00Z",
  "status": 400
}
```

## Testing con cURL

```bash
# Test login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}' \
  -c cookies.txt

# Test auth me (con cookie)
curl http://localhost:8080/api/auth/me \
  -b cookies.txt

# Test get blogs
curl http://localhost:8080/api/blogs
```

## Avviare il Backend

```bash
# Con Maven
mvn spring-boot:run

# Con Gradle
gradle bootRun

# Con JAR
java -jar target/portfoliosapp-0.0.1-SNAPSHOT.jar
```

Assicurati che l'app sia in ascolto su `http://localhost:8080`
