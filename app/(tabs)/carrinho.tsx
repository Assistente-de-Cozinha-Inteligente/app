import { CardItemLista } from '@/components/card-item-lista';
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
import { inserirAtualizarItemInventario } from '@/data/local/dao/inventarioDao';
import { atualizarMarcadoItemListaCompras, excluirItemListaCompras, getListaCompras } from '@/data/local/dao/listaComprasDao';
import { useExpandableLocal } from '@/hooks/use-expandable-local';
import { useLocalGrouping } from '@/hooks/use-local-grouping';
import { useScreenEntrance } from '@/hooks/use-screen-entrance';
import { useUndoDelete } from '@/hooks/use-undo-delete';
import { ListaCompras } from '@/models';
import { handleShareCarrinho } from '@/share/shareCarrinho';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function CarrinhoScreen() {
  const [listaCompras, setListaCompras] = useState<ListaCompras[]>([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [itensEnviadosCount, setItensEnviadosCount] = useState(0);

  // Animação de entrada suave
  const { animatedStyle } = useScreenEntrance({ duration: 400, delay: 100 });

  // Calcula quantos itens estão marcados
  const itensMarcados = useMemo(() => {
    return listaCompras.filter(item => item.marcado);
  }, [listaCompras]);

  const temItensMarcados = itensMarcados.length > 0;

  // Agrupa itens por local
  const itensPorLocal = useLocalGrouping(listaCompras);

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
  } = useUndoDelete<ListaCompras>({
    onConfirmDelete: async (items) => {
      const ingredienteIds = items.map(item => item.ingrediente_id);
      await excluirItemListaCompras(ingredienteIds);
    },
  });

  const handleItemCheck = async (ingrediente_id: number, checked: boolean) => {
    setListaCompras(listaCompras.map(item =>
      item.ingrediente_id === ingrediente_id ? { ...item, marcado: checked } : item
    ));
    await atualizarMarcadoItemListaCompras(ingrediente_id, checked);
  };

  const handleItemRemove = async (ingrediente_id: number) => {
    const itemToDelete = listaCompras.find(item => item.ingrediente_id === ingrediente_id);
    if (!itemToDelete) return;

    setListaCompras(prev => prev.filter(item => item.ingrediente_id !== ingrediente_id));
    handleItemRemoveBase(itemToDelete);
  };

  const handleConfirmDelete = async () => {
    await handleConfirmDeleteBase();
    // Recarrega a lista após exclusão
    const lista = await getListaCompras();
    setListaCompras(lista);
  };

  const handleUndoDeleteWithRestore = () => {
    handleUndoDelete();
    // Restaura visualmente na lista
    const itemsToRestore = deletingItems;
    setListaCompras(prev => {
      const restored: ListaCompras[] = [];
      itemsToRestore.forEach(itemToRestore => {
        const exists = prev.some(item => item.ingrediente_id === itemToRestore.ingrediente_id);
        if (!exists) restored.push(itemToRestore);
      });
      return [...prev, ...restored].sort((a, b) =>
        (a.ingrediente?.nome || '').localeCompare(b.ingrediente?.nome || '')
      );
    });
  };

  const handleAddItem = () => {
    router.push('/adicionar-item-lista');
  };

  const handleAdicionarNaCozinha = async () => {
    try {
      const quantidadeItens = itensMarcados.length;

      await inserirAtualizarItemInventario(
        itensMarcados.map(item => ({
          ingrediente_id: item.ingrediente_id,
          disponibilidade: 'medio',
          validade: null,
          precisa_sincronizar: true,
          local: item.local || item.ingrediente?.local || undefined,
        })),
        'compra'
      );

      await excluirItemListaCompras(itensMarcados.map(item => item.ingrediente_id));
      setListaCompras(listaCompras.filter(item => !item.marcado));

      setItensEnviadosCount(quantidadeItens);
      setShowSuccessMessage(true);
    } catch (error) {
      console.error('Erro ao adicionar itens na cozinha:', error);
    }
  };

  const handleShare = async () => {
    handleShareCarrinho(listaCompras || []);
  };

  useFocusEffect(
    useCallback(() => {
      getListaCompras().then((lista) => {
        setListaCompras(lista);
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
        title="Lista de compras"
        description="Gerencie suas compras"
        rightComponent={
          <TouchableOpacity onPress={handleShare} activeOpacity={0.7}>
            <Ionicons name="share-social-outline" size={26} color="black" />
          </TouchableOpacity>
        }
      />
      <ScrollViewWithPadding keyboardShouldPersistTaps="handled">
        <Animated.View style={[styles.listContainer, animatedStyle]}>
          {/* Estado vazio */}
          {listaCompras.length === 0 && (
            <EmptyStateCard
              title="Vazio"
              description="Sua lista de compras está vazia. Cadastre um item para começar."
              iconName="cart-outline"
              actionLabel="Adicionar"
              onPress={handleAddItem}
              style={{ marginBottom: 16 }}
            />
          )}

          {/* Card para enviar itens comprados */}
          {temItensMarcados && (
            <TouchableOpacity
              onPress={handleAdicionarNaCozinha}
              style={styles.actionCard}
              activeOpacity={0.7}
            >
              <View style={styles.actionCardContent}>
                <View style={styles.actionCardLeft}>
                  <Ionicons name="restaurant" size={20} color={Colors.light.primary} />
                  <TextUI variant="semibold" style={styles.actionCardText}>
                    Enviar {itensMarcados.length} {itensMarcados.length === 1 ? 'item' : 'itens'} para cozinha
                  </TextUI>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.light.bodyText} />
              </View>
            </TouchableOpacity>
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
                renderItem={(item: ListaCompras) => (
                  <CardItemLista
                    key={`${item.usuario_id}-${item.ingrediente_id}`}
                    item={item}
                    onItemCheck={handleItemCheck}
                    onItemRemove={handleItemRemove}
                  />
                )}
              />
            );
          })}
        </Animated.View>
      </ScrollViewWithPadding>

      {/* Mensagem de confirmação */}
      <Toast
        visible={showSuccessMessage}
        message={`${itensEnviadosCount} ${itensEnviadosCount === 1 ? 'item enviado' : 'itens enviados'} para cozinha!`}
        type="success"
        exitDirection="right"
        onHide={() => setShowSuccessMessage(false)}
      />

      {/* Toast de desfazer exclusão */}
      <ToastWithUndo
        key={`toast-undo-carrinho-${toastUndoKey}`}
        visible={showUndoToast}
        message={
          deletingItems.length === 1
            ? 'Item excluído'
            : `${deletingItems.length} itens excluídos`
        }
        onUndo={handleUndoDeleteWithRestore}
        onConfirm={handleConfirmDelete}
        onHide={() => setShowUndoToast(false)}
        duration={5}
      />

      <FloatingAddButton onPress={handleAddItem} />
    </ViewContainerUI>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 20,
  },
  actionCard: {
    backgroundColor: Colors.light.white,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.light.primary,
    overflow: 'hidden',
  },
  actionCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  actionCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  actionCardText: {
    fontSize: 14,
    color: Colors.light.mainText,
    flex: 1,
  },
});
