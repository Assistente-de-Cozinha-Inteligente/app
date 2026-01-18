import { CardComoFazerReceita } from '@/components/card-como-fazer-receita';
import { CardImpactoNutricional } from '@/components/card-impacto-nutricional';
import { CardIngredienteReceita } from '@/components/card-ingrediente-receita';
import { CardPontosAtencao } from '@/components/card-pontos-atencao';
import { Badge } from '@/components/ui/badge';
import { ButtonUI } from '@/components/ui/button';
import { ScrollViewWithPadding } from '@/components/ui/scroll-view-with-padding';
import { SectionUI } from '@/components/ui/section';
import { TextUI } from '@/components/ui/text';
import { Colors } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, Pressable, Share, StyleSheet, View } from 'react-native';
import Animated, { interpolate, interpolateColor, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
export default function ReceitaDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const insets = useSafeAreaInsets();
    const [scrolledPastImage, setScrolledPastImage] = useState(false);
    const scrollAnim = useSharedValue(0);
    const userLoggedIn: number = 0; // 1 = logado/premium, 0 = não logado/gratuito

    // Dados mockados - você pode substituir por dados reais
    const receita = {
        id: id || '1',
        imageUri: 'https://www.diadepeixe.com.br/extranet/thumbnail/crop/550x360/Receita/shutterstock_2105735288_1746448515362.jpg',
        title: 'Sushi',
        time: '35 min',
        servings: '2 pessoas',
        description: 'Uma receita simples, equilibrada e fácil de preparar.',
        difficulty: 'Fácil',
        categories: ['Rápida', 'Pouco esforço', 'Vegetariano'],
        nutritional: {
            calories: 320,
            protein: 12,
            carbs: 45,
            fat: 8,
        },
        pontosAtencao: [
            { id: '1', text: 'Alto teor de gordura', isPremium: false },
            { id: '2', text: 'Alto teor de sódio', isPremium: true },
            { id: '3', text: 'Contém glúten', isPremium: true },
        ],
    };

    const handleShare = async () => {
        try {
            const appName = process.env.EXPO_PUBLIC_APP_NAME || 'Assistente Cozinha';
            const shareText = `🍳 Observe essa receita que encontrei no app ${appName}:\n\n${receita.title}\n\n${receita.description}\n\n⏱️ ${receita.time} | 👥 ${receita.servings} | 📊 ${receita.difficulty}\n\n📱 Baixe o app ${appName} para mais receitas e informações!`;

            await Share.share({
                message: shareText,
                url: receita.imageUri, // URL da imagem para Android
            });
        } catch (error: any) {
            console.error('Erro ao compartilhar:', error.message);
            Alert.alert('Erro', 'Não foi possível compartilhar a receita.');
        }
    };

    const handleSubstituirIngrediente = (ingredienteId: string) => {
        console.log('Substituir ingrediente:', ingredienteId);
        // Aqui você pode abrir um modal ou navegar para uma tela de substituição
        Alert.alert(
            'Substituir Ingrediente',
            'Funcionalidade de substituição de ingredientes em desenvolvimento.',
            [{ text: 'OK' }]
        );
    };

    // Estilos animados com react-native-reanimated
    const headerAnimatedStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                scrollAnim.value,
                [0, 1],
                ['transparent', Colors.light.white]
            ),
        };
    });

    const whiteIconAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(
                scrollAnim.value,
                [0, 1],
                [1, 0]
            ),
        };
    });

    const darkIconAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: scrollAnim.value,
        };
    });

    const titleAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: scrollAnim.value,
        };
    });

    return (
        <>
            <StatusBar style={scrolledPastImage ? 'dark' : 'light'} hidden={!scrolledPastImage} />
            <View style={styles.wrapper}>
                {/* Content Actions fixas no topo */}
                <Animated.View style={[
                    styles.contentActions,
                    scrolledPastImage && styles.contentActionsScrolled,
                    {
                        paddingTop: insets.top + 16,
                    },
                    headerAnimatedStyle
                ]}>
                    <View style={styles.contentActionsLeft}>
                        <Pressable onPress={() => router.back()}>
                            <View style={styles.iconContainer}>
                                <Animated.View style={[{ position: 'absolute' }, whiteIconAnimatedStyle]}>
                                    <Ionicons name="arrow-back" size={28} color="white" />
                                </Animated.View>
                                <Animated.View style={[{ position: 'absolute' }, darkIconAnimatedStyle]}>
                                    <Ionicons name="arrow-back" size={28} color={Colors.light.mainText} />
                                </Animated.View>
                            </View>
                        </Pressable>
                        <Animated.View
                            style={[
                                { flex: 1 },
                                titleAnimatedStyle
                            ]}
                        >
                            {scrolledPastImage && (
                                <TextUI
                                    variant="semibold"
                                    style={styles.contentActionsTitle}
                                    numberOfLines={1}
                                >
                                    {receita.title}
                                </TextUI>
                            )}
                        </Animated.View>
                    </View>
                    <View style={styles.contentActionsIcons}>
                        <Pressable>
                            <View style={styles.iconContainer}>
                                <Animated.View style={[{ position: 'absolute' }, whiteIconAnimatedStyle]}>
                                    <Ionicons name="heart-outline" size={28} color="white" />
                                </Animated.View>
                                <Animated.View style={[{ position: 'absolute' }, darkIconAnimatedStyle]}>
                                    <Ionicons name="heart-outline" size={28} color={Colors.light.mainText} />
                                </Animated.View>
                            </View>
                        </Pressable>
                        <Pressable onPress={handleShare}>
                            <View style={styles.iconContainer}>
                                <Animated.View style={[{ position: 'absolute' }, whiteIconAnimatedStyle]}>
                                    <Ionicons name="share-social-outline" size={28} color="white" />
                                </Animated.View>
                                <Animated.View style={[{ position: 'absolute' }, darkIconAnimatedStyle]}>
                                    <Ionicons name="share-social-outline" size={28} color={Colors.light.mainText} />
                                </Animated.View>
                            </View>
                        </Pressable>
                    </View>
                </Animated.View>

                <ScrollViewWithPadding
                    contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
                    onScroll={(event) => {
                        const scrollY = event.nativeEvent.contentOffset.y;
                        const threshold = 280;
                        const transitionRange = 50; // Range de transição suave

                        // Calcular valor animado baseado na posição do scroll
                        let animatedValue = 0;
                        if (scrollY > threshold - transitionRange) {
                            animatedValue = Math.min(1, (scrollY - (threshold - transitionRange)) / transitionRange);
                        }

                        // Atualizar valor animado diretamente para resposta imediata
                        scrollAnim.value = animatedValue;

                        // Atualizar estado apenas quando passar do threshold
                        const newScrolledPastImage = scrollY > threshold;
                        if (newScrolledPastImage !== scrolledPastImage) {
                            setScrolledPastImage(newScrolledPastImage);
                        }
                    }}
                    scrollEventThrottle={8}
                >
                    <View style={styles.container}>
                        {/* Container da imagem com gradiente */}
                        <View style={styles.imageContainer}>
                            <Image
                                source={{ uri: receita.imageUri }}
                                style={styles.image}
                                contentFit="cover"
                            />

                            {/* Gradiente de baixo para cima */}
                            <LinearGradient
                                colors={['rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.7)']}
                                locations={[0, 0.5, 1]}
                                style={styles.gradient}
                            />
                        </View>
                        <View style={styles.content}>
                            {/* Título */}
                            <TextUI variant="medium" style={styles.title}>{receita.title}</TextUI>
                            
                            {/* Informações básicas */}
                            <View style={styles.infoContainer}>
                                <View style={styles.infoItem}>
                                    <Ionicons name="time-outline" size={14} color={Colors.light.bodyText} />
                                    <TextUI variant="light" style={styles.infoText}>
                                        {receita.time}
                                    </TextUI>
                                </View>
                                <TextUI variant="light" style={styles.separator}>•</TextUI>
                                <View style={styles.infoItem}>
                                    <Ionicons name="people-outline" size={14} color={Colors.light.bodyText} />
                                    <TextUI variant="light" style={styles.infoText}>
                                        {receita.servings}
                                    </TextUI>
                                </View>
                                <TextUI variant="light" style={styles.separator}>•</TextUI>
                                <View style={styles.infoItem}>
                                    <Ionicons name="information-circle-outline" size={14} color={Colors.light.bodyText} />
                                    <TextUI variant="light" style={styles.infoText}>
                                        {receita.difficulty}
                                    </TextUI>
                                </View>
                            </View>

                            {/* Badges de categorias */}
                            <View style={styles.badgesContainer}>
                                {receita.categories.map((category: string, index: number) => (
                                    <Badge key={index} label={category} />
                                ))}
                            </View>

                            {/* Descrição */}
                            <TextUI variant="regular" style={styles.description}>
                                {receita.description}
                            </TextUI>

                            {/* Impacto Nutricional */}
                            <CardImpactoNutricional
                                nutritional={receita.nutritional}
                                userLoggedIn={(userLoggedIn === 1 ? 1 : 0) as 0 | 1}
                                onPremiumPress={() => console.log('Redirecionar para premium')}
                            />

                            {/* Pontos de atenção */}
                            <SectionUI title="Pontos de atenção" style={{ marginTop: 24 }}>
                                <CardPontosAtencao
                                    pontos={receita.pontosAtencao}
                                    userLoggedIn={(userLoggedIn === 1 ? 1 : 0) as 0 | 1}
                                    onPremiumPress={() => console.log('Clicou')}
                                />
                            </SectionUI>

                            <SectionUI 
                                title="Ingredientes"
                                rightButton={
                                    (() => {
                                        const ingredientes = [
                                            { id: '1', name: 'Arroz cozido (Do dia anterior)', quantity: '2 xícaras', available: true },
                                            { id: '2', name: 'Salsicha fatiada', quantity: '2 peças', available: false, canSubstitute: true },
                                            { id: '3', name: 'Cebola picada', quantity: '1 unidade', available: false, canSubstitute: false },
                                            { id: '4', name: 'Alho', quantity: '2 dentes', available: false, canSubstitute: true },
                                            { id: '5', name: 'Azeite', quantity: '2 colheres', available: false },
                                        ];
                                        const hasSubstitutable = ingredientes.some(ing => !ing.available && ing.canSubstitute);
                                        
                                        if (!hasSubstitutable) return null;
                                        
                                        return (
                                            <Pressable
                                                onPress={() => {
                                                    if (userLoggedIn === 1) {
                                                        console.log('Abrir modal de substituição');
                                                        handleSubstituirIngrediente('');
                                                    } else {
                                                        console.log('Redirecionar para premium');
                                                    }
                                                }}
                                                style={({ pressed }) => [
                                                    styles.substituirHeaderButton,
                                                    pressed && styles.substituirHeaderButtonPressed
                                                ]}
                                            >
                                                {userLoggedIn === 1 ? (
                                                    <View style={styles.substituirHeaderContent}>
                                                        <Ionicons name="swap-horizontal" size={18} color={Colors.light.primary} />
                                                        <TextUI variant="semibold" style={styles.substituirHeaderText}>
                                                            Substituir
                                                        </TextUI>
                                                    </View>
                                                ) : (
                                                    <View style={styles.substituirHeaderContent}>
                                                        <Ionicons name="lock-closed" size={16} color={Colors.light.premium} />
                                                        <TextUI variant="semibold" style={styles.substituirHeaderTextPremium}>
                                                            Substituir
                                                        </TextUI>
                                                    </View>
                                                )}
                                            </Pressable>
                                        );
                                    })()
                                }
                            >
                                <CardIngredienteReceita
                                    ingredientes={[
                                        { id: '1', name: 'Arroz cozido (Do dia anterior)', quantity: '2 xícaras', available: true },
                                        { id: '2', name: 'Salsicha fatiada', quantity: '2 peças', available: false, canSubstitute: true },
                                        { id: '3', name: 'Cebola picada', quantity: '1 unidade', available: false, canSubstitute: false },
                                        { id: '4', name: 'Alho', quantity: '2 dentes', available: false, canSubstitute: true },
                                        { id: '5', name: 'Azeite', quantity: '2 colheres', available: false },
                                    ]}
                                    onSubstituirIngrediente={handleSubstituirIngrediente}
                                    userLoggedIn={userLoggedIn}
                                />
                                <ButtonUI
                                    title="Adicionar faltantes à lista de compras"
                                    onPress={() => { }}
                                    variant="default"
                                    textStyle={styles.addToListButtonText}
                                    style={styles.addToListButton}
                                />
                            </SectionUI>
                            <SectionUI title="Como fazer">
                                <CardComoFazerReceita
                                    etapas={[
                                        {
                                            id: '1',
                                            titulo: '1. Preparação (5 minutos)',
                                            tarefas: [
                                                { id: '1-1', texto: 'Cozinhe o arroz se não estiver usando arroz que sobrou.' },
                                                { id: '1-2', texto: 'Corte as salsichas em rodelas, pique o alho, pique a cebola, corte a pimenta em rodelas e corte a cenoura em cubos.' },
                                            ],
                                        },
                                        {
                                            id: '2',
                                            titulo: '2. Cozinhando a linguiça (5 minutos)',
                                            tarefas: [
                                                { id: '2-1', texto: 'Aqueça 1 colher de sopa de óleo vegetal em uma frigideira grande ou wok em fogo médio-alto.' },
                                                { id: '2-2', texto: 'Adicione as salsichas e cozinhe até dourar, cerca de 3-4 minutos.' },
                                                { id: '2-3', texto: 'Adicione o alho e a cebola e refogue por 1 minuto até perfumar.' },
                                            ],
                                        },
                                        {
                                            id: '3',
                                            titulo: '3. Finalizando o prato (10 minutos)',
                                            tarefas: [
                                                { id: '3-1', texto: 'Adicione o arroz cozido e misture bem.' },
                                                { id: '3-2', texto: 'Tempere com molho de soja, vinagre de arroz e açúcar.' },
                                                { id: '3-3', texto: 'Finalize com gergelim torrado e cebolinha picada.' },
                                            ],
                                        },
                                    ]}
                                />
                            </SectionUI>
                        </View>
                    </View>
                </ScrollViewWithPadding>

                {/* Botão flutuante "Iniciar Receita" */}
                <View style={[styles.floatingButtonContainer, { bottom: Math.max(insets.bottom, 20), marginBottom: insets.bottom }]}>
                    <ButtonUI
                        title="Iniciar Receita"
                        onPress={() => console.log('Iniciar receita')}
                        variant="primary"
                        style={styles.floatingButton}
                    />
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: Colors.light.white,
    },
    container: {
        flex: 1,
        backgroundColor: Colors.light.white,
    },
    floatingButtonContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        zIndex: 1000,
        alignItems: 'center',
    },
    floatingButton: {
        width: '100%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    imageContainer: {
        width: '100%',
        height: 300,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
    },
    contentActions: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 16,
        zIndex: 1000,
        pointerEvents: 'box-none',
    },
    contentActionsScrolled: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    contentActionsLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },
    iconContainer: {
        position: 'relative',
        width: 28,
        height: 28,
    },
    contentActionsTitle: {
        fontSize: 18,
        color: Colors.light.mainText,
        flex: 1,
    },
    contentActionsIcons: {
        flexDirection: 'row',
        gap: 16,
    },
    content: {
        paddingHorizontal: 20,
        marginTop: 25,
    },
    title: {
        fontSize: 24,
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginTop: 12,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    infoText: {
        fontSize: 16,
        color: Colors.light.bodyText,
    },
    separator: {
        fontSize: 14,
        color: Colors.light.bodyText,
        opacity: 0.7,
    },
    description: {
        fontSize: 14,
        color: Colors.light.bodyText,
        marginTop: 12,
    },
    badgesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 16,
    },
    addToListButton: {
        paddingVertical: 10,
        minHeight: 40,
    },
    addToListButtonText: {
        fontSize: 13,
        color: Colors.light.mainText,
    },
    substituirHeaderButton: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    substituirHeaderButtonPressed: {
        opacity: 0.7,
    },
    substituirHeaderContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    substituirHeaderText: {
        fontSize: 14,
        color: Colors.light.primary,
    },
    substituirHeaderTextPremium: {
        fontSize: 14,
        color: Colors.light.premium,
    },
});

