import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create .env file if it doesn't exist
const envPath = path.resolve(__dirname, '..', '.env');
const envExamplePath = path.resolve(__dirname, '..', 'env.example');

if (!fs.existsSync(envPath)) {
  console.log('Creating .env file...');
  const envExample = fs.readFileSync(envExamplePath, 'utf8');
  
  // Replace example values with real ones
  const envContent = envExample
    .replace('NODE_ENV=production', 'NODE_ENV=development')
    .replace('PORT=5000', 'PORT=3000')
    .replace('CORS_ORIGIN="https://your-frontend-domain.vercel.app"', 'CORS_ORIGIN="http://localhost:5173"')
    .replace('SESSION_SECRET="your-super-secret-session-key-here"', `SESSION_SECRET="${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}"`)
    .replace('JWT_SECRET="your-super-secret-jwt-key-here-use-at-least-32-chars"', `JWT_SECRET="${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}"`)
    .replace('ADMIN_USERNAME="admin"', 'ADMIN_USERNAME="admin"')
    .replace('ADMIN_PASSWORD_HASH="$2b$10$example.hash.here"', 'ADMIN_PASSWORD_HASH="$2b$10$xJwK3GUKBjgPpZrTEV.9B.aQgoqFJpF.YG6qPu7RyH0OrTh2xKlVi"'); // Hash for "admin123"

  fs.writeFileSync(envPath, envContent);
  console.log('Created .env file with development settings');
}

// Install dependencies
console.log('Installing dependencies...');
execSync('npm install', { stdio: 'inherit' });

// Run database setup
console.log('Setting up database...');
execSync('npm run db:setup', { stdio: 'inherit' });

// Start the development server
console.log('Starting development server...');
execSync('npm run dev', { stdio: 'inherit' });