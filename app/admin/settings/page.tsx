'use client';
import { useState } from 'react';
import AdminNav from '@/components/admin/AdminNav';
import { FiLock, FiSun, FiMoon, FiSave } from 'react-icons/fi';
import { useApp } from '@/lib/AppContext';

export default function AdminSettings() {
  const { theme, toggleTheme, lang, setLang } = useApp();
  const [pass, setPass] = useState({ current: '', new: '', confirm: '' });
  const [passStatus, setPassStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [passError, setPassError] = useState('');

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pass.new !== pass.confirm) { setPassError('Passwords do not match'); return; }
    if (pass.new.length < 8) { setPassError('Min 8 characters'); return; }
    setPassStatus('loading'); setPassError('');
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'changePassword', currentPassword: pass.current, newPassword: pass.new }),
      });
      const data = await res.json();
      if (data.success) {
        setPassStatus('success');
        setPass({ current: '', new: '', confirm: '' });
      } else {
        setPassError(data.error || 'Failed');
        setPassStatus('error');
      }
    } catch { setPassStatus('error'); }
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <AdminNav />
      <main className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="font-display text-2xl font-bold gradient-text mb-8">Settings</h1>

        {/* Theme */}
        <div className="tech-card p-6 mb-6">
          <p className="font-mono text-xs uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>// Appearance</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium" style={{ color: 'var(--text)' }}>Theme</p>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Current: {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}</p>
            </div>
            <button onClick={toggleTheme} className="btn-outline flex items-center gap-2 text-sm py-2">
              {theme === 'dark' ? <><FiSun size={14} /> Switch to Light</> : <><FiMoon size={14} /> Switch to Dark</>}
            </button>
          </div>
        </div>

        {/* Language */}
        <div className="tech-card p-6 mb-6">
          <p className="font-mono text-xs uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>// Default Language</p>
          <div className="flex gap-3">
            {(['en', 'ar', 'fr'] as const).map((l) => (
              <button key={l} onClick={() => setLang(l)}
                className="px-4 py-2 rounded-lg text-sm font-mono uppercase border transition-all"
                style={{
                  background: lang === l ? 'var(--accent)' : 'transparent',
                  color: lang === l ? '#000' : 'var(--text-muted)',
                  borderColor: lang === l ? 'var(--accent)' : 'var(--border)',
                  fontWeight: lang === l ? 700 : 400,
                }}>
                {l === 'en' ? '🇺🇸 English' : l === 'ar' ? '🇸🇦 العربية' : '🇫🇷 Français'}
              </button>
            ))}
          </div>
        </div>

        {/* Change Password */}
        <div className="tech-card p-6">
          <p className="font-mono text-xs uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>// Change Password</p>
          <form onSubmit={changePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-mono mb-1.5" style={{ color: 'var(--text-muted)' }}>Current Password</label>
              <input type="password" value={pass.current} onChange={(e) => setPass({ ...pass, current: e.target.value })} required className="tech-input text-sm" />
            </div>
            <div>
              <label className="block text-xs font-mono mb-1.5" style={{ color: 'var(--text-muted)' }}>New Password (min 8 chars)</label>
              <input type="password" value={pass.new} onChange={(e) => setPass({ ...pass, new: e.target.value })} required className="tech-input text-sm" />
            </div>
            <div>
              <label className="block text-xs font-mono mb-1.5" style={{ color: 'var(--text-muted)' }}>Confirm New Password</label>
              <input type="password" value={pass.confirm} onChange={(e) => setPass({ ...pass, confirm: e.target.value })} required className="tech-input text-sm" />
            </div>
            {passError && <p className="text-red-400 text-sm font-mono">{passError}</p>}
            {passStatus === 'success' && <p className="text-sm font-mono" style={{ color: '#4ade80' }}>✓ Password changed successfully!</p>}
            <button type="submit" disabled={passStatus === 'loading'} className="btn-primary flex items-center gap-2 text-sm">
              <FiLock size={14} /> {passStatus === 'loading' ? 'Saving...' : 'Change Password'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
