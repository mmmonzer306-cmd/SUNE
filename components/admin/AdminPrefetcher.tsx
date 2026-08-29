'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ADMIN_ROUTES = [
  '/admin',
  '/admin/profile',
  '/admin/projects',
  '/admin/skills',
  '/admin/services',
  '/admin/experience',
  '/admin/testimonials',
  '/admin/faqs',
  '/admin/stats',
  '/admin/blocks',
  '/admin/texts',
  '/admin/articles',
  '/admin/articles/new',
  '/admin/messages',
  '/admin/settings',
];

/** Warms every admin route as soon as the panel shell mounts. */
export default function AdminPrefetcher() {
  const router = useRouter();
  useEffect(() => {
    ADMIN_ROUTES.forEach((href) => router.prefetch(href));
  }, [router]);
  return null;
}
