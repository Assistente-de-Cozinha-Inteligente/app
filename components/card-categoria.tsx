import { Colors } from '@/constants/theme';
import { Pressable, StyleSheet } from 'react-native';
import { TextUI } from './ui/text';

type CardCategoriaProps = {
  title: string;
  isSelected?: boolean;
  onPress?: () => void;
};

export function CardCategoria({
  title,
  isSelected = false,
  onPress,
}: CardCategoriaProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.container,
        isSelected ? styles.containerSelected : styles.containerUnselected,
      ]}
    >
      <TextUI
        style={[
          styles.text,
          isSelected ? styles.textSelected : styles.textUnselected,
        ]}
        variant="medium"
      >
        {title}
      </TextUI>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerSelected: {
    backgroundColor: Colors.light.primary,
  },
  containerUnselected: {
    backgroundColor: Colors.light.white,
    borderWidth: 2,
    borderColor: '#EBEBEB',
  },
  text: {
    fontSize: 14, 
  },
  textSelected: {
    color: Colors.light.white,
  },
  textUnselected: {
    color: Colors.light.mainText,
  },
});

