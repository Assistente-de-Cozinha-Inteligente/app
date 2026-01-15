import { CardCategoriaCozinha } from '@/components/card-categoria-cozinha';
import { ModalAdicionarItemCozinha } from '@/components/modal-adicionar-item-cozinha';
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
  expirationDate?: string; // Data de validade no formato YYYY-MM-DD
  location?: string;
};

export default function ListaScreen() {
  const [items, setItems] = useState<Item[]>([
    { 
      id: '1', 
      name: 'Tomates', 
      quantity: '2', 
      checked: false,
      expirationDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 dias
    },
    { 
      id: '2', 
      name: 'Cebolas', 
      quantity: '3', 
      checked: false,
      expirationDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 dias
    },
    { 
      id: '3', 
      name: 'limões', 
      quantity: '2', 
      checked: false,
      expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 dias
    },
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

  const handleSaveItem = (itemName: string, quantity: string, expirationDate?: string, location?: string) => {
    if (editingItem) {
      // Editar item existente
      setItems(items.map(item =>
        item.id === editingItem.id
          ? { ...item, name: itemName, quantity, expirationDate, location }
          : item
      ));
    } else {
      // Adicionar novo item
      const newItem: Item = {
        id: Date.now().toString(),
        name: itemName,
        quantity,
        checked: false,
        expirationDate,
        location,
      };
      setItems([...items, newItem]);
    }
  };

  const handleShare = async () => {
    // Coletar todos os itens não marcados
    const uncheckedItems = items.filter(item => !item.checked);

    if (uncheckedItems.length === 0) {
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
    const shareText = `🛒 Observe os itens da minha cozinha feita no app:\n\n${itemsList}\n\nGerado pelo ${appName}`;

    try {
      await Share.share({
        message: shareText,
      });
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };

  const suggestions = ['Arroz', 'Feijão', 'Ovos', 'Tomate', 'Cebola', 'Batata', 'Cenoura', 'Alho'];

  return (
    <ViewContainerUI>
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
        <SectionUI title="" style={{
          paddingHorizontal: 20,
        }}>
          <CardCategoriaCozinha
            category="Proteínas"
            icon="restaurant"
            iconColor="#E23D24"
            items={items}
            onItemCheck={handleItemCheck}
            onItemRemove={handleItemRemove}
            onAddItem={handleAddItem}
            onItemPress={handleItemPress}
          />
          <CardCategoriaCozinha
            category="Hortifruti"
            icon="nutrition"
            iconColor="#00B256"
            items={items}
            onItemCheck={handleItemCheck}
            onItemRemove={handleItemRemove}
            onAddItem={handleAddItem}
            onItemPress={handleItemPress}
          />
        </SectionUI>
      </ScrollViewWithPadding>

      <ModalAdicionarItemCozinha
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveItem}
        initialItemName={editingItem?.name || ''}
        initialQuantity={editingItem?.quantity || '1'}
        initialExpirationDate={editingItem?.expirationDate || ''}
        initialLocation={editingItem?.location || ''}
        suggestions={suggestions}
        locations={['Hortifruti', 'Bebidas', 'Carnes', 'Laticínios', 'Padaria', 'Limpeza', 'Outros']}
        isEditing={!!editingItem}
      />

      <FloatingAddButton onPress={handleAddItem} />
    </ViewContainerUI>
  );
}
