import React, { useState } from 'react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import Login from './auth/Login';
import Register from './auth/Register';
import Dashboard from './dashboard/Dashboard';
import Humeur from './modules/Humeur/Humeur';
import Respiration from './modules/Respiration/Respiration';
import Ancrage from './modules/Ancrage/Ancrage';
import Journal from './modules/Journal/Journal';

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

  // Module routing
  const renderModule = () => {
    const onBack = () => setCurrentModule(null);
    
    switch (currentModule) {
      case 'humeur':
        return <Humeur onBack={onBack} />;
      case 'respiration':
        return <Respiration onBack={onBack} />;
      case 'ancrage':
        return <Ancrage onBack={onBack} />;
      case 'journal':
        return <Journal onBack={onBack} />;
      case 'echo':
      case 'psy':
      case 'heros':
      case 'oracle':
      case 'identite':
        return (
          <div className="h-screen flex items-center justify-center bg-cream dark:bg-dark-bg">
            <div className="text-center max-w-md px-4">
              <h1 className="text-3xl font-bold text-slate dark:text-dark-text mb-4">
                Module: {currentModule}
              </h1>
              <p className="text-slate/70 dark:text-dark-text/70 mb-6">
                Ce module est en cours de développement
              </p>
              <button
                onClick={onBack}
                className="px-6 py-3 rounded-2xl bg-teal text-white hover:bg-teal/90 transition-colors"
              >
                Retour au Dashboard
              </button>
            </div>
          </div>
        );
      default:
        return <Dashboard onNavigate={setCurrentModule} />;
    }
  };

  return renderModule();
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