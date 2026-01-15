import { Colors } from '@/constants/theme';
import { Pressable, StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { TextUI } from './text';

type SectionUIProps = {
    children: React.ReactNode;
    title: string;
    titleStyle?: StyleProp<TextStyle>;
    rightButton?: React.ReactNode;
    rightButtonStyle?: StyleProp<ViewStyle>;
    onRightButtonPress?: () => void;
    style?: StyleProp<ViewStyle>;
};

export function SectionUI({
    children,
    title,
    titleStyle,
    rightButton,
    rightButtonStyle,
    onRightButtonPress,
    style,
}: SectionUIProps) {
    return (
        <View style={[styles.container, style]}>
            <View style={styles.titleContainer}>
                {title && (
                    <TextUI variant="semibold" style={[styles.title, titleStyle]} numberOfLines={1}>{title}</TextUI>
                )}
                {rightButton && (
                    <Pressable style={[styles.rightButton, rightButtonStyle]} onPress={onRightButtonPress}>
                        {rightButton}
                    </Pressable>
                )}
            </View>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 16,
        gap: 10,
    },
    title: {
        fontSize: 20,
        color: Colors.light.mainText,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    rightButton: {
        alignItems: 'flex-end',
    },
});