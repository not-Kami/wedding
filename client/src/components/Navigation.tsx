import React from 'react';
import { useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="nav-content">
        <a href="/dashboard" className="nav-brand">
          Wedding Planner - Todo Test
        </a>
        
        <div className="nav-buttons">
          <button
            className={`nav-button ${isActive('/dashboard') || isActive('/') ? 'active' : ''}`}
            onClick={() => window.location.href = '/dashboard'}
          >
            <span className="nav-icon">🏠</span>
            <span className="nav-label">Dashboard</span>
          </button>
          
          <button
            className={`nav-button ${isActive('/weddings') ? 'active' : ''}`}
            onClick={() => window.location.href = '/weddings'}
          >
            <span className="nav-icon">💒</span>
            <span className="nav-label">Tous les mariages</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;