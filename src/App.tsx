import { useEffect, useState } from 'react';
import './App.css';
import BlogDetail from './components/BlogDetail';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import Login from './components/Login';
import PortfolioList from './components/PortfolioList';
import PostDetail from './components/PostDetail';
import ServerWaking from './components/ServerWaking';
import UserPortfolio from './components/UserPortfolio';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { useServerWake } from './hooks/useServerWake';

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const { colors } = useTheme();
  const { isWaking } = useServerWake();
  const [currentPage, setCurrentPage] = useState<'home' | 'dashboard' | 'login'>('home');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  useEffect(() => {
    // Se autenticato e prova ad andare su login, vai alla dashboard
    if (isAuthenticated && currentPage === 'login') {
      setCurrentPage('dashboard');
    }
    // Se non autenticato e prova ad andare su dashboard, vai alla login
    if (!isAuthenticated && currentPage === 'dashboard') {
      setCurrentPage('login');
    }
  }, [isAuthenticated, currentPage]);

  const handleSelectUser = (userId: number) => {
    setSelectedUserId(userId);
  };

  const handleSelectBlog = (blogId: string) => {
    setSelectedBlogId(blogId);
    setSelectedPostId(null);
  };

  const handleSelectPost = (postId: string) => {
    setSelectedPostId(postId);
  };

  const handleBackFromPost = () => {
    setSelectedPostId(null);
  };

  const handleBackFromBlog = () => {
    setSelectedBlogId(null);
    setSelectedPostId(null);
  };

  const handleBackFromUser = () => {
    setSelectedUserId(null);
    setSelectedBlogId(null);
    setSelectedPostId(null);
  };

  // Mostra overlay di risveglio server se in corso
  if (isWaking) {
    return <ServerWaking />;
  }

  if (isLoading) {
    return (
      <div className="app-container" style={{ 
        backgroundColor: colors.backgroundColor, 
        color: colors.darkTextColor,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}>
        <p>Caricamento...</p>
      </div>
    );
  }

  // Mostra pagina login senza header
  if (currentPage === 'login' && !isAuthenticated) {
    return (
      <div className="app-container" style={{ backgroundColor: colors.backgroundColor }}>
        <Login onBackToHome={() => setCurrentPage('home')} />
      </div>
    );
  }

  return (
    <div className="app-container" style={{ backgroundColor: colors.backgroundColor, color: colors.darkTextColor }}>
      <Header currentPage={currentPage} onPageChange={(page) => {
        setCurrentPage(page);
        setSelectedUserId(null);
        setSelectedBlogId(null);
        setSelectedPostId(null);
      }} />
      
      <main>
        {currentPage === 'home' && (
          <>
            {selectedPostId ? (
              <PostDetail postId={selectedPostId} onBack={handleBackFromPost} />
            ) : selectedBlogId ? (
              <BlogDetail blogId={selectedBlogId} onBack={handleBackFromBlog} onSelectPost={handleSelectPost} />
            ) : selectedUserId ? (
              <UserPortfolio userId={selectedUserId} onBack={handleBackFromUser} onSelectBlog={handleSelectBlog} />
            ) : (
              <PortfolioList onSelectUser={handleSelectUser} onLoginClick={() => setCurrentPage('login')} />
            )}
          </>
        )}
        {currentPage === 'dashboard' && isAuthenticated && <Dashboard />}
      </main>
    </div>
  );
}

function AppWithTheme() {
  const { user, isLoading: authLoading } = useAuth();
  
  // Don't render ThemeProvider until auth is loaded
  if (authLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        <p>Caricamento...</p>
      </div>
    );
  }

  return (
    <ThemeProvider userId={user ? parseInt(user.id) : null}>
      <AppContent />
    </ThemeProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppWithTheme />
    </AuthProvider>
  );
}

export default App;
