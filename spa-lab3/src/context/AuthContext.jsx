import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    const userData = sessionStorage.getItem('userData');
    if (token && userData) {
      setIsAuth(true);
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error('Error parsing userData:', e);
        sessionStorage.removeItem('userData');
      }
    } else {
      setIsAuth(false);
      setUser(null);
    }
  }, []);

  function login(token, userData) {
    sessionStorage.setItem('authToken', token);
    sessionStorage.setItem('userData', JSON.stringify(userData));
    setIsAuth(true);
    setUser(userData);
  }

  function logout() {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userData');
    setIsAuth(false);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ isAuth, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
