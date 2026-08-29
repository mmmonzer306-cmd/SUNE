import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const [
    articles, projects, messages, unread, skills, services,
    experience, testimonials, faqs, stats, blocks,
  ] = await Promise.all([
    prisma.article.count(),
    prisma.project.count(),
    prisma.message.count(),
    prisma.message.count({ where: { read: false } }),
    prisma.skill.count(),
    prisma.service.count(),
    prisma.experience.count(),
    prisma.testimonial.count(),
    prisma.fAQ.count(),
    prisma.stat.count(),
    prisma.block.count(),
  ]);
  return NextResponse.json({
    name: session.user?.name || 'Admin',
    articles, projects, messages, unread, skills, services,
    experience, testimonials, faqs, stats, blocks,
  });
}
