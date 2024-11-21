import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    StatusBar,
    Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const EmpecemosScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Header with gradient */}
            <LinearGradient
                colors={['#1a237e', '#0d47a1']}
                style={styles.header}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                <Text style={styles.title}>Vortex</Text>
            </LinearGradient>

            {/* Main Content */}
            <View style={styles.body}>
                <View style={styles.welcomeContainer}>
                    <Text style={styles.welcomeTitle}>Bienvenido a Vortex</Text>
                    <Text style={styles.welcomeSubtitle}>
                        Selecciona una opción para continuar
                    </Text>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => navigation.navigate('SignUp')}
                    >
                        <FontAwesome5
                            name="user-plus"
                            size={32}
                            color="#1a237e"
                        />
                        <Text style={styles.cardTitle}>SIGN-UP</Text>
                        <Text style={styles.cardSubtitle}>Crear una nueva cuenta</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => navigation.navigate('SignIn')}
                    >
                        <FontAwesome5
                            name="sign-in-alt"
                            size={32}
                            color="#1a237e"
                        />
                        <Text style={styles.cardTitle}>SIGN-IN</Text>
                        <Text style={styles.cardSubtitle}>Iniciar sesión</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: width * 0.04,
        paddingTop: height * 0.05,
        height: height * 0.12,
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
    robotImage: {
        width: width * 0.7,
        height: height * 0.3,
        resizeMode: 'contain',
        marginBottom: height * 0.02,
    },
    welcomeTitle: {
        fontSize: width * 0.07,
        fontWeight: '600',
        color: '#1a237e',
        marginBottom: height * 0.01,
    },
    welcomeSubtitle: {
        fontSize: width * 0.04,
        color: '#666',
        textAlign: 'center',
    },
    buttonContainer: {
        width: '100%',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: width * 0.05,
        marginBottom: height * 0.02,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: width * 0.045,
        fontWeight: '600',
        color: '#1a237e',
        marginTop: height * 0.015,
        marginBottom: height * 0.005,
    },
    cardSubtitle: {
        fontSize: width * 0.035,
        color: '#666',
    },
});

export default EmpecemosScreen;