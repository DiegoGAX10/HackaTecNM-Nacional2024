import React from 'react';
import { View, StyleSheet } from 'react-native';
import { UnityView } from 'react-native-unity-view';

const QRScreen = () => {
    return (
        <View style={styles.container}>
            <UnityView style={styles.unity} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    unity: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
});


export default QRScreen;
