import { useEffect, useState } from 'react';
import { API_ENDPOINTS, getApiUrl } from '../config/api';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import './BlogList.css';

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

interface BlogListProps {
  onSelectBlog?: (blogId: string) => void;
}

function BlogList({ onSelectBlog }: BlogListProps) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { colors } = useTheme();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await fetch(getApiUrl(API_ENDPOINTS.BLOGS.LIST), {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Errore nel caricamento dei blog');
      }

      const data = await response.json();
      setBlogs(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto');
      setBlogs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="blog-list-container" style={{ backgroundColor: colors.backgroundColor }}>
        <div className="loading-skeleton">
          <div className="skeleton-card"></div>
          <div className="skeleton-card"></div>
          <div className="skeleton-card"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-list-container" style={{ backgroundColor: colors.backgroundColor }}>
      <div className="blog-list-header">
        <div>
          <h2 style={{ color: colors.accentColor }}>Tutti i Blog</h2>
          <p style={{ color: colors.darkTextColor }} className="blog-count">
            {filteredBlogs.length} {filteredBlogs.length === 1 ? 'blog trovato' : 'blog trovati'}
          </p>
        </div>
        <div className="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            placeholder="Cerca blog o autore..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              backgroundColor: colors.backgroundColor,
              color: colors.darkTextColor,
              borderColor: colors.accentColor
            }}
          />
        </div>
      </div>

      {error && (
        <div className="error-banner" style={{ backgroundColor: 'rgba(211, 47, 47, 0.1)', color: '#d32f2f' }}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
          </svg>
          {error}
        </div>
      )}

      {filteredBlogs.length === 0 ? (
        <div className="empty-state" style={{ color: colors.darkTextColor }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"></path>
          </svg>
          <p>Nessun blog trovato. Torna presto!</p>
        </div>
      ) : (
        <div className="blog-grid">
          {filteredBlogs.map((blog) => (
            <article
              key={blog.id}
              className="blog-card"
              onClick={() => onSelectBlog?.(blog.id)}
              style={{
                backgroundColor: colors.backgroundColor,
                borderColor: colors.accentColor
              }}
            >
              <div className="blog-card-header">
                <h3 style={{ color: colors.accentColor }}>{blog.title}</h3>
                <span className="blog-badge" style={{ backgroundColor: colors.accentColor, color: colors.lightTextColor }}>
                  {blog.postCount || 0} post
                </span>
              </div>

              <p className="blog-description" style={{ color: colors.darkTextColor }}>
                {blog.description}
              </p>

              <div className="blog-card-footer" style={{ borderTopColor: colors.accentColor }}>
                <div className="blog-author">
                  <div className="author-avatar" style={{ backgroundColor: colors.accentColor }}>
                    {blog.author.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="author-name" style={{ color: colors.darkTextColor }}>
                      {blog.author}
                    </p>
                    <p className="blog-date" style={{ color: colors.darkTextColor }}>
                      {formatDate(blog.createdAt)}
                    </p>
                  </div>
                </div>
                <a
                  href={`/blog/${blog.id}`}
                  className="blog-link"
                  style={{ color: colors.accentColor }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <span>Leggi</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"></path>
                  </svg>
                </a>
              </div>
            </article>
          ))}
        </div>
      )}

      {isAuthenticated && (
        <div className="auth-hint" style={{ backgroundColor: colors.accentColor }}>
          <p style={{ color: colors.lightTextColor }}>
            Vuoi gestire il tuo blog? Accedi al panello admin per aggiungere e modificare i tuoi contenuti.
          </p>
        </div>
      )}
    </div>
  );
}

export default BlogList;
