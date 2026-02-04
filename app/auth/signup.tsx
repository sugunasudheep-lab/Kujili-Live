import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../../lib/supabase';
import { UserPlus, Mail, Lock, User, Phone, MessageSquare } from 'lucide-react-native';

export default function Signup() {
  const router = useRouter();
  const [signupMethod, setSignupMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  const generateAvatarUrl = (name: string) => {
    const initials = name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=FF4B6E&color=fff&size=200`;
  };

  const handleEmailSignup = async () => {
    if (loading) return;

    if (!username || !password || !fullName || !email) {
      Alert.alert('Error', 'कृपया सभी फ़ील्ड भरें\nPlease fill all fields');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const authResult = await supabase.auth.signUp({
        email,
        password,
      });

      if (authResult.error) throw authResult.error;

      if (authResult.data.user) {
        const avatarUrl = generateAvatarUrl(fullName);

        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authResult.data.user.id,
            username: username.toLowerCase().replace(/\s+/g, ''),
            full_name: fullName,
            avatar_url: avatarUrl,
            preferred_language: 'hi',
          });

        if (profileError) throw profileError;

        Alert.alert(
          'Success! सफलता!',
          'Account created successfully\nखाता सफलतापूर्वक बनाया गया',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/(tabs)'),
            },
          ]
        );
      }
    } catch (error: any) {
      let errorMessage = error.message || 'Signup failed';

      if (error.message?.includes('duplicate')) {
        errorMessage = 'Username or email already exists\nउपयोगकर्ता नाम या ईमेल पहले से मौजूद है';
      }

      Alert.alert('Signup Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSignup = async () => {
    if (loading) return;

    if (!phoneNumber) {
      Alert.alert('Error', 'कृपया फोन नंबर दर्ज करें\nPlease enter phone number');
      return;
    }

    if (phoneNumber.length !== 10) {
      Alert.alert('Error', 'Phone number must be 10 digits');
      return;
    }

    setLoading(true);
    try {
      const formattedPhone = `+91${phoneNumber}`;

      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });

      if (error) throw error;

      Alert.alert(
        'OTP Sent! OTP भेजा गया!',
        'Please check your SMS for the verification code\nकृपया सत्यापन कोड के लिए अपना SMS जांचें',
        [
          {
            text: 'OK',
            onPress: () => router.push({
              pathname: '/auth/verify-otp',
              params: { phone: formattedPhone },
            }),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'facebook' | 'twitter') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: 'kujili://auth/callback',
        },
      });

      if (error) throw error;
    } catch (error: any) {
      Alert.alert('Error', error.message || `Failed to signup with ${provider}`);
    }
  };

  const handleSignup = () => {
    if (signupMethod === 'email') {
      handleEmailSignup();
    } else {
      handlePhoneSignup();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <LinearGradient
        colors={['#6B46FF', '#00D9FF', '#00E5A0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.logo}>🎥 Kujili</Text>
            <Text style={styles.subtitle}>अपना खाता बनाएं</Text>
            <Text style={styles.tagline}>Create Your Account</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.methodSelector}>
              <TouchableOpacity
                style={[styles.methodButton, signupMethod === 'email' && styles.methodButtonActive]}
                onPress={() => setSignupMethod('email')}
              >
                <Mail size={20} color={signupMethod === 'email' ? '#6B46FF' : '#666'} />
                <Text style={[styles.methodText, signupMethod === 'email' && styles.methodTextActive]}>
                  Email
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.methodButton, signupMethod === 'phone' && styles.methodButtonActive]}
                onPress={() => setSignupMethod('phone')}
              >
                <Phone size={20} color={signupMethod === 'phone' ? '#6B46FF' : '#666'} />
                <Text style={[styles.methodText, signupMethod === 'phone' && styles.methodTextActive]}>
                  Phone OTP
                </Text>
              </TouchableOpacity>
            </View>

            {signupMethod === 'email' ? (
              <>
                <View style={styles.inputContainer}>
                  <User size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="पूरा नाम / Full Name"
                    placeholderTextColor="#999"
                    value={fullName}
                    onChangeText={setFullName}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <User size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="यूज़रनेम / Username"
                    placeholderTextColor="#999"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Mail size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="ईमेल / Email Address"
                    placeholderTextColor="#999"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Lock size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="पासवर्ड / Password (min 6 chars)"
                    placeholderTextColor="#999"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                </View>
              </>
            ) : (
              <View style={styles.inputContainer}>
                <Phone size={20} color="#666" style={styles.inputIcon} />
                <Text style={styles.countryCode}>+91</Text>
                <TextInput
                  style={styles.input}
                  placeholder="फोन नंबर / Phone Number"
                  placeholderTextColor="#999"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </View>
            )}

            <TouchableOpacity
              style={[styles.signupButton, loading && styles.signupButtonDisabled]}
              onPress={handleSignup}
              disabled={loading}
            >
              {signupMethod === 'email' ? (
                <>
                  <UserPlus size={20} color="#fff" />
                  <Text style={styles.signupButtonText}>
                    {loading ? 'Creating Account...' : 'Sign Up'}
                  </Text>
                </>
              ) : (
                <>
                  <MessageSquare size={20} color="#fff" />
                  <Text style={styles.signupButtonText}>
                    {loading ? 'Sending OTP...' : 'Send OTP'}
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>या / OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialButtons}>
              <TouchableOpacity
                style={[styles.socialButton, styles.facebookButton]}
                onPress={() => handleSocialLogin('facebook')}
              >
                <Text style={styles.socialIcon}>f</Text>
                <Text style={styles.socialButtonText}>Continue with Facebook</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.socialButton, styles.twitterButton]}
                onPress={() => handleSocialLogin('twitter')}
              >
                <Text style={styles.socialIcon}>𝕏</Text>
                <Text style={styles.socialButtonText}>Continue with X</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => router.back()}
            >
              <Text style={styles.loginText}>
                Already have an account? <Text style={styles.loginTextBold}>Login</Text>
              </Text>
              <Text style={styles.loginTextHindi}>
                पहले से खाता है? लॉगिन करें
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    marginTop: 8,
    fontWeight: '600',
  },
  tagline: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
  },
  formContainer: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  methodSelector: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  methodButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  methodButtonActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  methodText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  methodTextActive: {
    color: '#6B46FF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  inputIcon: {
    marginRight: 12,
  },
  countryCode: {
    fontSize: 16,
    color: '#333',
    marginRight: 8,
    fontWeight: '600',
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
  },
  signupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6B46FF',
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 8,
    gap: 8,
    shadowColor: '#6B46FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  signupButtonDisabled: {
    opacity: 0.6,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#666',
    fontSize: 14,
  },
  socialButtons: {
    gap: 12,
    marginBottom: 24,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  facebookButton: {
    backgroundColor: '#1877F2',
  },
  twitterButton: {
    backgroundColor: '#000',
  },
  socialIcon: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  socialButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginLink: {
    alignItems: 'center',
  },
  loginText: {
    fontSize: 16,
    color: '#333',
  },
  loginTextBold: {
    fontWeight: 'bold',
    color: '#6B46FF',
  },
  loginTextHindi: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});
