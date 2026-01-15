import { Colors } from '@/constants/theme';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { TextUI } from './text';

type PageHeaderProps = {
  title: string;
  description?: string;
  rightComponent?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function PageHeader({
  title,
  description,
  rightComponent,
  style,
}: PageHeaderProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.leftContent}>
        <TextUI variant="semibold" style={styles.title}>
          {title}
        </TextUI>
        {description && (
          <TextUI variant="regular" style={styles.description}>
            {description}
          </TextUI>
        )}
      </View>
      {rightComponent && (
        <View style={styles.rightContent}>
          {rightComponent}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    marginTop: 20,
  },
  leftContent: {
    flex: 1,
    flexDirection: 'column',
  },
  title: {
    fontSize: 22,
    color: Colors.light.mainText,
  },
  description: {
    fontSize: 14,
    color: Colors.light.bodyText,
  },
  rightContent: {
    alignItems: 'flex-end',
  },
});

