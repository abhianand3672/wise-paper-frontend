import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken, saveToken, removeToken, getUser, saveUser, removeUser } from '../utils/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getUser());
  const [token, setToken] = useState(getToken());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUser(getUser());
    setToken(getToken());
  }, []);

  const signin = (token, user) => {
    saveToken(token);
    saveUser(user);
    setToken(token);
    setUser(user);
  };

  const signout = () => {
    removeToken();
    removeUser();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, setLoading, signin, signout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}