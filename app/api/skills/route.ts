import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const skills = await prisma.skill.findMany({ orderBy: { order: 'asc' } });
  return NextResponse.json(skills);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const data = await req.json();
  const skill = await prisma.skill.create({ data });
  return NextResponse.json(skill);
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id, ...data } = await req.json();
  const skill = await prisma.skill.update({ where: { id }, data });
  return NextResponse.json(skill);
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await req.json();
  await prisma.skill.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
