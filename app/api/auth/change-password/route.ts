import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { currentPass, newPass } = await req.json();

    if (!newPass || newPass.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    const admin = await prisma.admin.findUnique({ where: { id: 1 } });
    if (!admin) return NextResponse.json({ error: 'Admin not found' }, { status: 404 });

    const isValid = await bcrypt.compare(currentPass, admin.password);
    if (!isValid) return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });

    const hashed = await bcrypt.hash(newPass, 12);
    await prisma.admin.update({
      where: { id: 1 },
      data: { password: hashed, mustChangePass: false },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to change password' }, { status: 500 });
  }
}
