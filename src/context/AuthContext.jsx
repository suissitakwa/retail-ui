import React, { createContext, useState, useEffect, useContext } from 'react';
import { login as apiLogin, fetchProfile } from '../api';

const AuthContext = createContext({
  user: null,
  login: async () => {},
  logout: () => {},
  setAuthData: () => {}
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);


  const setAuthData = (token, profileData, refreshToken = null) => {
    if (token) {
      localStorage.setItem("accessToken", token);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
    } else {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }

    setUser(profileData ? { ...profileData } : null);
  };


  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    fetchProfile()
      .then(res => {
        setUser({ ...res.data });
      })
      .catch(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setUser(null);
      });
  }, []);

  // Listen for silent logout triggered by the JWT refresh interceptor
  useEffect(() => {
    const handleAuthLogout = () => setAuthData(null, null);
    window.addEventListener('auth:logout', handleAuthLogout);
    return () => window.removeEventListener('auth:logout', handleAuthLogout);
  }, []);


  const login = async (email, password) => {
    const res = await apiLogin(email, password);
    const { token, refreshToken } = res.data;

    localStorage.setItem("accessToken", token);
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

    const profileRes = await fetchProfile();
    setAuthData(token, profileRes.data, refreshToken);

    return profileRes.data;
  };

  // Logout
  const logout = () => {
    setAuthData(null, null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, setAuthData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
