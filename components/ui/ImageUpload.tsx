'use client';
import { useState, useRef } from 'react';
import { FiUpload, FiImage, FiX } from 'react-icons/fi';
import Image from 'next/image';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUpload({ value, onChange, label = 'Image' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    setUploading(true);
    setError('');
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (data.url) onChange(data.url);
      else setError(data.error || 'Upload failed');
    } catch {
      setError('Upload failed');
    }
    setUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) upload(file);
  };

  return (
    <div>
      {label && <label className="block text-sm font-mono mb-2" style={{ color: 'var(--text-muted)' }}>{label}</label>}
      <div
        className={`drop-zone p-4 cursor-pointer ${dragOver ? 'drag-over' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        {value ? (
          <div className="relative">
            <div className="relative w-full h-40 rounded-lg overflow-hidden">
              <Image src={value} alt="Upload" fill className="object-cover" />
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onChange(''); }}
              className="absolute top-2 right-2 p-1.5 rounded-full text-white"
              style={{ background: 'rgba(0,0,0,0.6)' }}
            >
              <FiX size={14} />
            </button>
          </div>
        ) : (
          <div className="text-center py-6">
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-2 rounded-full border-t-transparent animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
                <span className="text-sm font-mono" style={{ color: 'var(--text-muted)' }}>Uploading...</span>
              </div>
            ) : (
              <>
                <FiUpload className="mx-auto text-3xl mb-2" style={{ color: 'var(--muted)' }} />
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Drag & drop or <span style={{ color: 'var(--accent)' }}>click to upload</span>
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>JPEG, PNG, WebP, GIF — max 5MB</p>
              </>
            )}
          </div>
        )}
      </div>
      {/* OR enter URL */}
      <div className="flex items-center gap-2 mt-2">
        <FiImage size={14} style={{ color: 'var(--muted)', flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Or paste image URL..."
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          className="tech-input py-2 text-sm"
        />
      </div>
      {error && <p className="text-red-400 text-xs mt-1 font-mono">{error}</p>}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }} />
    </div>
  );
}
