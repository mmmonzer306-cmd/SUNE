'use client';
import CrudPage from '@/components/admin/CrudPage';

export default function AdminBlocks() {
  return (
    <CrudPage
      title="Homepage Blocks"
      kicker="blocks.manage"
      endpoint="/api/blocks"
      empty={{ title: '', titleAr: '', text: '', textAr: '', icon: 'FiZap', order: 0, visible: true }}
      fields={[
        { key: 'title', label: 'Title (EN)' },
        { key: 'titleAr', label: 'العنوان (AR)' },
        { key: 'text', label: 'Text (EN)', type: 'textarea' },
        { key: 'textAr', label: 'النص (AR)', type: 'textarea' },
        { key: 'icon', label: 'Icon name (e.g. FiZap, FiCode, FiStar, FiHeart, FiShield, FiAward)' },
        { key: 'order', label: 'Order', type: 'number' },
        { key: 'visible', label: 'Visible on homepage', type: 'checkbox' },
      ]}
      renderItem={(b) => (
        <div className="flex items-center gap-3">
          <span className="text-xl" style={{ color: b.visible ? 'var(--accent)' : 'var(--muted)' }}>◆</span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold" style={{ color: 'var(--text)' }}>{b.title}</h3>
              {!b.visible && <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'var(--bg)', color: 'var(--muted)', border: '1px solid var(--border)' }}>Hidden</span>}
            </div>
            {b.text && <p className="text-sm line-clamp-1" style={{ color: 'var(--text-muted)' }}>{b.text}</p>}
          </div>
        </div>
      )}
    />
  );
}
