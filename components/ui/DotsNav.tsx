'use client';
import { useEffect, useState } from 'react';
import { useApp } from '@/lib/AppContext';

const SECTIONS = ['home', 'about', 'stats', 'skills', 'services', 'experience', 'projects', 'testimonials', 'blog', 'faq', 'contact'];

type Snippets = Record<string, { value: string; valueAr: string | null }>;

export default function DotsNav({ snippets = {} }: { snippets?: Snippets }) {
  const { t, lang } = useApp();
  const [active, setActive] = useState('home');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    const existing = SECTIONS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    existing.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const snip = (key: string, fallback: string) => {
    const value = snippets[key];
    return value ? (value.valueAr && lang === 'ar' ? value.valueAr : value.value) : fallback;
  };
  const labels: Record<string, string> = {
    home: snip('nav.home', t('nav.home')), about: snip('nav.about', t('nav.about')), stats: snip('nav.stats', t('stats.title')), skills: snip('nav.skills', t('nav.skills')),
    services: snip('nav.services', t('services.title')), experience: snip('nav.experience', t('experience.title')), projects: snip('nav.projects', t('nav.works')),
    testimonials: snip('nav.testimonials', t('testimonials.title')), blog: snip('nav.blog', t('nav.blog')), faq: snip('nav.faq', t('faq.title')), contact: snip('nav.contact', t('nav.contact')),
  };

  return (
    <nav className="dots-nav fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-3"
      aria-label="Section navigation">
      {SECTIONS.map((id) => (
        <a key={id} href={`#${id}`} className={active === id ? 'active' : ''}>
          <span className="dot-label">{labels[id]}</span>
        </a>
      ))}
    </nav>
  );
}
