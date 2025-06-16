import { useState, useEffect } from 'react'
import Navigation from '../components/Navigation'
import axios from 'axios'

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

interface Budget {
  total: number;
  spent: number;
  remaining: number;
}

function AllWeddings() {
  const [weddings, setWeddings] = useState<Wedding[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedWedding, setSelectedWedding] = useState<Wedding | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  
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

  useEffect(() => {
    if (showModal && selectedWedding) {
      setDetailsLoading(true);
      const token = localStorage.getItem('accessToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      Promise.all([
        axios.get(`http://localhost:3000/api/guests?wedding=${selectedWedding._id}`, { headers }),
        axios.get(`http://localhost:3000/api/vendors?wedding=${selectedWedding._id}`, { headers }),
        axios.get(`http://localhost:3000/api/budget?wedding=${selectedWedding._id}`, { headers })
      ])
        .then(([guestsRes, vendorsRes, budgetRes]) => {
          setGuests(guestsRes.data);
          setVendors(vendorsRes.data);
          setBudget(budgetRes.data);
        })
        .catch(() => {
          setGuests([]);
          setVendors([]);
          setBudget(null);
        })
        .finally(() => setDetailsLoading(false));
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
              {detailsLoading ? (
                <div className="loading">Chargement des détails...</div>
              ) : (
                <>
                  <div style={{ marginTop: '2rem' }}>
                    <h3>Invités ({guests.length})</h3>
                    {guests.length === 0 ? <p>Aucun invité.</p> : (
                      <ul>
                        {guests.map(g => <li key={g._id}>{g.name} ({g.status})</li>)}
                      </ul>
                    )}
                  </div>
                  <div style={{ marginTop: '2rem' }}>
                    <h3>Prestataires ({vendors.length})</h3>
                    {vendors.length === 0 ? <p>Aucun prestataire.</p> : (
                      <ul>
                        {vendors.map(v => <li key={v._id}>{v.name} ({v.type})</li>)}
                      </ul>
                    )}
                  </div>
                  <div style={{ marginTop: '2rem' }}>
                    <h3>Budget</h3>
                    {budget ? (
                      <ul>
                        <li><strong>Total:</strong> {budget.total} €</li>
                        <li><strong>Dépenses:</strong> {budget.spent} €</li>
                        <li><strong>Restant:</strong> {budget.remaining} €</li>
                      </ul>
                    ) : <p>Aucun budget renseigné.</p>}
                  </div>
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
