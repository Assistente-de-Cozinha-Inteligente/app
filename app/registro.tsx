import { ButtonUI } from '@/components/ui/button';
import { InputUI } from '@/components/ui/input';
import { InputPasswordUI } from '@/components/ui/input-password';
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

export default function RegistroScreen() {
  const insets = useSafeAreaInsets();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    nome?: string;
    email?: string;
    senha?: string;
    confirmarSenha?: string;
  }>({});

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
    const newErrors: {
      nome?: string;
      email?: string;
      senha?: string;
      confirmarSenha?: string;
    } = {};

    if (!nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    } else if (nome.trim().length < 2) {
      newErrors.nome = 'Nome deve ter no mínimo 2 caracteres';
    }

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

    if (!confirmarSenha.trim()) {
      newErrors.confirmarSenha = 'Confirmação de senha é obrigatória';
    } else if (senha !== confirmarSenha) {
      newErrors.confirmarSenha = 'As senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegistro = async () => {
    if (!validate()) {
      haptics.error();
      return;
    }

    setLoading(true);
    haptics.medium();

    // Simular registro
    setTimeout(() => {
      setLoading(false);
      haptics.success();
      console.log('Registro realizado:', { nome, email });
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
                Criar conta
              </TextUI>
              <TextUI variant="regular" style={styles.subtitle}>
                Preencha os dados para começar
              </TextUI>
            </View>

            {/* Formulário */}
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <TextUI variant="semibold" style={styles.label}>
                  Nome completo
                </TextUI>
                <InputUI
                  placeholder="Seu nome"
                  value={nome}
                  onChangeText={(text) => {
                    setNome(text);
                    if (errors.nome) setErrors({ ...errors, nome: undefined });
                  }}
                  autoCapitalize="words"
                  autoComplete="name"
                  borderColor={errors.nome ? 'error' : nome && !errors.nome ? 'success' : null}
                />
                {errors.nome && (
                  <TextUI variant="regular" style={styles.errorText}>
                    {errors.nome}
                  </TextUI>
                )}
              </View>

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
                  placeholder="Mínimo 6 caracteres"
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

              <View style={styles.inputContainer}>
                <TextUI variant="semibold" style={styles.label}>
                  Confirmar senha
                </TextUI>
                <InputPasswordUI
                  placeholder="Digite a senha novamente"
                  value={confirmarSenha}
                  onChangeText={(text) => {
                    setConfirmarSenha(text);
                    if (errors.confirmarSenha) setErrors({ ...errors, confirmarSenha: undefined });
                  }}
                  borderColor={
                    errors.confirmarSenha
                      ? 'error'
                      : confirmarSenha && !errors.confirmarSenha
                      ? 'success'
                      : null
                  }
                />
                {errors.confirmarSenha && (
                  <TextUI variant="regular" style={styles.errorText}>
                    {errors.confirmarSenha}
                  </TextUI>
                )}
              </View>

              {/* Botão Registro */}
              <ButtonUI
                title="Criar conta"
                onPress={handleRegistro}
                loading={loading}
                disabled={loading}
                style={styles.registerButton}
              />

              {/* Divisor */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <TextUI variant="regular" style={styles.dividerText}>
                  ou
                </TextUI>
                <View style={styles.dividerLine} />
              </View>

              {/* Link para Login */}
              <View style={styles.loginContainer}>
                <TextUI variant="regular" style={styles.loginText}>
                  Já tem uma conta?{' '}
                </TextUI>
                <Pressable
                  onPress={() => {
                    haptics.light();
                    router.replace('/login');
                  }}
                >
                  <TextUI variant="semibold" style={styles.loginLink}>
                    Entrar
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
  registerButton: {
    marginTop: 8,
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
});

