import { ListaCompras } from '@/models';
import { Share } from 'react-native';

export const handleShareCarrinho = async (items: ListaCompras[]) => {
    // Coletar todos os itens não marcados
    const uncheckedItems = items.filter(item => !item.marcado);

    if (uncheckedItems.length === 0) {
        // Se não houver itens, pode mostrar uma mensagem ou não fazer nada
        return;
    }

    // Formatar a lista no formato especificado
    const itemsList = uncheckedItems.map(item => {
        if (item.quantidade) {
            return `• ${item.ingrediente?.nome} (${item.quantidade})`;
        }
        return `• ${item.ingrediente?.nome}`;
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