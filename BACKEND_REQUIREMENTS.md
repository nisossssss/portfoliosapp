# Backend API Requirements

## Overview
Il frontend è stato configurato per collegarsi al backend Spring Boot su `http://localhost:8080`.

## Proxy Configuration
Tutte le richieste che iniziano con `/api/` vengono automaticamente inoltrate al backend tramite Vite proxy.

## Required Endpoints

### Authentication
- **POST** `/api/auth/login`
  - Body: `{ email: string, password: string }`
  - Response: `{ id: string, email: string, name?: string }`
  - Usa cookies per la sessione (credenziali: include)

- **GET** `/api/auth/me`
  - Response: `{ id: string, email: string, name?: string }`
  - Verifica se l'utente è autenticato tramite cookie

- **POST** `/api/auth/logout`
  - Logout e invalida la sessione

- **POST** `/api/auth/register` (opzionale)
  - Body: `{ email: string, password: string }`
  - Response: `{ id: string, email: string, name?: string }`

### Blogs
- **GET** `/api/blogs`
  - Response: `Blog[]`
  - Endpoint pubblico, mostra tutti i blog

- **GET** `/api/blogs/:id`
  - Response: `Blog`
  - Endpoint pubblico

- **GET** `/api/blogs/my`
  - Response: `Blog`
  - Blog dell'utente autenticato (richiede autenticazione)

- **POST** `/api/blogs`
  - Body: `{ title: string, description: string }`
  - Response: `Blog`
  - Crea blog per utente autenticato

- **PUT** `/api/blogs/:id`
  - Body: `{ title: string, description: string }`
  - Response: `Blog`
  - Modifica blog (solo utente proprietario)

### Posts
- **GET** `/api/posts/my`
  - Response: `BlogPost[]`
  - Tutti i post dell'utente autenticato

- **GET** `/api/blogs/:blogId/posts`
  - Response: `BlogPost[]`
  - Tutti i post di un blog

- **GET** `/api/posts/:id`
  - Response: `BlogPost`
  - Endpoint pubblico

- **POST** `/api/posts`
  - Body: `{ title: string, content: string }`
  - Response: `BlogPost`
  - Crea post per utente autenticato

- **PUT** `/api/posts/:id`
  - Body: `{ title: string, content: string }`
  - Response: `BlogPost`
  - Modifica post (solo proprietario)

- **DELETE** `/api/posts/:id`
  - Response: `{ success: boolean }`
  - Elimina post (solo proprietario)

## Data Models

### User
```ts
interface User {
  id: string;
  email: string;
  name?: string;
}
```

### Blog
```ts
interface Blog {
  id: string;
  title: string;
  description: string;
  author: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  postCount?: number;
}
```

### BlogPost
```ts
interface BlogPost {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
```

## CORS & Session Configuration

### Required CORS Headers
```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

### Cookie Configuration
Usa cookies HttpOnly per la sessione:
```
Set-Cookie: JSESSIONID=...; HttpOnly; SameSite=Lax; Path=/
```

## Development Checklist

- [ ] Endpoint `/api/auth/login` implementato
- [ ] Endpoint `/api/auth/me` implementato
- [ ] Endpoint `/api/blogs` GET implementato
- [ ] Endpoint `/api/posts/my` GET implementato
- [ ] Endpoint `/api/posts` POST implementato
- [ ] Endpoint `/api/posts/:id` DELETE implementato
- [ ] CORS configurato per http://localhost:5173
- [ ] Session cookies configurati
- [ ] Backend avviato su localhost:8080

## Testing

### 1. Verifica il proxy
```bash
curl http://localhost:5173/api/blogs
# Questo chiederà a localhost:8080/api/blogs
```

### 2. Avvia el backend
```bash
# Assicurati che Spring Boot stia girando su localhost:8080
mvn spring-boot:run
```

### 3. Avvia il frontend
```bash
npm run dev
# Apri http://localhost:5173
```

### 4. Testa il login
Prova ad accedere dall'interfaccia del frontend. Verificherai se i cookie sono impostati
e se `/api/auth/me` restituisce l'utente autenticato.
