import { useState, useEffect } from 'react';
import {
  collection, onSnapshot, doc, updateDoc, deleteDoc,
  serverTimestamp, setDoc
} from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import useAuth from '../hooks/useAuth';
import { avatarInitials, colorFromName, isAdminEmail } from '../utils/helpers';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../components/shared/EmptyState';
import { CardSkeleton } from '../components/shared/LoadingSpinner';
import toast from 'react-hot-toast';

// ─── Add Member Modal ─────────────────────────────────────────────────────────
function AddMemberModal({ onClose }) {
  const [form, setForm] = useState({ email: '', role: '', password: '' });
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!form.email.trim() || !form.role.trim() || !form.password) {
      toast.error('All fields are required'); return;
    }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setSaving(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, form.email.trim(), form.password);
      await setDoc(doc(db, 'users', cred.user.uid), {
        uid: cred.user.uid,
        email: form.email.trim(),
        name: form.email.split('@')[0],
        role: form.role.trim(),
        phone: '',
        profilePhoto: '',
        profileComplete: false,
        isAdmin: isAdminEmail(form.email),
        isActive: true,
        createdAt: serverTimestamp(),
        lastLogin: null,
      });
      toast.success(`Account created for ${form.email}! They'll complete onboarding on first login.`);
      onClose();
    } catch (err) {
      let msg = err.message;
      if (err.code === 'auth/email-already-in-use') msg = 'This email is already registered.';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-[#111827] border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-700">
          <h2 className="font-heading font-bold text-white">👤 Add New Team Member</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl">×</button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="label">Email Address <span className="text-red-400">*</span></label>
            <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="member@digitalmarmat.com" className="input-field" />
          </div>
          <div>
            <label className="label">Role / Designation <span className="text-red-400">*</span></label>
            <input type="text" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} placeholder="e.g. SEO Specialist" className="input-field" />
          </div>
          <div>
            <label className="label">Temporary Password <span className="text-red-400">*</span></label>
            <input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder="Min 6 characters" className="input-field" />
            <p className="text-xs text-gray-600 mt-1">Member will be asked to complete their full profile on first login.</p>
          </div>
        </div>
        <div className="flex gap-3 p-5 border-t border-gray-700">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button onClick={handleCreate} disabled={saving} className="btn-primary flex-1">
            {saving ? 'Creating...' : '+ Create Account'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Edit Role Modal ──────────────────────────────────────────────────────────
function EditRoleModal({ member, onClose }) {
  const [role, setRole] = useState(member.role || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!role.trim()) { toast.error('Role cannot be empty'); return; }
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', member.id), { role: role.trim() });
      toast.success('Role updated');
      onClose();
    } catch (err) {
      toast.error('Failed: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#111827] border border-gray-700 rounded-2xl w-full max-w-sm shadow-2xl">
        <div className="p-5 border-b border-gray-700">
          <h2 className="font-heading font-bold text-white">Edit Role — {member.name}</h2>
        </div>
        <div className="p-5">
          <label className="label">Role / Designation</label>
          <input value={role} onChange={e => setRole(e.target.value)} className="input-field" placeholder="e.g. Content Manager" />
        </div>
        <div className="flex gap-3 p-5 border-t border-gray-700">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">{saving ? 'Saving...' : 'Save'}</button>
        </div>
      </div>
    </div>
  );
}

// ─── Member Card ──────────────────────────────────────────────────────────────
function MemberCard({ member, isAdmin, onViewProfile, onEditRole, onDeactivate, onDelete, currentUserId }) {
  const isSelf = member.id === currentUserId;

  return (
    <div className={`bg-[#111827] border rounded-xl p-4 transition-colors ${member.isActive === false ? 'border-red-500/20 opacity-60' : 'border-gray-800 hover:border-blue-500/30'}`}>
      <div className="flex items-start gap-3">
        {member.profilePhoto ? (
          <img src={member.profilePhoto} alt={member.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
        ) : (
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 ${colorFromName(member.name)}`}>
            {avatarInitials(member.name)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-white text-sm truncate">{member.name || member.email}</h3>
            {member.isAdmin && <span className="badge text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30">Admin</span>}
            {isSelf && <span className="badge text-[10px] bg-gray-500/20 text-gray-400 border border-gray-500/30">You</span>}
            {member.isActive === false && <span className="badge text-[10px] bg-red-500/20 text-red-400">Inactive</span>}
          </div>
          <p className="text-xs text-blue-400 mt-0.5">{member.role || 'No role set'}</p>
          <p className="text-xs text-gray-500 mt-0.5 truncate">{member.email}</p>
          {member.phone && <p className="text-xs text-gray-600 mt-0.5">{member.phone}</p>}
        </div>
      </div>

      <div className="flex gap-2 mt-4 flex-wrap">
        <button onClick={() => onViewProfile(member)} className="flex-1 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-lg text-xs font-medium transition-colors">
          View Profile
        </button>
        {isAdmin && !isSelf && (
          <>
            <button onClick={() => onEditRole(member)} className="py-1.5 px-2.5 bg-gray-800 hover:bg-gray-700 text-gray-400 border border-gray-700 rounded-lg text-xs transition-colors">
              ✏️
            </button>
            <button
              onClick={() => onDeactivate(member)}
              className="py-1.5 px-2.5 bg-gray-800 hover:bg-yellow-500/10 text-gray-400 hover:text-yellow-400 border border-gray-700 hover:border-yellow-500/30 rounded-lg text-xs transition-colors"
            >
              {member.isActive === false ? '✅' : '⏸️'}
            </button>
            <button onClick={() => onDelete(member)} className="py-1.5 px-2.5 bg-gray-800 hover:bg-red-500/10 text-gray-400 hover:text-red-400 border border-gray-700 hover:border-red-500/30 rounded-lg text-xs transition-colors">
              🗑️
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Main Team Page ───────────────────────────────────────────────────────────
export default function Team() {
  const { user, isAdmin } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editRoleMember, setEditRoleMember] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), (snap) => {
      setMembers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleDeactivate = async (member) => {
    try {
      await updateDoc(doc(db, 'users', member.id), { isActive: member.isActive !== false ? false : true });
      toast.success(member.isActive !== false ? 'Account deactivated' : 'Account reactivated');
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async (member) => {
    try {
      await deleteDoc(doc(db, 'users', member.id));
      toast.success('Member removed');
    } catch { toast.error('Failed to delete member'); }
    setDeleteConfirm(null);
  };

  const filtered = members.filter(m =>
    !search ||
    (m.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (m.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (m.role || '').toLowerCase().includes(search.toLowerCase())
  );

  const activeMembers = filtered.filter(m => m.isActive !== false);
  const inactiveMembers = filtered.filter(m => m.isActive === false);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-heading font-bold text-white">👥 Team Directory</h1>
        <div className="flex gap-2">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search members..." className="input-field pl-8 py-1.5 text-sm" />
          </div>
          {isAdmin && (
            <button onClick={() => setShowAddModal(true)} className="btn-primary whitespace-nowrap">
              + Add Member
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <CardSkeleton key={i} lines={4} />)}
        </div>
      ) : members.length === 0 ? (
        <EmptyState icon="👥" title="No team members yet" description="Add your first team member to get started." action={isAdmin ? { label: 'Add Member', onClick: () => setShowAddModal(true) } : undefined} />
      ) : (
        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Active Members ({activeMembers.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {activeMembers.map(m => (
                <MemberCard
                  key={m.id}
                  member={m}
                  isAdmin={isAdmin}
                  currentUserId={user?.uid}
                  onViewProfile={() => navigate(`/team/${m.id}`)}
                  onEditRole={(m) => setEditRoleMember(m)}
                  onDeactivate={handleDeactivate}
                  onDelete={(m) => setDeleteConfirm(m)}
                />
              ))}
            </div>
          </div>

          {isAdmin && inactiveMembers.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Inactive Members ({inactiveMembers.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {inactiveMembers.map(m => (
                  <MemberCard
                    key={m.id}
                    member={m}
                    isAdmin={isAdmin}
                    currentUserId={user?.uid}
                    onViewProfile={() => navigate(`/team/${m.id}`)}
                    onEditRole={setEditRoleMember}
                    onDeactivate={handleDeactivate}
                    onDelete={(m) => setDeleteConfirm(m)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {showAddModal && <AddMemberModal onClose={() => setShowAddModal(false)} />}
      {editRoleMember && <EditRoleModal member={editRoleMember} onClose={() => setEditRoleMember(null)} />}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-gray-700 rounded-2xl p-6 w-full max-w-sm">
            <h3 className="font-heading font-bold text-white mb-2">Remove Member?</h3>
            <p className="text-gray-400 text-sm mb-5">This will permanently remove <span className="text-white">{deleteConfirm.name}</span> from the workspace. All their data will be retained.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="btn-danger flex-1">Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
