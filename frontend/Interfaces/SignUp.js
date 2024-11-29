import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ScrollView,
    TouchableOpacity,
    TouchableWithoutFeedback,
    StatusBar,
    Keyboard,
    Alert,
    Image,
    Dimensions
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';

const { width, height } = Dimensions.get('window');

const SignUp = ({ navigation }) => {
    const [name, setName] = useState('');
    const [middle_name, setMiddle_name] = useState('');
    const [last_name, setLast_name] = useState('');
    const [email, setEmail] = useState('');
    const [control_number, setControl_Number] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [image, setImage] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    {/*
    const handleSignUp = async () => {
        // Mantener la lógica de validación existente
        if (password !== confirmPassword) {
            Alert.alert('', 'Las contraseñas no coinciden');
            return;
        }
        if (password.length < 6) {
            Alert.alert('', 'La contraseña debe tener al menos 6 caracteres');
            return;
        }

        const registrationData = new FormData();
        registrationData.append('first_name', name);
        registrationData.append('last_name', last_name);
        registrationData.append('middle_name', middle_name);
        registrationData.append('email', email);
        registrationData.append('control_number', control_number);
        registrationData.append('password', password);

        if (image) {
            registrationData.append('image', {
                uri: image.uri,
                name: 'profile.jpg',
                type: 'image/jpeg',
            });
        }

        try {
            const response = await fetch('http://192.168.0.106:5000/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                body: registrationData,
            });

            if (response.status === 201) {
                Alert.alert('Registro exitoso', 'Tu cuenta ha sido creada correctamente');
                navigation.navigate('SignIn');
            } else {
                const errorData = await response.json();
                Alert.alert('Error en el registro', errorData.message || 'Hubo un problema con tu registro');
            }
        } catch (error) {
            console.error('Error en la conexión al servidor:', error);
            Alert.alert('Error', 'Error en la conexión al servidor');
        }
    };
/*/}
    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setImage(result.assets[0]);
        }
    };

    const generateEmail = (controlNumber) => {
        return `L${controlNumber}@zacatepec.tecnm.mx`;
    };

    const handleControlNumberChange = (value) => {
        setControl_Number(value);
        setEmail(generateEmail(value));
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <LinearGradient
                    colors={['#1a237e', '#0d47a1']}
                    style={styles.header}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <MaterialIcons name="arrow-back" size={28} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Registro</Text>
                </LinearGradient>

                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.formContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Nombre"
                            placeholderTextColor="#666"
                            value={name}
                            onChangeText={setName}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Segundo Nombre"
                            placeholderTextColor="#666"
                            value={middle_name}
                            onChangeText={setMiddle_name}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Apellidos"
                            placeholderTextColor="#666"
                            value={last_name}
                            onChangeText={setLast_name}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Número de Operador"
                            placeholderTextColor="#666"
                            value={control_number}
                            onChangeText={handleControlNumberChange}
                        />
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                placeholder="Contraseña"
                                placeholderTextColor="#666"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                style={styles.eyeIcon}
                            >
                                <MaterialIcons
                                    name={showPassword ? "visibility" : "visibility-off"}
                                    size={24}
                                    color="#1a237e"
                                />
                            </TouchableOpacity>
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Confirmar Contraseña"
                            placeholderTextColor="#666"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={!showPassword}
                        />

                        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                            <MaterialIcons name="add-photo-alternate" size={24} color="#1a237e" />
                            <Text style={styles.imagePickerText}>Seleccionar Imagen de Perfil</Text>
                        </TouchableOpacity>

                        {image && (
                            <Image
                                source={{ uri: image.uri }}
                                style={styles.profileImage}
                            />
                        )}

                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={() => navigation.navigate('SignIn')}
                        >
                            <Text style={styles.submitButtonText}>Registrarse</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
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
        paddingVertical: height * 0.05,
        paddingHorizontal: width * 0.04,
    },
    backButton: {
        marginRight: width * 0.04,
    },
    headerTitle: {
        color: '#fff',
        fontSize: width * 0.06,
        fontWeight: 'bold',
    },
    scrollContainer: {
        flexGrow: 1,
        padding: width * 0.04,
    },
    formContainer: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: width * 0.05,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    input: {
        backgroundColor: '#f1f1f1',
        borderRadius: 10,
        paddingHorizontal: width * 0.04,
        paddingVertical: height * 0.02,
        marginBottom: height * 0.02,
        fontSize: width * 0.04,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f1f1',
        borderRadius: 10,
        marginBottom: height * 0.02,
    },
    passwordInput: {
        flex: 1,
        paddingHorizontal: width * 0.04,
        paddingVertical: height * 0.02,
        fontSize: width * 0.04,
    },
    eyeIcon: {
        padding: width * 0.03,
    },
    imagePicker: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e6e6e6',
        borderRadius: 10,
        paddingVertical: height * 0.02,
        marginBottom: height * 0.02,
    },
    imagePickerText: {
        marginLeft: width * 0.02,
        color: '#1a237e',
        fontWeight: '600',
    },
    profileImage: {
        width: width * 0.4,
        height: width * 0.4,
        borderRadius: 10,
        alignSelf: 'center',
        marginBottom: height * 0.02,
    },
    submitButton: {
        backgroundColor: '#1a237e',
        borderRadius: 10,
        paddingVertical: height * 0.02,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: width * 0.045,
        fontWeight: 'bold',
    },
});

export default SignUp;