import { Platform } from 'react-native';
import { PurchasesPackage } from 'react-native-purchases';
import { supabase, CoinPackage } from './supabase';
import {
  purchasePackage as revenueCatPurchase,
  isRevenueCatConfigured,
} from './revenuecat';

export interface PurchaseResult {
  success: boolean;
  coinsAdded?: number;
  newBalance?: number;
  transactionId?: string;
  error?: string;
}

export const processCoinPurchase = async (
  userId: string,
  coinPackage: CoinPackage,
  revenueCatPackage?: PurchasesPackage
): Promise<PurchaseResult> => {
  try {
    let transactionId: string;
    let purchaseSuccess = false;

    if (Platform.OS === 'web' || !isRevenueCatConfigured() || !revenueCatPackage) {
      console.log('Using demo purchase mode');
      transactionId = `demo_${Date.now()}`;
      purchaseSuccess = true;
    } else {
      console.log('Using RevenueCat purchase');
      const result = await revenueCatPurchase(revenueCatPackage);

      if (!result.success) {
        return {
          success: false,
          error: 'Purchase cancelled by user',
        };
      }

      transactionId = result.customerInfo.originalAppUserId || `rc_${Date.now()}`;
      purchaseSuccess = true;
    }

    if (!purchaseSuccess) {
      return {
        success: false,
        error: 'Purchase failed',
      };
    }

    const totalCoins = coinPackage.coin_amount + coinPackage.bonus_coins;

    const { data, error } = await supabase.rpc('add_coins_to_user', {
      p_user_id: userId,
      p_amount: totalCoins,
      p_transaction_type: 'purchase',
      p_package_id: coinPackage.id,
      p_description: `Purchased ${coinPackage.name}`,
      p_reference_id: transactionId,
    });

    if (error) {
      console.error('Error adding coins to database:', error);
      return {
        success: false,
        error: 'Failed to add coins to account',
      };
    }

    return {
      success: true,
      coinsAdded: totalCoins,
      newBalance: data?.balance_after || 0,
      transactionId,
    };
  } catch (error: any) {
    console.error('Error processing purchase:', error);
    return {
      success: false,
      error: error.message || 'Unknown error occurred',
    };
  }
};

export const getCoinPackages = async (): Promise<CoinPackage[]> => {
  try {
    const { data, error } = await supabase
      .from('coin_packages')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching coin packages:', error);
    return [];
  }
};

export const getUserTransactionHistory = async (
  userId: string,
  limit: number = 50
): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('coin_transactions')
      .select('*, coin_packages(name)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    return [];
  }
};

export const getProductIdForPackage = (pkg: CoinPackage): string => {
  if (Platform.OS === 'ios') {
    return pkg.app_store_product_id || '';
  } else if (Platform.OS === 'android') {
    return pkg.play_store_product_id || '';
  }
  return pkg.play_store_product_id || '';
};
