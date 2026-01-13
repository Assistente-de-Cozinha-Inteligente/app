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
}: {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'tertiary';
    disabled?: boolean;
    loading?: boolean;
    style?: any;
}) {
    const backgroundColor = 
        variant === 'primary' 
            ? Colors.light.btnPrimary 
            : variant === 'secondary' 
            ? Colors.light.btnSecondary 
            : Colors.light.btnTertiary;

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
                isDisabled && styles.buttonDisabled,
                style
            ]}>
            {loading ? (
                <ActivityIndicator 
                    size="small" 
                    color={Colors.light.white} 
                />
            ) : (
                <TextUI variant="semibold" style={styles.buttonText}>
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