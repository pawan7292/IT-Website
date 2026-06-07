import { useState, useRef } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import useAuth from '../hooks/useAuth';
import { isAdminEmail } from '../utils/helpers';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const STEPS = [
  { id: 1, title: 'Personal Info',        icon: '👤', desc: 'Tell us about yourself' },
  { id: 2, title: 'Identity Documents',   icon: '🪪', desc: 'Citizenship & SSF details' },
  { id: 3, title: 'Bank Details',         icon: '🏦', desc: 'Payment information' },
];

function UploadPreview({ label, storagePath, value, onChange, required }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef(null);

  const handleUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    const ts = Date.now();
    const sRef = storageRef(storage, `${storagePath}/${ts}_${file.name}`);
    const task = uploadBytesResumable(sRef, file);
    task.on('state_changed',
      (snap) => setProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
      (err) => { toast.error(`Upload failed: ${err.message}`); setUploading(false); },
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        onChange(url);
        setUploading(false);
        setProgress(0);
        toast.success(`${label} uploaded!`);
      }
    );
  };

  return (
    <div>
      <label className="label">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {value ? (
        <div className="relative">
          <img src={value} alt={label} className="w-full h-36 object-cover rounded-xl border border-gray-700" />
          <button
            onClick={() => onChange('')}
            className="absolute top-2 right-2 bg-red-500/80 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-500 transition-colors"
          >×</button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-gray-600 hover:border-blue-500 rounded-xl p-6 text-center cursor-pointer transition-colors"
        >
          {uploading ? (
            <div>
              <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-2" />
              <p className="text-blue-400 text-sm">{progress}%</p>
              <div className="mt-2 h-1 bg-gray-700 rounded-full mx-4">
                <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
          ) : (
            <>
              <div className="text-3xl mb-2">📷</div>
              <p className="text-gray-400 text-sm">Click to upload photo</p>
              <p className="text-gray-600 text-xs mt-1">JPG, PNG — max 10MB</p>
            </>
          )}
          <input ref={inputRef} type="file" className="hidden" accept="image/*" onChange={e => handleUpload(e.target.files[0])} />
        </div>
      )}
    </div>
  );
}

