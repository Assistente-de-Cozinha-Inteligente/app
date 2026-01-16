import { Colors } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { TextUI } from './ui/text';

type Tarefa = {
  id: string;
  texto: string;
};

type Etapa = {
  id: string;
  titulo: string;
  tarefas: Tarefa[];
};

type CardComoFazerReceitaProps = {
  etapas: Etapa[];
  maxVisible?: number; // Número máximo de etapas visíveis antes de mostrar "Ver mais"
};

export function CardComoFazerReceita({
  etapas,
  maxVisible = 3,
}: CardComoFazerReceitaProps) {
  const [showAll, setShowAll] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const hasMore = etapas.length > maxVisible;
  const visibleEtapas = showAll ? etapas : etapas.slice(0, maxVisible);

  useEffect(() => {
    if (showAll) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [showAll, fadeAnim]);

  return (
    <View style={styles.container}>
      {visibleEtapas.map((etapa, etapaIndex) => {
        const isLastVisible = etapaIndex === visibleEtapas.length - 1;
        const shouldShowOverlay = hasMore && !showAll && isLastVisible;
        const isNewItem = showAll && etapaIndex >= maxVisible;
        const opacity = isNewItem ? fadeAnim : 1;

        return (
          <Animated.View 
            key={etapa.id} 
            style={[styles.etapaWrapper, { opacity }]}
          >
            {/* Título da etapa */}
            <TextUI variant="semibold" style={[
              styles.etapaTitulo,
              shouldShowOverlay && styles.etapaTituloOverlay,
            ]}>
              {etapa.titulo}
            </TextUI>

            {/* Lista de tarefas */}
            <View style={styles.tarefasContainer}>
              {etapa.tarefas.map((tarefa, tarefaIndex) => (
                <View key={tarefa.id} style={styles.tarefaRow}>
                  <TextUI
                    variant="medium"
                    style={[
                      styles.tarefaBullet,
                      shouldShowOverlay && styles.tarefaTextoOverlay,
                    ]}
                  >
                    •
                  </TextUI>
                  <TextUI
                    variant="regular"
                    style={[
                      styles.tarefaTexto,
                      shouldShowOverlay && styles.tarefaTextoOverlay,
                    ]}
                  >
                    {tarefa.texto}
                  </TextUI>
                </View>
              ))}
            </View>

            {/* Linha separadora (exceto no último item) */}
            {etapaIndex < visibleEtapas.length - 1 && (
              <View style={styles.separator} />
            )}

            {/* Botão "Ver mais" sobreposto */}
            {shouldShowOverlay && (
              <Pressable
                onPress={() => setShowAll(true)}
                style={styles.seeMoreOverlay}
              >
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.7)', 'rgba(255, 255, 255, 0.95)']}
                  locations={[0, 0.5, 1]}
                  style={styles.overlayGradient}
                >
                  <View style={styles.seeMoreButton}>
                    <TextUI variant="regular" style={styles.seeMoreText}>
                      Ver mais
                    </TextUI>
                    <Ionicons name="chevron-down" size={16} color={Colors.light.primary} />
                  </View>
                </LinearGradient>
              </Pressable>
            )}
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.white,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EBEBEB',
  },
  etapaWrapper: {
    position: 'relative',
  },
  etapaTitulo: {
    fontSize: 16,
    color: "#908F8F",
    marginBottom: 12,
  },
  etapaTituloOverlay: {
    opacity: 0.6,
  },
  tarefasContainer: {
    marginBottom: 16,
  },
  tarefaRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  tarefaBullet: {
    fontSize: 14,
    color: Colors.light.mainText,
    marginRight: 8,
    lineHeight: 20,
  },
  tarefaTexto: {
    fontSize: 14,
    color: Colors.light.mainText,
    lineHeight: 20,
    flex: 1,
  },
  tarefaTextoOverlay: {
    opacity: 0.6,
  },
  separator: {
    height: 1,
    backgroundColor: '#EBEBEB',
    marginBottom: 16,
  },
  seeMoreOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    justifyContent: 'flex-end',
    zIndex: 10,
  },
  overlayGradient: {
    paddingTop: 20,
    paddingBottom: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  seeMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  seeMoreText: {
    fontSize: 14,
    color: Colors.light.primary,
  },
});

