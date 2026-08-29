'use client';
import { usePathname } from 'next/navigation';
import AdminNav from '@/components/admin/AdminNav';
import AdminPrefetcher from '@/components/admin/AdminPrefetcher';

const BARE = ['/admin/login', '/admin/change-password'];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const bare = BARE.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  if (bare) return <>{children}</>;
  return (
    <div className="admin-shell min-h-screen" style={{ background: 'var(--bg)' }}>
      <AdminPrefetcher />
      <AdminNav />
      <div className="admin-content">{children}</div>
    </div>
  );
}
