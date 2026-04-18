import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect, notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ArticleEditor from '@/components/admin/ArticleEditor';

export default async function EditArticle({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');
  const article = await prisma.article.findUnique({ where: { id: Number(params.id) } });
  if (!article) notFound();
  return <ArticleEditor article={article} />;
}
