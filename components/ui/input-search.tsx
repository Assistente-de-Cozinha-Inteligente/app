import { Colors, Fonts } from "@/constants/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { forwardRef } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

export const InputSearchUI = forwardRef<TextInput, {
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
  borderColor?: null | 'success';
  onPress?: () => void;
}>(({
  placeholder,
  value,
  onChangeText,
  borderColor = null,
  onPress,
}, ref) => {
  const hasValue = value && value.length > 0;

  const getBorderStyle = () => {
    if (borderColor === null) {
      return { borderWidth: 0 };
    }
    
    return {
      borderWidth: 1.5,
      borderColor: Colors.light.success,
    };
  };

  const WrapperComponent = onPress ? TouchableOpacity : View;

  return (
    <WrapperComponent 
      style={[styles.wrapper, getBorderStyle()]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      {/* Ícone de busca na esquerda */}
      <View style={styles.searchIcon}>
        <Ionicons name="search" size={20} color={Colors.light.bodyText} />
      </View>

      <TextInput
        ref={ref}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={styles.input}
        underlineColorAndroid="transparent"
        autoCorrect={false}
        placeholderTextColor={Colors.light.bodyText}
        selectionColor={Colors.light.primary}
        editable={!onPress}
        pointerEvents={onPress ? 'none' : 'auto'}
      />

      {/* X para limpar (aparece sempre que houver texto) */}
      {hasValue && !onPress && (
        <TouchableOpacity 
          onPress={() => onChangeText?.("")} 
          style={styles.clearButton}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={20} color={Colors.light.bodyText} />
        </TouchableOpacity>
      )}
    </WrapperComponent>
  );
});

InputSearchUI.displayName = 'InputSearchUI';

const styles = StyleSheet.create({
  wrapper: {
    height: 55,
    borderRadius: 15,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.input,
    borderWidth: 0,
  },

  searchIcon: {
    marginRight: 8,
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
});

