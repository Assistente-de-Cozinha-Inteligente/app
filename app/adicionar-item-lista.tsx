import { ButtonUI } from '@/components/ui/button';
import { InputUI } from '@/components/ui/input';
import { TextUI } from '@/components/ui/text';
import { ViewContainerUI } from '@/components/ui/view-container';
import { Colors } from '@/constants/theme';
import { buscarIngredientesPorNome, getAllIngredientes } from '@/data/local/dao/ingredienteDao';
import { inserirAtualizarItemListaCompras } from '@/data/local/dao/listaComprasDao';
import { Ingrediente, LocalIngrediente } from '@/models';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ItemSelecionado = {
  ingrediente: Ingrediente;
  local?: LocalIngrediente;
};

export default function AdicionarItemListaScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const [ingredientesSugeridos, setIngredientesSugeridos] = useState<Ingrediente[]>([]);
  const [itensSelecionados, setItensSelecionados] = useState<ItemSelecionado[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const insets = useSafeAreaInsets();

  // Carrega ingredientes iniciais
  useEffect(() => {
    loadIngredientesIniciais();
  }, []);

  // Busca ingredientes quando o usuário digita
  useEffect(() => {
    if (searchTerm.trim().length === 0) {
      loadIngredientesIniciais();
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timeoutId = setTimeout(async () => {
      const resultados = await buscarIngredientesPorNome(searchTerm, 20);
      setIngredientesSugeridos(resultados);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const loadIngredientesIniciais = async () => {
    const todos = await getAllIngredientes();
    setIngredientesSugeridos(todos.slice(0, 20));
  };

  const handleAdicionarIngrediente = async (ingrediente: Ingrediente) => {
    // Verifica se já está selecionado
    const jaSelecionado = itensSelecionados.find(
      item => item.ingrediente.id === ingrediente.id
    );

    if (!jaSelecionado) {
      // Adiciona novo item
      setItensSelecionados([
        ...itensSelecionados,
        { ingrediente, local: ingrediente.local }
      ]);
    }
  };

  const handleRemoverIngrediente = (ingredienteId: number) => {
    setItensSelecionados(
      itensSelecionados.filter(item => item.ingrediente.id !== ingredienteId)
    );
  };


  const handleSalvar = async () => {
    try {
      // Insere ou atualiza os itens na lista de compras
      await inserirAtualizarItemListaCompras(itensSelecionados.map(item => ({
        ingrediente_id: item.ingrediente.id,
        marcado: false,
        precisa_sincronizar: true,
        local: item.ingrediente.local,
      })));

      router.back();
    } catch (error) {
      console.error('Erro ao salvar itens:', error);
    }
  };

  const renderItemSelecionado = ({ item }: { item: ItemSelecionado }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemCardContent}>
        <View style={styles.itemInfo}>
          <TextUI variant="semibold" style={styles.itemNome}>
            {item.ingrediente.nome}
          </TextUI>
        </View>
        <View style={styles.itemActions}>
          <TouchableOpacity
            onPress={() => handleRemoverIngrediente(item.ingrediente.id)}
            style={styles.removeButton}
          >
            <Ionicons name="close" size={18} color={Colors.light.danger} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderItemSugerido = ({ item }: { item: Ingrediente }) => {
    const jaSelecionado = itensSelecionados.some(
      selecionado => selecionado.ingrediente.id === item.id
    );

    return (
      <Pressable
        onPress={() => {
          handleAdicionarIngrediente(item);
        }}
        style={[
          styles.suggestionCard,
          jaSelecionado && styles.suggestionCardSelected
        ]}
      >
        <View style={styles.suggestionContent}>
          <View style={styles.suggestionInfo}>
            <TextUI variant="semibold" style={styles.suggestionNome}>
              {item.nome}
            </TextUI>
          </View>
          <View style={styles.suggestionAction}>
            {jaSelecionado ? (
              <View style={styles.checkIcon}>
                <Ionicons name="checkmark" size={18} color={Colors.light.white} />
              </View>
            ) : (
              <View style={styles.addIcon}>
                <Ionicons name="add" size={18} color={Colors.light.primary} />
              </View>
            )}
          </View>
        </View>
      </Pressable>
    );
  };

  return (
<ViewContainerUI isTabBar={false}>
  <KeyboardAvoidingView
    style={{ flex: 1 }}
  >
    {/* Pressable sem onPress para não consumir o evento */}
    <Pressable style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={Colors.light.mainText}
            />
          </TouchableOpacity>

          <TextUI variant="semibold" style={styles.headerTitle}>
            Adicionar itens
          </TextUI>

          <View style={styles.headerSpacer} />
        </View>

        {/* Barra de busca */}
        <View style={styles.searchContainer}>
          <InputUI
            placeholder="Digite o nome do ingrediente"
            value={searchTerm}
            onChangeText={setSearchTerm}
            containerStyle={styles.searchInput}
          />
          <Ionicons
            name="search"
            size={20}
            color={Colors.light.bodyText}
            style={styles.searchIcon}
          />
        </View>

        {/* Conteúdo */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Selecionados */}
          {itensSelecionados.length > 0 &&
            searchTerm.trim().length === 0 && (
              <View style={styles.section}>
                <TextUI variant="semibold" style={styles.sectionTitle}>
                  Selecionados
                </TextUI>

                <FlatList
                  data={itensSelecionados}
                  renderItem={renderItemSelecionado}
                  keyExtractor={(item) =>
                    item.ingrediente.id.toString()
                  }
                  scrollEnabled={false}
                  keyboardShouldPersistTaps="handled"
                />
              </View>
            )}

          {/* Sugeridos */}
          <View style={styles.section}>
            <TextUI variant="semibold" style={styles.sectionTitle}>
              Sugeridos
            </TextUI>

            {isSearching ? (
              <View style={styles.loadingContainer}>
                <TextUI variant="regular" style={styles.loadingText}>
                  Buscando...
                </TextUI>
              </View>
            ) : ingredientesSugeridos.length === 0 ? (
              <View style={styles.emptyContainer}>
                <TextUI variant="regular" style={styles.emptyText}>
                  Nenhum ingrediente encontrado
                </TextUI>
              </View>
            ) : (
              <FlatList
                data={ingredientesSugeridos}
                renderItem={renderItemSugerido}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
                keyboardShouldPersistTaps="handled"
              />
            )}
          </View>
        </ScrollView>

        {/* Botão de ação */}
        {itensSelecionados.length > 0 && (
          <View
            style={[
              styles.footer,
              { paddingBottom: insets.bottom + 16 },
            ]}
          >
            <ButtonUI
              title={`Adicionar ${itensSelecionados.length} ${
                itensSelecionados.length === 1 ? 'item' : 'itens'
              }`}
              onPress={handleSalvar}
              variant="primary"
            />
          </View>
        )}
      </View>
    </Pressable>
  </KeyboardAvoidingView>
</ViewContainerUI>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.input,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    color: Colors.light.mainText,
  },
  headerSpacer: {
    width: 40,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
    position: 'relative',
  },
  searchInput: {
    paddingLeft: 48,
  },
  searchIcon: {
    position: 'absolute',
    left: 36,
    top: 14,
    zIndex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    color: Colors.light.mainText,
    marginBottom: 12,
  },
  itemCard: {
    backgroundColor: Colors.light.white,
    borderRadius: 10,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: Colors.light.input,
  },
  itemCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemNome: {
    fontSize: 15,
    color: Colors.light.mainText,
    marginBottom: 2,
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestionCard: {
    backgroundColor: Colors.light.white,
    borderRadius: 10,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: Colors.light.input,
  },
  suggestionCardSelected: {
    borderColor: Colors.light.success,
    backgroundColor: `${Colors.light.success}10`,
  },
  suggestionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  suggestionInfo: {
    flex: 1,
  },
  suggestionNome: {
    fontSize: 15,
    color: Colors.light.mainText,
    marginBottom: 2,
  },
  suggestionAction: {
    marginLeft: 10,
  },
  addIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: `${Colors.light.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.light.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: Colors.light.bodyText,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: Colors.light.bodyText,
    fontStyle: 'italic',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: Colors.light.white,
    borderTopWidth: 1,
    borderTopColor: Colors.light.input,
  },
});

