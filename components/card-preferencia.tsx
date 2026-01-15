import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import { TextUI } from './ui/text';

type CardPreferenciaProps = {
    imageUri: string | number;
    title: string;
    color: string;
    backgroundColor?: string;
};

export function CardPreferencia({
    imageUri,
    title,
    color,
    backgroundColor,
}: CardPreferenciaProps) {
    // Se for número (imagem local), usa diretamente, senão usa como URI
    const imageSource = typeof imageUri === 'number' 
        ? imageUri 
        : { uri: imageUri };

    return (
        <View style={[
            styles.container, 
            { 
                borderColor: color,
                backgroundColor: backgroundColor || 'transparent',
            }
        ]}>
            <Image 
                source={imageSource} 
                style={styles.image}
                contentFit="cover"
            />
            <View style={styles.overlay} />
            <View style={styles.textContainer}>
                <TextUI style={styles.text} variant="semibold">
                    {title}
                </TextUI>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 200,
        width: 150,
        borderRadius: 16,
        borderWidth: 10,
        overflow: 'hidden',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
        position: 'absolute',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    textContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: '#FFFFFF',
        fontSize: 18,
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
});