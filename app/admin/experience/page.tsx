'use client';
import CrudPage from '@/components/admin/CrudPage';

export default function AdminExperience() {
  return (
    <CrudPage
      title="Experience"
      kicker="experience.manage"
      endpoint="/api/experience"
      empty={{ title: '', titleAr: '', org: '', orgAr: '', period: '', desc: '', descAr: '', story: '', storyAr: '', icon: 'FiBriefcase', order: 0 }}
      fields={[
        { key: 'title', label: 'Title (EN)' },
        { key: 'titleAr', label: 'العنوان (AR)' },
        { key: 'org', label: 'Company / Organization (EN)' },
        { key: 'orgAr', label: 'الجهة (AR)' },
        { key: 'period', label: 'Period (e.g. 2023 — Present)' },
        { key: 'icon', label: 'Icon (e.g. FiBriefcase, FiStar, FiCode, FiAward, FiBookOpen)' },
        { key: 'order', label: 'Order', type: 'number' },
        { key: 'desc', label: 'Short description (EN)', type: 'textarea' },
        { key: 'descAr', label: 'الوصف المختصر (AR)', type: 'textarea' },
        { key: 'story', label: 'Full story (EN) — shown when card expands', type: 'textarea', rows: 7 },
        { key: 'storyAr', label: 'القصة الكاملة (AR)', type: 'textarea', rows: 7 },
      ]}
      renderItem={(s) => (
        <>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="font-bold" style={{ color: 'var(--text)' }}>{s.title}</h3>
            {s.org && <span className="text-xs" style={{ color: 'var(--accent-2)' }}>{s.org}</span>}
            {s.period && <span className="text-xs px-2 py-0.5 rounded tag-accent">{s.period}</span>}
          </div>
          {s.desc && <p className="text-sm line-clamp-2" style={{ color: 'var(--text-muted)' }}>{s.desc}</p>}
        </>
      )}
    />
  );
}
