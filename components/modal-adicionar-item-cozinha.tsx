import { Colors } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Modal, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SuggestionButton } from './suggestion-button';
import { ButtonUI } from './ui/button';
import { InputUI } from './ui/input';
import { PickerUI } from './ui/picker';
import { TextUI } from './ui/text';

type ModalAdicionarItemCozinhaProps = {
    visible: boolean;
    onClose: () => void;
    onSave: (itemName: string, quantity: string, expirationDate?: string, location?: string) => void;
    initialItemName?: string;
    initialQuantity?: string;
    initialExpirationDate?: string;
    initialLocation?: string;
    suggestions?: string[];
    locations?: string[];
    isEditing?: boolean;
};

export function ModalAdicionarItemCozinha({
    visible,
    onClose,
    onSave,
    initialItemName = '',
    initialQuantity = '1',
    initialExpirationDate = '',
    initialLocation = '',
    suggestions = ['Arroz', 'Feijão', 'Ovos', 'Tomate', 'Cebola'],
    locations = ['Hortifruti', 'Bebidas', 'Carnes', 'Laticínios', 'Padaria', 'Limpeza', 'Outros'],
    isEditing = false,
}: ModalAdicionarItemCozinhaProps) {
    const [itemName, setItemName] = useState(initialItemName);
    const [quantity, setQuantity] = useState(initialQuantity);
    const [location, setLocation] = useState(initialLocation);
    const [expirationDate, setExpirationDate] = useState<Date | null>(
        initialExpirationDate ? new Date(initialExpirationDate) : null
    );
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [modalWidth, setModalWidth] = useState(400);
    const insets = useSafeAreaInsets();

    const isNarrow = modalWidth <= 300;

    // Atualizar valores quando as props mudarem ou o modal abrir
    useEffect(() => {
        if (visible) {
            setItemName(initialItemName);
            setQuantity(initialQuantity || '1');
            setLocation(initialLocation || '');
            setExpirationDate(initialExpirationDate ? new Date(initialExpirationDate) : null);
        }
    }, [visible, initialItemName, initialQuantity, initialExpirationDate, initialLocation]);

    const handleSave = () => {
        if (itemName.trim()) {
            const expirationDateString = expirationDate
                ? expirationDate.toISOString().split('T')[0]
                : undefined;
            onSave(itemName.trim(), quantity, expirationDateString, location || undefined);
            handleClose();
        }
    };

    const handleClose = () => {
        setItemName(initialItemName);
        setQuantity(initialQuantity);
        setLocation(initialLocation || '');
        setExpirationDate(initialExpirationDate ? new Date(initialExpirationDate) : null);
        setShowDatePicker(false);
        onClose();
    };

    const handleSuggestionPress = (suggestion: string) => {
        setItemName(suggestion);
    };

    const handleQuantityChange = (delta: number) => {
        const currentQty = parseInt(quantity) || 1;
        const newQty = Math.max(1, currentQty + delta);
        setQuantity(newQty.toString());
    };

    const formatDate = (date: Date | null): string => {
        if (!date) return '';
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (event.type === 'set' && selectedDate) {
            setExpirationDate(selectedDate);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={handleClose}
            statusBarTranslucent={true}
        >
            <StatusBar style="light" />
            <View
                className="justify-center items-center"
                style={{
                    ...StyleSheet.absoluteFillObject,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    top: -insets.top,
                    bottom: -insets.bottom,
                }}
            >
                <KeyboardAvoidingView behavior="padding">
                    <Pressable
                        style={StyleSheet.absoluteFillObject}
                        onPress={handleClose}
                    />
                    <View
                        className="w-[90%] max-w-[400px]"
                        onLayout={(e) => {
                            const { width } = e.nativeEvent.layout;
                            setModalWidth(width);
                        }}
                    >
                        <View className="bg-white rounded-2xl p-5 max-h-[100%]">
                            {/* Header */}
                            <View className="flex-row items-center justify-between mb-5 relative">
                                <View className="w-0" />
                                <View className="flex-1 items-center">
                                    <TextUI variant="semibold" style={{ fontSize: 20, color: Colors.light.mainText }}>
                                        {isEditing ? 'Editar item' : 'Adicionar item'}
                                    </TextUI>
                                </View>
                                <View className="absolute right-0">
                                    <TouchableOpacity onPress={handleClose} className="p-1">
                                        <Ionicons name="close" size={24} color={Colors.light.mainText} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <ScrollView
                                keyboardShouldPersistTaps="handled"
                                showsVerticalScrollIndicator={false}
                            >
                                {/* Input do item */}
                                <View className="mb-6">
                                    <View className={isNarrow ? "flex-col gap-3" : "flex-row gap-3 items-start"}>
                                        <View className="flex-1">
                                            <TextUI variant="regular" style={{ fontSize: 14, color: Colors.light.mainText, marginBottom: 8 }}>
                                                Digite o item
                                            </TextUI>
                                            <InputUI
                                                placeholder=""
                                                value={itemName}
                                                onChangeText={setItemName}
                                                borderColor={itemName.trim() ? 'success' : null}
                                            />
                                        </View>

                                        {/* Input de quantidade */}
                                        <View className={isNarrow ? "w-full" : "w-[100px]"}>
                                            <TextUI variant="regular" style={{ fontSize: 14, color: Colors.light.mainText, marginBottom: 8 }}>
                                                Qtd
                                            </TextUI>
                                            <View className="flex-row items-center gap-2">
                                                <View className="flex-1">
                                                    <InputUI
                                                        placeholder=""
                                                        value={quantity}
                                                        onChangeText={(text) => {
                                                            const num = parseInt(text) || 1;
                                                            setQuantity(Math.max(1, num).toString());
                                                        }}
                                                        keyboardType="numeric"
                                                        textAlign="center"
                                                        showClearButton={false}
                                                        borderColor={null}
                                                    />
                                                </View>
                                                <View className="flex-col">
                                                    <TouchableOpacity
                                                        onPress={() => handleQuantityChange(1)}
                                                        className="p-0.5"
                                                    >
                                                        <Ionicons name="chevron-up" size={14} color={Colors.light.mainText} />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        onPress={() => handleQuantityChange(-1)}
                                                        className="p-0.5"
                                                    >
                                                        <Ionicons name="chevron-down" size={14} color={Colors.light.mainText} />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                {/* Campo de Validade */}
                                <View className="mb-6">
                                    <TextUI variant="regular" style={{ fontSize: 14, color: Colors.light.mainText, marginBottom: 8 }}>
                                        Validade
                                    </TextUI>
                                    <TouchableOpacity
                                        onPress={() => setShowDatePicker(true)}
                                        style={{
                                            height: 48,
                                            borderRadius: 12,
                                            paddingHorizontal: 16,
                                            backgroundColor: Colors.light.input,
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <TextUI
                                            variant="regular"
                                            style={{
                                                fontSize: 14,
                                                color: expirationDate ? Colors.light.mainText : Colors.light.bodyText
                                            }}
                                        >
                                            {expirationDate ? formatDate(expirationDate) : 'Selecione a data de validade'}
                                        </TextUI>
                                        <Ionicons name="calendar-outline" size={20} color={Colors.light.bodyText} />
                                    </TouchableOpacity>

                                    {showDatePicker && (
                                        <DateTimePicker
                                            value={expirationDate || new Date()}
                                            mode="date"
                                            display="default"
                                            onChange={handleDateChange}
                                            minimumDate={new Date()}
                                            textColor={"yellow"}
                                            accentColor={"#FF0000"}
                                        />
                                    )}
                                </View>

                                {/* Campo de Local (apenas ao editar) */}
                                {isEditing && (
                                    <View className="mb-6">
                                        <PickerUI
                                            label="Local"
                                            selectedValue={location}
                                            onValueChange={setLocation}
                                            items={locations.map(loc => ({ label: loc, value: loc }))}
                                            placeholder="Selecione o local"
                                        />
                                    </View>
                                )}

                                {/* Sugestões */}
                                <View className="mb-6">
                                    <TextUI variant="semibold" style={{ fontSize: 16, color: Colors.light.mainText, marginBottom: 12 }}>
                                        Sugestões
                                    </TextUI>
                                    <View className="flex-row flex-wrap gap-2">
                                        {suggestions.map((suggestion, index) => (
                                            <SuggestionButton
                                                key={index}
                                                label={suggestion}
                                                onPress={() => handleSuggestionPress(suggestion)}
                                            />
                                        ))}
                                    </View>
                                </View>

                                {/* Botão Adicionar */}
                                <View className="mt-2">
                                    <ButtonUI
                                        title={isEditing ? 'SALVAR ALTERAÇÕES' : 'ADICIONAR À LISTA'}
                                        onPress={handleSave}
                                        variant="primary"
                                        disabled={!itemName.trim()}
                                    />
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}

