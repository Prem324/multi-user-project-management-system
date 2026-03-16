import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
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
    if (user) {
      const newSocket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');
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
    setLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const response = await axios.get('/api/projects', config);
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectDetails = async (id) => {
    setLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const response = await axios.get(`/api/projects/${id}`, config);
      setCurrentProject(response.data);
      
      const tasksResponse = await axios.get(`/api/tasks/${id}`, config);
      setTasks(tasksResponse.data);

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
