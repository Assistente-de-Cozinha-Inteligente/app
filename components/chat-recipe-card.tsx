import { Colors } from '@/constants/theme';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';
import { TextUI } from './ui/text';

type ChatRecipeCardProps = {
  imageUri: string;
  title: string;
  onPress?: () => void;
};

export function ChatRecipeCard({ imageUri, title, onPress }: ChatRecipeCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.container} activeOpacity={0.8}>
      <Image
        source={{ uri: imageUri }}
        style={styles.image}
        contentFit="cover"
      />
      <View style={styles.overlay} />
      <TextUI variant="regular" style={styles.title} numberOfLines={2}>
        {title}
      </TextUI>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 120,
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.light.input,
    marginRight: 12,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  title: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    fontSize: 12,
    color: Colors.light.white,
  },
});

