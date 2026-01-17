import { Colors } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { TextUI } from './ui/text';

type Ingrediente = {
  id: string;
  name: string;
  quantity: string;
  available: boolean; // true = checkmark verde, false = X vermelho
  canSubstitute?: boolean; // true = tem opção de substituição, false/undefined = não tem
};

type CardIngredienteReceitaProps = {
  ingredientes: Ingrediente[];
  maxVisible?: number; // Número máximo de ingredientes visíveis antes de mostrar "Ver mais"
  onSubstituirIngrediente?: (ingredienteId: string) => void;
  userLoggedIn?: number; // 1 = logado/premium, 0 = não logado/gratuito
};

export function CardIngredienteReceita({
  ingredientes,
  maxVisible = 5,
  onSubstituirIngrediente,
  userLoggedIn = 0,
}: CardIngredienteReceitaProps) {
  const [showAll, setShowAll] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const hasMore = ingredientes.length > maxVisible;
  const visibleIngredientes = showAll ? ingredientes : ingredientes.slice(0, maxVisible);

  useEffect(() => {
    if (showAll) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [showAll, fadeAnim]);

  return (
    <View style={styles.container}>
      {visibleIngredientes.map((ingrediente, index) => {
        const isLastVisible = index === visibleIngredientes.length - 1;
        const shouldShowOverlay = hasMore && !showAll && isLastVisible;
        const isNewItem = showAll && index >= maxVisible;
        const opacity = isNewItem ? fadeAnim : 1;

        return (
          <Animated.View
            key={ingrediente.id}
            style={[styles.ingredientWrapper, { opacity }]}
          >
            <View style={styles.ingredientRow}>
              {/* Indicador de status */}
              <View style={styles.statusContainer}>
                {ingrediente.available ? (
                  <Ionicons name="checkmark-circle" size={20} color={Colors.light.primary} />
                ) : (
                  <Ionicons name="close-circle" size={20} color={Colors.light.danger} />
                )}
              </View>

              {/* Nome e quantidade do ingrediente */}
              <View style={styles.ingredientInfo}>
                <TextUI
                  variant="regular"
                  style={[
                    styles.ingredientName,
                    !ingrediente.available && styles.ingredientNameUnavailable,
                    shouldShowOverlay && styles.ingredientTextOverlay,
                  ]}
                >
                  {ingrediente.name}
                </TextUI>
                <TextUI
                  variant="regular"
                  style={[
                    styles.ingredientQuantity,
                    !ingrediente.available && styles.ingredientQuantityUnavailable,
                    shouldShowOverlay && styles.ingredientTextOverlay,
                  ]}
                >
                  {ingrediente.quantity}
                </TextUI>
              </View>
            </View>


            {/* Linha separadora (exceto no último item) */}
            {index < visibleIngredientes.length - 1 && (
              <View style={styles.separator} />
            )}

            {/* Botão "Ver mais" sobreposto */}
            {shouldShowOverlay && (
              <Pressable
                onPress={() => setShowAll(true)}
                style={styles.seeMoreOverlay}
              >
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.7)', 'rgba(255, 255, 255, 0.95)']}
                  locations={[0, 0.5, 1]}
                  style={styles.overlayGradient}
                >
                  <View style={styles.seeMoreButton}>
                    <TextUI variant="regular" style={styles.seeMoreText}>
                      Ver mais
                    </TextUI>
                    <Ionicons name="chevron-down" size={16} color={Colors.light.primary} />
                  </View>
                </LinearGradient>
              </Pressable>
            )}
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.white,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EBEBEB',
  },
  ingredientWrapper: {
    position: 'relative',
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statusContainer: {
    marginRight: 10,
  },
  ingredientInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  ingredientName: {
    fontSize: 14,
    color: Colors.light.mainText,
    flex: 1,
    minWidth: 0,
  },
  ingredientNameUnavailable: {
    opacity: 0.5,
  },
  ingredientTextOverlay: {
    opacity: 0.6,
  },
  ingredientQuantity: {
    fontSize: 14,
    color: Colors.light.bodyText,
    marginLeft: 'auto',
  },
  ingredientQuantityUnavailable: {
    opacity: 0.5,
  },
  separator: {
    height: 1,
    backgroundColor: '#EBEBEB',
    marginLeft: 42, // Alinhado com o início do texto do ingrediente (ícone 20px + margin 10px + padding)
  },
  seeMoreOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    justifyContent: 'flex-end',
    zIndex: 10,
  },
  overlayGradient: {
    paddingTop: 20,
    paddingBottom: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  seeMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  seeMoreText: {
    fontSize: 14,
    color: Colors.light.primary,
  },
});

