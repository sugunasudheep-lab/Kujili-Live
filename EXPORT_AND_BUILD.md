# Export Project & Build Locally

## Why Export?

EAS builds require:
- ✅ Expo account authentication
- ✅ Git version control (or EAS_NO_VCS flag)
- ✅ Interactive CLI access

These aren't available in Bolt's browser environment, so you need to **export your project and build from your local machine**.

## 🚀 Quick Start (5 Minutes)

### Step 1: Export Your Project

**In Bolt (top right corner):**
1. Click "Export" or "Download"
2. Downloads as ZIP file
3. Save to your computer

### Step 2: Set Up Locally

**On your computer:**

```bash
# Extract the ZIP file
unzip kujili-live-streaming.zip
cd kujili-live-streaming

# Install dependencies
npm install

# Verify everything works
npm run dev
```

Open browser to test (should work with demo mode).

### Step 3: Login to Expo

```bash
# Login (opens browser)
npx eas login
```

Sign in with:
- Existing Expo account, or
- Create new account (free)

### Step 4: Configure EAS Project

First build? You need a project ID:

```bash
# This creates your EAS project
npx eas build:configure
```

This updates `app.json` with your actual project ID.

### Step 5: Build! 🎉

```bash
# Build for Android (recommended first)
npx eas build --profile development --platform android
```

**Build time:** 20-30 minutes
**Result:** Downloadable APK
**Cost:** Free (30 builds/month)

## 📱 What You'll Get

After the build completes:

1. ✅ Download link in terminal
2. ✅ Build page in EAS dashboard
3. ✅ Installable APK file
4. ✅ RevenueCat active (no demo mode!)

**Install on Android:**
- Download APK to phone
- Enable "Install from Unknown Sources"
- Install and run
- Test sandbox purchases!

## 🔧 Prerequisites

### Required Software

**Node.js (v18 or later):**
- Download: https://nodejs.org/
- Check: `node --version`

**Git (recommended):**
- Download: https://git-scm.com/
- Check: `git --version`
- Alternative: Use `EAS_NO_VCS=1` flag

**Android Studio (optional):**
- Only needed for local builds
- EAS cloud builds don't need it

**Xcode (optional, macOS only):**
- Only for iOS local builds
- EAS cloud builds don't need it

### Accounts Needed

**Expo Account (Free):**
- Sign up: https://expo.dev/signup
- Required for EAS builds
- 30 free builds/month

**Google Play Developer (for production):**
- Cost: $25 one-time
- Not needed for development builds
- Only when submitting to Play Store

**Apple Developer (for iOS production):**
- Cost: $99/year
- Not needed for development builds
- Only when submitting to App Store

## 📋 Complete Build Steps

### 1. Export & Setup (5 min)

```bash
# After exporting from Bolt
cd kujili-live-streaming
npm install

# Verify project works
npm run dev
# Open http://localhost:8081 in browser
```

### 2. Initialize EAS (2 min)

```bash
# Login to Expo
npx eas login

# Configure EAS project
npx eas build:configure
```

Answer prompts:
- ✅ Yes to create new project
- ✅ Accept default bundle identifier
- ✅ Auto-generate credentials

### 3. First Build - Android (30 min)

```bash
npx eas build --profile development --platform android
```

**What happens:**
1. ✅ Uploads project to EAS
2. ✅ Installs dependencies
3. ✅ Generates signing credentials
4. ✅ Builds native APK
5. ✅ Provides download link

**Monitor progress:**
- Terminal shows build URL
- Open in browser to watch
- Logs show real-time progress

### 4. Install & Test (10 min)

**Download APK:**
1. Click download link from terminal
2. Or go to build page
3. Download to phone

**Install on Android:**
1. Enable "Unknown Sources" in Settings
2. Open APK file
3. Tap "Install"
4. Open app

**Test RevenueCat:**
1. Sign up / Login
2. Go to Profile → "Buy Coins"
3. Notice: No "DEMO" badges!
4. Select a package
5. Complete sandbox purchase
6. Verify coins added

### 5. Build iOS (if needed)

```bash
npx eas build --profile development --platform ios
```

**Additional steps:**
- Connect Apple Developer account
- Register device UDID
- Install via TestFlight or direct

## 🎯 Alternative: Without Git

If you don't have git installed:

```bash
# Set environment variable
export EAS_NO_VCS=1

# Then build normally
npx eas build --profile development --platform android
```

Or in one command:
```bash
EAS_NO_VCS=1 npx eas build --profile development --platform android
```

## 🐛 Troubleshooting

### Build Fails: Not Logged In

```bash
npx eas login
# Sign in via browser
```

### Build Fails: No Project ID

```bash
npx eas build:configure
# Generates project ID in app.json
```

### Build Fails: Missing Credentials

```bash
npx eas credentials
# Generate or upload credentials
```

### Build Fails: Dependencies

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Try again
npx eas build --profile development --platform android
```

### Can't Export from Bolt

**Manual method:**
1. Copy all files visible in Bolt
2. Create local project directory
3. Paste files
4. Run `npm install`

### Node Version Issues

```bash
# Check version
node --version

