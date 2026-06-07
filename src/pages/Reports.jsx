import { useState, useEffect } from 'react';
import {
  collection, query, where, orderBy, onSnapshot,
  doc, setDoc, getDoc, serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import useAuth from '../hooks/useAuth';
import { formatNPT, getNPTDateString, getNPTTime } from '../utils/nptTime';
import { avatarInitials, colorFromName } from '../utils/helpers';
import { CardSkeleton } from '../components/shared/LoadingSpinner';
import EmptyState from '../components/shared/EmptyState';
import toast from 'react-hot-toast';

// CSV export
function exportCSV(reports) {
  const rows = [
    ['Date', 'Member', 'Worked On', 'Completed Tasks', 'Blockers', 'Plan Tomorrow', 'Submitted At'],
    ...reports.map(r => [
      r.date, r.userName,
      `"${(r.workedOn || '').replace(/"/g, '""')}"`,
      `"${(r.completedTasks || []).join(', ')}"`,
      `"${(r.blockers || '').replace(/"/g, '""')}"`,
      `"${(r.planTomorrow || '').replace(/"/g, '""')}"`,
      r.submittedAt ? formatNPT(r.submittedAt) : '',
    ])
  ];
  const csv = rows.map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `reports_${getNPTDateString()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function ReportCard({ report, expanded, onToggle }) {
  const name = report.userName || 'Unknown';
  return (
    <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden">
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/3 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${colorFromName(name)}`}>
            {avatarInitials(name)}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{name}</p>
            <p className="text-xs text-gray-500">{report.date} · {report.submittedAt ? formatNPT(report.submittedAt) : 'No timestamp'}</p>
          </div>
        </div>
        <span className="text-gray-500 text-sm">{expanded ? '▲' : '▼'}</span>
      </div>

      {expanded && (
        <div className="border-t border-gray-800 p-4 space-y-4">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">What I worked on</p>
            <p className="text-sm text-gray-300 whitespace-pre-wrap">{report.workedOn || '—'}</p>
          </div>
          {report.completedTasks?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Tasks Completed</p>
              <div className="flex flex-wrap gap-1.5">
                {report.completedTasks.map((t, i) => (
                  <span key={i} className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2.5 py-1 rounded-full">{t}</span>
                ))}
              </div>
            </div>
          )}
          {report.blockers && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Challenges / Blockers</p>
              <p className="text-sm text-gray-300 whitespace-pre-wrap">{report.blockers}</p>
            </div>
          )}
          {report.planTomorrow && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Plan for Tomorrow</p>
              <p className="text-sm text-gray-300 whitespace-pre-wrap">{report.planTomorrow}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Reports() {
  const { user, userProfile, isAdmin } = useAuth();
  const [myTasks, setMyTasks] = useState([]);
  const [myReports, setMyReports] = useState([]);
  const [allReports, setAllReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [filterMember, setFilterMember] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [users, setUsers] = useState([]);

  const today = getNPTDateString();
  const todayReportId = `${user?.uid}_${today}`;

  const [form, setForm] = useState({
    workedOn: '',
    completedTaskIds: [],
    blockers: '',
    planTomorrow: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [todayReport, setTodayReport] = useState(null);
  const [checkingToday, setCheckingToday] = useState(true);

  // Load today's report status
  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(db, 'dailyReports', todayReportId), (snap) => {
      setTodayReport(snap.exists() ? snap.data() : null);
      setCheckingToday(false);
    });
    return () => unsub();
  }, [user, todayReportId]);

  // Load my tasks for checkbox selection
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'tasks'), where('assignedTo', '==', user.uid));
    const unsub = onSnapshot(q, (snap) => {
      setMyTasks(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [user]);

  // Load my reports (member view)
  useEffect(() => {
    if (!user || isAdmin) return;
    const q = query(
      collection(db, 'dailyReports'),
      where('uid', '==', user.uid),
      orderBy('submittedAt', 'desc')
    );
    const unsub = onSnapshot(q, (snap) => {
      setMyReports(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, [user, isAdmin]);

  // Admin: load all reports + users
  useEffect(() => {
    if (!isAdmin) return;
    const q = query(collection(db, 'dailyReports'), orderBy('submittedAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setAllReports(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    const uUnsub = onSnapshot(collection(db, 'users'), (snap) => {
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => { unsub(); uUnsub(); };
  }, [isAdmin]);

  const handleSubmit = async () => {
    if (!form.workedOn.trim()) { toast.error('Please describe what you worked on today'); return; }
    setSubmitting(true);
    try {
      const completedTaskTitles = myTasks
        .filter(t => form.completedTaskIds.includes(t.id))
        .map(t => t.title);

      await setDoc(doc(db, 'dailyReports', todayReportId), {
        uid: user.uid,
        userName: userProfile?.name || user.email,
        date: today,
        workedOn: form.workedOn.trim(),
        completedTasks: completedTaskTitles,
        blockers: form.blockers.trim(),
        planTomorrow: form.planTomorrow.trim(),
        submittedAt: serverTimestamp(),
      });

      toast.success('Daily report submitted! 📋');
    } catch (err) {
      toast.error('Failed to submit: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleTask = (id) => {
    setForm(p => ({
      ...p,
      completedTaskIds: p.completedTaskIds.includes(id)
        ? p.completedTaskIds.filter(i => i !== id)
        : [...p.completedTaskIds, id],
    }));
  };

  const displayReports = isAdmin
    ? allReports.filter(r => {
        if (filterMember && r.uid !== filterMember) return false;
        if (filterDate && r.date !== filterDate) return false;
        return true;
      })
    : myReports;

  const nptHour = getNPTTime().getHours();
  const isPastReminder = nptHour >= 17;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-heading font-bold text-white">📋 Daily Workflow Reports</h1>
        {isAdmin && (
          <button
            onClick={() => exportCSV(displayReports)}
            className="btn-secondary text-sm"
          >
            📥 Export CSV
          </button>
        )}
      </div>

      {/* Today's report form (members) */}
      {!isAdmin && (
        <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">📝</span>
            <h2 className="font-heading font-semibold text-white">Today's Report — {today}</h2>
            {todayReport && (
              <span className="ml-auto badge bg-green-500/20 text-green-400 border border-green-500/30 text-xs">
                ✓ Submitted at {formatNPT(todayReport.submittedAt)}
              </span>
            )}
            {!todayReport && isPastReminder && (
              <span className="ml-auto badge bg-red-500/20 text-red-400 border border-red-500/30 text-xs animate-pulse">
                ⚠️ Reminder: Please submit!
              </span>
            )}
          </div>

          {checkingToday ? (
            <CardSkeleton lines={4} />
          ) : todayReport ? (
            <div className="space-y-4">
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                <p className="text-green-400 text-sm font-semibold mb-1">✅ Report Submitted</p>
                <p className="text-gray-400 text-xs">You've already submitted today's report. Reports are read-only after submission.</p>
              </div>
              <ReportCard report={todayReport} expanded={true} onToggle={() => {}} />
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="label">What did you work on today? <span className="text-red-400">*</span></label>
                <textarea
                  value={form.workedOn}
                  onChange={e => setForm(p => ({ ...p, workedOn: e.target.value }))}
                  placeholder="Describe your work in detail — projects, tasks, meetings attended..."
                  rows={4}
                  className="input-field resize-none"
                />
              </div>

              {myTasks.length > 0 && (
                <div>
                  <label className="label">Tasks completed today (select all that apply)</label>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {myTasks.map(task => (
                      <label key={task.id} className="flex items-center gap-2.5 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={form.completedTaskIds.includes(task.id)}
                          onChange={() => toggleTask(task.id)}
                          className="w-4 h-4 accent-blue-500"
                        />
                        <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{task.title}</span>
                        <span className={`text-xs ml-auto ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="label">Challenges / Blockers</label>
                <textarea
                  value={form.blockers}
                  onChange={e => setForm(p => ({ ...p, blockers: e.target.value }))}
                  placeholder="Any obstacles you faced or need help with..."
                  rows={3}
                  className="input-field resize-none"
                />
              </div>

              <div>
                <label className="label">Plan for Tomorrow</label>
                <textarea
                  value={form.planTomorrow}
                  onChange={e => setForm(p => ({ ...p, planTomorrow: e.target.value }))}
                  placeholder="What are you planning to work on tomorrow?"
                  rows={3}
                  className="input-field resize-none"
                />
              </div>

              <button onClick={handleSubmit} disabled={submitting} className="btn-primary w-full">
                {submitting ? 'Submitting...' : '📤 Submit Daily Report'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Report history / Admin view */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="font-heading font-semibold text-white">
            {isAdmin ? 'All Team Reports' : 'My Report History'}
          </h2>

          {isAdmin && (
            <div className="flex gap-2 flex-wrap">
              <select value={filterMember} onChange={e => setFilterMember(e.target.value)}
                className="bg-[#1f2937] border border-gray-700 text-gray-300 text-sm rounded-lg px-3 py-1.5 outline-none focus:border-blue-500">
                <option value="">All Members</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
              <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)}
                className="bg-[#1f2937] border border-gray-700 text-gray-300 text-sm rounded-lg px-3 py-1.5 outline-none focus:border-blue-500" />
              {(filterMember || filterDate) && (
                <button onClick={() => { setFilterMember(''); setFilterDate(''); }}
                  className="text-xs text-gray-500 hover:text-red-400 transition-colors">× Clear</button>
              )}
            </div>
          )}
        </div>

        {loading ? (
          <div className="space-y-3">{[1,2,3].map(i => <CardSkeleton key={i} lines={2} />)}</div>
        ) : displayReports.length === 0 ? (
          <EmptyState icon="📋" title="No reports yet" description={isAdmin ? "Team members haven't submitted any reports yet." : "You haven't submitted any reports yet."} />
        ) : (
          <div className="space-y-3">
            {displayReports.map(report => (
              <ReportCard
                key={report.id}
                report={report}
                expanded={expandedId === report.id}
                onToggle={() => setExpandedId(p => p === report.id ? null : report.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function getPriorityColor(priority) {
  switch (priority) {
    case 'urgent': return 'text-red-400';
    case 'high': return 'text-orange-400';
    case 'medium': return 'text-yellow-400';
    default: return 'text-green-400';
  }
}
