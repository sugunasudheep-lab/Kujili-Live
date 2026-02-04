import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles } from 'lucide-react-native';
import { supabase, Category } from '../../lib/supabase';

export default function ExploreScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'all' | 'indian'>('all');

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories =
    selectedTab === 'indian'
      ? categories.filter(c => c.is_indian_regional)
      : categories;

  const renderCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity activeOpacity={0.8}>
      <LinearGradient
        colors={item.is_indian_regional ? ['#FF4B6E', '#FF8A00'] : ['#6B46FF', '#00D9FF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.categoryCard}
      >
        <Text style={styles.categoryIcon}>{item.icon || '🎬'}</Text>
        <Text style={styles.categoryName}>{item.name}</Text>
        {item.name_hi && (
          <Text style={styles.categoryNameHindi}>{item.name_hi}</Text>
        )}
        {item.is_indian_regional && (
          <View style={styles.indianBadge}>
            <Text style={styles.indianBadgeText}>🇮🇳 India</Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.container}>
        <View style={styles.loadingContainer}>
          <Sparkles size={48} color="#FF8A00" />
          <Text style={styles.loadingText}>Discovering categories...</Text>
          <Text style={styles.loadingTextHindi}>श्रेणियाँ खोज रहे हैं...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>🧭 Explore</Text>
          <Text style={styles.headerSubtitle}>एक्सप्लोर करें</Text>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'all' && styles.tabActive]}
          onPress={() => setSelectedTab('all')}
        >
          <Text style={[styles.tabText, selectedTab === 'all' && styles.tabTextActive]}>
            All Categories
          </Text>
          <Text style={[styles.tabTextSmall, selectedTab === 'all' && styles.tabTextActive]}>
            सभी श्रेणियाँ
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === 'indian' && styles.tabActive]}
          onPress={() => setSelectedTab('indian')}
        >
          <Text style={[styles.tabText, selectedTab === 'indian' && styles.tabTextActive]}>
            🇮🇳 Indian Content
          </Text>
          <Text style={[styles.tabTextSmall, selectedTab === 'indian' && styles.tabTextActive]}>
            भारतीय सामग्री
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.featuredSection}>
        <LinearGradient
          colors={['#FF4B6E', '#FF8A00', '#FFD700']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.featuredCard}
        >
          <Text style={styles.featuredIcon}>🎉</Text>
          <View style={styles.featuredContent}>
            <Text style={styles.featuredTitle}>Indian Festival Season!</Text>
            <Text style={styles.featuredTitleHindi}>त्योहार का मौसम!</Text>
            <Text style={styles.featuredDescription}>
              Celebrate with live streams and shorts
            </Text>
          </View>
        </LinearGradient>
      </View>

      <FlatList
        data={filteredCategories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        numColumns={2}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#aaa',
    marginTop: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#fff',
    marginTop: 16,
  },
  loadingTextHindi: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  tab: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#FF4B6E',
  },
  tabText: {
    color: '#aaa',
    fontSize: 16,
    fontWeight: '600',
  },
  tabTextSmall: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
  tabTextActive: {
    color: '#fff',
  },
  featuredSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  featuredCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    gap: 16,
  },
  featuredIcon: {
    fontSize: 48,
  },
  featuredContent: {
    flex: 1,
  },
  featuredTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  featuredTitleHindi: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginTop: 2,
  },
  featuredDescription: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    marginTop: 4,
  },
  listContent: {
    padding: 8,
  },
  row: {
    justifyContent: 'space-between',
  },
  categoryCard: {
    flex: 1,
    margin: 8,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    minHeight: 140,
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  categoryIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  categoryNameHindi: {
    fontSize: 13,
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
    textAlign: 'center',
  },
  indianBadge: {
    marginTop: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  indianBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
});
