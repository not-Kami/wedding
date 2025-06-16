import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }, 
    type: {
        type: String,
        enum: ['photographer', 'caterer', 'decorator', 'musician', 'transportation'],
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    wedding: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wedding'
    }
});

export default mongoose.model('Vendor', vendorSchema);