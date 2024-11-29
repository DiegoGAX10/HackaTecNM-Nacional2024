import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

const QRScreen = () => {
    const [isOpening, setIsOpening] = useState(false);

    const simulateAppOpen = () => {
        setIsOpening(true); // Muestra el indicador de carga

        // Simula una demora, como si estuviera cargando
        setTimeout(() => {
            setIsOpening(false); // Oculta el indicador de carga
            alert('La aplicación Vortex se ha abierto ');
        }, 3000); // 3 segundos de simulación
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Abrir Aplicación Vortex</Text>

            {isOpening ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#005B96" />
                    <Text style={styles.loadingText}>Abriendo Vortex...</Text>
                </View>
            ) : (
                <TouchableOpacity
                    style={styles.button}
                    onPress={simulateAppOpen}
                    activeOpacity={0.7}
                >
                    <Text style={styles.buttonText}>Abrir Vortex</Text>
                </TouchableOpacity>
            )}
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
    loadingContainer: {
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#555',
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
    },
});

export default QRScreen;
