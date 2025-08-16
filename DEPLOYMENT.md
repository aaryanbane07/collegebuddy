# 🚀 COLLEGEBUDDY Deployment Guide

This guide will help you deploy COLLEGEBUDDY to production using Vercel and Supabase.

## Prerequisites

- [Node.js 18+](https://nodejs.org/)
- [Git](https://git-scm.com/)
- [Vercel Account](https://vercel.com/)
- [Supabase Account](https://supabase.com/)

## 🗄️ Database Setup (Supabase)

### 1. Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Click "New Project"
3. Fill in project details:
   - **Name**: `collegebuddy`
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users
4. Wait for project creation (2-3 minutes)

### 2. Set Up Database Schema

1. Go to **SQL Editor** in your Supabase dashboard
2. Copy the entire content from `database/schema.sql`
3. Paste and execute the SQL script
4. Verify tables are created in **Table Editor**

### 3. Configure Authentication

1. Go to **Authentication** > **Settings**
2. Configure **Site URL**: `https://your-domain.vercel.app`
3. Add **Redirect URLs**:
   - `https://your-domain.vercel.app/auth/callback`
   - `http://localhost:3000/auth/callback` (for development)

### 4. Set Up Storage (Optional)

1. Go to **Storage**
2. Create buckets:
   - `lecture-materials` (for PDFs, videos, etc.)
   - `event-images` (for event photos)
   - `user-avatars` (for profile pictures)
3. Configure bucket policies as needed

### 5. Get API Keys

1. Go to **Settings** > **API**
2. Copy these values:
   - **Project URL** (`NEXT_PUBLIC_SUPABASE_URL`)
   - **Anon Public Key** (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - **Service Role Key** (`SUPABASE_SERVICE_ROLE_KEY`) - Keep this secret!

## 🌐 Frontend Deployment (Vercel)

### Method 1: Deploy from GitHub (Recommended)

1. **Fork/Clone Repository**
   ```bash
   git clone https://github.com/aaryanbane07/collegebuddy.git
   cd collegebuddy
   ```

2. **Push to Your GitHub**
   ```bash
   git remote set-url origin https://github.com/YOUR_USERNAME/collegebuddy.git
   git push -u origin main
   ```

3. **Deploy to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Configure project:
     - **Framework Preset**: Next.js
     - **Build Command**: `npm run build`
     - **Output Directory**: `.next`

4. **Set Environment Variables**
   In Vercel project settings, add:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build completion
   - Your app will be live at `https://your-project.vercel.app`

### Method 2: Deploy with Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Set Environment Variables**
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   vercel env add SUPABASE_SERVICE_ROLE_KEY
   ```

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## 🔧 Post-Deployment Configuration

### 1. Update Supabase Settings

1. Go to **Authentication** > **Settings**
2. Update **Site URL** to your Vercel domain
3. Add your Vercel domain to **Redirect URLs**

### 2. Test Core Functionality

1. **User Registration**: Create test accounts for each role
2. **Authentication**: Test login/logout flows
3. **Database Operations**: Create lectures, events, etc.
4. **File Uploads**: Test if file storage works
5. **Email Notifications**: Verify email delivery

### 3. Set Up Custom Domain (Optional)

1. In Vercel dashboard, go to **Domains**
2. Add your custom domain
3. Configure DNS records as instructed
4. Update Supabase settings with new domain

## 📊 Monitoring & Analytics

### 1. Vercel Analytics

1. Go to **Analytics** in Vercel dashboard
2. Enable **Web Analytics**
3. Monitor performance metrics

### 2. Supabase Monitoring

1. Monitor **Database** usage
2. Check **API** request patterns
3. Review **Auth** metrics

### 3. Error Tracking

Consider integrating:
- [Sentry](https://sentry.io/) for error tracking
- [LogRocket](https://logrocket.com/) for session replay
- [Mixpanel](https://mixpanel.com/) for user analytics

## 🔒 Security Checklist

- [ ] Environment variables are properly set
- [ ] Supabase RLS policies are configured
- [ ] CORS settings are correct
- [ ] File upload limits are set
- [ ] Rate limiting is enabled
- [ ] HTTPS is enforced
- [ ] Security headers are configured

## 🚀 Performance Optimization

### 1. Image Optimization

- Use Next.js Image component
- Configure image domains in `next.config.js`
- Implement lazy loading

### 2. Database Optimization

- Add proper indexes (already in schema)
- Use database connection pooling
- Implement query optimization

### 3. Caching Strategy

- Enable Vercel Edge Caching
- Implement SWR for data fetching
- Use React Query for server state

## 🔄 CI/CD Pipeline

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Build project
        run: npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🆘 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Review build logs for specific errors

2. **Database Connection Issues**
   - Verify Supabase URL and keys
   - Check network connectivity
   - Review RLS policies

3. **Authentication Problems**
   - Confirm redirect URLs are correct
   - Check email provider settings
   - Verify JWT configuration

4. **Performance Issues**
   - Monitor Vercel function execution time
   - Check database query performance
   - Review bundle size

### Getting Help

- **Documentation**: [Next.js Docs](https://nextjs.org/docs), [Supabase Docs](https://supabase.com/docs)
- **Community**: [Vercel Discord](https://discord.gg/vercel), [Supabase Discord](https://discord.supabase.com/)
- **Support**: Create issues in the GitHub repository

## 📈 Scaling Considerations

### Database Scaling

- Monitor connection limits
- Consider read replicas for heavy read workloads
- Implement database sharding if needed

### Application Scaling

- Use Vercel's automatic scaling
- Implement proper caching strategies
- Consider CDN for static assets

### Cost Optimization

- Monitor Vercel usage
- Optimize Supabase queries
- Implement efficient data fetching patterns

---

**🎉 Congratulations! Your COLLEGEBUDDY platform is now live!**

For additional support or questions, please refer to the main README.md or create an issue in the repository.