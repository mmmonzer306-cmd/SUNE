import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    // 1️⃣ التحقق من الحقول المطلوبة
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'جميع الحقول مطلوبة' },
        { status: 400 }
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
      // تهيئة نص الرسالة (Markdown عشان التنسيق)

const text = `
📩 <b>رسالة جديدة من البورتفوليو</b>

👤 <b>الاسم:</b> ${name}
📧 <b>البريد:</b> ${email}
📌 <b>الموضوع:</b> ${subject || "غير محدد"}

💬 <b>الرسالة:</b>

${message}

━━━━━━━━━━━━━━
🌐 Portfolio Contact Form
`; 

      // إرسال الإشعار (من غير `await` عشان ما يبطئ الرد)
      fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: text,
          parse_mode: 'Markdown',
        }),
      }).catch((err) => console.error('❌ فشل إرسال التيليجرام:', err));
    }

    // 4️⃣ رد نجاح للمستخدم
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ خطأ في POST:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}

// --------------------------------------------
// GET: جلب الرسائل للوحة الأدمن (بحماية الـ session)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const messages = await prisma.message.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('❌ خطأ في GET:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في جلب الرسائل' },
      { status: 500 }
    );
  }
}