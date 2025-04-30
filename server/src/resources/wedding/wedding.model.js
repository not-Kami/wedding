import { name } from 'ejs';
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
  vendors: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Vendor',
    required: true
  }    
})

export default mongoose.model('Wedding', weddingSchema);