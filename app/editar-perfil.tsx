import { InputUI } from '@/components/ui/input';
import { TextUI } from '@/components/ui/text';
import { ViewContainerUI } from '@/components/ui/view-container';
import { Colors } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native';

export default function EditarPerfilScreen() {
  const [nome, setNome] = useState('Guilherme');

  const handleSave = () => {
    // Aqui você pode salvar o nome
    console.log('Salvando nome:', nome);
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'android' ? 'padding' : 'padding'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'android' ? 0 : 0}
    >
      <ViewContainerUI>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.light.mainText} />
          </Pressable>
          <TextUI variant="semibold" style={styles.headerTitle}>
            Meu Perfil
          </TextUI>
          <Pressable onPress={handleSave} disabled={!nome.trim()}>
            <TextUI 
              variant="semibold" 
              style={[
                styles.saveButton,
                !nome.trim() && styles.saveButtonDisabled
              ]}
            >
              SALVAR
            </TextUI>
          </Pressable>
        </View>


         {/* Conteúdo */}
         <View style={styles.content}>
           <View style={styles.inputContainer}>
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
         </View>
      </ViewContainerUI>
    </KeyboardAvoidingView>
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
  saveButton: {
    fontSize: 16,
    color: Colors.light.primary,
  },
  saveButtonDisabled: {
    opacity: 0.3,
  },
  content: {
    flex: 1,
    paddingTop: 40,
  },
  inputContainer: {
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    color: Colors.light.mainText,
    marginBottom: 12,
  },
});

