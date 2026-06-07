import { useState, useEffect, useRef } from 'react';
import {
  collection, query, where, orderBy, onSnapshot,
  addDoc, updateDoc, doc, serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import useAuth from '../hooks/useAuth';
import { formatNPT } from '../utils/nptTime';
import { formatFileSize, getFileIcon, avatarInitials, colorFromName } from '../utils/helpers';
import { CardSkeleton } from '../components/shared/LoadingSpinner';
import EmptyState from '../components/shared/EmptyState';
import toast from 'react-hot-toast';

async function pushNotif(uid, message, type, link) {
  await addDoc(collection(db, 'notifications', uid, 'items'), {
    message, type, read: false, link: link || null, createdAt: serverTimestamp(),
  });
}
async function logActivity(type, uid, userName, message) {
  await addDoc(collection(db, 'activity'), { type, uid, userName, message, createdAt: serverTimestamp() });
}

const STATUS_CONFIG = {
  pending:           { label: '⏳ Pending Review', cls: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' },
  approved:          { label: '✅ Approved',        cls: 'bg-green-500/20 text-green-400 border border-green-500/30' },
  revision_requested:{ label: '🔁 Revision Needed', cls: 'bg-orange-500/20 text-orange-400 border border-orange-500/30' },
};

// ─── Submit Modal ─────────────────────────────────────────────────────────────
function SubmitModal({ task, existingSub, onClose, currentUser, userProfile }) {
  const isResubmit = !!existingSub;
  const [form, setForm] = useState({ workTitle: existingSub?.workTitle || '', notes: '' });
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => setFiles(p => [...p, ...Array.from(e.target.files || [])]);

  const handleSubmit = async () => {
    if (!form.workTitle.trim()) { toast.error('Work title is required'); return; }
    if (!files.length) { toast.error('Please upload at least one file'); return; }
    setSubmitting(true);
    try {
      const uploaded = [];
      for (const file of files) {
        const ts = Date.now();
        const sRef = ref(storage, `submissions/${task?.id || 'general'}/${currentUser.uid}/${ts}_${file.name}`);
        await new Promise((resolve, reject) => {
          const uploadTask = uploadBytesResumable(sRef, file);
          uploadTask.on('state_changed',
            (snap) => setProgress(p => ({ ...p, [file.name]: Math.round((snap.bytesTransferred / snap.totalBytes) * 100) })),
            reject,
            async () => {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              uploaded.push({ fileName: file.name, fileURL: url, fileSize: file.size, uploadedAt: new Date().toISOString() });
              resolve();
            }
          );
        });
      }

      if (isResubmit) {
        const prevVersions = existingSub.versions || [];
        const newVersion = { versionNum: prevVersions.length + 1, files: uploaded, submittedAt: new Date().toISOString(), notes: form.notes.trim() };
        await updateDoc(doc(db, 'submissions', existingSub.id), {
          files: uploaded,
          notes: form.notes.trim(),
          status: 'pending',
          adminComment: '',
          versions: [...prevVersions, newVersion],
          submittedAt: serverTimestamp(),
        });
        toast.success('Resubmission sent! 🔁');
      } else {
        await addDoc(collection(db, 'submissions'), {
          taskId: task?.id || null,
          taskTitle: task?.title || 'General Submission',
          submittedBy: currentUser.uid,
          submittedByName: userProfile?.name || currentUser.email,
          submittedByPhoto: userProfile?.profilePhoto || '',
          workTitle: form.workTitle.trim(),
          notes: form.notes.trim(),
          files: uploaded,
          status: 'pending',
          adminComment: '',
          versions: [{ versionNum: 1, files: uploaded, submittedAt: new Date().toISOString(), notes: form.notes.trim() }],
          submittedAt: serverTimestamp(),
        });
        if (task?.id) {
          const { updateDoc: upd, doc: d } = await import('firebase/firestore');
          await updateDoc(doc(db, 'tasks', task.id), { status: 'under_review', updatedAt: serverTimestamp() });
        }
        await logActivity('submission', currentUser.uid, userProfile?.name || 'User', `Submitted work for: ${task?.title || 'a task'}`);
        toast.success('Work submitted! 🎉');
      }
      onClose();
    } catch (err) {
      toast.error('Submission failed: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-[#111827] border border-gray-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-700">
          <h2 className="font-heading font-bold text-white">{isResubmit ? '🔁 Re-submit Work' : '📤 Submit Work'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl">×</button>
        </div>
        <div className="p-5 space-y-4">
          {task && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
              <p className="text-xs text-gray-400">Task: <span className="text-blue-400 font-medium">{task.title}</span></p>
            </div>
          )}
          {isResubmit && existingSub?.adminComment && (
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3">
              <p className="text-xs text-orange-400 font-semibold mb-1">Admin's Revision Note:</p>
              <p className="text-sm text-gray-300">{existingSub.adminComment}</p>
            </div>
          )}
          <div>
            <label className="label">Work Title <span className="text-red-400">*</span></label>
            <input value={form.workTitle} onChange={e => setForm(p => ({ ...p, workTitle: e.target.value }))} placeholder="e.g. SEO Blog Draft v2" className="input-field" />
          </div>
          <div>
            <label className="label">Notes / What changed</label>
            <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="Context for the reviewer..." rows={3} className="input-field resize-none" />
          </div>
          <div>
            <label className="label">Work Files <span className="text-red-400">*</span></label>
            <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-gray-600 hover:border-blue-500 rounded-xl p-5 text-center cursor-pointer transition-colors">
              <div className="text-2xl mb-1">📁</div>
              <p className="text-gray-400 text-sm">Click to select deliverables</p>
              <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileSelect} />
            </div>
            {files.length > 0 && (
              <div className="mt-2 space-y-1.5">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-2">
                    <span>{getFileIcon(f.name)}</span>
                    <span className="flex-1 text-xs text-gray-300 truncate">{f.name}</span>
                    <span className="text-xs text-gray-600">{formatFileSize(f.size)}</span>
                    {progress[f.name] !== undefined && (
                      <div className="w-16 h-1 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 transition-all" style={{ width: `${progress[f.name]}%` }} />
                      </div>
                    )}
                    {!submitting && <button onClick={() => setFiles(p => p.filter((_, j) => j !== i))} className="text-gray-600 hover:text-red-400 text-base">×</button>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-3 p-5 border-t border-gray-700">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button onClick={handleSubmit} disabled={submitting} className="btn-primary flex-1">
            {submitting ? 'Submitting...' : isResubmit ? '🔁 Re-submit' : '📤 Submit Work'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Admin Review Modal ───────────────────────────────────────────────────────
function ReviewModal({ sub, onClose }) {
  const [action, setAction] = useState(null);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  const handleAction = async (status) => {
    setSaving(true);
    try {
      await updateDoc(doc(db, 'submissions', sub.id), {
        status,
        adminComment: note.trim(),
        adminReviewedAt: serverTimestamp(),
      });

      let notifMsg, notifType;
      if (status === 'approved') {
        notifMsg = `Your submission "${sub.workTitle}" has been approved! 🎉`;
        notifType = 'submission_approved';
      } else {
        notifMsg = `Revision requested on "${sub.workTitle}": ${note.trim()}`;
        notifType = 'revision_requested';
      }
      await pushNotif(sub.submittedBy, notifMsg, notifType, '/submissions');
      toast.success(status === 'approved' ? 'Submission approved!' : 'Revision requested');
      onClose();
    } catch (err) {
      toast.error('Failed: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-[#111827] border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-700">
          <h2 className="font-heading font-bold text-white">Review Submission</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl">×</button>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${colorFromName(sub.submittedByName)}`}>
              {avatarInitials(sub.submittedByName)}
            </div>
            <div>
              <p className="font-semibold text-white">{sub.submittedByName}</p>
              <p className="text-xs text-gray-500">{sub.taskTitle} · {formatNPT(sub.submittedAt)}</p>
            </div>
            <span className={`ml-auto badge text-xs ${STATUS_CONFIG[sub.status]?.cls}`}>{STATUS_CONFIG[sub.status]?.label}</span>
          </div>

          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Work Title</p>
            <p className="text-white font-semibold">{sub.workTitle}</p>
          </div>
          {sub.notes && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Notes</p>
              <p className="text-gray-300 text-sm">{sub.notes}</p>
            </div>
          )}

          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Submitted Files</p>
            <div className="space-y-2">
              {(sub.files || []).map((f, i) => (
                <a key={i} href={f.fileURL} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-gray-800 hover:bg-gray-700 rounded-lg px-3 py-2.5 transition-colors group">
                  <span className="text-xl">{getFileIcon(f.fileName)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-200 truncate group-hover:text-white">{f.fileName}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(f.fileSize)}</p>
                  </div>
                  <span className="text-blue-400 text-sm">↓ Download</span>
                </a>
              ))}
            </div>
          </div>

          {/* Version history */}
          {sub.versions?.length > 1 && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Version History ({sub.versions.length} versions)</p>
              <div className="space-y-2">
                {sub.versions.map((v, i) => (
                  <div key={i} className="bg-gray-800/50 rounded-lg px-3 py-2 text-sm">
                    <span className="text-blue-400 font-medium">v{v.versionNum}</span>
                    <span className="text-gray-500 text-xs ml-2">{v.submittedAt ? new Date(v.submittedAt).toLocaleDateString() : ''}</span>
                    <span className="text-gray-500 text-xs ml-2">· {v.files?.length || 0} file(s)</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          {sub.status === 'pending' && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <button
                  onClick={() => setAction('approve')}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                    action === 'approve' ? 'bg-green-600 text-white border-green-600' : 'bg-green-600/20 text-green-400 border-green-500/30 hover:bg-green-600/30'
                  }`}
                >✅ Approve</button>
                <button
                  onClick={() => setAction('revision')}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                    action === 'revision' ? 'bg-orange-600 text-white border-orange-600' : 'bg-orange-600/20 text-orange-400 border-orange-500/30 hover:bg-orange-600/30'
                  }`}
                >🔁 Request Revision</button>
              </div>
              {action === 'revision' && (
                <textarea
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Explain what needs to be revised..."
                  rows={3}
                  className="input-field resize-none"
                />
              )}
              {action && (
                <button
                  onClick={() => handleAction(action === 'approve' ? 'approved' : 'revision_requested')}
                  disabled={saving || (action === 'revision' && !note.trim())}
                  className="btn-primary w-full"
                >
                  {saving ? 'Saving...' : 'Confirm Action'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Submission Card ──────────────────────────────────────────────────────────
function SubmissionCard({ sub, isAdmin, onReview, onResubmit }) {
  const [expanded, setExpanded] = useState(false);
  const sc = STATUS_CONFIG[sub.status] || STATUS_CONFIG.pending;

  return (
    <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden hover:border-gray-600 transition-colors">
      <div
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setExpanded(p => !p)}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {isAdmin && (
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${colorFromName(sub.submittedByName)}`}>
              {avatarInitials(sub.submittedByName)}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{sub.workTitle}</p>
            <p className="text-xs text-gray-500 truncate">
              {isAdmin ? sub.submittedByName + ' · ' : ''}{sub.taskTitle} · {formatNPT(sub.submittedAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
          <span className={`badge text-xs ${sc.cls}`}>{sc.label}</span>
          <span className="text-gray-500">{expanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-800 p-4 space-y-3">
          {sub.notes && (
            <div>
              <p className="text-xs text-gray-500 mb-1">Notes</p>
              <p className="text-sm text-gray-300">{sub.notes}</p>
            </div>
          )}

          <div>
            <p className="text-xs text-gray-500 mb-1.5">Files ({sub.files?.length || 0})</p>
            <div className="space-y-1.5">
              {(sub.files || []).map((f, i) => (
                <a key={i} href={f.fileURL} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 rounded-lg px-2.5 py-2 transition-colors group text-xs">
                  <span>{getFileIcon(f.fileName)}</span>
                  <span className="flex-1 text-gray-300 group-hover:text-white truncate">{f.fileName}</span>
                  <span className="text-gray-600">{formatFileSize(f.fileSize)}</span>
                  <span className="text-blue-400">↓</span>
                </a>
              ))}
            </div>
          </div>

          {sub.adminComment && (
            <div className={`rounded-xl p-3 ${sub.status === 'revision_requested' ? 'bg-orange-500/10 border border-orange-500/20' : 'bg-green-500/10 border border-green-500/20'}`}>
              <p className="text-xs font-semibold text-gray-400 mb-1">Admin Comment</p>
              <p className="text-sm text-gray-300">{sub.adminComment}</p>
            </div>
          )}

          {isAdmin && sub.status === 'pending' && (
            <button onClick={() => onReview(sub)} className="btn-primary w-full text-sm">
              Review Submission
            </button>
          )}
          {!isAdmin && sub.status === 'revision_requested' && (
            <button onClick={() => onResubmit(sub)} className="w-full py-2 bg-orange-600/20 hover:bg-orange-600/30 text-orange-400 border border-orange-500/30 rounded-xl text-sm font-medium transition-colors">
              🔁 Re-submit Work
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Submissions Page ────────────────────────────────────────────────────
export default function Submissions() {
  const { user, userProfile, isAdmin } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [resubSub, setResubSub] = useState(null);
  const [reviewSub, setReviewSub] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');

  const currentUser = { uid: user?.uid, email: user?.email };

  useEffect(() => {
    if (!user) return;
    let q;
    if (isAdmin) {
      q = query(collection(db, 'submissions'), orderBy('submittedAt', 'desc'));
    } else {
      q = query(collection(db, 'submissions'), where('submittedBy', '==', user.uid), orderBy('submittedAt', 'desc'));
    }
    const unsub = onSnapshot(q, snap => {
      setSubmissions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, [user, isAdmin]);

  useEffect(() => {
    if (!user || isAdmin) return;
    const q = query(collection(db, 'tasks'), where('assignedTo', '==', user.uid), where('status', '==', 'in_progress'));
    const unsub = onSnapshot(q, snap => setMyTasks(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => unsub();
  }, [user, isAdmin]);

  const filtered = submissions.filter(s => !filterStatus || s.status === filterStatus);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-heading font-bold text-white">📤 Work Submissions</h1>
        {!isAdmin && (
          <button onClick={() => { setSelectedTask(null); setShowModal(true); }} className="btn-primary">
            + New Submission
          </button>
        )}
      </div>

      {/* In-progress tasks for members */}
      {!isAdmin && myTasks.length > 0 && (
        <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
          <h2 className="font-heading font-semibold text-white mb-3">Your In-Progress Tasks</h2>
          <div className="space-y-2">
            {myTasks.map(task => (
              <div key={task.id} className="flex items-center justify-between bg-gray-800/50 rounded-xl px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-white">{task.title}</p>
                  <p className="text-xs text-gray-500">Due: {task.dueDate ? new Date(task.dueDate?.seconds ? task.dueDate.seconds * 1000 : task.dueDate).toLocaleDateString() : 'No due date'}</p>
                </div>
                <button
                  onClick={() => { setSelectedTask(task); setShowModal(true); }}
                  className="text-sm px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-lg transition-colors"
                >
                  📤 Submit Work
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-gray-500">Filter:</span>
        {['', 'pending', 'approved', 'revision_requested'].map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
              filterStatus === s ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white border border-gray-700'
            }`}
          >
            {s === '' ? 'All' : STATUS_CONFIG[s]?.label || s}
          </button>
        ))}
      </div>

      {/* Submissions list */}
      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <CardSkeleton key={i} lines={3} />)}</div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="📤"
          title={isAdmin ? "No submissions yet" : "You haven't submitted any work yet"}
          description={isAdmin ? "Team members haven't submitted any work yet." : "Use the 'Submit Work' button on a task or above to submit your deliverables."}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map(sub => (
            <SubmissionCard
              key={sub.id}
              sub={sub}
              isAdmin={isAdmin}
              onReview={(s) => setReviewSub(s)}
              onResubmit={(s) => setResubSub(s)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {showModal && (
        <SubmitModal
          task={selectedTask}
          onClose={() => { setShowModal(false); setSelectedTask(null); }}
          currentUser={currentUser}
          userProfile={userProfile}
        />
      )}
      {resubSub && (
        <SubmitModal
          task={{ id: resubSub.taskId, title: resubSub.taskTitle }}
          existingSub={resubSub}
          onClose={() => setResubSub(null)}
          currentUser={currentUser}
          userProfile={userProfile}
        />
      )}
      {reviewSub && (
        <ReviewModal sub={reviewSub} onClose={() => setReviewSub(null)} />
      )}
    </div>
  );
}
