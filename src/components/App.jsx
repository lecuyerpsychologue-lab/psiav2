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
import Psy from './modules/Psy/Psy';
import Oracle from './modules/Oracle/Oracle';
import Echo from './modules/Echo/Echo';
import Heros from './modules/Heros/Heros';
import Identite from './modules/Identite/Identite';
import Lumiere from './modules/Lumiere/Lumiere';

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
      case 'psy':
        return <Psy onBack={onBack} />;
      case 'oracle':
        return <Oracle onBack={onBack} />;
      case 'echo':
        return <Echo onBack={onBack} />;
      case 'heros':
        return <Heros onBack={onBack} />;
      case 'identite':
        return <Identite onBack={onBack} />;
      case 'lumiere':
        return <Lumiere onBack={onBack} />;
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