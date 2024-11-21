import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    FlatList,
    TouchableOpacity,
    Dimensions,
    StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const Modelos3DScreen = ({ navigation }) => {
    // Datos originales y estado de búsqueda
    const originalData = [
        {
            id: '1',
            header: 'Modelo 1',
            subhead: 'Codigo: MT-1232',
            icon: 'desktop',
            shapes: ['cube', 'layer-group', 'puzzle-piece']
        },
        {
            id: '2',
            header: 'Modelo 2',
            subhead: 'Codigo: MT-8897',
            icon: 'tv',
            shapes: ['circle', 'square', 'triangle']

        },
        {
            id: '3',
            header: 'Modelo 3',
            subhead: 'Codigo: MT-7654',
            icon: 'laptop',
            shapes: ['circle', 'square', 'layer-group']
        },
    ];

    const [filteredData, setFilteredData] = useState(originalData);
    const [searchText, setSearchText] = useState('');

    // Función para manejar la búsqueda
    const handleSearch = (text) => {
        setSearchText(text);
        if (text === '') {
            setFilteredData(originalData);
        } else {
            const filtered = originalData.filter((item) =>
                item.header.toLowerCase().includes(text.toLowerCase()) ||
                item.subhead.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredData(filtered);
        }
    };

    // Renderizador de elementos de la lista
    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("Xploit")}
        >
            <View style={styles.cardContent}>
                <View style={styles.iconContainer}>
                    <FontAwesome5
                        name={item.icon}
                        size={24}
                        color="#1a237e"
                    />
                </View>
                <View style={styles.textContent}>
                    <Text style={styles.headerText}>{item.header}</Text>
                    <Text style={styles.subheadText}>{item.subhead}</Text>
                </View>
                <View style={styles.shapePlaceholder}>
                    {item.shapes.map((shape, index) => (
                        <FontAwesome5
                            key={index}
                            name={shape}
                            size={16}
                            color="#666"
                            style={styles.shapeIcon}
                        />
                    ))}
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Header con gradiente */}
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
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.title}>Mis Modelos 3D</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate("QR")}
                >
                    <MaterialIcons name="add" size={24} color="#fff" />
                </TouchableOpacity>
            </LinearGradient>

            {/* Barra de búsqueda */}
            <View style={styles.searchContainer}>
                <FontAwesome5
                    name="search"
                    size={18}
                    color="#666"
                    style={styles.searchIcon}
                />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar modelos 3D"
                    placeholderTextColor="#999"
                    value={searchText}
                    onChangeText={handleSearch}
                />
            </View>

            {/* Lista de modelos */}
            <FlatList
                data={filteredData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                style={styles.list}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.noResultsText}>No se encontraron modelos</Text>
                    </View>
                )}
            />
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
    backButton: {
        padding: 8,
    },
    title: {
        fontSize: width * 0.05,
        fontWeight: 'bold',
        color: '#fff',
    },
    addButton: {
        padding: 8,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        margin: width * 0.04,
        paddingHorizontal: width * 0.04,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    searchIcon: {
        marginRight: width * 0.03,
    },
    searchInput: {
        flex: 1,
        height: height * 0.06,
        fontSize: width * 0.04,
    },
    list: {
        flex: 1,
    },
    listContent: {
        paddingHorizontal: width * 0.04,
        paddingBottom: height * 0.02,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 15,
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
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: width * 0.04,
    },
    iconContainer: {
        width: width * 0.12,
        height: width * 0.12,
        borderRadius: width * 0.06,
        backgroundColor: '#e6e6e6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: width * 0.04,
    },
    textContent: {
        flex: 1,
    },
    headerText: {
        fontSize: width * 0.045,
        fontWeight: '600',
        color: '#1a237e',
        marginBottom: height * 0.005,
    },
    subheadText: {
        fontSize: width * 0.035,
        color: '#666',
    },
    shapePlaceholder: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    shapeIcon: {
        marginHorizontal: width * 0.01,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: height * 0.2,
    },
    noResultsText: {
        fontSize: width * 0.04,
        color: '#666',
        textAlign: 'center',
    },
});

export default Modelos3DScreen;