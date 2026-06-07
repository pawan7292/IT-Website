import { useState, useEffect, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {
  collection, query, where, orderBy, onSnapshot,
  addDoc, updateDoc, deleteDoc, doc, serverTimestamp,
  arrayUnion, getDoc
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import useAuth from '../hooks/useAuth';
import { formatNPT, getNPTDateString } from '../utils/nptTime';
import {
  getPriorityConfig, getStatusConfig, TASK_COLUMNS, PRIORITIES,
  formatFileSize, getFileIcon, avatarInitials, colorFromName
} from '../utils/helpers';
import { CardSkeleton } from '../components/shared/LoadingSpinner';
import EmptyState from '../components/shared/EmptyState';
import { FileChip } from '../components/shared/FileUpload';
import toast from 'react-hot-toast';

// ─── Notification helper ────────────────────────────────────────────────────
async function pushNotif(uid, message, type, link) {
  await addDoc(collection(db, 'notifications', uid, 'items'), {
    message, type, read: false, link: link || null, createdAt: serverTimestamp(),
  });
}
async function logActivity(type, uid, userName, message) {
  await addDoc(collection(db, 'activity'), { type, uid, userName, message, createdAt: serverTimestamp() });
}

// ─── Task Card ───────────────────────────────────────────────────────────────
function TaskCard({ task, index, isAdmin, currentUser, onEdit, onDelete, onComment, onOpenSubmit }) {
  const [expanded, setExpanded] = useState(false);
  const [comment, setComment] = useState('');
  const [commenting, setCommenting] = useState(false);
  const pc = getPriorityConfig(task.priority);
  const sc = getStatusConfig(task.status);
  const isAssigned = task.assignedTo === currentUser.uid;

  const statusOptions = TASK_COLUMNS.map(c => c.id);

  const handleStatusChange = async (newStatus) => {
    try {
      await updateDoc(doc(db, 'tasks', task.id), { status: newStatus, updatedAt: serverTimestamp() });
      if (newStatus === 'completed') {
        await logActivity('task_completed', currentUser.uid, currentUser.displayName || 'User', `Completed task: ${task.title}`);
      }
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update status');
    }
  };

  const submitComment = async () => {
    if (!comment.trim()) return;
    setCommenting(true);
    try {
      const newComment = {
        uid: currentUser.uid,
        name: currentUser.displayName || currentUser.email,
        text: comment.trim(),
        createdAt: new Date().toISOString(),
      };
      await updateDoc(doc(db, 'tasks', task.id), { comments: arrayUnion(newComment) });
      setComment('');
      toast.success('Comment added');
    } catch {
      toast.error('Failed to add comment');
    } finally {
      setCommenting(false);
    }
  };

  const dueDate = task.dueDate ? new Date(task.dueDate?.seconds ? task.dueDate.seconds * 1000 : task.dueDate) : null;
  const isOverdue = dueDate && dueDate < new Date() && task.status !== 'completed';

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-[#111827] border rounded-xl p-3.5 mb-2.5 cursor-grab select-none transition-all ${
            snapshot.isDragging
              ? 'border-blue-500 shadow-lg shadow-blue-500/20 rotate-1 scale-105'
              : 'border-gray-800 hover:border-gray-600'
          }`}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-sm font-semibold text-white leading-snug flex-1">{task.title}</h3>
            <span className={`badge text-[10px] flex-shrink-0 ${pc.color}`}>{pc.label}</span>
          </div>

          {/* Description */}
          {task.description && (
            <p className="text-xs text-gray-500 mb-2.5 line-clamp-2">{task.description}</p>
          )}

          {/* Assignee + Due */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <div className="flex items-center gap-1.5">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${colorFromName(task.assignedToName)}`}>
                {avatarInitials(task.assignedToName)}
              </div>
              <span className="truncate max-w-[80px]">{task.assignedToName}</span>
            </div>
            {dueDate && (
              <span className={isOverdue ? 'text-red-400 font-medium' : ''}>
                {isOverdue && '⚠️ '}
                {dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            )}
          </div>

          {/* Reference files count */}
          {task.referenceFiles?.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
              <span>📎</span>
              <span>{task.referenceFiles.length} file{task.referenceFiles.length > 1 ? 's' : ''} attached</span>
            </div>
          )}

          {/* Expand button */}
          <button
            onClick={() => setExpanded(p => !p)}
            className="w-full text-xs text-gray-600 hover:text-blue-400 transition-colors text-left"
          >
            {expanded ? '▲ Less' : '▼ Details & Comments'}
          </button>

          {/* Expanded */}
          {expanded && (
            <div className="mt-3 pt-3 border-t border-gray-800 space-y-3">
              {/* Status changer (for assignee) */}
              {(isAssigned || isAdmin) && (
                <div>
                  <p className="text-xs text-gray-500 mb-1.5">Update Status</p>
                  <div className="flex flex-wrap gap-1">
                    {TASK_COLUMNS.map(col => (
                      <button
                        key={col.id}
                        onClick={() => handleStatusChange(col.id)}
                        className={`text-[10px] px-2 py-1 rounded-full transition-colors ${
                          task.status === col.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                      >
                        {col.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Reference files */}
              {task.referenceFiles?.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-1.5">Reference Files</p>
                  <div className="space-y-1">
                    {task.referenceFiles.map((f, i) => (
                      <a key={i} href={f.fileURL} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 bg-gray-800 rounded-lg px-2 py-1.5"
                      >
                        <span>{getFileIcon(f.fileName)}</span>
                        <span className="truncate flex-1">{f.fileName}</span>
                        <span className="text-gray-600">{formatFileSize(f.fileSize)}</span>
                        <span>↓</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Comments */}
              <div>
                <p className="text-xs text-gray-500 mb-1.5">Comments ({task.comments?.length || 0})</p>
                <div className="space-y-2 max-h-32 overflow-y-auto mb-2">
                  {(task.comments || []).map((c, i) => (
                    <div key={i} className="bg-gray-800/50 rounded-lg px-2.5 py-2">
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white ${colorFromName(c.name)}`}>
                          {avatarInitials(c.name)}
                        </div>
                        <span className="text-[10px] font-medium text-gray-300">{c.name}</span>
                        <span className="text-[10px] text-gray-600 ml-auto">
                          {c.createdAt ? new Date(c.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : ''}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">{c.text}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-1.5">
                  <input
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && submitComment()}
                    placeholder="Add comment..."
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-xs text-gray-200 placeholder-gray-600 focus:border-blue-500 outline-none"
                  />
                  <button onClick={submitComment} disabled={commenting} className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs transition-colors disabled:opacity-50">
                    Send
                  </button>
                </div>
              </div>

              {/* Submit work button (only for assignee) */}
              {isAssigned && task.status === 'in_progress' && (
                <button
                  onClick={() => onOpenSubmit(task)}
                  className="w-full py-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-lg text-xs font-medium border border-green-500/30 transition-colors"
                >
                  📤 Submit Work ↑
                </button>
              )}

              {/* Admin controls */}
              {isAdmin && (
                <div className="flex gap-1.5">
                  <button onClick={() => onEdit(task)} className="flex-1 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg text-xs border border-blue-500/30 transition-colors">
                    ✏️ Edit
                  </button>
                  <button onClick={() => onDelete(task)} className="flex-1 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg text-xs border border-red-500/30 transition-colors">
                    🗑️ Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}

// ─── Task Modal ───────────────────────────────────────────────────────────────
function TaskModal({ task, onClose, users, currentUser }) {
  const isEditing = !!task?.id;
  const [form, setForm] = useState({
    title: task?.title || '',
    description: task?.description || '',
    assignedTo: task?.assignedTo || '',
    assignedToName: task?.assignedToName || '',
    priority: task?.priority || 'medium',
    status: task?.status || 'todo',
    dueDate: task?.dueDate
      ? new Date(task.dueDate?.seconds ? task.dueDate.seconds * 1000 : task.dueDate).toISOString().slice(0, 16)
      : '',
  });
  const [refFiles, setRefFiles] = useState(task?.referenceFiles || []);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const set = (field) => (e) => {
    const val = e.target.value;
    setForm(p => {
      const next = { ...p, [field]: val };
      if (field === 'assignedTo') {
        const u = users.find(u => u.id === val);
        next.assignedToName = u ? u.name : '';
      }
      return next;
    });
    setErrors(p => ({ ...p, [field]: '' }));
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    const newFiles = [];
    for (const file of files) {
      const ts = Date.now();
      const sRef = ref(storage, `tasks/temp/${ts}_${file.name}`);
      await new Promise((resolve, reject) => {
        const task = uploadBytesResumable(sRef, file);
        task.on('state_changed',
          (snap) => setUploadProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
          reject,
          async () => {
            const url = await getDownloadURL(task.snapshot.ref);
            newFiles.push({ fileName: file.name, fileURL: url, fileSize: file.size, uploadedAt: new Date().toISOString() });
            resolve();
          }
        );
      });
    }
    setRefFiles(p => [...p, ...newFiles]);
    setUploading(false);
    setUploadProgress(0);
    toast.success(`${newFiles.length} file(s) uploaded`);
    e.target.value = '';
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.assignedTo)   errs.assignedTo = 'Please assign to a team member';
    return errs;
  };

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSaving(true);
    try {
      const data = {
        title: form.title.trim(),
        description: form.description.trim(),
        assignedTo: form.assignedTo,
        assignedToName: form.assignedToName,
        priority: form.priority,
        status: form.status,
        dueDate: form.dueDate ? new Date(form.dueDate) : null,
        referenceFiles: refFiles,
        updatedAt: serverTimestamp(),
      };
      if (isEditing) {
        await updateDoc(doc(db, 'tasks', task.id), data);
        toast.success('Task updated');
      } else {
        data.assignedBy = currentUser.uid;
        data.createdAt = serverTimestamp();
        data.comments = [];
        const docRef = await addDoc(collection(db, 'tasks'), data);
        await pushNotif(form.assignedTo, `You've been assigned a new task: "${form.title}"`, 'task_assigned', '/tasks');
        await logActivity('task_created', currentUser.uid, currentUser.displayName || 'Admin', `Assigned task "${form.title}" to ${form.assignedToName}`);
        toast.success('Task created');
      }
      onClose();
    } catch (err) {
      toast.error('Failed to save task: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-[#111827] border border-gray-700 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-700">
          <h2 className="font-heading font-bold text-white">{isEditing ? 'Edit Task' : 'Create New Task'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors text-xl">×</button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="label">Title <span className="text-red-400">*</span></label>
            <input value={form.title} onChange={set('title')} placeholder="Task title" className="input-field" />
            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="label">Description</label>
            <textarea value={form.description} onChange={set('description')} placeholder="Detailed instructions for the team member..." rows={4} className="input-field resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Assign To <span className="text-red-400">*</span></label>
              <select value={form.assignedTo} onChange={set('assignedTo')} className="input-field">
                <option value="">Select member</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
              {errors.assignedTo && <p className="text-red-400 text-xs mt-1">{errors.assignedTo}</p>}
            </div>
            <div>
              <label className="label">Priority</label>
              <select value={form.priority} onChange={set('priority')} className="input-field">
                {PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Status</label>
              <select value={form.status} onChange={set('status')} className="input-field">
                {TASK_COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Due Date & Time</label>
              <input type="datetime-local" value={form.dueDate} onChange={set('dueDate')} className="input-field" />
            </div>
          </div>

          {/* Reference files */}
          <div>
            <label className="label">Reference Files (briefs, assets)</label>
            <div className="space-y-2">
              {refFiles.map((f, i) => (
                <div key={i} className="flex items-center gap-2 bg-gray-800/50 rounded-lg px-3 py-2">
                  <span>{getFileIcon(f.fileName)}</span>
                  <a href={f.fileURL} target="_blank" rel="noopener noreferrer" className="flex-1 text-xs text-blue-400 hover:text-blue-300 truncate">{f.fileName}</a>
                  <span className="text-xs text-gray-600">{formatFileSize(f.fileSize)}</span>
                  <button onClick={() => setRefFiles(p => p.filter((_, j) => j !== i))} className="text-gray-600 hover:text-red-400 transition-colors text-base">×</button>
                </div>
              ))}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-700 hover:border-blue-500 rounded-xl p-4 text-center cursor-pointer transition-colors"
              >
                {uploading ? (
                  <div>
                    <p className="text-blue-400 text-sm">{uploadProgress}%</p>
                    <div className="h-1 bg-gray-700 rounded-full mt-2"><div className="h-full bg-blue-500 transition-all" style={{ width: `${uploadProgress}%` }} /></div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">📎 Click to attach reference files</p>
                )}
                <input ref={fileInputRef} type="file" multiple className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip,.mp4,.xlsx,.xls"
                  onChange={handleFileUpload} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-5 border-t border-gray-700">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">
            {saving ? 'Saving...' : isEditing ? 'Update Task' : 'Create Task'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Submit Work Modal ────────────────────────────────────────────────────────
function SubmitWorkModal({ task, onClose, currentUser, userProfile }) {
  const [form, setForm] = useState({ workTitle: '', notes: '' });
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => setFiles(p => [...p, ...Array.from(e.target.files)]);

  const handleSubmit = async () => {
    if (!form.workTitle.trim()) { toast.error('Work title is required'); return; }
    if (files.length === 0) { toast.error('Please upload at least one work file'); return; }
    setSubmitting(true);
    try {
      const uploadedFiles = [];
      setUploading(true);
      for (const file of files) {
        const ts = Date.now();
        const sRef = ref(storage, `submissions/${task.id}/${currentUser.uid}/${ts}_${file.name}`);
        await new Promise((resolve, reject) => {
          const uploadTask = uploadBytesResumable(sRef, file);
          uploadTask.on('state_changed',
            (snap) => setProgress(p => ({ ...p, [file.name]: Math.round((snap.bytesTransferred / snap.totalBytes) * 100) })),
            reject,
            async () => {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              uploadedFiles.push({ fileName: file.name, fileURL: url, fileSize: file.size, uploadedAt: new Date().toISOString() });
              resolve();
            }
          );
        });
      }
      setUploading(false);

      const subData = {
        taskId: task.id,
        taskTitle: task.title,
        submittedBy: currentUser.uid,
        submittedByName: userProfile?.name || currentUser.email,
        submittedByPhoto: userProfile?.profilePhoto || '',
        workTitle: form.workTitle.trim(),
        notes: form.notes.trim(),
        files: uploadedFiles,
        status: 'pending',
        adminComment: '',
        versions: [{
          versionNum: 1,
          files: uploadedFiles,
          submittedAt: new Date().toISOString(),
          notes: form.notes.trim(),
        }],
        submittedAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'submissions'), subData);
      await updateDoc(doc(db, 'tasks', task.id), { status: 'under_review', updatedAt: serverTimestamp() });

      // Notify admin
      const adminEmails = ['mainaliaayush02@gmail.com', 'techdigitalmarmat@gmail.com'];
      // Log activity
      await logActivity('submission', currentUser.uid, userProfile?.name || 'User', `Submitted work for: ${task.title}`);

      toast.success('Work submitted successfully! 🎉');
      onClose();
    } catch (err) {
      toast.error('Failed to submit: ' + err.message);
      setUploading(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-[#111827] border border-gray-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-700">
          <h2 className="font-heading font-bold text-white">📤 Submit Work</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl">×</button>
        </div>
        <div className="p-5 space-y-4">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
            <p className="text-xs text-gray-400">Task: <span className="text-blue-400 font-medium">{task?.title}</span></p>
          </div>
          <div>
            <label className="label">Work Title <span className="text-red-400">*</span></label>
            <input value={form.workTitle} onChange={e => setForm(p => ({ ...p, workTitle: e.target.value }))} placeholder="e.g. SEO Blog Draft v1" className="input-field" />
          </div>
          <div>
            <label className="label">Notes / Description</label>
            <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="What did you do? Any context for the admin..." rows={3} className="input-field resize-none" />
          </div>
          <div>
            <label className="label">Work Files <span className="text-red-400">*</span></label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-600 hover:border-blue-500 rounded-xl p-6 text-center cursor-pointer transition-colors"
            >
              <div className="text-3xl mb-2">📁</div>
              <p className="text-gray-400 text-sm">Click to select your deliverable files</p>
              <p className="text-gray-600 text-xs mt-1">PDF, DOCX, XLSX, JPG, PNG, ZIP, MP4, PSD</p>
              <input ref={fileInputRef} type="file" multiple className="hidden"
                accept=".pdf,.doc,.docx,.xlsx,.xls,.jpg,.jpeg,.png,.zip,.mp4,.psd"
                onChange={handleFileSelect} />
            </div>
            {files.length > 0 && (
              <div className="mt-2 space-y-1.5">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-2">
                    <span className="text-sm">{getFileIcon(f.name)}</span>
                    <span className="flex-1 text-xs text-gray-300 truncate">{f.name}</span>
                    <span className="text-xs text-gray-600">{formatFileSize(f.size)}</span>
                    {progress[f.name] !== undefined && (
                      <div className="w-16 h-1 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 transition-all" style={{ width: `${progress[f.name]}%` }} />
                      </div>
                    )}
                    {!uploading && <button onClick={() => setFiles(p => p.filter((_, j) => j !== i))} className="text-gray-600 hover:text-red-400 text-base">×</button>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-3 p-5 border-t border-gray-700">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button onClick={handleSubmit} disabled={submitting || uploading} className="btn-primary flex-1">
            {submitting ? 'Submitting...' : '📤 Submit Work'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Tasks Page ──────────────────────────────────────────────────────────
export default function Tasks() {
  const { user, userProfile, isAdmin } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('kanban');
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [submitTask, setSubmitTask] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filter, setFilter] = useState({ assignee: '', status: '', priority: '' });

  useEffect(() => {
    // Load users
    const unsub = onSnapshot(collection(db, 'users'), (snap) => {
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return;
    let q;
    if (isAdmin) {
      q = query(collection(db, 'tasks'), orderBy('createdAt', 'desc'));
    } else {
      q = query(collection(db, 'tasks'), where('assignedTo', '==', user.uid), orderBy('createdAt', 'desc'));
    }
    const unsub = onSnapshot(q, (snap) => {
      setTasks(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, [user, isAdmin]);

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    const newStatus = destination.droppableId;
    const task = tasks.find(t => t.id === draggableId);
    if (!task || task.status === newStatus) return;
    try {
      await updateDoc(doc(db, 'tasks', draggableId), { status: newStatus, updatedAt: serverTimestamp() });
      if (newStatus === 'completed') {
        await logActivity('task_completed', user.uid, userProfile?.name || 'User', `Completed task: ${task.title}`);
      }
    } catch {
      toast.error('Failed to move task');
    }
  };

  const handleDelete = async (task) => {
    try {
      await deleteDoc(doc(db, 'tasks', task.id));
      toast.success('Task deleted');
    } catch {
      toast.error('Failed to delete task');
    }
    setDeleteConfirm(null);
  };

  const filteredTasks = tasks.filter(t => {
    if (filter.assignee && t.assignedTo !== filter.assignee) return false;
    if (filter.status && t.status !== filter.status) return false;
    if (filter.priority && t.priority !== filter.priority) return false;
    return true;
  });

  const tasksByStatus = TASK_COLUMNS.reduce((acc, col) => {
    acc[col.id] = filteredTasks.filter(t => t.status === col.id);
    return acc;
  }, {});

  const currentUser = { uid: user?.uid, email: user?.email, displayName: userProfile?.name };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-heading font-bold text-white">✅ Task Management</h1>
        <div className="flex items-center gap-2">
          <div className="flex bg-[#1f2937] rounded-lg p-0.5 border border-gray-700">
            <button onClick={() => setView('kanban')} className={`px-3 py-1.5 rounded-md text-sm transition-colors ${view === 'kanban' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}>
              📋 Kanban
            </button>
            <button onClick={() => setView('list')} className={`px-3 py-1.5 rounded-md text-sm transition-colors ${view === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}>
              ☰ List
            </button>
          </div>
          {isAdmin && (
            <button onClick={() => { setEditTask(null); setShowModal(true); }} className="btn-primary">
              + New Task
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {isAdmin && (
          <select value={filter.assignee} onChange={e => setFilter(p => ({ ...p, assignee: e.target.value }))}
            className="bg-[#1f2937] border border-gray-700 text-gray-300 text-sm rounded-lg px-3 py-1.5 focus:border-blue-500 outline-none">
            <option value="">All Assignees</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        )}
        <select value={filter.priority} onChange={e => setFilter(p => ({ ...p, priority: e.target.value }))}
          className="bg-[#1f2937] border border-gray-700 text-gray-300 text-sm rounded-lg px-3 py-1.5 focus:border-blue-500 outline-none">
          <option value="">All Priorities</option>
          {PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
        </select>
        {(filter.assignee || filter.status || filter.priority) && (
          <button onClick={() => setFilter({ assignee: '', status: '', priority: '' })}
            className="text-xs text-gray-500 hover:text-red-400 transition-colors px-2">
            × Clear filters
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {TASK_COLUMNS.map(col => <div key={col.id} className="space-y-2">{[1,2].map(i => <CardSkeleton key={i} />)}</div>)}
        </div>
      ) : view === 'kanban' ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto">
            {TASK_COLUMNS.map(col => (
              <div key={col.id} className="min-w-[240px]">
                <div className={`flex items-center justify-between mb-3 px-1`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${col.accent.replace('border-', 'bg-')}`} />
                    <span className="text-sm font-semibold text-gray-300">{col.label}</span>
                  </div>
                  <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">
                    {tasksByStatus[col.id]?.length || 0}
                  </span>
                </div>
                <Droppable droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-h-[200px] p-2 rounded-xl transition-colors ${
                        snapshot.isDraggingOver ? col.bg + ' border-2 border-dashed ' + col.accent : 'bg-[#0d1526]/50'
                      }`}
                    >
                      {tasksByStatus[col.id]?.length === 0 && !snapshot.isDraggingOver && (
                        <div className="flex flex-col items-center justify-center h-24 text-gray-700">
                          <span className="text-2xl mb-1">📭</span>
                          <span className="text-xs">No tasks</span>
                        </div>
                      )}
                      {tasksByStatus[col.id]?.map((task, index) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          index={index}
                          isAdmin={isAdmin}
                          currentUser={currentUser}
                          onEdit={(t) => { setEditTask(t); setShowModal(true); }}
                          onDelete={(t) => setDeleteConfirm(t)}
                          onOpenSubmit={(t) => setSubmitTask(t)}
                        />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      ) : (
        // List view
        <div className="bg-[#111827] rounded-xl border border-gray-800 overflow-hidden">
          <div className="grid grid-cols-12 gap-3 px-4 py-2 border-b border-gray-800 text-xs text-gray-500 font-semibold uppercase tracking-wider">
            <div className="col-span-4">Title</div>
            <div className="col-span-2">Assignee</div>
            <div className="col-span-2">Priority</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Due Date</div>
          </div>
          {filteredTasks.length === 0 ? (
            <EmptyState icon="✅" title="No tasks found" description="No tasks match your current filters." />
          ) : (
            filteredTasks.map(task => {
              const pc = getPriorityConfig(task.priority);
              const sc = getStatusConfig(task.status);
              const dueDate = task.dueDate ? new Date(task.dueDate?.seconds ? task.dueDate.seconds * 1000 : task.dueDate) : null;
              const overdue = dueDate && dueDate < new Date() && task.status !== 'completed';
              return (
                <div key={task.id} className="grid grid-cols-12 gap-3 px-4 py-3 border-b border-gray-800 hover:bg-white/3 transition-colors">
                  <div className="col-span-4">
                    <p className="text-sm text-white font-medium truncate">{task.title}</p>
                    <p className="text-xs text-gray-600 truncate">{task.description}</p>
                  </div>
                  <div className="col-span-2 flex items-center gap-1.5">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0 ${colorFromName(task.assignedToName)}`}>
                      {avatarInitials(task.assignedToName)}
                    </div>
                    <span className="text-xs text-gray-400 truncate">{task.assignedToName}</span>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <span className={`badge text-[10px] ${pc.color}`}>{pc.label}</span>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <span className={`badge text-[10px] ${sc.color}`}>{sc.label}</span>
                  </div>
                  <div className="col-span-2 flex items-center">
                    {dueDate ? (
                      <span className={`text-xs ${overdue ? 'text-red-400' : 'text-gray-400'}`}>
                        {overdue && '⚠️ '}{dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                      </span>
                    ) : <span className="text-xs text-gray-600">—</span>}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Modals */}
      {showModal && (
        <TaskModal
          task={editTask}
          onClose={() => { setShowModal(false); setEditTask(null); }}
          users={users}
          currentUser={currentUser}
        />
      )}

      {submitTask && (
        <SubmitWorkModal
          task={submitTask}
          onClose={() => setSubmitTask(null)}
          currentUser={currentUser}
          userProfile={userProfile}
        />
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-gray-700 rounded-2xl p-6 w-full max-w-sm">
            <h3 className="font-heading font-bold text-white mb-2">Delete Task?</h3>
            <p className="text-gray-400 text-sm mb-5">Are you sure you want to delete "<span className="text-white">{deleteConfirm.title}</span>"? This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="btn-danger flex-1">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
