import mongoose from 'mongoose';

const guestSchema = new mongoose.Schema({
    wedding: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wedding',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    RSVP: {
        type: Boolean,
        default: false
    },
    plusOne: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    }
}, { timestamps: true });

export default mongoose.model('Guest', guestSchema);