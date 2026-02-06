import { useEffect, useState } from 'react';
import { API_ENDPOINTS, getApiUrl } from '../config/api';
import { useTheme } from '../contexts/ThemeContext';
import './BlogDetail.css';

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  commentCount?: number;
}

interface Blog {
  id: string;
  title: string;
  description: string;
  author: string;
  createdAt: string;
  postCount?: number;
}

interface BlogDetailProps {
  blogId: string;
  onBack: () => void;
  onSelectPost: (postId: string) => void;
}

function BlogDetail({ blogId, onBack, onSelectPost }: BlogDetailProps) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { colors } = useTheme();

  useEffect(() => {
    fetchBlogAndPosts();
  }, [blogId]);

  const fetchBlogAndPosts = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Fetch blog details
      const blogResponse = await fetch(getApiUrl(API_ENDPOINTS.BLOGS.GET(blogId)), {
        credentials: 'include',
      });
      if (!blogResponse.ok) throw new Error('Errore nel caricamento del blog');
      const blogData = await blogResponse.json();
      setBlog(blogData);

      // Fetch posts
      const postsResponse = await fetch(getApiUrl(API_ENDPOINTS.POSTS.BY_BLOG(blogId)), {
        credentials: 'include',
      });
      if (!postsResponse.ok) throw new Error('Errore nel caricamento dei post');
      const postsData = await postsResponse.json();
      setPosts(Array.isArray(postsData) ? postsData : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="blog-detail-container" style={{ backgroundColor: colors.backgroundColor }}>
        <p>Caricamento...</p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="blog-detail-container" style={{ backgroundColor: colors.backgroundColor }}>
        <button onClick={onBack} style={{ color: colors.accentColor }}>← Torna ai blog</button>
        <p style={{ color: '#d32f2f' }}>{error || 'Blog non trovato'}</p>
      </div>
    );
  }

  return (
    <div className="blog-detail-container" style={{ backgroundColor: colors.backgroundColor }}>
      <button className="back-button" onClick={onBack} style={{ color: colors.accentColor }}>
        ← Torna ai blog
      </button>

      <header className="blog-header" style={{ borderBottomColor: colors.accentColor }}>
        <h1 style={{ color: colors.accentColor }}>{blog.title}</h1>
        <p className="blog-description" style={{ color: colors.darkTextColor }}>
          {blog.description}
        </p>
        <div className="blog-meta">
          <span style={{ color: colors.darkTextColor }}>
            di <strong>{blog.author}</strong>
          </span>
          <span style={{ color: colors.darkTextColor }}>•</span>
          <span style={{ color: colors.darkTextColor }}>{formatDate(blog.createdAt)}</span>
          <span style={{ color: colors.darkTextColor }}>•</span>
          <span style={{ color: colors.darkTextColor }}>{blog.postCount || 0} post</span>
        </div>
      </header>

      <section className="posts-section">
        <h2 style={{ color: colors.accentColor }}>Post Pubblicati</h2>
        {posts.length === 0 ? (
          <p style={{ color: colors.darkTextColor }}>Nessun post pubblicato in questo blog.</p>
        ) : (
          <div className="posts-list">
            {posts.map((post) => (
              <article
                key={post.id}
                className="post-card"
                onClick={() => onSelectPost(post.id)}
                style={{
                  backgroundColor: colors.backgroundColor,
                  borderColor: colors.accentColor,
                  cursor: 'pointer'
                }}
              >
                <h3 style={{ color: colors.accentColor }}>{post.title}</h3>
                <p className="post-excerpt" style={{ color: colors.darkTextColor }}>
                  {post.content.substring(0, 200)}...
                </p>
                <div className="post-footer">
                  <span style={{ color: colors.darkTextColor }}>
                    {formatDate(post.createdAt)}
                  </span>
                  <span style={{ color: colors.darkTextColor }}>
                    💬 {post.commentCount || 0} commenti
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default BlogDetail;
