import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectContext';
import api from '../services/api';
import { format } from 'date-fns';
import { MessageSquare, Paperclip, Send, X, Clock, User as UserIcon, AlertCircle, Trash2, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';

const TaskModal = ({ task, onClose }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();
  const { socket, fetchProjectDetails } = useProjects();

  useEffect(() => {
    fetchComments();
    
    if (socket) {
      socket.on('newComment', (data) => {
        if (data.taskId === task._id) {
          setComments((prev) => [...prev, data.comment]);
        }
      });
    }

    return () => {
      if (socket) socket.off('newComment');
    };
  }, [task._id, socket]);

  const fetchComments = async () => {
    try {
      const { data } = await api.get(`/comments/${task._id}`);
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const { data } = await api.post('/comments', { 
        taskId: task._id, 
        message: newComment 
      });
      
      const commentWithUser = {
        ...data,
        userId: { _id: user._id, name: user.name, email: user.email }
      };

      if (socket) {
        socket.emit('sendMessage', {
          projectId: task.projectId,
          taskId: task._id,
          comment: commentWithUser,
        });
      }

      setComments([...comments, commentWithUser]);
      setNewComment('');
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      await api.put(`/tasks/${task._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('File uploaded successfully!');
      fetchProjectDetails(task.projectId);
      onClose();
    } catch (error) {
      toast.error('File upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await api.delete(`/tasks/${task._id}`);
      toast.success('Task deleted');
      fetchProjectDetails(task.projectId);
      onClose();
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end md:items-center justify-end md:justify-center bg-slate-900/60 backdrop-blur-md p-0 md:p-4">
      <div className="bg-white w-full h-full md:h-auto md:max-w-3xl md:max-h-[85vh] md:rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              task.status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-primary-100 text-primary-600'
            }`}>
              <Clock size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{task.title}</h2>
              <p className="text-xs text-slate-500">Task Details</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDeleteTask}
              className="p-2 hover:bg-red-50 rounded-full text-slate-400 hover:text-red-600 transition-colors"
              title="Delete Task"
            >
              <Trash2 size={20} />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Details */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Description</h3>
                <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {task.description || 'No description provided.'}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <MessageSquare size={16} />
                  Comments ({comments.length})
                </h3>
                
                <div className="space-y-4 mb-6 text-sm">
                  {comments.map((comment) => (
                    <div key={comment._id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">
                        {comment.userId?.name?.charAt(0) || 'U'}
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl rounded-tl-none flex-1 border border-slate-100">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-slate-900">{comment.userId?.name || 'Unknown User'}</span>
                          <span className="text-[10px] text-slate-400">
                            {comment.createdAt ? format(new Date(comment.createdAt), 'MMM d, h:mm a') : ''}
                          </span>
                        </div>
                        <p className="text-slate-700">{comment.message}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddComment} className="relative">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    className="w-full pl-4 pr-12 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column: Meta & Actions */}
            <div className="space-y-6">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 mb-4">Properties</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Status</span>
                    <span className="text-xs font-bold px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-700">
                      {task.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Priority</span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-lg ${
                      task.priority === 'High' ? 'bg-red-50 text-red-600' : 'bg-primary-50 text-primary-600'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Assigned To</span>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center">
                        <UserIcon size={12} className="text-slate-500" />
                      </div>
                      <span className="text-xs font-bold">{task.assignedTo?.name || 'Unassigned'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Paperclip size={16} />
                  Attachments
                </h3>
                <div className="grid grid-cols-1 gap-2 mb-3">
                  {task.attachments?.map((file, i) => (
                    <a
                      key={file.url || i}
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:border-primary-500 transition-colors group"
                    >
                      <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                        <Paperclip size={16} />
                      </div>
                      <span className="text-xs font-medium text-slate-600 truncate">{file.name}</span>
                    </a>
                  ))}
                </div>
                <label className="flex items-center justify-center gap-2 w-full py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors text-sm font-semibold">
                  {isUploading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                  ) : (
                    <>
                      <Plus size={16} />
                      <span>Upload File</span>
                    </>
                  )}
                  <input type="file" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
