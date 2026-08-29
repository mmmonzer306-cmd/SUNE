import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const hash = (s: string) => crypto.createHash('sha256').update(s.trim().toLowerCase()).digest('hex');

// Brute-force guard: the security answer is a single low-entropy secret,
// so unlimited attempts would make account takeover trivial.
const attempts = new Map<string, { count: number; reset: number }>();
const WINDOW = 15 * 60 * 1000;
const LIMIT = 5;

function tooManyAttempts(ip: string): boolean {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || entry.reset < now) {
    attempts.set(ip, { count: 1, reset: now + WINDOW });
    return false;
  }
  entry.count += 1;
  return entry.count > LIMIT;
}

// POST step 1: get security question | step 2: verify answer & reset
export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
    if (tooManyAttempts(ip)) {
      return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 });
    }

    const body = await req.json();
    const { step, username, answer, newPassword } = body;

    const admin = await prisma.admin.findUnique({ where: { username: String(username || '') } });
    // Never reveal whether the username exists
    if (!admin || !admin.securityQuestion) {
      return NextResponse.json({ error: 'Recovery not available' }, { status: 400 });
    }

    if (step === 'question') {
      return NextResponse.json({ question: admin.securityQuestion });
    }

    if (step === 'reset') {
      if (!answer || !newPassword || String(newPassword).length < 8) {
        return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
      }
      if (hash(String(answer)) !== admin.securityAnswer) {
        return NextResponse.json({ error: 'Incorrect answer' }, { status: 400 });
      }
      await prisma.admin.update({
        where: { id: admin.id },
        data: { password: await bcrypt.hash(String(newPassword), 10), mustChangePass: false },
      });
      // Successful reset clears the throttle for this IP.
      attempts.delete(ip);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid step' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
