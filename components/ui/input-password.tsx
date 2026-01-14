import { Colors, Fonts } from "@/constants/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

export function InputPasswordUI({
  placeholder,
  value,
  onChangeText,
  borderColor = null,
}: {
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
  borderColor?: null | 'success' | 'error';
}) {
  const [showPassword, setShowPassword] = useState(false);

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
    <View style={[styles.wrapper, getBorderStyle()]}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={styles.input}
        secureTextEntry={!showPassword}
        underlineColorAndroid="transparent"
        autoCorrect={false}
        placeholderTextColor={Colors.light.bodyText}
        selectionColor={Colors.light.primary}
      />

      {/* Botão mostrar/ocultar senha */}
      <TouchableOpacity 
        onPress={() => setShowPassword(!showPassword)} 
        style={styles.eyeButton}
        activeOpacity={0.7}
      >
        <Ionicons 
          name={showPassword ? "eye-off" : "eye"} 
          size={20} 
          color={Colors.light.bodyText} 
        />
      </TouchableOpacity>
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

  eyeButton: {
    marginLeft: 8,
    padding: 4,
  },
});

