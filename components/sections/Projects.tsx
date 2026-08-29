'use client';
import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { FiGithub, FiExternalLink, FiBookOpen, FiStar } from 'react-icons/fi';
import Image from 'next/image';
import Link from 'next/link';
import { useApp } from '@/lib/AppContext';
import SectionHeader from './SectionHeader';

function asArray(v: unknown): string[] {
  if (Array.isArray(v)) return v as string[];
  if (typeof v === 'string') { try { const p = JSON.parse(v); return Array.isArray(p) ? p : []; } catch { return []; } }
  return [];
}

interface Project {
  id: number; name: string; nameAr: string | null;
  description: string | null; descAr: string | null;
  techStack: string[] | string; githubUrl: string | null; liveUrl: string | null;
  imageUrl: string | null; featured: boolean; slug: string | null;
}

type Snippets = Record<string, { value: string; valueAr: string | null }>;

function ProjectCard({ project, i, lang, t, snippets }: { project: Project; i: number; lang: string; t: (k: string) => string; snippets: Snippets }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const rx = useSpring(useMotionValue(0), { stiffness: 180, damping: 20 });
  const ry = useSpring(useMotionValue(0), { stiffness: 180, damping: 20 });

  const onMove = (e: React.PointerEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    rx.set(((e.clientY - r.top) / r.height - 0.5) * -7);
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 9);
  };
  const onLeave = () => { rx.set(0); ry.set(0); setHovered(false); };

  const storyLabel = snippets['projects.story'];
  const storyText = storyLabel ? (lang === 'ar' && storyLabel.valueAr ? storyLabel.valueAr : storyLabel.value) : (lang === 'ar' ? 'القصة' : 'Story');

  const name = (lang === 'ar' && project.nameAr) ? project.nameAr : project.name;
  const desc = (lang === 'ar' && project.descAr) ? project.descAr : project.description;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: i * 0.09, type: 'spring', stiffness: 120, damping: 16 }}
      style={{ perspective: 1100 }}
      className={project.featured ? 'md:col-span-2' : ''}
    >
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={onLeave}
        animate={{ y: hovered ? -8 : 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{
          rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d',
          boxShadow: hovered
            ? '0 32px 64px -16px rgba(0,0,0,0.55), 0 0 0 1px rgba(0,212,255,0.14), 0 0 48px var(--accent-glow)'
            : '0 10px 30px -10px var(--shadow)',
        }}
        className="tech-card group relative flex flex-col h-full overflow-hidden"
      >
        {/* ==== Image ==== */}
        <div className={`relative overflow-hidden ${project.featured ? 'h-64' : 'h-48'}`}
          style={{ transform: 'translateZ(20px)' }}>
          {project.imageUrl ? (
            <Image src={project.imageUrl} alt={name} fill sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-[0.6deg]" />
          ) : (
            <div className="w-full h-full flex items-center justify-center grid-bg" style={{ background: 'var(--bg)' }}>
              <span className="font-display text-5xl font-black" style={{ color: 'var(--border-strong)' }}>
                {name.slice(0, 2).toUpperCase()}
              </span>
            </div>
          )}
          {/* readability gradient */}
          <div className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
            style={{ background: 'linear-gradient(to top, var(--card), transparent)' }} />
          {/* sweeping light on hover */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{ x: hovered ? ['-120%', '130%'] : '-120%' }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
            style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 50%, transparent 60%)' }}
          />
          {project.featured && (
            <motion.span
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-4 end-4 flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md"
              style={{ background: 'rgba(0,0,0,0.55)', color: 'var(--accent)', border: '1px solid rgba(0,212,255,0.35)', boxShadow: '0 0 18px rgba(0,212,255,0.25)' }}>
              <FiStar size={11} /> Featured
            </motion.span>
          )}
        </div>

        {/* ==== Body ==== */}
        <div className="p-6 flex-1 flex flex-col" style={{ transform: 'translateZ(24px)' }}>
          <h3 className="text-xl font-black mb-2 transition-colors duration-300"
            style={{ color: 'var(--text)' }}>
            {name}
          </h3>
          <p className="text-sm leading-relaxed mb-4 flex-1 line-clamp-3" style={{ color: 'var(--text-muted)' }}>
            {desc}
          </p>

          {/* tech pills */}
          <div className="flex flex-wrap gap-2 mb-5">
            {asArray(project.techStack).slice(0, 6).map((tech) => (
              <span key={tech}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-full transition-all duration-300"
                style={{
                  background: hovered ? 'var(--accent-glow)' : 'var(--bg)',
                  color: 'var(--accent)',
                  border: `1px solid ${hovered ? 'rgba(0,212,255,0.3)' : 'var(--border)'}`,
                }}>
                {tech}
              </span>
            ))}
          </div>

          {/* links */}
          <div className="flex items-center gap-2.5 mt-auto pt-2" style={{ borderTop: '1px solid var(--border)' }}>
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-all hover:-translate-y-0.5"
                style={{ color: 'var(--text-muted)', background: 'var(--bg)', border: '1px solid var(--border)' }}>
                <FiGithub size={13} /> Code
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-all hover:-translate-y-0.5"
                style={{ color: 'var(--accent)', background: 'var(--accent-glow)', border: '1px solid rgba(0,212,255,0.25)' }}>
                <FiExternalLink size={13} /> {t('project.view')}
              </a>
            )}
            {project.slug && (
              <Link href={`/projects/${project.slug}`}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-all hover:-translate-y-0.5 ms-auto"
                style={{ color: 'var(--accent-2)', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)' }}>
                <FiBookOpen size={13} /> {storyText}
              </Link>
            )}
          </div>
        </div>

        {/* bottom accent line on hover */}
        <motion.div className="absolute bottom-0 inset-x-0 h-[2px]"
          animate={{ scaleX: hovered ? 1 : 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ background: 'linear-gradient(90deg, var(--accent), var(--accent-2))', transformOrigin: lang === 'ar' ? 'right' : 'left' }}
        />
      </motion.div>
    </motion.div>
  );
}

