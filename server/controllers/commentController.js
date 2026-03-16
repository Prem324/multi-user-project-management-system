const Comment = require('../models/Comment');
const Task = require('../models/Task');
const { logActivity } = require('./activityLogController');

// @desc    Get comments for a task
// @route   GET /api/comments/:taskId
// @access  Private
exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ taskId: req.params.taskId })
      .populate('userId', 'name email')
      .sort({ createdAt: 1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add comment to task
// @route   POST /api/comments
// @access  Private
exports.addComment = async (req, res) => {
  try {
    const { taskId, message } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const comment = await Comment.create({
      taskId,
      userId: req.user.id,
      message,
    });

    const commentWithUser = await Comment.findById(comment._id).populate(
      'userId',
      'name email'
    );

    const io = req.app.get('io');
    io.to(task.projectId.toString()).emit('newComment', {
      taskId,
      comment: commentWithUser,
    });

    await logActivity(
      task.projectId,
      `commented on task "${task.title}"`,
      req.user.id,
      io
    );

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
