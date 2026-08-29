'use client';
import CrudPage from '@/components/admin/CrudPage';

export default function AdminStats() {
  return (
    <CrudPage
      title="Stats"
      kicker="stats.manage"
      endpoint="/api/stats"
      empty={{ label: '', labelAr: '', value: 0, suffix: '+', order: 0 }}
      fields={[
        { key: 'label', label: 'Label (EN)' },
        { key: 'labelAr', label: 'العنوان (AR)' },
        { key: 'value', label: 'Value (number)', type: 'number' },
        { key: 'suffix', label: 'Suffix (e.g. +, %, h)' },
        { key: 'order', label: 'Order', type: 'number' },
      ]}
      renderItem={(s) => (
        <div className="flex items-center justify-between">
          <span className="font-bold" style={{ color: 'var(--text)' }}>{s.label} {s.labelAr ? `/ ${s.labelAr}` : ''}</span>
          <span className="font-display font-black text-xl gradient-text">{s.value}{s.suffix}</span>
        </div>
      )}
    />
  );
}
