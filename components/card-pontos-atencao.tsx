import { TextUI } from '@/components/ui/text';
import { Colors } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BlurView } from 'expo-blur';
import { Pressable, StyleSheet, View } from 'react-native';

type PontoAtencao = {
    id: string;
    text: string;
    isPremium?: boolean;
};

type CardPontosAtencaoProps = {
    pontos: PontoAtencao[];
    userLoggedIn: 0 | 1; // 1 = logado/premium, 0 = não logado/gratuito
    onPremiumPress?: () => void;
};

export function CardPontosAtencao({
    pontos,
    userLoggedIn,
    onPremiumPress,
}: CardPontosAtencaoProps) {
    const isPremium = userLoggedIn === 1;
    
    // Separar pontos visíveis e premium
    const pontosVisiveis = pontos.filter(p => !p.isPremium);
    const pontosPremium = pontos.filter(p => p.isPremium);
    const totalPremium = pontosPremium.length;

    return (
        <View style={styles.container}>
            {/* Pontos visíveis */}
            {pontosVisiveis.map((ponto) => (
                <View key={ponto.id} style={styles.pontoItem}>
                    <Ionicons name="warning-outline" size={20} color={Colors.light.warning} />
                    <TextUI variant="regular" style={styles.pontoText}>
                        {ponto.text}
                    </TextUI>
                </View>
            ))}

            {/* Pontos premium - skeleton */}
            {!isPremium && pontosPremium.length > 0 && pontosPremium.map((ponto, index) => (
                <Pressable
                    key={ponto.id}
                    onPress={() => onPremiumPress?.()}
                    style={styles.pontoItemSkeleton}
                >
                    <BlurView intensity={80} tint="light" style={styles.blurContainer}>
                        <View style={styles.pontoItemContent}>
                            <View style={styles.skeletonIcon} />
                            <View style={styles.skeletonTextContainer}>
                                <View style={[styles.skeletonBar, { width: index % 2 === 0 ? '70%' : '60%' }]} />
                            </View>
                        </View>
                    </BlurView>
                    <View style={styles.skeletonLockOverlay}>
                        <Ionicons name="lock-closed" size={18} color={Colors.light.premium} />
                    </View>
                </Pressable>
            ))}

            {/* Pontos premium - visíveis para usuários logados */}
            {isPremium && pontosPremium.map((ponto) => (
                <View key={ponto.id} style={styles.pontoItem}>
                    <Ionicons name="warning-outline" size={20} color={Colors.light.warning} />
                    <TextUI variant="regular" style={styles.pontoText}>
                        {ponto.text}
                    </TextUI>
                </View>
            ))}
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
        gap: 12,
    },
    pontoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    pontoText: {
        fontSize: 14,
        color: Colors.light.mainText,
        flex: 1,
    },
    pontoItemSkeleton: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        overflow: 'hidden',
    },
    pontoItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 8,
        flex: 1,
    },
    blurContainer: {
        flex: 1,
        borderRadius: 8,
        opacity: 0.3,
    },
    skeletonIcon: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#E0E0E0',
    },
    skeletonTextContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    skeletonBar: {
        height: 14,
        borderRadius: 4,
        backgroundColor: '#E0E0E0',
    },
    skeletonLockOverlay: {
        position: 'absolute',
        right: 12,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

