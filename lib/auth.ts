import type { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

declare module 'next-auth' {
  interface User {
    mustChangePass?: boolean;
  }
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      mustChangePass?: boolean;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    mustChangePass?: boolean;
  }
}

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
        return { id: String(admin.id), name: admin.username, mustChangePass: admin.mustChangePass };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) token.mustChangePass = user.mustChangePass;
      if (trigger === 'update') {
        const admin = await prisma.admin.findUnique({ where: { id: 1 }, select: { mustChangePass: true } });
        token.mustChangePass = admin?.mustChangePass ?? false;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.mustChangePass = token.mustChangePass;
      return session;
    },
  },
  session: { strategy: 'jwt' },
  pages: { signIn: '/admin/login' },
  secret: process.env.NEXTAUTH_SECRET,
};
