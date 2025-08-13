@echo off
echo 🚀 LawreiBeauty Deployment Script
echo ================================

echo.
echo 📦 Installing dependencies...
call npm install

echo.
echo 🗄️ Setting up database schema...
call npm run db:push

echo.
echo 🔨 Building for production...
call npm run build

echo.
echo ✅ Build completed successfully!
echo.
echo 🌐 Next steps:
echo 1. Push your code to GitHub
echo 2. Deploy backend to Render (see DEPLOY.md)
echo 3. Deploy frontend to Vercel (see DEPLOY.md)
echo.
echo 📖 Read DEPLOY.md for detailed instructions
pause
