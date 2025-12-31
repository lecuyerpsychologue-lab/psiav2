import React, { useState } from 'react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import Login from './auth/Login';
import Register from './auth/Register';
import Dashboard from './dashboard/Dashboard';

const AppContent = () => {
  const { user, loading } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const [currentModule, setCurrentModule] = useState(null);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-cream dark:bg-dark-bg">
        <div className="text-2xl font-bold text-slate dark:text-dark-text">
          Chargement...
        </div>
      </div>
    );
  }

  if (!user) {
    return showRegister ? (
      <Register onSwitchToLogin={() => setShowRegister(false)} />
    ) : (
      <Login onSwitchToRegister={() => setShowRegister(true)} />
    );
  }

  // If a module is selected, show it (placeholder for now)
  if (currentModule) {
    return (
      <div className="h-screen flex items-center justify-center bg-cream dark:bg-dark-bg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate dark:text-dark-text mb-4">
            Module: {currentModule}
          </h1>
          <button
            onClick={() => setCurrentModule(null)}
            className="px-6 py-3 rounded-2xl bg-teal text-white hover:bg-teal/90 transition-colors"
          >
            Retour au Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <Dashboard onNavigate={setCurrentModule} />;
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;