import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/auth.service';
import toast from 'react-hot-toast';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    authService.logout();
    toast.success('Déconnexion réussie');
    navigate('/');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="nav-content">
        <a href="/dashboard" className="nav-brand">
          Wedding Planner
        </a>
        
        <div className="nav-buttons">
          <button
            className={`nav-button ${isActive('/dashboard') ? 'active' : ''}`}
            onClick={() => navigate('/dashboard')}
          >
            <span className="nav-icon">🏠</span>
            <span className="nav-label">Tableau de bord</span>
          </button>
          
          <button
            className={`nav-button ${isActive('/weddings') ? 'active' : ''}`}
            onClick={() => navigate('/weddings')}
          >
            <span className="nav-icon">💒</span>
            <span className="nav-label">Mes mariages</span>
          </button>
          
          <button
            className="nav-button logout"
            onClick={handleLogout}
          >
            <span className="nav-icon">🚪</span>
            <span className="nav-label">Déconnexion</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 