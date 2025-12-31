import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Heart } from 'lucide-react';

const Login = ({ onSwitchToRegister }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    pseudo: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.pseudo, formData.password);
    
    if (!result.success) {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-cream via-coral/10 to-teal/10 dark:from-dark-bg dark:via-dark-card dark:to-dark-bg">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-pulse">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-4 rounded-3xl bg-gradient-to-br from-coral to-teal shadow-lg">
            <Heart className="w-10 h-10 text-white icon-glow" />
          </div>
          <h1 className="text-4xl font-bold text-slate dark:text-dark-text mb-2">
            TheraSpace
          </h1>
          <p className="text-slate/70 dark:text-dark-text/70">
            Ton thérapeute de poche
          </p>
        </div>

        <div className="glass-card">
          <h2 className="text-2xl font-bold text-slate dark:text-dark-text mb-6">
            Connexion
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Ton pseudo"
              value={formData.pseudo}
              onChange={(e) => setFormData({ ...formData, pseudo: e.target.value })}
              error={error && ''}
              required
            />

            <Input
              type="password"
              placeholder="Mot de passe"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />

            {error && (
              <div className="p-3 rounded-xl bg-coral/10 border border-coral/20">
                <p className="text-sm text-coral">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={onSwitchToRegister}
              className="text-teal hover:underline"
            >
              Pas encore de compte ? Créer un compte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
