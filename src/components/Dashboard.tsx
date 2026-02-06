import { useEffect, useState } from 'react';
import { API_ENDPOINTS, getApiUrl } from '../config/api';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import './Dashboard.css';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

function Dashboard() {
  const { user, logout } = useAuth();
  const { colors } = useTheme();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setIsLoadingPosts(true);
      const response = await fetch(getApiUrl(API_ENDPOINTS.POSTS.MY_POSTS), {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Errore nel caricamento dei post');
      }

      const data = await response.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto');
    } finally {
      setIsLoadingPosts(false);
    }
  };

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPost.title.trim() || !newPost.content.trim()) {
      setError('Titolo e contenuto sono obbligatori');
      return;
    }

    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(getApiUrl(API_ENDPOINTS.POSTS.CREATE), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newPost),
      });

      if (!response.ok) {
        throw new Error('Errore nel salvataggio del post');
      }

      const post = await response.json();
      setPosts([post, ...posts]);
      setNewPost({ title: '', content: '' });
      setShowNewPostForm(false);
      setSuccess('Post aggiunto con successo!');
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo post?')) return;

    try {
      const response = await fetch(getApiUrl(API_ENDPOINTS.POSTS.DELETE(postId)), {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Errore nell\'eliminazione del post');
      }

      setPosts(posts.filter(p => p.id !== postId));
      setSuccess('Post eliminato con successo!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="dashboard-container" style={{ backgroundColor: colors.backgroundColor }}>
      {/* Header */}
      <div className="dashboard-header" style={{ backgroundColor: colors.accentColor }}>
        <div className="dashboard-title">
          <h1 style={{ color: colors.lightTextColor }}>Pannello Admin</h1>
          <p style={{ color: colors.lightTextColor }}>Benvenuto, {user?.email}</p>
        </div>
        <button
          className="logout-btn"
          onClick={logout}
          style={{ color: colors.accentColor, backgroundColor: colors.lightTextColor }}
        >
          Logout
        </button>
      </div>

      <div className="dashboard-content">
        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card" style={{ backgroundColor: colors.backgroundColor, borderColor: colors.accentColor }}>
            <div className="stat-icon" style={{ backgroundColor: colors.accentColor, color: colors.lightTextColor }}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
              </svg>
            </div>
            <div className="stat-info">
              <p className="stat-value" style={{ color: colors.accentColor }}>{posts.length}</p>
              <p className="stat-label" style={{ color: colors.darkTextColor }}>Post pubblicati</p>
            </div>
          </div>

          <div className="stat-card" style={{ backgroundColor: colors.backgroundColor, borderColor: colors.accentColor }}>
            <div className="stat-icon" style={{ backgroundColor: colors.accentColor, color: colors.lightTextColor }}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"></path>
              </svg>
            </div>
            <div className="stat-info">
              <p className="stat-value" style={{ color: colors.accentColor }}>Sempre</p>
              <p className="stat-label" style={{ color: colors.darkTextColor }}>Disponibile</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="message error-msg" style={{ backgroundColor: 'rgba(211, 47, 47, 0.1)', color: '#d32f2f' }}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
            </svg>
            {error}
          </div>
        )}

        {success && (
          <div className="message success-msg" style={{ backgroundColor: 'rgba(76, 175, 80, 0.1)', color: '#2e7d32' }}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"></path>
            </svg>
            {success}
          </div>
        )}

        {/* New Post Section */}
        <div className="new-post-section" style={{ backgroundColor: colors.backgroundColor, borderColor: colors.accentColor }}>
          <button
            className="toggle-form-btn"
            onClick={() => setShowNewPostForm(!showNewPostForm)}
            style={{ backgroundColor: colors.accentColor, color: colors.lightTextColor }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
            </svg>
            Nuovo Post
          </button>

          {showNewPostForm && (
            <form onSubmit={handleAddPost} className="new-post-form">
              <div className="form-group">
                <label style={{ color: colors.darkTextColor }}>Titolo</label>
                <input
                  type="text"
                  placeholder="Titolo del tuo post..."
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  disabled={isSaving}
                  style={{
                    backgroundColor: colors.backgroundColor,
                    color: colors.darkTextColor,
                    borderColor: colors.accentColor,
                  }}
                />
              </div>

              <div className="form-group">
                <label style={{ color: colors.darkTextColor }}>Contenuto</label>
                <textarea
                  placeholder="Scrivi il contenuto del tuo post..."
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  disabled={isSaving}
                  rows={6}
                  style={{
                    backgroundColor: colors.backgroundColor,
                    color: colors.darkTextColor,
                    borderColor: colors.accentColor,
                  }}
                />
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  disabled={isSaving}
                  style={{
                    backgroundColor: colors.accentColor,
                    color: colors.lightTextColor
                  }}
                >
                  {isSaving ? 'Salvataggio...' : 'Pubblica Post'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewPostForm(false)}
                  className="cancel-btn"
                  style={{
                    color: colors.accentColor,
                    borderColor: colors.accentColor
                  }}
                >
                  Annulla
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Posts List */}
        <div className="posts-section">
          <h2 style={{ color: colors.accentColor }}>I Tuoi Post</h2>

          {isLoadingPosts ? (
            <div className="loading">Caricamento post...</div>
          ) : posts.length === 0 ? (
            <div className="empty-posts" style={{ color: colors.darkTextColor }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              <p>Non hai ancora pubblicato nessun post. Inizia a condividere!</p>
            </div>
          ) : (
            <div className="posts-list">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="post-item"
                  style={{ backgroundColor: colors.backgroundColor, borderColor: colors.accentColor }}
                >
                  <div className="post-header">
                    <div>
                      <h3 style={{ color: colors.accentColor }}>{post.title}</h3>
                      <p className="post-date" style={{ color: colors.darkTextColor }}>
                        {formatDate(post.createdAt)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="delete-btn"
                      style={{ color: '#d32f2f' }}
                      title="Elimina post"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-9l-1 1H5v2h14V4z"></path>
                      </svg>
                    </button>
                  </div>
                  <p className="post-preview" style={{ color: colors.darkTextColor }}>
                    {post.content.substring(0, 200)}...
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
