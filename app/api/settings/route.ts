import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { revalidatePath, revalidateTag } from 'next/cache';

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
    if (typeof newPassword !== 'string' || newPassword.length < 8) {
      return NextResponse.json({ error: 'New password must be at least 8 characters' }, { status: 400 });
    }
    const admin = await prisma.admin.findUnique({ where: { id: 1 } });
    if (!admin) return NextResponse.json({ error: 'Admin not found' }, { status: 404 });

    const isValid = await bcrypt.compare(String(currentPassword || ''), admin.password);
    if (!isValid) return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.admin.update({
      where: { id: 1 },
      data: { password: hashed, mustChangePass: false },
    });
    return NextResponse.json({ success: true });
  }

  // Save security question
  if (body.type === 'securityQuestion') {
    const crypto = await import('crypto');
    const { question, answer } = body;
    if (!String(question || '').trim() || !String(answer || '').trim()) {
      return NextResponse.json({ error: 'Question and answer are required' }, { status: 400 });
    }
    await prisma.admin.update({
      where: { id: 1 },
      data: {
        securityQuestion: String(question).trim().slice(0, 300),
        securityAnswer: crypto.createHash('sha256').update(String(answer).trim().toLowerCase()).digest('hex'),
      },
    });
    return NextResponse.json({ success: true });
  }

  // Update site settings — explicit allow-list, never spread raw client input.
  const data: Record<string, string> = {};
  if (body.theme === 'dark' || body.theme === 'light') data.theme = body.theme;
  if (body.lang === 'en' || body.lang === 'ar') data.lang = body.lang;
  if (typeof body.metaTitle === 'string') data.metaTitle = body.metaTitle.trim().slice(0, 200);
  if (typeof body.metaDesc === 'string') data.metaDesc = body.metaDesc.trim().slice(0, 400);

  const settings = await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: data,
    create: { id: 1, ...data },
  });
  revalidateTag('site-settings');
  revalidatePath('/', 'layout');
  return NextResponse.json(settings);
}
