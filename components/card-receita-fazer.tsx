import { Colors } from '@/constants/theme';
import { Image } from 'expo-image';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { TextUI } from './ui/text';

type CardReceitaFazerProps = {
    imageUri?: string;
    title: string;
    time: string;
    servings: string;
    description: string;
    onFazerAgora?: () => void;
    onProxima?: () => void;
};

export function CardReceitaFazer({
    imageUri,
    title,
    time,
    servings,
    description,
    onFazerAgora,
    onProxima,
}: CardReceitaFazerProps) {
    return (
        <View style={styles.container}>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: "#EBEBEB",
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
});