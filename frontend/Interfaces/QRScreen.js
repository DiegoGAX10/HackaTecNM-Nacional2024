import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Linking,
    Platform,
    Alert
} from 'react-native';

const QRScreen = () => {
    const openVortexApp = async () => {
        // URL scheme para tu aplicación Vortex
        const vortexAppScheme = 'vortex://';

        try {
            // Verificar si la app Vortex está instalada
            const supported = await Linking.canOpenURL(vortexAppScheme);

            if (supported) {
                await Linking.openURL(vortexAppScheme);
            } else {
                Alert.alert(
                    'Aplicación no encontrada',
                    'La aplicación Vortex no está instalada o no está configurada correctamente.',
                    [{ text: 'OK' }]
                );
            }
        } catch (error) {
            console.error('Error al abrir Vortex:', error);
            Alert.alert(
                'Error',
                'No se pudo abrir la aplicación Vortex.',
                [{ text: 'OK' }]
            );
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Lanzador Vortex</Text>
            <TouchableOpacity
                style={styles.button}
                onPress={openVortexApp}
                activeOpacity={0.7}
            >
                <Text style={styles.buttonText}>Abrir Vortex</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f4f4f4',
    },
    title: {
        fontSize: 22,
        marginBottom: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    button: {
        backgroundColor: '#005B96',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    }
});

export default QRScreen;