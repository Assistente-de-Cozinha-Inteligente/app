import { Colors } from '@/constants/theme';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ViewContainerUIProps = {
    children: React.ReactNode;
};

export function ViewContainerUI({
    children,
}: ViewContainerUIProps) {
    const insets = useSafeAreaInsets();
    return (
        <View style={{
            flex: 1,
            paddingTop: insets.top,
            backgroundColor: Colors.light.white,
        }}>
                {children}
        </View>
    );
}
