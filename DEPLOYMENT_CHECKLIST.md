# ✅ Deployment Checklist

## 🗄️ Database Setup (Neon)
- [ ] Create account at [neon.tech](https://neon.tech)
- [ ] Create new project
- [ ] Copy connection string
- [ ] Update `env.example` with DATABASE_URL
- [ ] Run `npm run db:push`

## ☁️ Backend Deployment (Render)
- [ ] Create account at [render.com](https://render.com)
- [ ] Connect GitHub repository
- [ ] Create new Web Service
- [ ] Set environment variables:
  - [ ] DATABASE_URL
  - [ ] NODE_ENV=production
  - [ ] SESSION_SECRET
- [ ] Deploy and get backend URL

## 🌐 Frontend Deployment (Vercel)
- [ ] Create account at [vercel.com](https://vercel.com)
- [ ] Import GitHub repository
- [ ] Configure build settings
- [ ] Set VITE_API_URL environment variable
- [ ] Deploy and get frontend URL

## 🔧 Final Configuration
- [ ] Update `vercel.json` with backend URL
- [ ] Update CORS_ORIGIN in Render
- [ ] Test all API endpoints
- [ ] Test booking form
- [ ] Test responsive design

## 🧪 Testing
- [ ] Backend health check: `/health`
- [ ] Database connection: `/db-test`
- [ ] Services API: `/api/services`
- [ ] Booking creation
- [ ] Frontend functionality

## 🎉 Go Live!
- [ ] Share your website URL
- [ ] Start accepting bookings
- [ ] Monitor performance
- [ ] Collect customer feedback
