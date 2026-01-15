import { Colors } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRef, useState } from 'react';
import { Dimensions, NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { CardReceita } from './card-receita';

type ReceitaData = {
  imageUri?: string;
  category: string;
  title: string;
  time: string;
  servings: string;
  difficulty: string;
  onPress?: () => void;
};

type ReceitaSliderProps = {
  receitas: ReceitaData[];
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_SPACING = 16; // Espaçamento entre cards
const CARD_WIDTH = SCREEN_WIDTH * 0.85; // Card ocupa 85% da largura, deixando parte do próximo visível
const PADDING_HORIZONTAL = 20; // Padding lateral

export function ReceitaSlider({ receitas }: ReceitaSliderProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const itemWidth = CARD_WIDTH + CARD_SPACING;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / itemWidth);
    setCurrentIndex(index);
  };

  const showLeftArrow = currentIndex > 0;
  const showRightArrow = currentIndex < receitas.length - 1;

  const scrollToNext = () => {
    if (scrollViewRef.current && currentIndex < receitas.length - 1) {
      const nextIndex = currentIndex + 1;
      const offsetX = nextIndex * itemWidth;
      
      scrollViewRef.current.scrollTo({
        x: offsetX,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    }
  };

  const scrollToPrevious = () => {
    if (scrollViewRef.current && currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      const offsetX = prevIndex * itemWidth;
      
      scrollViewRef.current.scrollTo({
        x: offsetX,
        animated: true,
      });
      setCurrentIndex(prevIndex);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled={false}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
      >
        {receitas.map((receita, index) => (
          <View key={index} style={[styles.cardWrapper, { width: CARD_WIDTH }]}>
            <CardReceita
              imageUri={receita.imageUri}
              category={receita.category}
              title={receita.title}
              time={receita.time}
              servings={receita.servings}
              difficulty={receita.difficulty}
              onPress={receita.onPress}
            />
          </View>
        ))}
      </ScrollView>

      {/* Seta esquerda */}
      {showLeftArrow && (
        <TouchableOpacity
          style={[styles.arrowButton, styles.arrowLeft]}
          onPress={scrollToPrevious}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color={Colors.light.white} />
        </TouchableOpacity>
      )}

      {/* Seta direita */}
      {showRightArrow && (
        <TouchableOpacity
          style={[styles.arrowButton, styles.arrowRight]}
          onPress={scrollToNext}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-forward" size={24} color={Colors.light.white} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    position: 'relative',
  },
  scrollContent: {
    paddingLeft: PADDING_HORIZONTAL,
    paddingRight: PADDING_HORIZONTAL - CARD_SPACING, // Remove o espaçamento extra no final
  },
  cardWrapper: {
    marginRight: CARD_SPACING,
  },
  arrowButton: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  arrowLeft: {
    left: 8,
  },
  arrowRight: {
    right: 8,
  },
});

