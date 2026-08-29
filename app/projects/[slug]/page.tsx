import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { FiArrowLeft, FiGithub, FiExternalLink, FiArrowRight } from 'react-icons/fi';
import type { Metadata } from 'next';

function parseArray(v: unknown): string[] {
  if (Array.isArray(v)) return v as string[];
  if (typeof v === 'string') { try { const p = JSON.parse(v); return Array.isArray(p) ? p : []; } catch { return []; } }
  return [];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
    const { slug } = await params;
    const project = await prisma.project.findUnique({ where: { slug } });
    if (!project) return { title: 'Not Found' };
    return {
      title: `${project.name} | Alex Morgan`,
      description: project.description || '',
      openGraph: { title: project.name, images: project.imageUrl ? [project.imageUrl] : [] },
    };
  } catch {
    return { title: 'Alex Morgan' };
  }
}

export default async function ProjectCaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let project: any = null;
  let profile: any = null;
  let nextProject: any = null;
  try {
    [project, profile] = await Promise.all([
      prisma.project.findUnique({ where: { slug } }),
      prisma.profile.findUnique({ where: { id: 1 } }),
    ]);
    if (project) {
      project.techStack = parseArray(project.techStack);
      nextProject = await prisma.project.findFirst({
        where: { order: { gt: project.order } },
        orderBy: { order: 'asc' },
        select: { name: true, slug: true },
      }) || await prisma.project.findFirst({
        where: { id: { not: project.id } },
        orderBy: { order: 'asc' },
        select: { name: true, slug: true },
      });
    }
  } catch {}

  if (!project) notFound();

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-20" style={{ background: 'var(--bg)' }}>
        <div className="max-w-4xl mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs mb-10" style={{ color: 'var(--text-muted)' }}>
            <Link href="/" className="hover:text-[var(--accent)] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/#projects" className="hover:text-[var(--accent)] transition-colors">Projects</Link>
            <span>/</span>
            <span style={{ color: 'var(--accent)' }}>{project.name}</span>
          </nav>

          <p className="text-sm tracking-widest uppercase mb-3" style={{ color: 'var(--accent)' }}>&gt; case-study.md</p>
          <h1 className="text-3xl md:text-5xl font-black mb-8 leading-tight" style={{ color: 'var(--text)' }}>{project.name}</h1>

          {project.imageUrl && (
            <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden mb-10 tech-card !p-0">
              <Image src={project.imageUrl} alt={project.name} fill className="object-cover" priority />
            </div>
          )}

          {/* Meta bar */}
          <div className="tech-card p-5 mb-10 flex flex-wrap items-center gap-4 justify-between">
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech: string) => (
                <span key={tech} className="text-xs px-2.5 py-1 rounded"
                  style={{ background: 'var(--bg)', color: 'var(--accent-2)', border: '1px solid rgba(124,58,237,0.2)' }}>
                  {tech}
                </span>
              ))}
            </div>
            <div className="flex gap-3">
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm py-2 px-4 gap-2">
                  <FiExternalLink size={14} /> Live
                </a>
              )}
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-outline text-sm py-2 px-4 gap-2">
                  <FiGithub size={14} /> Code
                </a>
              )}
            </div>
          </div>

          {/* Body */}
          {project.caseStudy ? (
            <div className="prose prose-invert prose-lg max-w-none
              prose-headings:font-display prose-headings:text-[var(--text)]
              prose-p:text-[var(--text-muted)] prose-p:leading-relaxed
              prose-a:text-[var(--accent)] prose-code:text-[var(--accent)]
              prose-strong:text-[var(--text)] prose-li:text-[var(--text-muted)]">
              <ReactMarkdown>{project.caseStudy}</ReactMarkdown>
            </div>
          ) : (
            <p className="text-lg leading-relaxed" style={{ color: 'var(--text-muted)' }}>{project.description}</p>
          )}

          {/* Next project */}
          {nextProject?.slug && (
            <Link href={`/projects/${nextProject.slug}`}
              className="tech-card glow-hover mt-16 p-6 flex items-center justify-between group">
              <div>
                <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--muted)' }}>Next Project</p>
                <p className="font-bold text-lg" style={{ color: 'var(--text)' }}>{nextProject.name}</p>
              </div>
              <FiArrowRight size={20} className="transition-transform group-hover:translate-x-2" style={{ color: 'var(--accent)' }} />
            </Link>
          )}

          <Link href="/#projects" className="inline-flex items-center gap-2 text-sm mt-10 transition-colors"
            style={{ color: 'var(--text-muted)' }}>
            <FiArrowLeft /> Back to Projects
          </Link>
        </div>
      </main>
      <Footer profile={profile || {}} />
    </>
  );
}
