# Configurazione Dinamica URL Backend

## 🎯 Come Funziona

L'app frontend è configurata per leggere l'URL del backend da variabili d'ambiente, rendendolo facilmente cambiabile tra development e production.

## 📝 Modificare l'URL del Backend

### 1. **Modifica il file `.env`**

Apri il file `.env` nella root del progetto:

```env
# Development
VITE_API_BASE_URL=http://localhost:8080

# Production (decommenta quando è pronto)
# VITE_API_BASE_URL=https://api.tuodominio.com
```

### 2. **Cambia l'URL e salva**

**Per Development (locale):**
```env
VITE_API_BASE_URL=http://localhost:8080
```

**Per Production (online):**
```env
VITE_API_BASE_URL=https://api.tuodominio.com
```

### 3. **Riavvia il server di sviluppo**

```bash
# Se il server Vite è già in esecuzione, ferma l'esecuzione (Ctrl+C)
# e riavvialo per caricare le nuove variabili d'ambiente:

npm run dev
```

## 🔧 Come è Implementato

### File di Configurazione Centralizzato

[src/config/api.ts](src/config/api.ts) legge la variabile d'ambiente e la espone:

```typescript
// ✓ Legge automaticamente da .env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// ✓ Helper per costruire URL completi
export const getApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};

// ✓ Costanti per gli endpoint
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    ME: '/auth/me',
    ...
  },
  BLOGS: { ... },
  POSTS: { ... }
};
```

### Utilizzo nei Componenti

Ovunque nel codice si fa una richiesta fetch, si usa la configurazione centralizzata:

**❌ Vecchio modo (hardcodato):**
```tsx
const response = await fetch('/api/blogs', { credentials: 'include' });
```

**✅ Nuovo modo (configurabile):**
```tsx
import { getApiUrl, API_ENDPOINTS } from '../config/api';

const response = await fetch(getApiUrl(API_ENDPOINTS.BLOGS.LIST), {
  credentials: 'include',
});
```

## 📂 Struttura dei File

```
portfoliosapp/
├── .env                      # Variables di ambiente (NON committare)
├── .env.example              # Template (committare questo)
├── .gitignore                # Ignorerà .env
└── src/
    └── config/
        └── api.ts            # Configurazione centralizzata
```

## 🚀 Scenari di Collaudo

### Scenario 1: Development Locale

```env
# .env
VITE_API_BASE_URL=http://localhost:8080
```

```bash
npm run dev
# Frontend: http://localhost:5173
# Backend: http://localhost:8080
```

### Scenario 2: Backend su Macchina Remota

```env
# .env
VITE_API_BASE_URL=http://192.168.1.100:8080
```

```bash
npm run dev
# Frontend: http://localhost:5173
# Backend: http://192.168.1.100:8080
```

### Scenario 3: Production

```env
# .env
VITE_API_BASE_URL=https://api.portfolioapp.com
```

```bash
npm run build
# Build per produzione con API su https://api.portfolioapp.com
```

## ⚠️ Variabili d'Ambiente Vite

Vite carica automaticamente le variabili d'ambiente con il prefisso `VITE_`:

- `VITE_API_BASE_URL` → Disponibile nel codice come `import.meta.env.VITE_API_BASE_URL`
- `VITE_*` → Qualsiasi altra variabile che inizia con `VITE_`
- Variabili senza `VITE_` → Non saranno esposte al browser (sicure)

## 📋 Checklist per il Deploy

Quando vai in produzione:

1. [ ] Copia `.env.example` a `.env`
2. [ ] Modifica `VITE_API_BASE_URL` al tuo URL di produzione
3. [ ] Assicurati che `.env` sia nel `.gitignore`
4. [ ] Non committare `.env` repository
5. [ ] Configura `.env` sul server di produzione
6. [ ] Esegui `npm run build` per creare il build di produzione
7. [ ] Verifica che l'app comunichi correttamente con il backend

## 🔄 Cambio Dinamico (Bonus)

Se vuoi cambiare l'URL senza riavviare il server durante lo sviluppo, puoi creare un componente debug:

```tsx
// Debug component (solo in development)
function ApiConfigDebug() {
  return (
    <div style={{ fontSize: '12px', padding: '10px', background: '#f0f0f0' }}>
      API URL: {import.meta.env.VITE_API_BASE_URL}
    </div>
  );
}

export default ApiConfigDebug;
```

Aggiungilo al tuo App.tsx (solo durante lo sviluppo):

```tsx
{import.meta.env.DEV && <ApiConfigDebug />}
```

## ❓ FAQ

**D: Dove trovo il valore di VITE_API_BASE_URL durante l'esecuzione?**
R: Apri la console browser e scrivi:
```javascript
console.log(import.meta.env.VITE_API_BASE_URL)
```

**D: Perché prefisso VITE_ alle variabili?**
R: Vite espone solo le variabili con il prefisso VITE_ per motivi di sicurezza, evitando di esternare info sensibili.

**D: Posso usare una URL diversa per ogni branch?**
R: Sì, crea più file `.env`:
- `.env.local` (ignorato da git, dev locale)
- `.env.staging` (staging server)
- `.env.production` (production)

Poi carica il file appropriato con:
```bash
npm run build -- --mode staging
```

---

**TL;DR**: Modifica `.env`, salva, e riavvia il server! 🚀
