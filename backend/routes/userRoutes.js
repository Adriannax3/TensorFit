const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', userController.createUser);
router.post('/login', userController.loginUser);
router.get('/me', protect, userController.getMe);
router.put('/change-password', protect, userController.changePassword);
router.put('/:id', protect, userController.updateUser);

module.exports = router;