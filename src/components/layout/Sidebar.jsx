import { NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { avatarInitials, colorFromName } from '../../utils/helpers';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
  { path: '/dashboard',   icon: '📊', label: 'Workspace Dashboard' },
  { path: '/tasks',       icon: '✅', label: 'Task Management' },
  { path: '/reports',     icon: '📋', label: 'Daily Reports' },
  { path: '/submissions', icon: '📤', label: 'Work Submissions' },
  { path: '/attendance',  icon: '🕐', label: 'Attendance & Check-in' },
  { path: '/updates',     icon: '📢', label: 'Company Updates' },
  { path: '/sops',        icon: '📚', label: 'Knowledge Base' },
  { path: '/team',        icon: '👥', label: 'Team Directory' },
];

export default function Sidebar({ collapsed, onToggle }) {
  const { user, userProfile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch {
      toast.error('Logout failed');
    }
  };

  const name = userProfile?.name || user?.email?.split('@')[0] || 'User';
  const role = userProfile?.role || 'Team Member';
  const photo = userProfile?.profilePhoto;
  const initials = avatarInitials(name);
  const avatarColor = colorFromName(name);

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-[#0d1526] border-r border-gray-800 z-40 flex flex-col transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-[260px]'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-800 flex-shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center flex-shrink-0 font-heading font-bold text-white text-sm">
          DM
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="font-heading font-bold text-white text-sm leading-tight">Digital Marmat</div>
            <div className="text-gray-500 text-xs">Pvt. Ltd.</div>
          </div>
        )}
        <button
          onClick={onToggle}
          className="ml-auto p-1 rounded-lg hover:bg-white/10 text-gray-500 hover:text-white transition-colors flex-shrink-0"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {collapsed
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            }
          </svg>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            title={collapsed ? item.label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 group ${
                isActive
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
              }`
            }
          >
            <span className="text-base flex-shrink-0">{item.icon}</span>
            {!collapsed && (
              <span className="font-medium truncate">{item.label}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div className="border-t border-gray-800 p-3 flex-shrink-0">
        <div
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
          onClick={() => navigate('/team/' + user?.uid)}
          title={collapsed ? name : undefined}
        >
          {photo ? (
            <img src={photo} alt={name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
          ) : (
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${avatarColor}`}>
              {initials}
            </div>
          )}
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-white truncate">{name}</div>
              <div className="text-xs text-gray-500 truncate">{role}</div>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          title={collapsed ? 'Logout' : undefined}
          className={`mt-1 w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors text-sm ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
