const express = require('express');
const router = express.Router();
const { getActivityLogs } = require('../controllers/activityLogController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/:projectId', getActivityLogs);

module.exports = router;
