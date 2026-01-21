import { TextUI } from '@/components/ui/text';
import { Colors } from '@/constants/theme';
import { LocalIngrediente } from '@/models';
import { getNomeLocal } from '@/utils/localHelper';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ReactNode } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';

type LocalGroupCardProps<T> = {
  local: LocalIngrediente;
  itens: T[];
  isExpanded: boolean;
  animValue: Animated.Value;
  onToggle: () => void;
  renderItem: (item: T, index: number) => ReactNode;
  itemHeight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  extraSpace?: number;
};

export function LocalGroupCard<T>({
  local,
  itens,
  isExpanded,
  animValue,
  onToggle,
  renderItem,
  itemHeight = 70,
  paddingTop = 8,
  paddingBottom = 16,
  extraSpace = 16,
}: LocalGroupCardProps<T>) {
  const paddingVertical = paddingTop + paddingBottom;
  const maxHeight = (itens.length * itemHeight) + paddingVertical + extraSpace;

  const contentHeight = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, maxHeight],
  });

  const rotateIcon = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={styles.localCard}>
      {/* Cabeçalho do card com nome do local */}
      <TouchableOpacity
        onPress={onToggle}
        style={styles.localCardHeader}
        activeOpacity={0.7}
      >
        <View style={styles.localCardHeaderLeft}>
          <TextUI variant="semibold" style={styles.localCardTitle}>
            {getNomeLocal(local)}
          </TextUI>
          <TextUI variant="regular" style={styles.localCardCount}>
            {itens.length} {itens.length === 1 ? 'item' : 'itens'}
          </TextUI>
        </View>
        <Animated.View style={{ transform: [{ rotate: rotateIcon }] }}>
          <Ionicons name="chevron-down" size={20} color={Colors.light.bodyText} />
        </Animated.View>
      </TouchableOpacity>

      {/* Lista de itens do local com animação */}
      <Animated.View
        style={[
          styles.localCardContent,
          {
            maxHeight: contentHeight,
            opacity: animValue,
          },
        ]}
      >
        {itens.map((item, index) => renderItem(item, index))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  localCard: {
    backgroundColor: Colors.light.white,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    overflow: 'hidden',
  },
  localCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8F8F8',
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
  },
  localCardHeaderLeft: {
    flex: 1,
  },
  localCardTitle: {
    fontSize: 16,
    color: Colors.light.mainText,
  },
  localCardCount: {
    fontSize: 12,
    color: Colors.light.bodyText,
  },
  localCardContent: {
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 16,
    overflow: 'hidden',
  },
});

