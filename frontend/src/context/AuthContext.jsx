import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { loginApi, registerApi } from '../api/authApi';
import { getStudentProfileApi } from '../api/studentApi';
import { getTokenExpiryMs, isTokenExpired } from '../utils/jwt';

export const AuthContext = createContext(null);

const STORAGE_KEYS = {
  token: 'token',
  user: 'user',
  authNotice: 'auth_notice'
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const syncStoredUser = useCallback((nextUser) => {
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(nextUser));
    setUser(nextUser);
  }, []);

  const clearAuth = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.token);
    localStorage.removeItem(STORAGE_KEYS.user);
    setUser(null);
    setToken(null);
  }, []);

  const persistAuth = useCallback(
    (authUser, authToken) => {
      localStorage.setItem(STORAGE_KEYS.token, authToken);
      localStorage.removeItem(STORAGE_KEYS.authNotice);
      syncStoredUser(authUser);
      setToken(authToken);
    },
    [syncStoredUser]
  );

  const refreshStudentProfile = useCallback(async () => {
    const currentUserRaw = localStorage.getItem(STORAGE_KEYS.user);
    if (!currentUserRaw) return null;

    let currentUser;
    try {
      currentUser = JSON.parse(currentUserRaw);
    } catch (error) {
      return null;
    }

    if (currentUser.role !== 'student') {
      return currentUser;
    }

    const profileResponse = await getStudentProfileApi();
    syncStoredUser(profileResponse.data);
    return profileResponse.data;
  }, [syncStoredUser]);

  useEffect(() => {
    const savedToken = localStorage.getItem(STORAGE_KEYS.token);
    const savedUser = localStorage.getItem(STORAGE_KEYS.user);

    if (!savedToken || !savedUser || isTokenExpired(savedToken)) {
      clearAuth();
      setIsLoading(false);
      return;
    }

    try {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    } catch (error) {
      clearAuth();
    }

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
    const timer = setTimeout(() => {
      localStorage.setItem(STORAGE_KEYS.authNotice, 'Session expired. Please login again.');
      clearAuth();
    }, timeoutMs);

    return () => clearTimeout(timer);
  }, [token, clearAuth]);

  useEffect(() => {
    const handleForceLogout = () => {
      localStorage.setItem(STORAGE_KEYS.authNotice, 'Session expired. Please login again.');
      clearAuth();
    };

    window.addEventListener('forceLogout', handleForceLogout);
    return () => window.removeEventListener('forceLogout', handleForceLogout);
  }, [clearAuth]);

  const register = useCallback(
    async (payload) => {
      const result = await registerApi(payload);
      const loggedInUser = result.data.user;
      persistAuth(loggedInUser, result.data.token);

      if (loggedInUser.role === 'student') {
        try {
          await refreshStudentProfile();
        } catch (error) {
          // Keep session active even if profile refresh fails.
        }
      }

      return result;
    },
    [persistAuth, refreshStudentProfile]
  );

  const login = useCallback(
    async (payload) => {
      const result = await loginApi(payload);
      const loggedInUser = result.data.user;
      persistAuth(loggedInUser, result.data.token);

      if (loggedInUser.role === 'student') {
        try {
          await refreshStudentProfile();
        } catch (error) {
          // Keep session active even if profile refresh fails.
        }
      }

      return result;
    },
    [persistAuth, refreshStudentProfile]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.authNotice);
    clearAuth();
  }, [clearAuth]);

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: Boolean(user && token),
      register,
      login,
      logout,
      refreshStudentProfile
    }),
    [user, token, isLoading, register, login, logout, refreshStudentProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
