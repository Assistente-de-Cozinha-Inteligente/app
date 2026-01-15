import { Colors } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import { TextUI } from './ui/text';

type Item = {
  id: string;
  name: string;
  quantity?: string;
  checked?: boolean;
  expirationDate?: string; // Data de validade no formato YYYY-MM-DD
};

type CardCategoriaCozinhaProps = {
  category: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  items: Item[];
  onItemCheck?: (itemId: string, checked: boolean) => void;
  onItemRemove?: (itemId: string) => void;
  onAddItem?: () => void;
  onItemPress?: (item: Item) => void;
};

// Função para calcular dias até a validade
const getDaysUntilExpiration = (expirationDate?: string): number | null => {
  if (!expirationDate) return null;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const expiration = new Date(expirationDate);
  expiration.setHours(0, 0, 0, 0);
  
  const diffTime = expiration.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

export function CardCategoriaCozinha({
  category,
  icon = 'nutrition',
  iconColor = '#E23D24',
  items,
  onItemCheck,
  onItemRemove,
  onAddItem,
  onItemPress,
}: CardCategoriaCozinhaProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleItemCheck = (itemId: string, checked: boolean) => {
    onItemCheck?.(itemId, checked);
  };

  const handleItemRemove = (itemId: string) => {
    onItemRemove?.(itemId);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Pressable
        onPress={handleToggleExpand}
        style={styles.header}
        activeOpacity={0.7}
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
          {items.map((item) => {
            const daysUntilExpiration = getDaysUntilExpiration(item.expirationDate);
            
            return (
              <View key={item.id} style={styles.itemRow}>
                {/* Checkbox */}
                <TouchableOpacity
                  onPress={() => handleItemCheck(item.id, !item.checked)}
                  style={styles.checkboxContainer}
                  activeOpacity={0.7}
                >
                  <View style={[styles.checkbox, item.checked && styles.checkboxChecked]}>
                    {item.checked && (
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
                      item.checked && styles.itemTextChecked,
                    ]}
                  >
                    {item.quantity ? `${item.quantity} ${item.name}` : item.name}
                  </TextUI>
                  {daysUntilExpiration !== null && (
                    <View style={styles.expirationContainer}>
                      <Ionicons name="time-outline" size={12} color={Colors.light.bodyText} />
                      <TextUI variant="light" style={styles.expirationText}>
                        Vence em {daysUntilExpiration} {daysUntilExpiration === 1 ? 'dia' : 'dias'}
                      </TextUI>
                    </View>
                  )}
                </Pressable>

                {/* Ícone de lixeira */}
                <TouchableOpacity
                  onPress={() => handleItemRemove(item.id)}
                  style={styles.removeButton}
                  activeOpacity={0.7}
                >
                  <Ionicons name="trash-outline" size={16} color={Colors.light.bodyText} />
                </TouchableOpacity>
              </View>
            );
          })}

          {/* Botão Adicionar */}
          <Pressable
            onPress={onAddItem}
            style={styles.addButton}
            activeOpacity={0.7}
          >
            <TextUI variant="regular" style={styles.addButtonText}>
              + Adicionar
            </TextUI>
          </Pressable>
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
  expirationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  expirationText: {
    fontSize: 12,
    color: Colors.light.bodyText,
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

