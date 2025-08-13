import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import dotenv from 'dotenv';

dotenv.config();

async function setupDatabase() {
  try {
    console.log('🔌 Connecting to Neon database...');
    
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is required');
    }

    const sql = neon(process.env.DATABASE_URL);
    const db = drizzle(sql);

    console.log('✅ Database connected successfully!');
    
    // Test the connection
    const result = await sql`SELECT version()`;
    console.log('📊 Database version:', result[0].version);
    
    console.log('🎉 Database setup completed successfully!');
    console.log('💡 Next steps:');
    console.log('   1. Update your .env file with proper values');
    console.log('   2. Set up environment variables in Render');
    console.log('   3. Deploy your updated application');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  }
}

setupDatabase();
