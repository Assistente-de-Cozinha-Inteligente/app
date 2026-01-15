import { Colors } from '@/constants/theme';
import { useRef, useState } from 'react';
import { Dimensions, NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, View } from 'react-native';
import { CardReceitaFazer } from './card-receita-fazer';

type ReceitaData = {
  imageUri?: string;
  title: string;
  time: string;
  servings: string;
  description: string;
  onFazerAgora?: () => void;
  onProxima?: () => void;
};

type ReceitaSliderFazerProps = {
  receitas: ReceitaData[];
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_SPACING = 20; // Espaçamento entre cards
const CARD_WIDTH = SCREEN_WIDTH - 40; // Largura do card (20px padding de cada lado)

export function ReceitaSliderFazer({ receitas }: ReceitaSliderFazerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
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
        {receitas.map((receita, index) => (
          <View key={index} style={styles.cardWrapper}>
            <CardReceitaFazer
              imageUri={receita.imageUri}
              title={receita.title}
              time={receita.time}
              servings={receita.servings}
              description={receita.description}
              onFazerAgora={receita.onFazerAgora}
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

