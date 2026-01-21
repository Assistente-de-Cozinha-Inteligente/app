import { BottomSheetEditarItemInventario } from '@/components/bottom-sheet-editar-item-inventario';
import { BottomSheetEditarItemLista } from '@/components/bottom-sheet-editar-item-lista';
import { BottomSheetInfoCozinha } from '@/components/bottom-sheet-info-cozinha';
import { CardItemInventario } from '@/components/card-item-inventario';
import { CardItemProximoVencer } from '@/components/card-item-proximo-vencer';
import { LocalGroupCard } from '@/components/local-group-card';
import { EmptyStateCard } from '@/components/ui/empty-state-card';
import { FloatingAddButton } from '@/components/ui/floating-add-button';
import { PageHeader } from '@/components/ui/page-header';
import { ScrollViewWithPadding } from '@/components/ui/scroll-view-with-padding';
import { TextUI } from '@/components/ui/text';
import { Toast } from '@/components/ui/toast';
import { ToastWithUndo } from '@/components/ui/toast-with-undo';
import { ViewContainerUI } from '@/components/ui/view-container';
import { Colors } from '@/constants/theme';
import { atualizarDisponibilidadeValidadeItemInventario, excluirItemInventario, getInventario } from '@/data/local/dao/inventarioDao';
import { inserirAtualizarItemListaCompras } from '@/data/local/dao/listaComprasDao';
import { useExpandableLocal } from '@/hooks/use-expandable-local';
import { useInventarioGrouping } from '@/hooks/use-inventario-grouping';
import { useUndoDelete } from '@/hooks/use-undo-delete';
import { Inventario } from '@/models';
import { getItemMaisPrioritario } from '@/utils/validadeHelper';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Animated, BackHandler, StyleSheet, TouchableOpacity, View } from 'react-native';

const INFO_CARD_KEY = 'info_card_cozinha_closed';

