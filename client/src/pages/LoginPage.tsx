import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
<<<<<<< HEAD
import axios from 'axios';
import toast from 'react-hot-toast';
=======
import toast from 'react-hot-toast';
import { authService } from '../services/auth.service';
>>>>>>> e96b766 (improved basic component & navigation)

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
<<<<<<< HEAD
      const response = await axios.post('http://localhost:3000/api/auth/login', data);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        toast.success('Connexion réussie !');
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.response?.status === 401) {
        toast.error('Email ou mot de passe incorrect');
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Erreur lors de la connexion. Veuillez réessayer.');
      }
=======
      await authService.login(data.email, data.password);
      toast.success('Connexion réussie !');
      navigate('/dashboard');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
      toast.error(errorMessage);
>>>>>>> e96b766 (improved basic component & navigation)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Wedding Planner</h1>
          <h2>Connexion</h2>
          <p>Accédez à votre espace de planification de mariage</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Adresse email *</label>
            <input
              type="email"
              id="email"
              {...register('email', {
                required: 'L\'email est obligatoire',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Adresse email invalide'
                }
              })}
              className={errors.email ? 'error' : ''}
              placeholder="votre@email.com"
              autoComplete="email"
            />
            {errors.email && (
              <span className="error-message">{errors.email.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe *</label>
            <input
              type="password"
              id="password"
              {...register('password', {
                required: 'Le mot de passe est obligatoire',
                minLength: {
                  value: 6,
                  message: 'Le mot de passe doit contenir au moins 6 caractères'
                }
              })}
              className={errors.password ? 'error' : ''}
              placeholder="Votre mot de passe"
              autoComplete="current-password"
            />
            {errors.password && (
              <span className="error-message">{errors.password.message}</span>
            )}
          </div>

<<<<<<< HEAD
          <button 
            type="submit" 
            className="btn-primary auth-submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Connexion en cours...
              </>
            ) : (
              'Se connecter'
            )}
=======
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
>>>>>>> e96b766 (improved basic component & navigation)
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Vous n'avez pas encore de compte ?{' '}
            <button 
              type="button"
              onClick={() => navigate('/register')} 
              className="link-button"
              disabled={loading}
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