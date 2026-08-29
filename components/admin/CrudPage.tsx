'use client';
import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { FiPlus, FiTrash2, FiEdit, FiSave, FiX } from 'react-icons/fi';

export interface FieldDef {
  key: string;
  label: string;
  type?: 'text' | 'textarea' | 'number' | 'checkbox';
  rows?: number;
}

interface Props {
  title: string;
  kicker: string;
  endpoint: string;
  fields: FieldDef[];
  empty: Record<string, string | number | boolean>;
  renderItem: (item: any) => ReactNode;
  endpointSuffix?: string;
  headerExtra?: ReactNode;
}

export default function CrudPage({ title, kicker, endpoint, fields, empty, renderItem, endpointSuffix = '', headerExtra }: Props) {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState<Record<string, any>>({ ...empty });
  const [editing, setEditing] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(() => {
    fetch(endpoint + endpointSuffix).then(async (r) => {
      if (r.status === 401) { window.location.href = '/admin/login'; return; }
      return r.json();
    }).then((d) => { if (Array.isArray(d)) setItems(d); }).catch(() => {});
  }, [endpoint, endpointSuffix]);
  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (editing) {
      await fetch(endpoint, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editing, ...form }) });
    } else {
      await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    }
    setForm({ ...empty }); setEditing(null); setShowForm(false); load();
  };

  const del = async (id: number) => {
    if (!confirm('Delete?')) return;
    await fetch(endpoint, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    load();
  };

  const edit = (item: any) => { setForm({ ...empty, ...item }); setEditing(item.id); setShowForm(true); };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-sm uppercase tracking-widest mb-1" style={{ color: 'var(--accent)' }}>&gt; {kicker}</p>
            <h1 className="font-display text-2xl font-bold gradient-text">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
            {headerExtra}
            <button onClick={() => { setForm({ ...empty }); setEditing(null); setShowForm(true); }}
              className="btn-primary flex items-center gap-2 text-sm">
              <FiPlus /> Add
            </button>
          </div>
        </div>

        {showForm && (
          <div className="tech-card p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm" style={{ color: 'var(--accent)' }}>{editing ? '// Edit' : '// New'}</p>
              <button onClick={() => setShowForm(false)} style={{ color: 'var(--text-muted)' }}><FiX /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {fields.map((f) => (
                <div key={f.key} className={f.type === 'textarea' ? 'md:col-span-2' : ''}>
                  {f.type !== 'checkbox' && (
                    <label className="block text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>{f.label}</label>
                  )}
                  {f.type === 'checkbox' ? (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={!!form[f.key]}
                        onChange={(e) => setForm({ ...form, [f.key]: e.target.checked })}
                        style={{ accentColor: 'var(--accent)', width: 16, height: 16 }} />
                      <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{f.label}</span>
                    </label>
                  ) : f.type === 'textarea' ? (
                    <textarea value={String(form[f.key] ?? '')} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                      rows={f.rows || 3} className="tech-input text-sm resize-none" />
                  ) : (
                    <input type={f.type === 'number' ? 'number' : 'text'} value={String(form[f.key] ?? '')}
                      onChange={(e) => setForm({ ...form, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value })}
                      className="tech-input text-sm" />
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={save} className="btn-primary flex items-center gap-2 text-sm"><FiSave /> Save</button>
              <button onClick={() => setShowForm(false)} className="btn-outline text-sm">Cancel</button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="tech-card p-5 flex items-start gap-4">
              <div className="flex-1 min-w-0">{renderItem(item)}</div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => edit(item)} className="p-2 rounded transition-colors" style={{ color: 'var(--text-muted)' }}><FiEdit size={15} /></button>
                <button onClick={() => del(item.id)} className="p-2 rounded hover:text-red-400 transition-colors" style={{ color: 'var(--text-muted)' }}><FiTrash2 size={15} /></button>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <p className="text-center py-12 text-sm" style={{ color: 'var(--text-muted)' }}>{'// Nothing here yet. Click "Add" to create the first one.'}</p>
          )}
        </div>
      </main>
    </div>
  );
}
