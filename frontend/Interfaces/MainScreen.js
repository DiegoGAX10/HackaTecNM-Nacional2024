import React, { useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, Animated, TouchableWithoutFeedback, StyleSheet, Alert, StatusBar, Dimensions } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

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
        Alert.alert(
            'Cerrar Sesión',
            '¿Estás seguro que deseas salir?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Salir',
                    onPress: () => {
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Start' }],
                        });
                    },
                    style: 'destructive',
                },
            ]
        );
    };

    const userPhoto = { uri: 'https://example.com/user-photo.jpg' };
    const userName = 'John Doe';

    const MenuItem = ({ icon, title, onPress, color = '#333', type = 'Ionicons' }) => (
        <TouchableOpacity style={styles.menuItem} onPress={onPress}>
            <View style={styles.menuIconContainer}>
                {type === 'Ionicons' ? (
                    <Ionicons name={icon} size={24} color={color} />
                ) : (
                    <FontAwesome5 name={icon} size={22} color={color} />
                )}
            </View>
            <Text style={[styles.menuText, { color }]}>{title}</Text>
        </TouchableOpacity>
    );

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
                <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
                    <MaterialIcons name="menu" size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.title}>Vortex</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate("QR")}
                >
                    <MaterialIcons name="qr-code-scanner" size={24} color="#fff" />
                </TouchableOpacity>
            </LinearGradient>

            {/* Overlay for sidebar */}
            {isSidebarVisible && (
                <TouchableWithoutFeedback onPress={toggleSidebar}>
                    <Animated.View style={[styles.overlay, {
                        opacity: slideAnim.interpolate({
                            inputRange: [-width, 0],
                            outputRange: [0, 0.5],
                        })
                    }]} />
                </TouchableWithoutFeedback>
            )}

            {/* Sidebar */}
            <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
                <View style={styles.profileContainer}>
                    <Image
                        source={userPhoto}
                        style={styles.profileImage}
                    />
                    <Text style={styles.profileName}>{userName}</Text>
                    <Text style={styles.profileEmail}>john.doe@example.com</Text>
                </View>

                <View style={styles.menuDivider} />

                <MenuItem
                    icon="cube"
                    title="Mis Modelos 3D"
                    type="FontAwesome5"
                    onPress={() => navigation.navigate("Modelos")}
                />
                <MenuItem
                    icon="layer-group"
                    title="Todos los Modelos"
                    type="FontAwesome5"
                    onPress={() => navigation.navigate("Catalogo")}
                />
                <MenuItem
                    icon="puzzle-piece"
                    title="Compatibilidad"
                    type="FontAwesome5"
                    onPress={() => navigation.navigate("Compatibilidad")}
                />
                <MenuItem
                    icon="settings-outline"
                    title="Configuración"
                    onPress={() => navigation.navigate("Configuracion")}
                />
                <View style={styles.menuDivider} />
                <MenuItem
                    icon="log-out-outline"
                    title="Cerrar Sesión"
                    color="#dc3545"
                    onPress={handleSignOut}
                />
            </Animated.View>

            {/* Main Content */}
            <View style={styles.body}>
                <View style={styles.cardContainer}>
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => navigation.navigate("Modelos")}
                    >
                        <FontAwesome5 name="cube" size={32} color="#1a237e" />
                        <Text style={styles.cardTitle}>Mis Modelos 3D</Text>
                        <Text style={styles.cardSubtitle}>Gestiona tus modelos 3D</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.card}
                    onPress={() => navigation.navigate("Catalogo")}>
                        <FontAwesome5 name="layer-group" size={32} color="#1a237e" />
                        <Text style={styles.cardTitle}>Catálogo</Text>
                        <Text style={styles.cardSubtitle}>Explora todos los modelos</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Compatibilidad")}>
                        <FontAwesome5 name="puzzle-piece" size={32} color="#1a237e" />
                        <Text style={styles.cardTitle}>Compatibilidad</Text>
                        <Text style={styles.cardSubtitle}>Verifica compatibilidad</Text>
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
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: width * 0.04,
        paddingTop: height * 0.05,
        height: height * 0.12,
    },
    menuButton: {
        padding: 8,
    },
    title: {
        fontSize: width * 0.06,
        fontWeight: 'bold',
        color: '#fff',
    },
    addButton: {
        padding: 8,
    },
    body: {
        flex: 1,
        padding: width * 0.04,
    },
    cardContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        paddingTop: height * 0.02,
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
    sidebar: {
        position: 'absolute',
        width: '80%',
        height: '100%',
        backgroundColor: '#fff',
        paddingTop: height * 0.05,
        zIndex: 3,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 2,
            height: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 10,
    },
    profileContainer: {
        alignItems: 'center',
        padding: width * 0.05,
    },
    profileImage: {
        width: width * 0.2,
        height: width * 0.2,
        borderRadius: width * 0.1,
        borderWidth: 3,
        borderColor: '#1a237e',
    },
    profileName: {
        marginTop: height * 0.015,
        fontSize: width * 0.045,
        fontWeight: '600',
        color: '#1a237e',
    },
    profileEmail: {
        fontSize: width * 0.035,
        color: '#666',
        marginTop: height * 0.005,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: height * 0.018,
        paddingHorizontal: width * 0.06,
    },
    menuIconContainer: {
        width: width * 0.08,
    },
    menuText: {
        fontSize: width * 0.04,
        marginLeft: width * 0.02,
    },
    menuDivider: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginVertical: height * 0.02,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#000',
        zIndex: 2,
    },
});

export default MainScreen;