import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError
  } = useForm<RegisterFormData>();

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    if (data.password !== data.confirmPassword) {
      setError('confirmPassword', {
        type: 'manual',
        message: 'Les mots de passe ne correspondent pas'
      });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:3000/api/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        toast.success('Inscription réussie ! Bienvenue !');
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.status === 400) {
        toast.error('Données invalides. Vérifiez vos informations.');
      } else if (error.response?.status === 409) {
        toast.error('Cette adresse email est déjà utilisée.');
      } else {
        toast.error('Erreur lors de l\'inscription. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Wedding Planner</h1>
          <h2>Créer un compte</h2>
          <p>Rejoignez-nous pour planifier votre mariage de rêve</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Nom complet *</label>
            <input
              type="text"
              id="name"
              {...register('name', {
                required: 'Le nom est obligatoire',
                minLength: {
                  value: 2,
                  message: 'Le nom doit contenir au moins 2 caractères'
                },
                maxLength: {
                  value: 50,
                  message: 'Le nom ne peut pas dépasser 50 caractères'
                }
              })}
              className={errors.name ? 'error' : ''}
              placeholder="Votre nom complet"
            />
            {errors.name && (
              <span className="error-message">{errors.name.message}</span>
            )}
          </div>

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
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message: 'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'
                }
              })}
              className={errors.password ? 'error' : ''}
              placeholder="Votre mot de passe"
            />
            {errors.password && (
              <span className="error-message">{errors.password.message}</span>
            )}
            <div className="password-requirements">
              <small>
                Le mot de passe doit contenir :
                <ul>
                  <li>Au moins 6 caractères</li>
                  <li>Une lettre minuscule</li>
                  <li>Une lettre majuscule</li>
                  <li>Un chiffre</li>
                </ul>
              </small>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmer le mot de passe *</label>
            <input
              type="password"
              id="confirmPassword"
              {...register('confirmPassword', {
                required: 'Veuillez confirmer votre mot de passe',
                validate: value => 
                  value === password || 'Les mots de passe ne correspondent pas'
              })}
              className={errors.confirmPassword ? 'error' : ''}
              placeholder="Confirmez votre mot de passe"
            />
            {errors.confirmPassword && (
              <span className="error-message">{errors.confirmPassword.message}</span>
            )}
          </div>

          <button 
            type="submit" 
            className="btn-primary auth-submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Inscription en cours...
              </>
            ) : (
              'Créer mon compte'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Vous avez déjà un compte ?{' '}
            <button 
              type="button"
              onClick={() => navigate('/')} 
              className="link-button"
              disabled={loading}
            >
              Se connecter
            </button>
          </p>
        </div>

        <div className="auth-features">
          <h3>Pourquoi nous choisir ?</h3>
          <div className="features-grid">
            <div className="feature-item">
              <span className="feature-icon">👰</span>
              <span>Planification complète</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">💰</span>
              <span>Gestion du budget</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">👥</span>
              <span>Liste d'invités</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🎉</span>
              <span>Prestataires</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;