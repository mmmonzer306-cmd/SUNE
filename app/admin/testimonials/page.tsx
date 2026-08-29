'use client';
import CrudPage from '@/components/admin/CrudPage';
import { FiCopy } from 'react-icons/fi';
import { toast } from '@/components/ui/Toast';

export default function AdminTestimonials() {
  const copyLink = () => {
    const link = `${window.location.origin}/review`;
    navigator.clipboard.writeText(link).then(() => toast('Review link copied — send it to your clients'));
  };

  return (
    <CrudPage
      title="Testimonials"
      headerExtra={
        <button onClick={copyLink} className="btn-outline flex items-center gap-2 text-sm py-2.5 px-4">
          <FiCopy size={13} /> Copy Review Link
        </button>
      }
      kicker="testimonials.manage"
      endpoint="/api/testimonials"
      endpointSuffix="?all=1"
      empty={{ name: '', role: '', roleAr: '', content: '', contentAr: '', avatar: '', rating: 5, order: 0, approved: false }}
      fields={[
        { key: 'name', label: 'Client name' },
        { key: 'avatar', label: 'Avatar URL (optional)' },
        { key: 'role', label: 'Role / Company (EN)' },
        { key: 'roleAr', label: 'المنصب / الشركة (AR)' },
        { key: 'content', label: 'Testimonial (EN)', type: 'textarea' },
        { key: 'contentAr', label: 'الرأي (AR)', type: 'textarea' },
        { key: 'rating', label: 'Rating (1-5)', type: 'number' },
        { key: 'order', label: 'Order', type: 'number' },
        { key: 'approved', label: 'Show on website (approved)', type: 'checkbox' },
      ]}
      renderItem={(s) => (
        <>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="font-bold" style={{ color: 'var(--text)' }}>{s.name}</h3>
            {s.role && <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.role}</span>}
            <span className="text-xs" style={{ color: '#f59e0b' }}>{'★'.repeat(s.rating)}</span>
            {!s.approved && <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.25)' }}>Pending</span>}
          </div>
          <p className="text-sm line-clamp-2" style={{ color: 'var(--text-muted)' }}>{s.content}</p>
        </>
      )}
    />
  );
}
