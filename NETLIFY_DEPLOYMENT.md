# 🌐 Netlify Deployment Guide - FREE Web App Domain

Deploy your Kujili web app to Netlify and get a free domain in minutes!

## 🚀 Quick Deploy (2 Minutes)

### Option 1: Deploy with GitHub (Recommended)

1. **Push your code to GitHub**
```bash
git init
git add .
git commit -m "Initial commit - Kujili app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/kujili-app.git
git push -u origin main
```

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Choose "GitHub" and authorize
   - Select your `kujili-app` repository

3. **Configure Build**
   - Build command: `npm run build:web`
   - Publish directory: `dist`
   - Click "Deploy site"

4. **Done! 🎉**
   - Your site will be live at: `https://random-name-123.netlify.app`
   - Free SSL certificate included
   - Auto-deploys on every git push

### Option 2: Deploy with Netlify CLI

1. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Login to Netlify**
```bash
netlify login
```

3. **Build and Deploy**
```bash
# Build the app
npm run build:web

# Deploy to Netlify
netlify deploy --prod
```

4. **Follow the prompts**
   - Create & configure new site
   - Choose `dist` as publish directory
   - Get your live URL!

### Option 3: Drag & Drop Deploy

1. **Build locally**
```bash
npm install
npm run build:web
```

2. **Go to Netlify**
   - Visit [app.netlify.com/drop](https://app.netlify.com/drop)
   - Drag the `dist` folder onto the page
   - Get instant deployment!

## 🎨 Custom Domain Setup

### Use Free Netlify Domain

Your site comes with a free subdomain:
- Format: `your-site-name.netlify.app`
- Click "Site settings" → "Change site name"
- Choose a memorable name: `kujili-live.netlify.app`

### Add Your Own Domain (Optional)

1. **Buy a domain** (from Namecheap, GoDaddy, etc.)
2. **In Netlify**: Site settings → Domain management → Add custom domain
3. **Add DNS records** in your domain provider:
   ```
   Type: A
   Name: @
   Value: 75.2.60.5

   Type: CNAME
   Name: www
   Value: your-site.netlify.app
   ```
4. **Wait for DNS propagation** (5-30 minutes)
5. **Enable HTTPS** (automatic in Netlify)

## 🔒 Environment Variables

Set up your Supabase credentials:

1. **In Netlify Dashboard**:
   - Go to Site settings → Environment variables
   - Click "Add a variable"

2. **Add these variables**:
```
EXPO_PUBLIC_SUPABASE_URL = https://olvbgagmydbicqegzdse.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY = your-anon-key-here
```

3. **Redeploy**:
   - Trigger a new deploy from Deploys tab
   - Or push a new commit

## 📊 Netlify Features Included

### ✅ Automatic Features
- **HTTPS/SSL** - Free Let's Encrypt certificate
- **CDN** - Global content delivery network
- **Continuous Deployment** - Auto-deploy on git push
- **Build Logs** - See build progress and errors
- **Preview Deploys** - Test PRs before merging
- **Rollback** - Instantly revert to previous version

### ⚡ Performance
- **Edge Caching** - Fast global distribution
- **Asset Optimization** - Automatic compression
- **Instant Cache Invalidation** - Updates go live instantly
- **99.99% Uptime** - Reliable hosting

### 🛠️ Developer Tools
- **Build Hooks** - Trigger builds via API
- **Split Testing** - A/B test your changes
- **Analytics** - See traffic and performance
- **Forms** - Handle form submissions
- **Functions** - Serverless functions (if needed)

## 📱 Progressive Web App (PWA)

Your app works as a PWA automatically:

1. **Visit your site** on mobile
2. **"Add to Home Screen"** prompt appears
3. **Works offline** with cached content
4. **Full-screen** app experience

## 🔄 Continuous Deployment

Every time you push code:

```bash
git add .
git commit -m "Update feature"
git push
```

Netlify automatically:
1. ✅ Detects the push
2. ✅ Runs `npm run build:web`
3. ✅ Tests the build
4. ✅ Deploys to production
5. ✅ Invalidates cache
6. ✅ Sends you a notification

## 🎯 Deploy Previews

For each Pull Request:
- Unique preview URL created
- Test changes before merging
- Share with team for review
- Automatic cleanup after merge

## 📈 Analytics Setup

### Netlify Analytics (Paid)
1. Site settings → Analytics
2. Enable for $9/month
3. Get server-side analytics
4. No cookies, privacy-friendly

### Free Alternative: Plausible
1. Add script to `app/_layout.tsx`:
```typescript
<script defer data-domain="your-site.netlify.app" src="https://plausible.io/js/script.js"></script>
```
2. Sign up at [plausible.io](https://plausible.io)
3. Free for low traffic

## 🚨 Troubleshooting

### Build Fails

**Check build logs**:
```bash
netlify logs
```

**Common fixes**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Expo cache
npx expo start -c

# Rebuild
npm run build:web
```

### 404 Errors on Routes

Make sure `netlify.toml` exists with redirects:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Environment Variables Not Working

1. Check variable names match exactly
2. Redeploy after adding variables
3. Clear deploy cache and retry

### Build Takes Too Long

- Netlify free tier: 300 build minutes/month
- Optimize by caching `node_modules`:
```toml
[build]
  command = "npm run build:web"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"
  NPM_FLAGS = "--prefer-offline --no-audit"
```

## 💡 Pro Tips

### 1. Custom Build Command
Add to `netlify.toml`:
```toml
[build]
  command = "npm ci && npm run build:web"
```

### 2. Deploy Notifications
- Enable in Site settings → Build & deploy → Deploy notifications
- Get notified via email, Slack, or webhook

### 3. Branch Deploys
Deploy specific branches:
```toml
[context.staging]
  command = "npm run build:web"

[context.production]
  command = "npm run build:web"
```

### 4. Headers & Security
Already configured in `netlify.toml`:
- X-Frame-Options
- Content Security Policy
- Cache headers for assets

### 5. Redirects & Rewrites
Add custom redirects:
```toml
[[redirects]]
  from = "/old-path"
  to = "/new-path"
  status = 301
```

## 📊 Monitoring Your Site

### Netlify Dashboard
- Real-time deploy status
- Build logs and errors
- Traffic analytics (paid)
- Form submissions

### External Tools (Free)
1. **UptimeRobot** - Uptime monitoring
2. **Plausible** - Privacy-friendly analytics
3. **Sentry** - Error tracking
4. **LogRocket** - Session replay

## 🎉 Next Steps

Once deployed:

1. ✅ **Share your URL** with users
2. ✅ **Set up custom domain** (optional)
3. ✅ **Enable analytics** to track usage
4. ✅ **Add to app stores** (mobile versions)
5. ✅ **Monitor performance** and optimize

## 📞 Support Resources

- [Netlify Docs](https://docs.netlify.com)
- [Netlify Community](https://answers.netlify.com)
- [Expo Web Docs](https://docs.expo.dev/workflow/web/)
- [Kujili GitHub Issues](your-repo-url)

## 🌟 Your Live URLs

After deployment, you'll have:

- **Production**: `https://kujili-live.netlify.app`
- **Preview**: `https://deploy-preview-123.netlify.app`
- **Branch**: `https://staging.netlify.app`

All with:
- ✅ Free HTTPS
- ✅ Global CDN
- ✅ Automatic deploys
- ✅ 99.99% uptime

---

**🎊 Congratulations! Your app is live and accessible worldwide!**

Share your link: `https://your-site.netlify.app`
