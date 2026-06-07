import { useState, useEffect, useRef } from 'react';
import {
  collection, query, orderBy, onSnapshot,
  addDoc, updateDoc, deleteDoc, doc, arrayUnion, arrayRemove, serverTimestamp
} from 'firebase/firestore';
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import useAuth from '../hooks/useAuth';
import { formatNPT } from '../utils/nptTime';
import { avatarInitials, colorFromName } from '../utils/helpers';
import EmptyState from '../components/shared/EmptyState';
import { CardSkeleton } from '../components/shared/LoadingSpinner';
import toast from 'react-hot-toast';

const REACTIONS = [
  { id: 'thumbsup', emoji: '👍' },
  { id: 'check',    emoji: '✅' },
  { id: 'hands',    emoji: '🙌' },
];

// ─── Announcement Modal ───────────────────────────────────────────────────────
function AnnouncementModal({ existing, onClose, adminName }) {
  const [form, setForm] = useState({
    title: existing?.title || '',
    body: existing?.body || '',
    isPinned: existing?.isPinned || false,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(existing?.imageURL || '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { user, userProfile } = useAuth();
  const fileRef = useRef(null);

  const handleImageSelect = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setImageFile(f);
    setImagePreview(URL.createObjectURL(f));
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.body.trim()) { toast.error('Title and body are required'); return; }
    setSaving(true);
    try {
      let imageURL = existing?.imageURL || '';
      if (imageFile) {
        setUploading(true);
        const id = existing?.id || Date.now().toString();
        const sRef = storageRef(storage, `announcements/${id}/image`);
        await new Promise((resolve, reject) => {
          const task = uploadBytesResumable(sRef, imageFile);
          task.on('state_changed', null, reject, async () => {
            imageURL = await getDownloadURL(task.snapshot.ref);
            resolve();
          });
        });
        setUploading(false);
      }

      const data = {
        title: form.title.trim(),
        body: form.body.trim(),
        imageURL,
        isPinned: form.isPinned,
        postedBy: user.uid,
        postedByName: userProfile?.name || user.email,
        updatedAt: serverTimestamp(),
      };

      if (existing) {
        await updateDoc(doc(db, 'announcements', existing.id), data);
        toast.success('Announcement updated');
      } else {
        await addDoc(collection(db, 'announcements'), {
          ...data,
          postedAt: serverTimestamp(),
          reactions: { thumbsup: [], check: [], hands: [] },
          readBy: [],
        });
        toast.success('Announcement posted! 📢');
      }
      onClose();
    } catch (err) {
      toast.error('Failed: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-[#111827] border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-700">
          <h2 className="font-heading font-bold text-white">{existing ? 'Edit Announcement' : '📢 New Announcement'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl">×</button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="label">Title <span className="text-red-400">*</span></label>
            <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Announcement title" className="input-field" />
          </div>
          <div>
            <label className="label">Body <span className="text-red-400">*</span></label>
            <textarea value={form.body} onChange={e => setForm(p => ({ ...p, body: e.target.value }))} placeholder="Write the full announcement..." rows={6} className="input-field resize-none" />
          </div>
          <div>
            <label className="label">Image (optional)</label>
            {imagePreview ? (
              <div className="relative">
                <img src={imagePreview} alt="preview" className="w-full h-48 object-cover rounded-xl" />
                <button onClick={() => { setImageFile(null); setImagePreview(''); }}
                  className="absolute top-2 right-2 bg-red-500/80 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">×</button>
              </div>
            ) : (
              <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-gray-600 hover:border-blue-500 rounded-xl p-6 text-center cursor-pointer transition-colors">
                <p className="text-gray-400 text-sm">🖼️ Click to add an image</p>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
              </div>
            )}
          </div>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" checked={form.isPinned} onChange={e => setForm(p => ({ ...p, isPinned: e.target.checked }))} className="w-4 h-4 accent-blue-500" />
            <span className="text-sm text-gray-300">📌 Pin this announcement (shows at top)</span>
          </label>
        </div>
        <div className="flex gap-3 p-5 border-t border-gray-700">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button onClick={handleSave} disabled={saving || uploading} className="btn-primary flex-1">
            {saving || uploading ? 'Saving...' : existing ? 'Update' : '📢 Post Announcement'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Announcement Card ─────────────────────────────────────────────────────────
function AnnouncementCard({ post, isAdmin, currentUserId, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const hasReacted = (type) => (post.reactions?.[type] || []).includes(currentUserId);
  const totalReactions = REACTIONS.reduce((sum, r) => sum + (post.reactions?.[r.id] || []).length, 0);
  const readCount = (post.readBy || []).length;

  const toggleReact = async (type) => {
    const reacted = hasReacted(type);
    await updateDoc(doc(db, 'announcements', post.id), {
      [`reactions.${type}`]: reacted ? arrayRemove(currentUserId) : arrayUnion(currentUserId),
    });
  };

  const markRead = async () => {
    if (!(post.readBy || []).includes(currentUserId)) {
      await updateDoc(doc(db, 'announcements', post.id), { readBy: arrayUnion(currentUserId) });
    }
  };

  useEffect(() => {
    markRead();
  }, [post.id]);

  const isRead = (post.readBy || []).includes(currentUserId);

  return (
    <div className={`bg-[#111827] border rounded-2xl overflow-hidden transition-colors ${post.isPinned ? 'border-blue-500/40' : 'border-gray-800'}`}>
      {post.isPinned && (
        <div className="bg-blue-600/20 border-b border-blue-500/30 px-4 py-2 flex items-center gap-2">
          <span className="text-xs text-blue-400 font-semibold">📌 Pinned Announcement</span>
        </div>
      )}
      {post.imageURL && (
        <img src={post.imageURL} alt={post.title} className="w-full h-48 object-cover" />
      )}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold ${colorFromName(post.postedByName)}`}>
                {avatarInitials(post.postedByName)}
              </div>
              <span className="text-xs text-gray-500">{post.postedByName}</span>
              <span className="text-xs text-gray-600">·</span>
              <span className="text-xs text-gray-600">{post.postedAt ? formatNPT(post.postedAt) : ''}</span>
              {!isRead && <span className="w-2 h-2 bg-blue-500 rounded-full ml-1" />}
            </div>
            <h3 className="font-heading font-bold text-white text-base">{post.title}</h3>
          </div>
          {isAdmin && (
            <div className="flex gap-1.5 flex-shrink-0">
              <button onClick={() => onEdit(post)} className="text-xs text-gray-500 hover:text-blue-400 transition-colors px-2 py-1 rounded-lg hover:bg-blue-500/10">✏️</button>
              <button onClick={() => onDelete(post)} className="text-xs text-gray-500 hover:text-red-400 transition-colors px-2 py-1 rounded-lg hover:bg-red-500/10">🗑️</button>
            </div>
          )}
        </div>

        <p className={`text-gray-300 text-sm leading-relaxed whitespace-pre-wrap ${!expanded && 'line-clamp-3'}`}>
          {post.body}
        </p>
        {post.body?.length > 200 && (
          <button onClick={() => setExpanded(p => !p)} className="text-blue-400 text-xs mt-1 hover:text-blue-300 transition-colors">
            {expanded ? 'Show less' : 'Read more...'}
          </button>
        )}

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-800">
          <div className="flex gap-2">
            {REACTIONS.map(r => (
              <button
                key={r.id}
                onClick={() => toggleReact(r.id)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  hasReacted(r.id)
                    ? 'bg-blue-600/30 text-blue-400 border border-blue-500/40'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
                }`}
              >
                <span>{r.emoji}</span>
                <span>{(post.reactions?.[r.id] || []).length}</span>
              </button>
            ))}
          </div>
          {isAdmin && (
            <span className="text-xs text-gray-600">{readCount} read{readCount !== 1 ? 's' : ''}</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Updates() {
  const { user, isAdmin } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editPost, setEditPost] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'announcements'), orderBy('postedAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const arr = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      const pinned = arr.filter(p => p.isPinned);
      const rest = arr.filter(p => !p.isPinned);
      setPosts([...pinned, ...rest]);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleDelete = async (post) => {
    try {
      await deleteDoc(doc(db, 'announcements', post.id));
      toast.success('Announcement deleted');
    } catch {
      toast.error('Failed to delete');
    }
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-6 max-w-2xl animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-heading font-bold text-white">📢 Company Updates</h1>
        {isAdmin && (
          <button onClick={() => { setEditPost(null); setShowModal(true); }} className="btn-primary">
            + New Announcement
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-4">{[1,2,3].map(i => <CardSkeleton key={i} lines={4} />)}</div>
      ) : posts.length === 0 ? (
        <EmptyState
          icon="📢"
          title="No announcements yet"
          description={isAdmin ? "Post your first company announcement to keep the team informed." : "No announcements have been posted yet."}
          action={isAdmin ? { label: 'Post Announcement', onClick: () => setShowModal(true) } : undefined}
        />
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <AnnouncementCard
              key={post.id}
              post={post}
              isAdmin={isAdmin}
              currentUserId={user.uid}
              onEdit={(p) => { setEditPost(p); setShowModal(true); }}
              onDelete={(p) => setDeleteConfirm(p)}
            />
          ))}
        </div>
      )}

      {showModal && (
        <AnnouncementModal
          existing={editPost}
          onClose={() => { setShowModal(false); setEditPost(null); }}
        />
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-gray-700 rounded-2xl p-6 w-full max-w-sm">
            <h3 className="font-heading font-bold text-white mb-2">Delete Announcement?</h3>
            <p className="text-gray-400 text-sm mb-5">This will permanently remove "<span className="text-white">{deleteConfirm.title}</span>".</p>
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
