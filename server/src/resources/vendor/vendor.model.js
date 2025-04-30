import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema({
    name: {
        type: String,
        
    }, 
    type: {
        type: String,
        enum: ['photographer', 'caterer', 'decorator', 'musician', 'transportation'],
        required: true
    },
    contact: {
        type: String,
        required: true
    }
});

export default mongoose.model('Vendor', vendorSchema);