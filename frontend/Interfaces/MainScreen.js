import React, { useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, Animated, TouchableWithoutFeedback, StyleSheet, Alert, StatusBar, Dimensions } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const MainScreen = ({ navigation }) => {
    const [isSidebarVisible, setSidebarVisible] = useState(false);
    const slideAnim = useRef(new Animated.Value(-width)).current;

    const toggleSidebar = () => {
        if (isSidebarVisible) {
            Animated.timing(slideAnim, {
                toValue: -width,
                duration: 300,
                useNativeDriver: true,
            }).start(() => setSidebarVisible(false));
        } else {
            setSidebarVisible(true);
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    };

    const handleSignOut = () => {
        Alert.alert('Signed out');
        navigation.reset({
            index: 0,
            routes: [{ name: 'Start' }],
        });
    };

    const userPhoto = { uri: 'https://example.com/user-photo.jpg' };
    const userName = 'John Doe';

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <TouchableOpacity onPress={toggleSidebar}>
                    <MaterialIcons name="menu" size={28} color="#002244" />
                </TouchableOpacity>
                <Text style={styles.title}>Prototipo Volvo</Text>
                <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("QR")}>
                    <MaterialIcons name="add" size={24} color="#fff" />
                </TouchableOpacity>
            </View>
            {isSidebarVisible && (
                <TouchableWithoutFeedback onPress={toggleSidebar}>
                    <View style={styles.overlay} />
                </TouchableWithoutFeedback>
            )}

            <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
                <View style={styles.profileContainer}>
                    <Image
                        source={userPhoto}
                        style={styles.profileImage}
                    />
                    <Text style={styles.profileName}>{userName}</Text>
                </View>

                <TouchableOpacity style={styles.drawerItem}>
                    <Ionicons name="settings-outline" size={24} color="black" />
                    <Text style={styles.drawerText}>Configuración</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.drawerItem} onPress={handleSignOut}>
                    <Ionicons name="log-out-outline" size={24} color="red" />
                    <Text style={[styles.drawerText, { color: 'red' }]}>Salir</Text>
                </TouchableOpacity>
            </Animated.View>
            <View style={styles.body}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Modelos")}>
                    <Text style={styles.buttonText}>Mis modelos 3D</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Todos</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Compatibilidad</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: width * 0.04,
        backgroundColor: '#fff',
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        marginTop: height * 0.01,
    },
    sidebar: {
        position: 'absolute',
        width: '70%',
        height: '100%',
        backgroundColor: '#f2f2f2',
        padding: width * 0.04,
        zIndex: 3,
    },
    title: {
        fontSize: width * 0.05,
        fontWeight: '600',
        color: '#002244',
    },
    addButton: {
        backgroundColor: '#002244',
        padding: width * 0.03,
        borderRadius: 50,
    },
    body: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: width * 0.04,
    },
    button: {
        backgroundColor: '#005B96',
        paddingVertical: height * 0.02,
        paddingHorizontal: width * 0.1,
        borderRadius: 10,
        marginBottom: height * 0.02,
        width: '80%',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    buttonText: {
        color: '#fff',
        fontSize: width * 0.04,
        fontWeight: '500',
    },
    profileContainer: {
        alignItems: 'center',
        marginBottom: height * 0.02,
    },
    profileImage: {
        width: width * 0.2,
        height: width * 0.2,
        borderRadius: width * 0.1,
    },
    profileName: {
        marginTop: height * 0.01,
        fontSize: width * 0.045,
        fontWeight: '600',
    },
    drawerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: height * 0.015,
    },
    drawerText: {
        marginLeft: width * 0.02,
        fontSize: width * 0.04,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
});
export default MainScreen;