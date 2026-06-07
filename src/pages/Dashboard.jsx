import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, limit, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import useAuth from '../hooks/useAuth';
import useNPTClock from '../hooks/useNPTClock';
import { getGreeting, avatarInitials, colorFromName } from '../utils/helpers';
import { formatNPT, getNPTDateString } from '../utils/nptTime';
import { CardSkeleton } from '../components/shared/LoadingSpinner';

function StatCard({ icon, label, value, sub, color = 'blue', loading }) {
  const colors = {
    blue:   'from-blue-600/20 to-blue-600/5 border-blue-500/30 text-blue-400',
    green:  'from-green-600/20 to-green-600/5 border-green-500/30 text-green-400',
    amber:  'from-amber-600/20 to-amber-600/5 border-amber-500/30 text-amber-400',
    red:    'from-red-600/20 to-red-600/5 border-red-500/30 text-red-400',
    purple: 'from-purple-600/20 to-purple-600/5 border-purple-500/30 text-purple-400',
  };
  if (loading) return <CardSkeleton lines={3} />;
  return (
    <div className={`bg-gradient-to-br ${colors[color]} border rounded-xl p-4`}>
      <div className="flex items-start justify-between mb-3">
        <div className="text-2xl">{icon}</div>
        <div className={`text-3xl font-heading font-bold ${colors[color].split(' ')[3]}`}>{value ?? '—'}</div>
      </div>
      <div className="text-gray-300 font-medium text-sm">{label}</div>
      {sub && <div className="text-gray-500 text-xs mt-0.5">{sub}</div>}
    </div>
  );
}

function ActivityItem({ item }) {
  const name = item.userName || 'Someone';
  const initials = avatarInitials(name);
  const bgColor = colorFromName(name);
  const icons = {
    check_in: '🟢', check_out: '🔵', task_completed: '✅',
    submission: '📤', leave_approved: '🏖️', leave_rejected: '❌',
    task_created: '📝', report_submitted: '📋',
  };
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-800 last:border-0">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${bgColor}`}>
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-300">
          <span className="font-medium text-white">{name}</span>{' '}
          <span>{item.message?.replace(name, '').trim()}</span>
        </p>
        {item.createdAt && (
          <p className="text-xs text-gray-600 mt-0.5">{formatNPT(item.createdAt)}</p>
        )}
      </div>
      <span className="text-base flex-shrink-0">{icons[item.type] || '📌'}</span>
    </div>
  );
}

