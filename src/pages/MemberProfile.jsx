import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, onSnapshot, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import useAuth from '../hooks/useAuth';
import { formatNPT } from '../utils/nptTime';
import { avatarInitials, colorFromName, getPriorityConfig, getAttendanceBadge } from '../utils/helpers';
import { CardSkeleton } from '../components/shared/LoadingSpinner';
import toast from 'react-hot-toast';

function SectionHeader({ title, icon }) {
  return (
    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-800">
      <span className="text-lg">{icon}</span>
      <h2 className="font-heading font-semibold text-white">{title}</h2>
    </div>
  );
}

function InfoRow({ label, value, sensitive }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 py-2.5 border-b border-gray-800/50 last:border-0">
      <span className="text-xs text-gray-500 sm:w-40 flex-shrink-0">{label}</span>
      <span className={`text-sm ${sensitive ? 'text-amber-300' : 'text-gray-200'}`}>{value || '—'}</span>
    </div>
  );
}

export default function MemberProfile() {
  const { uid } = useParams();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSensitive, setShowSensitive] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState({ present: 0, late: 0, absent: 0, leave: 0 });
  const [loadingStats, setLoadingStats] = useState(true);

  const isSelf = uid === user?.uid;
  const canViewSensitive = isAdmin;

  useEffect(() => {
    if (!uid) return;
    const unsub = onSnapshot(doc(db, 'users', uid), (snap) => {
      if (snap.exists()) setProfile({ id: snap.id, ...snap.data() });
      else setProfile(null);
      setLoading(false);
    });
    return () => unsub();
  }, [uid]);

  useEffect(() => {
    if (!uid) return;
    const q = query(collection(db, 'tasks'), where('assignedTo', '==', uid));
    getDocs(q).then(snap => setTasks(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, [uid]);

  useEffect(() => {
    if (!uid) return;
    const q = query(collection(db, 'submissions'), where('submittedBy', '==', uid));
    getDocs(q).then(snap => setSubmissions(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, [uid]);

  useEffect(() => {
    if (!uid) return;
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    getDocs(collection(db, 'attendance', uid, 'records')).then(snap => {
      let present = 0, late = 0, leave = 0;
      snap.docs.forEach(d => {
        if (!d.id.startsWith(`${year}-${month}`)) return;
        const data = d.data();
        if (data.status === 'present') present++;
        else if (data.status === 'late') { present++; late++; }
        else if (data.status === 'on_leave') leave++;
      });
      setAttendanceStats({ present, late, leave });
      setLoadingStats(false);
    });
  }, [uid]);

  if (loading) {
    return (
      <div className="max-w-3xl space-y-4">
        <CardSkeleton lines={6} />
        <CardSkeleton lines={4} />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-5xl mb-4">👤</div>
        <h2 className="text-lg font-heading font-semibold text-white mb-2">Member not found</h2>
        <button onClick={() => navigate('/team')} className="btn-secondary mt-4">← Back to Team</button>
      </div>
    );
  }

  const name = profile.name || profile.email;

  return (
    <div className="max-w-3xl space-y-6 animate-fade-in">
      {/* Back button */}
      <button onClick={() => navigate('/team')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Team Directory
      </button>

      {/* Profile header */}
      <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row gap-5 items-start">
          {profile.profilePhoto ? (
            <img src={profile.profilePhoto} alt={name} className="w-24 h-24 rounded-2xl object-cover flex-shrink-0" />
          ) : (
            <div className={`w-24 h-24 rounded-2xl flex items-center justify-center text-white text-3xl font-bold flex-shrink-0 ${colorFromName(name)}`}>
              {avatarInitials(name)}
            </div>
          )}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl font-heading font-bold text-white">{name}</h1>
              {profile.isAdmin && <span className="badge bg-blue-500/20 text-blue-400 border border-blue-500/30">Admin</span>}
              {isSelf && <span className="badge bg-gray-500/20 text-gray-400 border border-gray-500/30">You</span>}
              {profile.isActive === false && <span className="badge bg-red-500/20 text-red-400 border border-red-500/30">Inactive</span>}
            </div>
            <p className="text-blue-400 font-medium">{profile.role || 'No role set'}</p>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>📧</span> <span>{profile.email}</span>
              </div>
              {profile.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>📱</span> <span>{profile.phone}</span>
                </div>
              )}
              {profile.createdAt && (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>📅</span> <span>Joined {formatNPT(profile.createdAt)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Admin-only sensitive info */}
      {canViewSensitive && (
        <div className="bg-[#111827] border border-gray-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <SectionHeader title="Identity & Documents" icon="🪪" />
            <button
              onClick={() => setShowSensitive(p => !p)}
              className={`text-sm px-3 py-1.5 rounded-lg border transition-colors ${
                showSensitive
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  : 'bg-gray-800 text-gray-400 border-gray-700 hover:text-white'
              }`}
            >
              {showSensitive ? '🔒 Hide Sensitive Info' : '👁️ View Sensitive Info'}
            </button>
          </div>

          {showSensitive ? (
            <div className="space-y-4">
              <div>
                <InfoRow label="Citizenship Number" value={profile.citizenshipNumber} sensitive />
                <InfoRow label="SSF ID" value={profile.ssfId} sensitive />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profile.citizenshipFront && (
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Citizenship Front</p>
                    <div className="relative group">
                      <img src={profile.citizenshipFront} alt="Citizenship Front" className="w-full h-36 object-cover rounded-xl border border-gray-700" />
                      <a href={profile.citizenshipFront} target="_blank" rel="noopener noreferrer"
                        className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl text-white text-sm font-medium">
                        ↓ Download
                      </a>
                    </div>
                  </div>
                )}
                {profile.citizenshipBack && (
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Citizenship Back</p>
                    <div className="relative group">
                      <img src={profile.citizenshipBack} alt="Citizenship Back" className="w-full h-36 object-cover rounded-xl border border-gray-700" />
                      <a href={profile.citizenshipBack} target="_blank" rel="noopener noreferrer"
                        className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl text-white text-sm font-medium">
                        ↓ Download
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Bank Details */}
              <div className="pt-4 border-t border-gray-800">
                <h3 className="text-sm font-semibold text-gray-400 mb-3">🏦 Bank Details</h3>
                <InfoRow label="Bank Name" value={profile.bankName} sensitive />
                <InfoRow label="Account Number" value={profile.bankAccount} sensitive />
                <InfoRow label="Branch" value={profile.bankBranch} sensitive />
                <InfoRow label="Account Holder" value={profile.accountHolder} sensitive />
              </div>
            </div>
          ) : (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-center">
              <p className="text-amber-400 text-sm">🔒 Click "View Sensitive Info" to see identity and bank details</p>
            </div>
          )}
        </div>
      )}

      {/* Work Activity (admin only) */}
      {(canViewSensitive || isSelf) && (
        <div className="bg-[#111827] border border-gray-800 rounded-2xl p-5">
          <SectionHeader title="Work Activity" icon="📊" />

          {/* Attendance stats this month */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: 'Present', value: attendanceStats.present, color: 'text-green-400' },
              { label: 'Late Check-ins', value: attendanceStats.late, color: 'text-yellow-400' },
              { label: 'Leave Days', value: attendanceStats.leave, color: 'text-blue-400' },
            ].map(s => (
              <div key={s.label} className="bg-[#0d1526] rounded-xl p-3 text-center border border-gray-800">
                <div className={`text-2xl font-heading font-bold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Current tasks */}
          <h3 className="text-sm font-semibold text-gray-400 mb-2">Active Tasks ({tasks.filter(t => t.status !== 'completed').length})</h3>
          <div className="space-y-1.5 mb-4">
            {tasks.filter(t => t.status !== 'completed').slice(0, 5).map(task => {
              const pc = getPriorityConfig(task.priority);
              return (
                <div key={task.id} className="flex items-center gap-2 bg-gray-800/50 rounded-lg px-3 py-2">
                  <span className={`badge text-[10px] ${pc.color}`}>{pc.label}</span>
                  <span className="text-sm text-gray-300 flex-1 truncate">{task.title}</span>
                  <span className={`text-xs ${task.status === 'in_progress' ? 'text-blue-400' : task.status === 'under_review' ? 'text-yellow-400' : 'text-gray-500'}`}>
                    {task.status?.replace('_', ' ')}
                  </span>
                </div>
              );
            })}
            {tasks.filter(t => t.status !== 'completed').length === 0 && (
              <p className="text-xs text-gray-600 py-2 text-center">No active tasks</p>
            )}
          </div>

          {/* Recent submissions */}
          <h3 className="text-sm font-semibold text-gray-400 mb-2">Recent Submissions ({submissions.length})</h3>
          <div className="space-y-1.5">
            {submissions.slice(0, 4).map(sub => (
              <div key={sub.id} className="flex items-center gap-2 bg-gray-800/50 rounded-lg px-3 py-2">
                <span className={`badge text-[10px] ${
                  sub.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                  sub.status === 'revision_requested' ? 'bg-orange-500/20 text-orange-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {sub.status === 'approved' ? '✅' : sub.status === 'revision_requested' ? '🔁' : '⏳'}
                  {' '}{sub.status?.replace('_', ' ')}
                </span>
                <span className="text-sm text-gray-300 flex-1 truncate">{sub.workTitle}</span>
                <span className="text-xs text-gray-600 truncate max-w-[100px]">{sub.taskTitle}</span>
              </div>
            ))}
            {submissions.length === 0 && (
              <p className="text-xs text-gray-600 py-2 text-center">No submissions yet</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
