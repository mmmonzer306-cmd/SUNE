import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import slugify from 'slugify';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const article = await prisma.article.findUnique({ where: { slug: params.id } });
  if (!article) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  await prisma.article.update({ where: { id: article.id }, data: { views: { increment: 1 } } });
  return NextResponse.json(article);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const data = await req.json();
  if (data.title) data.slug = slugify(data.title, { lower: true, strict: true });
  const article = await prisma.article.update({ where: { id: Number(params.id) }, data });
  return NextResponse.json(article);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await prisma.article.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ success: true });
}
