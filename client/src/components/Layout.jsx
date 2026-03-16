import { Outlet, useNavigate, useLocation, NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, LogOut, User, Bell, Menu, X, CheckSquare } from 'lucide-react';
import { useState } from 'react';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
    { name: 'Profile', icon: <User size={20} />, path: '/profile' },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200">
        <div className="p-6 text-center">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="bg-primary-600 p-2 rounded-xl text-white shadow-lg shadow-primary-200">
              <CheckSquare size={24} />
            </div>
            <span className="text-xl font-bold text-slate-900">ProManage</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 mt-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${isActive 
                  ? 'bg-primary-50 text-primary-600 shadow-sm shadow-primary-100/50' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
              `}
            >
              {item.icon}
              <span className="font-semibold">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-3 py-4 mb-4 bg-slate-50 rounded-2xl">
            <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold shadow-md">
              {user?.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase truncate">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200 font-semibold"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header - Mobile */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200">
           <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary-600 p-1.5 rounded-lg text-white">
              <CheckSquare size={20} />
            </div>
            <span className="text-lg font-bold text-slate-900">ProManage</span>
          </Link>
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg"
          >
            <Menu size={24} />
          </button>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 scrollbar-hide">
          <Outlet />
        </div>
      </main>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-[280px] h-full shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h1 className="text-xl font-bold text-slate-900">Menu</h1>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-slate-50 rounded-full"
              >
                <X size={24} />
              </button>
            </div>
            <nav className="p-4 space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => `
                    flex items-center gap-4 px-4 py-4 rounded-xl font-bold
                    ${isActive ? 'bg-primary-50 text-primary-600' : 'text-slate-600'}
                  `}
                >
                  {item.icon}
                  <span className="text-lg">{item.name}</span>
                </NavLink>
              ))}
              <div className="pt-4 mt-4 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-4 w-full px-4 py-4 text-red-600 font-bold"
                >
                  <LogOut size={24} />
                  <span className="text-lg">Logout</span>
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
