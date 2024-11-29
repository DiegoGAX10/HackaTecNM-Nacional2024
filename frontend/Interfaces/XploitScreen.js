import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Speech from 'expo-speech';

const XploitScreen = ({ navigation }) => {
    useEffect(() => {
        // Reproducir un mensaje al cargar la pantalla
        Speech.speak("Generando modelo 3D");
    }, []);



    return (
        <View style={styles.container}>
            <WebView
                source={{ uri: 'http://10.186.8.85:8050/' }}
                style={styles.webview}
                originWhitelist={['*']}
                javaScriptEnabled
                domStorageEnabled
                startInLoadingState
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    webview: {
        flex: 1,
        marginTop: 60,
    },
});

export default XploitScreen;
