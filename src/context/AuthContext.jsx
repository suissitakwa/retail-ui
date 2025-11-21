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


  const setAuthData = (token, profileData) => {
    if (token) {
      localStorage.setItem("accessToken", token);
    } else {
      localStorage.removeItem("accessToken");
    }

    setUser(profileData ? { ...profileData } : null);
  };


  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    fetchProfile()
      .then(res => {
        // 🔥 Force React to re-render with new profile object
        setUser({ ...res.data });
      })
      .catch(() => {
        localStorage.removeItem("accessToken");
        setUser(null);
      });
  }, []);


  const login = async (email, password) => {
    const res = await apiLogin(email, password);
    const token = res.data.token;

    localStorage.setItem("accessToken", token);

    const profileRes = await fetchProfile();

    // 🔥 use our improved global updater
    setAuthData(token, profileRes.data);

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
