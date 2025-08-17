import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from '../shared/schema';
import dotenv from 'dotenv';

dotenv.config();

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

async function clearMockData() {
  try {
    console.log('Clearing mock data...');

    // Clear all tables
    await db.delete(schema.bookings);
    await db.delete(schema.contacts);
    await db.delete(schema.testimonials);
    await db.delete(schema.portfolio);
    await db.delete(schema.payments);
    await db.delete(schema.customers);
    await db.delete(schema.services);
    await db.delete(schema.siteContent);

    console.log('Mock data cleared successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error clearing mock data:', error);
    process.exit(1);
  }
}

clearMockData();
