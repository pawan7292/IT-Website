import { useState, useEffect, useRef } from 'react';
import {
  doc, collection, query, where, orderBy, onSnapshot,
  setDoc, updateDoc, addDoc, getDocs, serverTimestamp, getDoc
} from 'firebase/firestore';
import { db } from '../firebase';
import useAuth from '../hooks/useAuth';
import useNPTClock from '../hooks/useNPTClock';
import {
  getNPTTime, getNPTDateString, formatNPT, formatNPTTimeOnly, formatNPTDate
} from '../utils/nptTime';
import {
  getTimerDisplay, getOfficeProgressPercent, getProgressBarColor,
  getSmartStatusMessage, getAttendanceBadge, LEAVE_TYPES, avatarInitials, colorFromName
} from '../utils/helpers';
import { CardSkeleton } from '../components/shared/LoadingSpinner';
import EmptyState from '../components/shared/EmptyState';
import toast from 'react-hot-toast';

async function pushNotif(uid, message, type, link) {
  await addDoc(collection(db, 'notifications', uid, 'items'), {
    message, type, read: false, link, createdAt: serverTimestamp(),
  });
}
async function logActivity(type, uid, userName, message) {
  await addDoc(collection(db, 'activity'), { type, uid, userName, message, createdAt: serverTimestamp() });
}

