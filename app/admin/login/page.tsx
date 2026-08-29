'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLock, FiUser, FiEye, FiEyeOff, FiLogIn, FiHelpCircle, FiKey, FiCheck } from 'react-icons/fi';
import Particles from '@/components/ui/Particles';

type Mode = 'login' | 'recover' | 'unlocking' | 'unlocked';

export default function AdminLogin() {
  const [mode, setMode] = useState<Mode>('login');
  const [creds, setCreds] = useState({ username: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(0);

  // Recovery state
  const [recUser, setRecUser] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [newPass, setNewPass] = useState('');
  const [recDone, setRecDone] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    const res = await signIn('credentials', { ...creds, redirect: false });
    if (res?.ok) {
      setMode('unlocking');
      setTimeout(() => setMode('unlocked'), 900);
      setTimeout(async () => {
        const check = await fetch('/api/auth/check-must-change');
        const data = await check.json();
        router.push(data.mustChange ? '/admin/change-password' : '/admin');
      }, 2100);
    } else {
      setError('Invalid username or password');
      setShake((s) => s + 1);
      setLoading(false);
    }
  };

  const recover = async (step: string) => {
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/auth/recover', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step, username: recUser, answer, newPassword: newPass }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed'); setShake((s) => s + 1); }
      else if (step === 'question') setQuestion(data.question);
      else setRecDone(true);
    } finally { setLoading(false); }
  };

  const inputCls = "tech-input has-icon-start py-3.5 text-[15px]";
  const iconCls = "absolute start-4 top-1/2 -translate-y-1/2 z-10 w-4 h-4 transition-colors pointer-events-none group-focus-within:text-[var(--accent)]";

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      {/* Living background */}
      <Particles />
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
      <div className="absolute -top-32 -start-32 w-96 h-96 rounded-full blur-3xl pointer-events-none animate-float"
        style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.12), transparent 70%)' }} />
      <div className="absolute -bottom-32 -end-32 w-96 h-96 rounded-full blur-3xl pointer-events-none animate-float"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.12), transparent 70%)', animationDelay: '2s' }} />

      {/* Rotating orbit ring behind card */}
      <div className="absolute w-[560px] h-[560px] rounded-full border pointer-events-none animate-spin"
        style={{ borderColor: 'rgba(0,212,255,0.07)', animationDuration: '30s' }} />
      <div className="absolute w-[720px] h-[720px] rounded-full border border-dashed pointer-events-none animate-spin"
        style={{ borderColor: 'rgba(124,58,237,0.07)', animationDuration: '45s', animationDirection: 'reverse' }} />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md px-6"
      >
        {/* Gradient border wrapper */}
        <div className="rounded-3xl p-[1.5px] relative"
          style={{
            background: 'linear-gradient(135deg, rgba(0,212,255,0.4), rgba(124,58,237,0.35), transparent 60%)',
            boxShadow: '0 40px 100px -24px rgba(0,0,0,0.6), 0 0 80px var(--accent-glow)',
          }}>
          <motion.div
            key={shake}
            animate={shake ? { x: [0, -12, 12, -7, 7, 0] } : {}}
            transition={{ duration: 0.45 }}
            className="rounded-[calc(1.5rem-1px)] p-9 relative overflow-hidden"
            style={{ backdropFilter: 'blur(20px)', background: 'color-mix(in srgb, var(--card) 88%, transparent)' }}
          >
            {/* top shine */}
            <div className="absolute top-0 inset-x-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)' }} />
          <AnimatePresence mode="wait">
            {/* ============ LOGIN ============ */}
            {mode === 'login' && (
              <motion.div key="login" exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}>
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.15, type: 'spring', stiffness: 130, damping: 14 }}
                    className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center animate-pulse-glow relative"
                    style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}
                  >
                    <FiLock size={24} color="#fff" />
                  </motion.div>
                  <h1 className="font-display text-2xl font-bold gradient-text">Admin Panel</h1>
                   <p className="text-xs mt-1.5 tracking-[0.25em] uppercase" style={{ color: 'var(--muted)' }}>{'// Restricted Access'}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative group">
                    <FiUser className={iconCls} size={15} style={{ color: 'var(--muted)' }} />
                    <input type="text" placeholder="Username" value={creds.username} autoComplete="username"
                      onChange={(e) => setCreds({ ...creds, username: e.target.value })}
                      required className={inputCls} />
                  </div>
                  <div className="relative group">
                    <FiLock className={iconCls} size={15} style={{ color: 'var(--muted)' }} />
                    <input type={showPass ? 'text' : 'password'} placeholder="Password" value={creds.password} autoComplete="current-password"
                      onChange={(e) => setCreds({ ...creds, password: e.target.value })}
                      required className={`${inputCls} has-icon-end`} />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute end-3 top-1/2 -translate-y-1/2 p-1 transition-all hover:scale-110" style={{ color: 'var(--muted)' }}>
                      {showPass ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                    </button>
                  </div>

                  {error && (
                    <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-center py-2.5 px-3 rounded-lg"
                      style={{ color: '#f87171', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                      {error}
                    </motion.p>
                  )}

                  <button type="submit" disabled={loading}
                    className="btn-primary w-full justify-center gap-2 disabled:opacity-60">
                    {loading ? (
                      <span className="w-4 h-4 rounded-full border-2 border-white/30 animate-spin" style={{ borderTopColor: '#fff' }} />
                    ) : <FiLogIn size={15} />}
                    {loading ? 'Authenticating...' : 'Login'}
                  </button>

                  <button type="button" onClick={() => { setMode('recover'); setError(''); }}
                    className="w-full text-center text-xs mt-1 transition-colors hover:text-[var(--accent)]"
                    style={{ color: 'var(--muted)' }}>
                    <FiHelpCircle size={12} className="inline me-1" /> Forgot password?
                  </button>
                </form>
              </motion.div>
            )}

            {/* ============ RECOVERY ============ */}
            {mode === 'recover' && (
              <motion.div key="recover" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                <div className="text-center mb-7">
                  <div className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center"
                    style={{ background: 'var(--accent-glow)', color: 'var(--accent)' }}>
                    <FiKey size={22} />
                  </div>
                  <h2 className="font-display text-xl font-bold" style={{ color: 'var(--text)' }}>Recover Password</h2>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Answer your security question</p>
                </div>

                {!recDone ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <FiUser className={iconCls} size={15} style={{ color: 'var(--muted)' }} />
                      <input type="text" placeholder="Username" value={recUser} onChange={(e) => setRecUser(e.target.value)}
                        className={inputCls} />
                    </div>
                    {!question && (
                      <button onClick={() => recover('question')} disabled={loading || !recUser}
                        className="btn-primary w-full justify-center text-sm disabled:opacity-50">Get security question</button>
                    )}
                    {question && (
                      <>
                        <p className="text-sm px-4 py-3 rounded-xl" style={{ background: 'var(--accent-glow)', color: 'var(--accent)' }}>
                          {question}
                        </p>
                        <div className="relative">
                          <FiKey className={iconCls} size={15} style={{ color: 'var(--muted)' }} />
                          <input type="text" placeholder="Your answer" value={answer} onChange={(e) => setAnswer(e.target.value)}
                            className={inputCls} />
                        </div>
                        <div className="relative">
                          <FiLock className={iconCls} size={15} style={{ color: 'var(--muted)' }} />
                          <input type="password" placeholder="New password (min 8 chars)" value={newPass} onChange={(e) => setNewPass(e.target.value)}
                            className={inputCls} />
                        </div>
                        <button onClick={() => recover('reset')} disabled={loading || !answer || newPass.length < 8}
                          className="btn-primary w-full justify-center text-sm disabled:opacity-50">Reset Password</button>
                      </>
                    )}
                    {error && <p className="text-center text-xs" style={{ color: '#f87171' }}>{error}</p>}
                    <button onClick={() => { setMode('login'); setError(''); setQuestion(''); }}
                      className="w-full text-center text-xs transition-colors hover:text-[var(--accent)]" style={{ color: 'var(--muted)' }}>
                      ← Back to login
                    </button>
                  </div>
                ) : (
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-6">
                    <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center"
                      style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>
                      <FiCheck size={26} />
                    </div>
                    <p className="font-bold mb-5" style={{ color: 'var(--text)' }}>Password reset successfully</p>
                    <button onClick={() => { setMode('login'); setRecDone(false); setQuestion(''); setAnswer(''); setNewPass(''); }}
                      className="btn-primary text-sm">Login now</button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* ============ UNLOCK / SUCCESS ============ */}
            {(mode === 'unlocking' || mode === 'unlocked') && (
              <motion.div key="unlock" className="text-center py-14" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <motion.div
                  animate={mode === 'unlocked'
                    ? { rotate: [0, -15, 0], scale: [1, 1.1, 1] }
                    : { rotate: [0, -8, 8, -8, 0] }}
                  transition={{ duration: 0.9 }}
                  className="relative w-24 h-24 mx-auto mb-6"
                >
                  {/* Lock body */}
                  <div className="absolute inset-x-3 bottom-0 top-8 rounded-2xl"
                    style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', boxShadow: '0 20px 50px -10px var(--accent-glow)' }} />
                  {/* Shackle */}
                  <motion.div
                    animate={mode === 'unlocked' ? { rotate: -30, y: -8, x: -3, opacity: 0.9 } : {}}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 rounded-t-full border-4 border-b-0"
                    style={{ borderColor: 'var(--accent)', transformOrigin: 'left bottom' }} />
                  {/* Keyhole */}
                  <div className="absolute top-12 left-1/2 -translate-x-1/2 w-2.5 h-5 rounded-full bg-white/80" />
                </motion.div>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                  className="font-display font-bold text-lg" style={{ color: 'var(--text)' }}>
                  {mode === 'unlocking' ? 'Unlocking...' : 'Access Granted'}
                </motion.p>
                <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.4, delay: 0.2 }}
                  className="w-32 h-[2px] mx-auto mt-4 rounded-full origin-center"
                  style={{ background: 'linear-gradient(90deg, transparent, var(--accent), transparent)' }} />
              </motion.div>
            )}
          </AnimatePresence>
          </motion.div>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: 'var(--muted)' }}>
          Protected area — Alex Morgan
        </p>
      </motion.div>
    </div>
  );
}
