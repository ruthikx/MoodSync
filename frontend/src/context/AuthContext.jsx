import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      try {
        const currentUser = await authService.getCurrentUser();
        if (mounted) {
          setUser(currentUser);
        }
      } catch (err) {
        if (mounted) {
          setError(err.response?.data?.message || 'Unable to restore your session.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    bootstrap();
    return () => {
      mounted = false;
    };
  }, []);

  async function login(payload) {
    setError('');
    const data = await authService.login(payload);
    setUser(data.user);
    return data.user;
  }

  async function register(payload) {
    setError('');
    const data = await authService.register(payload);
    setUser(data.user);
    return data.user;
  }

  async function logout() {
    await authService.logout();
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      setError,
    }),
    [user, loading, error],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
