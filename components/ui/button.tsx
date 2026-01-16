import { Colors } from "@/constants/theme";
import { ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import { TextUI } from "./text";

export function ButtonUI({
    title,
    onPress,
    variant = 'primary',
    disabled = false,
    loading = false,
    style,
    textStyle,
}: {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'tertiary' | 'default' | 'danger';
    disabled?: boolean;
    loading?: boolean;
    style?: any;
    textStyle?: any;
}) {
    const backgroundColor = 
        variant === 'primary' 
            ? Colors.light.btnPrimary 
            : variant === 'secondary' 
            ? Colors.light.btnSecondary 
            : variant === 'tertiary'
            ? Colors.light.btnTertiary
            : variant === 'danger'
            ? Colors.light.danger
            : Colors.light.white; // default: background branco

    const borderColor = variant === 'default' ? "#EBEBEB": 'transparent';
    const textColor = variant === 'default' ? Colors.light.mainText : Colors.light.white;

    const isDisabled = disabled || loading;

    const handlePress = () => {
        if (!isDisabled) {
            onPress();
        }
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            disabled={isDisabled}
            activeOpacity={0.7}
            style={[
                styles.button,
                { backgroundColor },
                variant === 'default' && { borderWidth: 1.5, borderColor },
                isDisabled && styles.buttonDisabled,
                style
            ]}>
            {loading ? (
                <ActivityIndicator 
                    size="small" 
                    color={textColor} 
                />
            ) : (
                <TextUI variant="semibold" style={[styles.buttonText, { color: textColor }, textStyle]}>
                    {title}
                </TextUI>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 15,
        paddingVertical: 15,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 55,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: Colors.light.white,
        fontSize: 16,
        textAlign: 'center',
    },
});