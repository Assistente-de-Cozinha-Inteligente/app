import { ChatMessage } from '@/components/chat-message';
import { ChatTypingIndicator } from '@/components/chat-typing-indicator';
import { ReceitaSliderCompacto } from '@/components/receita-slider-compacto';
import { ButtonUI } from '@/components/ui/button';
import { InputUI } from '@/components/ui/input';
import { TextUI } from '@/components/ui/text';
import { ViewContainerUI } from '@/components/ui/view-container';
import { Colors } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Message = {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    senderName?: string;
    isTyping?: boolean;
    recipes?: Array<{
        id: string;
        imageUri: string;
        category: string;
        title: string;
        time: string;
        servings: string;
        status?: string;
    }>;
};

export default function ChatScreen() {
    const [message, setMessage] = useState('');
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isAiTyping, setIsAiTyping] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);
    const insets = useSafeAreaInsets();

    useEffect(() => {
        const keyboardWillShow = Keyboard.addListener(
            Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow',
            () => setIsKeyboardVisible(true)
        );
        const keyboardWillHide = Keyboard.addListener(
            Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide',
            () => setIsKeyboardVisible(false)
        );

        return () => {
            keyboardWillShow.remove();
            keyboardWillHide.remove();
        };
    }, []);

    const examples = [
        'O que posso fazer agora?',
        'Algo que não dê muito trabalho',
        'Tenho ovo, tomate e queijo',
    ];

    const handleSend = () => {
        if (message.trim() && !isProcessing) {
            setIsProcessing(true);

            const userMessage: Message = {
                id: Date.now().toString(),
                text: message.trim(),
                sender: 'user',
            };

            // Adiciona mensagem do usuário
            setMessages((prev) => [...prev, userMessage]);

            // Scroll para o final após adicionar mensagem do usuário
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 100);

            const messageText = message.trim();
            setMessage('');

            // Mostra indicador de "digitando..." após 500ms
            setTimeout(() => {
                setIsAiTyping(true);
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 500);

            // Simula resposta da IA após delay maior (tempo de "digitando")
            setTimeout(() => {
                const aiMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    text: 'Com o que você tem, eu recomendo isso:',
                    sender: 'ai',
                    senderName: `IA ${process.env.EXPO_PUBLIC_APP_NAME || 'Assistente Cozinha'}`,
                    isTyping: true, // Inicia com animação de escrita
                    recipes: [
                        {
                            id: '1',
                            imageUri: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
                            category: 'Japonesa',
                            title: 'Beef Ramen',
                            time: '30 min',
                            servings: '2 porções',
                            status: 'Pode fazer',
                        },
                        {
                            id: '2',
                            imageUri: 'https://images.unsplash.com/photo-1555939594-58d7cb561b1e?w=400',
                            category: 'Indiana',
                            title: 'Curry Salmon',
                            time: '25 min',
                            servings: '2 porções',
                            status: 'Pode fazer',
                        },
                        {
                            id: '3',
                            imageUri: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400',
                            category: 'Café da Manhã',
                            title: 'Cereal com Frutas',
                            time: '10 min',
                            servings: '1 porção',
                            status: 'Pode fazer',
                        },
                    ],
                };
                setIsAiTyping(false);
                setMessages((prev) => [...prev, aiMessage]);

                // Scroll para o final após adicionar mensagem
                setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({ animated: true });
                }, 100);

                // Para a animação de escrita após o tempo necessário para escrever toda a mensagem
                const typingDuration = aiMessage.text.length * 60; // 60ms por letra (mais lenta)
                setTimeout(() => {
                    setMessages((prev) =>
                        prev.map((msg) =>
                            msg.id === aiMessage.id ? { ...msg, isTyping: false } : msg
                        )
                    );
                    // Libera os botões após terminar de escrever
                    setIsProcessing(false);
                }, typingDuration);
            }, 1500); // 2 segundos de "digitando..."
        }
    };

    const handleExamplePress = (example: string) => {
        setMessage(example);
    };

    return (
        <ViewContainerUI>
            <View style={styles.container}>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'android' ? 'padding' : 'padding'}
                    style={styles.container}
                    keyboardVerticalOffset={0}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Pressable onPress={() => router.back()} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color={Colors.light.mainText} />
                        </Pressable>
                        <View style={styles.aiButtonContainer}>
                            <ButtonUI
                                title={`AI ${process.env.EXPO_PUBLIC_APP_NAME || 'Assistente Cozinha'}`}
                                onPress={() => { }}
                                variant="primary"
                                style={styles.aiButton}
                                textStyle={styles.aiButtonText}
                            />
                        </View>
                        <View style={styles.placeholder} />
                    </View>

                    <ScrollView
                        ref={scrollViewRef}
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                        keyboardShouldPersistTaps="handled"
                    >
                        {messages.length === 0 ? (
                            <>
                                {/* Saudação */}
                                <View style={styles.greetingContainer}>
                                    <TextUI variant="medium" style={styles.greetingText}>
                                        Como posso te ajudar hoje, Guilherme?
                                    </TextUI>
                                </View>

                                {/* Seção de Exemplos */}
                                <View style={styles.examplesSection}>
                                    <View style={styles.examplesHeader}>
                                        <Ionicons name="sunny-outline" size={20} color={Colors.light.bodyText} />
                                        <TextUI variant="semibold" style={styles.examplesTitle}>
                                            Exemplos
                                        </TextUI>
                                    </View>
                                    <View style={styles.examplesContainer}>
                                        {examples.map((example, index) => (
                                            <TouchableOpacity
                                                key={index}
                                                onPress={() => handleExamplePress(example)}
                                                style={styles.exampleButton}
                                                activeOpacity={0.7}
                                            >
                                                <TextUI variant="regular" style={styles.exampleText}>
                                                    {example}
                                                </TextUI>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            </>
                        ) : (
                            <View style={styles.messagesContainer}>
                                {messages.map((msg) => (
                                    <View key={msg.id}>
                                        <ChatMessage
                                            message={msg.text}
                                            sender={msg.sender}
                                            senderName={msg.senderName}
                                            isTyping={msg.isTyping}
                                        />
                                        {msg.recipes && msg.recipes.length > 0 && !msg.isTyping && (
                                            <View style={styles.recipesContainer}>
                                                <View style={styles.recipesSliderWrapper}>
                                                    <ReceitaSliderCompacto
                                                        receitas={msg.recipes.map((recipe) => ({
                                                            imageUri: recipe.imageUri,
                                                            category: recipe.category,
                                                            title: recipe.title,
                                                            time: recipe.time,
                                                            servings: recipe.servings,
                                                            status: recipe.status,
                                                            onPress: () => router.push(`/receita/${recipe.id}`),
                                                        }))}
                                                    />
                                                </View>
                                            </View>
                                        )}
                                    </View>
                                ))}
                                {isAiTyping && <ChatTypingIndicator />}
                            </View>
                        )}
                    </ScrollView>

                    {/* Input Field */}
                    <View style={[
                        styles.inputWrapper,
                        {
                            paddingTop: isKeyboardVisible
                                ? 16
                                : 16,
                            paddingBottom: isKeyboardVisible
                                ? 16 + Math.max(insets.bottom, 20)
                                : 16
                        }
                    ]}>
                        <InputUI
                            placeholder="Digite algo..."
                            value={message}
                            onChangeText={setMessage}
                            borderColor={null}
                            containerStyle={styles.input}
                        />
                        <View style={styles.inputActions}>
                            {/* 
                            <TouchableOpacity
                                onPress={() => console.log('Microfone')}
                                disabled={isProcessing}
                                style={[
                                    styles.actionButton,
                                    isProcessing && styles.actionButtonDisabled,
                                ]}
                                activeOpacity={0.7}
                            >
                                <Ionicons
                                    name="mic-outline"
                                    size={24}
                                    color={isProcessing ? Colors.light.bodyText : Colors.light.primary}
                                />
                            </TouchableOpacity>                         
                         */}
                            <TouchableOpacity
                                onPress={handleSend}
                                disabled={!message.trim() || isProcessing}
                                style={[
                                    styles.actionButton,
                                    (!message.trim() || isProcessing) && styles.actionButtonDisabled,
                                ]}
                                activeOpacity={0.7}
                            >
                                <Ionicons
                                    name="send"
                                    size={24}
                                    color={message.trim() && !isProcessing ? Colors.light.primary : Colors.light.bodyText}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </ViewContainerUI>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 16,
    },
    backButton: {
        padding: 4,
    },
    aiButtonContainer: {
        flex: 1,
        alignItems: 'center',
    },
    aiButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        minHeight: 36,
        width: 'auto',
    },
    aiButtonText: {
        fontSize: 14,
    },
    placeholder: {
        width: 32,
    },
    scrollView: {
        flex: 1,
        paddingTop: 16,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    messagesContainer: {
        paddingTop: 20,
    },
    recipesContainer: {
        marginTop: 12,
        marginBottom: 8,
    },
    recipesSliderWrapper: {
        marginHorizontal: -20, // Compensa o paddingHorizontal do scrollContent
    },
    greetingContainer: {
        marginBottom: 32,
        marginTop: 20,
    },
    greetingText: {
        fontSize: 24,
        color: Colors.light.mainText,
        textAlign: 'center',
    },
    examplesSection: {
        marginTop: 8,
        alignItems: 'center',
    },
    examplesHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    examplesTitle: {
        fontSize: 16,
        color: Colors.light.mainText,
    },
    examplesContainer: {
        gap: 12,
        width: '100%',
        alignItems: 'center',
    },
    exampleButton: {
        backgroundColor: Colors.light.white,
        borderRadius: 12,
        width: '100%',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#EBEBEB',
    },
    exampleText: {
        fontSize: 14,
        color: Colors.light.mainText,
        textAlign: 'center',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 20,

    },
    input: {
        flex: 1,
    },
    inputActions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: Colors.light.input,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionButtonDisabled: {
        opacity: 0.5,
    },
});

