import { Colors } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { TextUI } from './text';

type EmptyStateCardProps = {
  title?: string;
  description?: string;
  iconName?: React.ComponentProps<typeof Ionicons>['name'];
  onPress?: () => void;
  actionLabel?: string;
  style?: ViewStyle;
};

export function EmptyStateCard({
  title = 'Vazio',
  description = 'Cadastre um item para começar.',
  iconName = 'cube-outline',
  onPress,
  actionLabel,
  style,
}: EmptyStateCardProps) {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[styles.card, style]}
      activeOpacity={onPress ? 0.7 : undefined}
      onPress={onPress}
    >
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons name={iconName} size={22} color={Colors.light.primary} />
        </View>

        <View style={styles.text}>
          <TextUI variant="semibold" style={styles.title}>
            {title}
          </TextUI>
          <TextUI variant="regular" style={styles.description}>
            {description}
          </TextUI>
        </View>

        {!!actionLabel && (
          <View style={styles.action}>
            <TextUI variant="semibold" style={styles.actionText}>
              {actionLabel}
            </TextUI>
          </View>
        )}
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.primary + '12',
    borderWidth: 1,
    borderColor: Colors.light.primary + '22',
  },
  text: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    color: Colors.light.mainText,
    marginBottom: 2,
  },
  description: {
    fontSize: 12,
    color: Colors.light.bodyText,
    lineHeight: 16,
  },
  action: {
    paddingLeft: 8,
  },
  actionText: {
    fontSize: 12,
    color: Colors.light.primary,
  },
});


