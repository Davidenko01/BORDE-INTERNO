import React, { createContext, useContext, useEffect, useState } from 'react';
import { login as apiLogin, register as apiRegister } from '../services/authService';
import { getToken, saveToken, clearToken } from '../storage/tokenStorage';

type AuthContextType = {
  //token
  userToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  userToken: null,
  login: async () => {},
  logout: () => {},
  register: async () => {},
});

export const AuthProvider = ({ children }:{ children: React.ReactNode }) => {
  const [userToken, setUserToken] = useState<string | null>(null);

  useEffect(() => {
    const loadToken = async () => {
      const token = await getToken();
      setUserToken(token);
    };
    loadToken();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await apiLogin(email, password);
    await saveToken(data.access_token);
    setUserToken(data.access_token);
  };

  const register = async (email: string, password: string) => {
    const data = await apiRegister(email, password);
    await saveToken(data.access_token);
    setUserToken(data.access_token);
  };

  const logout = async () => {
    await clearToken();
    setUserToken(null);
  };

  return (
    <AuthContext.Provider value={{ userToken, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
