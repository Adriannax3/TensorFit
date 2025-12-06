const { User } = require('../models');
const { hashPassword, comparePassword } = require('../utils/helpers');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
const JWT_EXPIRES_IN = '1d';

exports.createUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        if (!email || !username || !password) return res.status(400).json({ error: 'Brak pól' });

        const hashedPassword = hashPassword(password);

        const user = await User.create({ email, username, password: hashedPassword });
        const token = jwt.sign({ id: user.id, email: user.email, username: user.username }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        const { password: _, ...userData } = user.toJSON();
        res.json({ user: userData, token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.loginUser = async (req, res) => { 
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Brak pól' });

        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(401).json({ error: 'Nieprawidłowe dane' });

        const isMatch = comparePassword(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Nieprawidłowe dane' });
        const token = jwt.sign({ id: user.id, email: user.email, username: user.username }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        const { password: _, ...userData } = user.toJSON();
        res.json({ user: userData, token });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
    });
    if (!user) return res.status(404).json({ error: 'Nie znaleziono użytkownika' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};