import { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectContext';
import { X, Search, UserPlus, Mail, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';

const InviteModal = ({ projectId, onClose }) => {
  const { user } = useAuth();
  const { fetchProjectDetails } = useProjects();
  const [email, setEmail] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [foundUser, setFoundUser] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSearching(true);
    try {
      // Use the updated API service that handles /api prefix and auth
      const { data } = await api.get(`/auth/search?email=${email}`);
      setFoundUser(data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'User not found');
      setFoundUser(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInvite = async () => {
    if (!foundUser) return;
    try {
      await api.put(`/projects/${projectId}/members`, { userId: foundUser._id });
      toast.success('Member added successfully!');
      fetchProjectDetails(projectId);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add member');
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-900">Invite Members</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Search by Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  placeholder="e.g. user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-primary-100"
            >
              <Search size={18} />
              {isSearching ? 'Searching...' : 'Search User'}
            </button>
          </form>

          {foundUser && (
            <div className="bg-primary-50 p-4 rounded-xl border border-primary-100 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold shadow-sm">
                  {foundUser.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">{foundUser.name}</p>
                  <p className="text-xs text-slate-500">{foundUser.email}</p>
                </div>
              </div>
              <button
                onClick={handleInvite}
                className="bg-white text-primary-600 border border-primary-200 hover:bg-primary-600 hover:text-white p-2 rounded-lg transition-all duration-200 shadow-sm"
                title="Add to project"
              >
                <UserPlus size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InviteModal;
