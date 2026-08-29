'use client';
import CrudPage from '@/components/admin/CrudPage';

export default function AdminServices() {
  return (
    <CrudPage
      title="Services"
      kicker="services.manage"
      endpoint="/api/services"
      empty={{ title: '', titleAr: '', description: '', descAr: '', icon: 'FiLayers', price: '', delivery: '', deliveryAr: '', order: 0 }}
      fields={[
        { key: 'title', label: 'Title (EN)' },
        { key: 'titleAr', label: 'العنوان (AR)' },
        { key: 'description', label: 'Description (EN)', type: 'textarea' },
        { key: 'descAr', label: 'الوصف (AR)', type: 'textarea' },
        { key: 'icon', label: 'Icon name (e.g. FiShoppingCart, FiLayout, FiGrid, FiLayers)' },
        { key: 'price', label: 'Price (e.g. $199)' },
        { key: 'delivery', label: 'Delivery time (EN) e.g. 2 weeks' },
        { key: 'deliveryAr', label: 'مدة التنفيذ (AR)' },
        { key: 'order', label: 'Order', type: 'number' },
      ]}
      renderItem={(s) => (
        <>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold" style={{ color: 'var(--text)' }}>{s.title}</h3>
            {s.titleAr && <span className="text-xs" style={{ color: 'var(--text-muted)' }}>/ {s.titleAr}</span>}
            {s.price && <span className="text-xs px-2 py-0.5 rounded tag-accent">{s.price}</span>}
          </div>
          {s.description && <p className="text-sm line-clamp-2" style={{ color: 'var(--text-muted)' }}>{s.description}</p>}
        </>
      )}
    />
  );
}
