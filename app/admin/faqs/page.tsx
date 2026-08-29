'use client';
import CrudPage from '@/components/admin/CrudPage';

export default function AdminFaqs() {
  return (
    <CrudPage
      title="FAQs"
      kicker="faqs.manage"
      endpoint="/api/faqs"
      empty={{ q: '', qAr: '', a: '', aAr: '', order: 0 }}
      fields={[
        { key: 'q', label: 'Question (EN)' },
        { key: 'qAr', label: 'السؤال (AR)' },
        { key: 'a', label: 'Answer (EN)', type: 'textarea' },
        { key: 'aAr', label: 'الإجابة (AR)', type: 'textarea' },
        { key: 'order', label: 'Order', type: 'number' },
      ]}
      renderItem={(s) => (
        <>
          <h3 className="font-bold mb-1" style={{ color: 'var(--text)' }}>{s.q}</h3>
          <p className="text-sm line-clamp-2" style={{ color: 'var(--text-muted)' }}>{s.a}</p>
        </>
      )}
    />
  );
}
