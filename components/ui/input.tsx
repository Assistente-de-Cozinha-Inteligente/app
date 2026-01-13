import { Colors } from "@/constants/theme";
import { StyleSheet, TextInput, View, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";

export function InputUI({
  placeholder,
  value,
  onChangeText,
  status = "default", // default | focus | error | success
  secureTextEntry,
  showClear,
}: {
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
  status?: "default" | "focus" | "error" | "success";
  secureTextEntry?: boolean;
  showClear?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const visualState = focused ? "focus" : status;

  return (
    <View style={[styles.wrapper, styles[visualState]]}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={styles.input}
        secureTextEntry={secureTextEntry && !showPassword}
        underlineColorAndroid="transparent"
        autoCorrect={false}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholderTextColor={Colors.light.bodyText}
      />

      {/* Botão limpar */}
      {showClear && value?.length ? (
        <Pressable onPress={() => onChangeText?.("")}>
          <Ionicons name="close" size={18} color={Colors.light.bodyText} />
        </Pressable>
      ) : null}

      {/* Mostrar senha */}
      {secureTextEntry ? (
        <Pressable onPress={() => setShowPassword(!showPassword)}>
          {showPassword ? (
            <Ionicons name="eye-off" size={18} color={Colors.light.bodyText} />
          ) : (
            <Ionicons name="eye" size={18} color={Colors.light.bodyText} />
          )}
        </Pressable>
      ) : null}
    </View>
  );
}


const styles = StyleSheet.create({
    wrapper: {
      height: 48,
      borderRadius: 12,
      paddingHorizontal: 14,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      backgroundColor: Colors.light.input,
      borderWidth: 1.5,
    },
  
    default: {
      borderColor: Colors.light.input,
    },
  
    focus: {
      borderColor: Colors.light.primary,
    },
  
    error: {
      borderColor: "#EF4444", // vermelho
    },
  
    success: {
      borderColor: "#22C55E", // verde
    },
  
    input: {
      flex: 1,
  
      padding: 0,
      margin: 0,
      borderWidth: 0,
      backgroundColor: "transparent",
  
      color: Colors.light.bodyText,
      fontSize: 16,
      includeFontPadding: false,
    },
  });
  