// server/src/resources/auth/auth.controller.js
import jwt from 'jsonwebtoken';
import User from './user.model.js';

const JWT_SECRET = process.env.JWT_SECRET ;

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (await User.findOne({ email })) {
    return res.status(400).json({ message: 'Email déjà utilisé.' });
  }
  const user = new User({ name, email, password });
  await user.save();
  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
  res.status(201).json({ user: { id: user._id, name, email }, token });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Identifiants invalides.' });
  }
  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
  res.json({ user: { id: user._id, name: user.name, email }, token });
};
