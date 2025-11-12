import React, { createContext, useState, useEffect, useContext } from 'react';
// Assuming your api.js is in '../api.js'
import { login as apiLogin, fetchProfile } from '../api';

const AuthContext = createContext({ user: null, login: async ()=>{}, logout: ()=>{}, setAuthData: ()=>{} });

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // New function to handle setting both token and user state
  const setAuthData = (token, profileData) => {
    if (token) {
      localStorage.setItem('accessToken', token);
    } else {
      localStorage.removeItem('accessToken');
    }
    setUser(profileData);
  };

  // 1. Check for token on component mount (page refresh)
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      // In a real app, you might decode the token or validate it before fetching profile
      fetchProfile()
        .then(res => setUser(res.data))
        .catch(() => {
          // If token is invalid, log out the user
          localStorage.removeItem('accessToken');
          setUser(null);
        });
    }
  }, []);

  const login = async (email, password) => {
    // Step 1: get token
    const res = await apiLogin(email, password);
    const token = res.data.token;

    // Step 2: store token immediately
    localStorage.setItem('accessToken', token);

    // Step 3: now fetch profile (the Axios interceptor will attach the token)
    const profileRes = await fetchProfile();

    // Step 4: update React state
    setAuthData(token, profileRes.data);

    return profileRes.data;
  };


  // 3. Logout: Clears token and user state
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