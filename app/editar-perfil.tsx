import { ButtonUI } from '@/components/ui/button';
import { InputUI } from '@/components/ui/input';
import { ViewContainerUI } from '@/components/ui/view-container';
import { Colors } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TextUI } from '@/components/ui/text';

export default function EditarPerfilScreen() {
  const [nome, setNome] = useState('Guilherme');
  const insets = useSafeAreaInsets();

  const handleSave = () => {
    // Aqui você pode salvar o nome
    console.log('Salvando nome:', nome);
    router.back();
  };

  return (
    <ViewContainerUI>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.light.mainText} />
          </Pressable>
          <TextUI variant="semibold" style={styles.headerTitle}>
            Meu Perfil
          </TextUI>
          <View style={styles.placeholder} />
        </View>

        {/* Conteúdo */}
        <View style={styles.content}>
          <TextUI variant="semibold" style={styles.label}>
            Nome
          </TextUI>
          <InputUI
            placeholder=""
            value={nome}
            onChangeText={setNome}
            borderColor={nome.trim() ? 'success' : null}
          />
        </View>

        {/* Botão Salvar */}
        <View style={[styles.buttonContainer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
          <ButtonUI
            title="Salvar Alterações"
            onPress={handleSave}
            variant="primary"
            disabled={!nome.trim()}
          />
        </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: 20,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    color: Colors.light.mainText,
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  label: {
    fontSize: 16,
    color: Colors.light.mainText,
    marginBottom: 12,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
});

