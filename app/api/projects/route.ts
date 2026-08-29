import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

function parseArray(v: unknown): string[] {
  if (Array.isArray(v)) return v as string[];
  if (typeof v === 'string') { try { const p = JSON.parse(v); return Array.isArray(p) ? p : []; } catch { return []; } }
  return [];
}

export async function GET() {
  const projects = await prisma.project.findMany({ orderBy: { order: 'asc' } });
  const mapped = projects.map((p: any) => ({ ...p, techStack: parseArray(p.techStack) }));
  return NextResponse.json(mapped);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const data = await req.json();
  if (Array.isArray(data.techStack)) data.techStack = JSON.stringify(data.techStack);
  if (!data.slug) {
    const slugify = (await import('slugify')).default;
    data.slug = slugify(data.name || 'project', { lower: true, strict: true });
    const existing = await prisma.project.findUnique({ where: { slug: data.slug } });
    if (existing) data.slug = `${data.slug}-${Date.now().toString(36)}`;
  }
  const project = await prisma.project.create({ data });
  return NextResponse.json({ ...project, techStack: parseArray((project as any).techStack) });
}
