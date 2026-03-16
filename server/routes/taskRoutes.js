const express = require('express');
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(protect);

router.post('/', createTask);
router.get('/:projectId', getTasks);
router.route('/:id').put(upload.single('file'), updateTask).delete(deleteTask);

module.exports = router;
