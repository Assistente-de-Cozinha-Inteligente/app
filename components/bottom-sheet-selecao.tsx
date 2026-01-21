import { Colors } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ButtonUI } from './ui/button';
import { TextUI } from './ui/text';

type BottomSheetSelecaoProps = {
  visible: boolean;
  onClose: () => void;
  title: string;
  options: string[];
  selectedValue?: string | string[];
  onSelect: (value: string | string[]) => void;
  multiple?: boolean;
  showConfirmButton?: boolean; // Mostra botão de confirmar mesmo em seleção única
};

export function BottomSheetSelecao({
  visible,
  onClose,
  title,
  options,
  selectedValue,
  onSelect,
  multiple = false,
  showConfirmButton = false,
}: BottomSheetSelecaoProps) {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>(() => {
    if (multiple && Array.isArray(selectedValue)) {
      return selectedValue;
    }
    if (selectedValue && typeof selectedValue === 'string') {
      return [selectedValue];
    }
    return [];
  });

  // Calcula altura dinâmica baseada no número de opções
  const snapPoints = useMemo(() => {
    // Altura aproximada de cada elemento
    const headerHeight = 72; // Header com padding
    const optionHeight = 48; // Cada opção (padding + texto)
    const confirmButtonHeight = (multiple || showConfirmButton) ? 80 : 0; // Botão de confirmar (se múltipla ou showConfirmButton)
    const paddingExtra = 40; // Padding extra e espaçamentos
    
    // Calcula altura total baseada no número de opções
    const totalHeight = headerHeight + (options.length * optionHeight) + confirmButtonHeight + paddingExtra;
    
    // Limita entre 35% e 85% da tela
    // Para poucas opções, usa altura mínima, para muitas, altura máxima
    const minHeight = 35;
    const maxHeight = 85;
    
    // Calcula porcentagem baseada na altura total
    // Assumindo altura de tela padrão de ~800px
    const screenHeight = 800;
    const calculatedPercentage = (totalHeight / screenHeight) * 100;
    
    // Garante que está dentro dos limites
    const finalPercentage = Math.max(minHeight, Math.min(maxHeight, calculatedPercentage));
    
    return [`${Math.round(finalPercentage)}%`];
  }, [options.length, multiple, showConfirmButton]);

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
    if (visible) {
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [visible]);

  // Atualizar selectedItems quando selectedValue mudar
  useEffect(() => {
    if (multiple && Array.isArray(selectedValue)) {
      setSelectedItems(selectedValue);
    } else if (!multiple && typeof selectedValue === 'string') {
      setSelectedItems([selectedValue]);
    } else {
      setSelectedItems([]);
    }
  }, [selectedValue, multiple]);

  const handleSelect = (value: string) => {
    if (multiple) {
      const isNenhuma = value === 'Nenhuma';
      const hasNenhuma = selectedItems.includes('Nenhuma');
      
      if (isNenhuma) {
        // Se selecionar "Nenhuma", remove todas as outras e deixa só "Nenhuma"
        setSelectedItems(['Nenhuma']);
      } else {
        // Se selecionar outra opção, remove "Nenhuma" se estiver selecionada
        let newSelected = selectedItems.includes(value)
          ? selectedItems.filter(item => item !== value)
          : [...selectedItems, value];
        
        // Remove "Nenhuma" se houver outras opções selecionadas
        if (hasNenhuma && newSelected.length > 0) {
          newSelected = newSelected.filter(item => item !== 'Nenhuma');
        }
        
        setSelectedItems(newSelected);
      }
    } else {
      // Em seleção única, sempre fecha ao selecionar
      setSelectedItems([value]);
      onSelect(value);
      bottomSheetRef.current?.dismiss();
      onClose();
    }
  };

  const handleConfirm = () => {
    if (multiple) {
      onSelect(selectedItems);
    } else if (showConfirmButton && selectedItems.length > 0) {
      // Em seleção única com botão de confirmar, usa o primeiro item selecionado
      onSelect(selectedItems[0]);
    }
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

        {/* Lista de opções */}
        <BottomSheetScrollView
          style={styles.optionsList}
          showsVerticalScrollIndicator={false}
        >
          {options.map((option, index) => {
            const isSelected = multiple
              ? selectedItems.includes(option)
              : selectedValue === option;
            return (
              <TouchableOpacity
                key={index}
                onPress={() => handleSelect(option)}
                style={[
                  styles.optionItem,
                  index === options.length - 1 && !multiple && styles.optionItemLast,
                ]}
                activeOpacity={0.7}
              >
                <TextUI
                  variant="regular"
                  style={[
                    styles.optionText,
                    isSelected && styles.optionTextSelected,
                  ]}
                >
                  {option}
                </TextUI>
                {isSelected && (
                  <Ionicons
                    name={multiple ? "checkmark-circle" : "checkmark"}
                    size={20}
                    color={Colors.light.primary}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </BottomSheetScrollView>

        {/* Botão de confirmar (para seleção múltipla ou quando showConfirmButton é true) */}
        {(multiple || showConfirmButton) && (
          <View style={styles.confirmButtonContainer}>
            <ButtonUI
              title="CONFIRMAR"
              onPress={handleConfirm}
              variant="primary"
              disabled={selectedItems.length === 0}
            />
          </View>
        )}
      </BottomSheetView>
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
    height: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
  },
  title: {
    fontSize: 20,
    color: Colors.light.mainText,
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  optionsList: {
    flex: 1,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  optionItemLast: {
    borderBottomWidth: 0,
  },
  optionText: {
    fontSize: 16,
    color: Colors.light.mainText,
    flex: 1,
  },
  optionTextSelected: {
    color: Colors.light.primary,
  },
  confirmButtonContainer: {
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#EBEBEB',
  },
});

