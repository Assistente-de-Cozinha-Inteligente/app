import { BottomSheetEditarItemInventario } from '@/components/bottom-sheet-editar-item-inventario';
import { CardItemInventario } from '@/components/card-item-inventario';
import { FloatingAddButton } from '@/components/ui/floating-add-button';
import { PageHeader } from '@/components/ui/page-header';
import { ScrollViewWithPadding } from '@/components/ui/scroll-view-with-padding';
import { TextUI } from '@/components/ui/text';
import { ViewContainerUI } from '@/components/ui/view-container';
import { Colors } from '@/constants/theme';
import { atualizarQuantidadeUnidadeValidadeItemInventario, excluirItemInventario, getInventario } from '@/data/local/dao/inventarioDao';
import { Inventario, LocalIngrediente } from '@/models';
import { getNomeLocal } from '@/utils/localHelper';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Animated, BackHandler, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function ListaScreen() {
  const [inventario, setInventario] = useState<Inventario[]>([]);
  const [expandedLocals, setExpandedLocals] = useState<Record<string, boolean>>({});
  const [animations, setAnimations] = useState<Record<string, Animated.Value>>({});
  const [editingItem, setEditingItem] = useState<Inventario | null>(null);

  // Agrupa itens por local
  const itensPorLocal = useMemo(() => {
    const grupos: Record<string, Inventario[]> = {};

    inventario.forEach(item => {
      const local = item.local || 'outro';
      if (!grupos[local]) {
        grupos[local] = [];
      }
      grupos[local].push(item);
    });

    // Ordena os grupos por nome do local
    return Object.entries(grupos)
      .sort(([localA], [localB]) => {
        const nomeA = getNomeLocal(localA as LocalIngrediente);
        const nomeB = getNomeLocal(localB as LocalIngrediente);
        return nomeA.localeCompare(nomeB);
      })
      .map(([local, itens]) => ({
        local: local as LocalIngrediente,
        itens: itens.sort((a, b) =>
          (a.ingrediente?.nome || '').localeCompare(b.ingrediente?.nome || '')
        )
      }));
  }, [inventario]);

  // Inicializa animações e estados expandidos para novos locais
  useEffect(() => {
    itensPorLocal.forEach(({ local }) => {
      if (!animations[local]) {
        const animValue = new Animated.Value(1); // Começa expandido
        setAnimations(prev => ({ ...prev, [local]: animValue }));
        setExpandedLocals(prev => ({ ...prev, [local]: true }));
      }
    });
  }, [itensPorLocal]);

  const toggleLocal = (local: string) => {
    const isExpanded = expandedLocals[local] ?? true;
    const newExpanded = !isExpanded;

    setExpandedLocals(prev => ({ ...prev, [local]: newExpanded }));

    const animValue = animations[local] || new Animated.Value(1);
    if (!animations[local]) {
      setAnimations(prev => ({ ...prev, [local]: animValue }));
    }

    Animated.timing(animValue, {
      toValue: newExpanded ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleItemRemove = async (ingrediente_id: number) => {
    // Remove localmente
    setInventario(inventario.filter(item => item.ingrediente_id !== ingrediente_id));

    // Remove no banco (soft delete)
    await excluirItemInventario([ingrediente_id]);
  };

  const handleAddItem = () => {
    router.push('/adicionar-item-inventario');
  };

  const handleItemPress = (item: Inventario) => {
    // Abre o bottom sheet para editar o item
    setEditingItem(item);
  };

  const handleSaveItem = async (quantidade: number, unidade: string, validade: number | null) => {
    if (!editingItem) return;

    try {
      // Atualiza quantidade, unidade e validade (substitui, não soma)
      await atualizarQuantidadeUnidadeValidadeItemInventario(
        editingItem.ingrediente_id,
        quantidade,
        unidade,
        validade
      );

      // Recarrega o inventário do banco para garantir sincronização
      const inventarioAtualizado = await getInventario();
      setInventario(inventarioAtualizado);

      setEditingItem(null);
    } catch (error) {
      console.error('Erro ao salvar item:', error);
    }
  };

  const handleShare = async () => {
    // TODO: Implementar compartilhamento do inventário
    console.log('Compartilhar inventário');
  };

  // Handler para o botão de voltar do Android
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // Se o bottom sheet estiver aberto, fecha ele primeiro
      if (editingItem) {
        setEditingItem(null);
        return true; // Previne o comportamento padrão (voltar para tela anterior)
      }
      return false; // Permite o comportamento padrão
    });

    return () => backHandler.remove();
  }, [editingItem]);

  useFocusEffect(
    useCallback(() => {
      getInventario().then((lista) => {
        setInventario(lista);
      });
    }, [])
  );

  return (
    <ViewContainerUI isTabBar={true}>
      <PageHeader
        style={{
          marginBottom: 15,
          paddingHorizontal: 20,
        }}
        title="Sua cozinha"
        description="Ingredientes disponíveis"
        rightComponent={
          <TouchableOpacity onPress={handleShare} activeOpacity={0.7}>
            <Ionicons name="share-social-outline" size={26} color="black" />
          </TouchableOpacity>
        }
      />
      <ScrollViewWithPadding
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.listContainer}>
          {/* Cards agrupados por local */}
          {itensPorLocal.map(({ local, itens }) => {
            const isExpanded = expandedLocals[local] ?? true;
            const animValue = animations[local] || new Animated.Value(1);

            // Calcula altura máxima baseada no número de itens
            const itemHeight = 70; // Altura aproximada de cada item (incluindo marginBottom)
            const paddingTop = 8;
            const paddingBottom = 16;
            const paddingVertical = paddingTop + paddingBottom;
            const extraSpace = 16;
            const maxHeight = (itens.length * itemHeight) + paddingVertical + extraSpace;

            const contentHeight = animValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0, maxHeight],
            });

            const rotateIcon = animValue.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '180deg'],
            });

            return (
              <View key={local} style={styles.localCard}>
                {/* Cabeçalho do card com nome do local */}
                <TouchableOpacity
                  onPress={() => toggleLocal(local)}
                  style={styles.localCardHeader}
                  activeOpacity={0.7}
                >
                  <View style={styles.localCardHeaderLeft}>
                    <TextUI variant="semibold" style={styles.localCardTitle}>
                      {getNomeLocal(local)}
                    </TextUI>
                    <TextUI variant="regular" style={styles.localCardCount}>
                      {itens.length} {itens.length === 1 ? 'item' : 'itens'}
                    </TextUI>
                  </View>
                  <Animated.View style={{ transform: [{ rotate: rotateIcon }] }}>
                    <Ionicons name="chevron-down" size={20} color={Colors.light.bodyText} />
                  </Animated.View>
                </TouchableOpacity>

                {/* Lista de itens do local com animação */}
                <Animated.View
                  style={[
                    styles.localCardContent,
                    {
                      maxHeight: contentHeight,
                      opacity: animValue,
                    },
                  ]}
                >
                  {itens.map((item) => (
                    <CardItemInventario
                      key={`${item.usuario_id}-${item.ingrediente_id}`}
                      item={item}
            onItemPress={handleItemPress}
            onItemRemove={handleItemRemove}
                    />
                  ))}
                </Animated.View>
              </View>
            );
          })}
        </View>
      </ScrollViewWithPadding>

      {/* Bottom Sheet para editar item */}
      <BottomSheetEditarItemInventario
        item={editingItem && editingItem.ingrediente ? {
          ingrediente: editingItem.ingrediente,
          quantidade: editingItem.quantidade,
          unidade: editingItem.unidade,
          validade: editingItem.validade,
        } : null}
        onClose={() => setEditingItem(null)}
        onSave={handleSaveItem}
      />

      <FloatingAddButton onPress={handleAddItem} />
    </ViewContainerUI>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 20,
  },
  localCard: {
    backgroundColor: Colors.light.white,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    overflow: 'hidden',
  },
  localCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8F8F8',
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
  },
  localCardHeaderLeft: {
    flex: 1,
  },
  localCardTitle: {
    fontSize: 16,
    color: Colors.light.mainText,
  },
  localCardCount: {
    fontSize: 12,
    color: Colors.light.bodyText,
  },
  localCardContent: {
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 16,
    overflow: 'hidden',
  },
});
