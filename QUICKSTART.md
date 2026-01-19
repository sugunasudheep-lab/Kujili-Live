# 🚀 Kujili Quick Start Guide

Get the app running on your phone in 5 minutes!

## Step 1: Install Expo Go

Download Expo Go on your phone:
- **iPhone**: [Download from App Store](https://apps.apple.com/app/expo-go/id982107779)
- **Android**: [Download from Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

## Step 2: Install Dependencies

Open terminal in the project folder:

```bash
npm install
```

## Step 3: Start the App

```bash
npm run dev
```

You'll see a QR code in your terminal!

## Step 4: Open on Your Phone

### iPhone Users:
1. Open the **Camera** app
2. Point at the QR code
3. Tap the notification that appears
4. App opens in Expo Go!

### Android Users:
1. Open **Expo Go** app
2. Tap "Scan QR code"
3. Point at the QR code on your computer
4. App loads automatically!

## 🎉 You're In!

The app is now running on your phone. Try these features:

### 1. **Create an Account**
- Tap "Sign Up"
- Choose Phone or Email
- Enter your details
- Create your profile

### 2. **Explore Content**
- **Home Tab**: Browse live streams
- **Shorts Tab**: Swipe through vertical videos
- **Explore Tab**: Find content by category

### 3. **Go Live**
- Tap "Go Live" tab
- Enter stream title and category
- Start broadcasting!

### 4. **Watch Shorts**
- Tap "Shorts" tab
- Swipe up/down to navigate
- Like, comment, and share
- Videos in multiple languages

### 5. **Buy Coins**
- Go to Profile tab
- Tap on your Coins balance
- Choose a package
- Send gifts to streamers!

## 🛠️ Troubleshooting

### QR Code Not Working?
Try these fixes:

**Option 1: Manual Connection**
```bash
npm run dev
```
Then press `i` for iOS or `a` for Android

**Option 2: Connect by URL**
1. Note the URL shown (like `exp://192.168.1.100:8081`)
2. In Expo Go, tap "Enter URL manually"
3. Paste the URL

**Option 3: Clear Cache**
```bash
npx expo start -c
```

### App Won't Load?
1. Make sure phone and computer are on same WiFi
2. Check firewall isn't blocking port 8081
3. Restart Metro bundler with `Ctrl+C` then `npm run dev`

### Build Errors?
```bash
# Clear everything and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## 📱 Building for Production

Want to install the app permanently on your phone?

### Quick Build (Android APK)
```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Build APK
eas build --platform android --profile preview
```

Download the APK and install on your Android phone!

### For iOS
iOS requires TestFlight or App Store. See [DEPLOYMENT.md](./DEPLOYMENT.md) for full instructions.

## 🎨 Key Features to Try

### Live Streaming
1. Tap "Go Live"
2. Set title and category
3. Start streaming
4. Chat with viewers in real-time

### Shorts Videos
1. Tap "Shorts" tab
2. Swipe vertically to navigate
3. Double-tap to like
4. Tap comment icon to engage

### Social Features
1. Follow interesting users
2. Send virtual gifts
3. Build your following
4. Engage with community

### Monetization
1. Buy coins from profile
2. Send gifts during streams
3. Earn diamonds as creator
4. Cash out your earnings

## 🌍 Multi-Language Content

Kujili supports 8+ languages:
- English 🇺🇸
- Spanish 🇪🇸
- French 🇫🇷
- German 🇩🇪
- Hindi 🇮🇳
- Arabic 🇸🇦
- Chinese 🇨🇳
- Japanese 🇯🇵

Look for language badges on Shorts videos!

## 💡 Pro Tips

1. **Better Performance**: Close other apps for smoother streaming
2. **Save Data**: Connect to WiFi for high-quality streams
3. **Engagement**: Post consistently to build followers
4. **Gifts**: Start with small gifts, work up to bigger ones
5. **Categories**: Use relevant categories for better discovery

## 📞 Need Help?

- Check [README.md](./README.md) for full documentation
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment guides
- Review [Expo Docs](https://docs.expo.dev) for Expo help

## 🎉 Ready to Stream!

You're all set! Start exploring, create content, and connect with creators worldwide.

**Happy Streaming! 📱✨**
