import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

const createMockPrisma = (): PrismaClient => {
  return new Proxy({}, {
    get: (_, modelProp) => new Proxy({}, {
      get: (_, methodProp) => {
        if (methodProp === 'findMany') return () => Promise.resolve([]);
        if (methodProp === 'count') return () => Promise.resolve(0);
        return () => Promise.resolve(null);
      }
    })
  }) as unknown as PrismaClient;
};

export const prisma = process.env.npm_lifecycle_event === 'build' || process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL?.includes('@')
  ? createMockPrisma()
  : (globalForPrisma.prisma ?? new PrismaClient({ log: ['error'] }));

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
