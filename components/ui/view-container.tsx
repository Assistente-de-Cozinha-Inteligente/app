import { Colors } from '@/constants/theme';
import { useEffect } from 'react';
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
            paddingBottom: insets.bottom,
        }}>
            {children}
        </View>
    );
}
