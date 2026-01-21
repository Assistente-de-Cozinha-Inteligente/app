import { Colors } from '@/constants/theme';
import { ListaCompras } from '@/models';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { TextUI } from './ui/text';

type CardItemListaProps = {
  item: ListaCompras;
  onItemPress?: (item: ListaCompras) => void;
  onItemCheck?: (ingrediente_id: number, checked: boolean) => void;
  onItemRemove?: (ingrediente_id: number) => void;
};

export function CardItemLista({
  item,
  onItemPress,
  onItemCheck,
  onItemRemove,
}: CardItemListaProps) {
  const handlePress = () => {
    onItemPress?.(item);
  };

  const handleCheck = () => {
    onItemCheck?.(item.ingrediente_id, !item.marcado);
  };

  const handleRemove = () => {
    onItemRemove?.(item.ingrediente_id);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Checkbox */}
        <TouchableOpacity
          onPress={handleCheck}
          style={styles.checkboxContainer}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, item.marcado && styles.checkboxChecked]}>
            {item.marcado && (
              <Ionicons name="checkmark" size={18} color={Colors.light.white} />
            )}
          </View>
        </TouchableOpacity>

        {/* Lado esquerdo: Nome */}
        <TouchableOpacity
          onPress={handlePress}
          style={styles.leftContent}
          activeOpacity={0.7}
        >
          <TextUI 
            variant="regular" 
            style={[
              styles.itemNome,
              item.marcado && styles.itemNomeMarcado
            ]}
          >
            {item.ingrediente?.nome || 'Item'}
          </TextUI>
        </TouchableOpacity>

        {/* Lado direito: Ícone de deletar */}
        <View style={styles.rightContent}>
          <TouchableOpacity
            onPress={handleRemove}
            style={styles.iconButton}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={22} color={Colors.light.danger} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.white,
    borderRadius: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  checkboxContainer: {
    marginRight: 10,
    padding: 2,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.light.bodyText,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  leftContent: {
    flex: 1,
    marginRight: 8,
  },
  itemNome: {
    fontSize: 14,
    color: Colors.light.mainText,
  },
  itemNomeMarcado: {
    textDecorationLine: 'line-through',
    color: Colors.light.bodyText,
    opacity: 0.6,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    padding: 6,
    minWidth: 36,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

