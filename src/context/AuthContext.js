import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

// Hardcoded user for admin (you should use a more secure method in production)
const adminUser = {
  username: 'admin',
  password: '123', // In a real app, this should be hashed
};

// In a real app, this would be stored in a database
const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    // Check if username and password match admin credentials
    if (username === adminUser.username && password === adminUser.password) {
      const user = { username };
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    
    // Check registered users
    const userMatch = registeredUsers.find(
      user => user.username === username && user.password === password
    );
    
    if (userMatch) {
      const user = { username };
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    
    return false;
  };

  const register = (username, password, confirmPassword) => {
    // Validate inputs
    if (!username || !password || !confirmPassword) {
      return { success: false, error: 'allFieldsRequired' };
    }
    
    if (password !== confirmPassword) {
      return { success: false, error: 'passwordsMismatch' };
    }
    
    // Check if username already exists
    if (username === adminUser.username || 
        registeredUsers.some(user => user.username === username)) {
      return { success: false, error: 'usernameTaken' };
    }
    
    // Add new user
    const newUser = { username, password };
    const updatedUsers = [...registeredUsers, newUser];
    
    // Save to localStorage
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    
    // Update local state
    registeredUsers.push(newUser);
    
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}