import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { MoreHorizontal, Plus, Clock, MessageSquare, Paperclip, User as UserIcon } from 'lucide-react';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const KanbanBoard = ({ onTaskClick }) => {
  const { tasks, setTasks, currentProject, socket } = useProjects(); // Added socket
  const { user } = useAuth(); // Added useAuth hook

  const columns = {
    Todo: tasks.filter((t) => t.status === 'Todo'),
    'In Progress': tasks.filter((t) => t.status === 'In Progress'),
    Completed: tasks.filter((t) => t.status === 'Completed'),
  };

  const onDragEnd = async (result) => { // Made onDragEnd async
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId !== destination.droppableId) {
      // Update local state first for instant feedback
      const updatedTasks = tasks.map((t) =>
        t._id === draggableId ? { ...t, status: destination.droppableId } : t
      );
      setTasks(updatedTasks);

      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` },
        };
        await axios.put(
          `/api/tasks/${draggableId}`,
          { status: destination.droppableId },
          config
        );

        if (socket) {
          socket.emit('taskMoved', {
            projectId: currentProject._id,
            taskId: draggableId,
            newStatus: destination.droppableId,
          });
        }
      } catch (error) {
        toast.error('Failed to update task status');
        // Revert local state if API fails
        setTasks(tasks);
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-6 overflow-x-auto pb-6 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
        {Object.entries(columns).map(([columnId, columnTasks]) => (
          <div key={columnId} className="flex-1 min-w-[320px] max-w-[400px]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900">{columnId}</h3>
                <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs font-bold">
                  {columnTasks.length}
                </span>
              </div>
              <button className="text-slate-400 hover:text-slate-600 p-1">
                <MoreHorizontal size={20} />
              </button>
            </div>

            <Droppable droppableId={columnId}>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`flex flex-col gap-3 min-h-[500px] p-2 rounded-xl transition-colors ${
                    snapshot.isDraggingOver ? 'bg-slate-100/50' : 'bg-transparent'
                  }`}
                >
                  {columnTasks.map((task, index) => (
                    <Draggable key={task._id} draggableId={task._id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onClick={() => onTaskClick(task)}
                          className={`bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all ${
                            snapshot.isDragging ? 'shadow-xl rotate-2 ring-2 ring-primary-500/20' : ''
                          }`}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <span
                              className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                                task.priority === 'High'
                                  ? 'bg-red-50 text-red-600'
                                  : task.priority === 'Medium'
                                  ? 'bg-orange-50 text-orange-600'
                                  : 'bg-green-50 text-green-600'
                              }`}
                            >
                              {task.priority}
                            </span>
                            <div className="flex -space-x-2">
                              {task.assignedTo && (
                                <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 border-2 border-white flex items-center justify-center text-[10px] font-bold">
                                  <UserIcon size={12} />
                                </div>
                              )}
                            </div>
                          </div>

                          <h4 className="font-bold text-slate-900 mb-2">{task.title}</h4>
                          <p className="text-slate-500 text-xs line-clamp-2 mb-4 leading-relaxed">
                            {task.description}
                          </p>

                          <div className="flex items-center justify-between text-slate-400">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1">
                                <MessageSquare size={14} />
                                <span className="text-[10px] font-medium">4</span>
                              </div>
                              {task.attachments?.length > 0 && (
                                <div className="flex items-center gap-1">
                                  <Paperclip size={14} />
                                  <span className="text-[10px] font-medium">
                                    {task.attachments.length}
                                  </span>
                                </div>
                              )}
                            </div>
                            {task.dueDate && (
                              <div className="flex items-center gap-1 text-[10px] font-semibold bg-slate-50 px-2 py-1 rounded-lg">
                                <Clock size={12} />
                                <span>{format(new Date(task.dueDate), 'MMM d')}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  <button className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 hover:border-primary-300 hover:text-primary-600 hover:bg-white transition-all text-sm font-medium mt-2">
                    <Plus size={18} />
                    <span>Add Task</span>
                  </button>
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
