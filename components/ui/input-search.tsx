import { Colors, Fonts } from "@/constants/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

export function InputSearchUI({
  placeholder,
  value,
  onChangeText,
  borderColor = null,
}: {
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
  borderColor?: null | 'success';
}) {
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

  return (
    <View style={[styles.wrapper, getBorderStyle()]}>
      {/* Ícone de busca na esquerda */}
      <View style={styles.searchIcon}>
        <Ionicons name="search" size={20} color={Colors.light.bodyText} />
      </View>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={styles.input}
        underlineColorAndroid="transparent"
        autoCorrect={false}
        placeholderTextColor={Colors.light.bodyText}
        selectionColor={Colors.light.primary}
      />

      {/* X para limpar (aparece sempre que houver texto) */}
      {hasValue && (
        <TouchableOpacity 
          onPress={() => onChangeText?.("")} 
          style={styles.clearButton}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={20} color={Colors.light.bodyText} />
        </TouchableOpacity>
      )}
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

