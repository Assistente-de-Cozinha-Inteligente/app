import { AppState, AppStateStatus } from 'react-native';
import { useEffect, useRef } from 'react';

export function useAppBackground(onBackground: () => void) {
    const appState = useRef<AppStateStatus>(AppState.currentState);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextState => {
            if (
                appState.current === 'active' &&
                nextState === 'background'
            ) {
                console.log('App está em background');
                onBackground();
            }

            appState.current = nextState;
        });

        return () => subscription.remove();
    }, [onBackground]);
}
