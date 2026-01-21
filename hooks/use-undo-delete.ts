import { useEffect, useRef, useState } from 'react';

type ItemWithId = {
  ingrediente_id: number;
  [key: string]: any;
};

type UseUndoDeleteOptions<T extends ItemWithId> = {
  onConfirmDelete: (items: T[]) => Promise<void>;
  onCleanup?: (items: T[]) => void;
};

/**
 * Hook para gerenciar lógica de undo para exclusão de itens
 */
export function useUndoDelete<T extends ItemWithId>({
  onConfirmDelete,
  onCleanup,
}: UseUndoDeleteOptions<T>) {
  const [deletingItems, setDeletingItems] = useState<T[]>([]);
  const [showUndoToast, setShowUndoToast] = useState(false);
  const [toastUndoKey, setToastUndoKey] = useState(0);

  // Ref para armazenar os itens sendo excluídos, para usar no cleanup
  const deletingItemsRef = useRef<T[]>([]);

  useEffect(() => {
    deletingItemsRef.current = deletingItems;
  }, [deletingItems]);

  const handleItemRemove = (item: T) => {
    // Adiciona o item à lista de itens sendo excluídos (suporta múltiplos)
    setDeletingItems(prev => {
      const exists = prev.some(i => i.ingrediente_id === item.ingrediente_id);
      if (exists) return prev;
      return [...prev, item];
    });

    // Força reset do timer quando um novo item é adicionado
    setToastUndoKey(prev => prev + 1);
    setShowUndoToast(true);
  };

  const handleUndoDelete = () => {
    setDeletingItems([]);
    setShowUndoToast(false);
  };

  const handleConfirmDelete = async () => {
    if (deletingItems.length === 0) return;

    const itemsToDelete = [...deletingItems];
    try {
      await onConfirmDelete(itemsToDelete);
    } finally {
      setDeletingItems([]);
      setShowUndoToast(false);
    }
  };

  const cleanup = () => {
    const itemsToDelete = deletingItemsRef.current;
    if (itemsToDelete.length > 0) {
      if (onCleanup) {
        onCleanup(itemsToDelete);
      }
      handleConfirmDelete();
    }
    setShowUndoToast(false);
  };

  const syncWithItems = (currentItems: T[]) => {
    setDeletingItems(prev => {
      const stillExist = prev.filter(item =>
        currentItems.some(ci => ci.ingrediente_id === item.ingrediente_id)
      );
      if (stillExist.length !== prev.length) {
        setShowUndoToast(false);
      }
      return stillExist;
    });
  };

  return {
    deletingItems,
    showUndoToast,
    toastUndoKey,
    handleItemRemove,
    handleUndoDelete,
    handleConfirmDelete,
    cleanup,
    syncWithItems,
    setShowUndoToast,
  };
}

