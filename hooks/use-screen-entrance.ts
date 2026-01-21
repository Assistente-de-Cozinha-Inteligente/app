import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

type UseScreenEntranceOptions = {
  duration?: number;
  delay?: number;
};

/**
 * Hook para animação suave de entrada de tela
 */
export function useScreenEntrance(options: UseScreenEntranceOptions = {}) {
  const { duration = 400, delay = 0 } = options;
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration,
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);

    return () => clearTimeout(timer);
  }, []);

  return {
    fadeAnim,
    slideAnim,
    animatedStyle: {
      opacity: fadeAnim,
      transform: [{ translateY: slideAnim }],
    },
  };
}

