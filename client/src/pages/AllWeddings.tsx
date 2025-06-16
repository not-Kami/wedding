import React, { useState, useEffect } from 'react'
import Navigation from '../components/Navigation'

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
  RSVP: boolean;
  plusOne: boolean;
  status: 'pending' | 'confirmed' | 'cancelled';
}

interface Vendor {
  _id: string;
  name: string;
  type: string;
  contact: string;
}

function AllWeddings() {
  const [weddings, setWeddings] = useState<Wedding[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedWedding, setSelectedWedding] = useState<Wedding | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchWeddings = async () => {
      try {
        // Vérifiez si cette URL est correcte selon votre configuration backend
        const response = await fetch('http://localhost:3000/api/weddings')
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json()
        setWeddings(data)
        setLoading(false)
      } catch (err) {
        console.error('Erreur de fetch:', err)
        setError(`Erreur lors du chargement des mariages: ${err instanceof Error ? err.message : String(err)}`)
        setLoading(false)
      }
    }

    fetchWeddings()
  }, [])

  // Fetch guests and vendors when a wedding is selected
  useEffect(() => {
    if (showModal && selectedWedding) {
      setLoadingDetails(true);
      setDetailsError(null);
      Promise.all([
        fetch(`http://localhost:3000/api/guests?wedding=${selectedWedding._id}`)
          .then(res => res.ok ? res.json() : Promise.reject('Erreur invités')),
        fetch(`http://localhost:3000/api/vendors?wedding=${selectedWedding._id}`)
          .then(res => res.ok ? res.json() : Promise.reject('Erreur prestataires'))
      ])
        .then(([guestsData, vendorsData]) => {
          setGuests(guestsData);
          setVendors(vendorsData);
        })
        .catch(() => {
          setDetailsError('Erreur lors du chargement des invités ou des prestataires');
        })
        .finally(() => setLoadingDetails(false));
    } else {
      setGuests([]);
      setVendors([]);
      setLoadingDetails(false);
      setDetailsError(null);
    }
  }, [showModal, selectedWedding]);

  if (loading) return <div className="loading">Chargement...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <>
      <Navigation />
      <div className="container" style={{ marginTop: '5rem' }}>
        <header className="text-center mt-2 mb-2">
          <h1>Gestionnaire de Mariages</h1>
        </header>
        <main>
          <section className="wedding-list-container">
            <h2 className="wedding-list-title">Liste des Mariages</h2>
            {weddings.length === 0 ? (
              <p className="no-data">Aucun mariage trouvé.</p>
            ) : (
              <div className="weddings-grid">
                {weddings.map((wedding) => (
                  <div key={wedding._id} className="card wedding-list-item">
                    <h3>{wedding.name}</h3>
                    <div className="wedding-details">
                      <p><strong>Date:</strong> {new Date(wedding.date).toLocaleDateString('fr-FR')}</p>
                      <p><strong>Lieu:</strong> {wedding.place}</p>
                      <p><strong>Nombre de prestataires:</strong> {wedding.vendors.length}</p>
                    </div>
                    <div className="card-actions">
                      <button className="btn btn-primary" onClick={() => { setSelectedWedding(wedding); setShowModal(true); }}>Voir détails</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
        <footer className="text-center mt-2 mb-2">
          <p>&copy; 2025 - Application de Gestion de Mariage</p>
        </footer>
        {showModal && selectedWedding && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button className="btn btn-danger btn-icon" style={{ position: 'absolute', top: 16, right: 16 }} onClick={() => setShowModal(false)} title="Fermer">✕</button>
              <h2>Détails du Mariage</h2>
              <p><strong>Nom:</strong> {selectedWedding.name}</p>
              <p><strong>Date:</strong> {new Date(selectedWedding.date).toLocaleDateString('fr-FR')}</p>
              <p><strong>Lieu:</strong> {selectedWedding.place}</p>
              <p><strong>Nombre de prestataires:</strong> {selectedWedding.vendors.length}</p>
              <hr style={{ margin: '1.5rem 0' }} />
              {loadingDetails ? (
                <div>Chargement des invités et prestataires...</div>
              ) : detailsError ? (
                <div className="error">{detailsError}</div>
              ) : (
                <>
                  <h3>Invités</h3>
                  {guests.length === 0 ? <p>Aucun invité.</p> : (
                    <ul>
                      {guests.map(g => (
                        <li key={g._id}>{g.name} {g.RSVP && <span style={{ color: '#10b981' }}>(RSVP)</span>} {g.plusOne && <span style={{ color: '#6366f1' }}>(+1)</span>} <span style={{ color: g.status === 'confirmed' ? '#10b981' : g.status === 'cancelled' ? '#ef4444' : '#f59e0b' }}>({g.status})</span></li>
                      ))}
                    </ul>
                  )}
                  <h3>Prestataires</h3>
                  {vendors.length === 0 ? <p>Aucun prestataire.</p> : (
                    <ul>
                      {vendors.map(v => (
                        <li key={v._id}><strong>{v.name}</strong> ({v.type}) - {v.contact}</li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default AllWeddings