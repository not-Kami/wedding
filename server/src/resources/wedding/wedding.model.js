import mongoose from 'mongoose';

const weddingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  place: {
    type: String,
    required: true
  },
  vendors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor'
  }]
}, { timestamps: true });

const Wedding = mongoose.model('Wedding', weddingSchema);

export default Wedding;