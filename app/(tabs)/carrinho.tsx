import { Colors } from '@/constants/theme';
import { StyleSheet, Text, View } from 'react-native';

export default function CarrinhoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Carrinho</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    color: Colors.light.mainText,
  },
});

