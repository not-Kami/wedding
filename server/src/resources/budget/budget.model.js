import mongoose from 'mongoose';

const  budgetSchema = new mongoose.Schema({
    wedding: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wedding',
        required: true
    },
    spending: { 
        type: Number,
        required: true
    },
    totalBudget: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
}, { timestamps: true });

export const Budget = mongoose.model('Budget', budgetSchema);