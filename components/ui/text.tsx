import { Fonts } from '@/constants/theme';
import { StyleSheet, Text, TextProps } from 'react-native';

type TextUIProps = TextProps & {
  variant?: 'regular' | 'thin' | 'light' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
};

export function TextUI({ 
  style, 
  variant = 'regular',
  ...props 
}: TextUIProps) {
  const fontFamily = {
    regular: Fonts.regular,
    thin: Fonts.thin,
    light: Fonts.light,
    medium: Fonts.medium,
    semibold: Fonts.semibold,
    bold: Fonts.bold,
    extrabold: Fonts.extrabold,
    black: Fonts.black,
  }[variant];

  return (
    <Text 
      style={[styles.text, { fontFamily }, style]} 
      {...props} 
    />
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: Fonts.regular, // fallback
  },
});

