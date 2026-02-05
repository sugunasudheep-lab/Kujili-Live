import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Coins, Star, Zap, Check, ArrowLeft, RefreshCw } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { CoinPackage } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { processCoinPurchase, getCoinPackages } from '../../lib/coinPurchaseService';
import { getOfferings, isRevenueCatConfigured } from '../../lib/revenuecat';
import { PurchasesPackage } from 'react-native-purchases';

export default function CoinPurchaseScreen() {
  const router = useRouter();
  const { user, profile, refreshProfile } = useAuth();
  const [packages, setPackages] = useState<CoinPackage[]>([]);
  const [revenueCatPackages, setRevenueCatPackages] = useState<Map<string, PurchasesPackage>>(new Map());
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [isRevenueCatReady, setIsRevenueCatReady] = useState(false);

  useEffect(() => {
    initializePurchaseScreen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initializePurchaseScreen = async () => {
    await fetchCoinPackages();
    await loadRevenueCatOfferings();
    setLoading(false);
  };

  const fetchCoinPackages = async () => {
    try {
      const data = await getCoinPackages();
      setPackages(data);
    } catch (error) {
      console.error('Error fetching coin packages:', error);
    }
  };

  const loadRevenueCatOfferings = async () => {
    if (Platform.OS === 'web' || !isRevenueCatConfigured()) {
      console.log('RevenueCat not available - using demo mode');
      setIsRevenueCatReady(false);
      return;
    }

    try {
      const offerings = await getOfferings();
      if (offerings && offerings.availablePackages) {
        const packageMap = new Map<string, PurchasesPackage>();
        offerings.availablePackages.forEach(pkg => {
          packageMap.set(pkg.product.identifier, pkg);
        });
        setRevenueCatPackages(packageMap);
        setIsRevenueCatReady(true);
        console.log('RevenueCat offerings loaded successfully');
      } else {
        console.warn('No RevenueCat offerings available');
        setIsRevenueCatReady(false);
      }
    } catch (error) {
      console.error('Error loading RevenueCat offerings:', error);
      setIsRevenueCatReady(false);
    }
  };

  const handlePurchase = async (pkg: CoinPackage) => {
    if (!user) {
      Alert.alert('Authentication Required', 'Please log in to purchase coins.');
      return;
    }

    setSelectedPackage(pkg.id);

    const totalCoins = pkg.coin_amount + pkg.bonus_coins;
    const productId = Platform.OS === 'ios'
      ? pkg.app_store_product_id
      : pkg.play_store_product_id;

    const revenueCatPackage = productId ? revenueCatPackages.get(productId) : undefined;

    const purchaseMode = isRevenueCatReady && revenueCatPackage ? 'real' : 'demo';

    Alert.alert(
      'Purchase Coins',
      purchaseMode === 'real'
        ? `You are about to purchase ${totalCoins} coins for ${Platform.OS === 'ios' ? '$' + pkg.price_usd : '₹' + pkg.price_inr}.\n\nPayment will be processed through ${Platform.OS === 'ios' ? 'App Store' : 'Google Play Store'}.`
        : `You are about to purchase ${totalCoins} coins for ₹${pkg.price_inr}.\n\n⚠️ DEMO MODE: This is a simulated purchase. To enable real purchases, configure RevenueCat API keys in your .env file and ensure products are set up in RevenueCat dashboard.`,
      [
        { text: 'Cancel', style: 'cancel', onPress: () => setSelectedPackage(null) },
        {
          text: purchaseMode === 'real' ? 'Purchase' : 'Demo Purchase',
          onPress: async () => {
            try {
              const result = await processCoinPurchase(
                user.id,
                pkg,
                revenueCatPackage
              );

              if (result.success) {
                await refreshProfile();

                Alert.alert(
                  'Success!',
                  `${result.coinsAdded} coins have been added to your account!\n\nNew balance: ${result.newBalance} coins`,
                  [{ text: 'OK', onPress: () => router.back() }]
                );
              } else {
                if (result.error !== 'Purchase cancelled by user') {
                  Alert.alert('Purchase Failed', result.error || 'An unknown error occurred');
                }
              }
            } catch (error: any) {
              console.error('Error processing purchase:', error);
              Alert.alert('Error', error.message || 'Failed to process purchase. Please try again.');
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

          {!isRevenueCatReady && Platform.OS !== 'web' && (
            <View style={styles.demoBadge}>
              <Text style={styles.demoText}>DEMO</Text>
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
          <TouchableOpacity onPress={loadRevenueCatOfferings} style={styles.headerRight}>
            <RefreshCw size={24} color="#fff" />
          </TouchableOpacity>
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

        {!isRevenueCatReady && Platform.OS !== 'web' && (
          <View style={styles.warningCard}>
            <Text style={styles.warningTitle}>⚠️ Demo Mode</Text>
            <Text style={styles.warningText}>
              RevenueCat is not configured. Purchases are simulated. Configure API keys to enable real purchases.
            </Text>
          </View>
        )}

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

          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading packages...</Text>
            </View>
          ) : (
            <View style={styles.packagesGrid}>
              {packages.map(pkg => renderPackage(pkg))}
            </View>
          )}

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
            <Text style={styles.noteTitle}>Payment Processing</Text>
            <Text style={styles.noteText}>
              {isRevenueCatReady
                ? `Payments are processed securely through ${Platform.OS === 'ios' ? 'Apple App Store' : 'Google Play Store'}. Your purchase history and receipts are available in your ${Platform.OS === 'ios' ? 'App Store' : 'Play Store'} account.`
                : 'RevenueCat is integrated and ready. Configure your API keys in the .env file to enable real purchases through Play Store and App Store.'
              }
            </Text>
            <Text style={[styles.noteText, { marginTop: 8 }]}>
              All purchases are powered by RevenueCat, ensuring secure payment processing and cross-platform support.
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
    marginBottom: 16,
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
  warningCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: 'rgba(255, 165, 0, 0.2)',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FFA500',
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFA500',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 13,
    color: '#fff',
    lineHeight: 18,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#aaa',
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
  demoBadge: {
    position: 'absolute',
    top: 50,
    left: 12,
    backgroundColor: '#FFA500',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  demoText: {
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
