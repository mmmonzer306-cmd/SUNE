import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();
    if (!name || !email || !message) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    await prisma.message.create({ data: { name, email, subject, message } });

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST, port: Number(process.env.EMAIL_PORT),
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      });
      await transporter.sendMail({
        from: process.env.EMAIL_USER, to: process.env.EMAIL_USER,
        subject: `Portfolio Contact: ${subject || 'New Message'}`,
        html: `<h3>From: ${name} (${email})</h3><p>${message}</p>`,
      });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const messages = await prisma.message.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(messages);
}
