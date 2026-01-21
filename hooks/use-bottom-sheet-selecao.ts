import { useState } from 'react';

type UseBottomSheetSelecaoReturn = {
  visible: boolean;
  title: string;
  options: string[];
  selectedValue: string | string[];
  onSelect: (value: string | string[]) => void;
  multiple: boolean;
  showConfirmButton: boolean;
  open: (
    title: string,
    options: string[],
    selectedValue: string | string[],
    onSelect: (value: string | string[]) => void,
    multiple?: boolean,
    showConfirmButton?: boolean
  ) => void;
  close: () => void;
};

/**
 * Hook para gerenciar estado do bottom sheet de seleção
 */
export function useBottomSheetSelecao(): UseBottomSheetSelecaoReturn {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [selectedValue, setSelectedValue] = useState<string | string[]>('');
  const [onSelect, setOnSelect] = useState<(value: string | string[]) => void>(() => { });
  const [multiple, setMultiple] = useState(false);
  const [showConfirmButton, setShowConfirmButton] = useState(false);

  const open = (
    newTitle: string,
    newOptions: string[],
    newSelectedValue: string | string[],
    newOnSelect: (value: string | string[]) => void,
    newMultiple: boolean = false,
    newShowConfirmButton: boolean = false
  ) => {
    setTitle(newTitle);
    setOptions(newOptions);
    setSelectedValue(newSelectedValue);
    setOnSelect(() => newOnSelect);
    setMultiple(newMultiple);
    setShowConfirmButton(newShowConfirmButton);
    setVisible(true);
  };

  const close = () => {
    setVisible(false);
  };

  return {
    visible,
    title,
    options,
    selectedValue,
    onSelect,
    multiple,
    showConfirmButton,
    open,
    close,
  };
}

