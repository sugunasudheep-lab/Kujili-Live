import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../../lib/supabase';
import { ShieldCheck } from 'lucide-react-native';

export default function VerifyOTP() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const phoneNumber = params.phone as string;

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert('Error', 'कृपया 6 अंकों का OTP दर्ज करें\nPlease enter 6 digit OTP');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: otp,
        type: 'sms',
      });

      if (error) throw error;

      if (data.user) {
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', data.user.id)
          .single();

        if (!existingProfile) {
          const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(phoneNumber)}&background=FF4B6E&color=fff&size=200`;

          await supabase.from('profiles').insert({
            id: data.user.id,
            username: `user_${phoneNumber.slice(-4)}`,
            full_name: phoneNumber,
            avatar_url: avatarUrl,
            phone_number: phoneNumber.replace('+91', ''),
            country_code: '+91',
            preferred_language: 'hi',
          });
        }

        router.replace('/(tabs)');
      }
    } catch (error: any) {
      Alert.alert('Verification Failed', error.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;

    setResendLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: phoneNumber,
      });

      if (error) throw error;

      setCountdown(60);
      Alert.alert('Success', 'OTP भेज दिया गया है\nOTP sent successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#FF4B6E', '#FF8A00', '#FFD700']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <ShieldCheck size={80} color="#fff" />
          <Text style={styles.title}>Verify OTP</Text>
          <Text style={styles.subtitle}>OTP सत्यापित करें</Text>
          <Text style={styles.phone}>+91 {phoneNumber}</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Enter 6-digit OTP</Text>
          <Text style={styles.labelHindi}>6 अंकों का OTP दर्ज करें</Text>

          <TextInput
            style={styles.otpInput}
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            maxLength={6}
            placeholder="000000"
            placeholderTextColor="#999"
          />

          <TouchableOpacity
            style={[styles.verifyButton, loading && styles.verifyButtonDisabled]}
            onPress={handleVerifyOTP}
            disabled={loading}
          >
            <Text style={styles.verifyButtonText}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </Text>
          </TouchableOpacity>

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>
              Didn&apos;t receive OTP?
            </Text>
            <TouchableOpacity
              onPress={handleResendOTP}
              disabled={countdown > 0 || resendLoading}
            >
              <Text style={[
                styles.resendButton,
                (countdown > 0 || resendLoading) && styles.resendButtonDisabled
              ]}>
                {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>← Back to Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 20,
    color: '#fff',
    opacity: 0.9,
    marginTop: 8,
  },
  phone: {
    fontSize: 18,
    color: '#fff',
    marginTop: 16,
    fontWeight: '600',
  },
  formContainer: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 24,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  labelHindi: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 20,
  },
  otpInput: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 10,
    color: '#333',
    borderWidth: 2,
    borderColor: '#FF4B6E',
    marginBottom: 24,
  },
  verifyButton: {
    backgroundColor: '#FF4B6E',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  verifyButtonDisabled: {
    opacity: 0.6,
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    gap: 8,
  },
  resendText: {
    color: '#666',
    fontSize: 14,
  },
  resendButton: {
    color: '#FF4B6E',
    fontSize: 14,
    fontWeight: 'bold',
  },
  resendButtonDisabled: {
    color: '#aaa',
  },
  backButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#666',
    fontSize: 16,
  },
});
