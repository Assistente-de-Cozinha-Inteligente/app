import { Alert, Linking } from 'react-native';

/**
 * Abre uma URL no navegador
 */
export async function openURL(url: string): Promise<void> {
  try {
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Erro', 'Não foi possível abrir o link');
    }
  } catch (error) {
    console.error('Erro ao abrir URL:', error);
    Alert.alert('Erro', 'Não foi possível abrir o link');
  }
}

/**
 * Abre o cliente de email
 */
export async function openEmail(email: string): Promise<void> {
  try {
    const emailUrl = `mailto:${email}`;
    const canOpen = await Linking.canOpenURL(emailUrl);
    if (canOpen) {
      await Linking.openURL(emailUrl);
    } else {
      Alert.alert('Erro', 'Não foi possível abrir o cliente de email');
    }
  } catch (error) {
    console.error('Erro ao abrir email:', error);
    Alert.alert('Erro', 'Não foi possível abrir o cliente de email');
  }
}

