import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import io from 'socket.io-client';

const ProjectContext = createContext();

export const useProjects = () => useContext(ProjectContext);

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.token) {
      const newSocket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
        auth: { token: user.token }
      });
      setSocket(newSocket);

      newSocket.on('taskUpdated', (updatedTask) => {
        setTasks((prev) =>
          prev.map((task) => (task._id === updatedTask._id ? updatedTask : task))
        );
      });

      newSocket.on('taskCreated', (newTask) => {
        setTasks((prev) => [...prev, newTask]);
      });

      return () => newSocket.close();
    }
  }, [user]);

  const fetchProjects = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectDetails = async (id) => {
    if (!user) return;
    setLoading(true);
    try {
      const { data: projectData } = await api.get(`/projects/${id}`);
      setCurrentProject(projectData);
      
      const { data: tasksData } = await api.get(`/tasks/${id}`);
      setTasks(tasksData);

      if (socket) {
        socket.emit('joinProject', id);
      }
    } catch (error) {
      console.error('Error fetching project details:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        currentProject,
        tasks,
        loading,
        fetchProjects,
        fetchProjectDetails,
        setTasks,
        socket,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
