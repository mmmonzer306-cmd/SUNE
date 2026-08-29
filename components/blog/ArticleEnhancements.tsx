'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { FiLink, FiTwitter, FiLinkedin, FiCheck } from 'react-icons/fi';
import { toast } from '@/components/ui/Toast';

export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <motion.div className="fixed top-0 left-0 right-0 h-[3px] z-[60] origin-left"
      style={{ scaleX: progress, background: 'linear-gradient(90deg, var(--accent), var(--accent-2))' }} />
  );
}

export function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined' ? window.location.href : '';

  const copy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      toast('Link copied');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs uppercase tracking-widest mr-1" style={{ color: 'var(--muted)' }}>Share</span>
      <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
        target="_blank" rel="noopener noreferrer" aria-label="Share on Twitter"
        className="p-2 rounded-lg transition-all hover:scale-110"
        style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
        <FiTwitter size={14} />
      </a>
      <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn"
        className="p-2 rounded-lg transition-all hover:scale-110"
        style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
        <FiLinkedin size={14} />
      </a>
      <button onClick={copy} aria-label="Copy link"
        className="p-2 rounded-lg transition-all hover:scale-110"
        style={{ color: copied ? 'var(--accent)' : 'var(--text-muted)', border: '1px solid var(--border)' }}>
        {copied ? <FiCheck size={14} /> : <FiLink size={14} />}
      </button>
    </div>
  );
}

export function ArticleBody({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  // Add copy buttons to code blocks
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    root.querySelectorAll('pre').forEach((pre) => {
      if (pre.querySelector('.copy-code-btn')) return;
      const btn = document.createElement('button');
      btn.className = 'copy-code-btn';
      btn.textContent = 'Copy';
      btn.style.cssText = 'position:absolute;top:8px;right:8px;padding:4px 10px;font-size:11px;border-radius:6px;background:var(--bg);color:var(--accent);border:1px solid var(--border);cursor:pointer;z-index:5;';
      btn.onclick = () => {
        navigator.clipboard.writeText(pre.textContent?.replace(/^Copy/, '') || '').then(() => {
          btn.textContent = '✓ Copied';
          setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
        });
      };
      (pre as HTMLElement).style.position = 'relative';
      pre.appendChild(btn);
    });
  }, []);

  return <div ref={ref}>{children}</div>;
}
