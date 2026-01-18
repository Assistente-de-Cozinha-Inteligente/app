import { ButtonUI } from '@/components/ui/button';
import { InputUI } from '@/components/ui/input';
import { TextUI } from '@/components/ui/text';
import { ViewContainerUI } from '@/components/ui/view-container';
import { Colors } from '@/constants/theme';
import { haptics } from '@/utils/haptics';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ResetarSenhaScreen() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Animações de entrada
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    haptics.light();
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const validate = () => {
    if (!email.trim()) {
      setError('Email é obrigatório');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Email inválido');
      return false;
    }
    setError(null);
    return true;
  };

  const handleReset = async () => {
    if (!validate()) {
      haptics.error();
      return;
    }

    setLoading(true);
    haptics.medium();

    // Simular envio de email
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      haptics.success();
    }, 1500);
  };

  if (sent) {
    return (
      <ViewContainerUI>
        <View style={[styles.container, { paddingTop: insets.top }]}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={Colors.light.mainText} />
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Animated.View
              style={[
                styles.content,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              {/* Ícone de sucesso */}
              <View style={styles.successIconContainer}>
                <View style={styles.successIconCircle}>
                  <Ionicons name="checkmark" size={48} color={Colors.light.white} />
                </View>
              </View>

              {/* Título */}
              <View style={styles.titleContainer}>
                <TextUI variant="bold" style={styles.title}>
                  Email enviado!
                </TextUI>
                <TextUI variant="regular" style={styles.subtitle}>
                  Enviamos um link para redefinir sua senha no email{' '}
                  <TextUI variant="semibold">{email}</TextUI>
                </TextUI>
              </View>

              {/* Instruções */}
              <View style={styles.instructionsContainer}>
                <TextUI variant="regular" style={styles.instructionsText}>
                  Verifique sua caixa de entrada e siga as instruções para criar uma nova senha.
                </TextUI>
              </View>

              {/* Botão Voltar */}
              <ButtonUI
                title="Voltar ao login"
                onPress={() => {
                  haptics.light();
                  router.back();
                }}
                style={styles.backButton}
              />
            </Animated.View>
          </ScrollView>
        </View>
      </ViewContainerUI>
    );
  }

  return (
    <ViewContainerUI>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="close" size={24} color={Colors.light.mainText} />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Título */}
            <View style={styles.titleContainer}>
              <TextUI variant="bold" style={styles.title}>
                Redefinir senha
              </TextUI>
              <TextUI variant="regular" style={styles.subtitle}>
                Digite seu email e enviaremos um link para redefinir sua senha
              </TextUI>
            </View>

            {/* Formulário */}
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <TextUI variant="semibold" style={styles.label}>
                  Email
                </TextUI>
                <InputUI
                  placeholder="seu@email.com"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (error) setError(null);
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  borderColor={error ? 'error' : email && !error ? 'success' : null}
                />
                {error && (
                  <TextUI variant="regular" style={styles.errorText}>
                    {error}
                  </TextUI>
                )}
              </View>

              {/* Botão Enviar */}
              <ButtonUI
                title="Enviar link de redefinição"
                onPress={handleReset}
                loading={loading}
                disabled={loading}
                style={styles.resetButton}
              />

              {/* Link para Login */}
              <View style={styles.loginContainer}>
                <TextUI variant="regular" style={styles.loginText}>
                  Lembrou sua senha?{' '}
                </TextUI>
                <Pressable
                  onPress={() => {
                    haptics.light();
                    router.back();
                  }}
                >
                  <TextUI variant="semibold" style={styles.loginLink}>
                    Voltar ao login
                  </TextUI>
                </Pressable>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ViewContainerUI>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backButton: {
    padding: 4,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
  },
  titleContainer: {
    marginBottom: 32,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    color: Colors.light.mainText,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.bodyText,
    lineHeight: 22,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: Colors.light.mainText,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 12,
    color: Colors.light.danger,
    marginTop: 6,
  },
  resetButton: {
    marginBottom: 24,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: Colors.light.bodyText,
  },
  loginLink: {
    fontSize: 14,
    color: Colors.light.primary,
  },
  successIconContainer: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 20,
  },
  successIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.light.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructionsContainer: {
    backgroundColor: Colors.light.input,
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
  },
  instructionsText: {
    fontSize: 14,
    color: Colors.light.bodyText,
    lineHeight: 20,
    textAlign: 'center',
  },
});

