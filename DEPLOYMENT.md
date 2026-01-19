# Kujili - Live Streaming App Deployment Guide

## 🚀 Download & Run the App with Expo

### Prerequisites
- Node.js 18+ installed
- Expo Go app on your mobile device ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
- Git installed

### Quick Start

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd kujili-live-streaming
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm run dev
```

4. **Open on your device**
   - Scan the QR code with:
     - **iOS**: Camera app
     - **Android**: Expo Go app
   - Or press `i` for iOS simulator, `a` for Android emulator

### Environment Setup

The app uses Supabase for backend. Environment variables are already configured in `.env`:
```
EXPO_PUBLIC_SUPABASE_URL=https://olvbgagmydbicqegzdse.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<your-key>
```

## 📱 Building for Production

### Build with Expo Application Services (EAS)

1. **Install EAS CLI**
```bash
npm install -g eas-cli
```

2. **Login to Expo**
```bash
eas login
```

3. **Configure your project**
```bash
eas build:configure
```

4. **Build for Android (APK)**
```bash
eas build --platform android --profile preview
```

5. **Build for iOS**
```bash
eas build --platform ios --profile preview
```

6. **Download the build**
   - Once complete, you'll get a download link
   - Android: APK file to install directly
   - iOS: Requires TestFlight or App Store

### Alternative: Build Locally

**For Android:**
```bash
npx expo prebuild
npx expo run:android
```

**For iOS:**
```bash
npx expo prebuild
npx expo run:ios
```

## 🌍 Multi-Language Support

Kujili supports content in multiple languages:
- 🇺🇸 English (en)
- 🇪🇸 Spanish (es)
- 🇫🇷 French (fr)
- 🇩🇪 German (de)
- 🇮🇳 Hindi (hi)
- 🇸🇦 Arabic (ar)
- 🇨🇳 Chinese (zh)
- 🇯🇵 Japanese (ja)

Videos are tagged with language codes and can be filtered in the Shorts feed.

## ✨ Features

### Core Features
- **Live Streaming**: Host live video streams with real-time chat
- **Shorts Videos**: TikTok-style vertical videos with swipe navigation
- **Authentication**: Email, Phone, and OTP login options
- **Virtual Gifts**: Send coins and gifts to streamers
- **Social Features**: Follow users, like content, comment
- **Multi-language**: Content in 8+ languages

### Shorts Feature
- Vertical video feed (9:16 aspect ratio)
- Swipeable interface
- Like, comment, and share functionality
- Multi-language video content
- View counters and engagement metrics

### Monetization
- Coins purchase system with bonus packages
- Virtual gifts with diamond value for creators
- In-app currency economy

## 📂 Project Structure

```
app/
├── (tabs)/           # Main tab navigation
│   ├── index.tsx     # Home feed (live streams)
│   ├── shorts.tsx    # Shorts vertical video feed
│   ├── explore.tsx   # Discover content by category
│   ├── go-live.tsx   # Start streaming
│   ├── messages.tsx  # Chat/messages
│   └── profile.tsx   # User profile
├── auth/             # Authentication screens
│   ├── login.tsx     # Login with email/phone/OTP
│   └── signup.tsx    # User registration
├── stream/           # Stream viewer
│   └── [id].tsx      # Live stream with chat
├── coins/            # Monetization
│   └── purchase.tsx  # Buy coins screen
└── profile/
    └── edit.tsx      # Edit profile

contexts/
└── AuthContext.tsx   # Authentication state management

lib/
└── supabase.ts       # Supabase client & types

supabase/
└── migrations/       # Database migrations
```

## 🗄️ Database Schema

### Tables
- **profiles**: User profiles with stats
- **streams**: Live streaming sessions
- **stream_messages**: Real-time chat messages
- **shorts**: Short-form videos
- **shorts_likes**: Video likes
- **shorts_comments**: Video comments
- **gifts**: Virtual gift catalog
- **gift_transactions**: Gift purchase history
- **follows**: User following relationships
- **categories**: Content categories

## 🎨 Design Features

- Gradient backgrounds and modern UI
- Dark theme optimized
- Smooth animations and transitions
- Icon-rich interface with Lucide icons
- Responsive layouts
- Touch-optimized controls

## 📱 Testing on Device

### Using Expo Go
1. Download Expo Go from app store
2. Run `npm run dev`
3. Scan QR code with your phone
4. App loads in Expo Go

### Creating Development Build
```bash
npx expo install expo-dev-client
eas build --profile development --platform android
```

## 🔐 Security Notes

- All sensitive data stored in Supabase with RLS
- Row Level Security enforced on all tables
- User authentication via Supabase Auth
- Secure password handling
- API keys in environment variables

## 📊 Analytics & Monitoring

The app tracks:
- Stream viewer counts
- Video view counts
- Like and comment metrics
- User engagement stats
- Gift transactions

## 🆘 Troubleshooting

### Common Issues

**Metro bundler won't start:**
```bash
npx expo start --clear
```

**Dependencies not installing:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Build fails:**
- Check Expo CLI version: `npx expo --version`
- Update dependencies: `npm update`
- Clear cache: `npx expo start -c`

## 📞 Support

For issues or questions:
1. Check the [Expo documentation](https://docs.expo.dev)
2. Review [Supabase docs](https://supabase.com/docs)
3. File an issue in the repository

## 🎉 Ready to Deploy!

Your Kujili app is ready for production. Follow the EAS build steps above to create distributable versions for iOS and Android.

**Happy Streaming! 🎥✨**
