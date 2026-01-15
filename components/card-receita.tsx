import { Colors } from '@/constants/theme';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { TextUI } from './ui/text';

// Função para determinar cor do status baseado no texto
const getStatusColor = (status: string): { backgroundColor: string; textColor: string } => {
  const statusLower = status.toLowerCase();
  
  // Status positivo - pode fazer
  if (statusLower.includes('consegue fazer') || statusLower.includes('pode fazer') || statusLower.includes('pronto')) {
    return {
      backgroundColor: 'rgba(76, 175, 80, 0.95)', // Verde
      textColor: '#FFFFFF',
    };
  }
  
  // Status de falta de ingredientes
  if (statusLower.includes('falta') || statusLower.includes('faltam')) {
    return {
      backgroundColor: 'rgba(255, 193, 7, 0.95)', // Amarelo/Laranja
      textColor: '#FFFFFF',
    };
  }
  
  // Status neutro/outros
  return {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    textColor: Colors.light.bodyText,
  };
};

type CardReceitaProps = {
    imageUri?: string;
    category: string;
    title: string;
    time: string;
    servings: string;
    difficulty: string;
    status?: string;
    onPress?: () => void;
};

export function CardReceita({
    imageUri,
    category,
    title,
    time,
    servings,
    difficulty,
    status,
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

            {/* Badge de status no canto superior direito */}
            {status && (() => {
                const statusColors = getStatusColor(status);
                return (
                    <View style={[styles.statusBadge, { backgroundColor: statusColors.backgroundColor }]}>
                        <TextUI variant="regular" style={[styles.statusText, { color: statusColors.textColor }]}>
                            {status}
                        </TextUI>
                    </View>
                );
            })()}

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
    statusBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
        zIndex: 1,
    },
    statusText: {
        fontSize: 11,
    },
});

