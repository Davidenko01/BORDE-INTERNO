import React, { createContext, useContext, useEffect, useState } from 'react';
import { login as apiLogin, register as apiRegister } from '../services/authService';
import { getToken, saveToken, clearToken } from '../storage/tokenStorage';
import { jwtDecode } from 'jwt-decode';

type User = {
  sub?: string | number;
  email?: string;
  role?: string;
  [key: string]: any;
};

type AuthContextType = {
  userToken: string | null;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  userToken: null,
  user: null,
  login: async () => {},
  logout: () => {},
  register: async () => {},
});

export const AuthProvider = ({ children }:{ children: React.ReactNode }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadToken = async () => {
      const token = await getToken();
      setUserToken(token);
      if (token) {
        try {
          const decoded = jwtDecode<User>(token);
          setUser(decoded);
        } catch (e) {
          console.error("Error al decodificar el token al inicio:", e);
        }
      }
    };
    loadToken();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await apiLogin(email, password);
    await saveToken(data.access_token);
    setUserToken(data.access_token);
    try {
      const decoded = jwtDecode<User>(data.access_token);
      setUser(decoded);
    } catch (e) {
      console.error("Error al decodificar el token en login:", e);
    }
  };

  const register = async (email: string, password: string) => {
    const data = await apiRegister(email, password);
    await saveToken(data.access_token);
    setUserToken(data.access_token);
    try {
      const decoded = jwtDecode<User>(data.access_token);
      setUser(decoded);
    } catch (e) {
      console.error("Error al decodificar el token en registro:", e);
    }
  };

  const logout = async () => {
    await clearToken();
    setUserToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ userToken, user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
