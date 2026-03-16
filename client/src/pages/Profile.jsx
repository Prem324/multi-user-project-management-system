import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Calendar, Edit2 } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">User Profile</h1>
        <p className="text-slate-500 mt-1">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
            <div className="w-24 h-24 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-4xl font-bold mx-auto mb-4 border-4 border-white shadow-lg">
              {user?.name.charAt(0)}
            </div>
            <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
            <p className="text-slate-500 text-sm mt-1 capitalize">{user?.role}</p>
            
            <button className="mt-6 w-full py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors text-sm font-semibold flex items-center justify-center gap-2">
              <Edit2 size={16} />
              Edit Profile
            </button>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Account Information</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-50 rounded-xl text-slate-400">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</p>
                  <p className="text-slate-900 font-medium">{user?.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-50 rounded-xl text-slate-400">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</p>
                  <p className="text-slate-900 font-medium">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-50 rounded-xl text-slate-400">
                  <Shield size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">User Role</p>
                  <p className="text-slate-900 font-medium capitalize">{user?.role}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-red-50 rounded-2xl border border-red-100 p-8">
            <h3 className="text-lg font-bold text-red-900 mb-2">Danger Zone</h3>
            <p className="text-red-600 text-sm mb-6">Once you delete your account, there is no going back. Please be certain.</p>
            <button className="px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors text-sm font-semibold">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