export default function Onboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: '', phone: '', role: '', profilePhoto: '',
    citizenshipNumber: '', citizenshipFront: '', citizenshipBack: '', ssfId: '',
    bankName: '', bankAccount: '', bankBranch: '', accountHolder: '',
  });
  const [errors, setErrors] = useState({});

  const set = (field) => (e) => {
    const val = e.target ? e.target.value : e;
    setForm(p => ({ ...p, [field]: val }));
    setErrors(p => ({ ...p, [field]: '' }));
  };

  const validateStep = (s) => {
    const errs = {};
    if (s === 1) {
      if (!form.name.trim())   errs.name  = 'Full name is required';
      if (!form.phone.trim())  errs.phone = 'Phone number is required';
      if (!form.role.trim())   errs.role  = 'Role/Designation is required';
      if (!form.profilePhoto)  errs.profilePhoto = 'Profile photo is required';
    }
    if (s === 2) {
      if (!form.citizenshipNumber.trim()) errs.citizenshipNumber = 'Citizenship number is required';
      if (!form.citizenshipFront)         errs.citizenshipFront  = 'Citizenship front photo is required';
      if (!form.citizenshipBack)          errs.citizenshipBack   = 'Citizenship back photo is required';
      if (!form.ssfId.trim())             errs.ssfId             = 'SSF ID is required';
    }
    if (s === 3) {
      if (!form.bankName.trim())      errs.bankName      = 'Bank name is required';
      if (!form.bankAccount.trim())   errs.bankAccount   = 'Account number is required';
      if (!form.bankBranch.trim())    errs.bankBranch    = 'Branch is required';
      if (!form.accountHolder.trim()) errs.accountHolder = 'Account holder name is required';
    }
    return errs;
  };

  const nextStep = () => {
    const errs = validateStep(step);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setStep(p => p + 1);
  };

  const handleSubmit = async () => {
    const errs = validateStep(3);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        name: form.name.trim(),
        phone: form.phone.trim(),
        role: form.role.trim(),
        profilePhoto: form.profilePhoto,
        citizenshipNumber: form.citizenshipNumber.trim(),
        citizenshipFront: form.citizenshipFront,
        citizenshipBack: form.citizenshipBack,
        ssfId: form.ssfId.trim(),
        bankName: form.bankName.trim(),
        bankAccount: form.bankAccount.trim(),
        bankBranch: form.bankBranch.trim(),
        accountHolder: form.accountHolder.trim(),
        profileComplete: true,
        isAdmin: isAdminEmail(user.email),
        isActive: true,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      });
      toast.success('Profile complete! Welcome to Digital Marmat Workspace 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Failed to save profile: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const uid = user?.uid || 'temp';

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center font-heading font-bold text-white text-xl mx-auto mb-4">
            DM
          </div>
          <h1 className="text-2xl font-heading font-bold text-white">Welcome to Digital Marmat!</h1>
          <p className="text-gray-400 text-sm mt-1">Complete your profile to access the workspace</p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center mb-8">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1">
              <div className={`flex items-center gap-2 ${i > 0 ? 'flex-1' : ''}`}>
                {i > 0 && <div className={`flex-1 h-px ${step > i ? 'bg-blue-500' : 'bg-gray-700'}`} />}
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors flex-shrink-0 ${
                  step === s.id ? 'bg-blue-600 text-white ring-2 ring-blue-500/40' :
                  step > s.id  ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-500'
                }`}>
                  {step > s.id ? '✓' : s.id}
                </div>
              </div>
              {i < STEPS.length - 1 && <div className={`flex-1 h-px ${step > s.id ? 'bg-blue-500' : 'bg-gray-700'}`} />}
            </div>
          ))}
        </div>

        {/* Step title */}
        <div className="bg-[#111827] rounded-2xl p-6 border border-gray-800 mb-4">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">{STEPS[step - 1].icon}</span>
            <div>
              <h2 className="font-heading font-bold text-white">{STEPS[step - 1].title}</h2>
              <p className="text-gray-500 text-sm">{STEPS[step - 1].desc}</p>
            </div>
          </div>

          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="label">Full Name <span className="text-red-400">*</span></label>
                <input type="text" value={form.name} onChange={set('name')} placeholder="Ayush Mainali" className="input-field" />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="label">Phone Number <span className="text-red-400">*</span></label>
                <input type="tel" value={form.phone} onChange={set('phone')} placeholder="+977 98XXXXXXXX" className="input-field" />
                {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label className="label">Role / Designation <span className="text-red-400">*</span></label>
                <input type="text" value={form.role} onChange={set('role')} placeholder="e.g. SEO Specialist, Content Writer" className="input-field" />
                {errors.role && <p className="text-red-400 text-xs mt-1">{errors.role}</p>}
              </div>
              <div>
                <UploadPreview
                  label="Profile Photo"
                  storagePath={`profiles/${uid}`}
                  value={form.profilePhoto}
                  onChange={set('profilePhoto')}
                  required
                />
                {errors.profilePhoto && <p className="text-red-400 text-xs mt-1">{errors.profilePhoto}</p>}
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="label">Citizenship Number <span className="text-red-400">*</span></label>
                <input type="text" value={form.citizenshipNumber} onChange={set('citizenshipNumber')} placeholder="e.g. 12-34-56-78901" className="input-field" />
                {errors.citizenshipNumber && <p className="text-red-400 text-xs mt-1">{errors.citizenshipNumber}</p>}
              </div>
              <div>
                <UploadPreview
                  label="Citizenship Front Photo"
                  storagePath={`profiles/${uid}`}
                  value={form.citizenshipFront}
                  onChange={set('citizenshipFront')}
                  required
                />
                {errors.citizenshipFront && <p className="text-red-400 text-xs mt-1">{errors.citizenshipFront}</p>}
              </div>
              <div>
                <UploadPreview
                  label="Citizenship Back Photo"
                  storagePath={`profiles/${uid}`}
                  value={form.citizenshipBack}
                  onChange={set('citizenshipBack')}
                  required
                />
                {errors.citizenshipBack && <p className="text-red-400 text-xs mt-1">{errors.citizenshipBack}</p>}
              </div>
              <div>
                <label className="label">SSF ID (Social Security Fund) <span className="text-red-400">*</span></label>
                <input type="text" value={form.ssfId} onChange={set('ssfId')} placeholder="SSF-XXXXXXXXX" className="input-field" />
                {errors.ssfId && <p className="text-red-400 text-xs mt-1">{errors.ssfId}</p>}
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="label">Bank Name <span className="text-red-400">*</span></label>
                <input type="text" value={form.bankName} onChange={set('bankName')} placeholder="e.g. Nepal Investment Bank" className="input-field" />
                {errors.bankName && <p className="text-red-400 text-xs mt-1">{errors.bankName}</p>}
              </div>
              <div>
                <label className="label">Bank Account Number <span className="text-red-400">*</span></label>
                <input type="text" value={form.bankAccount} onChange={set('bankAccount')} placeholder="e.g. 00101234567890" className="input-field" />
                {errors.bankAccount && <p className="text-red-400 text-xs mt-1">{errors.bankAccount}</p>}
              </div>
              <div>
                <label className="label">Bank Branch <span className="text-red-400">*</span></label>
                <input type="text" value={form.bankBranch} onChange={set('bankBranch')} placeholder="e.g. New Baneshwor, Kathmandu" className="input-field" />
                {errors.bankBranch && <p className="text-red-400 text-xs mt-1">{errors.bankBranch}</p>}
              </div>
              <div>
                <label className="label">Account Holder Name <span className="text-red-400">*</span></label>
                <input type="text" value={form.accountHolder} onChange={set('accountHolder')} placeholder="As on bank account" className="input-field" />
                {errors.accountHolder && <p className="text-red-400 text-xs mt-1">{errors.accountHolder}</p>}
              </div>
            </div>
          )}
        </div>

        {/* Nav buttons */}
        <div className="flex gap-3">
          {step > 1 && (
            <button onClick={() => setStep(p => p - 1)} className="btn-secondary flex-1">
              ← Back
            </button>
          )}
          {step < 3 ? (
            <button onClick={nextStep} className="btn-primary flex-1">
              Next Step →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="btn-primary flex-1"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </span>
              ) : '🎉 Complete Setup'}
            </button>
          )}
        </div>

        <p className="text-center text-gray-600 text-xs mt-4">
          Step {step} of {STEPS.length} · Digital Marmat Workspace
        </p>
      </div>
    </div>
  );
}
