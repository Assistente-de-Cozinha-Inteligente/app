import { ButtonUI } from '@/components/ui/button';
import { InputUI } from '@/components/ui/input';
import { InputPasswordUI } from '@/components/ui/input-password';
import { TextUI } from '@/components/ui/text';
import { ViewContainerUI } from '@/components/ui/view-container';
import { Colors } from '@/constants/theme';
import { haptics } from '@/utils/haptics';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
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

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { modo } = useLocalSearchParams<{ modo?: string }>();
  const isModoAssinatura = modo === 'assinatura';
  
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; senha?: string }>({});

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
    const newErrors: { email?: string; senha?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Email inválido';
    }

    if (!senha.trim()) {
      newErrors.senha = 'Senha é obrigatória';
    } else if (senha.length < 6) {
      newErrors.senha = 'Senha deve ter no mínimo 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) {
      haptics.error();
      return;
    }

    setLoading(true);
    haptics.medium();

    // Simular login
    setTimeout(() => {
      setLoading(false);
      haptics.success();
      console.log('Login realizado:', { email });
      router.back();
    }, 1500);
  };

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
                {isModoAssinatura ? 'Proteja sua assinatura' : 'Bem-vindo de volta'}
              </TextUI>
              <TextUI variant="regular" style={styles.subtitle}>
                {isModoAssinatura 
                  ? 'Crie uma conta para garantir acesso ao Premium em qualquer dispositivo.'
                  : 'Entre com sua conta para continuar'}
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
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  borderColor={errors.email ? 'error' : email && !errors.email ? 'success' : null}
                />
                {errors.email && (
                  <TextUI variant="regular" style={styles.errorText}>
                    {errors.email}
                  </TextUI>
                )}
              </View>

              <View style={styles.inputContainer}>
                <TextUI variant="semibold" style={styles.label}>
                  Senha
                </TextUI>
                <InputPasswordUI
                  placeholder="Sua senha"
                  value={senha}
                  onChangeText={(text) => {
                    setSenha(text);
                    if (errors.senha) setErrors({ ...errors, senha: undefined });
                  }}
                  borderColor={errors.senha ? 'error' : senha && !errors.senha ? 'success' : null}
                />
                {errors.senha && (
                  <TextUI variant="regular" style={styles.errorText}>
                    {errors.senha}
                  </TextUI>
                )}
              </View>

              {/* Esqueceu senha */}
              <Pressable
                onPress={() => {
                  haptics.light();
                  router.push('/resetar-senha');
                }}
                style={styles.forgotPassword}
              >
                <TextUI variant="semibold" style={styles.forgotPasswordText}>
                  Esqueceu sua senha?
                </TextUI>
              </Pressable>

              {/* Botão Login */}
              <ButtonUI
                title="Entrar"
                onPress={handleLogin}
                loading={loading}
                disabled={loading}
                style={styles.loginButton}
              />

              {/* Divisor */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <TextUI variant="regular" style={styles.dividerText}>
                  ou
                </TextUI>
                <View style={styles.dividerLine} />
              </View>

              {/* Link para Registro */}
              <View style={styles.registerContainer}>
                <TextUI variant="regular" style={styles.registerText}>
                  Não tem uma conta?{' '}
                </TextUI>
                <Pressable
                  onPress={() => {
                    haptics.light();
                    router.replace('/registro');
                  }}
                >
                  <TextUI variant="semibold" style={styles.registerLink}>
                    Criar conta
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
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
    marginTop: -4,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: Colors.light.primary,
  },
  loginButton: {
    marginBottom: 24,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#EBEBEB',
  },
  dividerText: {
    fontSize: 14,
    color: Colors.light.bodyText,
    marginHorizontal: 16,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    fontSize: 14,
    color: Colors.light.bodyText,
  },
  registerLink: {
    fontSize: 14,
    color: Colors.light.primary,
  },
});

