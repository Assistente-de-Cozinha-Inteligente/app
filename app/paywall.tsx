import { ButtonUI } from '@/components/ui/button';
import { TextUI } from '@/components/ui/text';
import { ViewContainerUI } from '@/components/ui/view-container';
import { Colors } from '@/constants/theme';
import { haptics } from '@/utils/haptics';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Plano = {
    id: string;
    name: string;
    duration: string;
    price: string;
    pricePerMonth: string;
    discount?: string;
    popular?: boolean;
};

const planos: Plano[] = [
    {
        id: 'mensal',
        name: 'Mensal',
        duration: '1 mês',
        price: 'R$ 6,99',
        pricePerMonth: 'R$ 6,99/mês',
    },
    {
        id: 'trimestral',
        name: 'Trimestral',
        duration: '3 meses',
        price: 'R$ 16,99',
        pricePerMonth: 'R$ 5,66/mês',
        discount: 'Economize 19%',
        popular: true,
    },
    {
        id: 'semestral',
        name: 'Semestral',
        duration: '6 meses',
        price: 'R$ 29,99',
        pricePerMonth: 'R$ 4,99/mês',
        discount: 'Economize 29%',
    },
];

const beneficios = [
    {
        icon: 'nutrition-outline',
        title: 'Informações nutricionais completas',
        description: 'Veja carboidratos, gorduras e todos os macronutrientes',
    },
    {
        icon: 'warning-outline',
        title: 'Pontos de atenção completos',
        description: 'Acesse todos os alertas e informações importantes',
    },
    {
        icon: 'swap-horizontal-outline',
        title: 'Substituir ingredientes',
        description: 'Troque ingredientes que você não tem por alternativas',
    },
    {
        icon: 'analytics-outline',
        title: 'Análise completa no chat',
        description: 'Receba análises detalhadas e recomendações personalizadas',
    },
    {
        icon: 'sparkles-outline',
        title: 'Recomendações inteligentes',
        description: 'IA aprende seus padrões e sugere receitas ideais',
    },
    {
        icon: 'infinite-outline',
        title: 'Sem limites',
        description: 'Acesse todas as receitas e funcionalidades sem restrições',
    },
];

