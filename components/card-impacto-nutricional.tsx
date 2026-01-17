import { TextUI } from '@/components/ui/text';
import { Colors } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';

type NutritionalData = {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
};

type CardImpactoNutricionalProps = {
    nutritional: NutritionalData;
    userLoggedIn: 0 | 1; // 1 = logado/premium, 0 = não logado/gratuito
    onPremiumPress?: () => void;
};

export function CardImpactoNutricional({
    nutritional,
    userLoggedIn,
    onPremiumPress,
}: CardImpactoNutricionalProps) {
    const isPremium = userLoggedIn === 1;

    return (
        <View style={styles.container}>
            {/* Calorias - sempre visível */}
            <View style={styles.nutritionalItem}>
                <Ionicons name="flame-outline" size={20} color={Colors.light.warning} />
                <TextUI variant="light" style={styles.label}>Calorias</TextUI>
                <TextUI variant="bold" style={styles.value}>
                    {nutritional.calories} kcal
                </TextUI>
            </View>

            {/* Proteína - sempre visível */}
            <View style={styles.nutritionalItem}>
                <Ionicons name="body-outline" size={20} color={Colors.light.primary} />
                <TextUI variant="light" style={styles.label}>Proteína</TextUI>
                <TextUI variant="bold" style={styles.value}>
                    {nutritional.protein}g
                </TextUI>
            </View>

            {/* Carboidratos - premium */}
            {isPremium ? (
                <View style={styles.nutritionalItem}>
                    <Ionicons name="nutrition-outline" size={20} color="#FF9800" />
                    <TextUI variant="light" style={styles.label}>Carboidratos</TextUI>
                    <TextUI variant="bold" style={styles.value}>
                        {nutritional.carbs}g
                    </TextUI>
                </View>
            ) : (
                <Pressable
                    onPress={() => onPremiumPress?.()}
                    style={styles.nutritionalItem}
                >
                    <Ionicons name="nutrition-outline" size={20} color="#FF9800" />
                    <TextUI variant="light" style={styles.label}>Carboidratos</TextUI>
                    <Ionicons name="lock-closed" size={16} color={Colors.light.premium} />
                </Pressable>
            )}

            {/* Gorduras - premium */}
            {isPremium ? (
                <View style={styles.nutritionalItem}>
                    <Ionicons name="water-outline" size={20} color="#FFC107" />
                    <TextUI variant="light" style={styles.label}>Gorduras</TextUI>
                    <TextUI variant="bold" style={styles.value}>
                        {nutritional.fat}g
                    </TextUI>
                </View>
            ) : (
                <Pressable
                    onPress={() => onPremiumPress?.()}
                    style={styles.nutritionalItem}
                >
                    <Ionicons name="water-outline" size={20} color="#FFC107" />
                    <TextUI variant="light" style={styles.label}>Gorduras</TextUI>
                    <Ionicons name="lock-closed" size={16} color={Colors.light.premium} />
                </Pressable>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginTop: 16,
    },
    nutritionalItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: Colors.light.input,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 10,
        flex: 1,
        minWidth: '45%',
    },
    label: {
        fontSize: 13,
        color: Colors.light.bodyText,
        flex: 1,
    },
    value: {
        fontSize: 14,
        color: Colors.light.mainText,
    },
});

