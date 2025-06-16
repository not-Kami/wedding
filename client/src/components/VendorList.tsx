import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Vendor {
  _id: string;
  name: string;
  type: 'photographer' | 'caterer' | 'decorator' | 'musician' | 'transportation';
  contact: string;
<<<<<<< HEAD
}

const VendorList: React.FC = () => {
=======
  wedding?: string;
}

interface VendorListProps {
  weddingId: string;
}

const VendorList: React.FC<VendorListProps> = ({ weddingId }) => {
>>>>>>> e96b766 (improved basic component & navigation)
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'photographer' as Vendor['type'],
    contact: ''
  });

  const vendorTypes = {
    photographer: 'Photographe',
    caterer: 'Traiteur',
    decorator: 'Décorateur',
    musician: 'Musicien',
    transportation: 'Transport'
  };

  useEffect(() => {
    fetchVendors();
<<<<<<< HEAD
  }, []);
=======
  }, [weddingId]);
>>>>>>> e96b766 (improved basic component & navigation)

  const fetchVendors = async () => {
    try {
      setLoading(true);
<<<<<<< HEAD
      const response = await axios.get('http://localhost:3000/api/vendors');
      setVendors(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des prestataires');
=======
      const response = await axios.get<Vendor[]>(`http://localhost:3000/api/vendors?wedding=${weddingId}`);
      setVendors(response.data);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des prestataires';
      toast.error(errorMessage);
>>>>>>> e96b766 (improved basic component & navigation)
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.contact.trim()) {
      toast.error('Tous les champs sont obligatoires');
      return;
    }

    try {
<<<<<<< HEAD
      let response;
      if (editingVendor) {
        response = await axios.put(`http://localhost:3000/api/vendors/${editingVendor._id}`, formData);
=======
      let response: { data: Vendor };
      if (editingVendor) {
        response = await axios.put<Vendor>(`http://localhost:3000/api/vendors/${editingVendor._id}`, {
          ...formData,
          wedding: weddingId
        });
>>>>>>> e96b766 (improved basic component & navigation)
        setVendors(vendors.map(vendor => 
          vendor._id === editingVendor._id ? response.data : vendor
        ));
        toast.success('Prestataire mis à jour avec succès');
      } else {
<<<<<<< HEAD
        response = await axios.post('http://localhost:3000/api/vendors', formData);
=======
        response = await axios.post<Vendor>('http://localhost:3000/api/vendors', {
          ...formData,
          wedding: weddingId
        });
>>>>>>> e96b766 (improved basic component & navigation)
        setVendors([...vendors, response.data]);
        toast.success('Prestataire ajouté avec succès');
      }
      
      resetForm();
<<<<<<< HEAD
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
=======
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la sauvegarde';
      toast.error(errorMessage);
>>>>>>> e96b766 (improved basic component & navigation)
    }
  };

  const resetForm = () => {
    setFormData({ name: '', type: 'photographer', contact: '' });
    setShowForm(false);
    setEditingVendor(null);
  };

  const editVendor = (vendor: Vendor) => {
    setFormData({
      name: vendor.name,
      type: vendor.type,
      contact: vendor.contact
    });
    setEditingVendor(vendor);
    setShowForm(true);
  };

  const deleteVendor = async (vendorId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce prestataire ?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/api/vendors/${vendorId}`);
      setVendors(vendors.filter(vendor => vendor._id !== vendorId));
      toast.success('Prestataire supprimé');
<<<<<<< HEAD
    } catch (error) {
      toast.error('Erreur lors de la suppression');
=======
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression';
      toast.error(errorMessage);
>>>>>>> e96b766 (improved basic component & navigation)
    }
  };

  const getVendorIcon = (type: string) => {
    switch (type) {
      case 'photographer': return '📸';
      case 'caterer': return '🍽️';
      case 'decorator': return '🎨';
      case 'musician': return '🎵';
      case 'transportation': return '🚗';
      default: return '👤';
    }
  };

  if (loading) {
    return <div className="loading">Chargement des prestataires...</div>;
  }

  return (
    <div className="vendor-list-container">
      <div className="vendor-list-header">
        <h2>Prestataires ({vendors.length})</h2>
        <button 
<<<<<<< HEAD
          className="btn-primary"
=======
          className="btn btn-primary"
>>>>>>> e96b766 (improved basic component & navigation)
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Annuler' : 'Ajouter un prestataire'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="vendor-form">
          <div className="form-group">
            <label htmlFor="vendorName">Nom du prestataire *</label>
            <input
              type="text"
              id="vendorName"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nom de l'entreprise ou de la personne"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="vendorType">Type de prestataire *</label>
            <select
              id="vendorType"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as Vendor['type'] })}
              required
            >
              {Object.entries(vendorTypes).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="vendorContact">Contact *</label>
            <input
              type="text"
              id="vendorContact"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              placeholder="Téléphone, email ou adresse"
              required
            />
          </div>

          <div className="form-actions">
<<<<<<< HEAD
            <button type="submit" className="btn-primary">
              {editingVendor ? 'Mettre à jour' : 'Ajouter'}
            </button>
            <button type="button" className="btn-secondary" onClick={resetForm}>
=======
            <button type="submit" className="btn btn-primary">
              {editingVendor ? 'Mettre à jour' : 'Ajouter'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
>>>>>>> e96b766 (improved basic component & navigation)
              Annuler
            </button>
          </div>
        </form>
      )}

      <div className="vendors-grid">
        {vendors.length === 0 ? (
          <p className="no-data">Aucun prestataire ajouté pour le moment.</p>
        ) : (
          vendors.map((vendor) => (
            <div key={vendor._id} className="vendor-card">
              <div className="vendor-header">
                <span className="vendor-icon">{getVendorIcon(vendor.type)}</span>
                <div className="vendor-info">
                  <h3>{vendor.name}</h3>
                  <span className="vendor-type">{vendorTypes[vendor.type]}</span>
                </div>
              </div>
              
              <div className="vendor-contact">
                <strong>Contact:</strong> {vendor.contact}
              </div>
              
              <div className="vendor-actions">
                <button
                  onClick={() => editVendor(vendor)}
<<<<<<< HEAD
                  className="btn-edit"
=======
                  className="btn btn-edit"
>>>>>>> e96b766 (improved basic component & navigation)
                  title="Modifier le prestataire"
                >
                  ✏️
                </button>
                <button
                  onClick={() => deleteVendor(vendor._id)}
<<<<<<< HEAD
                  className="btn-delete"
=======
                  className="btn btn-delete"
>>>>>>> e96b766 (improved basic component & navigation)
                  title="Supprimer le prestataire"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="vendor-stats">
        {Object.entries(vendorTypes).map(([type, label]) => {
          const count = vendors.filter(v => v.type === type).length;
          return count > 0 ? (
            <div key={type} className="stat-item">
              <span className="stat-icon">{getVendorIcon(type)}</span>
              <span className="stat-number">{count}</span>
              <span className="stat-label">{label}</span>
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
};

export default VendorList;