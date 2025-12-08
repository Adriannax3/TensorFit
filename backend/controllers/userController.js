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
        const token = jwt.sign({ id: user.id, email: user.email, username: user.username, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
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
        if (!user) return res.status(401).json({ error: 'Nie znaleziono użytkownika' });

        const isMatch = comparePassword(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Nieprawidłowe hasło' });
        if (user.isBlocked) return res.status(403).json({ error: 'Konto zablokowane' });
        const token = jwt.sign({ id: user.id, email: user.email, username: user.username, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

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

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: 'Brak pól' });
    }

    if (oldPassword === newPassword) {
      return res.status(400).json({ error: 'Nowe hasło musi być inne niż stare' });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Nie znaleziono użytkownika' });
    }

    const isMatch = comparePassword(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Stare hasło jest nieprawidłwe' });
    }

    const hashedPassword = hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();

    const { password: _, ...userData } = user.toJSON();
    res.json({ message: 'Hasło zostało zmienione', user: userData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { username, avatarColor } = req.body;

    if (!username && !avatarColor) {
      return res.status(400).json({ error: 'Brak pól do aktualizacji' });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Nie znaleziono użytkownika' });
    }

    if (username && username !== user.username) {
      const existing = await User.findOne({ where: { username } });
      if (existing) {
        return res.status(409).json({ error: 'Nazwa użytkownika jest już zajęta' });
      }
      user.username = username;
    }

    if (avatarColor) {
      user.avatarColor = avatarColor;
    }

    await user.save();

    const { password: _, ...userData } = user.toJSON();
    res.json({ message: 'Profil zaktualizowany', user: userData });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

