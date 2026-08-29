import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function GET() {
  const rows = await prisma.textSnippet.findMany();
  const map: Record<string, { value: string; valueAr: string | null }> = {};
  for (const r of rows) map[r.key] = { value: r.value, valueAr: r.valueAr };
  return NextResponse.json(map);
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { key, value, valueAr } = await req.json();
  if (!key || typeof value !== 'string') return NextResponse.json({ error: 'Invalid' }, { status: 400 });
  const row = await prisma.textSnippet.upsert({
    where: { key }, update: { value, valueAr }, create: { key, value, valueAr },
  });
  revalidatePath('/', 'page');
  return NextResponse.json(row);
}

export async function POST(req: NextRequest) {
  return PUT(req);
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { key } = await req.json();
  await prisma.textSnippet.delete({ where: { key } });
  revalidatePath('/', 'page');
  return NextResponse.json({ success: true });
}
