import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock authentication - in real app, this would be an API call
      const mockUser = {
        id: Date.now(),
        name: credentials.email === 'teacher@test.com' ? 'Dr. Smith' : 'John Doe',
        email: credentials.email,
        role: credentials.email === 'teacher@test.com' ? 'teacher' : 'student'
      };
      
      setUser(mockUser);
      setLoading(false);
      return true;
    } catch (err) {
      setError('Login failed. Please try again.');
      setLoading(false);
      return false;
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock registration - in real app, this would be an API call
      const newUser = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        role: userData.role
      };
      
      setUser(newUser);
      setLoading(false);
      return true;
    } catch (err) {
      setError('Registration failed. Please try again.');
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      clearError
    }}>
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