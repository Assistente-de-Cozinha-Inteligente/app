import { Colors } from '@/constants/theme';
import { Image } from 'expo-image';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { TextUI } from './ui/text';

// Função para determinar cor do status baseado no texto (versão para fundo claro)
const getStatusColor = (status: string): { backgroundColor: string; textColor: string; borderColor?: string } => {
  const statusLower = status.toLowerCase();
  
  // Status positivo - pode fazer
  if (statusLower.includes('consegue fazer') || statusLower.includes('pode fazer') || statusLower.includes('pronto')) {
    return {
      backgroundColor: '#E8F5E9', // Verde muito claro
      textColor: '#2E7D32', // Verde escuro
      borderColor: '#C8E6C9',
    };
  }
  
  // Status de falta de ingredientes
  if (statusLower.includes('falta') || statusLower.includes('faltam')) {
    return {
      backgroundColor: '#FFF3E0', // Amarelo/Laranja muito claro
      textColor: '#E65100', // Laranja escuro
      borderColor: '#FFE0B2',
    };
  }
  
  // Status neutro/outros
  return {
    backgroundColor: '#F5F5F5',
    textColor: Colors.light.bodyText,
    borderColor: '#E0E0E0',
  };
};

type CardReceitaCompactoProps = {
  imageUri?: string | number;
  category: string;
  title: string;
  time: string;
  servings: string;
  status?: string;
  onPress?: () => void;
};

export function CardReceitaCompacto({
  imageUri,
  category,
  title,
  time,
  servings,
  status,
  onPress,
}: CardReceitaCompactoProps) {
  // Se for número (imagem local), usa diretamente, senão usa como URI
  const imageSource = typeof imageUri === 'number' 
    ? imageUri 
    : imageUri ? { uri: imageUri } : undefined;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.container}
    >
      {/* Container da imagem */}
      <View style={styles.imageContainer}>
        {imageSource && (
          <Image
            source={imageSource}
            style={styles.image}
            contentFit="cover"
          />
        )}
        
        {/* Badge de categoria no canto superior esquerdo */}
        <View style={styles.categoryBadge}>
          <TextUI variant="regular" style={styles.categoryText}>
            {category}
          </TextUI>
        </View>
      </View>

      {/* Conteúdo abaixo da imagem */}
      <View style={styles.content}>
        <TextUI variant="semibold" style={styles.title} numberOfLines={2}>
          {title}
        </TextUI>
        
        <View style={styles.infoContainer}>
          <TextUI variant="light" style={styles.infoText}>
            {time}
          </TextUI>
          <TextUI variant="light" style={styles.separator}>
            •
          </TextUI>
          <TextUI variant="light" style={styles.infoText}>
            {servings}
          </TextUI>
        </View>

        {/* Status abaixo das informações */}
        {status && (() => {
          const statusColors = getStatusColor(status);
          return (
            <View style={[
              styles.statusContainer,
              {
                backgroundColor: statusColors.backgroundColor,
                borderTopColor: statusColors.borderColor || '#F0F0F0',
              }
            ]}>
              <TextUI variant="regular" style={[styles.statusText, { color: statusColors.textColor }]}>
                {status}
              </TextUI>
            </View>
          );
        })()}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 180,
    borderRadius: 12,
    backgroundColor: Colors.light.white,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 140,
    position: 'relative',
    backgroundColor: '#E5E5E5',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  categoryBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  categoryText: {
    fontSize: 12,
    color: Colors.light.mainText,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    color: Colors.light.mainText,
    marginBottom: 6,
    lineHeight: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 12,
    color: Colors.light.bodyText,
  },
  separator: {
    fontSize: 12,
    color: Colors.light.bodyText,
    opacity: 0.5,
  },
  statusContainer: {
    marginTop: 8,
    paddingTop: 8,
    paddingBottom: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderTopWidth: 1,
  },
  statusText: {
    fontSize: 11,
  },
});

