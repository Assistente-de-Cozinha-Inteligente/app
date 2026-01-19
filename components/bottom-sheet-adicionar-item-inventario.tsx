import { Colors } from '@/constants/theme';
import { Ingrediente } from '@/models';
import { getUnidadesOptionsPorCategoria, Unidade } from '@/utils/unidadesHelper';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ButtonUI } from './ui/button';
import { InputUI } from './ui/input';
import { PickerUI } from './ui/picker';
import { TextUI } from './ui/text';

type BottomSheetAdicionarItemInventarioProps = {
  item: {
    ingrediente: Ingrediente;
    quantidade: number;
    unidade: string;
    validade: number | null; // timestamp (opcional)
  } | null;
  onClose: () => void;
  onSave: (quantidade: number, unidade: string, validade: number | null) => void;
};

export function BottomSheetAdicionarItemInventario({
  item,
  onClose,
  onSave,
}: BottomSheetAdicionarItemInventarioProps) {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [quantidade, setQuantidade] = useState('1');
  const [unidade, setUnidade] = useState<Unidade>('unidade');
  const [validade, setValidade] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const snapPoints = useMemo(() => ['65%'], []);

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
      // Atualiza quantidade, unidade e validade imediatamente
      setQuantidade(item.quantidade.toString());
      setUnidade(item.unidade as Unidade);
      setValidade(item.validade ? new Date(item.validade) : null);
      // Abre o bottom sheet modal
      bottomSheetRef.current?.present();
    } else {
      // Fecha o bottom sheet modal
      bottomSheetRef.current?.dismiss();
      // Limpa os dados quando fecha
      setQuantidade('1');
      setUnidade('unidade');
      setValidade(null);
    }
  }, [item]);

  const handleSave = () => {
    if (!item) return;

    const qty = parseInt(quantidade) || 1;
    // Permite salvar sem validade (null) se o usuário não selecionar uma data
    const validadeTimestamp = validade ? validade.getTime() : null;
    onSave(qty, unidade, validadeTimestamp);
    bottomSheetRef.current?.dismiss();
    onClose();
  };

  const handleQuantityChange = (delta: number) => {
    const currentQty = parseInt(quantidade) || 1;
    const newQty = Math.max(1, currentQty + delta);
    setQuantidade(newQty.toString());
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Não definida';
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
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
              Adicionar item
            </TextUI>
            <TouchableOpacity onPress={() => {
              bottomSheetRef.current?.dismiss();
              onClose();
            }} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={Colors.light.mainText} />
            </TouchableOpacity>
          </View>

          {/* Nome do ingrediente */}
          <View style={styles.ingredienteInfo}>
            <TextUI variant="semibold" style={styles.ingredienteNome}>
              {item.ingrediente.nome}
            </TextUI>
          </View>

          {/* Quantidade */}
          <View style={styles.section}>
            <TextUI variant="regular" style={styles.label}>
              Quantidade
            </TextUI>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                onPress={() => handleQuantityChange(-1)}
                style={styles.quantityButton}
              >
                <Ionicons name="remove" size={20} color={Colors.light.mainText} />
              </TouchableOpacity>
              <View style={styles.quantityInputContainer}>
                <InputUI
                  placeholder=""
                  value={quantidade}
                  onChangeText={(text) => {
                    const num = parseInt(text) || 1;
                    setQuantidade(Math.max(1, num).toString());
                  }}
                  keyboardType="numeric"
                  textAlign="center"
                  showClearButton={false}
                  borderColor={null}
                  containerStyle={styles.quantityInput}
                />
              </View>
              <TouchableOpacity
                onPress={() => handleQuantityChange(1)}
                style={styles.quantityButton}
              >
                <Ionicons name="add" size={20} color={Colors.light.mainText} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Unidade */}
          <View style={styles.section}>
            <TextUI variant="regular" style={styles.label}>
              Unidade
            </TextUI>
            <PickerUI
              label=""
              selectedValue={unidade}
              onValueChange={(value) => setUnidade(value as Unidade)}
              items={getUnidadesOptionsPorCategoria(item.ingrediente.categoria)}
              placeholder="Selecione a unidade"
            />
          </View>

          {/* Validade */}
          <View style={styles.section}>
            <TextUI variant="regular" style={styles.label}>
              Data de validade (opcional)
            </TextUI>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={styles.dateButton}
              activeOpacity={0.7}
            >
              <Ionicons name="calendar-outline" size={20} color={Colors.light.mainText} />
              <TextUI variant="regular" style={styles.dateText}>
                {formatDate(validade)}
              </TextUI>
              <Ionicons name="chevron-forward" size={18} color={Colors.light.bodyText} />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={validade || new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(Platform.OS === 'ios');
                  if (selectedDate) {
                    setValidade(selectedDate);
                  } else {
                    setValidade(null);
                  }
                }}
                minimumDate={new Date()}
              />
            )}
            {validade && (
              <TouchableOpacity
                onPress={() => setValidade(null)}
                style={styles.removeDateButton}
                activeOpacity={0.7}
              >
                <TextUI variant="regular" style={styles.removeDateText}>
                  Remover validade
                </TextUI>
              </TouchableOpacity>
            )}
          </View>

          {/* Botão Salvar */}
          <View style={styles.footer}>
            <ButtonUI
              title="ADICIONAR"
              onPress={handleSave}
              variant="primary"
              disabled={!unidade || parseInt(quantidade) < 1}
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
  ingredienteInfo: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.input,
  },
  ingredienteNome: {
    fontSize: 18,
    color: Colors.light.mainText,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: Colors.light.mainText,
    marginBottom: 12,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.input,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityInputContainer: {
    flex: 1,
  },
  quantityInput: {
    height: 48,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: Colors.light.input,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.input,
  },
  dateText: {
    flex: 1,
    fontSize: 14,
    color: Colors.light.mainText,
  },
  removeDateButton: {
    marginTop: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  removeDateText: {
    fontSize: 12,
    color: Colors.light.danger,
  },
  footer: {
    marginTop: 'auto',
    paddingBottom: 20,
  },
});

