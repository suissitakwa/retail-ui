import React, { createContext, useState, useEffect, useContext } from 'react';
import { login as apiLogin, fetchProfile } from '../api';

const AuthContext = createContext({ user: null, login: async ()=>{}, logout: ()=>{} });

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      fetchProfile()
        .then(res => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('accessToken');
          setUser(null);
        });
    }
  }, []);

  const login = async (email, password) => {
     const res = await apiLogin(email, password);
    localStorage.setItem('accessToken', res.data.token);
    const profileRes = await fetchProfile();
    setUser(profileRes.data);
    return profileRes.data;
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
