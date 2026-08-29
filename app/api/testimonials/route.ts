import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Public review submissions: 3 per hour per IP.
const hits = new Map<string, { count: number; reset: number }>();
const WINDOW = 60 * 60 * 1000;
const LIMIT = 3;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || entry.reset < now) {
    hits.set(ip, { count: 1, reset: now + WINDOW });
    return false;
  }
  entry.count += 1;
  return entry.count > LIMIT;
}

const clamp = (v: unknown, min: number, max: number, fallback: number) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.round(n)));
};

const str = (v: unknown, max: number) =>
  typeof v === 'string' ? v.trim().slice(0, max) : '';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const admin = searchParams.get('all') === '1' ? await getServerSession(authOptions) : null;
  const rows = await prisma.testimonial.findMany({
    where: admin ? {} : { approved: true },
    orderBy: { order: 'asc' },
  });
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  if (!session) {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: 'Too many submissions. Try again later.' }, { status: 429 });
    }
  }

  const name = str(body.name, 100);
  const content = str(body.content, 2000);
  if (name.length < 2 || content.length < 5) {
    return NextResponse.json({ error: 'Name and review text are required' }, { status: 400 });
  }

  // Explicit allow-list: never trust `approved` or `order` from the client.
  const row = await prisma.testimonial.create({
    data: {
      name,
      content,
      role: str(body.role, 120) || null,
      roleAr: str(body.roleAr, 120) || null,
      contentAr: str(body.contentAr, 2000) || null,
      avatar: str(body.avatar, 500) || null,
      rating: clamp(body.rating, 1, 5, 5),
      order: session ? clamp(body.order, 0, 9999, 0) : 0,
      approved: !!session,
    },
  });
  return NextResponse.json(row);
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id, ...data } = await req.json();
  const row = await prisma.testimonial.update({ where: { id }, data });
  return NextResponse.json(row);
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await req.json();
  await prisma.testimonial.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
