import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const GuestSchema = new Schema({
  wedding: { type: Schema.Types.ObjectId, ref: 'Wedding', required: true },
  name: { type: String, required: true },
  email: String,
  rsvp: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' }
}, { timestamps: true });

export const Guest = model('Guest', GuestSchema);