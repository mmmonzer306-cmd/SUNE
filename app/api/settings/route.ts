import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();

  // Change password
  if (body.type === 'changePassword') {
    const { currentPassword, newPassword } = body;
    const admin = await prisma.admin.findUnique({ where: { id: 1 } });
    if (!admin) return NextResponse.json({ error: 'Admin not found' }, { status: 404 });

    const isValid = await bcrypt.compare(currentPassword, admin.password);
    if (!isValid) return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.admin.update({
      where: { id: 1 },
      data: { password: hashed, mustChangePass: false },
    });
    return NextResponse.json({ success: true });
  }

  // Update site settings
  const settings = await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: body,
    create: { id: 1, ...body },
  });
  return NextResponse.json(settings);
}
