import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Linking,
    Alert,
    Platform,
} from 'react-native';

const QRScreen = () => {
    const openVortexApp = async () => {
        // Reemplaza 'com.tuempresa.vortex' con el identificador de paquete real de tu aplicación de Unity
        const vortexPackageName = 'com.UnityTechnologies.com.unity.template.urpblank';

        try {
            // Para Android
            if (Platform.OS === 'android') {
                await Linking.canOpenURL(`${vortexPackageName}://`).then(supported => {
                    if (supported) {
                        Linking.openURL(`${vortexPackageName}://`);
                    } else {
                        Alert.alert(
                            'Aplicación no encontrada',
                            'No se puede encontrar la aplicación Vortex.',
                            [{ text: 'OK' }]
                        );
                    }
                });
            }
        } catch (error) {
            console.error('Error al abrir la aplicación:', error);
            Alert.alert(
                'Error',
                'Ocurrió un problema al intentar abrir la aplicación.',
                [{ text: 'OK' }]
            );
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Abrir Vortex</Text>
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

// Estilos permanecen igual que en tu código original
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
