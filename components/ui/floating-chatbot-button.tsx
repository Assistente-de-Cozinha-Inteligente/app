import { Colors } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type FloatingChatbotButtonProps = {
  onPress?: () => void;
};

export function FloatingChatbotButton({ onPress }: FloatingChatbotButtonProps) {
  const insets = useSafeAreaInsets();
  // Altura aproximada da tab bar (80px) + altura do botão de adicionar (56px) + gap (16px) + padding bottom safe area
  const bottomOffset = insets.bottom;

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push('/chat');
    }
  };

  return (
    <View style={[styles.container, { bottom: bottomOffset }]}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.8}
        style={styles.button}
      >
        <Ionicons name="chatbubble" size={24} color={Colors.light.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 20,
    zIndex: 100, // Menor que os bottom sheets (que usam z-index muito alto)
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 1, // Menor elevation no Android para ficar abaixo dos bottom sheets
  },
});

