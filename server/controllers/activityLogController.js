const ActivityLog = require('../models/ActivityLog');

// @desc    Get activity logs for a project
// @route   GET /api/activity/:projectId
// @access  Private
exports.getActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find({ projectId: req.params.projectId })
      .populate('performedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Internal utility to log activity
exports.logActivity = async (projectId, action, performedBy) => {
  try {
    await ActivityLog.create({
      projectId,
      action,
      performedBy,
    });
  } catch (error) {
    console.error('Activity Log Error:', error);
  }
};
