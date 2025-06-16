import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Wedding {
  _id: string;
  name: string;
  date: string;
  place: string;
  vendors: string[];
}

interface Guest {
  _id: string;
  name: string;
  status: string;
}

interface Vendor {
  _id: string;
  name: string;
  type: string;
}

interface WeddingDetailsProps {
  weddingId?: string;
  onWeddingUpdate?: (wedding: Wedding) => void;
}

const WeddingDetails: React.FC<WeddingDetailsProps> = ({ weddingId, onWeddingUpdate }) => {
  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    place: ''
  });
  const [loading, setLoading] = useState(false);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);

  useEffect(() => {
    if (weddingId) {
      axios.get(`http://localhost:3000/api/weddings/${weddingId}`)
        .then(res => setWedding(res.data))
        .catch(() => setWedding(null));
    }
  }, [weddingId]);

  useEffect(() => {
    if (weddingId) {
      axios.get(`http://localhost:3000/api/vendors?wedding=${weddingId}`)
        .then(res => setVendors(res.data))
        .catch(() => setVendors([]));
      axios.get(`http://localhost:3000/api/guests?wedding=${weddingId}`)
        .then(res => setGuests(res.data))
        .catch(() => setGuests([]));
    }
  }, [weddingId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.date || !formData.place) {
      toast.error('Tous les champs sont obligatoires');
      return;
    }

    try {
      setLoading(true);
      let response;
      
      if (weddingId) {
        response = await axios.put(`http://localhost:3000/api/weddings/${weddingId}`, formData);
        toast.success('Mariage mis à jour avec succès');
      } else {
        response = await axios.post('http://localhost:3000/api/weddings', formData);
        toast.success('Mariage créé avec succès');
      }
      
      setWedding(response.data);
      setIsEditing(false);
      if (onWeddingUpdate) {
        onWeddingUpdate(response.data);
      }
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading && !wedding) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="wedding-details-container">
      <div className="wedding-details-header">
        <h2>Détails du Mariage</h2>
        {wedding && !isEditing && (
          <button 
            className="btn btn-primary"
            onClick={() => setIsEditing(true)}
          >
            Modifier
          </button>
        )}
      </div>

      {isEditing || !wedding ? (
        <form onSubmit={handleSubmit} className="wedding-form">
          <div className="form-group">
            <label htmlFor="name">Nom du mariage *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Ex: Mariage de Marie et Pierre"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="date">Date *</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="place">Lieu *</label>
            <input
              type="text"
              id="place"
              name="place"
              value={formData.place}
              onChange={handleInputChange}
              placeholder="Ex: Château de Versailles"
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Sauvegarde...' : (weddingId ? 'Mettre à jour' : 'Créer')}
            </button>
            {wedding && (
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    name: wedding.name,
                    date: wedding.date.split('T')[0],
                    place: wedding.place
                  });
                }}
              >
                Annuler
              </button>
            )}
          </div>
        </form>
      ) : (
        <div className="wedding-info">
          <div className="info-item">
            <strong>Nom:</strong> {wedding.name}
          </div>
          <div className="info-item">
            <strong>Date:</strong> {new Date(wedding.date).toLocaleDateString('fr-FR')}
          </div>
          <div className="info-item">
            <strong>Lieu:</strong> {wedding.place}
          </div>
          <div className="info-item">
            <strong>Prestataires:</strong> {vendors.length}
          </div>
          <div className="info-item">
            <strong>Invités:</strong> {guests.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeddingDetails;