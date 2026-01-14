import { Colors } from '@/constants/theme';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { TextUI } from './ui/text';

type CardReceitaProps = {
    imageUri?: string;
    category: string;
    title: string;
    time: string;
    servings: string;
    difficulty: string;
    onPress?: () => void;
};

export function CardReceita({
    imageUri,
    category,
    title,
    time,
    servings,
    difficulty,
    onPress,
}: CardReceitaProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.9}
            style={styles.container}
        >
            {/* Imagem de fundo */}
            {imageUri && (
                <Image
                    source={{ uri: imageUri }}
                    style={styles.backgroundImage}
                    contentFit="cover"
                />
            )}

            {/* Gradiente preto de baixo para cima */}
            <LinearGradient
                colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.8)']}
                locations={[0, 0.5, 1]}
                style={styles.gradient}
            />

            {/* Botão de categoria no canto superior esquerdo */}
            <View style={styles.categoryButton}>
                <TextUI variant="regular" style={styles.categoryText}>
                    {category}
                </TextUI>
            </View>

            {/* Conteúdo no canto inferior esquerdo */}
            <View style={styles.content}>
                <TextUI variant="regular" style={styles.title}>
                    {title}
                </TextUI>
                <View style={styles.infoContainer}>
                    <TextUI variant="light" style={styles.infoText}>
                        {time}
                    </TextUI>
                    <TextUI variant="light" style={styles.separator}>
                        |
                    </TextUI>
                    <TextUI variant="light" style={styles.infoText}>
                        {servings}
                    </TextUI>
                    <TextUI variant="light" style={styles.separator}>
                        |
                    </TextUI>
                    <TextUI variant="light" style={styles.infoText}>
                        {difficulty}
                    </TextUI>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 200,
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#000000',
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
    },
    categoryButton: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
        zIndex: 1,
    },
    categoryText: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 14,
        color: Colors.light.white,
    },
    content: {
        position: 'absolute',
        bottom: 16,
        left: 16,
        zIndex: 1,
    },
    title: {
        fontSize: 22,
        color: Colors.light.white,
        marginBottom: 8,
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    infoText: {
        fontSize: 14,
        color: Colors.light.white,
    },
    separator: {
        fontSize: 14,
        color: Colors.light.white,
        opacity: 0.7,
    },
});

