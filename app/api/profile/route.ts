import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const profile = await prisma.profile.findUnique({ where: { id: 1 } });
    return NextResponse.json(profile);
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const data = await req.json();
    const profile = await prisma.profile.upsert({
      where: { id: 1 },
      update: data,
      create: { id: 1, name: data.name || 'Alex Morgan', title: data.title || 'Developer', ...data },
    });
    return NextResponse.json(profile);
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