export default function PaywallScreen() {
    const [selectedPlano, setSelectedPlano] = useState<string>('trimestral');
    const insets = useSafeAreaInsets();

    const handleSelectPlano = (planoId: string) => {
        haptics.light();
        setSelectedPlano(planoId);
    };

    const handleAssinar = () => {
        haptics.medium();
        const plano = planos.find(p => p.id === selectedPlano);
        console.log('Assinar plano:', plano);
        // Aqui você implementaria a lógica de assinatura
        // router.push('/pagamento');
    };

    return (
        <ViewContainerUI>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="close" size={24} color={Colors.light.mainText} />
                    </Pressable>
                </View>

                {/* Título compacto */}
                <View style={styles.titleContainer}>
                    <View style={styles.badgeContainer}>
                        <Ionicons name="star" size={16} color={Colors.light.premium} />
                        <TextUI variant="bold" style={styles.badgeText}>
                            Premium
                        </TextUI>
                    </View>
                    <TextUI variant="bold" style={styles.title}>
                        Desbloqueie todo o potencial
                    </TextUI>
                </View>

                {/* Lista de Benefícios - aparece primeiro */}
                <View style={styles.beneficiosContainer}>
                    <TextUI variant="semibold" style={styles.beneficiosTitle}>
                        O que você ganha
                    </TextUI>
                    <View style={styles.beneficiosList}>
                        {beneficios.map((beneficio, index) => (
                            <View key={index} style={styles.beneficioItem}>
                                <View style={styles.beneficioIconContainer}>
                                    <Ionicons
                                        name={beneficio.icon as any}
                                        size={20}
                                        color={Colors.light.primary}
                                    />
                                </View>
                                <View style={styles.beneficioContent}>
                                    <TextUI variant="semibold" style={styles.beneficioTitle}>
                                        {beneficio.title}
                                    </TextUI>
                                    <TextUI variant="regular" style={styles.beneficioDescription}>
                                        {beneficio.description}
                                    </TextUI>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Planos - aparecem depois */}
                <View style={styles.planosContainer}>
                    <TextUI variant="semibold" style={styles.planosTitle}>
                        Escolha seu plano
                    </TextUI>
                    <View style={styles.planosGrid}>
                        {planos.map((plano) => (
                            <Pressable
                                key={plano.id}
                                onPress={() => handleSelectPlano(plano.id)}
                                style={[
                                    styles.planoCard,
                                    selectedPlano === plano.id && styles.planoCardSelected,
                                    plano.popular && styles.planoCardPopular,
                                ]}
                            >
                                {plano.popular && (
                                    <View style={styles.popularBadge}>
                                        <TextUI variant="bold" style={styles.popularBadgeText}>
                                            Popular
                                        </TextUI>
                                    </View>
                                )}
                                <View style={styles.planoHeader}>
                                    <TextUI variant="bold" style={styles.planoName}>
                                        {plano.name}
                                    </TextUI>
                                </View>
                                {plano.discount && (
                                    <View style={styles.discountBadge}>
                                        <TextUI variant="bold" style={styles.discountText}>
                                            {plano.discount}
                                        </TextUI>
                                    </View>
                                )}
                                <TextUI variant="regular" style={styles.planoDuration}>
                                    {plano.duration}
                                </TextUI>
                                <View style={styles.planoPriceContainer}>
                                    <TextUI variant="bold" style={styles.planoPrice}>
                                        {plano.price}
                                    </TextUI>
                                    <TextUI variant="regular" style={styles.planoPricePerMonth}>
                                        {plano.pricePerMonth}
                                    </TextUI>
                                </View>
                                {selectedPlano === plano.id && (
                                    <View style={styles.selectedIndicator}>
                                        <Ionicons name="checkmark-circle" size={20} color={Colors.light.primary} />
                                    </View>
                                )}
                            </Pressable>
                        ))}
                    </View>
                </View>
            </View>

            {/* Botão de assinar fixo */}
            <View style={[styles.fixedButtonContainer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
                <ButtonUI
                    title="Assinar Premium"
                    onPress={handleAssinar}
                    variant="primary"
                    style={styles.assinarButton}
                />
                <TextUI variant="light" style={styles.termsText}>
                    Ao assinar, você concorda com nossos Termos de Uso e Política de Privacidade
                </TextUI>
            </View>
        </ViewContainerUI>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 8,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingTop: 8,
        paddingBottom: 4,
    },
    backButton: {
        padding: 4,
    },
    titleContainer: {
        alignItems: 'center',
        marginTop: 4,
        marginBottom: 12,
    },
    badgeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: Colors.light.premium + '15',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 16,
        marginBottom: 8,
    },
    badgeText: {
        fontSize: 11,
        color: Colors.light.premium,
        letterSpacing: 0.5,
    },
    title: {
        fontSize: 22,
        color: Colors.light.mainText,
        textAlign: 'center',
    },
    planosContainer: {
        marginBottom: 8,
    },
    planosTitle: {
        fontSize: 16,
        color: Colors.light.mainText,
        marginBottom: 12,
    },
    planosGrid: {
        flexDirection: 'row',
        gap: 8,
    },
    planoCard: {
        flex: 1,
        backgroundColor: Colors.light.white,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#EBEBEB',
        padding: 12,
        position: 'relative',
        minHeight: 140,
    },
    planoCardSelected: {
        borderColor: Colors.light.primary,
        backgroundColor: Colors.light.primary + '05',
    },
    planoCardPopular: {
        borderColor: Colors.light.premium + '50',
    },
    popularBadge: {
        position: 'absolute',
        top: -8,
        right: 8,
        backgroundColor: Colors.light.premium,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
    },
    popularBadgeText: {
        fontSize: 9,
        color: Colors.light.white,
        letterSpacing: 0.3,
    },
    planoHeader: {
        marginBottom: 6,
        marginTop: 4,
    },
    planoName: {
        fontSize: 15,
        color: Colors.light.mainText,
    },
    discountBadge: {
        backgroundColor: Colors.light.success + '20',
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 6,
        alignSelf: 'flex-start',
        marginBottom: 6,
    },
    discountText: {
        fontSize: 9,
        color: Colors.light.success,
    },
    planoDuration: {
        fontSize: 11,
        color: Colors.light.bodyText,
        marginBottom: 8,
    },
    planoPriceContainer: {
        marginTop: 4,
    },
    planoPrice: {
        fontSize: 18,
        color: Colors.light.mainText,
        marginBottom: 2,
    },
    planoPricePerMonth: {
        fontSize: 11,
        color: Colors.light.bodyText,
    },
    selectedIndicator: {
        position: 'absolute',
        top: 8,
        right: 8,
    },
    beneficiosContainer: {
        marginBottom: 16,
    },
    beneficiosTitle: {
        fontSize: 15,
        color: Colors.light.mainText,
        marginBottom: 10,
    },
    beneficiosList: {
        gap: 8,
    },
    beneficioItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
    },
    beneficioIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 8,
        backgroundColor: Colors.light.primary + '15',
        alignItems: 'center',
        justifyContent: 'center',
    },
    beneficioContent: {
        flex: 1,
    },
    beneficioTitle: {
        fontSize: 13,
        color: Colors.light.mainText,
        marginBottom: 2,
    },
    beneficioDescription: {
        fontSize: 11,
        color: Colors.light.bodyText,
        lineHeight: 15,
    },
    fixedButtonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingTop: 16,
        backgroundColor: Colors.light.white,
        borderTopWidth: 1,
        borderTopColor: '#EBEBEB',
    },
    assinarButton: {
        width: '100%',
        marginBottom: 12,
    },
    termsText: {
        fontSize: 11,
        color: Colors.light.bodyText,
        textAlign: 'center',
        lineHeight: 16,
    },
});

