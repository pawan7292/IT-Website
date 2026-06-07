import { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, onSnapshot, updateDoc, doc, writeBatch, limit } from 'firebase/firestore';
import { db } from '../../firebase';
import { formatNPT } from '../../utils/nptTime';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'notifications', user.uid, 'items'),
      orderBy('createdAt', 'desc'),
      limit(30)
    );
    const unsub = onSnapshot(q, (snap) => {
      setNotifications(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [user]);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const unread = notifications.filter(n => !n.read).length;

  const markAllRead = async () => {
    if (!user || unread === 0) return;
    const batch = writeBatch(db);
    notifications.filter(n => !n.read).forEach(n => {
      batch.update(doc(db, 'notifications', user.uid, 'items', n.id), { read: true });
    });
    await batch.commit();
  };

  const handleClick = async (notif) => {
    if (!notif.read) {
      await updateDoc(doc(db, 'notifications', user.uid, 'items', notif.id), { read: true });
    }
    if (notif.link) navigate(notif.link);
    setOpen(false);
  };

  const typeIcon = (type) => {
    switch (type) {
      case 'task_assigned': return '✅';
      case 'submission_approved': return '🎉';
      case 'revision_requested': return '🔁';
      case 'leave_approved': return '✅';
      case 'leave_rejected': return '❌';
      case 'new_submission': return '📤';
      case 'new_leave': return '🏖️';
      default: return '🔔';
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(p => !p)}
        className="relative p-2 rounded-lg hover:bg-white/5 transition-colors text-gray-400 hover:text-white"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center font-bold leading-none">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-80 bg-[#111827] border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-fade-in">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
            <h3 className="font-semibold text-white text-sm font-heading">Notifications</h3>
            {unread > 0 && (
              <button onClick={markAllRead} className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[340px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-10 text-center">
                <div className="text-4xl mb-2">🔔</div>
                <p className="text-gray-500 text-sm">No notifications yet</p>
              </div>
            ) : (
              notifications.map(notif => (
                <div
                  key={notif.id}
                  onClick={() => handleClick(notif)}
                  className={`flex gap-3 px-4 py-3 cursor-pointer hover:bg-white/5 border-b border-gray-700/40 transition-colors ${
                    !notif.read ? 'bg-blue-500/5' : ''
                  }`}
                >
                  <span className="text-lg flex-shrink-0 mt-0.5">{typeIcon(notif.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm leading-snug ${notif.read ? 'text-gray-400' : 'text-gray-200'}`}>
                      {notif.message}
                    </p>
                    {notif.createdAt && (
                      <p className="text-xs text-gray-600 mt-1">
                        {formatNPT(notif.createdAt)}
                      </p>
                    )}
                  </div>
                  {!notif.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
