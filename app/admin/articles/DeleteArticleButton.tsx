'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiTrash2 } from 'react-icons/fi';

export default function DeleteArticleButton({ id }: { id: number }) {
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const del = async () => {
    if (!confirm('Delete this article?')) return;
    setDeleting(true);
    await fetch(`/api/articles/${id}`, { method: 'DELETE' });
    router.refresh();
  };

  return (
    <button onClick={del} disabled={deleting} title="Delete"
      className="p-2 transition-colors hover:text-red-400 disabled:opacity-40"
      style={{ color: 'var(--text-muted)' }}>
      <FiTrash2 size={16} />
    </button>
  );
}
