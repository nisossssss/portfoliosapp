import { useState } from 'react';
import Symbol1 from '../assets/images/symbol-1.svg?react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import './Login.css';

interface LoginProps {
  onBackToHome?: () => void;
}

function Login({ onBackToHome }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const { login } = useAuth();
  const { colors } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore durante il login');
      setPassword('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="login-container"
      style={{ backgroundColor: colors.backgroundColor }}
    >
      <div className="login-background-shapes">
        <div className="shape shape-1" style={{ borderColor: colors.accentColor }}></div>
        <div className="shape shape-2" style={{ borderColor: colors.accentColor }}></div>
        <div className="shape shape-3" style={{ borderColor: colors.accentColor }}></div>
      </div>

      <div 
        className="login-box"
        style={{
          backgroundColor: colors.backgroundColor,
          boxShadow: `0 20px 60px rgba(111, 17, 16, 0.15)`
        }}
      >
        <div className="login-header">
          <div className="logo-wrapper" style={{ backgroundColor: colors.accentColor }}>
            <Symbol1 style={{ fill: colors.lightTextColor }} className="login-symbol" />
          </div>
          <h1 style={{ color: colors.accentColor }}>Benvenuto</h1>
          <p style={{ color: colors.darkTextColor }} className="subtitle">Accedi al tuo profilo</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className={`form-group ${emailFocused ? 'focused' : ''}`}>
            <label htmlFor="email" style={{ color: colors.darkTextColor }}>Email</label>
            <div className="input-wrapper">
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke={colors.accentColor} strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </svg>
              <input
                type="email"
                id="email"
                placeholder="tu@esempio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                disabled={isLoading}
                required
                style={{
                  borderColor: emailFocused ? colors.accentColor : 'transparent',
                  color: colors.darkTextColor,
                  backgroundColor: colors.backgroundColor
                }}
                className="form-input"
              />
            </div>
          </div>

          <div className={`form-group ${passwordFocused ? 'focused' : ''}`}>
            <label htmlFor="password" style={{ color: colors.darkTextColor }}>Password</label>
            <div className="input-wrapper">
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke={colors.accentColor} strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <input
                type="password"
                id="password"
                placeholder="La tua password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                disabled={isLoading}
                required
                style={{
                  borderColor: passwordFocused ? colors.accentColor : 'transparent',
                  color: colors.darkTextColor,
                  backgroundColor: colors.backgroundColor
                }}
                className="form-input"
              />
            </div>
          </div>

          {error && (
            <div className="error-message" style={{ backgroundColor: 'rgba(211, 47, 47, 0.1)', color: '#d32f2f' }}>
              <svg viewBox="0 0 24 24" fill="currentColor" className="error-icon">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
              </svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              background: `linear-gradient(135deg, ${colors.accentColor} 0%, rgba(111, 17, 16, 0.8) 100%)`,
              color: colors.lightTextColor,
              boxShadow: `0 10px 25px rgba(111, 17, 16, 0.2)`
            }}
            className="login-button"
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Accesso in corso...
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="currentColor" className="button-icon">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
                </svg>
                Accedi
              </>
            )}
          </button>
        </form>

        <div className="login-footer" style={{ color: colors.darkTextColor }}>
          <p>Portfolio App © 2026</p>
          {onBackToHome && (
            <button
              type="button"
              onClick={onBackToHome}
              style={{
                backgroundColor: 'transparent',
                border: `2px solid ${colors.accentColor}`,
                color: colors.accentColor,
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                marginTop: '1rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.accentColor;
                e.currentTarget.style.color = colors.lightTextColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = colors.accentColor;
              }}
            >
              ← Torna alla Home
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
