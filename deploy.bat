@echo off
echo 🚀 Lawrei Beauty Website - Deployment Script
echo.

echo 📦 Installing dependencies...
npm install

echo 🔨 Building frontend and backend...
npm run build

echo ✅ Build complete! 
echo.
echo 🌐 Next steps:
echo 1. Deploy to Render (backend): npm run build
echo 2. Deploy to Vercel (frontend): npm run build:frontend
echo.
echo 📖 See DEPLOYMENT_GUIDE.md for detailed instructions
pause
