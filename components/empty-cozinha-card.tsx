import { TextUI } from '@/components/ui/text';
import { Colors } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

type EmptyCozinhaCardProps = {
    onAddIngredients?: () => void;
};

export function EmptyCozinhaCard({ onAddIngredients }: EmptyCozinhaCardProps) {
    const handleAddIngredients = () => {
        if (onAddIngredients) {
            onAddIngredients();
        } else {
            router.push('/adicionar-item-inventario');
        }
    };

    return (
        <Pressable 
            style={styles.card}
            onPress={handleAddIngredients}
        >
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Ionicons name="restaurant-outline" size={24} color={Colors.light.primary} />
                </View>

                <View style={styles.textContainer}>
                    <TextUI variant="semibold" style={styles.title}>
                        Quer melhorar suas sugestões?
                    </TextUI>
                    <TextUI variant="regular" style={styles.description}>
                        Adicione os ingredientes que você costuma ter em casa.
                    </TextUI>
                    <TextUI variant="regular" style={styles.subDescription}>
                        O app cuida do resto.
                    </TextUI>
                </View>
            </View>

            <View style={styles.actionContainer}>
                <TextUI variant="semibold" style={styles.actionText}>
                    Adicionar ingredientes
                </TextUI>
                <Ionicons name="chevron-forward" size={18} color={Colors.light.primary} />
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.light.white,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#EBEBEB',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
        gap: 12,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.light.primary + '15',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.light.primary + '30',
    },
    textContainer: {
        flex: 1,
        gap: 4,
    },
    title: {
        fontSize: 15,
        color: Colors.light.mainText,
        marginBottom: 4,
    },
    description: {
        fontSize: 13,
        color: Colors.light.bodyText,
        lineHeight: 18,
    },
    subDescription: {
        fontSize: 12,
        color: Colors.light.bodyText,
        opacity: 0.8,
        marginTop: 2,
    },
    actionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 6,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#EBEBEB',
    },
    actionText: {
        fontSize: 13,
        color: Colors.light.primary,
    },
});

