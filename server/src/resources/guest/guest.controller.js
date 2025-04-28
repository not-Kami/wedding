import { Guest } from './guest.model.js';

export const createGuest = async (req, res, next) => {
  try {
    const guest = new Guest(req.body);
    await guest.save();
    res.status(201).json(guest);
  } catch (err) {
    next(err);
  }
};

export const getGuests = async (req, res, next) => {
  try {
    const guests = await Guest.find({ wedding: req.query.weddingId });
    res.json(guests);
  } catch (err) {
    next(err);
  }
};

export const getGuestById = async (req, res, next) => {
  try {
    const guest = await Guest.findById(req.params.id);
    if (!guest) return res.status(404).send('Guest not found');
    res.json(guest);
  } catch (err) {
    next(err);
  }
};

export const updateGuest = async (req, res, next) => {
  try {
    const guest = await Guest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!guest) return res.status(404).send('Guest not found');
    res.json(guest);
  } catch (err) {
    next(err);
  }
};

export const deleteGuest = async (req, res, next) => {
  try {
    await Guest.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};