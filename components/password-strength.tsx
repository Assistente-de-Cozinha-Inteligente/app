import { Colors } from '@/constants/theme';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { TextUI } from './ui/text';

type PasswordStrength = 'weak' | 'medium' | 'strong';

type PasswordStrengthProps = {
    password: string;
};

function calculatePasswordStrength(password: string): PasswordStrength {
    if (!password || password.length === 0) {
        return 'weak';
    }

    let strength = 0;

    // Comprimento
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;

    // Tipos de caracteres
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1;

    if (strength <= 2) return 'weak';
    if (strength <= 4) return 'medium';
    return 'strong';
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
    const strength = calculatePasswordStrength(password);
    const progressAnim = useRef(new Animated.Value(0)).current;

    const strengthConfig = {
        weak: {
            progress: 0.2,
            color: "#E23D24",
            label: 'Fraca',
            emoji: '😔',
            description: 'Sua senha é fraca!',
        },
        medium: {
            progress: 0.6,
            color: "#D4BF00",
            label: 'Média',
            emoji: '😮',
            description: 'Sua senha é ótima, mas você pode melhorar.',
        },
        strong: {
            progress: 0.95,
            color: "#22A45D",
            label: 'Forte',
            emoji: '😎',
            description: 'Sua senha é forte, bom trabalho!',
        },
    };

    const config = strengthConfig[strength];

    useEffect(() => {
        Animated.timing(progressAnim, {
            toValue: config.progress,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [config.progress, progressAnim]);

    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <TextUI variant="bold" style={styles.title}>
                    Senha Forte
                </TextUI>
                <TextUI
                    variant="semibold"
                    style={[styles.label, { color: config.color }]}
                >
                    {config.label} {config.emoji}
                </TextUI>
            </View>

            <View style={styles.progressContainer}>
                <View style={styles.progressBarBackground}>
                    <Animated.View
                        style={[
                            styles.progressBarFill,
                            {
                                width: progressWidth,
                                backgroundColor: config.color,
                            },
                        ]}
                    />
                </View>
            </View>

            <TextUI variant="regular" style={styles.description}>
                {config.description}
            </TextUI>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 8,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 16,
        color: Colors.light.mainText,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    progressBarBackground: {
        flex: 1,
        height: 8,
        backgroundColor: '#F6F8FC',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    label: {
        fontSize: 14,
    },
    description: {
        fontSize: 14,
        color: Colors.light.bodyText,
    },
});

