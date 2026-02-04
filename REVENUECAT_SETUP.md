# RevenueCat Integration Guide

This guide explains how to set up and configure RevenueCat for real in-app purchases in the Kujili app.

## Overview

The app is now fully integrated with RevenueCat and ready for production in-app purchases. RevenueCat handles:
- ✅ Google Play Store billing (Android)
- ✅ Apple App Store billing (iOS)
- ✅ Receipt validation
- ✅ Purchase tracking and analytics
- ✅ Cross-platform user management
- ✅ Subscription management (future feature)

## Current Status

**Demo Mode Active** - The app works with simulated purchases until you configure RevenueCat API keys.

## Prerequisites

1. **RevenueCat Account** - [Sign up here](https://app.revenuecat.com/signup)
2. **Google Play Console Account** (for Android)
3. **Apple Developer Account** (for iOS)
4. **Development Build** (web doesn't support RevenueCat)

## Step 1: Create RevenueCat Account & Project

### 1.1 Sign Up
1. Go to [RevenueCat Dashboard](https://app.revenuecat.com/signup)
2. Create an account
3. Create a new project named "Kujili" or your app name

### 1.2 Note Your API Keys
After creating the project, you'll see API keys:
- **iOS API Key** - Starts with `appl_`
- **Android API Key** - Starts with `goog_`

Save these for Step 3!

## Step 2: Configure Store Products

### 2.1 Google Play Store Setup (Android)

1. **Create Products in Play Console**
   - Go to [Google Play Console](https://play.google.com/console)
   - Navigate to: **Monetize** → **In-app products**
   - Create 6 managed products:

   | Product ID | Name | Price (INR) | Price (USD) |
   |------------|------|-------------|-------------|
   | `com.kujili.coins.100` | 100 Coins | ₹79 | $0.99 |
   | `com.kujili.coins.500` | 500 Coins + 50 Bonus | ₹399 | $4.99 |
   | `com.kujili.coins.1000` | 1000 Coins + 150 Bonus | ₹799 | $9.99 |
   | `com.kujili.coins.2500` | 2500 Coins + 500 Bonus | ₹1,599 | $19.99 |
   | `com.kujili.coins.5000` | 5000 Coins + 1250 Bonus | ₹3,199 | $39.99 |
   | `com.kujili.coins.10000` | 10000 Coins + 3000 Bonus | ₹6,399 | $79.99 |

2. **Get Service Credentials**
   - In Play Console: **Setup** → **API access**
   - Create or use existing service account
   - Download JSON key file

3. **Connect RevenueCat to Play Store**
   - In RevenueCat Dashboard: **Project Settings** → **Google Play**
   - Upload the service credentials JSON
   - Enter your app's package name (e.g., `com.kujili.app`)

### 2.2 Apple App Store Setup (iOS)

1. **Create Products in App Store Connect**
   - Go to [App Store Connect](https://appstoreconnect.apple.com/)
   - Select your app
   - Navigate to: **Features** → **In-App Purchases**
   - Create 6 consumable IAPs:

   | Product ID | Display Name | Price (USD) |
   |------------|--------------|-------------|
   | `coins_100` | 100 Coins | $0.99 |
   | `coins_500` | 500 Coins + 50 Bonus | $4.99 |
   | `coins_1000` | 1000 Coins + 150 Bonus | $9.99 |
   | `coins_2500` | 2500 Coins + 500 Bonus | $19.99 |
   | `coins_5000` | 5000 Coins + 1250 Bonus | $39.99 |
   | `coins_10000` | 10000 Coins + 3000 Bonus | $79.99 |

2. **Configure Shared Secret**
   - In App Store Connect: **Users and Access** → **Shared Secret**
   - Generate if not already created
   - Copy the shared secret

3. **Connect RevenueCat to App Store**
   - In RevenueCat Dashboard: **Project Settings** → **Apple**
   - Enter your Bundle ID (e.g., `com.kujili.app`)
   - Paste the App Store Shared Secret
   - Enable App Store Server Notifications

### 2.3 Configure Products in RevenueCat

1. **Create Entitlements** (Optional for basic IAP)
   - Go to **Entitlements** in RevenueCat Dashboard
   - Create entitlement named "coins" if you want to track
   - This is optional for consumable purchases

2. **Create Offerings**
   - Go to **Offerings** in RevenueCat Dashboard
   - Create offering named "coin_packages"
   - Add all 6 products to this offering
   - Set display order

3. **Link Products**
   - For each product:
     - Click **Add Product**
     - Select **iOS** and enter `coins_100`, `coins_500`, etc.
     - Select **Android** and enter `com.kujili.coins.100`, etc.
     - Save each product

## Step 3: Configure API Keys in Your App

### 3.1 Update .env File

Open your `.env` file and replace the placeholder values:

```bash
# RevenueCat API Keys - Get these from RevenueCat Dashboard
EXPO_PUBLIC_REVENUECAT_API_KEY_IOS=appl_xxxxxxxxxxxxxxxxx
EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID=goog_xxxxxxxxxxxxxxxxx
```

**Where to find these:**
- RevenueCat Dashboard → **Project Settings** → **API Keys**
- Copy the iOS key (starts with `appl_`)
- Copy the Android key (starts with `goog_`)

### 3.2 Restart Development Server

After updating .env:
```bash
# Stop the dev server and restart
npm run dev
```

## Step 4: Build & Test

### 4.1 Create Development Build

RevenueCat requires native code, so you need a development build:

```bash
# Install EAS CLI if not already installed
npm install -g eas-cli

# Login to Expo
eas login

# Configure EAS Build
eas build:configure

# Create development build for Android
eas build --profile development --platform android

# Create development build for iOS
eas build --profile development --platform ios
```

### 4.2 Install Development Build on Device

**Android:**
1. Download the APK from EAS build page
2. Install on your Android device
3. Enable "Install from Unknown Sources" if needed

**iOS:**
1. Register your device UDID in EAS
2. Download and install the IPA
3. Or use Simulator for testing

### 4.3 Test Sandbox Purchases

**Android Testing:**
1. Add test account in Play Console: **Setup** → **License testing**
2. Add your Gmail account
3. Build and install the app
4. Make test purchases (won't be charged)

**iOS Testing:**
1. Create sandbox test account in App Store Connect
2. Sign out of regular App Store on device
3. When prompted during purchase, sign in with sandbox account
4. Test purchases (won't be charged)

## Step 5: Verify Integration

### 5.1 Check RevenueCat Connection

In your app:
1. Open the coin purchase screen
2. Check if "Demo Mode" warning disappears
3. Packages should no longer show "DEMO" badge
4. Console should show: "RevenueCat configured successfully"

### 5.2 Test Purchase Flow

1. Select a coin package
2. Confirm purchase
3. Complete payment in sandbox
4. Verify coins are added to account
5. Check transaction appears in RevenueCat Dashboard

### 5.3 Monitor Dashboard

RevenueCat Dashboard shows:
- Active users
- Revenue (sandbox shows $0)
- Transactions
- Charts and analytics

## Architecture Overview

### File Structure

```
lib/
  revenuecat.ts              # RevenueCat configuration & helpers
  coinPurchaseService.ts     # Purchase processing & Supabase integration

app/
  coins/
    purchase.tsx             # Purchase UI screen

contexts/
  AuthContext.tsx            # Auto-configures RevenueCat on auth
```

### Purchase Flow

1. **User Opens Purchase Screen**
   - Loads coin packages from Supabase
   - Fetches RevenueCat offerings
   - Matches products by ID

2. **User Selects Package**
   - Shows native payment sheet
   - RevenueCat handles purchase
   - Receipt validated automatically

3. **Purchase Complete**
   - `processCoinPurchase()` called
   - Coins added via `add_coins_to_user()` function
   - Transaction recorded in database
   - Profile refreshed with new balance

4. **Error Handling**
   - User cancellation handled gracefully
   - Network errors shown to user
   - Automatic retry on transient failures

### Demo Mode vs Production Mode

**Demo Mode** (API keys not configured):
- Shows "DEMO" badges on packages
- Shows warning banner
- Simulates successful purchase
- Adds coins immediately
- No real payment processed

**Production Mode** (API keys configured):
- No demo badges
- Shows store payment sheet
- Real payment processed
- Receipt validated by RevenueCat
- Coins added after validation

## Security Features

### RevenueCat Security
- ✅ Server-side receipt validation
- ✅ Fraud detection
- ✅ Subscription status tracking
- ✅ Restore purchases support

### Database Security
- ✅ Row Level Security (RLS) enabled
- ✅ Secure function for coin updates
- ✅ Atomic transactions
- ✅ Complete audit trail
- ✅ User can only access own data

### Purchase Validation
- ✅ Receipt verified before coins added
- ✅ Duplicate purchase prevention
- ✅ Transaction ID tracking
- ✅ Balance history maintained

## Troubleshooting

### "RevenueCat not configured" Error

**Cause:** API keys not set or invalid

**Solution:**
1. Check .env file has correct keys
2. Verify keys start with `appl_` (iOS) and `goog_` (Android)
3. Restart development server
4. Rebuild app

### "No offerings available" Error

**Cause:** Products not configured in RevenueCat

**Solution:**
1. Verify products exist in Play Console/App Store Connect
2. Check products are added to offering in RevenueCat
3. Ensure product IDs match exactly
4. Wait 15 minutes for sync

### Purchase Fails in Sandbox

**Cause:** Various store issues

**Solution:**
- **Android:** Clear Play Store cache, re-add test account
- **iOS:** Sign out and sign in with sandbox account again
- Check device has internet connection
- Verify sandbox account is valid

### Coins Not Added After Purchase

**Cause:** Database function error

**Solution:**
1. Check Supabase logs for errors
2. Verify `add_coins_to_user` function exists
3. Check RLS policies allow user to insert transactions
4. Ensure user is authenticated

## Production Deployment

### 1. Update App Configuration

Update `app.json` with your bundle ID:
```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.kujili.app"
    },
    "android": {
      "package": "com.kujili.app"
    }
  }
}
```

### 2. Build Production Apps

```bash
# Build for production
eas build --platform android --profile production
eas build --platform ios --profile production
```

### 3. Submit to Stores

**Android:**
```bash
eas submit --platform android
```

**iOS:**
```bash
eas submit --platform ios
```

### 4. Enable Production Mode

1. In Play Console: Promote app to Production track
2. In App Store Connect: Submit for review
3. Ensure products are approved and live
4. Update RevenueCat to use production credentials

## Monitoring & Analytics

### RevenueCat Dashboard

Access real-time data:
- **Overview:** Revenue, active subscriptions, trials
- **Charts:** Revenue over time, new customers, churn
- **Customers:** Individual purchase history
- **Events:** Webhook logs, API calls

### Custom Analytics

Track in your own system:
- All purchases logged in `coin_transactions` table
- Query for reports:
  ```sql
  SELECT
    DATE(created_at) as date,
    COUNT(*) as purchases,
    SUM(amount) as coins_purchased
  FROM coin_transactions
  WHERE transaction_type = 'purchase'
  GROUP BY DATE(created_at)
  ORDER BY date DESC;
  ```

## Best Practices

### 1. Testing
- Always test in sandbox before production
- Test all package sizes
- Test error scenarios (declined cards, etc.)
- Test restore purchases flow

### 2. User Experience
- Show clear pricing
- Explain what coins are used for
- Show bonus value clearly
- Handle errors gracefully
- Provide support contact

### 3. Revenue Optimization
- Use "Most Popular" badges effectively
- Offer bonus coins on larger packages
- Run promotional events
- Test different price points
- Monitor conversion rates

### 4. Compliance
- Follow App Store Review Guidelines
- Follow Google Play policies
- Clearly state terms of use
- Provide refund policy
- Handle refunds properly

## Support & Resources

### RevenueCat Resources
- [Documentation](https://www.revenuecat.com/docs)
- [Expo Integration Guide](https://www.revenuecat.com/docs/getting-started/installation/expo)
- [Community](https://community.revenuecat.com/)
- [Support](https://app.revenuecat.com/support)

### Store Resources
- [Google Play Billing](https://developer.android.com/google/play/billing)
- [Apple In-App Purchase](https://developer.apple.com/in-app-purchase/)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Play Console Help](https://support.google.com/googleplay/android-developer/)

### Kujili Documentation
- [Coin Purchase System](./COIN_PURCHASE_SYSTEM.md)
- [Project Summary](./PROJECT_SUMMARY.md)
- [Deployment Guide](./DEPLOYMENT.md)

## FAQ

**Q: Do I need RevenueCat for in-app purchases?**
A: While you can integrate directly with store SDKs, RevenueCat simplifies the process, handles receipt validation, provides analytics, and supports cross-platform users.

**Q: How much does RevenueCat cost?**
A: RevenueCat is free up to $10K monthly tracked revenue. See [pricing](https://www.revenuecat.com/pricing).

**Q: Can I use the app without RevenueCat?**
A: Yes, the app works in demo mode for testing. Real purchases require RevenueCat or direct store integration.

**Q: What happens if RevenueCat is down?**
A: RevenueCat has 99.9% uptime SLA. If down, purchases will queue and process when back online.

**Q: How do I handle refunds?**
A: Refunds are processed through the stores. RevenueCat detects refunds and triggers webhooks to update your database.

**Q: Can users purchase on web?**
A: No, in-app purchases only work on mobile. Web users must download the app.

**Q: How do I test without spending money?**
A: Use sandbox/test accounts provided by Apple and Google. These simulate purchases without charging.

**Q: What about taxes?**
A: Stores handle all tax collection and remittance. You receive net revenue.

**Q: Can I change prices after launch?**
A: Yes, update prices in store consoles. Changes sync to RevenueCat automatically.

**Q: How secure is this implementation?**
A: Very secure. RevenueCat validates receipts server-side, and our database has RLS protection. No sensitive data in client code.

---

## Quick Start Checklist

- [ ] Create RevenueCat account
- [ ] Create products in Play Console
- [ ] Create products in App Store Connect
- [ ] Configure RevenueCat integrations
- [ ] Add products to RevenueCat offerings
- [ ] Copy API keys to .env file
- [ ] Create development build
- [ ] Test sandbox purchases (Android)
- [ ] Test sandbox purchases (iOS)
- [ ] Verify coins are added correctly
- [ ] Check RevenueCat dashboard shows transactions
- [ ] Build production version
- [ ] Submit to stores for review
- [ ] Monitor analytics and revenue

**Ready to monetize!** 🎉
