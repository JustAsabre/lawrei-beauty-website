import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL environment variable is required');
  process.exit(1);
}

try {
  console.log('Setting up database...');

  // Run the initialization script
  execSync('npx tsx scripts/init-database.ts', {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..')
  });

  console.log('Database setup completed successfully!');
} catch (error) {
  console.error('Error setting up database:', error);
  process.exit(1);
}