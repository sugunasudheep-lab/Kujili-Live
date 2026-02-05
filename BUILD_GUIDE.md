# Build Guide for Play Store & App Store

## Current Status

✅ **RevenueCat Test Keys Configured!**
Your app is now ready to build with RevenueCat integration active. The test API keys in your `.env` file will enable you to test real purchases in sandbox mode.

## Prerequisites

Before building, ensure you have:
- ✅ Expo account ([sign up](https://expo.dev/signup))
- ✅ EAS CLI installed (done: installed locally)
- ✅ RevenueCat test keys (done: in .env file)
- ⏳ Apple Developer Account ($99/year) - for iOS builds
- ⏳ Google Play Developer Account ($25 one-time) - for Android builds

## Build Commands

### Development Build (For Testing)

**Android Development Build:**
```bash
npx eas build --profile development --platform android
```

**iOS Development Build:**
```bash
npx eas build --profile development --platform ios
```

**Both Platforms:**
```bash
npx eas build --profile development --platform all
```

Development builds include:
- ✅ RevenueCat SDK with test API keys
- ✅ Expo Dev Client for hot reload
- ✅ Internal distribution
- ✅ Sandbox purchases enabled
- ✅ Debug logging

### Preview Build (Internal Testing)

**Android Preview (APK):**
```bash
npx eas build --profile preview --platform android
```

**iOS Preview (Simulator):**
```bash
npx eas build --profile preview --platform ios
```

Preview builds are for:
- Testing with internal team
- QA and beta testing
- Store submission practice
- Performance testing

### Production Build (Store Submission)

**Android Production (AAB):**
```bash
npx eas build --profile production --platform android
```

**iOS Production:**
```bash
npx eas build --profile production --platform ios
```

Production builds include:
- ✅ Release optimization
- ✅ Code obfuscation
- ✅ Smaller bundle size
- ✅ Ready for store submission
- ✅ No dev tools

## Step-by-Step: First Build

### 1. Set Up EAS Project

```bash
# Login to Expo
npx eas login

# Configure your project (if not already done)
npx eas build:configure
```

You'll need to update `app.json` with your EAS project ID:
```json
{
  "expo": {
    "extra": {
      "eas": {
        "projectId": "your-actual-project-id"
      }
    }
  }
}
```

### 2. Configure Credentials

**For Android:**
```bash
# EAS will generate signing credentials automatically
# Or upload existing keystore if you have one
npx eas credentials
```

**For iOS:**
```bash
# EAS will manage certificates and provisioning profiles
# You'll need to connect your Apple Developer account
npx eas credentials
```

### 3. Build for Development

```bash
# Start with Android (easier to test)
npx eas build --profile development --platform android
```

This will:
1. Upload your project to EAS
2. Install dependencies
3. Generate signing credentials (if needed)
4. Build APK with RevenueCat
5. Provide download link

Build typically takes: **15-30 minutes**

### 4. Install Development Build

**Android:**
1. Download APK from build page
2. Transfer to device or scan QR code
3. Enable "Install from Unknown Sources"
4. Install and run

**iOS:**
1. Register device UDID with EAS
2. Download from build page
3. Install via TestFlight or direct install
4. Trust certificate in Settings

### 5. Test RevenueCat Integration

1. Open the app
2. Sign in or create account
3. Go to Profile → "Buy Coins"
4. Check: Demo mode warning should be **gone**
5. Console shows: "RevenueCat configured successfully"
6. Select a package
7. Complete sandbox purchase
8. Verify coins are added

## Testing Purchases

### Android Sandbox Testing

**Setup:**
1. Go to [Play Console](https://play.google.com/console)
2. Navigate to **Setup** → **License testing**
3. Add your Gmail account as test user
4. Save changes

**Test Purchase:**
1. Install development build
2. Sign in with test account email
3. Make purchase
4. Use test card provided by Google
5. Purchase completes without charging
6. Verify coins added to account

### iOS Sandbox Testing

**Setup:**
1. Go to [App Store Connect](https://appstoreconnect.apple.com/)
2. Navigate to **Users and Access** → **Sandbox Testers**
3. Create sandbox test user
4. Note: Use unique email (e.g., test+1@example.com)

**Test Purchase:**
1. On device: Sign out of App Store
2. Install development build
3. Attempt purchase
4. Sign in with sandbox account when prompted
5. Complete purchase (won't be charged)
6. Verify coins added to account

## Environment Variables in Build

Your `.env` file is automatically loaded during build:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://qljgggvpoaitnzclwgjk.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
EXPO_PUBLIC_REVENUECAT_API_KEY_IOS=test_MLZoCXYSVuBiTntatCrGRvjGqFj
EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID=test_MLZoCXYSVuBiTntatCrGRvjGqFj
```

These are embedded in your build and available at runtime via `process.env`.

### For Production

When ready for production:
1. Replace test keys with production keys from RevenueCat
2. Update in `.env` file
3. Build with production profile
4. Submit to stores

## Build Profiles Explained

### Development Profile
```json
{
  "development": {
    "developmentClient": true,
    "distribution": "internal"
  }
}
```
- Includes Expo Dev Client
- Enables hot reload
- Internal distribution only
- Perfect for active development

### Preview Profile
```json
{
  "preview": {
    "distribution": "internal",
    "android": { "buildType": "apk" },
    "ios": { "simulator": true }
  }
}
```
- APK for easy Android testing
- iOS simulator build
- Internal distribution
- No dev client overhead

### Production Profile
```json
{
  "production": {
    "android": { "buildType": "apk" }
  }
}
```
- Optimized for store submission
- AAB for Play Store (auto-converted)
- IPA for App Store
- Release configuration

## Troubleshooting Builds

### Build Fails: Missing Credentials

**Solution:**
```bash
npx eas credentials
# Follow prompts to generate or upload credentials
```

### Build Fails: Invalid Bundle ID

**Solution:**
Update `app.json`:
```json
{
  "expo": {
    "ios": { "bundleIdentifier": "com.yourcompany.kujili" },
    "android": { "package": "com.yourcompany.kujili" }
  }
}
```

### Build Fails: Node Modules Error

**Solution:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Try build again
npx eas build --profile development --platform android
```

### RevenueCat Not Working in Build

**Check:**
1. ✅ `.env` file has valid API keys
2. ✅ `types/env.d.ts` declares env variables
3. ✅ `lib/revenuecat.ts` uses `process.env`
4. ✅ Rebuild after changing .env

**Debug:**
```typescript
// Add to app to verify keys at runtime
console.log('iOS Key:', process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_IOS);
console.log('Android Key:', process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID);
```

### Install Fails on Device

**Android:**
- Enable "Install from Unknown Sources"
- Clear previous install
- Check storage space

**iOS:**
- Device UDID registered?
- Provisioning profile valid?
- Certificate not expired?

## Store Submission

### Android (Play Store)

**1. Build Production AAB:**
```bash
npx eas build --profile production --platform android
```

**2. Submit:**
```bash
npx eas submit --platform android
```

Or manually:
1. Download AAB from build page
2. Go to Play Console
3. Create new release in Internal Testing
4. Upload AAB
5. Complete store listing
6. Submit for review

**3. Required Assets:**
- App icon (512x512)
- Feature graphic (1024x500)
- Screenshots (min 2)
- Privacy policy URL
- Store description

### iOS (App Store)

**1. Build Production IPA:**
```bash
npx eas build --profile production --platform ios
```

**2. Submit:**
```bash
npx eas submit --platform ios
```

Or manually:
1. Download IPA from build page
2. Use Transporter app to upload
3. Go to App Store Connect
4. Complete app listing
5. Submit for review

**3. Required Assets:**
- App icon (1024x1024)
- Screenshots for all devices
- Privacy policy URL
- App Store description
- Export compliance info

## Build Optimization

### Reduce Bundle Size

**1. Enable Hermes (if not already):**
```json
{
  "expo": {
    "android": { "enableProguardInReleaseBuilds": true },
    "ios": { "bundler": "metro" }
  }
}
```

**2. Remove Unused Dependencies:**
```bash
npm install depcheck -g
depcheck
# Remove unused packages
```

**3. Optimize Assets:**
- Compress images
- Use WebP format
- Remove unused assets

### Speed Up Builds

**Use Cache:**
Builds automatically cache when possible.

**Build Locally (Advanced):**
```bash
npx eas build --local --profile development --platform android
```

Requires:
- Android Studio (for Android)
- Xcode (for iOS, macOS only)
- More setup complexity

## Monitoring Builds

### Check Build Status

**Web Dashboard:**
```
https://expo.dev/accounts/[your-account]/projects/kujili-live-streaming/builds
```

**CLI:**
```bash
npx eas build:list
npx eas build:view [build-id]
```

### Build Logs

Download logs from:
- Build details page
- Or via CLI: `npx eas build:view [build-id]`

## Cost Considerations

### EAS Build Costs

**Free Plan:**
- 30 builds/month
- Shared infrastructure
- Standard speed

**Paid Plans:**
- Starting at $29/month
- Priority builds
- Faster machines
- More builds included

**Current Usage:**
Check at: https://expo.dev/accounts/[account]/settings/billing

## Next Steps

### 1. Create Development Build (Now)
```bash
npx eas login
npx eas build --profile development --platform android
```

### 2. Test on Device (15 min)
- Install APK
- Test all features
- Verify RevenueCat works
- Test purchases in sandbox

### 3. Set Up Store Accounts (1-2 hours)
- Google Play Console account
- Apple Developer account
- Configure store listings
- Upload assets

### 4. Build for Production (Next week)
- Update to production API keys
- Build production versions
- Submit to stores
- Wait for review (1-7 days)

## Quick Reference

**Build Development:**
```bash
npx eas build --profile development --platform android
```

**Build Production:**
```bash
npx eas build --profile production --platform all
```

**Submit to Stores:**
```bash
npx eas submit --platform android
npx eas submit --platform ios
```

**Check Status:**
```bash
npx eas build:list
```

**View Build:**
```bash
npx eas build:view [build-id]
```

## Support Resources

- **EAS Build Docs:** https://docs.expo.dev/build/introduction/
- **EAS Submit Docs:** https://docs.expo.dev/submit/introduction/
- **Expo Forums:** https://forums.expo.dev/
- **RevenueCat Docs:** https://docs.revenuecat.com/

---

## Your Current Status

✅ **Ready to Build!**

You have:
- ✅ EAS CLI installed
- ✅ Build profiles configured
- ✅ RevenueCat test keys set up
- ✅ All code implemented
- ✅ Database configured

**Next command:**
```bash
npx eas login && npx eas build --profile development --platform android
```

This will create your first development build with RevenueCat integration active. You'll be able to test real purchases in sandbox mode!

🚀 **Let's build!**
