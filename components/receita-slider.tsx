import { Colors } from '@/constants/theme';
import { ReceitaComScore, buscarCategoriaPrincipal } from '@/data/local/dao/receitaDao';
import { Receita } from '@/models';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Dimensions, NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { CardReceita } from './card-receita';

type ReceitaSliderProps = {
  receitas: Receita[] | ReceitaComScore[];
  onEndReached: () => void;
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_SPACING = 16; // Espaçamento entre cards
const CARD_WIDTH = SCREEN_WIDTH * 0.85; // Card ocupa 85% da largura, deixando parte do próximo visível
const PADDING_HORIZONTAL = 20; // Padding lateral

// Função para mapear nível de dificuldade para texto
const getNivelTexto = (nivel?: string): string => {
  if (!nivel) return 'Fácil';

  const nivelMap: Record<string, string> = {
    'iniciante': 'Fácil',
    'intermediario': 'Médio',
    'avancado': 'Difícil',
    'outro': 'Fácil',
  };

  return nivelMap[nivel] || 'Fácil';
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

export function ReceitaSlider({ receitas, onEndReached }: ReceitaSliderProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [categorias, setCategorias] = useState<Record<number, string>>({});
  const endReachedCalled = useRef(false);

  const itemWidth = CARD_WIDTH + CARD_SPACING;

  // Busca categorias de todas as receitas
  useEffect(() => {
    const buscarCategorias = async () => {
      const categoriasMap: Record<number, string> = {};

      await Promise.all(
        receitas.map(async (receita) => {
          const categoria = await buscarCategoriaPrincipal(receita.id);
          categoriasMap[receita.id] = categoria;
        })
      );

      setCategorias(categoriasMap);
    };

    if (receitas && receitas.length > 0) {
      buscarCategorias();
    }
  }, [receitas]);

  // Reset endReachedCalled quando receitas mudam
  useEffect(() => {
    endReachedCalled.current = false;
  }, [receitas.length]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / itemWidth);
    setCurrentIndex(index);
  };

  // Detecta quando chegou ao último item (apenas uma vez)
  useEffect(() => {
    if (
      receitas && 
      receitas.length > 0 && 
      currentIndex === receitas.length - 1 && 
      !endReachedCalled.current
    ) {
      endReachedCalled.current = true;
      console.log("ACABOU");
      onEndReached?.();
    }
  }, [currentIndex, receitas, onEndReached]);

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
        {receitas && receitas.length > 0 && receitas.map((receita, index) => {
          const categoria = categorias[receita.id] || 'Geral';
          const nivel = 'iniciante'; // TODO: Buscar nível do banco quando necessário

          return (
            <View key={receita.id || index} style={[styles.cardWrapper, { width: CARD_WIDTH }]}>
              <CardReceita
                imageUri={receita.imagem}
                category={categoria}
                title={receita.nome}
                time={`${receita.tempo_minutos} min`}
                servings={receita.pessoas ? `${receita.pessoas} pessoas` : ''}
                difficulty={getNivelTexto(nivel)}
                status={getStatus(receita)}
                onPress={() => router.push(`/receita/${receita.id}`)}
              />
            </View>
          );
        })}
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

