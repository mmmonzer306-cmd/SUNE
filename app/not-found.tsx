import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: 'var(--bg)' }}>
      <div className="tech-card max-w-lg w-full p-10" style={{ fontFamily: 'monospace' }}>
        <p className="text-sm mb-2" style={{ color: 'var(--accent)' }}>$ cd /page-you-wanted</p>
        <p className="text-sm mb-6" style={{ color: '#f87171' }}>
          Error 404: page not found
        </p>
        <p className="text-5xl font-black gradient-text mb-6">404</p>
        <p className="text-sm mb-8 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          The page you are looking for does not exist or has been moved.
          <br />
          الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
        </p>
        <Link href="/" className="btn-primary text-sm">$ cd ~/home ↩</Link>
      </div>
    </div>
  );
}
