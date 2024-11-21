import * as React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Animated,
    Dimensions
} from 'react-native';
import { useEffect, useRef } from 'react';

const { width } = Dimensions.get('window');

const StartScreen = ({ navigation }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Animated.View style={[
                    styles.logoContainer,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }]
                    }
                ]}>
                    <Image
                        source={require('../assets/logo.png')}
                        style={styles.logoImage}
                    />
                </Animated.View>

                <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate("Empecemos")}
                >
                    <Text style={styles.buttonText}>INICIA</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 60,
    },
    logoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoImage: {
        width: width * 0.8,
        height: width * 0.8,
        resizeMode: 'contain',
        maxWidth: 400,
        maxHeight: 400,
    },
    button: {
        backgroundColor: '#4d0f8e',
        paddingVertical: 18,
        width: width * 0.85,
        maxWidth: 400,
        borderRadius: 25,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    buttonText: {
        fontSize: 18,
        color: '#ffffff',
        fontWeight: 'bold',
        textAlign: 'center',
        letterSpacing: 1,
    },
});

export default StartScreen;