import { TextUI } from '@/components/ui/text';
import { Colors } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

type ConfigItemProps = {
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  value: string | ReactNode;
  onPress: () => void;
  valueColor?: string;
  showChevron?: boolean;
};

export function ConfigItem({ 
  icon = 'moon-outline', 
  title, 
  value, 
  onPress,
  valueColor,
  showChevron = true,
}: ConfigItemProps) {
  return (
    <Pressable style={styles.item} onPress={onPress}>
      <View style={styles.left}>
        <Ionicons name={icon} size={20} color={Colors.light.mainText} />
        <TextUI variant="regular" style={styles.text}>
          {title}
        </TextUI>
      </View>
      <View style={styles.right}>
        {typeof value === 'string' ? (
          <TextUI variant="regular" style={[styles.value, valueColor && { color: valueColor }]}>
            {value}
          </TextUI>
        ) : (
          value
        )}
        {showChevron && (
          <Ionicons name="chevron-forward" size={20} color={Colors.light.bodyText} />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  text: {
    fontSize: 14,
    color: Colors.light.mainText,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  value: {
    fontSize: 14,
    color: Colors.light.bodyText,
  },
});

