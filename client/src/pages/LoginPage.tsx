import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated && !isLoading && !isSubmitting) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, isSubmitting]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await login(email, password);
      toast.success(response.message || 'Connexion réussie !');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error instanceof Error ? error.message : 'Échec de la connexion. Veuillez vérifier vos identifiants.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="loading">Chargement...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Wedding Planner</h1>
          <h2>Connexion</h2>
          <p>Accédez à votre espace de planification de mariage</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Adresse email *</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="votre@email.com"
              autoComplete="email"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe *</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="Votre mot de passe"
              autoComplete="current-password"
              required
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Vous n'avez pas encore de compte ?{' '}
            <button 
              type="button"
              onClick={() => navigate('/register')} 
              className="link-button"
              disabled={isSubmitting}
            >
              Créer un compte
            </button>
          </p>
        </div>

        <div className="demo-section">
          <h3>Compte de démonstration</h3>
          <p>Vous pouvez utiliser ces identifiants pour tester l'application :</p>
          <div className="demo-credentials">
            <p><strong>Email:</strong> demo@weddingplanner.com</p>
            <p><strong>Mot de passe:</strong> Demo123!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;