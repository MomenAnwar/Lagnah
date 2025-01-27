import PropTypes from 'prop-types';
import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    user: null, 
    isLoggedIN: false,
  })

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setUserData({
        user: JSON.parse(storedUser),
        isLoggedIN: true,
      })
    }
  }, []);

  const login = (payload) => {
    sessionStorage.setItem('user', JSON.stringify(payload));
    setUserData({
      user: payload,
      isLoggedIN: true,
    })
  };

  const logout = () => {
    sessionStorage.removeItem('user');
    setUserData({
      user: null, 
      isLoggedIN: false,
    })
  };

  return (
    <AuthContext.Provider value={{ login, logout, userData }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };
