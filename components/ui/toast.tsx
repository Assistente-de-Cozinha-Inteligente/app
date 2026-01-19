import { Colors } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { TextUI } from './text';

type ToastProps = {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  visible: boolean;
  onHide?: () => void;
};

export function Toast({
  message,
  type = 'success',
  visible,
  duration = 2000,
  onHide,
}: ToastProps) {
  const [show, setShow] = useState(visible);
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setShow(true);
      // Anima entrada
      Animated.sequence([
        Animated.spring(animValue, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.delay(duration),
        Animated.timing(animValue, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShow(false);
        onHide?.();
      });
    } else {
      // Anima saída imediatamente
      Animated.timing(animValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShow(false);
      });
    }
  }, [visible, duration, onHide]);

  if (!show) return null;

  const getIconName = () => {
    switch (type) {
      case 'success':
        return 'checkmark-circle';
      case 'error':
        return 'close-circle';
      case 'info':
        return 'information-circle';
      default:
        return 'checkmark-circle';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'success':
        return Colors.light.primary;
      case 'error':
        return Colors.light.danger;
      case 'info':
        return Colors.light.bodyText;
      default:
        return Colors.light.primary;
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: animValue,
          transform: [
            {
              translateY: animValue.interpolate({
                inputRange: [0, 1],
                outputRange: [-100, 0],
              }),
            },
            {
              scale: animValue.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0.8, 1.05, 1],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name={getIconName()} size={24} color={getIconColor()} />
        </View>
        <TextUI variant="semibold" style={styles.text}>
          {message}
        </TextUI>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    zIndex: 2000,
  },
  content: {
    backgroundColor: Colors.light.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    borderWidth: 1,
    borderColor: Colors.light.primary,
  },
  iconContainer: {
    marginRight: 12,
  },
  text: {
    fontSize: 14,
    color: Colors.light.mainText,
    flex: 1,
  },
});


