const express = require('express');
const router = express.Router();
const { getComments, addComment } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', addComment);
router.get('/:taskId', getComments);

module.exports = router;
