import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectContext';
import { formatDistanceToNow } from 'date-fns';
import { Activity, History, ChevronRight } from 'lucide-react';

const ActivityPanel = ({ projectId }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { socket } = useProjects();

  useEffect(() => {
    fetchLogs();

    if (socket) {
      socket.on('newActivity', (log) => {
        if (log.projectId === projectId) {
          setLogs((prev) => [log, ...prev]);
        }
      });
    }

    return () => {
      if (socket) socket.off('newActivity');
    };
  }, [projectId, socket]);

  const fetchLogs = async () => {
    try {
      const { data } = await api.get(`/activity/${projectId}`);
      setLogs(data);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-4 text-center text-slate-400">Loading history...</div>;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col h-full shadow-sm">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          <History size={18} className="text-primary-600" />
          Project Activity
        </h3>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white px-2 py-1 rounded-lg border border-slate-100">
          Latest {logs.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {logs.map((log) => (
          <div key={log._id} className="flex gap-3 group">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center text-xs font-bold border border-primary-100 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
                {log.performedBy.name.charAt(0)}
              </div>
              <div className="absolute top-8 bottom-[-16px] left-1/2 w-px bg-slate-100 group-last:hidden"></div>
            </div>
            <div className="flex-1 pt-1">
              <p className="text-sm text-slate-700 leading-snug">
                <span className="font-bold text-slate-900">{log.performedBy.name}</span>{' '}
                {log.action}
              </p>
              <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                <Activity size={10} />
                {formatDistanceToNow(new Date(log.createdAt))} ago
              </p>
            </div>
          </div>
        ))}

        {logs.length === 0 && (
          <div className="py-10 text-center space-y-2">
            <History size={32} className="mx-auto text-slate-200" />
            <p className="text-sm text-slate-400">No activity logged yet.</p>
          </div>
        )}
      </div>
      
      <button className="p-3 text-xs font-bold text-slate-500 hover:text-primary-600 border-t border-slate-100 transition-colors flex items-center justify-center gap-1">
        View All History
        <ChevronRight size={14} />
      </button>
    </div>
  );
};

export default ActivityPanel;
