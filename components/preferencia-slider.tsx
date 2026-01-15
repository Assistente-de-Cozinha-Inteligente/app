import { ScrollView, StyleSheet, View } from 'react-native';
import { CardPreferencia } from './card-preferencia';

type PreferenciaData = {
  imageUri: string | number;
  title: string;
  color: string;
  backgroundColor?: string;
};

type PreferenciaSliderProps = {
  preferencias: PreferenciaData[];
};

const CARD_SPACING = 16; // Espaçamento entre cards
const CARD_WIDTH = 150; // Largura fixa do card de preferência
const PADDING_HORIZONTAL = 20; // Padding lateral

export function PreferenciaSlider({ preferencias }: PreferenciaSliderProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled={false}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {preferencias.map((preferencia, index) => (
          <View key={index} style={[styles.cardWrapper, { width: CARD_WIDTH }]}>
            <CardPreferencia
              imageUri={preferencia.imageUri}
              title={preferencia.title}
              color={preferencia.color}
              backgroundColor={preferencia.backgroundColor}
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
    paddingRight: PADDING_HORIZONTAL - CARD_SPACING, // Remove o espaçamento extra no final
  },
  cardWrapper: {
    marginRight: CARD_SPACING,
  },
});

