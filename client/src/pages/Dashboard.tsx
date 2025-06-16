import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import toast from 'react-hot-toast';
import WeddingDetails from '../components/WeddingDetails';
import GuestList from '../components/GuestList';
import VendorList from '../components/VendorList';
import BudgetManager from '../components/BudgetManager';
import WeddingForm from '../components/WeddingForm';

interface Wedding {
  _id: string;
  name: string;
  date: string;
  place: string;
  vendors: string[];
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [weddings, setWeddings] = useState<Wedding[]>([]);
  const [selectedWedding, setSelectedWedding] = useState<Wedding | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }
    
    fetchWeddings();
  }, [navigate]);

  const fetchWeddings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/weddings');
      setWeddings(response.data);
      
      // Sélectionner le premier mariage par défaut
      if (response.data.length > 0 && !selectedWedding) {
        setSelectedWedding(response.data[0]);
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des mariages');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Déconnexion réussie');
    navigate('/');
  };

  const handleWeddingCreated = (newWedding: Wedding) => {
    setWeddings([...weddings, newWedding]);
    setSelectedWedding(newWedding);
    setShowCreateForm(false);
    setActiveTab('overview');
    toast.success('Mariage créé avec succès !');
  };

  const handleWeddingUpdate = (updatedWedding: Wedding) => {
    setWeddings(weddings.map(w => w._id === updatedWedding._id ? updatedWedding : w));
    setSelectedWedding(updatedWedding);
  };

  const deleteWedding = async (weddingId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce mariage ? Cette action est irréversible.')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/api/weddings/${weddingId}`);
      const updatedWeddings = weddings.filter(w => w._id !== weddingId);
      setWeddings(updatedWeddings);
      
      if (selectedWedding?._id === weddingId) {
        setSelectedWedding(updatedWeddings.length > 0 ? updatedWeddings[0] : null);
      }
      
      toast.success('Mariage supprimé avec succès');
    } catch (error) {
      toast.error('Erreur lors de la suppression du mariage');
    }
  };

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: '🏠' },
    { id: 'guests', label: 'Invités', icon: '👥' },
    { id: 'vendors', label: 'Prestataires', icon: '🎉' },
    { id: 'budget', label: 'Budget', icon: '💰' }
  ];

  if (loading) {
    return <div className="loading">Chargement du tableau de bord...</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Wedding Planner Dashboard</h1>
          <div className="header-actions">
            <button 
              className="btn-primary"
              onClick={() => setShowCreateForm(true)}
            >
              + Nouveau mariage
            </button>
            <button 
              className="btn-secondary"
              onClick={handleLogout}
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <aside className="sidebar">
          <div className="wedding-selector">
            <h3>Mes mariages</h3>
            {weddings.length === 0 ? (
              <div className="no-weddings">
                <p>Aucun mariage créé</p>
                <button 
                  className="btn-primary"
                  onClick={() => setShowCreateForm(true)}
                >
                  Créer mon premier mariage
                </button>
              </div>
            ) : (
              <div className="wedding-list">
                {weddings.map((wedding) => (
                  <div 
                    key={wedding._id}
                    className={`wedding-item ${selectedWedding?._id === wedding._id ? 'active' : ''}`}
                    onClick={() => setSelectedWedding(wedding)}
                  >
                    <div className="wedding-info">
                      <h4>{wedding.name}</h4>
                      <p>{new Date(wedding.date).toLocaleDateString('fr-FR')}</p>
                      <p className="wedding-place">{wedding.place}</p>
                    </div>
                    <button
                      className="btn-delete-small"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteWedding(wedding._id);
                      }}
                      title="Supprimer ce mariage"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedWedding && (
            <nav className="tab-navigation">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="tab-icon">{tab.icon}</span>
                  <span className="tab-label">{tab.label}</span>
                </button>
              ))}
            </nav>
          )}
        </aside>

        <main className="main-content">
          {showCreateForm ? (
            <div className="create-wedding-section">
              <div className="section-header">
                <h2>Créer un nouveau mariage</h2>
                <button 
                  className="btn-secondary"
                  onClick={() => setShowCreateForm(false)}
                >
                  Annuler
                </button>
              </div>
              <WeddingForm onWeddingCreated={handleWeddingCreated} />
            </div>
          ) : selectedWedding ? (
            <div className="wedding-management">
              {activeTab === 'overview' && (
                <WeddingDetails 
                  weddingId={selectedWedding._id}
                  onWeddingUpdate={handleWeddingUpdate}
                />
              )}
              
              {activeTab === 'guests' && (
                <GuestList weddingId={selectedWedding._id} />
              )}
              
              {activeTab === 'vendors' && (
                <VendorList />
              )}
              
              {activeTab === 'budget' && (
                <BudgetManager weddingId={selectedWedding._id} />
              )}
            </div>
          ) : (
            <div className="welcome-section">
              <div className="welcome-content">
                <h2>Bienvenue dans votre Wedding Planner ! 👰💒</h2>
                <p>Commencez par créer votre premier mariage pour accéder à tous les outils de planification.</p>
                <button 
                  className="btn-primary btn-large"
                  onClick={() => setShowCreateForm(true)}
                >
                  Créer mon premier mariage
                </button>
              </div>
              
              <div className="features-overview">
                <h3>Fonctionnalités disponibles :</h3>
                <div className="features-grid">
                  <div className="feature-card">
                    <span className="feature-icon">🏠</span>
                    <h4>Détails du mariage</h4>
                    <p>Gérez les informations principales de votre événement</p>
                  </div>
                  <div className="feature-card">
                    <span className="feature-icon">👥</span>
                    <h4>Liste d'invités</h4>
                    <p>Suivez les RSVP et gérez vos invitations</p>
                  </div>
                  <div className="feature-card">
                    <span className="feature-icon">🎉</span>
                    <h4>Prestataires</h4>
                    <p>Organisez vos contacts professionnels</p>
                  </div>
                  <div className="feature-card">
                    <span className="feature-icon">💰</span>
                    <h4>Budget</h4>
                    <p>Contrôlez vos dépenses et votre budget</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;