import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuth, setIsAuth] = useState(false);
  useEffect(() => {
    setIsAuth(!!sessionStorage.getItem('authToken'));
  }, []);

  function login(token) {
    sessionStorage.setItem('authToken', token);
    setIsAuth(true);
  }
  function logout() {
    sessionStorage.removeItem('authToken');
    setIsAuth(false);
  }

  return (
    <AuthContext.Provider value={{ isAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
