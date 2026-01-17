import { CardCategoriaCompra } from '@/components/card-categoria-compra';
import { ModalAdicionarItem } from '@/components/modal-adicionar-item';
import { FloatingAddButton } from '@/components/ui/floating-add-button';
import { PageHeader } from '@/components/ui/page-header';
import { ScrollViewWithPadding } from '@/components/ui/scroll-view-with-padding';
import { SectionUI } from '@/components/ui/section';
import { ViewContainerUI } from '@/components/ui/view-container';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Share, TouchableOpacity } from 'react-native';

type Item = {
  id: string;
  name: string;
  quantity?: string;
  checked?: boolean;
  location?: string;
};

export default function CarrinhoScreen() {
  const [items, setItems] = useState<Item[]>([
    { id: '1', name: 'Tomates', quantity: '2', checked: false },
    { id: '2', name: 'Cebolas', quantity: '3', checked: false },
    { id: '3', name: 'limões', quantity: '2', checked: false },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  const handleItemCheck = (itemId: string, checked: boolean) => {
    setItems(items.map(item =>
      item.id === itemId ? { ...item, checked } : item
    ));
  };

  const handleItemRemove = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setModalVisible(true);
  };

  const handleItemPress = (item: Item) => {
    setEditingItem(item);
    setModalVisible(true);
  };

  const handleSaveItem = (itemName: string, quantity: string, location?: string) => {
    if (editingItem) {
      // Editar item existente
      setItems(items.map(item =>
        item.id === editingItem.id
          ? { ...item, name: itemName, quantity, location }
          : item
      ));
    } else {
      // Adicionar novo item
      const newItem: Item = {
        id: Date.now().toString(),
        name: itemName,
        quantity,
        checked: false,
        location,
      };
      setItems([...items, newItem]);
    }
  };

  const suggestions = ['Arroz', 'Feijão', 'Ovos', 'Tomate', 'Cebola', 'Batata', 'Cenoura', 'Alho'];

  const handleShare = async () => {
    // Coletar todos os itens não marcados
    const uncheckedItems = items.filter(item => !item.checked);

    if (uncheckedItems.length === 0) {
      // Se não houver itens, pode mostrar uma mensagem ou não fazer nada
      return;
    }

    // Formatar a lista no formato especificado
    const itemsList = uncheckedItems.map(item => {
      if (item.quantity) {
        return `• ${item.name} (${item.quantity})`;
      }
      return `• ${item.name}`;
    }).join('\n\n');

    const appName = process.env.EXPO_PUBLIC_APP_NAME;
    const shareText = `🛒 Observe minha lista de compras feita no app:\n\n${itemsList}\n\nGerado pelo ${appName}`;

    try {
      await Share.share({
        message: shareText,
      });
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };
  const receitasFazer = [
    {
      imageUri: "https://www.diadepeixe.com.br/extranet/thumbnail/crop/550x360/Receita/shutterstock_2105735288_1746448515362.jpg",
      title: "Frango com legumes",
      time: "20 min",
      servings: "1 pessoa",
      description: "Usa ingredientes comuns",
      onFazerAgora: () => console.log('Fazer agora 1'),
      onProxima: () => console.log('Próxima 1'),
    },
    {
      imageUri: "https://www.diadepeixe.com.br/extranet/thumbnail/crop/550x360/Receita/shutterstock_2105735288_1746448515362.jpg",
      title: "Salmão grelhado",
      time: "25 min",
      servings: "2 pessoas",
      description: "Receita rápida e saudável",
      onFazerAgora: () => console.log('Fazer agora 2'),
      onProxima: () => console.log('Próxima 2'),
    },
    {
      imageUri: "https://www.diadepeixe.com.br/extranet/thumbnail/crop/550x360/Receita/shutterstock_2105735288_1746448515362.jpg",
      title: "Massa com molho",
      time: "15 min",
      servings: "1 pessoa",
      description: "Perfeito para o almoço",
      onFazerAgora: () => console.log('Fazer agora 3'),
      onProxima: () => console.log('Próxima 3'),
    },
  ];

  const receitas = [
    {
      imageUri: "https://www.diadepeixe.com.br/extranet/thumbnail/crop/550x360/Receita/shutterstock_2105735288_1746448515362.jpg",
      category: "Sushi",
      title: "Sushi",
      time: "35 min",
      servings: "2 pessoas",
      difficulty: "Fácil",
      onPress: () => console.log('Sushi'),
    },
    {
      imageUri: "https://www.diadepeixe.com.br/extranet/thumbnail/crop/550x360/Receita/shutterstock_2105735288_1746448515362.jpg",
      category: "Sushi",
      title: "Sushi",
      time: "35 min",
      servings: "2 pessoas",
      difficulty: "Fácil",
      onPress: () => console.log('Sushi 2'),
    },
    {
      imageUri: "https://www.diadepeixe.com.br/extranet/thumbnail/crop/550x360/Receita/shutterstock_2105735288_1746448515362.jpg",
      category: "Sushi",
      title: "Sushi",
      time: "35 min",
      servings: "2 pessoas",
      difficulty: "Fácil",
      onPress: () => console.log('Sushi 3'),
    },
  ];

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
        <SectionUI title="" style={{
          paddingHorizontal: 20,
        }}>
          <CardCategoriaCompra
            category="Hortifruti"
            icon="nutrition"
            iconColor="#00B256"
            items={items}
            onItemCheck={handleItemCheck}
            onItemRemove={handleItemRemove}
            onAddItem={handleAddItem}
            onItemPress={handleItemPress}
          />
          <CardCategoriaCompra
            category="Bebidas"
            icon="beer"
            iconColor="#00B256"
            items={items}
            onItemCheck={handleItemCheck}
            onItemRemove={handleItemRemove}
            onAddItem={handleAddItem}
            onItemPress={handleItemPress}
          />
        </SectionUI>

      </ScrollViewWithPadding>

      <ModalAdicionarItem
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveItem}
        initialItemName={editingItem?.name || ''}
        initialQuantity={editingItem?.quantity || '1'}
        initialLocation={editingItem?.location || ''}
        suggestions={suggestions}
        locations={['Hortifruti', 'Bebidas', 'Carnes', 'Laticínios', 'Padaria', 'Limpeza', 'Outros']}
        isEditing={!!editingItem}
      />

      <FloatingAddButton onPress={handleAddItem} />
    </ViewContainerUI>
  );
} 
