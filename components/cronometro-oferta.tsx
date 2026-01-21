import { TextUI } from '@/components/ui/text';
import { Colors } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Network from 'expo-network';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

type CronometroOfertaProps = {
    variant?: 'full' | 'compact';
    onPress?: () => void;
};

export function CronometroOferta({ variant = 'full', onPress }: CronometroOfertaProps) {
    const [timeRemaining, setTimeRemaining] = useState({
        hours: 23,
        minutes: 59,
        seconds: 59,
    });
    const [hasInternet, setHasInternet] = useState(true);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
        
        // Verifica a cada 5 segundos
        const networkInterval = setInterval(checkNetwork, 5000);

        return () => {
            clearInterval(networkInterval);
        };
    }, []);

    useEffect(() => {
        // Inicia o cronômetro regressivo
        intervalRef.current = setInterval(() => {
            setTimeRemaining((prev) => {
                let { hours, minutes, seconds } = prev;

                if (seconds > 0) {
                    seconds--;
                } else if (minutes > 0) {
                    minutes--;
                    seconds = 59;
                } else if (hours > 0) {
                    hours--;
                    minutes = 59;
                    seconds = 59;
                } else {
                    // Tempo esgotado
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                    }
                }

                return { hours, minutes, seconds };
            });
        }, 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    const formatTime = (value: number) => {
        return value.toString().padStart(2, '0');
    };

    const handlePress = () => {
        if (onPress) {
            onPress();
        } else {
            router.push('/oferta-limitada');
        }
    };

    if (variant === 'compact') {
        return (
            <Pressable onPress={handlePress} style={styles.compactContainer}>
                <View style={styles.compactCard}>
                    <View style={styles.compactContent}>
                        <View style={styles.compactTopSection}>
                            <View style={styles.compactTitleSection}>
                                <TextUI variant="bold" style={styles.compactCardTitle}>
                                    Oferta Limitada
                                </TextUI>
                                <View style={styles.compactBadge}>
                                    <TextUI variant="bold" style={styles.compactBadgeText}>
                                        EXCLUSIVA
                                    </TextUI>
                                </View>
                            </View>
                            <View style={styles.compactHeader}>
                                <Ionicons name="time-outline" size={14} color={Colors.light.bodyText} />
                                <TextUI variant="regular" style={styles.compactTitle}>
                                    Expira em
                                </TextUI>
                            </View>
                        </View>
                        
                        <View style={styles.compactTimeDisplay}>
                            <View style={styles.compactTimeUnit}>
                                <View style={styles.compactTimeBox}>
                                    <TextUI variant="bold" style={styles.compactTimeValue}>
                                        {formatTime(timeRemaining.hours)}
                                    </TextUI>
                                </View>
                                <TextUI variant="regular" style={styles.compactTimeLabel}>
                                    Horas
                                </TextUI>
                            </View>
                            <TextUI variant="bold" style={styles.compactTimeSeparator}>:</TextUI>
                            <View style={styles.compactTimeUnit}>
                                <View style={styles.compactTimeBox}>
                                    <TextUI variant="bold" style={styles.compactTimeValue}>
                                        {formatTime(timeRemaining.minutes)}
                                    </TextUI>
                                </View>
                                <TextUI variant="regular" style={styles.compactTimeLabel}>
                                    Min
                                </TextUI>
                            </View>
                            <TextUI variant="bold" style={styles.compactTimeSeparator}>:</TextUI>
                            <View style={styles.compactTimeUnit}>
                                <View style={styles.compactTimeBox}>
                                    <TextUI variant="bold" style={styles.compactTimeValue}>
                                        {formatTime(timeRemaining.seconds)}
                                    </TextUI>
                                </View>
                                <TextUI variant="regular" style={styles.compactTimeLabel}>
                                    Seg
                                </TextUI>
                            </View>
                        </View>
                        
                        {hasInternet ? (
                            <View style={styles.compactPriceContainer}>
                                <View style={styles.compactPriceSection}>
                                    <View style={styles.compactPriceRow}>
                                        <TextUI variant="regular" style={styles.compactOldPrice}>
                                            R$ 12,90
                                        </TextUI>
                                        <TextUI variant="bold" style={styles.compactNewPrice}>
                                            R$ 8,90
                                        </TextUI>
                                        <TextUI variant="regular" style={styles.compactPricePeriod}>
                                            /mês
                                        </TextUI>
                                    </View>
                                    <TextUI variant="regular" style={styles.compactPriceSubtext}>
                                        Desconto vitalício enquanto mantiver assinatura
                                    </TextUI>
                                </View>
                                <Ionicons name="chevron-forward-outline" size={20} color={Colors.light.primary} />
                            </View>
                        ) : (
                            <View style={styles.compactPriceContainer}>
                                <View style={styles.compactPriceSection}>
                                    <View style={styles.compactOfflineContainer}>
                                        <Ionicons name="cloud-offline-outline" size={18} color={Colors.light.bodyText} />
                                        <TextUI variant="regular" style={styles.compactOfflineText}>
                                            Conecte-se à internet para ver o preço
                                        </TextUI>
                                    </View>
                                </View>
                                <Ionicons name="chevron-forward-outline" size={20} color={Colors.light.primary} />
                            </View>
                        )}
                    </View>
                </View>
            </Pressable>
        );
    }

    // Variant 'full'
    return (
        <View style={styles.timerCard}>
            <LinearGradient
                colors={[Colors.light.primary + '15', Colors.light.primary + '08']}
                style={styles.timerGradient}
            >
                <View style={styles.timerHeader}>
                    <Ionicons name="time-outline" size={16} color={Colors.light.primary} />
                    <TextUI variant="semibold" style={styles.timerTitle}>
                        Oferta expira em
                    </TextUI>
                </View>
                <View style={styles.timeDisplay}>
                    <View style={styles.timeUnit}>
                        <View style={styles.timeBox}>
                            <TextUI variant="bold" style={styles.timeValue}>
                                {formatTime(timeRemaining.hours)}
                            </TextUI>
                        </View>
                        <TextUI variant="regular" style={styles.timeLabel}>
                            Horas
                        </TextUI>
                    </View>
                    <TextUI variant="bold" style={styles.timeSeparator}>:</TextUI>
                    <View style={styles.timeUnit}>
                        <View style={styles.timeBox}>
                            <TextUI variant="bold" style={styles.timeValue}>
                                {formatTime(timeRemaining.minutes)}
                            </TextUI>
                        </View>
                        <TextUI variant="regular" style={styles.timeLabel}>
                            Minutos
                        </TextUI>
                    </View>
                    <TextUI variant="bold" style={styles.timeSeparator}>:</TextUI>
                    <View style={styles.timeUnit}>
                        <View style={styles.timeBox}>
                            <TextUI variant="bold" style={styles.timeValue}>
                                {formatTime(timeRemaining.seconds)}
                            </TextUI>
                        </View>
                        <TextUI variant="regular" style={styles.timeLabel}>
                            Segundos
                        </TextUI>
                    </View>
                </View>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    // Full variant styles
    timerCard: {
        width: '100%',
        marginBottom: 16,
        borderRadius: 20,
        overflow: 'hidden',
    },
    timerGradient: {
        padding: 16,
        borderRadius: 20,
    },
    timerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        marginBottom: 12,
    },
    timerTitle: {
        fontSize: 12,
        color: Colors.light.primary,
        letterSpacing: 0.3,
    },
    timeDisplay: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    timeUnit: {
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 58,
    },
    timeBox: {
        backgroundColor: Colors.light.white,
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 14,
        minWidth: 58,
        alignItems: 'center',
        shadowColor: Colors.light.primary,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    timeValue: {
        fontSize: 28,
        color: Colors.light.primary,
        lineHeight: 34,
    },
    timeLabel: {
        fontSize: 11,
        color: Colors.light.bodyText,
        marginTop: 5,
        fontWeight: '500',
    },
    timeSeparator: {
        fontSize: 24,
        color: Colors.light.primary,
        marginBottom: 10,
        opacity: 0.6,
    },
    // Compact variant styles
    compactContainer: {
        width: '100%',
    },
    compactCard: {
        borderRadius: 16,
        borderWidth: 2,
        borderColor: Colors.light.primary + '30',
        backgroundColor: Colors.light.white,
        shadowColor: Colors.light.primary,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    compactContent: {
        paddingHorizontal: 18,
        paddingVertical: 18,
    },
    compactTopSection: {
        marginBottom: 16,
    },
    compactTitleSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    compactCardTitle: {
        fontSize: 18,
        color: Colors.light.mainText,
    },
    compactBadge: {
        backgroundColor: Colors.light.primary,
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 8,
        shadowColor: Colors.light.primary,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    compactBadgeText: {
        fontSize: 12,
        color: Colors.light.white,
        letterSpacing: 0.3,
    },
    compactHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    compactTitle: {
        fontSize: 12,
        color: Colors.light.bodyText,
    },
    compactTimeDisplay: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
        paddingHorizontal: 8,
    },
    compactTimeUnit: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    compactTimeBox: {
        backgroundColor: Colors.light.primary + '08',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
        width: '100%',
        alignItems: 'center',
        minHeight: 56,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.light.primary + '20',
    },
    compactTimeValue: {
        fontSize: 24,
        color: Colors.light.primary,
        lineHeight: 28,
    },
    compactTimeLabel: {
        fontSize: 11,
        color: Colors.light.bodyText,
        marginTop: 6,
        fontWeight: '500',
    },
    compactTimeSeparator: {
        fontSize: 20,
        color: Colors.light.bodyText,
        marginBottom: 20,
        opacity: 0.4,
    },
    compactPriceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#EBEBEB',
    },
    compactPriceSection: {
        flex: 1,
    },
    compactPriceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 6,
        marginBottom: 4,
    },
    compactOldPrice: {
        fontSize: 14,
        color: Colors.light.bodyText,
        textDecorationLine: 'line-through',
        opacity: 0.6,
    },
    compactNewPrice: {
        fontSize: 22,
        color: Colors.light.primary,
        lineHeight: 26,
    },
    compactPricePeriod: {
        fontSize: 14,
        color: Colors.light.primary,
        opacity: 0.8,
    },
    compactPriceSubtext: {
        fontSize: 12,
        color: Colors.light.bodyText,
    },
    compactOfflineContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    compactOfflineText: {
        fontSize: 12,
        color: Colors.light.bodyText,
        flex: 1,
    },
});

