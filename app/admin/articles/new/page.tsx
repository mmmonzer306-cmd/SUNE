import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import ArticleEditor from '@/components/admin/ArticleEditor';

export default async function NewArticle() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');
  return <ArticleEditor />;
}
