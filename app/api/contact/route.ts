import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Simple in-memory rate limit: 5 messages / 10 minutes per IP
const hits = new Map<string, { count: number; reset: number }>();
const WINDOW = 10 * 60 * 1000;
const LIMIT = 5;

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

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: "تم تجاوز الحد. حاول لاحقًا." }, { status: 429 });
    }

    const { name, email, subject, message, website } = await req.json();

    // 🍯 Honeypot: silent success for bots
    if (website) {
      return NextResponse.json({ success: true });
    }

    // 1️⃣ التحقق من الحقول المطلوبة + صحة المدخلات
    if (
      typeof name !== "string" || name.trim().length < 2 || name.length > 100 ||
      typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email) || email.length > 200 ||
      typeof message !== "string" || message.trim().length < 5 || message.length > 5000 ||
      (subject && (typeof subject !== "string" || subject.length > 200))
    ) {
      return NextResponse.json(
        { error: "بيانات غير صالحة" },
        { status: 400 },
      );
    }

    // 2️⃣ حفظ الرسالة في قاعدة البيانات (Prisma)
    await prisma.message.create({
      data: { name, email, subject, message },
    });

    // 3️⃣ إرسال إشعار تيليجرام (بدلاً من الإيميل)
    const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (TELEGRAM_TOKEN && TELEGRAM_CHAT_ID) {
      // Telegram HTML mode breaks (or injects markup) on raw <, >, &.
      const esc = (s: string) =>
        s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

      const text = [
        "📩 <b>رسالة جديدة من البورتفوليو</b>",
        "",
        `<b>الاسم:</b> ${esc(name)}`,
        `<b>البريد:</b> ${esc(email)}`,
        `<b>الموضوع:</b> ${esc(subject || "—")}`,
        "",
        `<b>الرسالة:</b>`,
        esc(message),
      ].join("\n");

      // Never let a Telegram outage fail the visitor's request.
      await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
      }).catch((err) => console.error("❌ فشل إرسال التيليجرام:", err));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ خطأ في POST:", error);
    return NextResponse.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}

// PATCH: تبديل حالة القراءة
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  const { id, read } = await req.json();
  if (typeof id !== "number" || typeof read !== "boolean") {
    return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });
  }
  const msg = await prisma.message.update({ where: { id }, data: { read } });
  return NextResponse.json(msg);
}

// DELETE: حذف رسالة مرة واحدة أو عدة رسائل
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  const { ids } = await req.json();
  if (!Array.isArray(ids) || ids.length === 0 || !ids.every((i) => typeof i === "number")) {
    return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });
  }
  await prisma.message.deleteMany({ where: { id: { in: ids } } });
  return NextResponse.json({ success: true });
}

// --------------------------------------------
// GET: جلب الرسائل للوحة الأدمن (بحماية الـ session)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const messages = await prisma.message.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("❌ خطأ في GET:", error);
    return NextResponse.json(
      { error: "حدث خطأ في جلب الرسائل" },
      { status: 500 },
    );
  }
}
