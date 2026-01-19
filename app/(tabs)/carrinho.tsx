import { BottomSheetEditarItemLista } from '@/components/bottom-sheet-editar-item-lista';
import { CardItemLista } from '@/components/card-item-lista';
import { FloatingAddButton } from '@/components/ui/floating-add-button';
import { PageHeader } from '@/components/ui/page-header';
import { ScrollViewWithPadding } from '@/components/ui/scroll-view-with-padding';
import { TextUI } from '@/components/ui/text';
import { Toast } from '@/components/ui/toast';
import { ViewContainerUI } from '@/components/ui/view-container';
import { Colors } from '@/constants/theme';
import { atualizarMarcadoItemListaCompras, atualizarQuantidadeUnidadeItemListaCompras, excluirItemListaCompras, getListaCompras } from '@/data/local/dao/listaComprasDao';
import { ListaCompras, LocalIngrediente } from '@/models';
import { handleShareCarrinho } from '@/share/shareCarrinho';
import { getNomeLocal } from '@/utils/localHelper';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Animated, BackHandler, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function CarrinhoScreen() {
  const [listaCompras, setListaCompras] = useState<ListaCompras[]>([]);
  const [expandedLocals, setExpandedLocals] = useState<Record<string, boolean>>({});
  const [animations, setAnimations] = useState<Record<string, Animated.Value>>({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [itensEnviadosCount, setItensEnviadosCount] = useState(0);

  // Calcula quantos itens estão marcados
  const itensMarcados = useMemo(() => {
    return listaCompras.filter(item => item.marcado);
  }, [listaCompras]);

  const temItensMarcados = itensMarcados.length > 0;

  // Agrupa itens por local
  const itensPorLocal = useMemo(() => {
    const grupos: Record<string, ListaCompras[]> = {};

    listaCompras.forEach(item => {
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
  }, [listaCompras]);

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

  const handleItemCheck = async (ingrediente_id: number, checked: boolean) => {
    // Atualiza localmente
    setListaCompras(listaCompras.map(item =>
      item.ingrediente_id === ingrediente_id ? { ...item, marcado: checked } : item
    ));

    // Atualiza apenas o campo marcado no banco (não altera a quantidade)
    await atualizarMarcadoItemListaCompras(ingrediente_id, checked);
  };

  const handleItemRemove = async (ingrediente_id: number) => {
    // Remove localmente
    setListaCompras(listaCompras.filter(item => item.ingrediente_id !== ingrediente_id));

    // Remove no banco (soft delete)
    await excluirItemListaCompras([ingrediente_id]);
  };

  const handleAddItem = () => {
    router.push('/adicionar-item-lista');
  };

  const [editingItem, setEditingItem] = useState<ListaCompras | null>(null);

  const handleItemPress = (item: ListaCompras) => {
    // Abre o bottom sheet para editar o item
    setEditingItem(item);
  };

  const handleSaveItem = async (quantidade: number, unidade: string) => {
    if (!editingItem) return;

    try {
      // Atualiza apenas a quantidade e unidade (substitui, não soma)
      await atualizarQuantidadeUnidadeItemListaCompras(
        editingItem.ingrediente_id,
        quantidade,
        unidade
      );

      // Recarrega a lista do banco para garantir sincronização
      const listaAtualizada = await getListaCompras();
      setListaCompras(listaAtualizada);

      setEditingItem(null);
    } catch (error) {
      console.error('Erro ao salvar item:', error);
    }
  };

  const handleAdicionarNaCozinha = async () => {
    try {
      // Guarda o número de itens antes de removê-los
      const quantidadeItens = itensMarcados.length;

      // TODO: Implementar lógica para adicionar itens marcados ao inventário
      // Por enquanto, apenas remove os itens marcados da lista de compras
      await excluirItemListaCompras(itensMarcados.map(item => item.ingrediente_id));

      // Atualiza a lista local removendo os itens marcados
      setListaCompras(listaCompras.filter(item => !item.marcado));

      // Mostra mensagem de sucesso
      setItensEnviadosCount(quantidadeItens);
      setShowSuccessMessage(true);
    } catch (error) {
      console.error('Erro ao adicionar itens na cozinha:', error);
    }
  };

  const handleShare = async () => {
    handleShareCarrinho(listaCompras || []);
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
      getListaCompras().then((lista) => {
        setListaCompras(lista);
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
        title="Lista de compras"
        description="Gerencie suas compras"
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
            const isExpanded = expandedLocals[local] ?? true;
            const animValue = animations[local] || new Animated.Value(1);

            // Calcula altura máxima baseada no número de itens
            // CardItemLista: paddingVertical (10*2) + marginBottom (6) + altura do conteúdo (~44) = ~70px
            // Adiciona margem extra para evitar corte
            const itemHeight = 70; // Altura aproximada de cada item (incluindo marginBottom)
            const paddingTop = 8;
            const paddingBottom = 16;
            const paddingVertical = paddingTop + paddingBottom;
            // Adiciona espaço extra para garantir que o último item não seja cortado
            // Inclui o marginBottom do último item (6px) + espaço de segurança (10px)
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
                    <CardItemLista
                      key={`${item.usuario_id}-${item.ingrediente_id}`}
                      item={item}
                      onItemPress={handleItemPress}
                      onItemCheck={handleItemCheck}
                      onItemRemove={handleItemRemove}
                    />
                  ))}
                </Animated.View>
              </View>
            );
          })}
        </View>
      </ScrollViewWithPadding>

      {/* Mensagem de confirmação */}
      <Toast
        visible={showSuccessMessage}
        message={`${itensEnviadosCount} ${itensEnviadosCount === 1 ? 'item enviado' : 'itens enviados'} para cozinha!`}
        type="success"
        onHide={() => setShowSuccessMessage(false)}
      />

      {/* Bottom Sheet para editar item */}
      <BottomSheetEditarItemLista
        item={editingItem && editingItem.ingrediente ? {
          ingrediente: editingItem.ingrediente,
          quantidade: editingItem.quantidade,
          unidade: editingItem.unidade,
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
