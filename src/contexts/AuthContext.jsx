import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage, hashPassword } from '../utils/helpers';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const currentUser = storage.get('currentUser');
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const register = async (userData) => {
    try {
      const { pseudo, birthDate, password, email } = userData;
      
      // Hash password
      const hashedPassword = await hashPassword(password);
      
      // Get existing users
      const users = storage.get('users') || [];
      
      // Check if pseudo already exists
      if (users.find(u => u.pseudo === pseudo)) {
        return { success: false, error: 'Ce pseudo est déjà pris' };
      }
      
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        pseudo,
        birthDate,
        email,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
        streakStart: new Date().toISOString(),
        currentStreak: 1,
        lastCheckIn: new Date().toISOString()
      };
      
      // Save user
      users.push(newUser);
      storage.set('users', users);
      
      // Set current user (remove password from context)
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      storage.set('currentUser', userWithoutPassword);
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Erreur lors de l\'inscription' };
    }
  };

  const login = async (pseudo, password) => {
    try {
      const hashedPassword = await hashPassword(password);
      const users = storage.get('users') || [];
      
      const foundUser = users.find(
        u => u.pseudo === pseudo && u.password === hashedPassword
      );
      
      if (!foundUser) {
        return { success: false, error: 'Pseudo ou mot de passe incorrect' };
      }
      
      // Update last check-in and streak
      const today = new Date().toDateString();
      const lastCheckIn = new Date(foundUser.lastCheckIn).toDateString();
      
      if (today !== lastCheckIn) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const wasYesterday = yesterday.toDateString() === lastCheckIn;
        
        foundUser.currentStreak = wasYesterday ? foundUser.currentStreak + 1 : 1;
        foundUser.lastCheckIn = new Date().toISOString();
        
        // Update in storage
        const userIndex = users.findIndex(u => u.id === foundUser.id);
        users[userIndex] = foundUser;
        storage.set('users', users);
      }
      
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      storage.set('currentUser', userWithoutPassword);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Erreur lors de la connexion' };
    }
  };

  const logout = () => {
    setUser(null);
    storage.remove('currentUser');
  };

  const updateUser = (updates) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    storage.set('currentUser', updatedUser);
    
    // Also update in users array
    const users = storage.get('users') || [];
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates };
      storage.set('users', users);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
