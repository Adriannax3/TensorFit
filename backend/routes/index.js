const express = require('express');
const userRoutes = require('./userRoutes');
// import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use('/users', userRoutes);

// router.get('/me', protect, (req, res) => {
//   res.json({ message: 'Masz dostęp', user: req.user });
// });

module.exports = router;
