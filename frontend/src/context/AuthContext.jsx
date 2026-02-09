import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { loginApi, registerApi } from '../api/authApi';
import { getTokenExpiryMs, isTokenExpired } from '../utils/jwt';

export const AuthContext = createContext(null);

const STORAGE_KEYS = {
  token: 'token',
  user: 'user'
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearAuth = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.token);
    localStorage.removeItem(STORAGE_KEYS.user);
    setUser(null);
    setToken(null);
  }, []);

  const persistAuth = useCallback((authUser, authToken) => {
    localStorage.setItem(STORAGE_KEYS.token, authToken);
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(authUser));
    setUser(authUser);
    setToken(authToken);
  }, []);

  useEffect(() => {
    const savedToken = localStorage.getItem(STORAGE_KEYS.token);
    const savedUser = localStorage.getItem(STORAGE_KEYS.user);

    if (!savedToken || !savedUser || isTokenExpired(savedToken)) {
      clearAuth();
      setIsLoading(false);
      return;
    }

    setToken(savedToken);
    setUser(JSON.parse(savedUser));
    setIsLoading(false);
  }, [clearAuth]);

  useEffect(() => {
    if (!token) return undefined;

    const expiryMs = getTokenExpiryMs(token);
    if (!expiryMs) {
      clearAuth();
      return undefined;
    }

    const timeoutMs = Math.max(expiryMs - Date.now(), 0);

    // Basic auto logout once JWT exp is reached.
    const timer = setTimeout(() => {
      clearAuth();
    }, timeoutMs);

    return () => clearTimeout(timer);
  }, [token, clearAuth]);

  const register = async (payload) => {
    const result = await registerApi(payload);
    persistAuth(result.data.user, result.data.token);
    return result;
  };

  const login = async (payload) => {
    const result = await loginApi(payload);
    persistAuth(result.data.user, result.data.token);
    return result;
  };

  const logout = () => {
    clearAuth();
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: Boolean(user && token),
      register,
      login,
      logout
    }),
    [user, token, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
