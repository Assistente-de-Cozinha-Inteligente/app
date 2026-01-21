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
  exitDirection?: 'up' | 'right' | 'left';
};

export function Toast({
  message,
  type = 'success',
  visible,
  duration = 2000,
  onHide,
  exitDirection = 'up',
}: ToastProps) {
  const [show, setShow] = useState(false);
  const animValue = useRef(new Animated.Value(0)).current;
  const exitAnimValue = useRef(new Animated.Value(0)).current;
  const translateYValue = useRef(new Animated.Value(0)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);
  const hasEnteredRef = useRef(false);

  useEffect(() => {
    // Cancela qualquer animação em andamento
    if (animationRef.current) {
      animationRef.current.stop();
      animationRef.current = null;
    }

    if (visible) {
      // Garante que show está true
      setShow(true);
      hasEnteredRef.current = false;
      // Reseta todas as animações
      animValue.setValue(0);
      exitAnimValue.setValue(0);
      translateYValue.setValue(0);
      
      if (exitDirection === 'right' || exitDirection === 'left') {
        // Para saída à direita ou esquerda: anima translateY apenas na entrada
        const enterAnimation = Animated.parallel([
          Animated.spring(animValue, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
          Animated.spring(translateYValue, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
        ]);

        const exitAnimation = Animated.parallel([
          Animated.timing(animValue, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          // translateYValue permanece em 1 (posição 0) durante a saída
          Animated.timing(exitAnimValue, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]);

        const sequence = Animated.sequence([
          enterAnimation,
          Animated.delay(duration),
          exitAnimation,
        ]);

        // Marca que entrou quando a animação de entrada termina
        // Usa um listener para detectar quando animValue atinge 1
        const listenerId = animValue.addListener(({ value }) => {
          if (value >= 0.9) {
            hasEnteredRef.current = true;
            animValue.removeListener(listenerId);
          }
        });

        animationRef.current = sequence;
        sequence.start((finished) => {
          animValue.removeListener(listenerId);
          if (finished) {
            setShow(false);
            onHide?.();
            hasEnteredRef.current = false;
          }
          animationRef.current = null;
        });
      } else {
        // Comportamento padrão: anima entrada e saída vertical
        const sequence = Animated.sequence([
          Animated.spring(animValue, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
          Animated.delay(duration),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]);
        
        animationRef.current = sequence;
        sequence.start((finished) => {
          if (finished) {
            setShow(false);
            onHide?.();
          }
          animationRef.current = null;
        });
      }
    } else if (show) {
      // Anima saída imediatamente quando visible muda para false e show ainda é true
      if (exitDirection === 'right' || exitDirection === 'left') {
        // Se ainda não entrou completamente (ou se show é true mas hasEnteredRef é false),
        // força os valores para a posição final antes de animar a saída
        // Isso evita que o Toast "pule" durante a animação de saída
        if (!hasEnteredRef.current) {
          translateYValue.setValue(1);
          animValue.setValue(1);
          hasEnteredRef.current = true; // Marca como entrado para evitar problemas
        }
        
        // Garante que exitAnimValue começa do 0
        exitAnimValue.setValue(0);
        
        const parallel = Animated.parallel([
          Animated.timing(animValue, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(exitAnimValue, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]);
        
        animationRef.current = parallel;
        parallel.start((finished) => {
          if (finished) {
            setShow(false);
            onHide?.();
            hasEnteredRef.current = false;
          }
          animationRef.current = null;
        });
      } else {
        const timing = Animated.timing(animValue, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        });
        
        animationRef.current = timing;
        timing.start((finished) => {
          if (finished) {
            setShow(false);
            onHide?.();
          }
          animationRef.current = null;
        });
      }
    }

    // Cleanup: cancela animação quando o componente desmonta ou props mudam
    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
        animationRef.current = null;
      }
    };
  }, [visible, duration, onHide, exitDirection]);

  // Renderiza se visible for true OU se show for true (para garantir que apareça)
  if (!visible && !show) return null;

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

  // Calcula transformações baseado na direção de saída
  const getTransforms = () => {
    const transforms: any[] = [];

    if (exitDirection === 'right') {
      // Para saída à direita: translateY apenas na entrada (mantém em 0 durante saída)
      transforms.push({
        translateY: translateYValue.interpolate({
          inputRange: [0, 1],
          outputRange: [-100, 0],
        }),
      });
      // Movimento horizontal para a direita na saída
      transforms.push({
        translateX: exitAnimValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 400], // Move para a direita ao sair
        }),
      });
    } else if (exitDirection === 'left') {
      // Para saída à esquerda: translateY apenas na entrada (mantém em 0 durante saída)
      transforms.push({
        translateY: translateYValue.interpolate({
          inputRange: [0, 1],
          outputRange: [-100, 0],
        }),
      });
      // Movimento horizontal para a esquerda na saída
      transforms.push({
        translateX: exitAnimValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -400], // Move para a esquerda ao sair
        }),
      });
    } else {
      // Comportamento padrão: movimento vertical
      transforms.push({
        translateY: animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [-100, 0],
        }),
      });
    }

    // Scale sempre aplicado
    transforms.push({
      scale: animValue.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0.8, 1.05, 1],
      }),
    });

    return transforms;
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: animValue,
          transform: getTransforms(),
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
    top: 150,
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


