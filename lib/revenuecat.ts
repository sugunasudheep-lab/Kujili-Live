import { Platform } from 'react-native';
import Purchases, {
  PurchasesOffering,
  PurchasesPackage,
  CustomerInfo,
  LOG_LEVEL,
} from 'react-native-purchases';
import Constants from 'expo-constants';

const API_KEY_IOS = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_IOS || '';
const API_KEY_ANDROID = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID || '';

let isConfigured = false;

export const configureRevenueCat = async (): Promise<void> => {
  if (isConfigured) {
    console.log('RevenueCat already configured');
    return;
  }

  if (Platform.OS === 'web') {
    console.log('RevenueCat not available on web platform');
    return;
  }

  try {
    const apiKey = Platform.OS === 'ios' ? API_KEY_IOS : API_KEY_ANDROID;

    if (!apiKey || apiKey.includes('your_') || apiKey === '') {
      console.warn(
        'RevenueCat API key not configured. Set EXPO_PUBLIC_REVENUECAT_API_KEY_IOS and EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID in your .env file'
      );
      return;
    }

    Purchases.setLogLevel(LOG_LEVEL.DEBUG);

    await Purchases.configure({
      apiKey,
      appUserID: undefined,
    });

    isConfigured = true;
    console.log('RevenueCat configured successfully');
  } catch (error) {
    console.error('Error configuring RevenueCat:', error);
    throw error;
  }
};

export const getOfferings = async (): Promise<PurchasesOffering | null> => {
  if (Platform.OS === 'web') {
    return null;
  }

  try {
    const offerings = await Purchases.getOfferings();
    if (offerings.current !== null && offerings.current.availablePackages.length !== 0) {
      return offerings.current;
    }
    return null;
  } catch (error) {
    console.error('Error getting offerings:', error);
    return null;
  }
};

export const purchasePackage = async (
  packageToPurchase: PurchasesPackage
): Promise<{ customerInfo: CustomerInfo; success: boolean }> => {
  if (Platform.OS === 'web') {
    throw new Error('RevenueCat not available on web platform');
  }

  try {
    const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
    return { customerInfo, success: true };
  } catch (error: any) {
    if (error.userCancelled) {
      console.log('User cancelled purchase');
      return { customerInfo: error.customerInfo, success: false };
    }
    console.error('Error purchasing package:', error);
    throw error;
  }
};

export const restorePurchases = async (): Promise<CustomerInfo> => {
  if (Platform.OS === 'web') {
    throw new Error('RevenueCat not available on web platform');
  }

  try {
    const customerInfo = await Purchases.restorePurchases();
    return customerInfo;
  } catch (error) {
    console.error('Error restoring purchases:', error);
    throw error;
  }
};

export const getCustomerInfo = async (): Promise<CustomerInfo | null> => {
  if (Platform.OS === 'web') {
    return null;
  }

  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo;
  } catch (error) {
    console.error('Error getting customer info:', error);
    return null;
  }
};

export const setUserID = async (userID: string): Promise<void> => {
  if (Platform.OS === 'web') {
    return;
  }

  try {
    await Purchases.logIn(userID);
    console.log('User logged in to RevenueCat:', userID);
  } catch (error) {
    console.error('Error setting user ID:', error);
  }
};

export const logout = async (): Promise<void> => {
  if (Platform.OS === 'web') {
    return;
  }

  try {
    await Purchases.logOut();
    console.log('User logged out from RevenueCat');
  } catch (error) {
    console.error('Error logging out:', error);
  }
};

export const isRevenueCatConfigured = (): boolean => {
  return isConfigured && Platform.OS !== 'web';
};

export const COIN_PRODUCT_IDS = {
  STARTER_100: Platform.select({
    ios: 'coins_100',
    android: 'com.kujili.coins.100',
    default: 'coins_100',
  }),
  POPULAR_500: Platform.select({
    ios: 'coins_500',
    android: 'com.kujili.coins.500',
    default: 'coins_500',
  }),
  VALUE_1000: Platform.select({
    ios: 'coins_1000',
    android: 'com.kujili.coins.1000',
    default: 'coins_1000',
  }),
  BEST_2500: Platform.select({
    ios: 'coins_2500',
    android: 'com.kujili.coins.2500',
    default: 'coins_2500',
  }),
  PREMIUM_5000: Platform.select({
    ios: 'coins_5000',
    android: 'com.kujili.coins.5000',
    default: 'coins_5000',
  }),
  ULTIMATE_10000: Platform.select({
    ios: 'coins_10000',
    android: 'com.kujili.coins.10000',
    default: 'coins_10000',
  }),
};
