import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';
import KanbanBoard from '../components/KanbanBoard';
import TaskModal from '../components/TaskModal';
import TaskFormModal from '../components/TaskFormModal';
import ActivityPanel from '../components/ActivityPanel';
import InviteModal from '../components/InviteModal';
import { Users, Info, Settings, Search, Plus, UserPlus } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ProjectDetails = () => {
  const { id } = useParams();
  const { currentProject, fetchProjectDetails, loading, tasks } = useProjects();
  const [selectedTask, setSelectedTask] = useState(null);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchProjectDetails(id);
  }, [id]);

  if (loading && !currentProject) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!currentProject) return <div>Project not found</div>;

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{currentProject.title}</h1>
            <button className="text-slate-400 hover:text-slate-600 p-1">
              <Info size={20} />
            </button>
          </div>
          <p className="text-slate-500 max-w-2xl">{currentProject.description}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex -space-x-3 mr-4">
            {currentProject.members?.map((member, i) => (
              <div
                key={member._id}
                title={member.name}
                className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 border-2 border-white flex items-center justify-center font-bold text-sm shadow-sm"
              >
                {member.name.charAt(0)}
              </div>
            ))}
            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 border-2 border-white flex items-center justify-center hover:bg-slate-200 transition-colors"
            >
              <UserPlus size={18} />
            </button>
          </div>
          <button className="bg-white border border-slate-200 p-2.5 rounded-xl text-slate-600 hover:bg-slate-50 shadow-sm transition-colors">
            <Settings size={20} />
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setIsTaskFormOpen(true)}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <Plus size={18} />
            <span>New Task</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 min-h-0 overflow-hidden">
        <div className="flex-1 min-w-0">
          <KanbanBoard onTaskClick={(task) => setSelectedTask(task)} tasks={filteredTasks} />
        </div>
        
        <div className="hidden xl:block w-80 shrink-0">
          <ActivityPanel projectId={id} />
        </div>
      </div>

      {/* Task Details Modal */}
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
      {/* Task Form Modal */}
      {isTaskFormOpen && (
        <TaskFormModal
          projectId={id}
          onClose={() => setIsTaskFormOpen(false)}
        />
      )}
      {/* Invite Modal */}
      {isInviteModalOpen && (
        <InviteModal
          projectId={id}
          onClose={() => setIsInviteModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ProjectDetails;
