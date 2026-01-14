import { Colors } from '@/constants/theme';
import { StyleSheet, View } from 'react-native';
import { TextUI } from './text';

type PageHeaderProps = {
  title: string;
  description?: string;
  rightComponent?: React.ReactNode;
};

export function PageHeader({
  title,
  description,
  rightComponent,
}: PageHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        <TextUI variant="medium" style={styles.title}>
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
  },
  leftContent: {
    flex: 1,
    flexDirection: 'column',
  },
  title: {
    fontSize: 20,
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

