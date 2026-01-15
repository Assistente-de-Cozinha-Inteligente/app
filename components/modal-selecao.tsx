import { Colors } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ButtonUI } from './ui/button';
import { TextUI } from './ui/text';

type ModalSelecaoProps = {
  visible: boolean;
  onClose: () => void;
  title: string;
  options: string[];
  selectedValue?: string | string[];
  onSelect: (value: string | string[]) => void;
  multiple?: boolean;
};

export function ModalSelecao({
  visible,
  onClose,
  title,
  options,
  selectedValue,
  onSelect,
  multiple = false,
}: ModalSelecaoProps) {
  const insets = useSafeAreaInsets();
  const [selectedItems, setSelectedItems] = useState<string[]>(
    multiple && Array.isArray(selectedValue) 
      ? selectedValue 
      : selectedValue 
        ? [selectedValue] 
        : []
  );

  // Atualizar selectedItems quando selectedValue mudar
  React.useEffect(() => {
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
      const newSelected = selectedItems.includes(value)
        ? selectedItems.filter(item => item !== value)
        : [...selectedItems, value];
      setSelectedItems(newSelected);
      onSelect(newSelected);
    } else {
      onSelect(value);
      onClose();
    }
  };

  const handleConfirm = () => {
    if (multiple) {
      onSelect(selectedItems);
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <StatusBar style="light" />
      <View
        style={[
          StyleSheet.absoluteFillObject,
          {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            top: -insets.top,
            bottom: -insets.bottom,
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}
      >
        <Pressable
          style={StyleSheet.absoluteFillObject}
          onPress={onClose}
        />
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <TextUI variant="semibold" style={styles.title}>
                {title}
              </TextUI>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={Colors.light.mainText} />
            </TouchableOpacity>
          </View>

          {/* Lista de opções */}
          <ScrollView
            style={styles.optionsList}
            showsVerticalScrollIndicator={false}
          >
            {options.map((option, index) => {
              const isSelected = multiple
                ? selectedItems.includes(option)
                : selectedValue === option;
              return (
                <Pressable
                  key={index}
                  onPress={() => handleSelect(option)}
                  style={[
                    styles.optionItem,
                    index === options.length - 1 && !multiple && styles.optionItemLast,
                  ]}
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
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Botão de confirmar (apenas para seleção múltipla) */}
          {multiple && (
            <View style={styles.confirmButtonContainer}>
              <ButtonUI
                title="CONFIRMAR"
                onPress={handleConfirm}
                variant="primary"
                disabled={selectedItems.length === 0}
              />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: Colors.light.white,
    borderRadius: 16,
    maxHeight: '80%',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    color: Colors.light.mainText,
  },
  closeButton: {
    padding: 4,
  },
  optionsList: {
    maxHeight: 400,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#EBEBEB',
  },
});

