import { ScrollView, ScrollViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ScrollViewWithPaddingProps = ScrollViewProps;

// Altura do botão flutuante (56px) + espaçamento (14px) = 70px
const FLOATING_BUTTON_HEIGHT = 70;

export function ScrollViewWithPadding({
  children,
  contentContainerStyle,
  ...props
}: ScrollViewWithPaddingProps) {
  const insets = useSafeAreaInsets();
  
  // Padding bottom: altura do botão + safe area bottom
  const paddingBottom = FLOATING_BUTTON_HEIGHT + insets.bottom;

  return (
    <ScrollView
      {...props}
      contentContainerStyle={[
        { paddingBottom },
        contentContainerStyle,
      ]}
    >
      {children}
    </ScrollView>
  );
}

