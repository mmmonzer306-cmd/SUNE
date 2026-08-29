import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import slugify from 'slugify';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numericId = Number(id);
  const article = Number.isFinite(numericId)
    ? await prisma.article.findUnique({ where: { id: numericId } })
    : await prisma.article.findUnique({ where: { slug: id } });
  if (!article) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (!Number.isFinite(numericId)) {
    await prisma.article.update({ where: { id: article.id }, data: { views: { increment: 1 } } });
  }
  return NextResponse.json(article);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const data = await req.json();
  if (Array.isArray(data.tags)) data.tags = JSON.stringify(data.tags);
  if (data.title) data.slug = slugify(data.title, { lower: true, strict: true });
  const article = await prisma.article.update({ where: { id: Number(id) }, data });
  return NextResponse.json(article);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  await prisma.article.delete({ where: { id: Number(id) } });
  return NextResponse.json({ success: true });
}
