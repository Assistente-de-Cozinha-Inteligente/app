import { ScrollView, StyleSheet, View } from 'react-native';
import { CardReceitaCompacto } from './card-receita-compacto';

type ReceitaData = {
  imageUri?: string | number;
  category: string;
  title: string;
  time: string;
  servings: string;
  status?: string;
  onPress?: () => void;
};

type ReceitaSliderCompactoProps = {
  receitas: ReceitaData[];
};

const CARD_SPACING = 16; // Espaçamento entre cards
const CARD_WIDTH = 180; // Largura fixa do card compacto
const PADDING_HORIZONTAL = 20; // Padding lateral

export function ReceitaSliderCompacto({ receitas }: ReceitaSliderCompactoProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled={false}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {receitas.map((receita, index) => (
          <View key={index} style={[styles.cardWrapper, { width: CARD_WIDTH }]}>
            <CardReceitaCompacto
              imageUri={receita.imageUri}
              category={receita.category}
              title={receita.title}
              time={receita.time}
              servings={receita.servings}
              status={receita.status}
              onPress={receita.onPress}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  scrollContent: {
    paddingLeft: PADDING_HORIZONTAL,
    paddingRight: PADDING_HORIZONTAL - CARD_SPACING,
  },
  cardWrapper: {
    marginRight: CARD_SPACING,
  },
});

