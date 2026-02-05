import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Radio, Video } from 'lucide-react-native';
import { supabase, Category } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export default function GoLiveScreen() {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('hi');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const LANGUAGES = [
    { code: 'hi', name: 'Hindi', native: 'हिंदी', flag: '🇮🇳' },
    { code: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'ml', name: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳' },
    { code: 'mr', name: 'Marathi', native: 'मराठी', flag: '🇮🇳' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা', flag: '🇮🇳' },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', flag: '🇮🇳' },
    { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleGoLive = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'कृपया शीर्षक दर्ज करें\nPlease enter a title');
      return;
    }

    if (!selectedCategory) {
      Alert.alert('Error', 'कृपया श्रेणी चुनें\nPlease select a category');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('streams')
        .insert({
          user_id: user?.id,
          category_id: selectedCategory,
          title: title.trim(),
          description: description.trim(),
          language: selectedLanguage,
          is_live: true,
          thumbnail_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(title)}&background=FF4B6E&color=fff&size=400`,
        })
        .select()
        .single();

      if (error) throw error;

      Alert.alert(
        'Success! सफलता!',
        'You are now live!\nआप अब लाइव हैं!',
        [
          {
            text: 'OK',
            onPress: () => {
              setTitle('');
              setDescription('');
              setSelectedCategory(null);
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to start stream');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>📡 Go Live</Text>
          <Text style={styles.headerSubtitle}>लाइव जाएं</Text>
        </View>

        <LinearGradient
          colors={['#FF4B6E', '#FF8A00']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.previewCard}
        >
          <Radio size={60} color="#fff" />
          <Text style={styles.previewTitle}>Start Broadcasting</Text>
          <Text style={styles.previewSubtitle}>प्रसारण शुरू करें</Text>
        </LinearGradient>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Stream Details</Text>
          <Text style={styles.sectionSubtitle}>स्ट्रीम विवरण</Text>

          <View style={styles.inputContainer}>
            <Video size={20} color="#aaa" />
            <TextInput
              style={styles.input}
              placeholder="Stream Title (स्ट्रीम शीर्षक)"
              placeholderTextColor="#888"
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.textareaIcon}>📝</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="Description (optional)"
              placeholderTextColor="#888"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              maxLength={500}
            />
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Select Language</Text>
          <Text style={styles.sectionSubtitle}>भाषा चुनें</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.languageScroll}>
            {LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageChip,
                  selectedLanguage === lang.code && styles.languageChipActive,
                ]}
                onPress={() => setSelectedLanguage(lang.code)}
              >
                <Text style={styles.languageFlag}>{lang.flag}</Text>
                <Text
                  style={[
                    styles.languageText,
                    selectedLanguage === lang.code && styles.languageTextActive,
                  ]}
                >
                  {lang.native}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Select Category</Text>
          <Text style={styles.sectionSubtitle}>श्रेणी चुनें</Text>

          <View style={styles.categoryGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryChip,
                  selectedCategory === category.id && styles.categoryChipActive,
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text style={styles.categoryIcon}>{category.icon || '🎬'}</Text>
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category.id && styles.categoryTextActive,
                  ]}
                >
                  {category.name}
                </Text>
                {category.name_hi && (
                  <Text style={styles.categoryTextSmall}>{category.name_hi}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.goLiveButton, loading && styles.goLiveButtonDisabled]}
          onPress={handleGoLive}
          disabled={loading}
        >
          <LinearGradient
            colors={['#FF4B6E', '#FF8A00', '#FFD700']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.goLiveGradient}
          >
            <Radio size={24} color="#fff" />
            <Text style={styles.goLiveText}>
              {loading ? 'Starting...' : 'GO LIVE NOW'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            📌 Your stream will be visible to everyone
          </Text>
          <Text style={styles.infoTextHindi}>
            आपकी स्ट्रीम सभी को दिखाई देगी
          </Text>
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
  previewCard: {
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  previewTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
  },
  previewSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
  },
  formSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    marginLeft: 12,
  },
  textarea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  textareaIcon: {
    fontSize: 20,
  },
  languageScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  languageChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
    gap: 8,
  },
  languageChipActive: {
    backgroundColor: '#FF4B6E',
  },
  languageFlag: {
    fontSize: 18,
  },
  languageText: {
    color: '#aaa',
    fontSize: 14,
    fontWeight: '600',
  },
  languageTextActive: {
    color: '#fff',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 100,
  },
  categoryChipActive: {
    backgroundColor: '#FF4B6E',
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  categoryText: {
    color: '#aaa',
    fontSize: 13,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#fff',
  },
  categoryTextSmall: {
    color: '#888',
    fontSize: 10,
    marginTop: 2,
  },
  goLiveButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  goLiveButtonDisabled: {
    opacity: 0.6,
  },
  goLiveGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 12,
  },
  goLiveText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: 'rgba(107,70,255,0.2)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  infoText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  infoTextHindi: {
    color: '#aaa',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
});
