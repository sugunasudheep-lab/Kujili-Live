import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, MessageCircle, Share2, User as UserIcon, Play } from 'lucide-react-native';
import { supabase, Short } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const LANGUAGE_FLAGS: { [key: string]: string } = {
  hi: '🇮🇳 हिंदी',
  en: '🇬🇧 English',
  ta: '🇮🇳 தமிழ்',
  te: '🇮🇳 తెలుగు',
  kn: '🇮🇳 ಕನ್ನಡ',
  ml: '🇮🇳 മലയാളം',
  mr: '🇮🇳 मराठी',
  bn: '🇮🇳 বাংলা',
  gu: '🇮🇳 ગુજરાતી',
  pa: '🇮🇳 ਪੰਜਾਬੀ',
};

export default function ShortsScreen() {
  const { user } = useAuth();
  const [shorts, setShorts] = useState<Short[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  const fetchShorts = async () => {
    try {
      let query = supabase
        .from('shorts')
        .select(`
          *,
          profiles(*),
          shorts_likes!left(user_id)
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (selectedLanguage) {
        query = query.eq('language', selectedLanguage);
      }

      const { data, error } = await query;

      if (error) throw error;

      const shortsWithLikes = data?.map(short => ({
        ...short,
        is_liked: short.shorts_likes?.some((like: any) => like.user_id === user?.id) || false,
      })) || [];

      setShorts(shortsWithLikes);
    } catch (error) {
      console.error('Error fetching shorts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchShorts();
  }, [selectedLanguage]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchShorts();
  };

  const handleLike = async (shortId: string, isLiked: boolean) => {
    if (!user) return;

    try {
      if (isLiked) {
        await supabase
          .from('shorts_likes')
          .delete()
          .eq('short_id', shortId)
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('shorts_likes')
          .insert({ short_id: shortId, user_id: user.id });
      }

      setShorts(prev =>
        prev.map(s =>
          s.id === shortId
            ? {
                ...s,
                is_liked: !isLiked,
                like_count: isLiked ? s.like_count - 1 : s.like_count + 1,
              }
            : s
        )
      );
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const formatCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const renderShort = ({ item }: { item: Short }) => (
    <View style={styles.shortContainer}>
      <Image
        source={{ uri: item.thumbnail_url || 'https://via.placeholder.com/400x700/6B46FF/FFFFFF?text=Short+Video' }}
        style={styles.shortVideo}
      />

      <View style={styles.playIcon}>
        <Play size={60} color="#fff" fill="#fff" />
      </View>

      <View style={styles.languageBadge}>
        <Text style={styles.languageText}>
          {LANGUAGE_FLAGS[item.language] || '🌐 ' + item.language}
        </Text>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleLike(item.id, item.is_liked || false)}
        >
          <Heart
            size={32}
            color={item.is_liked ? '#FF4B6E' : '#fff'}
            fill={item.is_liked ? '#FF4B6E' : 'none'}
          />
          <Text style={styles.actionText}>{formatCount(item.like_count)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <MessageCircle size={32} color="#fff" />
          <Text style={styles.actionText}>{formatCount(item.comment_count)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Share2 size={32} color="#fff" />
          <Text style={styles.actionText}>{formatCount(item.share_count)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <View style={styles.creatorAvatar}>
            <Image
              source={{ uri: item.profiles?.avatar_url || 'https://ui-avatars.com/api/?name=User' }}
              style={styles.avatarImage}
            />
          </View>
        </TouchableOpacity>
      </View>

      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={styles.bottomInfo}
      >
        <View style={styles.creatorInfo}>
          <UserIcon size={16} color="#fff" />
          <Text style={styles.creatorName}>
            {item.profiles?.full_name || item.profiles?.username || 'Unknown'}
          </Text>
        </View>
        {item.title && (
          <Text style={styles.shortTitle} numberOfLines={2}>
            {item.title}
          </Text>
        )}
        {item.location_city && (
          <Text style={styles.location}>
            📍 {item.location_city}, {item.location_state || 'India'}
          </Text>
        )}
      </LinearGradient>
    </View>
  );

  if (loading) {
    return (
      <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.container}>
        <View style={styles.loadingContainer}>
          <Play size={48} color="#6B46FF" />
          <Text style={styles.loadingText}>Loading shorts...</Text>
          <Text style={styles.loadingTextHindi}>शॉर्ट्स लोड हो रहे हैं...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📱 Shorts</Text>
        <Text style={styles.headerSubtitle}>शॉर्ट वीडियो</Text>
      </View>

      {shorts.length === 0 ? (
        <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.emptyContainer}>
          <Play size={80} color="#6B46FF" />
          <Text style={styles.emptyTitle}>No Shorts Available</Text>
          <Text style={styles.emptySubtitle}>कोई शॉर्ट्स उपलब्ध नहीं</Text>
          <Text style={styles.emptyDescription}>
            Be the first to create a short video!
          </Text>
        </LinearGradient>
      ) : (
        <FlatList
          data={shorts}
          renderItem={renderShort}
          keyExtractor={(item) => item.id}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          snapToInterval={SCREEN_HEIGHT}
          decelerationRate="fast"
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6B46FF" />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#ddd',
    marginTop: 2,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
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
  shortContainer: {
    height: SCREEN_HEIGHT,
    width: '100%',
    backgroundColor: '#000',
  },
  shortVideo: {
    width: '100%',
    height: '100%',
  },
  playIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -30,
    marginTop: -30,
    opacity: 0.7,
  },
  languageBadge: {
    position: 'absolute',
    top: 100,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  languageText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  actionsContainer: {
    position: 'absolute',
    right: 16,
    bottom: 120,
    gap: 24,
  },
  actionButton: {
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  creatorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#6B46FF',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  bottomInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 80,
    padding: 16,
  },
  creatorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  creatorName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  shortTitle: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
  },
  location: {
    color: '#ddd',
    fontSize: 12,
  },
});
