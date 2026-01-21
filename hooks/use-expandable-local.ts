import { useCallback, useEffect, useState } from 'react';
import { Animated } from 'react-native';

/**
 * Hook para gerenciar estados expandidos e animações de grupos por local
 */
export function useExpandableLocal(locals: string[]) {
  const [expandedLocals, setExpandedLocals] = useState<Record<string, boolean>>({});
  const [animations, setAnimations] = useState<Record<string, Animated.Value>>({});

  // Inicializa animações e estados expandidos para novos locais
  useEffect(() => {
    locals.forEach((local) => {
      if (!animations[local]) {
        const animValue = new Animated.Value(1); // Começa expandido
        setAnimations(prev => ({ ...prev, [local]: animValue }));
        setExpandedLocals(prev => ({ ...prev, [local]: true }));
      }
    });
  }, [locals]);

  const toggleLocal = useCallback((local: string) => {
    const isExpanded = expandedLocals[local] ?? true;
    const newExpanded = !isExpanded;

    setExpandedLocals(prev => ({ ...prev, [local]: newExpanded }));

    const animValue = animations[local] || new Animated.Value(1);
    if (!animations[local]) {
      setAnimations(prev => ({ ...prev, [local]: animValue }));
    }

    Animated.timing(animValue, {
      toValue: newExpanded ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [expandedLocals, animations]);

  return {
    expandedLocals,
    animations,
    toggleLocal,
  };
}

