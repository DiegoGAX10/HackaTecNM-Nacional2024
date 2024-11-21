import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

const XploitScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <WebView
                source={{ uri: 'http://172.20.10.2:8050/' }}
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
        // Ensure that all style properties have valid values
        // For example, if you had a property like fontSize: 'large', replace it with a valid value
        // fontSize: 'large' -> fontSize: 20
    },
});

export default XploitScreen;