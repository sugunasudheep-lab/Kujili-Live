# 🎥 Kujili - Live Streaming & Shorts App

A full-featured live streaming and short-form video social platform built with React Native & Expo, inspired by Bigo Live and TikTok.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Expo](https://img.shields.io/badge/Expo-SDK%2054-000020.svg)
![React Native](https://img.shields.io/badge/React%20Native-0.81-61dafb.svg)

## ✨ Features

### 🎬 Live Streaming
- **Host live streams** with real-time video broadcasting
- **Interactive chat** with viewers in real-time
- **Viewer count** and engagement metrics
- **Categories** for different content types
- **Stream discovery** with personalized recommendations

### 📱 Shorts (Vertical Videos)
- **TikTok-style feed** with swipeable vertical videos
- **Multi-language support** (8+ languages)
- **Engagement features**: likes, comments, shares
- **View tracking** and analytics
- **Language filters** for content discovery

### 🔐 Authentication
- **Multiple login methods**:
  - Email + Password
  - Phone + Password
  - Phone + OTP (SMS verification)
- **Secure authentication** via Supabase Auth
- **User profiles** with customizable avatars

### 💎 Monetization
- **Virtual coins** system for tipping
- **Gift marketplace** with 6 different gifts
- **Bonus packages** with extra coins
- **Creator earnings** in diamonds
- **Secure transactions** with instant crediting

### 👥 Social Features
- **Follow/Unfollow** system
- **User profiles** with stats
- **Direct messaging** (coming soon)
- **Engagement metrics**: followers, following, views
- **Content discovery** by category and language

### 📸 Advanced Expo Features
- **Push Notifications** - Real-time alerts for new followers, likes, comments
- **Image Picker** - Upload photos from gallery or camera
- **Video Recording** - Record short videos up to 60 seconds
- **Sharing** - Share content to social media
- **Location Services** - Discover nearby streams
- **Photo Editing** - Crop and edit before uploading

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo Go app on your phone

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd kujili-live-streaming

# Install dependencies
npm install

# Start development server
npm run dev
```

### Run on Device
1. Install Expo Go from [App Store](https://apps.apple.com/app/expo-go/id982107779) or [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
2. Scan the QR code with your phone
3. App will open in Expo Go

## 📱 Download & Deploy

### Mobile Apps (iOS/Android)
See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on:
- Building for iOS/Android
- Creating production builds with EAS
- Publishing to app stores
- Configuration and environment setup

### 🌐 Web App (Netlify - FREE Domain!)

Deploy to Netlify and get a free domain in 2 minutes:

```bash
# Build for web
npm run build:web

# Deploy to Netlify
netlify deploy --prod
```

**Or use GitHub auto-deploy:**
1. Push code to GitHub
2. Connect repository to Netlify
3. Auto-deploy on every push!

**Your free domain**: `https://your-app.netlify.app`

See [NETLIFY_DEPLOYMENT.md](./NETLIFY_DEPLOYMENT.md) for complete guide including:
- One-click GitHub deployment
- Custom domain setup
- Environment variables
- CDN & SSL configuration
- Continuous deployment
- Performance optimization

## 🌍 Supported Languages

Content can be created and consumed in:
- 🇺🇸 English
- 🇪🇸 Spanish
- 🇫🇷 French
- 🇩🇪 German
- 🇮🇳 Hindi
- 🇸🇦 Arabic
- 🇨🇳 Chinese
- 🇯🇵 Japanese

## 🏗️ Tech Stack

- **Frontend**: React Native with Expo SDK 54
- **Navigation**: Expo Router (file-based routing)
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime
- **Storage**: Supabase Storage (for videos/images)
- **UI Icons**: Lucide React Native
- **Gradients**: expo-linear-gradient
- **Notifications**: expo-notifications
- **Media**: expo-image-picker, expo-av, expo-camera
- **Location**: expo-location
- **Sharing**: expo-sharing
- **Web Hosting**: Netlify (with free SSL & CDN)

## 📂 Project Structure

```
├── app/                    # Application screens
│   ├── (tabs)/            # Tab navigation
│   │   ├── index.tsx      # Home (live streams)
│   │   ├── shorts.tsx     # Shorts feed
│   │   ├── explore.tsx    # Discovery
│   │   ├── go-live.tsx    # Start streaming
│   │   ├── messages.tsx   # Messages
│   │   └── profile.tsx    # User profile
│   ├── auth/              # Authentication
│   ├── stream/[id].tsx    # Stream viewer
│   └── coins/             # Monetization
├── contexts/              # React Context providers
├── lib/                   # Utilities and clients
├── supabase/              # Database migrations
└── assets/                # Images and icons
```

## 🎨 Design Highlights

- **Modern gradient UI** with vibrant colors
- **Dark theme** optimized for video content
- **Smooth animations** and transitions
- **Responsive layouts** for all screen sizes
- **Touch-optimized** controls and gestures
- **Professional icons** throughout

## 🗄️ Database Features

- **Row Level Security** on all tables
- **Real-time subscriptions** for live updates
- **Optimized indexes** for fast queries
- **Triggers** for automatic counter updates
- **Multi-language** content support
- **Scalable architecture**

## 📊 Key Metrics Tracked

- Stream viewer counts
- Video view counts
- Like/comment engagement
- Follower growth
- Gift transactions
- User activity

## 🔒 Security

- Supabase Row Level Security (RLS)
- Secure authentication flows
- Protected API endpoints
- Environment variable management
- User data privacy
- Secure payment processing

## 🎯 Roadmap

- [ ] Video uploads for Shorts
- [ ] Direct messaging system
- [ ] Push notifications
- [ ] Advanced analytics dashboard
- [ ] Content moderation tools
- [ ] Live streaming with RTMP
- [ ] Multi-camera support
- [ ] Screen sharing in streams
- [ ] Subscription tiers
- [ ] Advanced filters and effects

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev)
- Backend by [Supabase](https://supabase.com)
- Icons from [Lucide](https://lucide.dev)
- Inspired by Bigo Live and TikTok

## 📞 Support

For help and support:
- Check [DEPLOYMENT.md](./DEPLOYMENT.md)
- Review [Expo Docs](https://docs.expo.dev)
- Read [Supabase Docs](https://supabase.com/docs)

---

**Made with ❤️ for content creators and streamers worldwide**
