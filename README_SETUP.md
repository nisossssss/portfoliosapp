# Portfolio App - Setup Completo

## 📋 Overview

Portfolio App è un'applicazione full-stack che permette agli utenti di creare e gestire i propri blog personali.

- **Frontend**: React + TypeScript + Vite
- **Backend**: Spring Boot (Java)
- **Database**: (Configurare in Spring Boot)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (`npm`)
- Java 17+ (per Spring Boot)
- Spring Boot 3.0+

### Frontend Setup

```bash
# 1. Installa dipendenze
npm install

# 2. Avvia il server di sviluppo
npm run dev

# Il frontend sarà disponibile su http://localhost:5173
```

### Backend Setup

```bash
# 1. Assicurati che il progetto Spring Boot sia nel tuo ambiente
# (vedi SPRING_BOOT_SETUP.md per la struttura consigliata)

# 2. Configura la connessione database in application.yml

# 3. Avvia Spring Boot
mvn spring-boot:run

# Il backend sarà disponibile su http://localhost:8080
```

## 📁 Struttura del Progetto

```
portfoliosapp/
├── src/
│   ├── components/
│   │   ├── Header.tsx           # Navigazione principale
│   │   ├── BlogList.tsx         # Lista pubblica dei blog
│   │   ├── Dashboard.tsx        # Pannello admin (protetto)
│   │   ├── Login.tsx            # Pagina di login
│   │   ├── ApiStatus.tsx        # Tool diagnostico API
│   │   └── ...
│   ├── contexts/
│   │   └── AuthContext.tsx      # Gestione autenticazione
│   ├── config/
│   │   └── api.ts              # Configurazione endpoint API
│   └── main.tsx
├── BACKEND_REQUIREMENTS.md      # Endpoint richiesti
├── SPRING_BOOT_SETUP.md        # Setup Spring Boot
├── vite.config.ts              # Configurazione Vite con proxy
└── package.json
```

## 🔗 Proxy e API

### Come Funziona il Proxy

Il file `vite.config.ts` contiene un proxy che reindirizza tutte le richieste `/api/*` a `http://localhost:8080`:

```ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    }
  }
}
```

Questo significa:
- Richiesta dal frontend: `GET /api/blogs`
- Viene inoltrata a: `GET http://localhost:8080/api/blogs`

### API Endpoints

Tutti gli endpoint sono documentati in `BACKEND_REQUIREMENTS.md`. I principali:

**Autenticazione:**
- `POST /api/auth/login` - Login utente
- `GET /api/auth/me` - Verifica sesione
- `POST /api/auth/logout` - Logout

**Blog (Pubblico):**
- `GET /api/blogs` - Lista tutti i blog
- `GET /api/blogs/:id` - Dettagli blog

**Post (Protetto):**
- `GET /api/posts/my` - I miei post
- `POST /api/posts` - Crea post
- `DELETE /api/posts/:id` - Elimina post

## 🔐 Flusso di Autenticazione

1. **Al caricamento dell'app**: `GET /api/auth/me` verifica se l'utente ha una sessione valida
2. **Login**: `POST /api/auth/login` invia email/password e riceve un cookie di sessione
3. **Navigazione**: 
   - Se autenticato → accesso a `/dashboard`
   - Se non autenticato → visualizza `/` (home pubblica)

## 🧪 Debugging

### Verificare la Connessione Backend

```bash
# Compila il TypeScript
npm run tsc

# Avvia il frontend
npm run dev

# Apri http://localhost:5173 in un browser
# Se il backend non è connesso, vedrai errori nella console
```

### Usa la Componente ApiStatus

Aggiungi questo al tuo App.tsx temporaneamente per diagnosticare i problemi:

```tsx
import ApiStatus from './components/ApiStatus';

// Nel render:
<ApiStatus />
```

Questo componente testerà automaticamente la connessione agli endpoint principali.

### Comandi Utili

```bash
# Validare TypeScript
npm run tsc

# Linting
npm run lint

# Build per produzione
npm run build

# Anteprima build
npm run preview
```

## 🌐 CORS e Cookies

### Requisiti Backend

Assicurati che il backend:

1. **Abiliti CORS** per `http://localhost:5173`
   ```java
   registry.addMapping("/api/**")
           .allowedOrigins("http://localhost:5173")
           .allowCredentials(true);
   ```

2. **Configuri i cookie di sessione**
   ```yaml
   server:
     servlet:
       session:
         cookie:
           http-only: true
           same-site: lax
   ```

## 📊 Features

### Home Page (Pubblica)
- ✓ Lista di tutti i blog
- ✓ Ricerca blog per titolo/autore
- ✓ Card con info blog e autore
- ✓ Link di accesso al blog

### Dashboard (Protetta)
- ✓ Statistiche utente
- ✓ Form per creare nuovo post
- ✓ Lista dei tuoi post
- ✓ Elimina post
- ✓ Logout istantaneo

### Login
- ✓ Form email/password
- ✓ Gestione errori
- ✓ Loading state con spinner
- ✓ Design moderno con animazioni

## 🎨 Temi e Styling

Il progetto usa un sistema di temi centralizzato:

```tsx
const themeColors = {
  accentColor: "#6F1110",
  backgroundColor: "#EDEBDD",
  darkTextColor: "#1B1717",
  lightTextColor: "#EDEBDD"
};
```

Questi colori vengono passati via `ThemeContext` e usati in tutte le componenti.

## 🔄 Workflow di Sviluppo

```bash
# 1. Start backend
cd [backend-project]
mvn spring-boot:run

# 2. Start frontend (in un nuovo terminal)
cd portfoliosapp
npm run dev

# 3. Open browser
# http://localhost:5173

# 4. Sviluppa le features

# 5. Testa e committa
npm run tsc  # Valida
npm run lint # Lint
```

## 📝 Checklist Backend

Prima di considerare il backend pronto:

- [ ] Endpoint `/api/auth/login` implementato
- [ ] Endpoint `/api/auth/me` implementato
- [ ] Endpoint `/api/blogs` GET implementato
- [ ] Endpoint `/api/posts/my` GET implementato
- [ ] Endpoint `/api/posts` POST implementato
- [ ] Endpoint `/api/posts/:id` DELETE implementato
- [ ] CORS configurato per http://localhost:5173
- [ ] Cookie di sessione configurati
- [ ] Database configurato
- [ ] Backend in ascolto su localhost:8080

## 🐛 Troubleshooting

### "Error: Failed to fetch"
→ Il backend non è avviato o non è su localhost:8080

### "401 Unauthorized"
→ Session non valida, login nuovamente

### "CORS error"
→ Backend non ha CORS configurato, vedi SPRING_BOOT_SETUP.md

### TypeScript errors
```bash
npm run tsc
```

### Cancella cache node_modules
```bash
rm -rf node_modules
npm install
```

## 📚 Documentazione

- [Backend Requirements](./BACKEND_REQUIREMENTS.md) - Endpoint API richiesti
- [Spring Boot Setup](./SPRING_BOOT_SETUP.md) - Setup e configurazione backend

## 🤝 Contributing

1. Crea un branch: `git checkout -b feature/nome`
2. Commit i cambiamenti: `git commit -m "Add feature"`
3. Push: `git push origin feature/nome`
4. Apri una PR

## 📄 License

ISC

---

**Ultimo aggiornamento**: 5 Febbraio 2026
