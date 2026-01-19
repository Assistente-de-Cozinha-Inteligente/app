import { Colors } from '@/constants/theme';
import { ListaCompras } from '@/models';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import { TextUI } from './ui/text';

type CardCategoriaCompraProps = {
  category: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  items: ListaCompras[];
  onItemCheck?: (ingrediente_id: number, checked: boolean) => void;
  onItemRemove?: (ingrediente_id: number) => void;
  onAddItem?: () => void;
  onItemPress?: (item: ListaCompras) => void;
};

export function CardCategoriaCompra({
  category,
  icon = 'nutrition',
  iconColor = '#E23D24',
  items,
  onItemCheck,
  onItemRemove,
  onAddItem,
  onItemPress,
}: CardCategoriaCompraProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleItemCheck = (ingrediente_id: number, checked: boolean) => {
    onItemCheck?.(ingrediente_id, checked);
  };

  const handleItemRemove = (ingrediente_id: number) => {
    onItemRemove?.(ingrediente_id);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Pressable
        onPress={handleToggleExpand}
        style={styles.header}
      >
        <View style={styles.headerLeft}>
          <View style={[styles.iconContainer, { backgroundColor: `${iconColor}15` }]}>
            <Ionicons name={icon} size={18} color={iconColor} />
          </View>
          <TextUI variant="semibold" style={styles.categoryText}>
            {category}
          </TextUI>
        </View>
        <Ionicons
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={Colors.light.mainText}
        />
      </Pressable>

      {/* Lista de itens (quando expandido) */}
      {isExpanded && (
        <View style={styles.content}>
          {items.map((item) => (
            <View key={`${item.usuario_id}-${item.ingrediente_id}`} style={styles.itemRow}>
              {/* Checkbox */}
              <TouchableOpacity
                onPress={() => handleItemCheck(item.ingrediente_id, !item.marcado)}
                style={styles.checkboxContainer}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, item.marcado && styles.checkboxChecked]}>
                  {item.marcado && (
                    <Ionicons name="checkmark" size={14} color={Colors.light.white} />
                  )}
                </View>
              </TouchableOpacity>

              {/* Texto do item */}
              <Pressable
                onPress={() => onItemPress?.(item)}
                style={styles.itemTextContainer}
              >
                <TextUI
                  variant="regular"
                  style={[
                    styles.itemText,
                    item.marcado && styles.itemTextChecked,
                  ]}
                >
                  {item.quantidade > 0 
                    ? `${item.quantidade} ${item.ingrediente?.nome || 'Item'}` 
                    : item.ingrediente?.nome || 'Item'}
                </TextUI>
              </Pressable>

              {/* Ícone de lixeira */}
              <TouchableOpacity
                onPress={() => handleItemRemove(item.ingrediente_id)}
                style={styles.removeButton}
                activeOpacity={0.7}
              >
                <Ionicons name="trash-outline" size={16} color={Colors.light.bodyText} />
              </TouchableOpacity>
            </View>
          ))}

          {/* Botão Adicionar */}
          <TouchableOpacity
            onPress={onAddItem}
            style={styles.addButton}
            activeOpacity={0.7}
          >
            <TextUI variant="regular" style={styles.addButtonText}>
              + Adicionar
            </TextUI>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.white,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#EBEBEB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#F5F5F5',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryText: {
    fontSize: 15,
    color: Colors.light.mainText,
  },
  content: {
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 8,
    backgroundColor: Colors.light.white,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 8,
    backgroundColor: Colors.light.white,
  },
  checkboxContainer: {
    padding: 2,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: Colors.light.bodyText,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemText: {
    fontSize: 14,
    color: Colors.light.mainText,
  },
  itemTextChecked: {
    textDecorationLine: 'line-through',
    color: Colors.light.bodyText,
    opacity: 0.6,
  },
  removeButton: {
    padding: 2,
  },
  addButton: {
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 2,
  },
  addButtonText: {
    fontSize: 14,
    color: Colors.light.mainText,
  },
});

