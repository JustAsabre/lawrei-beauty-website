# Production Setup Guide

## Overview
This guide covers the production configuration for Lawrei Beauty Website, including Stripe payment processing, email services, and environment variables.

## 1. Stripe Production Configuration

### 1.1 Stripe Account Setup
1. **Create Stripe Account**
   - Go to [stripe.com](https://stripe.com) and create a business account
   - Complete business verification and KYC requirements
   - Enable the payment methods you want to accept

2. **Get Production Keys**
   - Navigate to Developers → API keys
   - Copy your **Publishable Key** (starts with `pk_live_`)
   - Copy your **Secret Key** (starts with `sk_live_`)
   - **⚠️ Never commit these keys to version control**

### 1.2 Webhook Configuration
1. **Create Webhook Endpoint**
   - Go to Developers → Webhooks
   - Add endpoint: `https://your-domain.com/api/payments/webhook`
   - Select events to listen for:
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
     - `charge.refunded`

2. **Get Webhook Secret**
   - Copy the webhook signing secret
   - This will be your `STRIPE_WEBHOOK_SECRET`

### 1.3 Stripe Dashboard Configuration
- **Business Profile**: Complete business information
- **Payment Methods**: Configure accepted payment methods
- **Tax Settings**: Set up tax calculation if applicable
- **Refund Policy**: Configure refund rules and policies

## 2. Email Service Configuration

### 2.1 Option 1: SendGrid (Recommended)
1. **Create SendGrid Account**
   - Go to [sendgrid.com](https://sendgrid.com)
   - Sign up for a free account (100 emails/day)
   - Verify your domain for better deliverability

2. **Get API Key**
   - Navigate to Settings → API Keys
   - Create a new API key with "Mail Send" permissions
   - Copy the API key

3. **Environment Variables**
   ```env
   EMAIL_SERVICE=sendgrid
   SENDGRID_API_KEY=your_api_key_here
   EMAIL_FROM=noreply@yourdomain.com
   EMAIL_FROM_NAME=Lawrei Beauty
   ```

### 2.2 Option 2: AWS SES
1. **AWS SES Setup**
   - Create AWS account
   - Navigate to SES service
   - Verify your domain or email address
   - Get SMTP credentials

2. **Environment Variables**
   ```env
   EMAIL_SERVICE=ses
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_REGION=us-east-1
   EMAIL_FROM=noreply@yourdomain.com
   ```

### 2.3 Option 3: Gmail SMTP
1. **Gmail Setup**
   - Enable 2-factor authentication
   - Generate app password
   - Use Gmail SMTP settings

2. **Environment Variables**
   ```env
   EMAIL_SERVICE=gmail
   GMAIL_USER=your-email@gmail.com
   GMAIL_PASSWORD=your_app_password
   EMAIL_FROM=your-email@gmail.com
   ```

## 3. Environment Variables

### 3.1 Production Environment File
Create `.env.production` (never commit this file):

```env
# Database
DATABASE_URL=your_production_database_url
NODE_ENV=production

# Stripe
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Email
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=Lawrei Beauty

# JWT
JWT_SECRET=your_very_long_random_jwt_secret

# Server
PORT=3000
CORS_ORIGIN=https://yourdomain.com

# Optional: Analytics
GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
```

### 3.2 Environment Variable Security
- **Never commit `.env` files** to version control
- Use environment variable management in your hosting platform
- Rotate secrets regularly
- Use strong, unique passwords for each service

## 4. Database Production Setup

### 4.1 Neon PostgreSQL (Recommended)
1. **Create Database**
   - Go to [neon.tech](https://neon.tech)
   - Create new project
   - Copy connection string

2. **Environment Variable**
   ```env
   DATABASE_URL=postgresql://username:password@host/database?sslmode=require
   ```

### 4.2 Database Migrations
1. **Run Migrations**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

2. **Verify Schema**
   - Check all tables are created
   - Verify data types and constraints
   - Test foreign key relationships

## 5. SSL and Domain Configuration

### 5.1 SSL Certificate
- **Automatic**: Most hosting platforms provide free SSL
- **Manual**: Use Let's Encrypt for free certificates
- **Verify**: Ensure HTTPS is working on all pages

### 5.2 Domain Configuration
1. **DNS Settings**
   - Point domain to your hosting provider
   - Configure subdomains if needed
   - Set up email records if using custom email

2. **CORS Configuration**
   ```env
   CORS_ORIGIN=https://yourdomain.com
   ```

## 6. Monitoring and Analytics

### 6.1 Application Monitoring
- **Error Tracking**: Sentry, LogRocket
- **Performance**: New Relic, DataDog
- **Uptime**: UptimeRobot, Pingdom

### 6.2 Business Analytics
- **Google Analytics**: Track user behavior
- **Stripe Dashboard**: Monitor payments and revenue
- **Custom Metrics**: Track bookings, conversions

## 7. Testing Production Setup

### 7.1 Payment Testing
1. **Test Mode First**
   - Use Stripe test keys initially
   - Test complete payment flow
   - Verify webhook handling

2. **Live Mode Testing**
   - Switch to live keys
   - Make small test transactions
   - Verify real payments work

### 7.2 Email Testing
1. **Test Email Sending**
   - Send test emails to yourself
   - Verify email templates
   - Check spam folder

2. **Monitor Deliverability**
   - Check email delivery rates
   - Monitor bounce rates
   - Verify sender reputation

## 8. Security Checklist

### 8.1 Application Security
- [ ] HTTPS enabled everywhere
- [ ] Environment variables secured
- [ ] JWT secrets are strong and unique
- [ ] Input validation on all endpoints
- [ ] Rate limiting implemented
- [ ] CORS properly configured

### 8.2 Payment Security
- [ ] Stripe webhook signature verification
- [ ] PCI compliance (handled by Stripe)
- [ ] Secure payment form handling
- [ ] No sensitive data logging

### 8.3 Data Security
- [ ] Database connections use SSL
- [ ] Regular backups configured
- [ ] Access logs enabled
- [ ] Error logging without sensitive data

## 9. Backup and Recovery

### 9.1 Database Backups
- **Automated**: Set up daily backups
- **Manual**: Regular backup testing
- **Recovery**: Document recovery procedures

### 9.2 Code Backups
- **Version Control**: Git repository with proper branching
- **Deployment**: Automated deployment pipeline
- **Rollback**: Quick rollback procedures

## 10. Go-Live Checklist

### 10.1 Pre-Launch
- [ ] All tests passing
- [ ] Production environment configured
- [ ] SSL certificates active
- [ ] Domain pointing to production
- [ ] Database migrated and seeded
- [ ] Payment processing tested
- [ ] Email notifications working

### 10.2 Launch Day
- [ ] Monitor error logs
- [ ] Check payment processing
- [ ] Verify email delivery
- [ ] Monitor performance
- [ ] Check mobile responsiveness

### 10.3 Post-Launch
- [ ] Monitor for 24-48 hours
- [ ] Check customer feedback
- [ ] Monitor business metrics
- [ ] Plan optimization improvements

## 11. Troubleshooting Common Issues

### 11.1 Payment Issues
- **Webhook failures**: Check webhook secret and endpoint URL
- **Payment declines**: Verify Stripe account status
- **Currency issues**: Check currency configuration

### 11.2 Email Issues
- **Delivery failures**: Check email service configuration
- **Spam filtering**: Verify sender reputation
- **Template errors**: Check HTML syntax

### 11.3 Database Issues
- **Connection failures**: Verify connection string and SSL
- **Migration errors**: Check database permissions
- **Performance issues**: Monitor query performance

## 12. Support and Maintenance

### 12.1 Regular Maintenance
- **Weekly**: Check error logs and performance
- **Monthly**: Review security and update dependencies
- **Quarterly**: Full security audit and backup testing

### 12.2 Support Resources
- **Stripe Support**: [support.stripe.com](https://support.stripe.com)
- **Email Service**: Check your provider's support
- **Hosting Support**: Contact your hosting provider
- **Community**: Stack Overflow, GitHub Issues

---

## Quick Start Commands

```bash
# Set production environment
export NODE_ENV=production

# Run database migrations
npm run db:migrate

# Seed production data
npm run db:seed

# Start production server
npm start

# Check server health
curl https://yourdomain.com/health
```

---

*Last Updated: December 2024*  
*Status: Production Ready*  
*Next: Phase 5 Implementation*
