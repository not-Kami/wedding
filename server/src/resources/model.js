
// Simplified Mongoose models for Wedding Planner project
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// User: planners, couples and admins
const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin', 'planner', 'couple'], default: 'couple' }
}, { timestamps: true });

// Wedding details
const WeddingSchema = new Schema({
  couple: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  venue: String,
  address: String
}, { timestamps: true });

// Guests and RSVPs
const GuestSchema = new Schema({
  wedding: { type: Schema.Types.ObjectId, ref: 'Wedding', required: true },
  name: String,
  email: String,
  rsvp: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' }
}, { timestamps: true });

// Vendors / Service Providers


// Bookings: linking weddings with vendors
const BookingSchema = new Schema({
  wedding: { type: Schema.Types.ObjectId, ref: 'Wedding', required: true },
 
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' }
}, { timestamps: true });

// Export models
export const User = model('User', UserSchema);
export const Wedding = model('Wedding', WeddingSchema);
export const Guest = model('Guest', GuestSchema);
export const Booking = model('Booking', BookingSchema);
