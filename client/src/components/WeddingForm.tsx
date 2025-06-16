import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';

interface WeddingFormData {
  name: string;
  date: string;
  place: string;
}

interface WeddingFormProps {
  onWeddingCreated?: (wedding: WeddingFormData) => void;
  initialData?: WeddingFormData;
  isEditing?: boolean;
  weddingId?: string;
}

const WeddingForm: React.FC<WeddingFormProps> = ({ 
  onWeddingCreated, 
  initialData, 
  isEditing = false, 
  weddingId 
}) => {
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<WeddingFormData>({
    defaultValues: initialData || {
      name: '',
      date: '',
      place: ''
    }
  });

  const onSubmit = async (data: WeddingFormData) => {
    try {
      setLoading(true);
      
      // Validation de la date
      const selectedDate = new Date(data.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        toast.error('La date du mariage ne peut pas être dans le passé');
        return;
      }

      let response;
      if (isEditing && weddingId) {
        response = await axios.put(`http://localhost:3000/api/weddings/${weddingId}`, data);
        toast.success('Mariage mis à jour avec succès');
      } else {
        response = await axios.post('http://localhost:3000/api/weddings', data);
        toast.success('Mariage créé avec succès');
        reset(); // Reset form after successful creation
      }

      if (onWeddingCreated) {
        onWeddingCreated(response.data);
      }
    } catch (error: any) {
      console.error('Error saving wedding:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Erreur lors de la sauvegarde du mariage');
      }
    } finally {
      setLoading(false);
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="wedding-form-container">
      <h2>{isEditing ? 'Modifier le mariage' : 'Créer un nouveau mariage'}</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="wedding-form">
        <div className="form-group">
          <label htmlFor="name">
            Nom du mariage *
            <span className="field-hint">Ex: Mariage de Marie et Pierre</span>
          </label>
          <input
            type="text"
            id="name"
            {...register('name', {
              required: 'Le nom du mariage est obligatoire',
              minLength: {
                value: 3,
                message: 'Le nom doit contenir au moins 3 caractères'
              },
              maxLength: {
                value: 100,
                message: 'Le nom ne peut pas dépasser 100 caractères'
              }
            })}
            className={errors.name ? 'error' : ''}
            placeholder="Entrez le nom du mariage"
          />
          {errors.name && (
            <span className="error-message">{errors.name.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="date">
            Date du mariage *
            <span className="field-hint">La date doit être dans le futur</span>
          </label>
          <input
            type="date"
            id="date"
            {...register('date', {
              required: 'La date du mariage est obligatoire'
            })}
            className={errors.date ? 'error' : ''}
            min={getTomorrowDate()}
          />
          {errors.date && (
            <span className="error-message">{errors.date.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="place">
            Lieu du mariage *
            <span className="field-hint">Ex: Château de Versailles, Paris</span>
          </label>
          <input
            type="text"
            id="place"
            {...register('place', {
              required: 'Le lieu du mariage est obligatoire',
              minLength: {
                value: 3,
                message: 'Le lieu doit contenir au moins 3 caractères'
              },
              maxLength: {
                value: 200,
                message: 'Le lieu ne peut pas dépasser 200 caractères'
              }
            })}
            className={errors.place ? 'error' : ''}
            placeholder="Entrez le lieu du mariage"
          />
          {errors.place && (
            <span className="error-message">{errors.place.message}</span>
          )}
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                {isEditing ? 'Mise à jour...' : 'Création...'}
              </>
            ) : (
              isEditing ? 'Mettre à jour' : 'Créer le mariage'
            )}
          </button>
          
          {!isEditing && (
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => reset()}
              disabled={loading}
            >
              Réinitialiser
            </button>
          )}
        </div>
      </form>

      <div className="form-tips">
        <h3>💡 Conseils</h3>
        <ul>
          <li>Choisissez un nom descriptif pour votre mariage</li>
          <li>Vérifiez bien la date avant de valider</li>
          <li>Soyez précis sur le lieu (ville, adresse si possible)</li>
          <li>Vous pourrez modifier ces informations plus tard</li>
        </ul>
      </div>
    </div>
  );
};

export default WeddingForm;