export default function Dashboard() {
  const { user, userProfile, isAdmin } = useAuth();
  const time = useNPTClock();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ myTasks: 0, completedToday: 0, pendingSubmissions: 0, attendance: null });
  const [adminStats, setAdminStats] = useState({ presentToday: 0, pendingLeaves: 0, overdueTasks: 0 });
  const [activity, setActivity] = useState([]);

  const today = getNPTDateString();
  const greeting = getGreeting();
  const name = userProfile?.name || user?.email?.split('@')[0] || 'there';

  const hours = time.getHours();
  const minutes = String(time.getMinutes()).padStart(2, '0');
  const seconds = String(time.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h12 = hours % 12 || 12;
  const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  useEffect(() => {
    if (!user) return;
    const unsubs = [];

    // My tasks count
    const tasksQ = query(collection(db, 'tasks'), where('assignedTo', '==', user.uid), where('status', '!=', 'completed'));
    unsubs.push(onSnapshot(tasksQ, (snap) => {
      setStats(p => ({ ...p, myTasks: snap.size }));
    }));

    // Completed today
    const completedQ = query(
      collection(db, 'tasks'),
      where('assignedTo', '==', user.uid),
      where('status', '==', 'completed')
    );
    unsubs.push(onSnapshot(completedQ, (snap) => {
      setStats(p => ({ ...p, completedToday: snap.size }));
    }));

    // Pending submissions
    const subsQ = query(
      collection(db, 'submissions'),
      where('submittedBy', '==', user.uid),
      where('status', '==', 'pending')
    );
    unsubs.push(onSnapshot(subsQ, (snap) => {
      setStats(p => ({ ...p, pendingSubmissions: snap.size }));
      setLoading(false);
    }));

    // Attendance today
    const attRef = doc(db, 'attendance', user.uid, 'records', today);
    unsubs.push(onSnapshot(attRef, (snap) => {
      setStats(p => ({ ...p, attendance: snap.exists() ? snap.data() : null }));
    }));

    // Activity feed
    const actQ = query(collection(db, 'activity'), orderBy('createdAt', 'desc'), limit(20));
    unsubs.push(onSnapshot(actQ, (snap) => {
      setActivity(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }));

    return () => unsubs.forEach(u => u());
  }, [user, today]);

  useEffect(() => {
    if (!isAdmin) return;
    const unsubs = [];

    // Present today (simplified — count records with checkInTime)
    const todayAttQ = query(collection(db, 'activity'), where('type', '==', 'check_in'), orderBy('createdAt', 'desc'), limit(50));
    unsubs.push(onSnapshot(todayAttQ, (snap) => {
      setAdminStats(p => ({ ...p, presentToday: snap.size }));
    }));

    // Pending leaves
    const leavesQ = query(collection(db, 'activity'), where('type', '==', 'leave_submitted'), orderBy('createdAt', 'desc'), limit(50));
    unsubs.push(onSnapshot(leavesQ, (snap) => {
      setAdminStats(p => ({ ...p, pendingLeaves: snap.size }));
    }));

    // Overdue tasks
    const overdueQ = query(collection(db, 'tasks'), where('status', '!=', 'completed'));
    unsubs.push(onSnapshot(overdueQ, (snap) => {
      const now = new Date();
      const overdue = snap.docs.filter(d => {
        const due = d.data().dueDate;
        if (!due) return false;
        const dueDate = new Date(due?.seconds ? due.seconds * 1000 : due);
        return dueDate < now;
      });
      setAdminStats(p => ({ ...p, overdueTasks: overdue.length }));
    }));

    return () => unsubs.forEach(u => u());
  }, [isAdmin]);

  const getAttendanceStatus = () => {
    if (!stats.attendance) return { label: 'Not Checked In', color: 'red' };
    if (stats.attendance.checkOutTime) return { label: 'Checked Out ✓', color: 'purple' };
    return { label: 'Checked In 🟢', color: 'green' };
  };

  const attStatus = getAttendanceStatus();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600/20 via-blue-600/10 to-transparent border border-blue-500/20 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-heading font-bold text-white">
              {greeting}, {name}! 🙏
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              {dayNames[time.getDay()]}, {monthNames[time.getMonth()]} {time.getDate()}, {time.getFullYear()}
            </p>
          </div>
          <div className="text-right">
            <div className="font-mono text-3xl font-bold text-blue-400">
              {h12}:{minutes}:{seconds} {ampm}
            </div>
            <div className="text-blue-500/70 text-xs mt-0.5 font-semibold">Nepal Standard Time</div>
          </div>
        </div>
      </div>

      {/* My Stats */}
      <div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">My Stats Today</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon="✅" label="My Active Tasks" value={stats.myTasks} sub="Not yet completed" color="blue" loading={loading} />
          <StatCard icon="🎯" label="Tasks Completed" value={stats.completedToday} sub="All time" color="green" loading={loading} />
          <StatCard icon="📤" label="Pending Submissions" value={stats.pendingSubmissions} sub="Awaiting review" color="amber" loading={loading} />
          <StatCard icon="🕐" label="Attendance" value={attStatus.label} color={attStatus.color} loading={loading} />
        </div>
      </div>

      {/* Admin Stats */}
      {isAdmin && (
        <div>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Team Overview</h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard icon="👥" label="Present Today" value={adminStats.presentToday} sub="Check-ins recorded" color="green" />
            <StatCard icon="🏖️" label="Pending Leaves" value={adminStats.pendingLeaves} sub="Awaiting approval" color="amber" />
            <StatCard icon="⚠️" label="Overdue Tasks" value={adminStats.overdueTasks} sub="Past due date" color="red" />
          </div>
        </div>
      )}

      {/* Activity Feed + Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <div className="lg:col-span-2 bg-[#111827] rounded-xl border border-gray-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-semibold text-white">Team Activity</h2>
            <span className="text-xs text-gray-500">Real-time</span>
          </div>
          {activity.length === 0 ? (
            <div className="py-10 text-center">
              <div className="text-4xl mb-2">📡</div>
              <p className="text-gray-500 text-sm">No activity yet today</p>
            </div>
          ) : (
            <div className="max-h-[420px] overflow-y-auto -mx-1 px-1">
              {activity.map(item => <ActivityItem key={item.id} item={item} />)}
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="space-y-4">
          <div className="bg-[#111827] rounded-xl border border-gray-800 p-5">
            <h2 className="font-heading font-semibold text-white mb-4">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { to: '/attendance', icon: '🕐', label: 'Check In / Out',   color: 'text-green-400' },
                { to: '/tasks',      icon: '✅', label: 'View My Tasks',     color: 'text-blue-400' },
                { to: '/reports',    icon: '📋', label: 'Submit Daily Report', color: 'text-amber-400' },
                { to: '/submissions',icon: '📤', label: 'Submit Work',       color: 'text-purple-400' },
                { to: '/updates',    icon: '📢', label: 'Company Updates',   color: 'text-pink-400' },
                { to: '/sops',       icon: '📚', label: 'Knowledge Base',    color: 'text-teal-400' },
              ].map(link => (
                <a
                  key={link.to}
                  href={link.to}
                  onClick={e => { e.preventDefault(); window.location.href = link.to; }}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/5 transition-colors group"
                >
                  <span className="text-lg">{link.icon}</span>
                  <span className={`text-sm font-medium ${link.color} group-hover:text-white transition-colors`}>{link.label}</span>
                  <svg className="w-4 h-4 text-gray-700 group-hover:text-gray-400 ml-auto transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Report reminder */}
          {(() => {
            const nptHour = time.getHours();
            const nptMin = time.getMinutes();
            const isPastReminder = nptHour >= 18 || (nptHour === 17 && nptMin >= 45);
            return isPastReminder ? (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <div className="flex items-start gap-2">
                  <span className="text-lg">⚠️</span>
                  <div>
                    <p className="text-red-400 font-semibold text-sm">Report Reminder</p>
                    <p className="text-gray-400 text-xs mt-0.5">Don't forget to submit your daily workflow report before end of day!</p>
                    <a href="/reports" className="text-red-400 text-xs underline mt-2 inline-block">Submit Now →</a>
                  </div>
                </div>
              </div>
            ) : null;
          })()}
        </div>
      </div>
    </div>
  );
}
