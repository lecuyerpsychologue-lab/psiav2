import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { validateAge } from '../../utils/helpers';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Heart } from 'lucide-react';

const Register = ({ onSwitchToLogin }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    pseudo: '',
    birthDate: '',
    password: '',
    confirmPassword: '',
    email: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.pseudo || formData.pseudo.length < 3) {
      newErrors.pseudo = 'Le pseudo doit contenir au moins 3 caractères';
    }

    if (!formData.birthDate) {
      newErrors.birthDate = 'La date de naissance est requise';
    } else if (!validateAge(formData.birthDate)) {
      newErrors.birthDate = 'Tu dois avoir au moins 10 ans';
    }

    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    if (!formData.email || !formData.email.includes('@')) {
      newErrors.email = 'Email invalide';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    const result = await register({
      pseudo: formData.pseudo,
      birthDate: formData.birthDate,
      password: formData.password,
      email: formData.email
    });

    if (!result.success) {
      setErrors({ general: result.error });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-cream via-solar/10 to-coral/10 dark:from-dark-bg dark:via-dark-card dark:to-dark-bg">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-pulse">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-4 rounded-3xl bg-gradient-to-br from-coral to-teal shadow-lg">
            <Heart className="w-10 h-10 text-white icon-glow" />
          </div>
          <h1 className="text-4xl font-bold text-slate dark:text-dark-text mb-2">
            TheraSpace
          </h1>
          <p className="text-slate/70 dark:text-dark-text/70">
            Bienvenue dans ton espace
          </p>
        </div>

        <div className="glass-card">
          <h2 className="text-2xl font-bold text-slate dark:text-dark-text mb-6">
            Créer un compte
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Ton pseudo"
              value={formData.pseudo}
              onChange={(e) => setFormData({ ...formData, pseudo: e.target.value })}
              error={errors.pseudo}
              required
            />

            <Input
              type="date"
              placeholder="Date de naissance"
              value={formData.birthDate}
              onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
              error={errors.birthDate}
              required
            />

            <Input
              type="email"
              placeholder="Email (pour récupération)"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
              required
            />

            <Input
              type="password"
              placeholder="Mot de passe"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              error={errors.password}
              required
            />

            <Input
              type="password"
              placeholder="Confirmer le mot de passe"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              error={errors.confirmPassword}
              required
            />

            {errors.general && (
              <div className="p-3 rounded-xl bg-coral/10 border border-coral/20">
                <p className="text-sm text-coral">{errors.general}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Création..." : "Créer mon compte"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={onSwitchToLogin}
              className="text-teal hover:underline"
            >
              Déjà un compte ? Se connecter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
