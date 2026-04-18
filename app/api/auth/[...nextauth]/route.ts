import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;
        const admin = await prisma.admin.findUnique({ where: { username: credentials.username } });
        if (!admin) return null;
        const isValid = await bcrypt.compare(credentials.password, admin.password);
        if (!isValid) return null;
        return { id: String(admin.id), name: admin.username, mustChangePass: admin.mustChangePass } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.mustChangePass = (user as any).mustChangePass;
      return token;
    },
    async session({ session, token }) {
      if (session.user) (session.user as any).mustChangePass = token.mustChangePass;
      return session;
    },
  },
  session: { strategy: 'jwt' },
  pages: { signIn: '/admin/login' },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
