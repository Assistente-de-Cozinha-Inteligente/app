import { Colors } from '@/constants/theme';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Animated, Dimensions, NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, View } from 'react-native';
import { CardReceitaFazer } from './card-receita-fazer';
import { Receita } from '@/models';
import { ReceitaComScore } from '@/data/local/dao/receitaDao';

type ReceitaSliderFazerProps = {
  receitas: Receita[] | ReceitaComScore[];
};

export type ReceitaSliderFazerRef = {
  scrollToStart: () => void;
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_SPACING = 20; // Espaçamento entre cards
const CARD_WIDTH = SCREEN_WIDTH - 40; // Largura do card (20px padding de cada lado)

export const ReceitaSliderFazer = forwardRef<ReceitaSliderFazerRef, ReceitaSliderFazerProps>(
  ({ receitas }, ref) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollViewRef = useRef<ScrollView>(null);
    const currentScrollX = useRef(0);
    const animationRef = useRef<Animated.CompositeAnimation | null>(null);

    useImperativeHandle(ref, () => ({
      scrollToStart: () => {
        if (scrollViewRef.current && currentScrollX.current > 0) {
          // Cancela animação anterior se existir
          if (animationRef.current) {
            animationRef.current.stop();
          }

          const startX = currentScrollX.current;
          const scrollAnim = new Animated.Value(startX);
          
          // Cria uma animação suave
          animationRef.current = Animated.timing(scrollAnim, {
            toValue: 0,
            duration: Math.min(600, startX * 1.5), // Duração proporcional à distância, máximo 600ms
            useNativeDriver: false,
          });

          // Atualiza o scroll progressivamente durante a animação
          const listener = scrollAnim.addListener(({ value }) => {
            scrollViewRef.current?.scrollTo({
              x: value,
              animated: false,
            });
            currentScrollX.current = value;
          });

          animationRef.current.start(() => {
            scrollAnim.removeListener(listener);
            scrollAnim.setValue(0);
            animationRef.current = null;
            setActiveIndex(0);
          });
        } else {
          scrollViewRef.current?.scrollTo({
            x: 0,
            animated: true,
          });
          setActiveIndex(0);
        }
      },
    }));

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    currentScrollX.current = scrollPosition;
    const itemWidth = CARD_WIDTH + CARD_SPACING;
    const index = Math.round(scrollPosition / itemWidth);
    setActiveIndex(index);
  };

  const handleProxima = (index: number) => {
    if (index < receitas.length - 1 && scrollViewRef.current) {
      const nextIndex = index + 1;
      const itemWidth = CARD_WIDTH + CARD_SPACING;
      const offsetX = nextIndex * itemWidth;
      
      scrollViewRef.current.scrollTo({
        x: offsetX,
        animated: true,
      });
    }
  };

  // Função para calcular o status baseado em qtd_faltantes
  const getStatus = (receita: Receita | ReceitaComScore): string | undefined => {
    if ('qtd_faltantes' in receita) {
      const qtdFaltantes = receita.qtd_faltantes;
      if (qtdFaltantes === 0) {
        return "Pode fazer agora";
      } else if (qtdFaltantes === 1) {
        return "Falta 1 ingrediente";
      } else {
        return `Faltam ${qtdFaltantes} ingredientes`;
      }
    }
    return undefined;
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled={false}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + CARD_SPACING}
        snapToAlignment="start"
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
      >
        {receitas && receitas.length > 0 && receitas.map((receita, index) => (
          <View key={index} style={styles.cardWrapper}>
            <CardReceitaFazer
              imageUri={receita.imagem}
              title={receita.nome}
              time={receita.tempo_minutos.toString()}
              servings={receita.pessoas?.toString() || ''}
              description={receita.descricao}
              status={getStatus(receita)}
              onFazerAgora={() => {}}
              onProxima={() => handleProxima(index)}
              isLast={index === receitas.length - 1}
            />
          </View>
        ))}
      </ScrollView>

      {/* Indicadores de paginação */}
      <View style={styles.pagination}>
        {receitas.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === activeIndex && styles.dotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
  }
);

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  scrollContent: {
  },
  cardWrapper: {
    width: CARD_WIDTH,
    marginRight: CARD_SPACING,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E5E5',
  },
  dotActive: {
    backgroundColor: Colors.light.primary,
    width: 24,
  },
});

