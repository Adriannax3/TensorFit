const express = require('express');
const router = express.Router();
const entryController = require('../controllers/entryController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../multer');

router.post('/', protect, upload.single('image'), entryController.createEntry);
router.post('/:id/like', protect, entryController.toggleLike);
router.post('/:id/comments', protect, entryController.createComment);
router.get('/my', protect, entryController.getMyEntries);
router.get('/all', protect, entryController.getAllEntries);
router.get('/:id', protect, entryController.getEntryById);
router.put('/:id', protect, upload.single('image'), entryController.updateEntry);
router.delete('/:id', protect, entryController.deleteEntry);

module.exports = router;