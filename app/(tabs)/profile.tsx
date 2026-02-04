import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Coins, Gem, Users, UserPlus, Settings, LogOut, ShoppingBag, MapPin } from 'lucide-react-native';
import { useAuth } from '../../contexts/AuthContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, signOut } = useAuth();

  const handleSignOut = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/auth/login');
          },
        },
      ]
    );
  };

  const formatINR = (coins: number): string => {
    const inr = (coins * 0.8).toFixed(2);
    return `₹${inr}`;
  };

  return (
    <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile 👤</Text>
          <Text style={styles.headerSubtitle}>Your Account</Text>
        </View>

        <LinearGradient
          colors={['#FF4B6E', '#FF8A00', '#FFD700']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.profileCard}
        >
          <Image
            source={{ uri: profile?.avatar_url || 'https://ui-avatars.com/api/?name=User' }}
            style={styles.avatar}
          />
          <Text style={styles.fullName}>{profile?.full_name || 'User'}</Text>
          <Text style={styles.username}>@{profile?.username || 'username'}</Text>
          {profile?.bio && <Text style={styles.bio}>{profile.bio}</Text>}

          {profile?.location_city && (
            <View style={styles.locationContainer}>
              <MapPin size={14} color="#fff" />
              <Text style={styles.locationText}>
                {profile.location_city}, {profile.location_state || 'India'}
              </Text>
            </View>
          )}
        </LinearGradient>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Users size={24} color="#FF4B6E" />
            <Text style={styles.statValue}>{profile?.followers_count || 0}</Text>
            <Text style={styles.statLabel}>Followers</Text>
            <Text style={styles.statLabelHindi}>फॉलोअर्स</Text>
          </View>

          <View style={styles.statCard}>
            <UserPlus size={24} color="#FF8A00" />
            <Text style={styles.statValue}>{profile?.following_count || 0}</Text>
            <Text style={styles.statLabel}>Following</Text>
            <Text style={styles.statLabelHindi}>फॉलोइंग</Text>
          </View>

          <View style={styles.statCard}>
            <Coins size={24} color="#FFD700" />
            <Text style={styles.statValue}>{profile?.coins || 0}</Text>
            <Text style={styles.statLabel}>Coins</Text>
            <Text style={styles.statLabelHindi}>सिक्के</Text>
          </View>
        </View>

        <View style={styles.walletSection}>
          <Text style={styles.sectionTitle}>Wallet 💰</Text>
          <Text style={styles.sectionSubtitle}>Your Balance & Earnings</Text>

          <LinearGradient
            colors={['#FFD700', '#FF8A00']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.walletCard}
          >
            <View style={styles.walletItem}>
              <View style={styles.walletInfo}>
                <Coins size={32} color="#fff" />
                <View style={styles.walletDetails}>
                  <Text style={styles.walletLabel}>Available Coins</Text>
                  <Text style={styles.walletValue}>{profile?.coins || 0} Coins</Text>
                  <Text style={styles.walletValueINR}>≈ {formatINR(profile?.coins || 0)}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.buyButton}
                onPress={() => router.push('/coins/purchase')}
              >
                <ShoppingBag size={20} color="#FFD700" />
                <Text style={styles.buyButtonText}>Buy Coins</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <LinearGradient
            colors={['#00D9FF', '#6B46FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.walletCard}
          >
            <View style={styles.walletItem}>
              <View style={styles.walletInfo}>
                <Gem size={32} color="#fff" />
                <View style={styles.walletDetails}>
                  <Text style={styles.walletLabel}>Diamonds (Earnings)</Text>
                  <Text style={styles.walletValue}>{profile?.diamonds || 0} Diamonds</Text>
                  <Text style={styles.walletValueINR}>≈ {formatINR((profile?.diamonds || 0) * 2)}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.withdrawButton}>
                <Text style={styles.withdrawButtonText}>Withdraw</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.menuSection}>
          <TouchableOpacity style={styles.menuItem}>
            <Settings size={24} color="#FF4B6E" />
            <View style={styles.menuContent}>
              <Text style={styles.menuText}>Settings</Text>
              <Text style={styles.menuTextHindi}>App preferences</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/coins/purchase')}
          >
            <ShoppingBag size={24} color="#FFD700" />
            <View style={styles.menuContent}>
              <Text style={styles.menuText}>Buy Coins</Text>
              <Text style={styles.menuTextHindi}>Purchase coin packages</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleSignOut}>
            <LogOut size={24} color="#FF4B6E" />
            <View style={styles.menuContent}>
              <Text style={styles.menuText}>Logout</Text>
              <Text style={styles.menuTextHindi}>Sign out of your account</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>Made in India 🇮🇳</Text>
          <Text style={styles.infoTextHindi}>Proudly serving Indian creators</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 60,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 18,
    color: '#aaa',
    marginTop: 4,
  },
  profileCard: {
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#fff',
    marginBottom: 16,
  },
  fullName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  username: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
  },
  bio: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    marginTop: 8,
    textAlign: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 6,
  },
  locationText: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 4,
  },
  statLabelHindi: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
  },
  walletSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 12,
  },
  walletCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
  },
  walletItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  walletInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  walletDetails: {
    flex: 1,
  },
  walletLabel: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  walletValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },
  walletValueINR: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    marginTop: 2,
  },
  buyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  buyButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  withdrawButton: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  withdrawButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  menuSection: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    gap: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  menuTextHindi: {
    fontSize: 13,
    color: '#aaa',
    marginTop: 2,
  },
  infoBox: {
    backgroundColor: 'rgba(255,75,110,0.2)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  infoText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  infoTextHindi: {
    color: '#aaa',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
  },
});
