import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../services/apiClient';

export interface UserProfile {
  id: number;
  full_name: string;
  email: string;
  phone: string | null;
  role: 'Admin' | 'Student';
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  last_login: string | null;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<UserProfile>;
  registerUser: (fullName: string, email: string, phone: string, password: string) => Promise<UserProfile>;
  logout: () => Promise<void>;
  updateProfile: (data: { full_name?: string; phone?: string | null }) => Promise<UserProfile>;
  refreshProfile: () => Promise<UserProfile>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync token validation on load
  useEffect(() => {
    const initAuth = async () => {
      const accessToken = localStorage.getItem('access_token');
      if (accessToken) {
        try {
          const profile = await fetchCurrentUser();
          setUser(profile);
        } catch (error) {
          // If token fails, attempt manual clean
          clearAuth();
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const fetchCurrentUser = async (): Promise<UserProfile> => {
    const response = await apiClient.get<UserProfile>('/auth/me');
    return response.data;
  };

  const clearAuth = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  const login = async (email: string, password: string, rememberMe = false): Promise<UserProfile> => {
    const response = await apiClient.post<{
      access_token: string;
      refresh_token: string;
      role: string;
      expires_in: number;
    }>('/auth/login', { email, password, remember_me: rememberMe });

    const { access_token, refresh_token } = response.data;
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);

    const profile = await fetchCurrentUser();
    setUser(profile);
    return profile;
  };

  const registerUser = async (fullName: string, email: string, phone: string, password: string): Promise<UserProfile> => {
    const response = await apiClient.post<UserProfile>('/auth/register', {
      full_name: fullName,
      email,
      phone: phone || null,
      password,
    });
    return response.data;
  };

  const logout = async (): Promise<void> => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      try {
        await apiClient.post('/auth/logout', { refresh_token: refreshToken });
      } catch (err) {
        console.error('Logout error on backend:', err);
      }
    }
    clearAuth();
  };

  const updateProfile = async (data: { full_name?: string; phone?: string | null }): Promise<UserProfile> => {
    if (!user) throw new Error('Not authenticated');
    const response = await apiClient.put<UserProfile>(`/admin/users/${user.id}`, data);
    setUser(response.data);
    return response.data;
  };

  const refreshProfile = async (): Promise<UserProfile> => {
    const profile = await fetchCurrentUser();
    setUser(profile);
    return profile;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        registerUser,
        logout,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
