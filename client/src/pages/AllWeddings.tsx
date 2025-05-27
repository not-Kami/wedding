import { useState, useEffect } from 'react'

interface Wedding {
  _id: string;
  name: string;
  date: string;
  place: string;
  vendors: string[];
}

function AllWeddings() {
  const [weddings, setWeddings] = useState<Wedding[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
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

  if (loading) return <div className="loading">Chargement...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <div className="container">
      <header>
        <h1>Gestionnaire de Mariages</h1>
      </header>
      
      <main>
        <section className="weddings-list">
          <h2>Liste des Mariages</h2>
          {weddings.length === 0 ? (
            <p className="no-data">Aucun mariage trouvé.</p>
          ) : (
            <div className="weddings-grid">
              {weddings.map((wedding) => (
                <div key={wedding._id} className="wedding-card">
                  <h3>{wedding.name}</h3>
                  <div className="wedding-details">
                    <p><strong>Date:</strong> {new Date(wedding.date).toLocaleDateString('fr-FR')}</p>
                    <p><strong>Lieu:</strong> {wedding.place}</p>
                    <p><strong>Nombre de prestataires:</strong> {wedding.vendors.length}</p>
                  </div>
                  <div className="card-actions">
                    <button className="btn-details">Voir détails</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      
      <footer>
        <p>&copy; 2025 - Application de Gestion de Mariage</p>
      </footer>
    </div>
  )
}

export default AllWeddings
