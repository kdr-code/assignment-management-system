import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load current user on refresh
  useEffect(() => {
    const saved = localStorage.getItem('currentUser');
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  const loadUsers = () => {
    try {
      return JSON.parse(localStorage.getItem('users')) || [];
    } catch {
      return [];
    }
  };

  const saveUsers = (users) => {
    localStorage.setItem('users', JSON.stringify(users));
  };

  const login = async (credentials) => {
    setLoading(true);
    setError(null);

    try {
      const users = loadUsers();
      const existing = users.find((u) => u.email === credentials.email);

      // real check: email + password
      if (!existing || existing.password !== credentials.password) {
        setError('Invalid email or password');
        setLoading(false);
        return null;
      }

      setUser(existing);
      localStorage.setItem('currentUser', JSON.stringify(existing));
      setLoading(false);
      return existing; // truthy for both LoginPage & RegisterPage logic
    } catch (err) {
      setError('Login failed. Please try again.');
      setLoading(false);
      return null;
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const users = loadUsers();
      const existing = users.find((u) => u.email === userData.email);

      if (existing) {
        setError('Email already registered');
        setLoading(false);
        return null;
      }

      const newUser = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        password: userData.password, // plain text for demo ONLY
        role: userData.role,         // 'teacher' or 'student'
      };

      const updatedUsers = [...users, newUser];
      saveUsers(updatedUsers);

      setUser(newUser);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      setLoading(false);
      return newUser;
    } catch (err) {
      setError('Registration failed. Please try again.');
      setLoading(false);
      return null;
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem('currentUser');
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
