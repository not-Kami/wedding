import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const BookingSchema = new Schema({
  wedding: { type: Schema.Types.ObjectId, ref: 'Wedding', required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' }
}, { timestamps: true });

export const Booking = model('Booking', BookingSchema);