export default function ListaScreen() {
  const [inventario, setInventario] = useState<Inventario[]>([]);
  const [editingItem, setEditingItem] = useState<Inventario | null>(null);
  const [addingToCartItem, setAddingToCartItem] = useState<Inventario | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [toastKey, setToastKey] = useState(0);
  const [showInfoCard, setShowInfoCard] = useState(true);
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Obtém o item mais prioritário próximo de vencer
  const itemMaisPrioritario = useMemo(() => {
    return getItemMaisPrioritario(inventario);
  }, [inventario]);

  // Agrupa itens por local com priorização
  const itensPorLocal = useInventarioGrouping(inventario);

  // Gerencia animações e estados expandidos
  const { animations, toggleLocal } = useExpandableLocal(
    itensPorLocal.map(({ local }) => local)
  );

  // Gerencia lógica de undo para exclusão
  const {
    deletingItems,
    showUndoToast,
    toastUndoKey,
    handleItemRemove: handleItemRemoveBase,
    handleUndoDelete,
    handleConfirmDelete: handleConfirmDeleteBase,
    cleanup,
    syncWithItems,
    setShowUndoToast,
  } = useUndoDelete<Inventario>({
    onConfirmDelete: async (items) => {
      const ingredienteIds = items.map(item => item.ingrediente_id);
      await excluirItemInventario(ingredienteIds);
    },
  });

  const handleItemRemove = async (ingrediente_id: number) => {
    const itemToDelete = inventario.find(item => item.ingrediente_id === ingrediente_id);
    if (!itemToDelete) return;

    setInventario(prev => prev.filter(item => item.ingrediente_id !== ingrediente_id));
    handleItemRemoveBase(itemToDelete);
  };

  const handleUndoDeleteWithRestore = () => {
    handleUndoDelete();
    const itemsToRestore = deletingItems;
    setInventario(prev => {
      const restoredItems: Inventario[] = [];
      itemsToRestore.forEach(itemToRestore => {
        const exists = prev.some(item => item.ingrediente_id === itemToRestore.ingrediente_id);
        if (!exists) {
          restoredItems.push(itemToRestore);
        }
      });
      return [...prev, ...restoredItems];
    });
  };

  const handleConfirmDelete = async () => {
    await handleConfirmDeleteBase();
    const inventarioAtualizado = await getInventario();
    setInventario(inventarioAtualizado);
  };

  const handleAddItem = () => {
    router.push('/adicionar-item-inventario');
  };

  const handleItemPress = (item: Inventario) => {
    setEditingItem(item);
  };

  const handleSaveItem = async (validade: number | null) => {
    if (!editingItem) return;

    try {
      await atualizarDisponibilidadeValidadeItemInventario(
        editingItem.ingrediente_id,
        editingItem.disponibilidade,
        validade
      );

      const inventarioAtualizado = await getInventario();
      setInventario(inventarioAtualizado);
      setEditingItem(null);
    } catch (error) {
      console.error('Erro ao salvar item:', error);
    }
  };

  const handleInfo = () => {
    setShowInfoModal(true);
  };

  const handleVerSugestao = (ingredienteId: number) => {
    router.push('/(tabs)/receitas');
  };

  const handleAddToCart = (item: Inventario) => {
    setAddingToCartItem(item);
  };

  const handleSaveToCart = async () => {
    if (!addingToCartItem) return;

    try {
      await inserirAtualizarItemListaCompras([{
        ingrediente_id: addingToCartItem.ingrediente_id,
        marcado: false,
        precisa_sincronizar: true,
        local: addingToCartItem.local || addingToCartItem.ingrediente?.local || undefined,
      }]);

      setAddingToCartItem(null);

      setTimeout(() => {
        setShowSuccessMessage(false);
        setToastKey(prev => prev + 1);
        setTimeout(() => {
          setShowSuccessMessage(true);
        }, 50);
      }, 200);
    } catch (error) {
      console.error('Erro ao adicionar item à lista de compras:', error);
    }
  };

  // Handler para o botão de voltar do Android
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (showInfoModal) {
        setShowInfoModal(false);
        return true;
      }
      if (editingItem) {
        setEditingItem(null);
        return true;
      }
      if (addingToCartItem) {
        setAddingToCartItem(null);
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [showInfoModal, editingItem, addingToCartItem]);

  // Verifica se o card informativo foi fechado anteriormente
  useEffect(() => {
    const checkInfoCardStatus = async () => {
      try {
        const closed = await AsyncStorage.getItem(INFO_CARD_KEY);
        if (closed === 'true') {
          setShowInfoCard(false);
        }
      } catch (error) {
        console.error('Erro ao verificar status do card informativo:', error);
      }
    };
    checkInfoCardStatus();
  }, []);

  const handleCloseInfoCard = async () => {
    try {
      await AsyncStorage.setItem(INFO_CARD_KEY, 'true');
      setShowInfoCard(false);
    } catch (error) {
      console.error('Erro ao salvar status do card informativo:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getInventario().then((lista) => {
        setInventario(lista);
        syncWithItems(lista);
      });

      return () => {
        cleanup();
      };
    }, [])
  );

  return (
    <ViewContainerUI isTabBar={true} exibirIA={true}>
      <PageHeader
        style={{
          marginBottom: 15,
          paddingHorizontal: 20,
        }}
        title="Sua cozinha"
        description="Ingredientes disponíveis"
        rightComponent={
          <TouchableOpacity onPress={handleInfo} activeOpacity={0.7}>
            <Ionicons name="information-circle-outline" size={26} color="black" />
          </TouchableOpacity>
        }
      />
      <ScrollViewWithPadding keyboardShouldPersistTaps="handled">
        <View style={styles.listContainer}>
          {/* Card informativo */}
          {showInfoCard && (
            <View style={styles.infoCard}>
              <View style={styles.infoCardContent}>
                <Ionicons name="bulb-outline" size={24} color={Colors.light.primary} />
                <View style={styles.infoCardText}>
                  <TextUI variant="semibold" style={styles.infoCardTitle}>
                    Sem controle de estoque complicado.
                  </TextUI>
                  <TextUI variant="regular" style={styles.infoCardDescription}>
                    O app decide de forma inteligente para você.
                  </TextUI>
                </View>
                <TouchableOpacity
                  onPress={handleCloseInfoCard}
                  style={styles.infoCardCloseButton}
                  activeOpacity={0.7}
                >
                  <Ionicons name="close" size={20} color={Colors.light.bodyText} />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Estado vazio */}
          {inventario.length === 0 && (
            <EmptyStateCard
              title="Vazio"
              description="Sua cozinha ainda está vazia. Cadastre um item para começar."
              iconName="restaurant-outline"
              actionLabel="Adicionar"
              onPress={handleAddItem}
              style={{ marginBottom: 16 }}
            />
          )}

          {/* Card de item próximo de vencer */}
          {itemMaisPrioritario && (
            <CardItemProximoVencer
              item={itemMaisPrioritario.item}
              diasRestantes={itemMaisPrioritario.diasRestantes}
              onVerSugestao={() => handleVerSugestao(itemMaisPrioritario.item.ingrediente_id)}
            />
          )}

          {/* Cards agrupados por local */}
          {itensPorLocal.map(({ local, itens }) => {
            const animValue = animations[local] || new Animated.Value(1);

            return (
              <LocalGroupCard
                key={local}
                local={local}
                itens={itens}
                isExpanded={true}
                animValue={animValue}
                onToggle={() => toggleLocal(local)}
                itemHeight={80}
                extraSpace={26}
                renderItem={(item: Inventario) => {
                  const estaProximoVencer = item.validade !== null && item.validade !== undefined
                    ? (() => {
                        const agora = Date.now();
                        const diasRestantes = Math.ceil((item.validade! - agora) / (1000 * 60 * 60 * 24));
                        return diasRestantes >= 0 && diasRestantes <= 3;
                      })()
                    : false;

                  return (
                    <CardItemInventario
                      key={`${item.usuario_id}-${item.ingrediente_id}`}
                      item={item}
                      onItemPress={handleItemPress}
                      onItemRemove={handleItemRemove}
                      onItemAddToCart={handleAddToCart}
                      estaProximoVencer={estaProximoVencer}
                    />
                  );
                }}
              />
            );
          })}
        </View>
      </ScrollViewWithPadding>

      {/* Mensagem de confirmação */}
      <Toast
        key={`toast-success-${toastKey}`}
        visible={showSuccessMessage}
        message="Item adicionado à lista de compras!"
        type="success"
        exitDirection="left"
        onHide={() => setShowSuccessMessage(false)}
      />

      {/* Toast de desfazer exclusão */}
      <ToastWithUndo
        key={`toast-undo-${toastUndoKey}`}
        visible={showUndoToast}
        message={
          deletingItems.length === 1
            ? "Item excluído"
            : `${deletingItems.length} itens excluídos`
        }
        onUndo={handleUndoDeleteWithRestore}
        onConfirm={handleConfirmDelete}
        onHide={() => setShowUndoToast(false)}
        duration={5}
      />

      {/* Bottom Sheet para editar item */}
      <BottomSheetEditarItemInventario
        item={editingItem && editingItem.ingrediente ? {
          ingrediente: editingItem.ingrediente,
          validade: editingItem.validade,
        } : null}
        onClose={() => setEditingItem(null)}
        onSave={handleSaveItem}
      />

      {/* Bottom Sheet para adicionar à lista de compras */}
      <BottomSheetEditarItemLista
        item={addingToCartItem && addingToCartItem.ingrediente ? {
          ingrediente: addingToCartItem.ingrediente,
        } : null}
        onClose={() => setAddingToCartItem(null)}
        onSave={handleSaveToCart}
        title="Adicionar na lista de compras"
        buttonTitle="ADICIONAR À LISTA"
      />

      {/* Bottom Sheet de informações */}
      <BottomSheetInfoCozinha
        visible={showInfoModal}
        onClose={() => setShowInfoModal(false)}
      />

      <FloatingAddButton onPress={handleAddItem} />
    </ViewContainerUI>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 20,
  },
  infoCard: {
    backgroundColor: Colors.light.white,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.light.primary + '30',
    overflow: 'hidden',
  },
  infoCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  infoCardText: {
    flex: 1,
  },
  infoCardTitle: {
    fontSize: 14,
    color: Colors.light.mainText,
    marginBottom: 4,
  },
  infoCardDescription: {
    fontSize: 12,
    color: Colors.light.bodyText,
    lineHeight: 16,
  },
  infoCardCloseButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.input,
  },
});
