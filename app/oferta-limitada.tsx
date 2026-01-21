import { CronometroOferta } from '@/components/cronometro-oferta';
import { ButtonUI } from '@/components/ui/button';
import { TextUI } from '@/components/ui/text';
import { ViewContainerUI } from '@/components/ui/view-container';
import { Colors } from '@/constants/theme';
import { haptics } from '@/utils/haptics';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import * as Network from 'expo-network';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, Animated, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function OfertaLimitadaScreen() {
    const insets = useSafeAreaInsets();
    const [hasInternet, setHasInternet] = useState(true);

    // Animações de entrada
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    // quando iniciar tela 
    useEffect(() => {
        haptics.heavy();

        // Animação de entrada - fade + scale + slide
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    // Verifica conexão com internet
    useEffect(() => {
        const checkNetwork = async () => {
            try {
                const networkState = await Network.getNetworkStateAsync();
                setHasInternet(networkState.isConnected ?? false);
            } catch (error) {
                console.error('Erro ao verificar conexão:', error);
                setHasInternet(false);
            }
        };

        checkNetwork();
        const networkInterval = setInterval(checkNetwork, 5000);

        return () => {
            clearInterval(networkInterval);
        };
    }, []);

    return (
        <ViewContainerUI>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
                    <View style={styles.closeButtonCircle}>
                        <Ionicons name="close" size={20} color={Colors.light.mainText} />
                    </View>
                </TouchableOpacity>
            </View>

            <View style={[styles.content, { paddingBottom: insets.bottom + 100 }]}>
                <Animated.View
                    style={[
                        styles.animatedContainer,
                        {
                            opacity: fadeAnim,
                            transform: [
                                { scale: scaleAnim },
                                { translateY: slideAnim }
                            ]
                        }
                    ]}
                >
                    <View style={styles.imageContainer}>
                        <LinearGradient
                            colors={[Colors.light.primary + '20', Colors.light.primary + '05']}
                            style={styles.imageGradient}
                        >
                            <Image source={"https://cdn-icons-png.flaticon.com/512/3209/3209955.png"} style={styles.image} />
                        </LinearGradient>
                    </View>

                    <View style={styles.contentText}>
                        <View style={styles.titleContainer}>
                            <Ionicons name="sparkles" size={20} color={Colors.light.primary} style={styles.sparkleIcon} />
                            <TextUI variant="bold" style={styles.title}>
                                Parabéns!
                            </TextUI>
                            <Ionicons name="sparkles" size={20} color={Colors.light.primary} style={styles.sparkleIcon} />
                        </View>
                        <TextUI variant="regular" style={styles.description}>
                            Você desbloqueou uma oferta limitada exclusiva!
                        </TextUI>
                    </View>

                    <CronometroOferta variant="full" />

                    <View style={styles.priceCardContainer}>
                        {hasInternet ? (
                            <LinearGradient
                                colors={[Colors.light.primary, Colors.light.primary + 'DD']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.priceCard}
                            >
                                <View style={styles.priceHeader}>
                                    <View style={styles.priceHeaderLeft}>
                                        <Ionicons name="star" size={18} color={Colors.light.white} />
                                        <TextUI variant="bold" style={styles.priceCardTitle}>
                                            Plano Premium
                                        </TextUI>
                                    </View>

                                    <View style={styles.badge}>
                                        <TextUI variant="bold" style={styles.badgeText}>
                                            -31%
                                        </TextUI>
                                    </View>
                                </View>

                                <View style={styles.priceComparison}>
                                    <View style={styles.oldPriceContainer}>
                                        <TextUI variant="regular" style={styles.oldPrice}>
                                            R$ 12,90
                                        </TextUI>
                                        <TextUI variant="regular" style={styles.oldPricePeriod}>
                                            /mês
                                        </TextUI>
                                    </View>

                                    <View style={styles.newPriceContainer}>
                                        <TextUI variant="bold" style={styles.newPrice}>
                                            R$ 8,90
                                        </TextUI>
                                        <TextUI variant="regular" style={styles.newPricePeriod}>
                                            /mês
                                        </TextUI>
                                    </View>
                                </View>

                                <View style={styles.priceInfo}>
                                    <View style={styles.vitalicioContainer}>
                                        <Ionicons name="infinite" size={18} color={Colors.light.white} />
                                        <TextUI variant="bold" style={styles.vitalicioText}>
                                            Preço especial mantido enquanto a assinatura estiver ativa
                                        </TextUI>
                                    </View>

                                    <View style={styles.priceInfoRow}>
                                        <Ionicons name="checkmark-circle" size={16} color={Colors.light.white} />
                                        <TextUI variant="semibold" style={styles.savingsText}>
                                            Preço exclusivo para você
                                        </TextUI>
                                    </View>
                                </View>
                            </LinearGradient>
                        ) : (
                            <View style={styles.priceCardOffline}>
                                <View style={styles.priceOfflineRow}>
                                    <Ionicons name="cloud-offline-outline" size={18} color={Colors.light.bodyText} />
                                    <TextUI variant="semibold" style={styles.priceOfflineTitle}>
                                        Sem internet
                                    </TextUI>
                                </View>
                                <TextUI variant="regular" style={styles.priceOfflineText}>
                                    Conecte-se à internet para ver o preço e aproveitar a oferta.
                                </TextUI>
                            </View>
                        )}
                    </View>
                </Animated.View>
            </View>

            <View style={[styles.fixedButtonContainer, { paddingBottom: insets.bottom + 16 }]}>
                <ButtonUI
                    title="Aproveitar Oferta"
                    onPress={() => {
                        if (!hasInternet) {
                            haptics.error();
                            Alert.alert(
                                'Sem internet',
                                'Conecte-se à internet para ver o preço e aproveitar a oferta.'
                            );
                            return;
                        }
                        haptics.medium();
                        // Adicione a ação desejada aqui
                    }}
                    variant="primary"
                    style={styles.continueButton}
                />
            </View>
        </ViewContainerUI>
    );
}

const styles = StyleSheet.create({
    backgroundGradient: {
        flex: 1,
        width: '100%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 8,
    },
    closeButton: {
        zIndex: 10,
    },
    closeButtonCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    animatedContainer: {
        width: '100%',
        alignItems: 'center',
    },
    imageContainer: {
        marginBottom: 4,
    },
    imageGradient: {
        borderRadius: 50,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 80,
        height: 80,
    },
    contentText: {
        marginTop: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4,
    },
    sparkleIcon: {
        opacity: 0.8,
    },
    title: {
        fontSize: 24,
        color: Colors.light.mainText,
        letterSpacing: -0.3,
    },
    description: {
        fontSize: 14,
        color: Colors.light.bodyText,
        textAlign: 'center',
        lineHeight: 20,
    },
    priceCardContainer: {
        width: '100%',
    },
    priceCardOffline: {
        borderRadius: 20,
        padding: 18,
        backgroundColor: Colors.light.white,
        borderWidth: 1,
        borderColor: '#EBEBEB',
    },
    priceOfflineRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    priceOfflineTitle: {
        fontSize: 14,
        color: Colors.light.mainText,
    },
    priceOfflineText: {
        fontSize: 13,
        color: Colors.light.bodyText,
        lineHeight: 18,
    },
    priceCard: {
        borderRadius: 20,
        padding: 18,
        shadowColor: Colors.light.primary,
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 12,
    },
    priceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14,
    },
    priceHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    priceCardTitle: {
        fontSize: 18,
        color: Colors.light.white,
        letterSpacing: 0.2,
    },
    badge: {
        backgroundColor: Colors.light.white,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },
    badgeText: {
        fontSize: 12,
        color: Colors.light.primary,
        letterSpacing: 0.5,
    },
    priceComparison: {
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'center',
        gap: 12,
        marginBottom: 14,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    oldPriceContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 3,
    },
    oldPrice: {
        fontSize: 18,
        color: Colors.light.white,
        textDecorationLine: 'line-through',
        opacity: 0.7,
    },
    oldPricePeriod: {
        fontSize: 13,
        color: Colors.light.white,
        opacity: 0.7,
    },
    newPriceContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 3,
    },
    newPrice: {
        fontSize: 32,
        color: Colors.light.white,
        lineHeight: 38,
    },
    newPricePeriod: {
        fontSize: 16,
        color: Colors.light.white,
        opacity: 0.9,
    },
    priceInfo: {
        gap: 10,
    },
    vitalicioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    vitalicioText: {
        fontSize: 14,
        color: Colors.light.white,
        flex: 1,
        lineHeight: 18,
    },
    priceInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    priceInfoText: {
        fontSize: 13,
        color: Colors.light.white,
        opacity: 0.95,
    },
    savingsText: {
        fontSize: 13,
        color: Colors.light.white,
    },
    fixedButtonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingTop: 16,
    },
    continueButton: {
        width: '100%',
        shadowColor: Colors.light.primary,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
});