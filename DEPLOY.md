# 🚀 Deploy LawreiBeauty Website (100% FREE)

## Quick Setup Steps:

### 1. Database (Neon - Free)
- Go to [neon.tech](https://neon.tech)
- Sign up and create project
- Copy connection string
- Update `env.example` with your DATABASE_URL

### 2. Backend (Render - Free)
- Go to [render.com](https://render.com)
- Connect GitHub repo
- Set environment variables:
  - DATABASE_URL
  - NODE_ENV=production
  - SESSION_SECRET (random string)

### 3. Frontend (Vercel - Free)
- Go to [vercel.com](https://vercel.com)
- Import GitHub repo
- Deploy automatically

### 4. Update URLs
- Update CORS_ORIGIN in Render
- Update API URL in frontend

## Commands:
```bash
npm install
npm run db:push
npm run build
```

Your website will be live with free hosting!
