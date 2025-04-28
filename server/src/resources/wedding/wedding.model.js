import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const WeddingSchema = new Schema({
  couple: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  venue: { type: String },
  address: { type: String }
}, { timestamps: true });

export const Wedding = model('Wedding', WeddingSchema);


