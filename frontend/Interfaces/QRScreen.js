import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Alert } from 'react-native';

const QRScanner = ({ navigation }) => {
    const openUnityApp = async () => {
        const url = 'vortex://open';

        const supported = await Linking.canOpenURL(url);

        if (supported) {
            await Linking.openURL(url);
        } else {
            Alert.alert(
                '',
                'Error al abrir',
                [{ text: 'OK' }]
            );
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>QR Scanner</Text>
            <TouchableOpacity style={styles.button} onPress={openUnityApp}>
                <Text style={styles.buttonText}>Open Unity Application</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#005B96',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
});

export default QRScanner;