// Simple script to fix the database by calling the setup endpoint
const https = require('https');

console.log('🔧 Fixing database tables...');

const options = {
  hostname: 'lawrei-beauty-website.onrender.com',
  port: 443,
  path: '/setup-database',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  }
};

const req = https.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      console.log('✅ Database setup result:', result);
    } catch (e) {
      console.log('📄 Raw response:', data);
    }
  });
});

req.on('error', (e) => {
  console.error('❌ Error:', e.message);
});

req.end();

console.log('📡 Sending request to fix database...');
