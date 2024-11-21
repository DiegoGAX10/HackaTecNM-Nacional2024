import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList } from 'react-native';
import { Card, Button } from 'react-native-paper';

const App = () => {
    // Datos originales y estado de búsqueda
    const originalData = [
        { id: '1', header: 'Modelo 1', subhead: 'Descripción del modelo 1' },
        { id: '2', header: 'Modelo 2', subhead: 'Descripción del modelo 2' },
        { id: '3', header: 'Modelo 3', subhead: 'Descripción del modelo 3' },
    ];

    const [filteredData, setFilteredData] = useState(originalData); // Lista filtrada
    const [searchText, setSearchText] = useState(''); // Texto del buscador

    // Función para manejar la búsqueda
    const handleSearch = (text) => {
        setSearchText(text);
        if (text === '') {
            setFilteredData(originalData); // Si no hay texto, mostrar todos los datos
        } else {
            const filtered = originalData.filter((item) =>
                item.header.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredData(filtered); // Actualizar la lista filtrada
        }
    };

    // Renderizador de elementos de la lista
    const renderItem = ({ item }) => (
        <Card style={styles.card}>
            <View style={styles.cardContent}>
                <View style={styles.iconPlaceholder}>
                    <Text style={styles.iconText}>A</Text>
                </View>
                <View style={styles.textContent}>
                    <Text style={styles.headerText}>{item.header}</Text>
                    <Text style={styles.subheadText}>{item.subhead}</Text>
                </View>
                <View style={styles.shapePlaceholder}>
                    <View style={styles.triangle}></View>
                    <View style={styles.square}></View>
                    <View style={styles.circle}></View>
                </View>
            </View>
        </Card>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Mis modelos 3D</Text>
            </View>
            <TextInput
                style={styles.searchInput}
                placeholder="Hinted search text"
                value={searchText}
                onChangeText={handleSearch} // Manejar cambios en el texto
            />
            <FlatList
                data={filteredData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                style={styles.list}
                ListEmptyComponent={() => (
                    <Text style={styles.noResultsText}>No se encontraron resultados</Text>
                )}
            />
            <Button
                mode="contained"
                onPress={() => console.log('Añadir más')}
                style={styles.addButton}
            >
                Añadir más
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f9f9f9',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    searchInput: {
        backgroundColor: '#f1f1f1',
        borderRadius: 8,
        padding: 10,
        marginBottom: 16,
    },
    list: {
        flex: 1,
    },
    noResultsText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#777',
        marginTop: 20,
    },
    card: {
        marginBottom: 12,
        backgroundColor: '#f8eaff',
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    iconPlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#d3b6ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    iconText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
    textContent: {
        flex: 1,
    },
    headerText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    subheadText: {
        fontSize: 14,
        color: '#777',
    },
    shapePlaceholder: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    triangle: {
        width: 0,
        height: 0,
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderBottomWidth: 17,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#ccc',
        marginRight: 6,
    },
    square: {
        width: 15,
        height: 15,
        backgroundColor: '#ccc',
        marginRight: 6,
    },
    circle: {
        width: 15,
        height: 15,
        borderRadius: 7.5,
        backgroundColor: '#ccc',
    },
    addButton: {
        marginTop: 16,
        backgroundColor: '#007bff',
    },
});

export default App;
