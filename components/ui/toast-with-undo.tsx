import { Colors } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';
import { TextUI } from './text';

type ToastWithUndoProps = {
  message: string;
  visible: boolean;
  onUndo: () => void;
  onConfirm?: () => void; // Chamado quando o tempo acaba
  onHide?: () => void;
  duration?: number; // Duração em segundos antes de confirmar a ação
};

export function ToastWithUndo({
  message,
  visible,
  onUndo,
  onConfirm,
  onHide,
  duration = 5,
}: ToastWithUndoProps) {
  const [show, setShow] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const animValue = useRef(new Animated.Value(0)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Cancela qualquer animação em andamento
    if (animationRef.current) {
      animationRef.current.stop();
      animationRef.current = null;
    }

    // Limpa timers anteriores
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }

    if (visible) {
      // Garante que show está true
      setShow(true);
      setTimeRemaining(duration);
      
      // Reseta animação
      animValue.setValue(0);

      // Anima entrada
      const enterAnimation = Animated.spring(animValue, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      });

      animationRef.current = enterAnimation;
      enterAnimation.start(() => {
        animationRef.current = null;
      });

      // Inicia countdown
      countdownRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            if (countdownRef.current) {
              clearInterval(countdownRef.current);
              countdownRef.current = null;
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Timer para confirmar a ação após duration segundos
      timerRef.current = setTimeout(() => {
        handleConfirm();
      }, duration * 1000);
    } else if (show) {
      // Anima saída
      const exitAnimation = Animated.timing(animValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      });

      animationRef.current = exitAnimation;
      exitAnimation.start((finished) => {
        if (finished) {
          setShow(false);
          onHide?.();
        }
        animationRef.current = null;
      });
    }

    // Cleanup
    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
        animationRef.current = null;
      }
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
    };
  }, [visible, duration, onHide, onConfirm]);

  const handleUndo = () => {
    // Limpa timers
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }

    // Chama callback de desfazer
    onUndo();

    // Anima saída
    const exitAnimation = Animated.timing(animValue, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    });

    animationRef.current = exitAnimation;
    exitAnimation.start((finished) => {
      if (finished) {
        setShow(false);
        onHide?.();
      }
      animationRef.current = null;
    });
  };

  const handleConfirm = () => {
    // Limpa countdown
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }

    // Chama callback de confirmação se fornecido
    if (onConfirm) {
      onConfirm();
    }

    // Anima saída
    const exitAnimation = Animated.timing(animValue, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    });

    animationRef.current = exitAnimation;
    exitAnimation.start((finished) => {
      if (finished) {
        setShow(false);
        onHide?.();
      }
      animationRef.current = null;
    });
  };

  // Renderiza se visible for true OU se show for true
  if (!visible && !show) return null;

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
          <Ionicons name="trash-outline" size={24} color={Colors.light.danger} />
        </View>
        <View style={styles.textContainer}>
          <TextUI variant="semibold" style={styles.text}>
            {message}
          </TextUI>
          {timeRemaining > 0 && (
            <TextUI variant="regular" style={styles.countdown}>
              Desfazer em {timeRemaining}s
            </TextUI>
          )}
        </View>
        <TouchableOpacity
          onPress={handleUndo}
          style={styles.undoButton}
          activeOpacity={0.7}
        >
          <TextUI variant="semibold" style={styles.undoText}>
            DESFAZER
          </TextUI>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 140,
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
    borderColor: Colors.light.danger + '40',
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  text: {
    fontSize: 14,
    color: Colors.light.mainText,
    marginBottom: 2,
  },
  countdown: {
    fontSize: 12,
    color: Colors.light.bodyText,
  },
  undoButton: {
    marginLeft: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: Colors.light.primary,
  },
  undoText: {
    fontSize: 12,
    color: Colors.light.white,
  },
});

