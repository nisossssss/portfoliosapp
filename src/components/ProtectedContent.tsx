import { type ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Login from './Login';

interface ProtectedContentProps {
  children: ReactNode;
}

function ProtectedContent({ children }: ProtectedContentProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Caricamento...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return <>{children}</>;
}

export default ProtectedContent;
