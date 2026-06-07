import useNPTClock from '../../hooks/useNPTClock';
import useAuth from '../../hooks/useAuth';
import NotificationBell from '../shared/NotificationBell';
import { avatarInitials, colorFromName } from '../../utils/helpers';
import { useNavigate, useLocation } from 'react-router-dom';

const ROUTE_LABELS = {
  '/dashboard':   '📊 Workspace Dashboard',
  '/tasks':       '✅ Task Management',
  '/reports':     '📋 Daily Workflow Reports',
  '/submissions': '📤 Work Submissions',
  '/attendance':  '🕐 Attendance & Check-in',
  '/updates':     '📢 Company Updates',
  '/sops':        '📚 Knowledge Base / SOPs',
  '/team':        '👥 Team Directory',
};

export default function Navbar({ sidebarWidth }) {
  const time = useNPTClock();
  const { userProfile, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const name = userProfile?.name || user?.email?.split('@')[0] || 'User';
  const photo = userProfile?.profilePhoto;
  const initials = avatarInitials(name);
  const avatarColor = colorFromName(name);

  const pageLabel = Object.entries(ROUTE_LABELS).find(([k]) =>
    location.pathname.startsWith(k)
  )?.[1] || '';

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const day = dayNames[time.getDay()];
  const month = monthNames[time.getMonth()];
  const date = time.getDate();
  const year = time.getFullYear();
  const hours = time.getHours();
  const minutes = String(time.getMinutes()).padStart(2, '0');
  const seconds = String(time.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h12 = hours % 12 || 12;
  const timeStr = `${h12}:${minutes}:${seconds} ${ampm}`;

  return (
    <header
      className="fixed top-0 right-0 z-30 h-14 bg-[#0d1526]/95 backdrop-blur border-b border-gray-800 flex items-center px-4 gap-4"
      style={{ left: sidebarWidth }}
    >
      {/* Page title */}
      <div className="flex-1 min-w-0">
        <span className="text-gray-300 text-sm font-medium truncate">{pageLabel}</span>
      </div>

      {/* NPT Clock */}
      <div className="hidden sm:flex items-center gap-2 bg-[#111827] border border-gray-700 rounded-lg px-3 py-1.5 text-xs">
        <span className="text-blue-400 font-mono font-semibold">{timeStr}</span>
        <span className="text-gray-600">|</span>
        <span className="text-gray-400">{day}, {month} {date}, {year}</span>
        <span className="text-blue-500 font-semibold text-[10px] bg-blue-500/10 px-1.5 py-0.5 rounded">NPT</span>
      </div>

      {/* Notifications */}
      <NotificationBell />

      {/* Avatar */}
      <button
        onClick={() => navigate('/team/' + user?.uid)}
        className="flex items-center gap-2 p-1 rounded-lg hover:bg-white/5 transition-colors"
      >
        {photo ? (
          <img src={photo} alt={name} className="w-8 h-8 rounded-full object-cover" />
        ) : (
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${avatarColor}`}>
            {initials}
          </div>
        )}
        <span className="hidden md:block text-sm text-gray-300 max-w-[100px] truncate">{name}</span>
      </button>
    </header>
  );
}
