# Quick Start: RevenueCat Integration

## Current Status: Demo Mode Active ✅

The app works perfectly right now with **simulated purchases**. To enable **real purchases**, follow the 5-minute setup below.

## Enable Real Purchases (5 Minutes)

### Step 1: Get RevenueCat Account (2 min)
```
1. Go to: https://app.revenuecat.com/signup
2. Create account
3. Create new project: "Kujili"
4. Done!
```

### Step 2: Copy Your API Keys (1 min)
```
1. In RevenueCat Dashboard → Settings → API Keys
2. Copy iOS API Key (starts with appl_)
3. Copy Android API Key (starts with goog_)
```

### Step 3: Update .env File (1 min)
```bash
# Open .env file and replace placeholders:
EXPO_PUBLIC_REVENUECAT_API_KEY_IOS=appl_your_actual_ios_key
EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID=goog_your_actual_android_key
```

### Step 4: Restart Development Server (10 sec)
```bash
# Stop current server (Ctrl+C)
npm run dev
```

### Step 5: Create Native Build (Automated)
```bash
# Install EAS CLI if needed
npm install -g eas-cli

# Build for Android (20-30 min)
eas build --profile development --platform android

# Build for iOS (30-40 min)
eas build --profile development --platform ios
```

**Done!** Install the build on your device and test purchases.

## Testing Purchases

### Android Testing
1. In Play Console: Add your email to **License testing**
2. Install development build on device
3. Make test purchase (won't be charged)
4. Verify coins are added

### iOS Testing
1. In App Store Connect: Create sandbox test user
2. Sign out of App Store on device
3. Install development build
4. Make test purchase (sign in with sandbox account)
5. Verify coins are added

## What Happens Next

### Demo Mode (Current)
- Works on web and mobile
- Shows "DEMO" badges
- Simulates purchases instantly
- Perfect for UI/UX testing
- No money transactions

### Production Mode (After Setup)
- Mobile only (iOS/Android)
- No "DEMO" badges
- Real App Store / Play Store payments
- Receipt validation
- Actual money transactions

## Product IDs Reference

### iOS (App Store)
```
coins_100
coins_500
coins_1000
coins_2500
coins_5000
coins_10000
```

### Android (Play Store)
```
com.kujili.coins.100
com.kujili.coins.500
com.kujili.coins.1000
com.kujili.coins.2500
com.kujili.coins.5000
com.kujili.coins.10000
```

## Store Setup (Required for Production)

### Google Play Console
1. Create 6 in-app products with IDs above
2. Set prices: ₹79, ₹399, ₹799, ₹1599, ₹3199, ₹6399
3. Get service account credentials
4. Upload to RevenueCat Dashboard

### Apple App Store Connect
1. Create 6 consumable products with IDs above
2. Set prices: $0.99, $4.99, $9.99, $19.99, $39.99, $79.99
3. Get shared secret
4. Add to RevenueCat Dashboard

## Troubleshooting

### "RevenueCat not configured"
→ API keys not in .env or invalid

### "No offerings available"
→ Products not configured in RevenueCat

### "Purchase failed"
→ Using production build? Need sandbox account

### Coins not added
→ Check Supabase logs, verify database function exists

## Documentation

**Complete Setup Guide:**
→ [REVENUECAT_SETUP.md](./REVENUECAT_SETUP.md)

**System Overview:**
→ [COIN_PURCHASE_SYSTEM.md](./COIN_PURCHASE_SYSTEM.md)

**Integration Details:**
→ [REVENUECAT_INTEGRATION_COMPLETE.md](./REVENUECAT_INTEGRATION_COMPLETE.md)

## Quick Commands

```bash
# Type check
npm run typecheck

# Build for web (testing)
npm run build:web

# Create development build
eas build --profile development --platform android

# Submit to stores
eas submit --platform android
eas submit --platform ios
```

## File Structure

```
lib/
  ├── revenuecat.ts           # RevenueCat SDK wrapper
  └── coinPurchaseService.ts  # Purchase processing

app/
  └── coins/
      └── purchase.tsx        # Purchase UI

contexts/
  └── AuthContext.tsx         # Auto-init RevenueCat

.env                          # API keys here!
```

## Need Help?

**RevenueCat:**
- Docs: https://docs.revenuecat.com
- Community: https://community.revenuecat.com

**Expo/EAS:**
- Docs: https://docs.expo.dev
- Build Docs: https://docs.expo.dev/build/introduction

**Supabase:**
- Dashboard: https://supabase.com/dashboard
- Docs: https://supabase.com/docs

---

## Status Checklist

**Current Implementation:**
- [x] RevenueCat SDK installed
- [x] Demo mode working
- [x] Purchase UI complete
- [x] Database integration
- [x] Documentation complete

**To Enable Production:**
- [ ] Get RevenueCat API keys
- [ ] Update .env file
- [ ] Create development build
- [ ] Configure store products
- [ ] Test sandbox purchases
- [ ] Submit to stores

**Time Estimate:**
- RevenueCat setup: 5 minutes
- Store product setup: 30 minutes
- Testing: 15 minutes
- Store submission: 1-3 days (review)

---

🚀 **Ready when you are!**
