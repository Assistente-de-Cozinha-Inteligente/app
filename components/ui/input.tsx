import { Colors, Fonts } from "@/constants/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { StyleSheet, TextInput, TextInputProps, TouchableOpacity, View } from "react-native";

export function InputUI({
  placeholder,
  value,
  onChangeText,
  borderColor = null,
  keyboardType,
  textAlign,
  containerStyle,
  showClearButton = true,
  ...textInputProps
}: {
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
  borderColor?: null | 'success' | 'error';
  keyboardType?: TextInputProps['keyboardType'];
  textAlign?: TextInputProps['textAlign'];
  containerStyle?: any;
  showClearButton?: boolean;
} & Omit<TextInputProps, 'placeholder' | 'value' | 'onChangeText' | 'style' | 'underlineColorAndroid' | 'autoCorrect' | 'placeholderTextColor' | 'selectionColor' | 'onFocus' | 'onBlur'>) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value && value.length > 0;
  const isSuccess = borderColor === 'success';

  const getBorderStyle = () => {
    if (borderColor === null) {
      return { borderWidth: 0 };
    }
    
    const color = borderColor === 'success' 
      ? Colors.light.success 
      : Colors.light.danger;
    
    return {
      borderWidth: 1.5,
      borderColor: color,
    };
  };

  return (
    <View style={[styles.wrapper, getBorderStyle(), containerStyle]}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={[styles.input, textAlign && { textAlign }]}
        underlineColorAndroid="transparent"
        autoCorrect={false}
        placeholderTextColor={Colors.light.bodyText}
        selectionColor={Colors.light.primary}
        keyboardType={keyboardType}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...textInputProps}
      />

      {/* Ícone de check quando success, ou X para limpar (só aparece se estiver focado e houver texto) */}
      {isSuccess ? (
        <View style={styles.iconButton}>
          <Ionicons name="checkmark" size={20} color={Colors.light.success} />
        </View>
      ) : showClearButton && isFocused && hasValue ? (
        <TouchableOpacity 
          onPress={() => onChangeText?.("")} 
          style={styles.clearButton}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={20} color={Colors.light.bodyText} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}


const styles = StyleSheet.create({
    wrapper: {
      height: 48,
      borderRadius: 12,
    paddingHorizontal: 16,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: Colors.light.input,
    borderWidth: 0,
    },
  
    input: {
      flex: 1,
      padding: 0,
      margin: 0,
      borderWidth: 0,
      backgroundColor: "transparent",
    color: Colors.light.mainText,
    fontSize: 14,
    fontFamily: Fonts.regular,
      includeFontPadding: false,
    height: '100%',
  },

  clearButton: {
    marginLeft: 8,
    padding: 4,
  },

  iconButton: {
    marginLeft: 8,
    padding: 4,
    },
  });
  