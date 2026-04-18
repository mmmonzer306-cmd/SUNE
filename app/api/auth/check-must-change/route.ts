import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ mustChange: false });

  const admin = await prisma.admin.findUnique({ where: { id: 1 } });
  return NextResponse.json({ mustChange: admin?.mustChangePass ?? false });
}
