
import { Wedding } from './wedding.model.js';

export const createWedding = async (req, res, next) => {
  try {
    const wedding = new Wedding(req.body);
    await wedding.save();
    res.status(201).json(wedding);
  } catch (err) {
    next(err);
  }
};

export const getWeddings = async (req, res, next) => {
  try {
    const weddings = await Wedding.find().populate('couple', 'name email');
    res.json(weddings);
  } catch (err) {
    next(err);
  }
};

export const getWeddingById = async (req, res, next) => {
  try {
    const wedding = await Wedding.findById(req.params.id).populate('couple', 'name email');
    if (!wedding) return res.status(404).send('Wedding not found');
    res.json(wedding);
  } catch (err) {
    next(err);
  }
};

export const updateWedding = async (req, res, next) => {
  try {
    const wedding = await Wedding.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!wedding) return res.status(404).send('Wedding not found');
    res.json(wedding);
  } catch (err) {
    next(err);
  }
};

export const deleteWedding = async (req, res, next) => {
  try {
    await Wedding.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};