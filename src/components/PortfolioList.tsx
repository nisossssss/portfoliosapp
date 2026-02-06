import { useEffect, useState } from 'react';
import { API_CONFIG } from '../config/api';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import './PortfolioList.css';

interface User {
  id: number;
  name: string;
  email: string;
}

interface PortfolioListProps {
  onSelectUser: (userId: number) => void;
  onLoginClick?: () => void;
}

export default function PortfolioList({ onSelectUser, onLoginClick }: PortfolioListProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredUserId, setHoveredUserId] = useState<number | null>(null);
  const { colors } = useTheme();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USERS}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        setError('Errore nel caricamento degli utenti');
      }
    } catch (err) {
      setError('Errore di connessione');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="portfolio-list-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Caricamento portfolio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="portfolio-list-container">
        <div className="error-container">
          <p className="error">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="portfolio-list-wrapper">
      <div className="portfolio-hero" style={{ 
        background: `linear-gradient(135deg, ${colors.accentColor}dd 0%, ${colors.accentColor} 100%)`
      }}>
        <div className="hero-content" style={{ color: colors.lightTextColor }}>
          <h1 className="portfolio-list-title" style={{ color: colors.lightTextColor }}>
            {!isAuthenticated ? 'Scopri il Tuo Potenziale' : 'Scopri i Nostri Portfolio'}
          </h1>
          <p className="portfolio-list-subtitle" style={{ color: colors.lightTextColor }}>
            {!isAuthenticated 
              ? 'Crea, condividi e gestisci i tuoi portfolio e blog con facilità. Una piattaforma pensata per mostrare il tuo talento al mondo.'
              : 'Esplora professionisti talentuosi e i loro incredibili lavori'}
          </p>

          {!isAuthenticated && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1.5rem',
              marginBottom: '3rem',
              maxWidth: '500px',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}>
              <div style={{
                padding: '1.5rem',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center'
              }}>
                <div style={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                  </svg>
                </div>
                <p style={{ margin: '0', fontSize: '0.85rem', fontWeight: '500', opacity: 0.9 }}>Crescita</p>
              </div>
              <div style={{
                padding: '1.5rem',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center'
              }}>
                <div style={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <p style={{ margin: '0', fontSize: '0.85rem', fontWeight: '500', opacity: 0.9 }}>Community</p>
              </div>
              <div style={{
                padding: '1.5rem',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center'
              }}>
                <div style={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
                  <p style={{ margin: '0', fontSize: '2.5rem', fontWeight: '800', lineHeight: '1' }}>{users.length}</p>
                </div>
                <p style={{ margin: '0', fontSize: '0.85rem', fontWeight: '500', opacity: 0.9 }}>Portfolio</p>
              </div>
            </div>
          )}

          <div className="hero-stats">
            {!isAuthenticated && (
              <div>
                <button 
                  onClick={onLoginClick}
                  style={{
                    padding: '1rem 2.5rem',
                    fontSize: '1rem',
                    backgroundColor: colors.lightTextColor,
                    color: colors.accentColor,
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontWeight: '700',
                    transition: 'all 0.3s cubic-bezier(0.23, 1, 0.320, 1)',
                    letterSpacing: '0.5px',
                    display: 'inline-flex',
                    alignItems: 'center',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
                  }}
                >
                  <span>Accedi Ora</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="portfolio-list-container">
        {users.length === 0 ? (
          <div className="empty-state">
            <p>Nessun portfolio disponibile</p>
          </div>
        ) : (
          <div className="portfolio-grid">
            {users.map((user, index) => (
              <div 
                key={user.id} 
                className="portfolio-card"
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  borderTop: `4px solid ${colors.accentColor}`
                }}
                onClick={() => onSelectUser(user.id)}
              >
                <div className="card-header">
                  <div className="portfolio-avatar" style={{ backgroundColor: colors.accentColor }}>
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="card-badge" style={{ backgroundColor: colors.accentColor }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                </div>

                <div className="card-content">
                  <h3 className="portfolio-name">{user.name || 'Utente'}</h3>
                  
                  <div className="email-container">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                    </svg>
                    <p className="portfolio-email">{user.email}</p>
                  </div>

                  <div className="card-divider" style={{ backgroundColor: colors.accentColor }}></div>

                  <button 
                    className="portfolio-view-btn"
                    style={{
                      backgroundColor: hoveredUserId === user.id ? colors.darkTextColor : colors.accentColor,
                      color: hoveredUserId === user.id ? colors.accentColor : 'white',
                      transform: hoveredUserId === user.id ? 'scale(1.05)' : 'scale(1)'
                    }}
                    onMouseEnter={() => setHoveredUserId(user.id)}
                    onMouseLeave={() => setHoveredUserId(null)}
                  >
                    <span>Visita Portfolio</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: '0.5rem' }}>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
