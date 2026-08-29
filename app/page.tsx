import { prisma } from '@/lib/prisma';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import Marquee from '@/components/sections/Marquee';
import About from '@/components/sections/About';
import Stats from '@/components/sections/Stats';
import Blocks from '@/components/sections/Blocks';
import Skills from '@/components/sections/Skills';
import Services from '@/components/sections/Services';
import Experience from '@/components/sections/Experience';
import Projects from '@/components/sections/Projects';
import Testimonials from '@/components/sections/Testimonials';
import BlogPreview from '@/components/sections/BlogPreview';
import FaqSection from '@/components/sections/FaqSection';
import FinalCta from '@/components/sections/FinalCta';
import Contact from '@/components/sections/Contact';
import Spotlight from '@/components/ui/Spotlight';
import ToastHost from '@/components/ui/Toast';
import BackToTop from '@/components/ui/BackToTop';
import DotsNav from '@/components/ui/DotsNav';
import Cursor from '@/components/ui/Cursor';
import CommandPalette from '@/components/ui/CommandPalette';
import Splash from '@/components/ui/Splash';
import WhatsAppFloat from '@/components/ui/WhatsAppFloat';

export const revalidate = 3600;

function parseArray(v: unknown): string[] {
  if (Array.isArray(v)) return v as string[];
  if (typeof v === 'string') { try { const p = JSON.parse(v); return Array.isArray(p) ? p : []; } catch { return []; } }
  return [];
}

export default async function HomePage() {
  let profile = null, skills: any[] = [], projects: any[] = [], articles: any[] = [],
    services: any[] = [], experience: any[] = [], testimonials: any[] = [],
    faqs: any[] = [], stats: any[] = [], blocks: any[] = [];
  let snippetRows: { key: string; value: string; valueAr: string | null }[] = [];
  try {
    [profile, skills, projects, articles, services, experience, testimonials, faqs, stats, blocks, snippetRows] = await Promise.all([
      prisma.profile.findUnique({ where: { id: 1 } }),
      prisma.skill.findMany({ orderBy: { order: 'asc' } }),
      prisma.project.findMany({ orderBy: { order: 'asc' } }),
      prisma.article.findMany({
        where: { published: true }, orderBy: { createdAt: 'desc' }, take: 3,
        select: { id: true, title: true, slug: true, excerpt: true, tags: true, coverImage: true, createdAt: true, views: true },
      }),
      prisma.service.findMany({ orderBy: { order: 'asc' } }),
      prisma.experience.findMany({ orderBy: { order: 'asc' } }),
      prisma.testimonial.findMany({ where: { approved: true }, orderBy: { order: 'asc' } }),
      prisma.fAQ.findMany({ orderBy: { order: 'asc' } }),
      prisma.stat.findMany({ orderBy: { order: 'asc' } }),
      prisma.block.findMany({ where: { visible: true }, orderBy: { order: 'asc' } }),
      prisma.textSnippet.findMany(),
    ]);
    projects = projects.map((p) => ({ ...p, techStack: parseArray(p.techStack) }));
    articles = articles.map((a) => ({ ...a, tags: parseArray(a.tags) }));
  } catch (e) {
    console.error('DB error:', e);
  }

  const snippetMap: Record<string, { value: string; valueAr: string | null }> = {};
  for (const r of snippetRows) snippetMap[r.key] = { value: r.value, valueAr: r.valueAr };

  const p = profile || { name: 'Alex Morgan', title: 'Full-Stack Developer' };

  return (
    <>
      <a href="#home" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg"
        style={{ background: 'var(--accent)', color: '#fff' }}>Skip to content</a>
      <Splash snippets={snippetMap} />
      <Spotlight />
      <ToastHost />
      <BackToTop />
      <DotsNav snippets={snippetMap} />
      <Cursor />
      <CommandPalette projects={projects} articles={articles} />
      <WhatsAppFloat href={(p as any).whatsapp || (p as any).phone} />
      <Navbar snippets={snippetMap} />
      <main>
        <Hero profile={p as any} snippets={snippetMap} />
      <Marquee snippets={snippetMap} />
        <About profile={p as any} snippets={snippetMap} />
        <Blocks blocks={blocks} snippets={snippetMap} />
        <Stats stats={stats} snippets={snippetMap} />
        <Skills skills={skills} snippets={snippetMap} />
        <Services services={services} snippets={snippetMap} whatsapp={(p as any).whatsapp || (p as any).phone} />
        <Experience items={experience} snippets={snippetMap} />
        <Projects projects={projects} snippets={snippetMap} />
        <Testimonials items={testimonials} snippets={snippetMap} />
        <BlogPreview articles={articles} snippets={snippetMap} />
        <FaqSection items={faqs} snippets={snippetMap} />
        <FinalCta />
        <Contact profile={p as any} snippets={snippetMap} />
      </main>
      <Footer profile={p as any} snippets={snippetMap} />
    </>
  );
}
