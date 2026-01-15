import { Colors } from '@/constants/theme';
import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import { ButtonUI } from './ui/button';
import { TextUI } from './ui/text';

type CardReceitaFazerProps = {
    imageUri?: string;
    title: string;
    time: string;
    servings: string;
    description: string;
    onFazerAgora?: () => void;
    onProxima?: () => void;
    isLast?: boolean;
};

export function CardReceitaFazer({
    imageUri,
    title,
    time,
    servings,
    description,
    onFazerAgora,
    onProxima,
    isLast = false,
}: CardReceitaFazerProps) {
    return (
        <View style={styles.container}>
            <View style={styles.contentContainer}>
                <Image source={{ uri: imageUri }} style={styles.image} />
                <View style={styles.infoContainer}>
                    <TextUI variant="medium" style={styles.title}>{title}</TextUI>
                    <View style={styles.infoTextContainer}>
                        <TextUI variant="regular" style={styles.time}>{time}</TextUI>
                        <TextUI variant="regular" style={styles.separator}>|</TextUI>
                        <TextUI variant="regular" style={styles.servings}>{servings}</TextUI>
                    </View>
                    <TextUI variant="light" style={styles.description}>{description}</TextUI>
                </View>
            </View>
            <View style={styles.actionsContainer}>
                <View style={styles.buttonFazerAgora}>
                    <ButtonUI
                        title="FAZER AGORA"
                        onPress={onFazerAgora || (() => { })}
                        variant="primary"
                        style={styles.buttonFazerAgoraInner}
                        textStyle={styles.buttonText}
                    />
                </View>
                <View style={styles.buttonProxima}>
                    <ButtonUI
                        title={isLast ? "VER MAIS" : "Proxima"}
                        onPress={onProxima || (() => { })}
                        variant="default"
                        style={styles.buttonProximaInner}
                        textStyle={styles.buttonText}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.light.white,
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderWidth: 1,
        borderColor: "#EBEBEB",
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
    },
    image: {
        width: 90,
        height: 90,
        borderRadius: 12,
    },
    infoContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: 4,
    },
    infoTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    title: {
        fontSize: 18,
        color: Colors.light.mainText,
        marginBottom: 4,
    },
    time: {
        fontSize: 14,
        color: Colors.light.bodyText,
    },
    separator: {
        fontSize: 14,
        color: Colors.light.bodyText,
        opacity: 0.7,
    },
    servings: {
        fontSize: 14,
        color: Colors.light.bodyText,
    },
    description: {
        fontSize: 14,
        color: Colors.light.bodyText,
        marginTop: 2,
    },
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginTop: 8,
    },
    buttonFazerAgora: {
        flex: 2,
    },
    buttonFazerAgoraInner: {
        paddingVertical: 10,
        minHeight: 42,
        borderRadius: 12,
    },
    buttonProxima: {
        flex: 1,
    },
    buttonProximaInner: {
        paddingVertical: 10,
        minHeight: 42,
        borderRadius: 12,
    },
    buttonText: {
        fontSize: 13,
    },
});