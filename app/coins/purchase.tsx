import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Coins, Star, Zap, Check, ArrowLeft, ShoppingBag } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { supabase, CoinPackage } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export default function CoinPurchaseScreen() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [packages, setPackages] = useState<CoinPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  useEffect(() => {
    fetchCoinPackages();
  }, []);

  const fetchCoinPackages = async () => {
    try {
      const { data, error } = await supabase
        .from('coin_packages')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (error) throw error;
      setPackages(data || []);
    } catch (error) {
      console.error('Error fetching coin packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (pkg: CoinPackage) => {
    if (!user) {
      Alert.alert('Authentication Required', 'Please log in to purchase coins.');
      return;
    }

    setSelectedPackage(pkg.id);

    Alert.alert(
      'Purchase Coins',
      `You are about to purchase ${pkg.coin_amount + pkg.bonus_coins} coins for ₹${pkg.price_inr}.\n\nNote: To enable real purchases, this app needs to be exported and built with RevenueCat integration for Play Store and App Store in-app purchases.`,
      [
        { text: 'Cancel', style: 'cancel', onPress: () => setSelectedPackage(null) },
        {
          text: 'Demo Purchase',
          onPress: async () => {
            try {
              const totalCoins = pkg.coin_amount + pkg.bonus_coins;

              const { error } = await supabase.rpc('add_coins_to_user', {
                p_user_id: user.id,
                p_amount: totalCoins,
                p_transaction_type: 'purchase',
                p_package_id: pkg.id,
                p_description: `Purchased ${pkg.name}`,
                p_reference_id: `demo_${Date.now()}`,
              });

              if (error) throw error;

              Alert.alert(
                'Success!',
                `${totalCoins} coins have been added to your account!`,
                [{ text: 'OK', onPress: () => router.back() }]
              );
            } catch (error) {
              console.error('Error processing purchase:', error);
              Alert.alert('Error', 'Failed to process purchase. Please try again.');
            } finally {
              setSelectedPackage(null);
            }
          },
        },
      ]
    );
  };

  const renderPackage = (pkg: CoinPackage) => {
    const totalCoins = pkg.coin_amount + pkg.bonus_coins;
    const isSelected = selectedPackage === pkg.id;

    return (
      <TouchableOpacity
        key={pkg.id}
        onPress={() => handlePurchase(pkg)}
        disabled={isSelected}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={pkg.is_popular ? ['#FF4B6E', '#FF8A00'] : ['#2c2c3e', '#1a1a2e']}
          style={[styles.packageCard, pkg.is_popular && styles.popularCard]}
        >
          {pkg.is_popular && (
            <View style={styles.popularBadge}>
              <Star size={14} color="#FFD700" fill="#FFD700" />
              <Text style={styles.popularText}>MOST POPULAR</Text>
            </View>
          )}

          {pkg.discount_percentage > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{pkg.discount_percentage}% OFF</Text>
            </View>
          )}

          <View style={styles.packageHeader}>
            <View style={styles.coinIconContainer}>
              <Coins size={40} color="#FFD700" />
            </View>
            <Text style={styles.packageName}>{pkg.name}</Text>
          </View>

          <View style={styles.coinAmountContainer}>
            <Text style={styles.coinAmount}>{pkg.coin_amount.toLocaleString()}</Text>
            <Text style={styles.coinLabel}>Coins</Text>
          </View>

          {pkg.bonus_coins > 0 && (
            <View style={styles.bonusContainer}>
              <Zap size={16} color="#FFD700" fill="#FFD700" />
              <Text style={styles.bonusText}>+{pkg.bonus_coins} Bonus Coins</Text>
            </View>
          )}

          <View style={styles.priceContainer}>
            <Text style={styles.priceINR}>₹{pkg.price_inr}</Text>
            <Text style={styles.priceUSD}>${pkg.price_usd}</Text>
          </View>

          <View style={styles.totalCoinsContainer}>
            <Check size={16} color="#00D9A5" />
            <Text style={styles.totalCoinsText}>
              Total: {totalCoins.toLocaleString()} coins
            </Text>
          </View>

          {isSelected && (
            <View style={styles.processingOverlay}>
              <Text style={styles.processingText}>Processing...</Text>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1a1a2e', '#16213e', '#0f0f1e']} style={styles.gradient}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Purchase Coins</Text>
          <View style={styles.headerRight}>
            <ShoppingBag size={24} color="#fff" />
          </View>
        </View>

        <View style={styles.balanceCard}>
          <LinearGradient colors={['#FF4B6E', '#FF8A00']} style={styles.balanceGradient}>
            <Coins size={32} color="#fff" />
            <View style={styles.balanceInfo}>
              <Text style={styles.balanceLabel}>Current Balance</Text>
              <Text style={styles.balanceAmount}>{profile?.coins.toLocaleString() || 0} Coins</Text>
            </View>
          </LinearGradient>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Choose Your Package</Text>
            <Text style={styles.sectionSubtitle}>
              Select a coin package below. Use coins to send gifts during live streams and support your favorite creators!
            </Text>
          </View>

          <View style={styles.packagesGrid}>
            {packages.map(pkg => renderPackage(pkg))}
          </View>

          <View style={styles.infoSection}>
            <View style={styles.infoCard}>
              <View style={styles.infoIconContainer}>
                <Coins size={24} color="#FF8A00" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>What are coins?</Text>
                <Text style={styles.infoText}>
                  Coins are the virtual currency used in Kujili to purchase gifts and support creators during live streams.
                </Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoIconContainer}>
                <Star size={24} color="#FFD700" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>How to use coins?</Text>
                <Text style={styles.infoText}>
                  Send virtual gifts to streamers you love. Your support helps creators continue making great content!
                </Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoIconContainer}>
                <Zap size={24} color="#00D9A5" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>Bonus Coins</Text>
                <Text style={styles.infoText}>
                  Get extra bonus coins with larger packages. The more you buy, the more you save!
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.noteContainer}>
            <Text style={styles.noteTitle}>Payment Methods</Text>
            <Text style={styles.noteText}>
              Payments are processed securely through Google Play Store or Apple App Store. Your purchase history and receipts are available in your respective store account.
            </Text>
            <Text style={[styles.noteText, { marginTop: 8 }]}>
              For this demo, purchases are simulated. To enable real purchases, export the app and integrate RevenueCat with Play Store and App Store.
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1e',
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerRight: {
    padding: 8,
  },
  balanceCard: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  balanceGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  balanceInfo: {
    flex: 1,
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#aaa',
    lineHeight: 20,
  },
  packagesGrid: {
    gap: 16,
  },
  packageCard: {
    borderRadius: 16,
    padding: 20,
    position: 'relative',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  popularCard: {
    borderColor: '#FFD700',
    borderWidth: 3,
  },
  popularBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  popularText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  discountBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#FF4B6E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  discountText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  packageHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  coinIconContainer: {
    marginBottom: 8,
  },
  packageName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  coinAmountContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  coinAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  coinLabel: {
    fontSize: 14,
    color: '#aaa',
  },
  bonusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
    gap: 4,
  },
  bonusText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFD700',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  priceINR: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  priceUSD: {
    fontSize: 16,
    color: '#aaa',
  },
  totalCoinsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  totalCoinsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00D9A5',
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  infoSection: {
    marginTop: 32,
    gap: 16,
  },
  infoCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
  },
  infoIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#aaa',
    lineHeight: 18,
  },
  noteContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF8A00',
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  noteText: {
    fontSize: 13,
    color: '#aaa',
    lineHeight: 20,
  },
});
