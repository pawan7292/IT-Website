import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useNPTClock from '../hooks/useNPTClock';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const time = useNPTClock();

  const hours = time.getHours();
  const minutes = String(time.getMinutes()).padStart(2, '0');
  const seconds = String(time.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h12 = hours % 12 || 12;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      let msg = 'Login failed. Check your credentials.';
      if (err.code === 'auth/user-not-found') msg = 'No account found with this email.';
      if (err.code === 'auth/wrong-password') msg = 'Incorrect password.';
      if (err.code === 'auth/invalid-email') msg = 'Invalid email address.';
      if (err.code === 'auth/too-many-requests') msg = 'Too many attempts. Try again later.';
      if (err.code === 'auth/invalid-credential') msg = 'Invalid email or password.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[480px] bg-[#0d1526] border-r border-gray-800 p-12">
        <div>
          <div className="flex items-center gap-3 mb-16">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center font-heading font-bold text-white">
              DM
            </div>
            <div>
              <div className="font-heading font-bold text-white text-lg">Digital Marmat</div>
              <div className="text-gray-500 text-sm">Pvt. Ltd. — Kathmandu, Nepal</div>
            </div>
          </div>

          <h1 className="text-4xl font-heading font-bold text-white mb-4">
            Workspace<br />
            <span className="text-gradient">Dashboard</span>
          </h1>
          <p className="text-gray-400 text-base leading-relaxed">
            Your all-in-one workspace for task management, attendance tracking, work submissions, and team collaboration.
          </p>

          <div className="mt-12 space-y-4">
            {[
              { icon: '✅', title: 'Task Management', desc: 'Kanban boards with real-time updates' },
              { icon: '🕐', title: 'Attendance Tracking', desc: 'Live timer with NPT timezone' },
              { icon: '📤', title: 'Work Submissions', desc: 'Submit and review deliverables' },
              { icon: '📋', title: 'Daily Reports', desc: 'Track progress and plan ahead' },
            ].map(f => (
              <div key={f.title} className="flex items-start gap-3">
                <span className="text-xl">{f.icon}</span>
                <div>
                  <div className="text-white text-sm font-medium">{f.title}</div>
                  <div className="text-gray-500 text-xs">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#111827] rounded-2xl p-6 border border-gray-700">
          <div className="text-blue-400 font-mono text-3xl font-bold">
            {h12}:{minutes}:{seconds} {ampm}
          </div>
          <div className="text-gray-500 text-sm mt-1">Nepal Standard Time (UTC+5:45)</div>
        </div>
      </div>

      {/* Right — login form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center font-heading font-bold text-white text-sm">
              DM
            </div>
            <div>
              <div className="font-heading font-bold text-white">Digital Marmat</div>
              <div className="text-gray-500 text-xs">Workspace Dashboard</div>
            </div>
          </div>

          <h2 className="text-2xl font-heading font-bold text-white mb-2">Sign in</h2>
          <p className="text-gray-500 text-sm mb-8">Access your Digital Marmat workspace</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@digitalmarmat.com"
                className="input-field"
                autoComplete="email"
                disabled={loading}
              />
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input-field pr-10"
                  autoComplete="current-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors text-sm"
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl font-semibold text-sm transition-all duration-200"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign In to Workspace'
              )}
            </button>
          </form>

          <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <p className="text-xs text-gray-400">
              <span className="text-blue-400 font-semibold">New to the workspace?</span> Contact your admin to create your account. Use the credentials provided to you via email.
            </p>
          </div>

          <p className="text-center text-gray-600 text-xs mt-6">
            Digital Marmat Pvt. Ltd. · Kathmandu, Nepal · {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}
