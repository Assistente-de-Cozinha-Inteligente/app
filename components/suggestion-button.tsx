import { Colors } from '@/constants/theme';
import { Pressable } from 'react-native';
import { TextUI } from './ui/text';

type SuggestionButtonProps = {
  label: string;
  onPress: () => void;
};

export function SuggestionButton({ label, onPress }: SuggestionButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className="px-4 py-2.5 rounded-full bg-[#E5E5E5] active:opacity-70"
    >
      <TextUI variant="regular" style={{ fontSize: 14, color: Colors.light.mainText }}>
        {label}
      </TextUI>
    </Pressable>
  );
}

