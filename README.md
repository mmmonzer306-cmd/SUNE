# Mohammed Mohsen — Portfolio

Full-stack portfolio built with **Next.js 15**, **PostgreSQL (Neon)**, **Prisma**, **NextAuth.js**, Dark/Light mode, and trilingual support (EN/AR/FR).

---

## 🔑 Forgot Password?

إذا نسيت كلمة السر، شغّل هذا الأمر في Terminal داخل مجلد المشروع:

```bash
node -e "
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
bcrypt.hash('NewPassword123', 10).then(h =>
  prisma.admin.update({ where: { id: 1 }, data: { password: h, mustChangePass: true } })
  .then(() => { console.log('Done! Login with: NewPassword123'); prisma.\$disconnect(); })
);
"
```

بعدين ادخل بكلمة السر `NewPassword123` وستُطلب منك تغييرها فوراً.

---

## 🚀 خطوات النشر الكاملة

### الخطوة 1 — إنشاء قاعدة البيانات على Neon

1. روح [neon.tech](https://neon.tech) وسجّل حساب مجاني
2. اضغط **New Project**
3. اختار اسم للمشروع، Region: **AWS / أقرب منطقة**، PostgreSQL: **16**
4. بعد الإنشاء، انسخ الـ **Connection String** — يكون شكله:
   ```
   postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```

---

### الخطوة 2 — إعداد المشروع محلياً

```bash
# 1. ثبّت الحزم
npm install

# 2. انسخ ملف البيئة
cp .env.example .env
```

افتح ملف `.env` وعدّل المتغيرات:

```env
DATABASE_URL="الرابط من Neon"
NEXTAUTH_SECRET="أي نص عشوائي طويل — مثلاً: portfolio-secret-2026-abc123xyz"
NEXTAUTH_URL="https://اسم-موقعك.netlify.app"
```

```bash
# 3. أنشئ الجداول في قاعدة البيانات
npm run db:push

# 4. أضف البيانات الأولية
npm run db:seed
```

---

### الخطوة 3 — رفع الكود على GitHub

```bash
git add .
git commit -m "ready for deployment"
git push origin main
```

> ⚠️ **مهم:** لا ترفع ملف `.env` أبداً على GitHub — هو موجود في `.gitignore` تلقائياً.

---

### الخطوة 4 — النشر على Netlify

1. روح [netlify.com](https://netlify.com) وسجّل دخول بـ GitHub
2. اضغط **Add new site → Import an existing project**
3. اختار الـ repo من GitHub
4. في **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `.next`
5. روح **Site settings → Environment variables** وأضف المتغيرات الثلاثة:

   | Variable | Value |
   |----------|-------|
   | `DATABASE_URL` | رابط Neon |
   | `NEXTAUTH_SECRET` | النص العشوائي |
   | `NEXTAUTH_URL` | `https://اسم-موقعك.netlify.app` |

6. اضغط **Deploy site**

---

### الخطوة 5 — بعد الـ Deploy

بعد ما يخلص الـ deploy بنجاح:

- **الموقع:** `https://اسم-موقعك.netlify.app`
- **الـ Admin:** `https://اسم-موقعك.netlify.app/admin/login`
- **اسم المستخدم:** `admin`
- **كلمة السر:** `admin123` ← ستُطلب تغييرها فور أول دخول

---

## 🔐 Admin Panel

بعد الدخول للأول مرة ستُحوَّل تلقائياً لصفحة تغيير كلمة السر — هذا إجباري.

### ما تقدر تعمله من الـ Admin:

- **Profile** — عدّل اسمك، بايو (EN/AR/FR)، روابط التواصل، صورتك، السيرة الذاتية
- **Projects** — أضف/عدّل/احذف المشاريع مع صور وروابط وترجمة
- **Skills** — أضف/عدّل/احذف المهارات مع progress bars وترجمة
- **Articles** — اكتب مقالات تقنية بـ Markdown editor، نشر/مسودة
- **Messages** — اعرض رسائل نموذج التواصل
- **Settings** — Dark/Light mode، اللغة الافتراضية، تغيير كلمة السر

---

## 🎨 المميزات

| الميزة | التفاصيل |
|--------|----------|
| Dark/Light Mode | زر تبديل في الـ Navbar، محفوظ في المتصفح |
| 3 لغات | English / العربية (RTL) / Français |
| SEO | Next.js SSR + dynamic metadata لكل صفحة |
| الصور | URL paste أو رفع مباشر (max 5MB) |
| Auth | NextAuth.js JWT + تغيير إجباري عند أول دخول |
| Blog | Markdown editor، tags، عداد المشاهدات |
| Contact | حفظ في DB + إشعار بالإيميل (اختياري) |

---

## 🛠️ Stack التقني

| Layer | Tech |
|-------|------|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS 3 + Framer Motion |
| Database | PostgreSQL (Neon) |
| ORM | Prisma 5 |
| Auth | NextAuth.js 4 |
| Editor | @uiw/react-md-editor |
| Icons | react-icons |
| Deploy | Netlify |

---

## 📁 هيكل المشروع

```
├── app/
│   ├── page.tsx              ← الصفحة الرئيسية
│   ├── blog/                 ← صفحات المدونة
│   ├── admin/                ← لوحة التحكم
│   └── api/                  ← Backend API Routes
├── components/
│   ├── sections/             ← أقسام الصفحة الرئيسية
│   ├── layout/               ← Navbar, Footer
│   └── admin/                ← مكونات الـ Admin
├── lib/
│   ├── prisma.ts             ← Prisma client
│   ├── AppContext.tsx        ← Theme + Language context
│   └── translations.ts      ← الترجمات
└── prisma/
    ├── schema.prisma         ← هيكل قاعدة البيانات
    └── seed.js               ← البيانات الأولية
```

---

## 🔧 أوامر مفيدة

```bash
npm run dev          # تشغيل محلياً على localhost:3000
npm run build        # بناء للإنتاج
npm run db:push      # رفع التغييرات لقاعدة البيانات
npm run db:seed      # إضافة البيانات الأولية
npm run db:studio    # فتح Prisma Studio لعرض البيانات
```
