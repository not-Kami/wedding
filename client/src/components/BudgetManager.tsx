import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Budget {
  _id: string;
  wedding: string;
  spending: number;
  totalBudget: number;
  status: 'pending' | 'approved' | 'rejected';
  category?: string;
  description?: string;
}

interface BudgetManagerProps {
  weddingId: string;
}

const BudgetManager: React.FC<BudgetManagerProps> = ({ weddingId }) => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    spending: '',
    totalBudget: '',
    category: '',
    description: '',
    status: 'pending' as const
  });

  const categories = [
    'Lieu de réception',
    'Traiteur',
    'Photographe',
    'Décoration',
    'Musique',
    'Transport',
    'Tenue',
    'Fleurs',
    'Autre'
  ];

  useEffect(() => {
    fetchBudgets();
  }, [weddingId]);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/api/budgets?wedding=${weddingId}`);
      setBudgets(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement du budget');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.spending || !formData.totalBudget || !formData.category) {
      toast.error('Tous les champs obligatoires doivent être remplis');
      return;
    }

    const spending = parseFloat(formData.spending);
    const totalBudget = parseFloat(formData.totalBudget);

    if (spending < 0 || totalBudget < 0) {
      toast.error('Les montants doivent être positifs');
      return;
    }

    if (spending > totalBudget) {
      toast.error('La dépense ne peut pas dépasser le budget total');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/budgets', {
        wedding: weddingId,
        spending,
        totalBudget,
        category: formData.category,
        description: formData.description,
        status: formData.status
      });
      
      setBudgets([...budgets, response.data]);
      setFormData({
        spending: '',
        totalBudget: '',
        category: '',
        description: '',
        status: 'pending'
      });
      setShowForm(false);
      toast.success('Poste budgétaire ajouté avec succès');
    } catch (error) {
      toast.error('Erreur lors de l\'ajout du poste budgétaire');
    }
  };

  const updateBudgetStatus = async (budgetId: string, status: Budget['status']) => {
    try {
      await axios.put(`http://localhost:3000/api/budgets/${budgetId}`, { status });
      setBudgets(budgets.map(budget => 
        budget._id === budgetId ? { ...budget, status } : budget
      ));
      toast.success('Statut mis à jour');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const deleteBudget = async (budgetId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce poste budgétaire ?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/api/budgets/${budgetId}`);
      setBudgets(budgets.filter(budget => budget._id !== budgetId));
      toast.success('Poste budgétaire supprimé');
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const getTotalSpending = () => {
    return budgets.reduce((total, budget) => total + budget.spending, 0);
  };

  const getTotalBudget = () => {
    return budgets.reduce((total, budget) => total + budget.totalBudget, 0);
  };

  const getRemainingBudget = () => {
    return getTotalBudget() - getTotalSpending();
  };

  const getBudgetPercentage = () => {
    const total = getTotalBudget();
    return total > 0 ? (getTotalSpending() / total) * 100 : 0;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#10b981';
      case 'rejected': return '#ef4444';
      default: return '#f59e0b';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Approuvé';
      case 'rejected': return 'Rejeté';
      default: return 'En attente';
    }
  };

  if (loading) {
    return <div className="loading">Chargement du budget...</div>;
  }

  return (
    <div className="budget-manager-container">
      <div className="budget-header">
        <h2>Gestion du Budget</h2>
        <button 
<<<<<<< HEAD
          className="btn-primary"
=======
          className="btn btn-primary"
>>>>>>> e96b766 (improved basic component & navigation)
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Annuler' : 'Ajouter un poste'}
        </button>
      </div>

      {/* Résumé du budget */}
      <div className="budget-summary">
        <div className="summary-card">
          <h3>Budget Total</h3>
          <span className="amount">{getTotalBudget().toLocaleString('fr-FR')} €</span>
        </div>
        <div className="summary-card">
          <h3>Dépenses</h3>
          <span className="amount spent">{getTotalSpending().toLocaleString('fr-FR')} €</span>
        </div>
        <div className="summary-card">
          <h3>Restant</h3>
          <span className={`amount ${getRemainingBudget() < 0 ? 'negative' : 'positive'}`}>
            {getRemainingBudget().toLocaleString('fr-FR')} €
          </span>
        </div>
        <div className="summary-card">
          <h3>Utilisé</h3>
          <span className="percentage">{getBudgetPercentage().toFixed(1)}%</span>
        </div>
      </div>

      {/* Barre de progression */}
      <div className="budget-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ 
              width: `${Math.min(getBudgetPercentage(), 100)}%`,
              backgroundColor: getBudgetPercentage() > 100 ? '#ef4444' : '#10b981'
            }}
          ></div>
        </div>
        {getBudgetPercentage() > 100 && (
          <p className="budget-warning">⚠️ Budget dépassé !</p>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="budget-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Catégorie *</label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="spending">Dépense (€) *</label>
              <input
                type="number"
                id="spending"
                value={formData.spending}
                onChange={(e) => setFormData({ ...formData, spending: e.target.value })}
                placeholder="0"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="totalBudget">Budget alloué (€) *</label>
              <input
                type="number"
                id="totalBudget"
                value={formData.totalBudget}
                onChange={(e) => setFormData({ ...formData, totalBudget: e.target.value })}
                placeholder="0"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <input
              type="text"
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Description optionnelle"
            />
          </div>

<<<<<<< HEAD
          <button type="submit" className="btn-primary">
=======
          <button type="submit" className="btn btn-primary">
>>>>>>> e96b766 (improved basic component & navigation)
            Ajouter le poste budgétaire
          </button>
        </form>
      )}

      <div className="budget-list">
        {budgets.length === 0 ? (
          <p className="no-data">Aucun poste budgétaire défini pour le moment.</p>
        ) : (
          budgets.map((budget) => (
            <div key={budget._id} className="budget-item">
              <div className="budget-info">
                <div className="budget-category">
                  <h4>{budget.category || 'Non catégorisé'}</h4>
                  {budget.description && <p className="budget-description">{budget.description}</p>}
                </div>
                
                <div className="budget-amounts">
                  <div className="amount-item">
                    <span className="label">Dépense:</span>
                    <span className="value">{budget.spending.toLocaleString('fr-FR')} €</span>
                  </div>
                  <div className="amount-item">
                    <span className="label">Budget:</span>
                    <span className="value">{budget.totalBudget.toLocaleString('fr-FR')} €</span>
                  </div>
                  <div className="amount-item">
                    <span className="label">Restant:</span>
                    <span className={`value ${(budget.totalBudget - budget.spending) < 0 ? 'negative' : 'positive'}`}>
                      {(budget.totalBudget - budget.spending).toLocaleString('fr-FR')} €
                    </span>
                  </div>
                </div>
              </div>

              <div className="budget-actions">
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(budget.status) }}
                >
                  {getStatusText(budget.status)}
                </span>
                
                <select
                  value={budget.status}
                  onChange={(e) => updateBudgetStatus(budget._id, e.target.value as Budget['status'])}
                  className="status-select"
                >
                  <option value="pending">En attente</option>
                  <option value="approved">Approuvé</option>
                  <option value="rejected">Rejeté</option>
                </select>
                
                <button
                  onClick={() => deleteBudget(budget._id)}
<<<<<<< HEAD
                  className="btn-delete"
=======
                  className="btn btn-delete"
>>>>>>> e96b766 (improved basic component & navigation)
                  title="Supprimer ce poste"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BudgetManager;