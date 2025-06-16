import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Todo {
  _id: string;
  wedding: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  category: 'planning' | 'venue' | 'catering' | 'decoration' | 'photography' | 'music' | 'transportation' | 'other';
  createdAt: string;
}

interface TodoListProps {
  weddingId: string;
}

const TodoList: React.FC<TodoListProps> = ({ weddingId }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as Todo['priority'],
    dueDate: '',
    category: 'planning' as Todo['category']
  });

  const categories = {
    planning: 'Planification',
    venue: 'Lieu',
    catering: 'Traiteur',
    decoration: 'Décoration',
    photography: 'Photographie',
    music: 'Musique',
    transportation: 'Transport',
    other: 'Autre'
  };

  const priorities = {
    low: 'Faible',
    medium: 'Moyenne',
    high: 'Élevée'
  };

  useEffect(() => {
    fetchTodos();
  }, [weddingId]);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/api/todos?wedding=${weddingId}`);
      setTodos(response.data);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des tâches';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Le titre est obligatoire');
      return;
    }

    try {
      let response: { data: Todo };
      if (editingTodo) {
        response = await axios.put<Todo>(`http://localhost:3000/api/todos/${editingTodo._id}`, formData);
        setTodos(todos.map(todo => 
          todo._id === editingTodo._id ? response.data : todo
        ));
        toast.success('Tâche mise à jour avec succès');
      } else {
        response = await axios.post<Todo>('http://localhost:3000/api/todos', {
          ...formData,
          wedding: weddingId
        });
        setTodos([response.data, ...todos]);
        toast.success('Tâche ajoutée avec succès');
      }
      
      resetForm();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la sauvegarde';
      toast.error(errorMessage);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      category: 'planning'
    });
    setShowForm(false);
    setEditingTodo(null);
  };

  const editTodo = (todo: Todo) => {
    setFormData({
      title: todo.title,
      description: todo.description || '',
      priority: todo.priority,
      dueDate: todo.dueDate ? todo.dueDate.split('T')[0] : '',
      category: todo.category
    });
    setEditingTodo(todo);
    setShowForm(true);
  };

  const toggleComplete = async (todoId: string) => {
    try {
      const response = await axios.patch(`http://localhost:3000/api/todos/${todoId}/toggle`);
      setTodos(todos.map(todo => 
        todo._id === todoId ? response.data : todo
      ));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la mise à jour';
      toast.error(errorMessage);
    }
  };

  const deleteTodo = async (todoId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/api/todos/${todoId}`);
      setTodos(todos.filter(todo => todo._id !== todoId));
      toast.success('Tâche supprimée');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression';
      toast.error(errorMessage);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'planning': return '📋';
      case 'venue': return '🏛️';
      case 'catering': return '🍽️';
      case 'decoration': return '🎨';
      case 'photography': return '📸';
      case 'music': return '🎵';
      case 'transportation': return '🚗';
      default: return '📝';
    }
  };

  const completedTodos = todos.filter(todo => todo.completed);
  const pendingTodos = todos.filter(todo => !todo.completed);

  if (loading) {
    return <div className="loading">Chargement des tâches...</div>;
  }

  return (
    <div className="todo-list-container">
      <div className="todo-list-header">
        <h2>Liste des Tâches ({todos.length})</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Annuler' : 'Ajouter une tâche'}
        </button>
      </div>

      {/* Progress Summary */}
      <div className="todo-summary">
        <div className="summary-card">
          <h3>Total</h3>
          <span className="count">{todos.length}</span>
        </div>
        <div className="summary-card">
          <h3>En cours</h3>
          <span className="count pending">{pendingTodos.length}</span>
        </div>
        <div className="summary-card">
          <h3>Terminées</h3>
          <span className="count completed">{completedTodos.length}</span>
        </div>
        <div className="summary-card">
          <h3>Progression</h3>
          <span className="percentage">
            {todos.length > 0 ? Math.round((completedTodos.length / todos.length) * 100) : 0}%
          </span>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="todo-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="todoTitle">Titre de la tâche *</label>
              <input
                type="text"
                id="todoTitle"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Titre de la tâche"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="todoCategory">Catégorie</label>
              <select
                id="todoCategory"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as Todo['category'] })}
              >
                {Object.entries(categories).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="todoPriority">Priorité</label>
              <select
                id="todoPriority"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as Todo['priority'] })}
              >
                {Object.entries(priorities).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="todoDueDate">Date d'échéance</label>
              <input
                type="date"
                id="todoDueDate"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="todoDescription">Description</label>
            <textarea
              id="todoDescription"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Description optionnelle de la tâche"
              rows={3}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingTodo ? 'Mettre à jour' : 'Ajouter'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              Annuler
            </button>
          </div>
        </form>
      )}

      <div className="todos-sections">
        {/* Pending Todos */}
        <div className="todos-section">
          <h3>Tâches en cours ({pendingTodos.length})</h3>
          <div className="todos-grid">
            {pendingTodos.length === 0 ? (
              <p className="no-data">Aucune tâche en cours.</p>
            ) : (
              pendingTodos.map((todo) => (
                <div key={todo._id} className="todo-card">
                  <div className="todo-header">
                    <div className="todo-category">
                      <span className="category-icon">{getCategoryIcon(todo.category)}</span>
                      <span className="category-label">{categories[todo.category]}</span>
                    </div>
                    <div 
                      className="priority-badge"
                      style={{ backgroundColor: getPriorityColor(todo.priority) }}
                    >
                      {priorities[todo.priority]}
                    </div>
                  </div>
                  
                  <div className="todo-content">
                    <h4>{todo.title}</h4>
                    {todo.description && <p className="todo-description">{todo.description}</p>}
                    {todo.dueDate && (
                      <p className="todo-due-date">
                        📅 Échéance: {new Date(todo.dueDate).toLocaleDateString('fr-FR')}
                      </p>
                    )}
                  </div>
                  
                  <div className="todo-actions">
                    <button
                      onClick={() => toggleComplete(todo._id)}
                      className="btn btn-secondary"
                      title="Marquer comme terminé"
                    >
                      ✓
                    </button>
                    <button
                      onClick={() => editTodo(todo)}
                      className="btn btn-edit"
                      title="Modifier la tâche"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => deleteTodo(todo._id)}
                      className="btn btn-delete"
                      title="Supprimer la tâche"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Completed Todos */}
        {completedTodos.length > 0 && (
          <div className="todos-section">
            <h3>Tâches terminées ({completedTodos.length})</h3>
            <div className="todos-grid">
              {completedTodos.map((todo) => (
                <div key={todo._id} className="todo-card completed">
                  <div className="todo-header">
                    <div className="todo-category">
                      <span className="category-icon">{getCategoryIcon(todo.category)}</span>
                      <span className="category-label">{categories[todo.category]}</span>
                    </div>
                    <div className="completed-badge">✓ Terminé</div>
                  </div>
                  
                  <div className="todo-content">
                    <h4>{todo.title}</h4>
                    {todo.description && <p className="todo-description">{todo.description}</p>}
                  </div>
                  
                  <div className="todo-actions">
                    <button
                      onClick={() => toggleComplete(todo._id)}
                      className="btn btn-secondary"
                      title="Marquer comme non terminé"
                    >
                      ↶
                    </button>
                    <button
                      onClick={() => deleteTodo(todo._id)}
                      className="btn btn-delete"
                      title="Supprimer la tâche"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoList;