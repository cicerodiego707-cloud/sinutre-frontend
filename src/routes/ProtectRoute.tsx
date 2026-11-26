
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getToken, setToken } from '@/lib/api';
import { useEffect, useState } from 'react';

// Lê ?token=... do callback do backend,
// salva no localStorage e limpa a query string.
function consumeTokenFromUrl(): string | null {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');

  if (!token) return null;

  setToken(token);
  window.history.replaceState({}, '', window.location.pathname);

  return token;
}

export function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  const [token, setLocalToken] = useState<string | null>(
    () => consumeTokenFromUrl() ?? getToken(),
  );

  useEffect(() => {
    const fromUrl = consumeTokenFromUrl();

    if (fromUrl) {
      setLocalToken(fromUrl);
    }
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
