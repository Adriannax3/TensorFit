const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.get('/users', protectAdmin, adminController.getAllUsers);
router.get('/comments', protectAdmin, adminController.getAllComments);
router.post('/block/:id', protectAdmin, adminController.toggleBlockUser);
router.delete('/entry/:id', protectAdmin, adminController.deleteEntry);
router.delete('/comment/:id', protectAdmin, adminController.deleteComment);

module.exports = router;