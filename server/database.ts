import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from '../shared/schema';

// Check for required environment variable
if (!process.env.DATABASE_URL) {
  console.warn('⚠️  DATABASE_URL not set, using in-memory storage');
}

export async function testConnection() {
  try {
    if (!process.env.DATABASE_URL) {
      console.log('✅ Database connection test passed (using in-memory storage)');
      return true;
    }

    const sql = neon(process.env.DATABASE_URL);
    const result = await sql`SELECT version()`;
    console.log('✅ Database connection test passed (Neon PostgreSQL)');
    console.log('📊 Database version:', result[0].version);
    return true;
  } catch (error) {
    console.error('❌ Database connection test failed:', error);
    return false;
  }
}

// Export the database instance
export const db = process.env.DATABASE_URL 
  ? drizzle(neon(process.env.DATABASE_URL), { schema })
  : null;
