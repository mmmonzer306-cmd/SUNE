export default function AdminLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 animate-spin"
          style={{ borderColor: 'var(--border)', borderTopColor: 'var(--accent)' }} />
        <p className="text-xs tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>Loading panel</p>
      </div>
    </div>
  );
}
