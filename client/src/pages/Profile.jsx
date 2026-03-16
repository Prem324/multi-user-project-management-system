import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Calendar, Edit2, Save, X, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile, deleteAccount } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setIsLoading(false);
        return toast.error('Please enter a valid email address');
      }

      const updateData = { name: formData.name, email: formData.email };
      if (formData.password) updateData.password = formData.password;

      await updateProfile(updateData);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
      setFormData({ ...formData, password: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure? This will permanently delete your account and all associated data.')) return;
    
    try {
      await deleteAccount();
      toast.success('Account deleted successfully');
    } catch (error) {
      toast.error('Failed to delete account');
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">User Profile</h1>
        <p className="text-slate-500 mt-1">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
            <div className="w-24 h-24 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-4xl font-bold mx-auto mb-4 border-4 border-white shadow-lg">
              {user?.name?.charAt(0)}
            </div>
            <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
            <p className="text-slate-500 text-sm mt-1 capitalize font-medium">{user?.role}</p>
            
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="mt-6 w-full py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-slate-200"
              >
                <Edit2 size={16} />
                Edit Profile
              </button>
            ) : (
              <button 
                onClick={() => setIsEditing(false)}
                className="mt-6 w-full py-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all text-sm font-semibold flex items-center justify-center gap-2"
              >
                <X size={16} />
                Cancel
              </button>
            )}
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">Account Information</h3>
            </div>

            {isEditing ? (
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">New Password (optional)</label>
                  <input
                    type="password"
                    minLength={6}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    placeholder="Leave blank to keep current"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary-600 text-white font-bold py-3 rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Save size={18} />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl text-primary-600">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</p>
                    <p className="text-slate-900 font-bold">{user?.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl text-primary-600">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</p>
                    <p className="text-slate-900 font-bold">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl text-primary-600">
                    <Shield size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">User Role</p>
                    <p className="text-slate-900 font-bold capitalize">{user?.role}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-red-50 rounded-2xl border border-red-100 p-8 shadow-sm">
            <h3 className="text-lg font-bold text-red-900 mb-2 flex items-center gap-2">
              <Trash2 size={20} />
              Danger Zone
            </h3>
            <p className="text-red-600 text-sm mb-6 font-medium">Once you delete your account, there is no going back. All your projects and tasks will be permanently removed.</p>
            <button 
              onClick={handleDelete}
              className="px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all text-sm font-bold shadow-lg shadow-red-200"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