# Should be 18.x or higher
# If lower, update Node.js
```

## 📊 Environment Variables

Your `.env` file is automatically included:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://qljgggvpoaitnzclwgjk.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
EXPO_PUBLIC_REVENUECAT_API_KEY_IOS=test_MLZoCXYSVuBiTntatCrGRvjGqFj
EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID=test_MLZoCXYSVuBiTntatCrGRvjGqFj
```

These are embedded in the build and available at runtime.

### Production Keys (Later)

When ready for production:
1. Get production API keys from RevenueCat
2. Update `.env` file:
```bash
EXPO_PUBLIC_REVENUECAT_API_KEY_IOS=appl_prod_XxXxXxXxXx
EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID=goog_prod_YyYyYyYyYy
```
3. Rebuild with production profile:
```bash
npx eas build --profile production --platform all
```

## 🚀 Build Profiles

### Development
```bash
npx eas build --profile development --platform android
```
- ✅ Expo Dev Client included
- ✅ Internal distribution
- ✅ Fast iteration
- ✅ Hot reload

### Preview
```bash
npx eas build --profile preview --platform android
```
- ✅ APK for testing
- ✅ No dev client overhead
- ✅ Closer to production

### Production
```bash
npx eas build --profile production --platform android
```
- ✅ Optimized for stores
- ✅ Release configuration
- ✅ Smallest bundle size

## 📱 Platform-Specific Builds

### Android Only
```bash
npx eas build --profile development --platform android
```
- Faster build time
- Easier to test
- No Apple account needed

### iOS Only
```bash
npx eas build --profile development --platform ios
```
- Requires Apple Developer account
- Device UDID registration needed
- TestFlight or direct install

### Both Platforms
```bash
npx eas build --profile development --platform all
```
- Two separate builds
- Both run in parallel
- Double the build time

## 💰 Cost Breakdown

### Free Tier
- 30 builds per month
- Shared infrastructure
- Standard speed
- Perfect for development

### Paid Plans
- **Production ($29/month):**
  - 60 builds/month
  - Priority queue
  - Faster machines

- **Enterprise ($99/month):**
  - 240 builds/month
  - Highest priority
  - Fastest machines

### Pay As You Go
- $29 per build beyond monthly limit
- No subscription needed
- Good for occasional builds

## 📚 Next Steps After First Build

### 1. Test Development Build
- ✅ Install APK on device
- ✅ Test all features
- ✅ Verify RevenueCat works
- ✅ Test sandbox purchases

### 2. Set Up Sandbox Testing

**Android:**
1. Go to Play Console
2. Add test account
3. Test purchases (no charge)

**iOS:**
1. Create sandbox tester
2. Sign out of App Store
3. Test purchases with sandbox account

### 3. Configure Store Products

**RevenueCat Dashboard:**
1. Create products (coins_100, coins_500, etc.)
2. Link to Play Store products
3. Link to App Store products
4. Test entitlements

**Play Console:**
1. Create in-app products
2. Set prices
3. Activate products

**App Store Connect:**
1. Create in-app purchases
2. Set price tiers
3. Submit for review

### 4. Build for Production

```bash
# Update to production keys
# Then build production version
npx eas build --profile production --platform all
```

### 5. Submit to Stores

```bash
# Android
npx eas submit --platform android

# iOS
npx eas submit --platform ios
```

## ⚡ Quick Reference

**Setup:**
```bash
npm install
npx eas login
npx eas build:configure
```

**Build Commands:**
```bash
# Development (Android)
npx eas build --profile development --platform android

# Production (Both)
npx eas build --profile production --platform all

# Without Git
EAS_NO_VCS=1 npx eas build --profile development --platform android
```

**Check Status:**
```bash
npx eas build:list
npx eas build:view [build-id]
```

**Submit:**
```bash
npx eas submit --platform android
npx eas submit --platform ios
```

## 🎉 Success Checklist

- [ ] Exported project from Bolt
- [ ] Installed dependencies locally
- [ ] Logged into Expo
- [ ] Ran `eas build:configure`
- [ ] Started first build
- [ ] Downloaded APK/IPA
- [ ] Installed on device
- [ ] Tested app features
- [ ] Tested RevenueCat purchases
- [ ] Configured sandbox testing
- [ ] Ready for production!

## 📞 Support

**EAS Build Issues:**
- Docs: https://docs.expo.dev/build/introduction/
- Forums: https://forums.expo.dev/

**RevenueCat Issues:**
- Docs: https://docs.revenuecat.com/
- Support: support@revenuecat.com

**General Expo:**
- Discord: https://discord.gg/expo
- Forums: https://forums.expo.dev/

---

## 🎯 Summary

**Right Now in Bolt:**
- ❌ Can't build (no authentication)
- ✅ Can develop and test UI
- ✅ All code is complete

**After Exporting:**
- ✅ Full build capability
- ✅ EAS authentication works
- ✅ RevenueCat active in builds
- ✅ Ready for store submission

**Your Next Step:**
1. Export project from Bolt
2. Open locally
3. Run: `npx eas login && npx eas build --profile development --platform android`
4. Test on device
5. 🎉 Success!

---

**Time estimate for first build:**
- Export & setup: 5 minutes
- EAS login: 2 minutes
- Build time: 20-30 minutes
- Install & test: 10 minutes
- **Total: ~45 minutes**

**You're ready to ship! 🚀**
