import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Guest {
  _id: string;
  wedding: string;
  name: string;
  RSVP: boolean;
  plusOne: boolean;
  status: 'pending' | 'confirmed' | 'cancelled';
}

interface GuestListProps {
  weddingId: string;
}

const GuestList: React.FC<GuestListProps> = ({ weddingId }) => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    RSVP: false,
    plusOne: false,
    status: 'pending' as const
  });

  useEffect(() => {
    fetchGuests();
  }, [weddingId]);

  const fetchGuests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/api/guests?wedding=${weddingId}`);
      setGuests(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des invités');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Le nom est obligatoire');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/guests', {
        ...formData,
        wedding: weddingId
      });
      
      setGuests([...guests, response.data]);
      setFormData({ name: '', RSVP: false, plusOne: false, status: 'pending' });
      setShowForm(false);
      toast.success('Invité ajouté avec succès');
    } catch (error) {
      toast.error('Erreur lors de l\'ajout de l\'invité');
    }
  };

  const updateGuestStatus = async (guestId: string, status: string) => {
    try {
      await axios.put(`http://localhost:3000/api/guests/${guestId}`, { status });
      setGuests(guests.map(guest => 
        guest._id === guestId ? { ...guest, status: status as Guest['status'] } : guest
      ));
      toast.success('Statut mis à jour');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const deleteGuest = async (guestId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet invité ?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/api/guests/${guestId}`);
      setGuests(guests.filter(guest => guest._id !== guestId));
      toast.success('Invité supprimé');
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return '#f59e0b';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmé';
      case 'cancelled': return 'Annulé';
      default: return 'En attente';
    }
  };

  if (loading) {
    return <div className="loading">Chargement des invités...</div>;
  }

  return (
    <div className="guest-list-container">
      <div className="guest-list-header">
        <h2>Liste des Invités ({guests.length})</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Annuler' : 'Ajouter un invité'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="guest-form">
          <div className="form-group">
            <label htmlFor="guestName">Nom de l'invité *</label>
            <input
              type="text"
              id="guestName"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nom complet de l'invité"
              required
            />
          </div>

          <div className="form-checkboxes">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.RSVP}
                onChange={(e) => setFormData({ ...formData, RSVP: e.target.checked })}
              />
              RSVP confirmé
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.plusOne}
                onChange={(e) => setFormData({ ...formData, plusOne: e.target.checked })}
              />
              Accompagnant (+1)
            </label>
          </div>

          <button type="submit" className="btn btn-primary">
            Ajouter l'invité
          </button>
        </form>
      )}

      <div className="guests-grid">
        {guests.length === 0 ? (
          <p className="no-data">Aucun invité ajouté pour le moment.</p>
        ) : (
          guests.map((guest) => (
            <div key={guest._id} className="guest-card">
              <div className="guest-info">
                <h3>{guest.name}</h3>
                <div className="guest-details">
                  <span className={`status-badge ${guest.status}`}>
                    {getStatusText(guest.status)}
                  </span>
                  {guest.RSVP && <span className="rsvp-badge">RSVP ✓</span>}
                  {guest.plusOne && <span className="plus-one-badge">+1</span>}
                </div>
              </div>
              
              <div className="guest-actions">
                <select
                  value={guest.status}
                  onChange={(e) => updateGuestStatus(guest._id, e.target.value)}
                  className="status-select"
                >
                  <option value="pending">En attente</option>
                  <option value="confirmed">Confirmé</option>
                  <option value="cancelled">Annulé</option>
                </select>
                
                <button
                  onClick={() => deleteGuest(guest._id)}
                  className="btn btn-danger btn-icon"
                  title="Supprimer l'invité"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="guest-stats">
        <div className="stat-item">
          <span className="stat-number">{guests.filter(g => g.status === 'confirmed').length}</span>
          <span className="stat-label">Confirmés</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{guests.filter(g => g.status === 'pending').length}</span>
          <span className="stat-label">En attente</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{guests.filter(g => g.plusOne).length}</span>
          <span className="stat-label">Accompagnants</span>
        </div>
      </div>
    </div>
  );
};

export default GuestList;