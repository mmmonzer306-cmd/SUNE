import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import slugify from 'slugify';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const all = searchParams.get('all');
  const session = await getServerSession(authOptions);
  const where = all && session ? {} : { published: true };
  const articles = await prisma.article.findMany({
    where, orderBy: { createdAt: 'desc' },
    select: { id: true, title: true, slug: true, excerpt: true, coverImage: true, tags: true, published: true, views: true, createdAt: true },
  });
  return NextResponse.json(articles);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const data = await req.json();
  const slug = slugify(data.title, { lower: true, strict: true });
  const article = await prisma.article.create({ data: { ...data, slug } });
  return NextResponse.json(article);
}
