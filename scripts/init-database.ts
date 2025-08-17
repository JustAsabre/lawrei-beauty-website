import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from '../shared/schema';
import dotenv from 'dotenv';

dotenv.config();

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function initDatabase() {
  try {
    console.log('Initializing database...');

    // Clear all existing data
    console.log('Clearing existing data...');
    await db.delete(schema.bookings);
    await db.delete(schema.contacts);
    await db.delete(schema.testimonials);
    await db.delete(schema.portfolio);
    await db.delete(schema.payments);
    await db.delete(schema.customers);
    await db.delete(schema.services);
    await db.delete(schema.siteContent);

    // Initialize site content with empty data
    console.log('Initializing site content...');
    const initialContent = [
      {
        section: 'hero',
        title: '',
        subtitle: '',
        content: '',
        imageUrl: '',
        isActive: true
      },
      {
        section: 'about',
        title: '',
        subtitle: '',
        content: '',
        imageUrl: '',
        isActive: true
      },
      {
        section: 'contact_info',
        title: '',
        subtitle: '',
        content: '',
        imageUrl: '',
        isActive: true
      },
      {
        section: 'footer',
        title: '',
        subtitle: '',
        content: '',
        imageUrl: '',
        isActive: true
      }
    ];

    for (const content of initialContent) {
      await db.insert(schema.siteContent).values(content);
    }

    console.log('Database initialized successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initDatabase();
