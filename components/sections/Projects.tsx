'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiGithub, FiExternalLink } from 'react-icons/fi';
import Image from 'next/image';
import { useApp } from '@/lib/AppContext';

interface Project {
  id: number; name: string; nameAr: string | null; nameFr: string | null;
  description: string | null; descAr: string | null; descFr: string | null;
  techStack: string[]; githubUrl: string | null; liveUrl: string | null;
  imageUrl: string | null; featured: boolean;
}

export default function Projects({ projects }: { projects: Project[] }) {
  const { t, lang } = useApp();
  const [filter, setFilter] = useState<'all' | 'featured'>('all');
  const filtered = filter === 'featured' ? projects.filter((p) => p.featured) : projects;

  const getName = (p: Project) => (lang === 'ar' && p.nameAr) ? p.nameAr : (lang === 'fr' && p.nameFr) ? p.nameFr : p.name;
  const getDesc = (p: Project) => (lang === 'ar' && p.descAr) ? p.descAr : (lang === 'fr' && p.descFr) ? p.descFr : p.description;

  return (
    <section id="projects" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-16">
          <p className=" text-sm tracking-widest uppercase mb-3" style={{ color: 'var(--accent)' }}>
            &gt; projects.json
          </p>
          <h2 className="section-title gradient-text mb-4">{t('projects.title')}</h2>
          <div className="w-24 h-px mx-auto mb-8" style={{ background: `linear-gradient(to right, transparent, var(--accent), transparent)` }} />
          <div className="inline-flex gap-1 p-1 rounded-lg" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            {['all', 'featured'].map((f) => (
              <button key={f} onClick={() => setFilter(f as typeof filter)}
                className="px-4 py-2 rounded-md text-sm  capitalize transition-all"
                style={{ background: filter === f ? 'var(--accent)' : 'transparent', color: filter === f ? '#0a0a0f' : 'var(--text-muted)', fontWeight: filter === f ? 700 : 400 }}>
                {f}
              </button>
            ))}
          </div>
        </motion.div>

        {filtered.length === 0 ? (
          <div className="text-center  py-20" style={{ color: 'var(--text-muted)' }}>// No projects yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project, i) => (
              <motion.div key={project.id}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="tech-card glow-box-hover overflow-hidden group flex flex-col">
                <div className="relative h-48 overflow-hidden" style={{ background: 'var(--bg)' }}>
                  {project.imageUrl ? (
                    <Image src={project.imageUrl} alt={getName(project)} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-display text-4xl font-black transition-colors" style={{ color: 'var(--border)' }}>
                        {getName(project).slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                  )}
                  {project.featured && (
                    <span className="absolute top-3 right-3 text-xs  px-2 py-1 rounded"
                      style={{ background: 'rgba(0,212,255,0.2)', color: 'var(--accent)', border: '1px solid rgba(0,212,255,0.3)' }}>
                      Featured
                    </span>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text)' }}>{getName(project)}</h3>
                  <p className="text-sm leading-relaxed mb-4 flex-1 line-clamp-3" style={{ color: 'var(--text-muted)' }}>
                    {getDesc(project)}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack.map((tech) => (
                      <span key={tech} className="text-xs  px-2 py-1 rounded"
                        style={{ background: 'var(--bg)', color: 'var(--accent-2)', border: '1px solid rgba(124,58,237,0.2)' }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm  transition-colors"
                        style={{ color: 'var(--text-muted)' }}>
                        <FiGithub size={14} /> Code
                      </a>
                    )}
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm  transition-colors"
                        style={{ color: 'var(--accent)' }}>
                        <FiExternalLink size={14} /> {t('project.view')}
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
