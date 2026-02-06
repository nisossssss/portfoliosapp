/**
 * Configurazione API endpoints
 * 
 * Le richieste vengono inviate direttamente al backend configurato in .env
 * Variabile d'ambiente: VITE_API_BASE_URL
 * 
 * Esempi:
 * - Development: http://localhost:8080
 * - Production: https://api.example.com
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const getApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};

export const API_ENDPOINTS = {
  // Health Check
  HEALTH: '/api/health',
  PING: '/api/ping',

  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    REGISTER: '/auth/register',
  },

  // Blogs
  BLOGS: {
    LIST: '/blogs',
    GET: (id: string) => `/blogs/${id}`,
    CREATE: '/blogs',
    UPDATE: (id: string) => `/blogs/${id}`,
    DELETE: (id: string) => `/blogs/${id}`,
    MY_BLOG: '/blogs/my',
  },

  // Posts
  POSTS: {
    LIST: '/posts',
    GET: (id: string) => `/posts/${id}`,
    CREATE: '/posts',
    UPDATE: (id: string) => `/posts/${id}`,
    DELETE: (id: string) => `/posts/${id}`,
    MY_POSTS: '/posts/my',
    BY_BLOG: (blogId: string) => `/blogs/${blogId}/posts`,
  },

  // Comments
  COMMENTS: {
    LIST: (postId: string) => `/posts/${postId}/comments`,
    GET: (id: string) => `/comments/${id}`,
    CREATE: (postId: string) => `/posts/${postId}/comments`,
    UPDATE: (id: string) => `/comments/${id}`,
    DELETE: (id: string) => `/comments/${id}`,
    MY_COMMENTS: '/comments/my',
  },

  // Users
  USERS: {
    LIST: '/users',
    GET: (id: number) => `/users/${id}`,
  },
};

// Configurazione compatibile con i nuovi componenti
export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  ENDPOINTS: {
    HEALTH: '/api/health',
    PING: '/api/ping',
    USERS: '/users',
    BLOGS: '/blogs',
    POSTS: '/posts',
    AUTH: '/auth',
  },
};

export default API_BASE_URL;

