import { Colors } from '@/constants/theme';
import { Picker } from '@react-native-picker/picker';
import { StyleSheet, View } from 'react-native';
import { TextUI } from './text';

type PickerItem = {
  label: string;
  value: string;
};

type PickerUIProps = {
  label?: string;
  selectedValue: string;
  onValueChange: (value: string) => void;
  items: PickerItem[];
  placeholder?: string;
  containerStyle?: any;
};

export function PickerUI({
  label,
  selectedValue,
  onValueChange,
  items,
  placeholder = 'Selecione uma opção',
  containerStyle,
}: PickerUIProps) {
  return (
    <View style={containerStyle}>
      {label && (
        <TextUI variant="regular" style={styles.label}>
          {label}
        </TextUI>
      )}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={onValueChange}
          style={styles.picker}
        >
          <Picker.Item 
            label={placeholder} 
            value="" 
            color={Colors.light.bodyText}
          />
          {items.map((item, index) => (
            <Picker.Item
              key={index}
              label={item.label}
              value={item.value}
              color={Colors.light.mainText}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    color: Colors.light.mainText,
    marginBottom: 8,
  },
  pickerContainer: {
    borderRadius: 12,
    backgroundColor: Colors.light.input,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  picker: {
    width: '100%',
    color: Colors.light.mainText,
  },
});
