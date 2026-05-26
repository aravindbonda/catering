import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('caterbliss_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  const logout = useCallback(() => {
    localStorage.removeItem('caterbliss_token');
    localStorage.removeItem('caterbliss_user');
    setUser(null);
  }, []);

  const saveSession = useCallback((data) => {
    localStorage.setItem('caterbliss_token', data.token);
    localStorage.setItem('caterbliss_user', JSON.stringify(data.user));
    setUser(data.user);
  }, []);

  const login = useCallback(async (payload) => {
    const { data } = await api.post('/api/auth/login', payload);
    saveSession(data);
    return data.user;
  }, [saveSession]);

  useEffect(() => {
    const token = localStorage.getItem('caterbliss_token');
    if (!token) return;

    setLoading(true);
    api.get('/api/auth/me')
      .then(({ data }) => {
        setUser(data.user);
        localStorage.setItem('caterbliss_user', JSON.stringify(data.user));
      })
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, [logout]);

  const value = useMemo(() => ({ user, loading, login, logout, saveSession, setUser }), [user, loading, login, logout, saveSession]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
