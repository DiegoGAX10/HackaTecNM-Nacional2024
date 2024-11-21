import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Dimensions, Switch } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const ConfiguracionScreen = ({ navigation }) => {
    const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
    const [darkModeEnabled, setDarkModeEnabled] = React.useState(false);

    const SettingItem = ({
                             icon,
                             title,
                             subtitle,
                             onPress,
                             rightComponent,
                             color = '#333',
                             type = 'Ionicons'
                         }) => (
        <TouchableOpacity style={styles.settingItem} onPress={onPress}>
            <View style={styles.settingIconContainer}>
                {type === 'Ionicons' ? (
                    <Ionicons name={icon} size={24} color={color} />
                ) : type === 'FontAwesome5' ? (
                    <FontAwesome5 name={icon} size={22} color={color} />
                ) : (
                    <MaterialIcons name={icon} size={24} color={color} />
                )}
            </View>
            <View style={styles.settingTextContainer}>
                <Text style={[styles.settingTitle, { color }]}>{title}</Text>
                {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
            </View>
            {rightComponent}
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
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <MaterialIcons name="arrow-back" size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.title}>Configuración</Text>
            </LinearGradient>

            {/* Configuration Content */}
            <View style={styles.body}>
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Preferencias de Aplicación</Text>

                    <SettingItem
                        icon="notifications-outline"
                        title="Notificaciones"
                        subtitle="Recibir alertas y actualizaciones"
                        rightComponent={
                            <Switch
                                value={notificationsEnabled}
                                onValueChange={setNotificationsEnabled}
                                trackColor={{ false: "#767577", true: "#1a237e" }}
                                thumbColor={notificationsEnabled ? "#fff" : "#f4f3f4"}
                            />
                        }
                    />

                    <SettingItem
                        icon="moon-outline"
                        title="Modo Oscuro"
                        subtitle="Reducir fatiga visual"
                        rightComponent={
                            <Switch
                                value={darkModeEnabled}
                                onValueChange={setDarkModeEnabled}
                                trackColor={{ false: "#767577", true: "#1a237e" }}
                                thumbColor={darkModeEnabled ? "#fff" : "#f4f3f4"}
                            />
                        }
                    />
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Cuenta</Text>

                    <SettingItem
                        icon="person-outline"
                        title="Editar Perfil"
                        subtitle="Actualizar información personal"
                        onPress={() => {/* Navigate to profile edit */}}
                    />

                    <SettingItem
                        icon="lock-outline"
                        title="Cambiar Contraseña"
                        subtitle="Actualizar credenciales de acceso"
                        onPress={() => {/* Navigate to password change */}}
                    />
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Ayuda y Soporte</Text>

                    <SettingItem
                        icon="help-outline"
                        title="Ayuda"
                        subtitle="Centro de ayuda y soporte"
                        onPress={() => {/* Navigate to help center */}}
                    />

                    <SettingItem
                        icon="info-outline"
                        title="Acerca de"
                        subtitle="Información de la aplicación"
                        onPress={() => {/* Show app info */}}
                    />
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
    },
    sectionContainer: {
        marginBottom: height * 0.03,
    },
    sectionTitle: {
        fontSize: width * 0.045,
        fontWeight: '600',
        color: '#1a237e',
        marginBottom: height * 0.015,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: width * 0.04,
        marginBottom: height * 0.015,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    settingIconContainer: {
        width: width * 0.1,
        alignItems: 'center',
        marginRight: width * 0.04,
    },
    settingTextContainer: {
        flex: 1,
    },
    settingTitle: {
        fontSize: width * 0.04,
        fontWeight: '600',
    },
    settingSubtitle: {
        fontSize: width * 0.035,
        color: '#666',
        marginTop: height * 0.005,
    },
});

export default ConfiguracionScreen;