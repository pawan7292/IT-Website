import { useState, useEffect } from 'react';
import {
  collection, query, orderBy, onSnapshot,
  addDoc, updateDoc, deleteDoc, doc, serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import useAuth from '../hooks/useAuth';
import { formatNPT } from '../utils/nptTime';
import { SOP_CATEGORIES } from '../utils/helpers';
import EmptyState from '../components/shared/EmptyState';
import { CardSkeleton } from '../components/shared/LoadingSpinner';
import toast from 'react-hot-toast';

// ─── SOP Modal ───────────────────────────────────────────────────────────────
function SOPModal({ existing, onClose }) {
  const { user, userProfile } = useAuth();
  const [form, setForm] = useState({
    title: existing?.title || '',
    category: existing?.category || SOP_CATEGORIES[0],
    body: existing?.body || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.title.trim() || !form.body.trim()) { toast.error('Title and body are required'); return; }
    setSaving(true);
    try {
      const data = {
        title: form.title.trim(),
        category: form.category,
        body: form.body.trim(),
        updatedAt: serverTimestamp(),
      };
      if (existing) {
        await updateDoc(doc(db, 'sops', existing.id), data);
        toast.success('SOP updated');
      } else {
        await addDoc(collection(db, 'sops'), {
          ...data,
          createdBy: user.uid,
          createdByName: userProfile?.name || user.email,
          createdAt: serverTimestamp(),
        });
        toast.success('SOP created! 📚');
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
          <h2 className="font-heading font-bold text-white">{existing ? 'Edit SOP' : '📚 New SOP'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl">×</button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Title <span className="text-red-400">*</span></label>
              <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="SOP title" className="input-field" />
            </div>
            <div>
              <label className="label">Category</label>
              <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="input-field">
                {SOP_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Body / Content <span className="text-red-400">*</span></label>
            <textarea
              value={form.body}
              onChange={e => setForm(p => ({ ...p, body: e.target.value }))}
              placeholder="Write the full SOP content here. Include step-by-step instructions, guidelines, and best practices..."
              rows={12}
              className="input-field resize-none font-mono text-sm"
            />
            <p className="text-xs text-gray-600 mt-1">Tip: Use numbered lists, bullet points, and clear headings in your text for better readability.</p>
          </div>
        </div>
        <div className="flex gap-3 p-5 border-t border-gray-700">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">
            {saving ? 'Saving...' : existing ? 'Update SOP' : '📚 Create SOP'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── SOP Detail Modal ─────────────────────────────────────────────────────────
function SOPDetailModal({ sop, onClose, isAdmin, onEdit, onDelete }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-[#111827] border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
        <div className="flex items-start justify-between p-5 border-b border-gray-700 flex-shrink-0">
          <div>
            <span className={`badge text-xs mb-2 ${getCategoryColor(sop.category)}`}>{sop.category}</span>
            <h2 className="font-heading font-bold text-white text-lg">{sop.title}</h2>
            <p className="text-xs text-gray-500 mt-1">
              By {sop.createdByName} · Updated {sop.updatedAt ? formatNPT(sop.updatedAt) : ''}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {isAdmin && (
              <>
                <button onClick={() => { onEdit(sop); onClose(); }} className="text-sm text-blue-400 hover:text-blue-300 px-2 py-1 rounded-lg hover:bg-blue-500/10 transition-colors">✏️ Edit</button>
                <button onClick={() => { onDelete(sop); onClose(); }} className="text-sm text-red-400 hover:text-red-300 px-2 py-1 rounded-lg hover:bg-red-500/10 transition-colors">🗑️</button>
              </>
            )}
            <button onClick={onClose} className="text-gray-500 hover:text-white text-xl ml-2">×</button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          <div className="prose prose-invert max-w-none">
            <pre className="whitespace-pre-wrap font-body text-sm text-gray-300 leading-relaxed">{sop.body}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}

function getCategoryColor(cat) {
  const colors = {
    'SEO':                'bg-blue-500/20 text-blue-400',
    'Content':            'bg-green-500/20 text-green-400',
    'Social Media':       'bg-pink-500/20 text-pink-400',
    'Client Management':  'bg-purple-500/20 text-purple-400',
    'HR':                 'bg-orange-500/20 text-orange-400',
    'General':            'bg-gray-500/20 text-gray-400',
  };
  return colors[cat] || 'bg-gray-500/20 text-gray-400';
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SOPs() {
  const { isAdmin } = useAuth();
  const [sops, setSops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editSop, setEditSop] = useState(null);
  const [viewSop, setViewSop] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'sops'), orderBy('updatedAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setSops(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleDelete = async (sop) => {
    try {
      await deleteDoc(doc(db, 'sops', sop.id));
      toast.success('SOP deleted');
    } catch {
      toast.error('Failed to delete');
    }
    setDeleteConfirm(null);
  };

  const categories = ['All', ...SOP_CATEGORIES];

  const filtered = sops.filter(s => {
    const matchCat = activeCategory === 'All' || s.category === activeCategory;
    const matchSearch = !search || s.title.toLowerCase().includes(search.toLowerCase()) || s.body.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-heading font-bold text-white">📚 Knowledge Base / SOPs</h1>
        {isAdmin && (
          <button onClick={() => { setEditSop(null); setShowModal(true); }} className="btn-primary">
            + New SOP
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search SOPs by keyword..."
          className="input-field pl-9"
        />
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-sm px-4 py-1.5 rounded-full transition-colors ${
              activeCategory === cat
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white border border-gray-700'
            }`}
          >{cat}</button>
        ))}
      </div>

      {/* SOP Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <CardSkeleton key={i} lines={3} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="📚"
          title="No SOPs found"
          description={search ? `No results for "${search}"` : 'No SOPs in this category yet.'}
          action={isAdmin ? { label: 'Create First SOP', onClick: () => setShowModal(true) } : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(sop => (
            <div
              key={sop.id}
              onClick={() => setViewSop(sop)}
              className="bg-[#111827] border border-gray-800 hover:border-blue-500/40 rounded-xl p-4 cursor-pointer transition-all hover:shadow-lg hover:shadow-blue-500/10 group"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className={`badge text-xs ${getCategoryColor(sop.category)}`}>{sop.category}</span>
                {isAdmin && (
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={e => { e.stopPropagation(); setEditSop(sop); setShowModal(true); }}
                      className="text-xs text-gray-500 hover:text-blue-400 px-1.5 py-0.5 rounded transition-colors">✏️</button>
                    <button onClick={e => { e.stopPropagation(); setDeleteConfirm(sop); }}
                      className="text-xs text-gray-500 hover:text-red-400 px-1.5 py-0.5 rounded transition-colors">🗑️</button>
                  </div>
                )}
              </div>
              <h3 className="font-heading font-semibold text-white text-sm mb-2 group-hover:text-blue-400 transition-colors">{sop.title}</h3>
              <p className="text-xs text-gray-500 line-clamp-3">{sop.body}</p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-800">
                <span className="text-xs text-gray-600">{sop.createdByName}</span>
                <span className="text-xs text-gray-600">{sop.updatedAt ? formatNPT(sop.updatedAt) : ''}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {showModal && (
        <SOPModal existing={editSop} onClose={() => { setShowModal(false); setEditSop(null); }} />
      )}
      {viewSop && (
        <SOPDetailModal
          sop={viewSop}
          onClose={() => setViewSop(null)}
          isAdmin={isAdmin}
          onEdit={(s) => { setEditSop(s); setShowModal(true); }}
          onDelete={(s) => setDeleteConfirm(s)}
        />
      )}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-gray-700 rounded-2xl p-6 w-full max-w-sm">
            <h3 className="font-heading font-bold text-white mb-2">Delete SOP?</h3>
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
