import Todo from './todo.model.js';

export const createTodo = async (req, res) => {
    try {
        const { wedding, title, description, priority, dueDate, category } = req.body;
        const todo = new Todo({
            wedding,
            title,
            description,
            priority,
            dueDate,
            category
        });
        await todo.save();
        res.status(201).json(todo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getTodos = async (req, res) => {
    try {
        const { wedding } = req.query;
        const filter = wedding ? { wedding } : {};
        const todos = await Todo.find(filter).sort({ createdAt: -1 });
        res.status(200).json(todos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getTodoById = async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await Todo.findById(id);
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.status(200).json(todo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, completed, priority, dueDate, category } = req.body;
        const todo = await Todo.findByIdAndUpdate(
            id,
            { title, description, completed, priority, dueDate, category },
            { new: true }
        );
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.status(200).json(todo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await Todo.findByIdAndDelete(id);
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const toggleTodoComplete = async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await Todo.findById(id);
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        
        todo.completed = !todo.completed;
        await todo.save();
        res.status(200).json(todo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};