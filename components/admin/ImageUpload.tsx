'use client';
import { useState, useRef } from 'react';
import Image from 'next/image';
import { FiUpload, FiX, FiImage } from 'react-icons/fi';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  aspect?: 'square' | 'wide' | 'auto';
}

export default function ImageUpload({ value, onChange, folder = 'general', label = 'Image', aspect = 'wide' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(value || '');
  const inputRef = useRef<HTMLInputElement>(null);

  const heightClass = aspect === 'square' ? 'h-40 w-40 rounded-full' : aspect === 'wide' ? 'h-40 w-full rounded-lg' : 'h-32 w-full rounded-lg';

  const handleFile = async (file: File) => {
    setError('');
    setUploading(true);
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();

      if (res.ok) {
        onChange(data.url);
        setPreview(data.url);
      } else {
        setError(data.error || 'Upload failed');
        setPreview(value || '');
      }
    } catch {
      setError('Network error');
      setPreview(value || '');
    }
    setUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const clear = () => { setPreview(''); onChange(''); };

  return (
    <div>
      <label className="block text-sm  mb-2" style={{ color: 'var(--text-muted)' }}>{label}</label>
      <div
        className={`relative ${heightClass} flex items-center justify-center cursor-pointer transition-all overflow-hidden`}
        style={{ background: 'var(--surface)', border: `2px dashed ${uploading ? 'var(--accent)' : 'var(--border)'}` }}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {preview ? (
          <>
            <Image src={preview} alt="Preview" fill className="object-cover" />
            <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.6)' }}>
              <FiUpload size={24} className="text-white" />
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); clear(); }}
              className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center z-10 transition-colors"
              style={{ background: 'rgba(239,68,68,0.9)', color: 'white' }}
            >
              <FiX size={14} />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 p-4 text-center">
            {uploading ? (
              <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--accent)' }} />
            ) : (
              <>
                <FiImage size={28} style={{ color: 'var(--muted)' }} />
                <p className="text-xs " style={{ color: 'var(--text-muted)' }}>
                  Click or drag & drop<br />
                  <span style={{ color: 'var(--muted)' }}>JPG, PNG, WebP · max 5MB</span>
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* URL input as alternative */}
      <div className="mt-2 flex gap-2">
        <input
          type="text"
          placeholder="Or paste image URL..."
          value={preview.startsWith('blob:') ? '' : preview}
          onChange={(e) => { setPreview(e.target.value); onChange(e.target.value); }}
          className="tech-input text-sm py-2"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {error && <p className="text-xs mt-1 " style={{ color: '#ef4444' }}>{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />
    </div>
  );
}
