const express = require('express');
const router = express.Router();
const { register, login, searchUser, updateProfile, deleteUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/search', protect, searchUser);
router.route('/profile').put(protect, updateProfile).delete(protect, deleteUser);

module.exports = router;
