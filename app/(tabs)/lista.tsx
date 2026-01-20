import { BottomSheetEditarItemInventario } from '@/components/bottom-sheet-editar-item-inventario';
import { BottomSheetEditarItemLista } from '@/components/bottom-sheet-editar-item-lista';
import { BottomSheetInfoCozinha } from '@/components/bottom-sheet-info-cozinha';
import { CardItemInventario } from '@/components/card-item-inventario';
import { CardItemProximoVencer } from '@/components/card-item-proximo-vencer';
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
import { Inventario, LocalIngrediente } from '@/models';
import { getNomeLocal } from '@/utils/localHelper';
import { calcularPesoValidade, getItemMaisPrioritario } from '@/utils/validadeHelper';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Animated, BackHandler, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function ListaScreen() {
  const [inventario, setInventario] = useState<Inventario[]>([]);
  const [expandedLocals, setExpandedLocals] = useState<Record<string, boolean>>({});
  const [animations, setAnimations] = useState<Record<string, Animated.Value>>({});
  const [editingItem, setEditingItem] = useState<Inventario | null>(null);
  const [addingToCartItem, setAddingToCartItem] = useState<Inventario | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [toastKey, setToastKey] = useState(0);
  const [showInfoCard, setShowInfoCard] = useState(true);
  const [deletingItems, setDeletingItems] = useState<Inventario[]>([]);
  const [showUndoToast, setShowUndoToast] = useState(false);
  const [toastUndoKey, setToastUndoKey] = useState(0);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const INFO_CARD_KEY = 'info_card_cozinha_closed';

  // Obtém o item mais prioritário próximo de vencer (0-3 dias)
  // Prioridade = peso da categoria + dias para vencer (menor = mais urgente)
  const itemMaisPrioritario = useMemo(() => {
    return getItemMaisPrioritario(inventario);
  }, [inventario]);

  // Agrupa itens por local e ordena por prioridade (itens próximos de vencer primeiro)
  const itensPorLocal = useMemo(() => {
    const grupos: Record<string, Inventario[]> = {};
    const agora = Date.now();

    inventario.forEach(item => {
      const local = item.local || 'outro';
      if (!grupos[local]) {
        grupos[local] = [];
      }
      grupos[local].push(item);
    });

    // Calcula prioridade de cada local baseado em itens próximos de vencer
    const calcularPrioridadeLocal = (itens: Inventario[]): number => {
      if (itens.length === 0) return 999; // Locais vazios por último

      const itensProximosVencer = itens.filter(item => {
        if (!item.validade) return false;
        const diasRestantes = Math.ceil((item.validade - agora) / (1000 * 60 * 60 * 24));
        return diasRestantes >= 0 && diasRestantes <= 3;
      });

      if (itensProximosVencer.length === 0) return 100; // Locais sem itens próximos de vencer

      // Retorna o menor peso entre os itens próximos de vencer (mais prioritário)
      const pesos = itensProximosVencer.map(item => {
        const diasRestantes = Math.ceil((item.validade! - agora) / (1000 * 60 * 60 * 24));
        return calcularPesoValidade(item, diasRestantes);
      });

      return Math.min(...pesos); // Menor peso = maior prioridade
    };

    // Ordena os grupos por prioridade (menor número = maior prioridade)
    // Se a prioridade for igual, ordena alfabeticamente
    return Object.entries(grupos)
      .map(([local, itens]) => {
        const agora = Date.now();
        
        // Separa itens próximos de vencer (0-3 dias) dos demais
        const itensProximosVencer = itens.filter(item => {
          if (!item.validade) return false;
          const diasRestantes = Math.ceil((item.validade - agora) / (1000 * 60 * 60 * 24));
          return diasRestantes >= 0 && diasRestantes <= 3;
        });

        const itensOutros = itens.filter(item => {
          if (!item.validade) return true;
          const diasRestantes = Math.ceil((item.validade - agora) / (1000 * 60 * 60 * 24));
          return diasRestantes < 0 || diasRestantes > 3;
        });

        // Ordena itens próximos de vencer por prioridade (menor peso = mais urgente)
        const itensProximosOrdenados = itensProximosVencer
          .map(item => {
            const diasRestantes = Math.ceil((item.validade! - agora) / (1000 * 60 * 60 * 24));
            const peso = calcularPesoValidade(item, diasRestantes);
            return { item, peso };
          })
          .sort((a, b) => {
            // Primeiro por peso (menor = mais urgente)
            if (a.peso !== b.peso) {
              return a.peso - b.peso;
            }
            // Se pesos iguais, ordena alfabeticamente
            return (a.item.ingrediente?.nome || '').localeCompare(b.item.ingrediente?.nome || '');
          })
          .map(({ item }) => item);

        // Ordena demais itens alfabeticamente
        const itensOutrosOrdenados = itensOutros.sort((a, b) =>
          (a.ingrediente?.nome || '').localeCompare(b.ingrediente?.nome || '')
        );

        // Combina: primeiro os próximos de vencer, depois os demais
        const itensOrdenados = [...itensProximosOrdenados, ...itensOutrosOrdenados];

        return {
          local: local as LocalIngrediente,
          itens: itensOrdenados,
          prioridade: calcularPrioridadeLocal(itens),
        };
      })
      .sort((a, b) => {
        // Primeiro critério: prioridade (menor = mais prioritário)
        if (a.prioridade !== b.prioridade) {
          return a.prioridade - b.prioridade;
        }
        // Segundo critério: ordem alfabética
        const nomeA = getNomeLocal(a.local);
        const nomeB = getNomeLocal(b.local);
        return nomeA.localeCompare(nomeB);
      })
      .map(({ local, itens }) => ({
        local,
        itens,
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
    // Encontra o item que será excluído
    const itemToDelete = inventario.find(item => item.ingrediente_id === ingrediente_id);
    
    if (!itemToDelete) return;

    // Remove visualmente da lista (mas mantém os dados para possível restauração)
    setInventario(prev => prev.filter(item => item.ingrediente_id !== ingrediente_id));

    // Adiciona o item à lista de itens sendo excluídos
    setDeletingItems(prev => {
      // Verifica se o item já não está na lista de exclusão
      const exists = prev.some(item => item.ingrediente_id === ingrediente_id);
      if (exists) return prev;
      return [...prev, itemToDelete];
    });

    // Atualiza a key do Toast para forçar reset do timer quando um novo item é adicionado
    setToastUndoKey(prev => prev + 1);

    // Mostra o Toast (ou atualiza se já estiver visível)
    setShowUndoToast(true);
  };

  const handleUndoDelete = () => {
    if (deletingItems.length === 0) return;

    const itemsToRestore = [...deletingItems];

    // Restaura todos os itens na lista
    setInventario(prev => {
      const restoredItems: Inventario[] = [];
      
      itemsToRestore.forEach(itemToRestore => {
        // Verifica se o item já não está na lista
        const exists = prev.some(item => item.ingrediente_id === itemToRestore.ingrediente_id);
        if (!exists) {
          restoredItems.push(itemToRestore);
        }
      });
      
      return [...prev, ...restoredItems];
    });

    // Limpa o estado
    setDeletingItems([]);
    setShowUndoToast(false);
  };

  const handleConfirmDelete = async () => {
    if (deletingItems.length === 0) return;

    const itemsToDelete = [...deletingItems];
    const ingredienteIds = itemsToDelete.map(item => item.ingrediente_id);

    try {
      // Remove no banco (soft delete)
      await excluirItemInventario(ingredienteIds);
    } catch (error) {
      console.error('Erro ao excluir itens:', error);
      // Em caso de erro, restaura todos os itens na lista
      setInventario(prev => {
        const restoredItems: Inventario[] = [];
        
        itemsToDelete.forEach(itemToRestore => {
          const exists = prev.some(item => item.ingrediente_id === itemToRestore.ingrediente_id);
          if (!exists) {
            restoredItems.push(itemToRestore);
          }
        });
        
        return [...prev, ...restoredItems];
      });
    } finally {
      // Limpa o estado
      setDeletingItems([]);
      setShowUndoToast(false);
    }
  };

  const handleAddItem = () => {
    router.push('/adicionar-item-inventario');
  };

  const handleItemPress = (item: Inventario) => {
    // Abre o bottom sheet para editar o item
    setEditingItem(item);
  };

  const handleSaveItem = async (validade: number | null) => {
    if (!editingItem) return;

    try {
      // Mantém a disponibilidade atual e atualiza apenas a validade
      await atualizarDisponibilidadeValidadeItemInventario(
        editingItem.ingrediente_id,
        editingItem.disponibilidade, // Mantém a disponibilidade atual
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

  const handleInfo = () => {
    setShowInfoModal(true);
  };

  const handleVerSugestao = (ingredienteId: number) => {
    // TODO: Navegar para receitas que usam esse ingrediente
    // Por enquanto, navega para a tela de receitas
    router.push('/(tabs)/receitas');
  };

  const handleAddToCart = (item: Inventario) => {
    // Abre o bottom sheet para adicionar à lista de compras
    setAddingToCartItem(item);
  };

  const handleSaveToCart = async () => {
    if (!addingToCartItem) return;

    try {
      // Adiciona o item à lista de compras
      await inserirAtualizarItemListaCompras([{
        ingrediente_id: addingToCartItem.ingrediente_id,
        marcado: false,
        precisa_sincronizar: true,
        local: addingToCartItem.local || addingToCartItem.ingrediente?.local || undefined,
      }]);

      // Fecha o bottom sheet
      setAddingToCartItem(null);

      // Aguarda um pouco para o bottom sheet fechar antes de mostrar o Toast
      setTimeout(() => {
        // Força reset completo
        setShowSuccessMessage(false);
        setToastKey(prev => prev + 1);
        // Aguarda um pouco mais para garantir que o reset foi processado
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
      // Se algum bottom sheet estiver aberto, fecha ele primeiro
      if (showInfoModal) {
        setShowInfoModal(false);
        return true; // Previne o comportamento padrão (voltar para tela anterior)
      }
      if (editingItem) {
        setEditingItem(null);
        return true; // Previne o comportamento padrão (voltar para tela anterior)
      }
      if (addingToCartItem) {
        setAddingToCartItem(null);
        return true; // Previne o comportamento padrão (voltar para tela anterior)
      }
      return false; // Permite o comportamento padrão
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
      });
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
      <ScrollViewWithPadding
        keyboardShouldPersistTaps="handled"
      >
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
            const isExpanded = expandedLocals[local] ?? true;
            const animValue = animations[local] || new Animated.Value(1);

            // Calcula altura máxima baseada no número de itens
            // CardItemInventario: paddingVertical (10*2) + marginBottom (6) + altura do conteúdo (~54) = ~80px
            // Aumenta o valor para garantir que itens com badge de validade não sejam cortados
            const itemHeight = 80; // Altura aproximada de cada item (incluindo marginBottom)
            const paddingTop = 8;
            const paddingBottom = 16;
            const paddingVertical = paddingTop + paddingBottom;
            // Aumenta o espaço extra para garantir que o último item não seja cortado
            // Inclui o marginBottom do último item (6px) + espaço de segurança (20px)
            const extraSpace = 26;
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
                  {itens.map((item) => {
                    // Verifica se o item está próximo de vencer (0-3 dias)
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
                  })}
                </Animated.View>
              </View>
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
        onUndo={handleUndoDelete}
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
