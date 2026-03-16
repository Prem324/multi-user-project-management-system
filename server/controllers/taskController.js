const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Get all tasks for a project
// @route   GET /api/tasks/:projectId
// @access  Private
exports.getTasks = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is owner or member
    const isMember = project.members.includes(req.user.id);
    if (project.owner.toString() !== req.user.id && !isMember) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const tasks = await Task.find({ projectId: req.params.projectId }).populate(
      'assignedTo',
      'name email'
    );

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res) => {
  try {
    const { title, description, projectId, assignedTo, priority, dueDate } =
      req.body;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is owner or member
    const isMember = project.members.includes(req.user.id);
    if (project.owner.toString() !== req.user.id && !isMember) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const task = await Task.create({
      title,
      description,
      projectId,
      assignedTo,
      priority,
      dueDate,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const cloudinary = require('../config/cloudinary');

// @desc    Update task (and handle attachments)
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = await Project.findById(task.projectId);

    // Check if user is owner or member
    const isMember = project.members.includes(req.user.id);
    if (project.owner.toString() !== req.user.id && !isMember) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    let updateData = { ...req.body };

    // Handle file upload
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'project_management',
        resource_type: 'auto',
      });

      const newAttachment = {
        url: result.secure_url,
        name: req.file.originalname,
      };

      updateData.$push = { attachments: newAttachment };
    }

    task = await Task.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = await Project.findById(task.projectId);

    // Check if user is owner or member
    const isMember = project.members.includes(req.user.id);
    if (project.owner.toString() !== req.user.id && !isMember) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await task.deleteOne();

    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
