import { Colors } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { TextUI } from './ui/text';

type BottomSheetInfoCozinhaProps = {
    visible: boolean;
    onClose: () => void;
};

export function BottomSheetInfoCozinha({
    visible,
    onClose,
}: BottomSheetInfoCozinhaProps) {
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    const snapPoints = useMemo(() => ['93%'], []);

    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
                opacity={0.5}
            />
        ),
        []
    );

    useEffect(() => {
        if (visible) {
            bottomSheetRef.current?.present();
        } else {
            bottomSheetRef.current?.dismiss();
        }
    }, [visible]);

    return (
        <BottomSheetModal
            ref={bottomSheetRef}
            snapPoints={snapPoints}
            enablePanDownToClose
            onDismiss={onClose}
            backgroundStyle={styles.bottomSheetBackground}
            handleIndicatorStyle={styles.handleIndicator}
            enableDynamicSizing={false}
            backdropComponent={renderBackdrop}
        >
            <BottomSheetView style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="information-circle" size={28} color={Colors.light.primary} />
                        </View>
                        <TextUI variant="semibold" style={styles.title}>
                            Como funciona?
                        </TextUI>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            bottomSheetRef.current?.dismiss();
                            onClose();
                        }}
                        style={styles.closeButton}
                    >
                        <Ionicons name="close" size={24} color={Colors.light.mainText} />
                    </TouchableOpacity>
                </View>

                {/* Conteúdo */}
                <BottomSheetScrollView
                    style={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.contentContainer}>
                        {/* Pergunta */}
                        <View style={styles.questionSection}>
                            <TextUI variant="semibold" style={styles.question}>
                                Ué, como o app sabe a quantidade que eu tenho?
                            </TextUI>
                        </View>

                        {/* Resposta principal */}
                        <View style={styles.answerSection}>
                            <View style={styles.emojiContainer}>
                                <TextUI variant="regular" style={styles.emoji}>😊</TextUI>
                            </View>
                            <TextUI variant="semibold" style={styles.relaxa}>
                                Relaxa
                            </TextUI>
                            <TextUI variant="regular" style={styles.answerText}>
                                O app não tenta controlar sua despensa como um estoque exato.
                            </TextUI>
                        </View>

                        {/* Explicação detalhada */}
                        <View style={styles.explanationSection}>
                            <View style={styles.bulletPoint}>
                                <View style={styles.bulletIcon}>
                                    <Ionicons name="bulb-outline" size={20} color={Colors.light.primary} />
                                </View>
                                <View style={styles.bulletContent}>
                                    <TextUI variant="semibold" style={styles.bulletTitle}>
                                        Estimativas inteligentes
                                    </TextUI>
                                    <TextUI variant="regular" style={styles.bulletText}>
                                        O app trabalha com estimativas baseadas no que você adiciona e no que costuma usar
                                    </TextUI>
                                </View>
                            </View>

                            <View style={styles.bulletPoint}>
                                <View style={styles.bulletIcon}>
                                    <Ionicons name="checkmark-circle-outline" size={20} color={Colors.light.primary} />
                                </View>
                                <View style={styles.bulletContent}>
                                    <TextUI variant="semibold" style={styles.bulletTitle}>
                                        Sem complicação
                                    </TextUI>
                                    <TextUI variant="regular" style={styles.bulletText}>
                                        Você não precisa dizer que tem 2,5kg de arroz e 2,4123g de alho 😄 O sistema é para ser ágil e rápido!
                                    </TextUI>
                                </View>
                            </View>

                            <View style={styles.bulletPoint}>
                                <View style={styles.bulletIcon}>
                                    <Ionicons name="notifications-outline" size={20} color={Colors.light.primary} />
                                </View>
                                <View style={styles.bulletContent}>
                                    <TextUI variant="semibold" style={styles.bulletTitle}>
                                        Avisos inteligentes
                                    </TextUI>
                                    <TextUI variant="regular" style={styles.bulletText}>
                                        Se algo talvez faltar, o app avisa antes e sugere adicionar à lista de compras
                                    </TextUI>
                                </View>
                            </View>
                        </View>

                        {/* Conclusão */}
                        <View style={styles.conclusionSection}>
                            <TextUI variant="regular" style={styles.conclusionText}>
                                Assim, o app decide de forma inteligente se uma receita faz sentido agora, sem você precisar gerenciar cada detalhe.
                            </TextUI>
                        </View>
                    </View>
                </BottomSheetScrollView>
            </BottomSheetView>
        </BottomSheetModal>
    );
}

const styles = StyleSheet.create({
    bottomSheetBackground: {
        backgroundColor: Colors.light.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    handleIndicator: {
        backgroundColor: Colors.light.bodyText,
        width: 40,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.input,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.light.primary + '15',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 22,
        color: Colors.light.mainText,
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContent: {
        flex: 1,
    },
    contentContainer: {
        paddingBottom: 20,
    },
    questionSection: {
        marginBottom: 24,
    },
    question: {
        fontSize: 20,
        color: Colors.light.mainText,
        lineHeight: 28,
    },
    answerSection: {
        marginBottom: 24,
        padding: 16,
        backgroundColor: Colors.light.primary + '08',
        borderRadius: 12,
        alignItems: 'center',
    },
    emojiContainer: {
        marginBottom: 8,
    },
    emoji: {
        fontSize: 32,
    },
    relaxa: {
        fontSize: 20,
        color: Colors.light.primary,
        marginBottom: 8,
    },
    answerText: {
        fontSize: 16,
        color: Colors.light.mainText,
        lineHeight: 24,
        textAlign: 'center',
    },
    explanationSection: {
        marginBottom: 24,
        gap: 20,
    },
    bulletPoint: {
        flexDirection: 'row',
        gap: 16,
        alignItems: 'flex-start',
    },
    bulletIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.light.primary + '15',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2,
    },
    bulletContent: {
        flex: 1,
    },
    bulletTitle: {
        fontSize: 16,
        color: Colors.light.mainText,
        marginBottom: 6,
    },
    bulletText: {
        fontSize: 14,
        color: Colors.light.bodyText,
        lineHeight: 20,
    },
    conclusionSection: {
        marginTop: 8,
        padding: 16,
        backgroundColor: Colors.light.input,
        borderRadius: 12,
    },
    conclusionText: {
        fontSize: 14,
        color: Colors.light.bodyText,
        lineHeight: 22,
        textAlign: 'center',
    },
});

