import { Colors } from '@/constants/theme';
import { TextUI } from '@/components/ui/text';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';

type Preferencia = {
    id: string;
    text: string;
    icon?: string;
};

type CardPreferenciasIAProps = {
    preferencias: Preferencia[];
};

export function CardPreferenciasIA({ preferencias }: CardPreferenciasIAProps) {
    if (preferencias.length === 0) {
        return null;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="sparkles-outline" size={20} color={Colors.light.primary} />
                <TextUI variant="semibold" style={styles.headerText}>
                    Você costuma preferir…
                </TextUI>
            </View>
            
            <View style={styles.content}>
                {preferencias.map((preferencia) => (
                    <View key={preferencia.id} style={styles.preferenciaItem}>
                        <View style={styles.preferenciaContent}>
                            {preferencia.icon ? (
                                <Ionicons 
                                    name={preferencia.icon as any} 
                                    size={16} 
                                    color={Colors.light.primary} 
                                />
                            ) : (
                                <View style={styles.bullet} />
                            )}
                            <TextUI variant="regular" style={styles.preferenciaText}>
                                {preferencia.text}
                            </TextUI>
                        </View>
                    </View>
                ))}
            </View>
            
            <View style={styles.footer}>
                <Ionicons name="information-circle-outline" size={14} color={Colors.light.bodyText} />
                <TextUI variant="light" style={styles.footerText}>
                    Padrões detectados pela IA com base no seu uso
                </TextUI>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#EBEBEB',
        backgroundColor: Colors.light.white,
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    headerText: {
        fontSize: 16,
        color: Colors.light.mainText,
    },
    content: {
        gap: 12,
        marginBottom: 12,
    },
    preferenciaItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    preferenciaContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flex: 1,
    },
    bullet: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.light.primary,
        marginTop: 6,
    },
    preferenciaText: {
        fontSize: 14,
        color: Colors.light.mainText,
        flex: 1,
        lineHeight: 20,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#EBEBEB',
    },
    footerText: {
        fontSize: 11,
        color: Colors.light.bodyText,
        flex: 1,
    },
});


