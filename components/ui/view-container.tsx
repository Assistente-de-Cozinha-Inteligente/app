import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ViewContainerUIProps = {
    children: React.ReactNode;
    isTabBar?: boolean;
};

export function ViewContainerUI({
    children,
    isTabBar = false,
}: ViewContainerUIProps) {
    const insets = useSafeAreaInsets();

    return (
        <LinearGradient
            colors={['#FFF9F5', '#FFFFFF', '#F5F9FF']}
            locations={[0, 0.5, 1]}
            style={{
            flex: 1,
            paddingTop: insets.top,
                paddingBottom: isTabBar ? 0 : insets.bottom,
            }}
        >
            {children}
        </LinearGradient>
    );
}
