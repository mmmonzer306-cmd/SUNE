import { prisma } from '@/lib/prisma';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Skills from '@/components/sections/Skills';
import Projects from '@/components/sections/Projects';
import BlogPreview from '@/components/sections/BlogPreview';
import Contact from '@/components/sections/Contact';

export const revalidate = 60;

export default async function HomePage() {
  let profile = null, skills = [], projects = [], articles = [];
  try {
    [profile, skills, projects, articles] = await Promise.all([
      prisma.profile.findUnique({ where: { id: 1 } }),
      prisma.skill.findMany({ orderBy: { order: 'asc' } }),
      prisma.project.findMany({ orderBy: { order: 'asc' } }),
      prisma.article.findMany({
        where: { published: true }, orderBy: { createdAt: 'desc' }, take: 3,
        select: { id: true, title: true, slug: true, excerpt: true, tags: true, coverImage: true, createdAt: true, views: true },
      }),
    ]);
  } catch (e) {
    console.error('DB error:', e);
  }

  const p = profile || { name: 'Mohammed Mohsen', title: 'Full-Stack Developer' };

  return (
    <>
      <Navbar />
      <main>
        <Hero profile={p as any} />
        <About profile={p as any} />
        <Skills skills={skills} />
        <Projects projects={projects} />
        <BlogPreview articles={articles as any} />
        <Contact profile={p as any} />
      </main>
      <Footer profile={p as any} />
    </>
  );
}
