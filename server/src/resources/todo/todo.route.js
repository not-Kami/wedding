import { Router } from 'express';
import { 
    createTodo, 
    getTodos, 
    getTodoById, 
    updateTodo, 
    deleteTodo, 
    toggleTodoComplete 
} from './todo.controller.js';

const todoRouter = Router();

// Routes for '/'
todoRouter
    .route('/')
    .get(getTodos)
    .post(createTodo);

// Routes for '/:id'
todoRouter
    .route('/:id')
    .get(getTodoById)
    .put(updateTodo)
    .delete(deleteTodo);

// Route for toggling completion status
todoRouter.patch('/:id/toggle', toggleTodoComplete);

export default todoRouter;