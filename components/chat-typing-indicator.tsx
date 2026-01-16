import { Colors } from '@/constants/theme';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

export function ChatTypingIndicator() {
    const dot1 = useRef(new Animated.Value(0)).current;
    const dot2 = useRef(new Animated.Value(0)).current;
    const dot3 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animateDot = (dot: Animated.Value, delay: number) => {
            return Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(dot, {
                        toValue: 1,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                    Animated.timing(dot, {
                        toValue: 0,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                ])
            );
        };

        const animations = [
            animateDot(dot1, 0),
            animateDot(dot2, 200),
            animateDot(dot3, 400),
        ];

        animations.forEach((anim) => anim.start());

        return () => {
            animations.forEach((anim) => anim.stop());
        };
    }, []);

    const dot1Opacity = dot1.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 1],
    });

    const dot2Opacity = dot2.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 1],
    });

    const dot3Opacity = dot3.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 1],
    });

    return (
        <View style={styles.container}>
            <View style={styles.bubble}>
                <Animated.View style={[styles.dot, { opacity: dot1Opacity }]} />
                <Animated.View style={[styles.dot, { opacity: dot2Opacity }]} />
                <Animated.View style={[styles.dot, { opacity: dot3Opacity }]} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
        width: '100%',
        alignItems: 'flex-start',
    },
    bubble: {
        backgroundColor: Colors.light.primary,
        borderRadius: 16,
        borderTopLeftRadius: 4,
        padding: 12,
        flexDirection: 'row',
        gap: 6,
        alignItems: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.light.white,
    },
});

