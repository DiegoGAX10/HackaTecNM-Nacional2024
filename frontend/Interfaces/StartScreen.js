import * as React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const StartScreen = ({ navigation }) => {

    return (

        <View style={styles.container}>
            <Image
                source={require('../assets/logo.png')}
                style={styles.logoImage}
            />
            <Text style={styles.tagline}></Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("Main")}
            >
                <Text style={styles.buttonText}>INICIA</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#151515',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoImage:{
        width:350,
        height:350,
        resizeMode:'contain',
        marginTop: 200,
    },
    logoText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#7cd6f9',
        marginBottom: 10,
        letterSpacing: 5,
    },
    tagline: {
        fontSize: 16,
        color: '#a8bfc9',
        marginBottom: 100,
        textAlign: 'bottom',
    },
    button: {
        backgroundColor: '#4d0f8e',
        paddingVertical: 15,
        paddingHorizontal: 180,
        borderRadius: 20,
        marginTop: 50,
    },
    buttonText: {
        fontSize: 18,
        color: '#ffffff',
        fontWeight: 'bold',
    },
});


export default StartScreen;