import { TextUI } from '@/components/ui/text';
import { ViewContainerUI } from '@/components/ui/view-container';
import { Colors } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

type ProfileCardProps = {
  isLoggedIn: boolean;
};

export function ProfileCard({ isLoggedIn }: ProfileCardProps) {
  if (isLoggedIn) {
    return (
      <Pressable
        style={styles.profileCard}
        onPress={() => router.push('/editar-perfil')}
      >
        <View style={styles.profileLeft}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
              style={styles.avatar}
            />
          </View>
          <View style={styles.profileInfo}>
            <TextUI variant="semibold" style={styles.profileName}>
              Guilherme
            </TextUI>
            <View style={styles.badgeContainer}>
              <TextUI variant="regular" style={styles.badgeText}>
                Plano Gratuito
              </TextUI>
            </View>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color={Colors.light.bodyText} />
      </Pressable>
    );
  }

  return (
    <Pressable
      style={styles.profileCard}
      onPress={() => router.push('/login')}
    >
      <View style={styles.profileLeft}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-outline" size={32} color={Colors.light.bodyText} />
        </View>
        <View style={styles.profileInfo}>
          <TextUI variant="semibold" style={styles.profileName}>
            Faça login
          </TextUI>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.light.bodyText} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  profileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.light.input,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  profileInfo: {
    flex: 1,
    gap: 8,
  },
  profileName: {
    fontSize: 16,
    color: Colors.light.mainText,
  },
  badgeContainer: {
    backgroundColor: '#010F07',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 12,
    color: Colors.light.white,
  },
});

