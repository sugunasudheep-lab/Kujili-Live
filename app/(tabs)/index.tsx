import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, RefreshControl, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Users, Eye, MapPin, Radio } from 'lucide-react-native';
import { supabase, Stream } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

const LANGUAGE_FLAGS: { [key: string]: string } = {
  hi: '🇮🇳',
  en: '🇬🇧',
  ta: '🇮🇳',
  te: '🇮🇳',
  kn: '🇮🇳',
  ml: '🇮🇳',
  mr: '🇮🇳',
  bn: '🇮🇳',
  gu: '🇮🇳',
  pa: '🇮🇳',
};

const LANGUAGE_NAMES: { [key: string]: string } = {
  hi: 'Hindi',
  en: 'English',
  ta: 'Tamil',
  te: 'Telugu',
  kn: 'Kannada',
  ml: 'Malayalam',
  mr: 'Marathi',
  bn: 'Bengali',
  gu: 'Gujarati',
  pa: 'Punjabi',
};

export default function HomeScreen() {
  const { profile } = useAuth();
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStreams = async () => {
    try {
      const { data, error } = await supabase
        .from('streams')
        .select(`
          *,
          profiles(*)
        `)
        .eq('is_live', true)
        .order('viewer_count', { ascending: false })
        .limit(20);

      if (error) throw error;
      setStreams(data || []);
    } catch (error) {
      console.error('Error fetching streams:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStreams();

    const subscription = supabase
      .channel('streams_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'streams' }, () => {
        fetchStreams();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStreams();
  };

  const renderStream = ({ item }: { item: Stream }) => (
    <TouchableOpacity style={styles.streamCard} activeOpacity={0.8}>
      <Image
        source={{ uri: item.thumbnail_url || 'https://via.placeholder.com/400x225/FF4B6E/FFFFFF?text=LIVE' }}
        style={styles.thumbnail}
      />

      <View style={styles.liveBadge}>
        <Radio size={12} color="#fff" />
        <Text style={styles.liveText}>LIVE</Text>
      </View>

      <View style={styles.viewerBadge}>
        <Eye size={14} color="#fff" />
        <Text style={styles.viewerText}>{item.viewer_count || 0}</Text>
      </View>

      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.streamInfo}
      >
        <View style={styles.streamerInfo}>
          <Image
            source={{ uri: item.profiles?.avatar_url || 'https://ui-avatars.com/api/?name=User' }}
            style={styles.avatar}
          />
          <View style={styles.streamerDetails}>
            <Text style={styles.streamerName} numberOfLines={1}>
              {item.profiles?.full_name || item.profiles?.username || 'Unknown'}
            </Text>
            <Text style={styles.streamTitle} numberOfLines={2}>
              {item.title}
            </Text>
          </View>
        </View>

        <View style={styles.streamMeta}>
          {item.location_city && (
            <View style={styles.locationBadge}>
              <MapPin size={12} color="#fff" />
              <Text style={styles.locationText}>{item.location_city}</Text>
            </View>
          )}
          <View style={styles.languageBadge}>
            <Text style={styles.languageFlag}>
              {LANGUAGE_FLAGS[item.language] || '🌐'}
            </Text>
            <Text style={styles.languageText}>
              {LANGUAGE_NAMES[item.language] || item.language}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.container}>
        <View style={styles.loadingContainer}>
          <Radio size={48} color="#FF4B6E" />
          <Text style={styles.loadingText}>Loading live streams...</Text>
          <Text style={styles.loadingTextHindi}>लाइव स्ट्रीम लोड हो रहे हैं...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>🎥 Live Streams</Text>
          <Text style={styles.headerSubtitle}>लाइव स्ट्रीम</Text>
        </View>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>नमस्ते</Text>
          <Text style={styles.userName}>{profile?.full_name?.split(' ')[0] || 'User'}</Text>
        </View>
      </View>

      {streams.length === 0 ? (
        <ScrollView
          contentContainerStyle={styles.emptyContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF4B6E" />}
        >
          <Radio size={80} color="#FF4B6E" />
          <Text style={styles.emptyTitle}>No Live Streams</Text>
          <Text style={styles.emptySubtitle}>कोई लाइव स्ट्रीम नहीं</Text>
          <Text style={styles.emptyDescription}>
            Be the first to go live!
          </Text>
        </ScrollView>
      ) : (
        <FlatList
          data={streams}
          renderItem={renderStream}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          numColumns={2}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF4B6E" />}
        />
      )}
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
  welcomeContainer: {
    alignItems: 'flex-end',
  },
  welcomeText: {
    fontSize: 14,
    color: '#aaa',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF4B6E',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 24,
  },
  emptySubtitle: {
    fontSize: 18,
    color: '#aaa',
    marginTop: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 16,
  },
  listContent: {
    padding: 8,
  },
  row: {
    justifyContent: 'space-between',
  },
  streamCard: {
    flex: 1,
    margin: 8,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#2a2a3e',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  thumbnail: {
    width: '100%',
    height: 180,
    backgroundColor: '#1a1a2e',
  },
  liveBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF4B6E',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  liveText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  viewerBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  viewerText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  streamInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  streamerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
    borderWidth: 2,
    borderColor: '#FF4B6E',
  },
  streamerDetails: {
    flex: 1,
  },
  streamerName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  streamTitle: {
    fontSize: 12,
    color: '#ddd',
    marginTop: 2,
  },
  streamMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    gap: 4,
  },
  locationText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  languageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    gap: 4,
  },
  languageFlag: {
    fontSize: 12,
  },
  languageText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
});
