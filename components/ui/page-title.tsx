import { Colors } from "@/constants/theme";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { TextUI } from "./text";
import Ionicons from '@expo/vector-icons/Ionicons';

export function PageTitle({
    title,
    onBackPress = () => { },
    rightButton,
}: {
    title: string;
    onBackPress?: () => void;
    rightButton?: React.ReactNode;
}) {

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onBackPress}>
                <Ionicons name="arrow-back" size={20} color="black" />
            </TouchableOpacity>
            <TextUI variant="regular" style={styles.title}>
                {title}
            </TextUI>
            {rightButton && (
                rightButton
            ) || <View />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 16,
    },
});