# 🚀 LawreiBeauty Website Deployment Guide

This guide will walk you through deploying your beauty business website with **100% FREE** hosting and database services.

## 📋 Prerequisites

- GitHub account
- Email address for service registrations
- Basic understanding of web development

## 🗄️ Step 1: Set Up Neon Database (Free PostgreSQL)

### 1.1 Create Neon Account
1. Go to [neon.tech](https://neon.tech)
2. Click "Sign Up" and create an account
3. Verify your email

### 1.2 Create Database
1. Click "Create New Project"
2. Choose a project name (e.g., "lawrei-beauty")
3. Select a region close to your customers
4. Click "Create Project"

### 1.3 Get Database Connection String
1. In your project dashboard, click "Connection Details"
2. Copy the connection string that looks like:
   ```
   postgresql://username:password@hostname/database
   ```
3. Save this for later use

### 1.4 Set Up Database Schema
1. In your local project, run:
   ```bash
   npm install
   npm run db:push
   ```

## ☁️ Step 2: Deploy Backend to Render (Free)

### 2.1 Create Render Account
1. Go to [render.com](https://render.com)
2. Click "Get Started" and sign up with GitHub
3. Verify your email

### 2.2 Deploy Backend Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Select the repository containing your project
4. Configure the service:
   - **Name**: `lawrei-beauty-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

### 2.3 Set Environment Variables
In Render dashboard, go to "Environment" tab and add:
- `DATABASE_URL`: Your Neon connection string
- `NODE_ENV`: `production`
- `SESSION_SECRET`: Generate a random string
- `CORS_ORIGIN`: Your frontend URL (we'll set this later)

### 2.4 Deploy
1. Click "Create Web Service"
2. Wait for deployment to complete
3. Copy your backend URL (e.g., `https://lawrei-beauty-backend.onrender.com`)

## 🌐 Step 3: Deploy Frontend to Vercel (Free)

### 3.1 Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up" and sign up with GitHub
3. Verify your email

### 3.2 Deploy Frontend
1. Click "New Project"
2. Import your GitHub repository
3. Configure the project:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `client/dist`
   - **Install Command**: `npm install`

### 3.3 Configure Environment Variables
Add these environment variables:
- `VITE_API_URL`: Your Render backend URL

### 3.4 Deploy
1. Click "Deploy"
2. Wait for deployment to complete
3. Copy your frontend URL (e.g., `https://lawrei-beauty.vercel.app`)

## 🔧 Step 4: Update Configuration

### 4.1 Update Vercel Configuration
1. In your project, update `vercel.json`:
   ```json
   {
     "rewrites": [
       {
         "source": "/api/(.*)",
         "destination": "https://your-backend-url.onrender.com/api/$1"
       }
     ]
   }
   ```

### 4.2 Update Backend CORS
1. In Render dashboard, update `CORS_ORIGIN` to your Vercel frontend URL
2. Redeploy the backend service

## 🧪 Step 5: Test Your Deployment

### 5.1 Test Backend
1. Visit: `https://your-backend.onrender.com/health`
2. Should return: `{"status":"OK","timestamp":"..."}`

### 5.2 Test Frontend
1. Visit your Vercel URL
2. Test the booking form
3. Check if API calls work

### 5.3 Test Database
1. Create a test booking
2. Check if it appears in your Neon database

## 🔒 Step 6: Security & Performance

### 6.1 Enable HTTPS
- ✅ Vercel: Automatic
- ✅ Render: Automatic

### 6.2 Set Up Monitoring
1. In Render: Enable built-in monitoring
2. In Vercel: View analytics dashboard

### 6.3 Database Backups
1. In Neon: Automatic daily backups (free tier)

## 📱 Step 7: Custom Domain (Optional)

### 7.1 Buy Domain
1. Purchase from Namecheap, GoDaddy, or similar
2. Cost: ~$10-15/year

### 7.2 Configure DNS
1. In Vercel: Add custom domain
2. Update DNS records as instructed
3. Wait for propagation (24-48 hours)

## 🚨 Troubleshooting

### Common Issues:

**Database Connection Failed:**
- Check `DATABASE_URL` in Render environment variables
- Verify Neon database is active
- Check if IP restrictions are enabled

**Build Failed:**
- Check build logs in Render/Vercel
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

**API Calls Not Working:**
- Check CORS configuration
- Verify backend URL in frontend
- Check network tab for errors

## 📊 Free Tier Limits

### Neon Database:
- 3GB storage
- 10GB transfer/month
- 1 database
- Automatic backups

### Render:
- 750 hours/month
- 512MB RAM
- Shared CPU
- Auto-sleep after 15 minutes

### Vercel:
- 100GB bandwidth/month
- Unlimited deployments
- Automatic HTTPS
- Global CDN

## 🔄 Maintenance

### Daily:
- Check Render and Vercel dashboards for errors
- Monitor database usage

### Weekly:
- Review error logs
- Check performance metrics
- Update dependencies if needed

### Monthly:
- Review usage against free tier limits
- Plan for scaling if needed

## 📈 Scaling Up (When Ready)

### Paid Tiers:
- **Neon**: $5/month for 10GB storage
- **Render**: $7/month for always-on service
- **Vercel**: $20/month for team features

### Performance Improvements:
- Add Redis caching
- Implement CDN for images
- Add database connection pooling

---

## 🎉 Congratulations!

Your LawreiBeauty website is now live with:
- ✅ Professional database (PostgreSQL)
- ✅ Scalable backend hosting
- ✅ Fast frontend hosting
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Zero monthly cost

Your beauty business now has a professional online presence that can handle real customers and grow with your business!
