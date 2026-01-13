import { Colors } from '@/constants/theme';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, TouchableOpacity } from 'react-native';

type ToggleProps = {
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  disabled?: boolean;
};

export function Toggle({ value = false, onValueChange, disabled = false }: ToggleProps) {
  // Distância que o thumb percorre (53px width - 27px thumb - 4px padding = 22px)
  const THUMB_DISTANCE = 22;
  
  const translateX = useRef(new Animated.Value(value ? THUMB_DISTANCE : 0)).current;
  const backgroundColor = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    // Anima o movimento do thumb
    Animated.spring(translateX, {
      toValue: value ? THUMB_DISTANCE : 0,
      useNativeDriver: true,
      tension: 150,
      friction: 15,
    }).start();

    // Anima a cor de fundo
    Animated.timing(backgroundColor, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value, translateX, backgroundColor]);

  const handlePress = () => {
    if (!disabled && onValueChange) {
      onValueChange(!value);
    }
  };

  const trackColor = backgroundColor.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E7E7E7', Colors.light.primary],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      disabled={disabled}
      style={styles.container}
    >
      <Animated.View style={[styles.track, { backgroundColor: trackColor }]}>
        <Animated.View
          style={[
            styles.thumb,
            {
              transform: [{ translateX }],
            },
          ]}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  track: {
    width: 53,
    height: 31,
    borderRadius: 15.5,
    justifyContent: 'center',
    padding: 2,
  },
  thumb: {
    width: 27,
    height: 27,
    borderRadius: 13.5,
    backgroundColor: Colors.light.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
});
