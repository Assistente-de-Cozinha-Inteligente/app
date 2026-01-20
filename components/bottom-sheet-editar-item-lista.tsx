import { Colors } from '@/constants/theme';
import { Ingrediente } from '@/models';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ButtonUI } from './ui/button';
import { TextUI } from './ui/text';

type BottomSheetEditarItemListaProps = {
  item: {
    ingrediente: Ingrediente;
  } | null;
  onClose: () => void;
  onSave: () => void;
  title?: string;
  buttonTitle?: string;
};

export function BottomSheetEditarItemLista({
  item,
  onClose,
  onSave,
  title = 'Editar item',
  buttonTitle = 'SALVAR ALTERAÇÕES',
}: BottomSheetEditarItemListaProps) {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  // Se for para adicionar à lista (title customizado), usa snapPoints menor
  const isAddToCart = title === 'Adicionar na lista de compras';
  const snapPoints = useMemo(() => isAddToCart ? ['45%'] : ['40%'], [isAddToCart]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  useEffect(() => {
    if (item) {
      // Abre o bottom sheet modal
      bottomSheetRef.current?.present();
    } else {
      // Fecha o bottom sheet modal
      bottomSheetRef.current?.dismiss();
    }
  }, [item]);

  const handleSave = () => {
    if (!item) return;

    onSave();
    bottomSheetRef.current?.dismiss();
    onClose();
  };

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose
      onDismiss={onClose}
      backgroundStyle={styles.bottomSheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
      enableDynamicSizing={false}
      backdropComponent={renderBackdrop}
    >
      {item && (
        <BottomSheetView style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TextUI variant="semibold" style={styles.title}>
              {title}
            </TextUI>
            <TouchableOpacity onPress={() => {
              bottomSheetRef.current?.dismiss();
              onClose();
            }} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={Colors.light.mainText} />
            </TouchableOpacity>
          </View>

          {/* Conteúdo principal */}
          <View style={styles.mainContent}>
            {/* Ícone visual */}
            {isAddToCart && (
              <View style={styles.iconContainer}>
                <View style={styles.iconCircle}>
                  <Ionicons name="cart" size={32} color={Colors.light.primary} />
                </View>
              </View>
            )}

            {/* Nome do ingrediente */}
            <View style={styles.ingredienteInfo}>
              <TextUI variant="semibold" style={styles.ingredienteNome}>
                {item.ingrediente.nome}
              </TextUI>
              {isAddToCart && (
                <TextUI variant="regular" style={styles.ingredienteDescription}>
                  Este item será adicionado à sua lista de compras
                </TextUI>
              )}
            </View>
          </View>

          {/* Botão Salvar */}
          <View style={styles.footer}>
            <ButtonUI
              title={buttonTitle}
              onPress={handleSave}
              variant="primary"
            />
          </View>
        </BottomSheetView>
      )}
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: Colors.light.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handleIndicator: {
    backgroundColor: Colors.light.bodyText,
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    color: Colors.light.mainText,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  iconContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.light.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ingredienteInfo: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  ingredienteNome: {
    fontSize: 22,
    color: Colors.light.mainText,
    marginBottom: 8,
    textAlign: 'center',
  },
  ingredienteDescription: {
    fontSize: 14,
    color: Colors.light.bodyText,
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    paddingBottom: 20,
  },
});