// ─── Week calendar row ────────────────────────────────────────────────────────
function WeekSummary({ records }) {
  const now = getNPTTime();
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const rec = records[key];
    const isToday = key === getNPTDateString();
    const isPast = d < now && !isToday;
    const isFuture = d > now;
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return { key, rec, isToday, isPast, isFuture, dayName: dayNames[i], date: d.getDate() };
  });

  const statusColor = (rec, isPast) => {
    if (!rec && isPast) return 'bg-red-500/20 text-red-400 border-red-500/30';
    if (!rec) return 'bg-gray-800/50 border-gray-700';
    switch (rec.status) {
      case 'present': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'late': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'left_early': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'on_leave': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'half_day': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'absent': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-800/50 border-gray-700';
    }
  };

  return (
    <div className="bg-[#111827] border border-gray-800 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-gray-400 mb-3">This Week</h3>
      <div className="grid grid-cols-7 gap-1.5">
        {days.map(d => (
          <div key={d.key} className={`border rounded-xl p-2 text-center transition-colors ${statusColor(d.rec, d.isPast)} ${d.isToday ? 'ring-2 ring-blue-500/50' : ''}`}>
            <div className="text-[10px] font-semibold opacity-70">{d.dayName}</div>
            <div className="text-sm font-bold mt-0.5">{d.date}</div>
            {d.rec ? (
              <div className="text-[9px] mt-1 truncate">
                {d.rec.status === 'on_leave' ? '🏖️' :
                 d.rec.status === 'half_day' ? '🌓' :
                 d.rec.checkInTime ? formatNPTTimeOnly(d.rec.checkInTime) : '?'}
              </div>
            ) : d.isPast ? (
              <div className="text-[9px] mt-1 text-red-400/60">Absent</div>
            ) : d.isToday ? (
              <div className="text-[9px] mt-1 text-blue-400">Today</div>
            ) : (
              <div className="text-[9px] mt-1 opacity-30">—</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Leave Modal ──────────────────────────────────────────────────────────────
function LeaveModal({ onClose, currentUser, userProfile }) {
  const [form, setForm] = useState({
    leaveType: 'full',
    date: getNPTDateString(),
    reason: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!form.reason.trim()) { toast.error('Please provide a reason'); return; }
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'attendance', currentUser.uid, 'leaves'), {
        date: form.date,
        leaveType: form.leaveType,
        reason: form.reason.trim(),
        status: 'pending',
        submittedBy: currentUser.uid,
        submittedByName: userProfile?.name || currentUser.email,
        submittedAt: serverTimestamp(),
        reviewedBy: null,
        reviewedAt: null,
        adminNote: '',
      });
      await logActivity('leave_submitted', currentUser.uid, userProfile?.name || 'User', `Applied for ${LEAVE_TYPES.find(t => t.id === form.leaveType)?.label} on ${form.date}`);
      toast.success('Leave application submitted! ✅');
      onClose();
    } catch (err) {
      toast.error('Failed to submit leave: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const charCount = form.reason.length;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-[#111827] border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-700">
          <h2 className="font-heading font-bold text-white">🏖️ Apply for Leave</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl">×</button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="label">Leave Type</label>
            <select value={form.leaveType} onChange={e => setForm(p => ({ ...p, leaveType: e.target.value }))} className="input-field">
              {LEAVE_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Leave Date</label>
            <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className="input-field" min={getNPTDateString()} />
          </div>
          <div>
            <label className="label">
              Reason <span className="text-red-400">*</span>
              <span className={`ml-2 text-xs ${charCount > 280 ? 'text-red-400' : 'text-gray-500'}`}>{charCount}/300</span>
            </label>
            <textarea
              value={form.reason}
              onChange={e => e.target.value.length <= 300 && setForm(p => ({ ...p, reason: e.target.value }))}
              placeholder="Brief reason for leave..."
              rows={3}
              className="input-field resize-none"
            />
          </div>
        </div>
        <div className="flex gap-3 p-5 border-t border-gray-700">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button onClick={handleSubmit} disabled={submitting} className="btn-primary flex-1">
            {submitting ? 'Submitting...' : '📤 Submit Leave Request'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Member Attendance View ───────────────────────────────────────────────────
function MemberView({ user, userProfile }) {
  const time = useNPTClock();
  const [todayRecord, setTodayRecord] = useState(null);
  const [pendingLeave, setPendingLeave] = useState(null);
  const [weekRecords, setWeekRecords] = useState({});
  const [loading, setLoading] = useState(true);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [timerDisplay, setTimerDisplay] = useState('00:00:00');
  const intervalRef = useRef(null);
  const today = getNPTDateString();

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'attendance', user.uid, 'records', today), (snap) => {
      setTodayRecord(snap.exists() ? snap.data() : null);
      setLoading(false);
    });
    return () => unsub();
  }, [user.uid, today]);

  useEffect(() => {
    const q = query(collection(db, 'attendance', user.uid, 'leaves'), where('status', '==', 'pending'), where('date', '==', today));
    const unsub = onSnapshot(q, (snap) => {
      setPendingLeave(snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() });
    });
    return () => unsub();
  }, [user.uid, today]);

  // Week records
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'attendance', user.uid, 'records'), (snap) => {
      const recs = {};
      snap.docs.forEach(d => { recs[d.id] = d.data(); });
      setWeekRecords(recs);
    });
    return () => unsub();
  }, [user.uid]);

  // Timer interval
  useEffect(() => {
    if (todayRecord?.checkInTime && !todayRecord?.checkOutTime) {
      const tick = () => {
        setTimerDisplay(getTimerDisplay(todayRecord.checkInTime));
      };
      tick();
      intervalRef.current = setInterval(tick, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [todayRecord]);

  const npt = getNPTTime();
  const progress = getOfficeProgressPercent();
  const progressColor = getProgressBarColor(progress);
  const statusMsg = getSmartStatusMessage(todayRecord?.checkInTime, todayRecord?.checkOutTime);

  const handleCheckIn = async () => {
    setCheckingIn(true);
    try {
      const now = getNPTTime();
      const officeMins = 10 * 60;
      const nowMins = now.getHours() * 60 + now.getMinutes();
      const lateBy = Math.max(0, nowMins - officeMins);

      await setDoc(doc(db, 'attendance', user.uid, 'records', today), {
        checkInTime: serverTimestamp(),
        checkOutTime: null,
        durationMinutes: 0,
        earlyCheckIn: nowMins < officeMins,
        lateByMinutes: lateBy,
        leftEarlyByMinutes: 0,
        status: lateBy > 0 ? 'late' : 'present',
        markedByAdmin: false,
        adminNote: '',
      });

      await logActivity('check_in', user.uid, userProfile?.name || 'User',
        lateBy > 0
          ? `${userProfile?.name} checked in ${lateBy} minutes late`
          : `${userProfile?.name} checked in on time`
      );
      toast.success('Checked in! 🟢 Have a great day!');
    } catch (err) {
      toast.error('Check-in failed: ' + err.message);
    } finally {
      setCheckingIn(false);
    }
  };

  const handleCheckOut = async () => {
    if (!todayRecord?.checkInTime) return;
    setCheckingOut(true);
    try {
      const now = getNPTTime();
      const checkIn = new Date(todayRecord.checkInTime.seconds * 1000);
      const durationMs = now - checkIn;
      const durationMinutes = Math.floor(durationMs / 60000);

      const officeEnd = 17 * 60;
      const nowMins = now.getHours() * 60 + now.getMinutes();
      const leftEarlyByMinutes = Math.max(0, officeEnd - nowMins);

      const newStatus = leftEarlyByMinutes > 0
        ? (todayRecord.status === 'late' ? 'late' : 'left_early')
        : todayRecord.status;

      await updateDoc(doc(db, 'attendance', user.uid, 'records', today), {
        checkOutTime: serverTimestamp(),
        durationMinutes,
        leftEarlyByMinutes,
        status: newStatus,
      });
      await logActivity('check_out', user.uid, userProfile?.name || 'User',
        `${userProfile?.name} checked out after ${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}m`
      );
      toast.success(`Checked out! Total: ${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}m 🎉`);
    } catch (err) {
      toast.error('Check-out failed: ' + err.message);
    } finally {
      setCheckingOut(false);
    }
  };

  if (loading) return <CardSkeleton lines={5} />;

  const hasApprovedLeave = todayRecord?.status === 'on_leave';
  const isCheckedIn = !!todayRecord?.checkInTime;
  const isCheckedOut = !!todayRecord?.checkOutTime;
  const hourStr = String(npt.getHours() % 12 || 12).padStart(2, '0');
  const minStr = String(npt.getMinutes()).padStart(2, '0');
  const ampm = npt.getHours() >= 12 ? 'PM' : 'AM';

  return (
    <div className="space-y-5">
      {/* Action buttons (before check-in) */}
      {!isCheckedIn && !hasApprovedLeave && (
        <div className="space-y-3">
          {pendingLeave ? (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-5 text-center">
              <div className="text-3xl mb-2">⏳</div>
              <p className="text-yellow-400 font-semibold">Leave Pending</p>
              <p className="text-gray-400 text-sm mt-1">Your leave request for today is awaiting admin approval.</p>
              <p className="text-gray-500 text-xs mt-2">Type: {LEAVE_TYPES.find(t => t.id === pendingLeave.leaveType)?.label}</p>
            </div>
          ) : (
            <>
              <button
                onClick={handleCheckIn}
                disabled={checkingIn}
                className="w-full py-5 bg-green-600/20 hover:bg-green-600/30 border-2 border-green-500/40 hover:border-green-500 text-green-400 rounded-2xl font-semibold text-lg transition-all disabled:opacity-50"
              >
                {checkingIn ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin" />
                    Checking in...
                  </span>
                ) : (
                  '✅ CHECK IN — I\'m at Office'
                )}
              </button>
              <button
                onClick={() => setShowLeaveModal(true)}
                className="w-full py-3.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-2xl font-medium transition-all"
              >
                🏖️ Apply for Leave
              </button>
            </>
          )}
        </div>
      )}

      {hasApprovedLeave && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5 text-center">
          <div className="text-4xl mb-2">🏖️</div>
          <p className="text-blue-400 font-semibold text-lg">On Leave Today</p>
          <p className="text-gray-400 text-sm mt-1">Your leave has been approved.</p>
        </div>
      )}

      {/* Timer card */}
      {isCheckedIn && (
        <div className="bg-[#111827] border border-gray-700 rounded-2xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500">{formatNPTDate(new Date())}</p>
              <p className="text-blue-400 font-semibold">{hourStr}:{minStr} {ampm} NPT</p>
            </div>
            {!isCheckedOut && (
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-green-400 font-medium">Live</span>
              </div>
            )}
          </div>

          {/* Big timer */}
          <div className="text-center my-6">
            {isCheckedOut ? (
              <div>
                <p className="text-5xl font-mono font-bold text-white">
                  {Math.floor(todayRecord.durationMinutes / 60)}h {todayRecord.durationMinutes % 60}m
                </p>
                <p className="text-green-400 text-sm mt-2">🎉 Done for today!</p>
              </div>
            ) : (
              <>
                <p className="text-5xl font-mono font-bold text-white tracking-wider">{timerDisplay}</p>
                <p className="text-gray-500 text-sm mt-2">Time Worked Today</p>
              </>
            )}
          </div>

          {/* Progress bar */}
          {!isCheckedOut && (
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                <span>10:00 AM</span>
                <span className="text-blue-400 font-semibold">{progress}%</span>
                <span>5:00 PM</span>
              </div>
              <div className="h-2.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${progressColor}`}
                  style={{ width: `${Math.min(100, progress)}%` }}
                />
              </div>
            </div>
          )}

          {/* Status messages */}
          <div className="space-y-1 mb-5">
            {todayRecord.checkInTime && (
              <p className="text-xs text-gray-400">
                ✅ Checked in at {formatNPTTimeOnly(todayRecord.checkInTime)}
              </p>
            )}
            {todayRecord.lateByMinutes > 0 && (
              <p className="text-xs text-yellow-400">
                🟡 {todayRecord.lateByMinutes} minutes late from 10:00 AM
              </p>
            )}
            {!isCheckedOut && (
              <p className="text-sm text-gray-300 mt-2">
                {statusMsg.emoji} {statusMsg.msg}
              </p>
            )}
            {isCheckedOut && todayRecord.checkOutTime && (
              <p className="text-xs text-gray-400">
                🔵 Checked out at {formatNPTTimeOnly(todayRecord.checkOutTime)}
              </p>
            )}
          </div>

          {/* Check Out button */}
          {!isCheckedOut && (
            <button
              onClick={handleCheckOut}
              disabled={checkingOut}
              className="w-full py-3.5 bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 hover:border-red-500 text-red-400 rounded-xl font-semibold transition-all"
            >
              {checkingOut ? 'Checking out...' : '🔴 CHECK OUT'}
            </button>
          )}
        </div>
      )}

      {/* Week summary */}
      <WeekSummary records={weekRecords} />

      {showLeaveModal && (
        <LeaveModal
          onClose={() => setShowLeaveModal(false)}
          currentUser={{ uid: user.uid, email: user.email }}
          userProfile={userProfile}
        />
      )}
    </div>
  );
}

// ─── Admin Attendance Panel ────────────────────────────────────────────────────
function AdminView() {
  const { user: adminUser, userProfile: adminProfile } = useAuth();
  const [tab, setTab] = useState('today');
  const [todayRecords, setTodayRecords] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [calendarMember, setCalendarMember] = useState('');
  const [calendarRecords, setCalendarRecords] = useState({});
  const [leaveFilter, setLeaveFilter] = useState('pending');
  const [loading, setLoading] = useState(true);
  const today = getNPTDateString();
  const time = useNPTClock();

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), (snap) => {
      const u = snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(u => u.isActive !== false);
      setUsers(u);
      if (!calendarMember && u.length > 0) setCalendarMember(u[0].id);
    });
    return () => unsub();
  }, []);

  // Today's records for all users (listen to activity feed for check-ins)
  useEffect(() => {
    if (!users.length) return;
    const unsubList = [];
    const recordsMap = {};

    const updateRecords = () => {
      setTodayRecords(Object.values(recordsMap));
      setLoading(false);
    };

    users.forEach(u => {
      const unsub = onSnapshot(doc(db, 'attendance', u.id, 'records', today), (snap) => {
        recordsMap[u.id] = { userId: u.id, userName: u.name, userPhoto: u.profilePhoto, userRole: u.role, ...(snap.exists() ? snap.data() : { status: null }) };
        updateRecords();
      });
      unsubList.push(unsub);
    });

    return () => unsubList.forEach(u => u());
  }, [users, today]);

  // Leave requests
  useEffect(() => {
    if (!users.length) return;
    const allLeaves = [];
    const unsubList = [];
    const leaveMap = {};

    const update = () => {
      const arr = Object.values(leaveMap).flat();
      arr.sort((a, b) => (b.submittedAt?.seconds || 0) - (a.submittedAt?.seconds || 0));
      setLeaveRequests(arr);
    };

    users.forEach(u => {
      const q = query(collection(db, 'attendance', u.id, 'leaves'), orderBy('submittedAt', 'desc'));
      const unsub = onSnapshot(q, (snap) => {
        leaveMap[u.id] = snap.docs.map(d => ({ id: d.id, userId: u.id, userName: u.name, userPhoto: u.profilePhoto, ...d.data() }));
        update();
      });
      unsubList.push(unsub);
    });

    return () => unsubList.forEach(u => u());
  }, [users]);

  // Calendar records for selected member
  useEffect(() => {
    if (!calendarMember) return;
    const unsub = onSnapshot(collection(db, 'attendance', calendarMember, 'records'), (snap) => {
      const recs = {};
      snap.docs.forEach(d => { recs[d.id] = d.data(); });
      setCalendarRecords(recs);
    });
    return () => unsub();
  }, [calendarMember]);

  const handleLeaveAction = async (leave, action, note = '') => {
    try {
      await updateDoc(doc(db, 'attendance', leave.userId, 'leaves', leave.id), {
        status: action,
        adminNote: note,
        reviewedBy: adminUser.uid,
        reviewedAt: serverTimestamp(),
      });

      if (action === 'approved') {
        await setDoc(doc(db, 'attendance', leave.userId, 'records', leave.date), {
          checkInTime: null,
          checkOutTime: null,
          durationMinutes: 0,
          earlyCheckIn: false,
          lateByMinutes: 0,
          leftEarlyByMinutes: 0,
          status: 'on_leave',
          leaveType: leave.leaveType,
          markedByAdmin: true,
          adminNote: note,
        });
        await pushNotif(leave.userId, `Your leave for ${leave.date} has been approved! 🏖️`, 'leave_approved', '/attendance');
        toast.success('Leave approved');
      } else {
        await pushNotif(leave.userId, `Your leave for ${leave.date} was rejected. ${note}`, 'leave_rejected', '/attendance');
        toast.success('Leave rejected');
      }
    } catch (err) {
      toast.error('Failed: ' + err.message);
    }
  };

  const exportCSV = () => {
    const rows = [
      ['Date', 'Name', 'Check-in NPT', 'Check-out NPT', 'Duration (mins)', 'Status', 'Late By (mins)', 'Left Early By (mins)'],
      ...todayRecords.map(r => [
        today, r.userName,
        r.checkInTime ? formatNPT(r.checkInTime) : '',
        r.checkOutTime ? formatNPT(r.checkOutTime) : '',
        r.durationMinutes || 0,
        r.status || 'not checked in',
        r.lateByMinutes || 0,
        r.leftEarlyByMinutes || 0,
      ])
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${today}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported!');
  };

  const filteredLeaves = leaveRequests.filter(l => leaveFilter === 'all' || l.status === leaveFilter);

  // Calendar grid
  const CalendarGrid = () => {
    const now = getNPTTime();
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < (firstDay + 6) % 7; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    const getCellColor = (d) => {
      if (!d) return '';
      const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const rec = calendarRecords[key];
      if (!rec) return 'bg-gray-800/30';
      switch (rec.status) {
        case 'present': return 'bg-green-500/30 text-green-300';
        case 'late': return 'bg-yellow-500/30 text-yellow-300';
        case 'absent': return 'bg-red-500/30 text-red-300';
        case 'on_leave': return 'bg-blue-500/30 text-blue-300';
        case 'half_day': return 'bg-purple-500/30 text-purple-300';
        case 'left_early': return 'bg-orange-500/30 text-orange-300';
        default: return 'bg-gray-800/30';
      }
    };

    return (
      <div>
        <div className="grid grid-cols-7 gap-1 mb-1">
          {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
            <div key={d} className="text-center text-xs text-gray-500 py-1">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((d, i) => (
            <div key={i} className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${d ? getCellColor(d) + ' cursor-pointer hover:ring-1 hover:ring-blue-500/50' : ''}`}>
              {d}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 mt-4">
          {[
            { color: 'bg-green-500/30 text-green-300', label: 'Present' },
            { color: 'bg-yellow-500/30 text-yellow-300', label: 'Late' },
            { color: 'bg-red-500/30 text-red-300', label: 'Absent' },
            { color: 'bg-blue-500/30 text-blue-300', label: 'On Leave' },
            { color: 'bg-purple-500/30 text-purple-300', label: 'Half Day' },
            { color: 'bg-orange-500/30 text-orange-300', label: 'Left Early' },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded ${l.color}`} />
              <span className="text-xs text-gray-400">{l.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const tabs = ['today', 'leaves', 'calendar', 'export'];
  const tabLabels = { today: '📅 Today Live', leaves: '🏖️ Leave Requests', calendar: '📆 Monthly Calendar', export: '📊 Export & Stats' };

  return (
    <div className="space-y-5">
      {/* Tab bar */}
      <div className="flex bg-[#111827] border border-gray-800 rounded-xl p-1 overflow-x-auto">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 min-w-fit px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              tab === t ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >{tabLabels[t]}</button>
        ))}
      </div>

      {/* Today Live */}
      {tab === 'today' && (
        <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
            <h3 className="font-semibold text-white text-sm">Today — {today}</h3>
            <div className="flex items-center gap-1.5 text-xs text-green-400">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Live
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  {['Name', 'Status', 'Check-in', 'Check-out', 'Duration', 'Late By'].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 text-xs text-gray-500 font-semibold uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {todayRecords.map(r => {
                  const badge = getAttendanceBadge(r.checkInTime ? (r.checkOutTime ? 'checked_out' : r.status || 'present') : null);
                  return (
                    <tr key={r.userId} className="border-b border-gray-800/50 hover:bg-white/3 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {r.userPhoto ? (
                            <img src={r.userPhoto} alt={r.userName} className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                          ) : (
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 ${colorFromName(r.userName)}`}>
                              {avatarInitials(r.userName)}
                            </div>
                          )}
                          <div>
                            <p className="text-sm text-white font-medium">{r.userName}</p>
                            <p className="text-xs text-gray-500">{r.userRole}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge text-xs ${badge.cls}`}>{badge.label}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">
                        {r.checkInTime ? formatNPTTimeOnly(r.checkInTime) : '—'}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">
                        {r.checkOutTime ? formatNPTTimeOnly(r.checkOutTime) : r.checkInTime ? <span className="text-green-400 animate-pulse">Active</span> : '—'}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">
                        {r.durationMinutes > 0 ? `${Math.floor(r.durationMinutes / 60)}h ${r.durationMinutes % 60}m` :
                         r.checkInTime && !r.checkOutTime ? <LiveDuration checkInTime={r.checkInTime} /> : '—'}
                      </td>
                      <td className="px-4 py-3 text-xs">
                        {r.lateByMinutes > 0 ? <span className="text-yellow-400">{r.lateByMinutes}m late</span> : <span className="text-green-400">—</span>}
                      </td>
                    </tr>
                  );
                })}
                {todayRecords.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-10 text-gray-500 text-sm">No attendance data for today yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Leave Requests */}
      {tab === 'leaves' && (
        <div className="space-y-4">
          <div className="flex gap-2">
            {['pending', 'approved', 'rejected', 'all'].map(f => (
              <button key={f} onClick={() => setLeaveFilter(f)}
                className={`text-sm px-4 py-1.5 rounded-full transition-colors ${leaveFilter === f ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white border border-gray-700'}`}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {filteredLeaves.length === 0 ? (
            <EmptyState icon="🏖️" title="No leave requests" description="No leave requests match this filter." />
          ) : (
            <div className="space-y-3">
              {filteredLeaves.map(leave => (
                <LeaveRequestCard key={leave.id} leave={leave} onAction={handleLeaveAction} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Monthly Calendar */}
      {tab === 'calendar' && (
        <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-5">
            <label className="label mb-0">Member:</label>
            <select value={calendarMember} onChange={e => setCalendarMember(e.target.value)} className="input-field">
              {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
          <CalendarGrid />
        </div>
      )}

      {/* Export & Stats */}
      {tab === 'export' && (
        <div className="space-y-4">
          <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
            <h3 className="font-semibold text-white mb-4">Export Today's Attendance</h3>
            <button onClick={exportCSV} className="btn-primary">
              📥 Export CSV
            </button>
          </div>
          <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
            <h3 className="font-semibold text-white mb-4">Team Stats — Today</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Present', value: todayRecords.filter(r => r.checkInTime && r.status !== 'on_leave').length, color: 'text-green-400' },
                { label: 'On Leave', value: todayRecords.filter(r => r.status === 'on_leave').length, color: 'text-blue-400' },
                { label: 'Late', value: todayRecords.filter(r => r.lateByMinutes > 0).length, color: 'text-yellow-400' },
                { label: 'Not Checked In', value: users.length - todayRecords.filter(r => r.checkInTime || r.status === 'on_leave').length, color: 'text-red-400' },
              ].map(s => (
                <div key={s.label} className="bg-[#0d1526] rounded-xl p-4 text-center border border-gray-800">
                  <div className={`text-3xl font-heading font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-gray-500 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LiveDuration({ checkInTime }) {
  const [dur, setDur] = useState('');
  useEffect(() => {
    const tick = () => {
      const now = getNPTTime();
      const ci = new Date(checkInTime?.seconds ? checkInTime.seconds * 1000 : checkInTime);
      const mins = Math.floor((now - ci) / 60000);
      setDur(`${Math.floor(mins / 60)}h ${mins % 60}m`);
    };
    tick();
    const interval = setInterval(tick, 60000);
    return () => clearInterval(interval);
  }, [checkInTime]);
  return <span className="text-blue-400">{dur}</span>;
}

function LeaveRequestCard({ leave, onAction }) {
  const [rejectNote, setRejectNote] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [processing, setProcessing] = useState(false);

  const badgeConfig = {
    pending:  'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    approved: 'bg-green-500/20 text-green-400 border-green-500/30',
    rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  const handle = async (action) => {
    setProcessing(true);
    await onAction(leave, action, action === 'rejected' ? rejectNote : '');
    setProcessing(false);
    setShowRejectInput(false);
  };

  return (
    <div className="bg-[#111827] border border-gray-800 rounded-xl p-4">
      <div className="flex items-center gap-3 mb-3">
        {leave.userPhoto ? (
          <img src={leave.userPhoto} alt={leave.userName} className="w-9 h-9 rounded-full object-cover" />
        ) : (
          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold ${colorFromName(leave.userName)}`}>
            {avatarInitials(leave.userName)}
          </div>
        )}
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">{leave.userName}</p>
          <p className="text-xs text-gray-500">
            {LEAVE_TYPES.find(t => t.id === leave.leaveType)?.label} · {leave.date}
            {leave.submittedAt && ` · Applied ${formatNPT(leave.submittedAt)}`}
          </p>
        </div>
        <span className={`badge text-xs border ${badgeConfig[leave.status]}`}>
          {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
        </span>
      </div>

      <div className="bg-gray-800/50 rounded-xl p-3 mb-3">
        <p className="text-xs text-gray-500 mb-1">Reason</p>
        <p className="text-sm text-gray-300">{leave.reason}</p>
      </div>

      {leave.status === 'pending' && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <button onClick={() => handle('approved')} disabled={processing}
              className="flex-1 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-500/30 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
              ✅ Approve
            </button>
            <button onClick={() => setShowRejectInput(p => !p)}
              className="flex-1 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 rounded-lg text-sm font-medium transition-colors">
              ❌ Reject
            </button>
          </div>
          {showRejectInput && (
            <div className="space-y-2">
              <input value={rejectNote} onChange={e => setRejectNote(e.target.value)} placeholder="Rejection note (optional)..." className="input-field text-sm" />
              <button onClick={() => handle('rejected')} disabled={processing}
                className="btn-danger w-full text-sm">
                Confirm Rejection
              </button>
            </div>
          )}
        </div>
      )}
      {leave.adminNote && <p className="text-xs text-gray-500 mt-2">Admin note: {leave.adminNote}</p>}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Attendance() {
  const { user, userProfile, isAdmin } = useAuth();

  return (
    <div className="space-y-6 max-w-3xl animate-fade-in">
      <h1 className="text-xl font-heading font-bold text-white">🕐 Attendance & Check-in</h1>
      {isAdmin ? <AdminView /> : <MemberView user={user} userProfile={userProfile} />}
    </div>
  );
}
