import { Colors } from '@/constants/theme';
import { Inventario } from '@/models';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { TextUI } from './ui/text';

type CardItemProximoVencerProps = {
  item: Inventario;
  diasRestantes: number;
  onVerSugestao: () => void;
};

export function CardItemProximoVencer({
  item,
  diasRestantes,
  onVerSugestao,
}: CardItemProximoVencerProps) {
  const isUrgente = diasRestantes <= 1; // 0-1 dia
  const isProximo = diasRestantes >= 2 && diasRestantes <= 3; // 2-3 dias

  const titulo = isUrgente
    ? 'Usar hoje evita desperdício'
    : isProximo
    ? 'Item perto de vencer'
    : '';

  const getConteudo = () => {
    const nomeIngrediente = item.ingrediente?.nome || 'Item';
    if (isUrgente) {
      if (diasRestantes === 0) {
        return `${nomeIngrediente} vence hoje`;
      } else {
        return `${nomeIngrediente} vence amanhã`;
      }
    } else if (isProximo) {
      return `${nomeIngrediente} vence em ${diasRestantes} dias`;
    }
    return '';
  };

  const conteudo = getConteudo();

  if (!titulo || !conteudo) {
    return null;
  }

  return (
    <View style={[styles.container, isUrgente && styles.containerUrgente]}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="alert-circle"
            size={24}
            color={isUrgente ? Colors.light.danger : '#FF9800'}
          />
        </View>
        <View style={styles.textContainer}>
          <TextUI variant="semibold" style={styles.titulo}>
            {titulo}
          </TextUI>
          <TextUI variant="regular" style={styles.conteudo}>
            {conteudo}
          </TextUI>
        </View>
      </View>
      <TouchableOpacity onPress={onVerSugestao} activeOpacity={0.7}>
        <View style={styles.buttonContainer}>
          <TextUI variant="semibold" style={styles.buttonText}>
            Ver sugestão
          </TextUI>
          <Ionicons name="chevron-forward" size={18} color={Colors.light.primary} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.white,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FF9800',
    overflow: 'hidden',
    padding: 16,
  },
  containerUrgente: {
    borderColor: Colors.light.danger,
    backgroundColor: `${Colors.light.danger}08`,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  titulo: {
    fontSize: 14,
    color: Colors.light.mainText,
    marginBottom: 4,
  },
  conteudo: {
    fontSize: 13,
    color: Colors.light.bodyText,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: Colors.light.primary + '15',
    borderRadius: 8,
    gap: 6,
  },
  buttonText: {
    fontSize: 13,
    color: Colors.light.primary,
  },
});

