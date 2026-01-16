import { Colors } from '@/constants/theme';
import { StyleSheet, View } from 'react-native';
import { TextUI } from './text';

type BadgeProps = {
  label: string;
};

export function Badge({ label }: BadgeProps) {
  return (
    <View style={styles.container}>
      <TextUI variant="regular" style={styles.label}>
        {label}
      </TextUI>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.white,
  },
  label: {
    fontSize: 12,
    color: Colors.light.primary,
  },
});

