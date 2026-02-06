import { useEffect, useState } from 'react';
import { API_ENDPOINTS, getApiUrl } from '../config/api';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import './PostDetail.css';

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  blogTitle: string;
  createdAt: string;
  commentCount?: number;
}

interface Comment {
  id: string;
  content: string;
  author: string;
  authorId: string;
  createdAt: string;
}

interface PostDetailProps {
  postId: string;
  onBack: () => void;
}

function PostDetail({ postId, onBack }: PostDetailProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { colors } = useTheme();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    fetchPostAndComments();
  }, [postId]);

  const fetchPostAndComments = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Fetch post details
      const postResponse = await fetch(getApiUrl(API_ENDPOINTS.POSTS.GET(postId)), {
        credentials: 'include',
      });
      if (!postResponse.ok) throw new Error('Errore nel caricamento del post');
      const postData = await postResponse.json();
      setPost(postData);

      // Fetch comments
      const commentsResponse = await fetch(getApiUrl(API_ENDPOINTS.COMMENTS.LIST(postId)), {
        credentials: 'include',
      });
      if (!commentsResponse.ok) throw new Error('Errore nel caricamento dei commenti');
      const commentsData = await commentsResponse.json();
      setComments(Array.isArray(commentsData) ? commentsData : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !isAuthenticated) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(getApiUrl(API_ENDPOINTS.COMMENTS.CREATE(postId)), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ content: newComment }),
      });

      if (!response.ok) throw new Error('Errore nell\'invio del commento');

      setNewComment('');
      await fetchPostAndComments();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Errore nell\'invio del commento');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo commento?')) return;

    try {
      const response = await fetch(getApiUrl(API_ENDPOINTS.COMMENTS.DELETE(commentId)), {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Errore nell\'eliminazione del commento');

      await fetchPostAndComments();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Errore nell\'eliminazione del commento');
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

  if (isLoading) {
    return (
      <div className="post-detail-container" style={{ backgroundColor: colors.backgroundColor }}>
        <p>Caricamento...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="post-detail-container" style={{ backgroundColor: colors.backgroundColor }}>
        <button onClick={onBack} style={{ color: colors.accentColor }}>← Indietro</button>
        <p style={{ color: '#d32f2f' }}>{error || 'Post non trovato'}</p>
      </div>
    );
  }

  return (
    <div className="post-detail-container" style={{ backgroundColor: colors.backgroundColor }}>
      <button className="back-button" onClick={onBack} style={{ color: colors.accentColor }}>
        ← Indietro
      </button>

      <article className="post-content">
        <header className="post-header">
          <h1 style={{ color: colors.accentColor }}>{post.title}</h1>
          <div className="post-meta">
            <span style={{ color: colors.darkTextColor }}>
              di <strong>{post.author}</strong>
            </span>
            <span style={{ color: colors.darkTextColor }}>•</span>
            <span style={{ color: colors.darkTextColor }}>{post.blogTitle}</span>
            <span style={{ color: colors.darkTextColor }}>•</span>
            <span style={{ color: colors.darkTextColor }}>{formatDate(post.createdAt)}</span>
          </div>
        </header>

        <div className="post-body" style={{ color: colors.darkTextColor }}>
          {post.content}
        </div>
      </article>

      <section className="comments-section">
        <h2 style={{ color: colors.accentColor }}>
          Commenti ({comments.length})
        </h2>

        {isAuthenticated ? (
          <form onSubmit={handleSubmitComment} className="comment-form">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Scrivi un commento..."
              rows={4}
              disabled={isSubmitting}
              style={{
                backgroundColor: colors.backgroundColor,
                color: colors.darkTextColor,
                borderColor: colors.accentColor
              }}
            />
            <button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              style={{
                backgroundColor: colors.accentColor,
                color: colors.lightTextColor
              }}
            >
              {isSubmitting ? 'Invio...' : 'Invia Commento'}
            </button>
          </form>
        ) : (
          <p style={{ color: colors.darkTextColor, fontStyle: 'italic' }}>
            Devi effettuare l'accesso per commentare.
          </p>
        )}

        <div className="comments-list">
          {comments.length === 0 ? (
            <p style={{ color: colors.darkTextColor }}>Nessun commento. Sii il primo a commentare!</p>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="comment-card"
                style={{
                  backgroundColor: colors.backgroundColor,
                  borderColor: colors.accentColor
                }}
              >
                <div className="comment-header">
                  <div className="comment-author">
                    <div className="author-avatar" style={{ backgroundColor: colors.accentColor }}>
                      {comment.author.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <strong style={{ color: colors.darkTextColor }}>{comment.author}</strong>
                      <span style={{ color: colors.darkTextColor, fontSize: '0.9rem' }}>
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                  </div>
                  {user?.id && String(user.id) === String(comment.authorId) && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="delete-btn"
                      style={{ color: '#d32f2f' }}
                    >
                      Elimina
                    </button>
                  )}
                </div>
                <p className="comment-content" style={{ color: colors.darkTextColor }}>
                  {comment.content}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default PostDetail;
