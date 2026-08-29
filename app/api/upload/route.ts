import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const ALLOWED_FOLDERS = ['general', 'profile', 'skills', 'projects', 'articles'] as const;

// MIME type -> extension. Deriving the extension from the client filename
// would allow attacker-controlled values such as "..\\..\\evil.js".
const EXT_BY_TYPE: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const rawFolder = String(formData.get('folder') || 'general');
    const folder = (ALLOWED_FOLDERS as readonly string[]).includes(rawFolder) ? rawFolder : 'general';

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const ext = EXT_BY_TYPE[file.type];
    if (!ext) {
      return NextResponse.json({ error: 'Only images allowed (jpg, png, webp, gif)' }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Max file size is 5MB' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}.${ext}`;
    const uploadRoot = path.join(process.cwd(), 'public', 'uploads');
    const uploadDir = path.join(uploadRoot, folder);
    const target = path.join(uploadDir, filename);

    // Defence in depth: refuse anything that escapes the uploads root.
    if (!target.startsWith(uploadRoot + path.sep)) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }

    await mkdir(uploadDir, { recursive: true });
    await writeFile(target, buffer);

    return NextResponse.json({ url: `/uploads/${folder}/${filename}` });
  } catch (err) {
    console.error('Upload failed:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
