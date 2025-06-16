import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
    wedding: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wedding',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    dueDate: {
        type: Date
    },
    category: {
        type: String,
        enum: ['planning', 'venue', 'catering', 'decoration', 'photography', 'music', 'transportation', 'other'],
        default: 'planning'
    }
}, { timestamps: true });

export default mongoose.model('Todo', todoSchema);