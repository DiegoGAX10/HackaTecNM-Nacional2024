import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Keyboard,
    TextInput,
    TouchableOpacity,
    StatusBar,
    TouchableWithoutFeedback,
    Alert,
    Dimensions
} from 'react-native';
import axios from 'axios';
import { CommonActions } from '@react-navigation/native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const SignIn = ({ navigation }) => {
    const [controlNumber, setControlNumber] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const generateEmail = (controlNumber) => {
        return `${NumOperador}@volvo.mx`;
    };
    {/*}
    const handleSignIn = async () => {
        try {
            const email = generateEmail(controlNumber);
            const response = await axios.post('http://192.168.0.106:5000/users/signin', {
                email: email,
                password: password,
            });

            if (response.status === 200) {
                const { localId } = response.data;

                // Guarda el UID en AsyncStorage
                await AsyncStorage.setItem('userUID', localId);

                // Navega al Main y resetea el historial
                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{ name: 'Main' }],
                    })
                );
            } else {
                Alert.alert('Error de autenticación', 'No se pudo iniciar sesión. Intenta de nuevo.');
            }
        } catch (error) {
            console.error('Error en el inicio de sesión:', error);
            if (error.response && error.response.status === 401) {
                Alert.alert('Error', 'Número de control o contraseña incorrectos');
            } else {
                Alert.alert('Error', 'Ocurrió un error en el servidor');
            }
        }
    };/*/}

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <StatusBar barStyle="light-content" />

                {/* Header with gradient */}
                <LinearGradient
                    colors={['#1a237e', '#0d47a1']}
                    style={styles.header}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                    >
                        <MaterialIcons name="arrow-back" size={28} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Iniciar Sesión</Text>
                </LinearGradient>

                {/* Sign In Content */}
                <View style={styles.body}>
                    <View style={styles.welcomeContainer}>
                        <FontAwesome5 name="user-circle" size={80} color="#1a237e" />
                        <Text style={styles.welcomeTitle}>Bienvenido</Text>
                        <Text style={styles.welcomeSubtitle}>Ingresa tus credenciales</Text>
                    </View>

                    <View style={styles.inputContainer}>
                        <View style={styles.inputWrapper}>
                            <MaterialIcons
                                name="person-outline"
                                size={24}
                                color="#1a237e"
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Número de Operador"
                                placeholderTextColor="#8c8c8c"
                                value={controlNumber}
                                onChangeText={setControlNumber}
                            />
                        </View>

                        <View style={styles.inputWrapper}>
                            <MaterialIcons
                                name="lock-outline"
                                size={24}
                                color="#1a237e"
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Contraseña"
                                placeholderTextColor="#8c8c8c"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!isPasswordVisible}
                            />
                            <TouchableOpacity
                                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                                style={styles.passwordVisibilityIcon}
                            >
                                <MaterialIcons
                                    name={isPasswordVisible ? "visibility" : "visibility-off"}
                                    size={24}
                                    color="#666"
                                />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={styles.signInButton}
                            onPress= {() => navigation.navigate('Main')}
                        >
                            <Text style={styles.signInButtonText}>INICIAR SESIÓN</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: width * 0.04,
        paddingTop: height * 0.05,
        height: height * 0.12,
    },
    backButton: {
        padding: 8,
        marginRight: width * 0.04,
    },
    title: {
        fontSize: width * 0.06,
        fontWeight: 'bold',
        color: '#fff',
    },
    body: {
        flex: 1,
        padding: width * 0.04,
        justifyContent: 'center',
    },
    welcomeContainer: {
        alignItems: 'center',
        marginBottom: height * 0.04,
    },
    welcomeTitle: {
        fontSize: width * 0.07,
        fontWeight: '600',
        color: '#1a237e',
        marginTop: height * 0.02,
    },
    welcomeSubtitle: {
        fontSize: width * 0.04,
        color: '#666',
        marginTop: height * 0.01,
    },
    inputContainer: {
        width: '100%',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 15,
        marginBottom: height * 0.02,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    inputIcon: {
        padding: width * 0.04,
    },
    input: {
        flex: 1,
        height: height * 0.07,
        fontSize: width * 0.04,
    },
    passwordVisibilityIcon: {
        padding: width * 0.04,
    },
    signInButton: {
        backgroundColor: '#1a237e',
        borderRadius: 15,
        height: height * 0.07,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: height * 0.02,
    },
    signInButtonText: {
        color: '#fff',
        fontSize: width * 0.045,
        fontWeight: 'bold',
    },
});

export default SignIn;