import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { CardCategoria } from './card-categoria';

type CategoriaData = {
  id: string;
  title: string;
};

type CategoriaSliderProps = {
  categorias: CategoriaData[];
  onCategoriaChange?: (categoriaId: string) => void;
  initialSelectedId?: string;
};

const CARD_SPACING = 12; // Espaçamento entre cards
const PADDING_HORIZONTAL = 20; // Padding lateral

export function CategoriaSlider({
  categorias,
  onCategoriaChange,
  initialSelectedId,
}: CategoriaSliderProps) {
  const [selectedId, setSelectedId] = useState<string | undefined>(
    initialSelectedId || categorias[0]?.id
  );

  const handlePress = (categoriaId: string) => {
    setSelectedId(categoriaId);
    onCategoriaChange?.(categoriaId);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled={false}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categorias.map((categoria) => (
          <View key={categoria.id} style={styles.cardWrapper}>
            <CardCategoria
              title={categoria.title}
              isSelected={selectedId === categoria.id}
              onPress={() => handlePress(categoria.id)}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  },
  scrollContent: {
    paddingLeft: PADDING_HORIZONTAL,
    paddingRight: PADDING_HORIZONTAL - CARD_SPACING,
  },
  cardWrapper: {
    marginRight: CARD_SPACING,
  },
});

