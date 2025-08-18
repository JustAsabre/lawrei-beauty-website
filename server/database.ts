import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from '../shared/schema';

// In-memory storage for development/testing
const inMemoryStorage: Record<string, any[]> = {
  services: [],
  customers: [],
  bookings: [],
  testimonials: [],
  portfolio: [],
  contacts: [],
  siteContent: [],
  payments: []
};

// Check for required environment variable
if (!process.env.DATABASE_URL) {
  console.warn('DATABASE_URL not set, using in-memory storage');
}

// In-memory database implementation
const inMemoryDb = {
  select: () => ({
    from: (table: string) => {
      const tableName = table.replace('public.', '');
      return inMemoryStorage[tableName] || [];
    },
    where: () => inMemoryStorage[table] || [],
    limit: () => [],
    leftJoin: () => ({
      where: () => inMemoryStorage[table] || [],
      orderBy: () => inMemoryStorage[table] || []
    }),
    orderBy: () => inMemoryStorage[table] || []
  }),
  insert: (table: string) => ({
    values: (data: any) => {
      const tableName = table.replace('public.', '');
      const newItem = { ...data, id: crypto.randomUUID() };
      inMemoryStorage[tableName].push(newItem);
      return { returning: () => [newItem] };
    }
  }),
  delete: (table: string) => {
    const tableName = table.replace('public.', '');
    inMemoryStorage[tableName] = [];
    return { returning: () => [] };
  },
  update: (table: string) => ({
    set: (data: any) => ({
      where: () => ({
        returning: () => {
          const tableName = table.replace('public.', '');
          const items = inMemoryStorage[tableName];
          if (items.length > 0) {
            const item = { ...items[0], ...data };
            items[0] = item;
            return [item];
          }
          return [];
        }
      })
    })
  })
};

// Export the database instance
export const db = process.env.DATABASE_URL 
  ? drizzle(neon(process.env.DATABASE_URL), { schema })
  : inMemoryDb;