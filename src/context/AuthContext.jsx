import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '@/services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [session, setSession] = useState(() => {
    const stored = localStorage.getItem('session');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);
  const [needsProfileCompletion, setNeedsProfileCompletion] = useState(false);

  // Helper to check if a profile has required fields filled
  const isProfileComplete = useCallback((profile) => {
    return !!(profile?.phone && profile.phone.trim() && profile?.college_name && profile.college_name.trim());
  }, []);

  // Persist user & session to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    if (session) {
      localStorage.setItem('session', JSON.stringify(session));
    } else {
      localStorage.removeItem('session');
    }
  }, [session]);

  // Check auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (!session?.access_token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await authAPI.getProfile();
        if (data.success) {
          const profile = data.data.profile;
          setUser((prev) => ({ ...prev, ...profile }));
          setNeedsProfileCompletion(!isProfileComplete(profile));
        }
      } catch {
        // Token might be expired, let interceptor handle refresh
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = useCallback((userData, sessionData) => {
    setUser(userData);
    setSession(sessionData);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authAPI.signOut();
    } catch {
      // Ignore error on signout
    } finally {
      setUser(null);
      setSession(null);
      setNeedsProfileCompletion(false);
      localStorage.removeItem('user');
      localStorage.removeItem('session');
    }
  }, []);

  // Fetch profile and update completeness flag (called after OAuth callback)
  const refreshProfile = useCallback(async () => {
    try {
      const { data } = await authAPI.getProfile();
      if (data.success) {
        const profile = data.data.profile;
        setUser((prev) => ({ ...prev, ...profile }));
        setNeedsProfileCompletion(!isProfileComplete(profile));
      }
    } catch {
      // Ignore
    }
  }, [isProfileComplete]);

  const markProfileComplete = useCallback(() => {
    setNeedsProfileCompletion(false);
  }, []);

  const isAuthenticated = !!session?.access_token;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isAuthenticated,
        isAdmin,
        needsProfileCompletion,
        login,
        logout,
        setUser,
        refreshProfile,
        markProfileComplete,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
