import { Colors } from '@/constants/theme';
import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import { ButtonUI } from './ui/button';
import { TextUI } from './ui/text';

// Função para determinar cor do status baseado no texto (versão para fundo claro)
const getStatusColor = (status: string): { backgroundColor: string; textColor: string; borderColor?: string } => {
    const statusLower = status.toLowerCase();

    // Status positivo - pode fazer
    if (statusLower.includes('consegue fazer') || statusLower.includes('pode fazer') || statusLower.includes('pronto')) {
        return {
            backgroundColor: '#E8F5E9', // Verde muito claro
            textColor: '#2E7D32', // Verde escuro
            borderColor: '#C8E6C9',
        };
    }

    // Status de falta de ingredientes
    if (statusLower.includes('falta') || statusLower.includes('faltam')) {
        return {
            backgroundColor: '#FFF3E0', // Amarelo/Laranja muito claro
            textColor: '#E65100', // Laranja escuro
            borderColor: '#FFE0B2',
        };
    }

    // Status neutro/outros
    return {
        backgroundColor: '#F5F5F5',
        textColor: Colors.light.bodyText,
        borderColor: '#E0E0E0',
    };
};

type CardReceitaFazerProps = {
    imageUri?: string;
    title: string;
    time: string;
    servings: string;
    description: string;
    status?: string;
    onFazerAgora?: () => void;
    onProxima?: () => void;
    isLast?: boolean;
};

export function CardReceitaFazer({
    imageUri,
    title,
    time,
    servings,
    description,
    status,
    onFazerAgora,
    onProxima,
    isLast = false,
}: CardReceitaFazerProps) {
    return (
        <View style={styles.container}>
            <View style={styles.contentContainer}>
                <Image source={{ uri: imageUri }} style={styles.image} />
                <View style={styles.infoContainer}>
                    <TextUI variant="medium" style={styles.title}>{title}</TextUI>

                    {/* Status acima do time e pessoas */}
                    {status && (() => {
                        const statusColors = getStatusColor(status);
                        return (
                            <View style={[
                                styles.statusContainer,
                                {
                                    backgroundColor: statusColors.backgroundColor,
                                    borderTopColor: statusColors.borderColor || '#F0F0F0',
                                }
                            ]}>
                                <TextUI variant="regular" style={[styles.statusText, { color: statusColors.textColor }]}>
                                    {status}
                                </TextUI>
                            </View>
                        );
                    })()}

                    <View style={styles.infoTextContainer}>
                        <TextUI variant="regular" style={styles.time}>{time} min</TextUI>
                        <TextUI variant="regular" style={styles.separator}>|</TextUI>
                        <TextUI variant="regular" style={styles.servings}>{servings} pessoas</TextUI>
                    </View>
                    <TextUI
                        variant="light"
                        style={styles.description}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                    >
                        {description}
                    </TextUI>
                </View>
            </View>
            <View style={styles.actionsContainer}>
                <View style={styles.buttonFazerAgora}>
                    <ButtonUI
                        title="FAZER AGORA"
                        onPress={onFazerAgora || (() => { })}
                        variant="primary"
                        style={styles.buttonFazerAgoraInner}
                        textStyle={styles.buttonText}
                    />
                </View>
                <View style={styles.buttonProxima}>
                    <ButtonUI
                        title={isLast ? "VER MAIS" : "Proxima"}
                        onPress={onProxima || (() => { })}
                        variant="default"
                        style={styles.buttonProximaInner}
                        textStyle={styles.buttonText}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.light.white,
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderWidth: 1,
        borderColor: "#EBEBEB",
        minHeight: 180,
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
    },
    image: {
        width: 90,
        height: 120,
        borderRadius: 12,
    },
    infoContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: 4,
    },
    infoTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    title: {
        fontSize: 18,
        color: Colors.light.mainText,
    },
    time: {
        fontSize: 14,
        color: Colors.light.bodyText,
    },
    separator: {
        fontSize: 14,
        color: Colors.light.bodyText,
        opacity: 0.7,
    },
    servings: {
        fontSize: 14,
        color: Colors.light.bodyText,
    },
    description: {
        fontSize: 14,
        color: Colors.light.bodyText,
        marginTop: 2,
    },
    statusContainer: {
        paddingTop: 8,
        paddingBottom: 6,
        paddingHorizontal: 8,
        borderRadius: 6,
        borderTopWidth: 1,
        width: '100%'
    },
    statusText: {
        fontSize: 11,
    },
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginTop: 8,
    },
    buttonFazerAgora: {
        flex: 2,
    },
    buttonFazerAgoraInner: {
        paddingVertical: 10,
        minHeight: 42,
        borderRadius: 12,
    },
    buttonProxima: {
        flex: 1,
    },
    buttonProximaInner: {
        paddingVertical: 10,
        minHeight: 42,
        borderRadius: 12,
    },
    buttonText: {
        fontSize: 13,
    },
});