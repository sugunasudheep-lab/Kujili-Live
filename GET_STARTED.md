# 🎯 Getting Started with Kujili

Complete guide to deploy and run Kujili on mobile, web, and get a free domain!

## 🚀 Quick Deploy Options

### Option 1: Web App (Fastest - 2 Minutes)

**Get a FREE web domain on Netlify:**

1. **Clone and Install**
```bash
git clone <your-repo>
cd kujili-live-streaming
npm install
```

2. **Deploy to Netlify**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Build and deploy
npm run build:web
netlify deploy --prod
```

3. **Done!** 🎉
   - Your app: `https://your-app.netlify.app`
   - Free SSL certificate
   - Free CDN
   - Auto-deploys on git push

**Full guide**: [NETLIFY_DEPLOYMENT.md](./NETLIFY_DEPLOYMENT.md)

### Option 2: Mobile App (5 Minutes)

**Run on your phone with Expo Go:**

1. **Install Expo Go**
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Android: [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Start Dev Server**
```bash
npm install
npm run dev
```

3. **Scan QR Code**
   - iOS: Use Camera app
   - Android: Use Expo Go app

**Full guide**: [QUICKSTART.md](./QUICKSTART.md)

### Option 3: Production Build

**Create installable apps for iOS/Android:**

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build Android APK
eas build --platform android --profile preview

# Build iOS
eas build --platform ios --profile preview
```

**Full guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🌐 Your Deployment Options

| Platform | Time | Cost | Features |
|----------|------|------|----------|
| **Netlify (Web)** | 2 min | FREE | SSL, CDN, Auto-deploy, Custom domain |
| **Expo Go (Dev)** | 5 min | FREE | Live preview, Hot reload, Easy testing |
| **EAS Build (Mobile)** | 20 min | FREE tier | Native apps, App stores, Full features |
| **Custom Domain** | 10 min | $10-15/year | Professional branding |

## 📱 Feature Access by Platform

### Mobile (iOS/Android)
✅ All features available:
- Live streaming
- Shorts videos
- Push notifications
- Camera & media access
- Location services
- Photo/video upload
- Full offline mode

### Web (Browser)
✅ Most features available:
- Live streaming viewing
- Shorts videos
- Authentication
- Social features
- Coin purchases
- Profile management
⚠️ Limited: Camera, push notifications, location

### Progressive Web App
✅ Enhanced web experience:
- Add to home screen
- Offline mode
- Desktop notifications
- Fast loading
- Native feel

## 🎯 Recommended Workflows

### For Content Creators
1. **Setup**: Deploy web version on Netlify
2. **Mobile**: Install EAS build on phone
3. **Stream**: Use mobile for camera access
4. **Manage**: Use web for analytics
5. **Share**: Give users your Netlify URL

### For Developers
1. **Development**: Use Expo Go for testing
2. **Staging**: Deploy to Netlify preview
3. **Testing**: Build preview APK/IPA
4. **Production**: Deploy to Netlify + App Stores

### For Users
1. **Web**: Visit your-app.netlify.app
2. **Mobile**: Download from App Store/Play Store
3. **PWA**: Add web app to home screen

## 🔑 Environment Setup

### Required Variables

Create `.env` file (already included):
```bash
EXPO_PUBLIC_SUPABASE_URL=https://olvbgagmydbicqegzdse.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-key-here
```

### For Netlify
Add in Netlify dashboard under Site settings → Environment variables:
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

### For GitHub Actions
Add as repository secrets:
- `NETLIFY_AUTH_TOKEN`
- `NETLIFY_SITE_ID`
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

## 🎨 Customization Guide

### Change App Name
1. Edit `app.json`:
```json
{
  "expo": {
    "name": "Your App Name",
    "slug": "your-app-slug"
  }
}
```

### Change Colors
1. Edit primary color in theme files
2. Update splash screen color in `app.json`
3. Update icon background colors

### Change Domain
1. In Netlify: Site settings → Domain management
2. Add custom domain
3. Configure DNS records
4. Enable HTTPS

### Add Features
1. Install Expo packages: `npx expo install package-name`
2. Update `app.json` with plugin config
3. Add to `lib/expo-features.ts`
4. Use in your components

## 🛠️ Development Commands

```bash
# Start development
npm run dev

# Type checking
npm run typecheck

# Build for web
npm run build:web

# Build for Netlify
npm run build:netlify

# Run linter
npm run lint
```

## 📊 Monitoring & Analytics

### Netlify Analytics (Optional - $9/mo)
- Server-side analytics
- No cookies required
- Privacy-friendly
- Real-time data

### Free Alternatives
1. **Plausible** - Privacy-focused
2. **Umami** - Self-hosted
3. **Google Analytics** - Full-featured

### Error Tracking
1. **Sentry** - Production errors
2. **LogRocket** - Session replay
3. **Bugsnag** - Mobile crashes

## 🔐 Security Checklist

- ✅ Environment variables secured
- ✅ HTTPS enabled (auto on Netlify)
- ✅ Row Level Security enabled (Supabase)
- ✅ Authentication configured
- ✅ API keys not in code
- ✅ CORS configured
- ✅ Rate limiting (Supabase)
- ✅ Input validation

## 🚦 Performance Optimization

### Web Performance
- ✅ Code splitting enabled
- ✅ Lazy loading images
- ✅ CDN delivery (Netlify)
- ✅ Asset caching
- ✅ Gzip compression

### Mobile Performance
- ✅ Native compilation
- ✅ Image optimization
- ✅ Bundle optimization
- ✅ Hermes engine
- ✅ Memory management

## 📱 Testing Strategy

### Local Testing
```bash
# Run on device
npm run dev

# Scan QR code
# Test all features
```

### Web Testing
```bash
# Build and preview
npm run build:web
npx serve dist
```

### Production Testing
```bash
# Deploy to preview
netlify deploy

# Get preview URL
# Test before production
```

## 🎓 Learning Resources

### Documentation
- [Expo Docs](https://docs.expo.dev)
- [React Native Docs](https://reactnative.dev)
- [Supabase Docs](https://supabase.com/docs)
- [Netlify Docs](https://docs.netlify.com)

### Tutorials
- [Expo Router Guide](https://docs.expo.dev/router/introduction/)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [React Native Tutorial](https://reactnative.dev/docs/tutorial)

### Community
- [Expo Discord](https://chat.expo.dev)
- [React Native Community](https://reactnative.dev/community/overview)
- [Supabase Discord](https://discord.supabase.com)

## 🎯 Next Steps

After deployment:

1. ✅ **Share Your App**
   - Give users your Netlify URL
   - Share on social media
   - Add to your website

2. ✅ **Monitor Performance**
   - Check Netlify dashboard
   - Review build logs
   - Monitor error rates

3. ✅ **Gather Feedback**
   - User testing
   - Analytics review
   - Feature requests

4. ✅ **Iterate & Improve**
   - Fix bugs
   - Add features
   - Optimize performance

5. ✅ **Scale Up**
   - Custom domain
   - App store submission
   - Marketing campaign

## 🆘 Common Issues

### Build Fails
```bash
# Clear cache
rm -rf node_modules
npm install
npx expo start -c
```

### Deployment Fails
```bash
# Check environment variables
# Review build logs
# Test locally first
```

### App Won't Load
```bash
# Check Supabase connection
# Verify environment variables
# Clear browser cache
```

## 📞 Support

- 📖 Check [README.md](./README.md)
- 🔧 Review [FEATURES.md](./FEATURES.md)
- 🌐 Read [NETLIFY_DEPLOYMENT.md](./NETLIFY_DEPLOYMENT.md)
- 📱 See [DEPLOYMENT.md](./DEPLOYMENT.md)
- ⚡ Check [QUICKSTART.md](./QUICKSTART.md)

## 🎉 You're Ready!

Choose your path:

**Want it live ASAP?**
→ Deploy to Netlify (2 minutes)

**Testing on phone?**
→ Use Expo Go (5 minutes)

**Production apps?**
→ Build with EAS (20 minutes)

**All three?**
→ Do them all! They work together perfectly.

---

**Let's make your live streaming app go viral! 🚀**