export default function Projects({ projects, snippets = {} }: { projects: Project[]; snippets?: Snippets }) {
  const { t, lang } = useApp();
  const [filter, setFilter] = useState<'all' | 'featured'>('all');
  const filtered = filter === 'featured' ? projects.filter((p) => p.featured) : projects;

  const snip = (k: string, fb: string) => {
    const s = snippets[k];
    return s ? ((lang === 'ar' && s.valueAr) ? s.valueAr : s.value) : fb;
  };

  return (
    <section id="projects" className="py-32 relative overflow-hidden">
      {/* ambient glows */}
      <div className="absolute top-20 start-1/4 w-[500px] h-80 blur-3xl opacity-50 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(0,212,255,0.06), transparent 70%)' }} />
      <div className="absolute bottom-10 end-1/4 w-[420px] h-64 blur-3xl opacity-50 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(124,58,237,0.07), transparent 70%)' }} />

      <div className="relative max-w-7xl mx-auto px-6">
        <SectionHeader kicker={snip('kicker.projects', 'projects.json')} title={t('projects.title')} hint={t('projects.hint')} />

        {/* filter pills */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="flex justify-center mb-14">
          <div className="inline-flex gap-1.5 p-1.5 rounded-full backdrop-blur-md"
            style={{ background: 'color-mix(in srgb, var(--card) 80%, transparent)', border: '1px solid var(--border)' }}>
            {(['all', 'featured'] as const).map((f) => {
              const active = filter === f;
              return (
                <button key={f} onClick={() => setFilter(f)}
                  className="px-5 py-2 rounded-full text-sm transition-all duration-300 flex items-center gap-1.5"
                  style={{
                    background: active ? 'linear-gradient(135deg, var(--accent), var(--accent-2))' : 'transparent',
                    color: active ? '#fff' : 'var(--text-muted)',
                    fontWeight: active ? 700 : 500,
                    boxShadow: active ? '0 6px 20px var(--accent-glow)' : 'none',
                  }}>
                  {f === 'featured' && <FiStar size={12} />}
                  {f === 'all' ? snip('projects.all', lang === 'ar' ? 'الكل' : 'All') : snip('projects.featured', lang === 'ar' ? 'مميز' : 'Featured')}
                </button>
              );
            })}
          </div>
        </motion.div>

        {filtered.length === 0 ? (
          <div className="tech-card text-center py-20 px-8 max-w-lg mx-auto">
            <div className="text-5xl mb-4 opacity-40">🛠️</div>
              <p className="mb-2 font-semibold" style={{ color: 'var(--text)' }}>
              {snip('projects.emptyTitle', lang === 'ar' ? 'مشاريعي القادمة في الطريق' : 'New projects are on the way')}
            </p>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
              {snip('projects.emptyText', lang === 'ar' ? 'ستظهر هنا أعمالي قريبًا - أو لنبدأ مشروعك أنت أولاً' : "My work will appear here soon - or let's start your project first")}
            </p>
            <a href="#contact" className="btn-primary text-sm">{t('hero.button1')}</a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project, i) => (
              <ProjectCard key={project.id} project={project} i={i} lang={lang} t={t} snippets={snippets} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
