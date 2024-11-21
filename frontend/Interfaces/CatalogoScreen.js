import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions, StatusBar, TextInput } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const CatalogoScreen = ({ navigation }) => {
    const [selectedModel, setSelectedModel] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const modelData = {
        "9700": {
            year: "2020-2023",
            engine: "D13K Euro 6",
            specifications: {
                potencia: "460 HP",
                torque: "2300 Nm",
                transmision: "I-Shift",
                longitud: "13.8m"
            },
            parts: {
                "Monitores": [
                    { name: "Filtro de Aire", code: "FA-2234" },
                    { name: "Filtro de Aceite", code: "FO-1123" },
                    { name: "Filtro de Combustible", code: "FC-5567" }
                ],
                "Frenos": [
                    { name: "Pastillas Delanteras", code: "PD-8876" },
                    { name: "Pastillas Traseras", code: "PT-8877" },
                    { name: "Disco de Freno", code: "DF-3344" }
                ],
                "Suspensión": [
                    { name: "Amortiguadores Delanteros", code: "AD-4456" },
                    { name: "Amortiguadores Traseros", code: "AT-4457" },
                    { name: "Muelles", code: "MU-2231" }
                ]
            }
        },
        "B11R": {
            year: "2019-2023",
            engine: "D11K Euro 6",
            specifications: {
                potencia: "430 HP",
                torque: "2200 Nm",
                transmision: "I-Shift",
                longitud: "13.2m"
            },
            parts: {
                "Filtros": [
                    { name: "Filtro de Aire", code: "FA-2235" },
                    { name: "Filtro de Aceite", code: "FO-1124" },
                    { name: "Filtro de Combustible", code: "FC-5568" }
                ],
                "Frenos": [
                    { name: "Pastillas Delanteras", code: "PD-8878" },
                    { name: "Pastillas Traseras", code: "PT-8879" },
                    { name: "Disco de Freno", code: "DF-3345" }
                ],
                "Suspensión": [
                    { name: "Amortiguadores Delanteros", code: "AD-4458" },
                    { name: "Amortiguadores Traseros", code: "AT-4459" },
                    { name: "Muelles", code: "MU-2232" }
                ]
            }
        },
        "B8R": {
            year: "2021-2023",
            engine: "D8K Euro 6",
            specifications: {
                potencia: "350 HP",
                torque: "1400 Nm",
                transmision: "I-Shift",
                longitud: "12.2m"
            },
            parts: {
                "Filtros": [
                    { name: "Filtro de Aire", code: "FA-2236" },
                    { name: "Filtro de Aceite", code: "FO-1125" },
                    { name: "Filtro de Combustible", code: "FC-5569" }
                ],
                "Frenos": [
                    { name: "Pastillas Delanteras", code: "PD-8880" },
                    { name: "Pastillas Traseras", code: "PT-8881" },
                    { name: "Disco de Freno", code: "DF-3346" }
                ],
                "Suspensión": [
                    { name: "Amortiguadores Delanteros", code: "AD-4460" },
                    { name: "Amortiguadores Traseros", code: "AT-4461" },
                    { name: "Muelles", code: "MU-2233" }
                ]
            }
        },
        "B7R": {
            year: "2018-2023",
            engine: "D7K Euro 5",
            specifications: {
                potencia: "290 HP",
                torque: "1200 Nm",
                transmision: "Manual 6 velocidades",
                longitud: "11.5m"
            },
            parts: {
                "Filtros": [
                    { name: "Filtro de Aire", code: "FA-2237" },
                    { name: "Filtro de Aceite", code: "FO-1126" },
                    { name: "Filtro de Combustible", code: "FC-5570" }
                ],
                "Frenos": [
                    { name: "Pastillas Delanteras", code: "PD-8882" },
                    { name: "Pastillas Traseras", code: "PT-8883" },
                    { name: "Disco de Freno", code: "DF-3347" }
                ],
                "Suspensión": [
                    { name: "Amortiguadores Delanteros", code: "AD-4462" },
                    { name: "Amortiguadores Traseros", code: "AT-4463" },
                    { name: "Muelles", code: "MU-2234" }
                ]
            }
        }
    };

    const filteredModels = Object.entries(modelData).filter(([modelName]) =>
        modelName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderSpecifications = (specs) => {
        return Object.entries(specs).map(([key, value]) => (
            <View key={key} style={styles.specItem}>
                <Text style={styles.specLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}:</Text>
                <Text style={styles.specValue}>{value}</Text>
            </View>
        ));
    };

    const renderParts = (parts) => {
        return Object.entries(parts).map(([category, items]) => (
            <View key={category} style={styles.partsCategory}>
                <Text style={styles.categoryTitle}>{category}</Text>
                <View style={styles.partsGrid}>
                    {items.map((part, index) => (
                        <View key={index} style={styles.partItem}>
                            <Text style={styles.partName}>{part.name}</Text>
                            <Text style={styles.partCode}>{part.code}</Text>
                        </View>
                    ))}
                </View>
            </View>
        ));
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

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
                    <MaterialIcons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.title}>Catálogo Volvo</Text>
                <View style={styles.placeholder} />
            </LinearGradient>

            <View style={styles.searchContainer}>
                <MaterialIcons name="search" size={24} color="#666" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar modelo..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <ScrollView style={styles.content}>
                {filteredModels.map(([modelName, data]) => (
                    <TouchableOpacity
                        key={modelName}
                        style={[
                            styles.modelCard,
                            selectedModel === modelName && styles.modelCardSelected
                        ]}
                        onPress={() => setSelectedModel(modelName === selectedModel ? null : modelName)}
                    >
                        <View style={styles.modelHeader}>
                            <View style={styles.modelTitleContainer}>
                                <FontAwesome5 name="bus" size={24} color="#1a237e" />
                                <View style={styles.modelInfo}>
                                    <Text style={styles.modelName}>Volvo {modelName}</Text>
                                    <Text style={styles.modelYear}>{data.year}</Text>
                                </View>
                            </View>
                            <MaterialIcons
                                name={selectedModel === modelName ? "expand-less" : "expand-more"}
                                size={24}
                                color="#1a237e"
                            />
                        </View>

                        {selectedModel === modelName && (
                            <View style={styles.modelDetails}>
                                <View style={styles.engineInfo}>
                                    <Text style={styles.engineTitle}>Motor: {data.engine}</Text>
                                </View>

                                <View style={styles.specsContainer}>
                                    <Text style={styles.sectionTitle}>Especificaciones:</Text>
                                    {renderSpecifications(data.specifications)}
                                </View>

                                <View style={styles.partsContainer}>
                                    <Text style={styles.sectionTitle}>Catálogo de Piezas:</Text>
                                    {renderParts(data.parts)}
                                </View>
                            </View>
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>
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
        fontSize: width * 0.06,
        fontWeight: 'bold',
        color: '#fff',
    },
    placeholder: {
        width: 40,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        margin: width * 0.04,
        padding: width * 0.03,
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    searchInput: {
        flex: 1,
        marginLeft: width * 0.02,
        fontSize: width * 0.04,
    },
    content: {
        flex: 1,
        padding: width * 0.04,
    },
    modelCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: height * 0.02,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    modelCardSelected: {
        borderColor: '#1a237e',
        borderWidth: 2,
    },
    modelHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: width * 0.04,
    },
    modelTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    modelInfo: {
        marginLeft: width * 0.03,
    },
    modelName: {
        fontSize: width * 0.045,
        fontWeight: '600',
        color: '#1a237e',
    },
    modelYear: {
        fontSize: width * 0.035,
        color: '#666',
    },
    modelDetails: {
        padding: width * 0.04,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    engineInfo: {
        backgroundColor: '#e3f2fd',
        padding: width * 0.03,
        borderRadius: 8,
        marginBottom: height * 0.02,
    },
    engineTitle: {
        fontSize: width * 0.04,
        color: '#1a237e',
        fontWeight: '500',
    },
    specsContainer: {
        marginBottom: height * 0.02,
    },
    sectionTitle: {
        fontSize: width * 0.04,
        fontWeight: '600',
        color: '#333',
        marginBottom: height * 0.01,
    },
    specItem: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    specLabel: {
        fontSize: width * 0.035,
        color: '#333',
        fontWeight: '500',
        width: width * 0.3,
    },
    specValue: {
        fontSize: width * 0.035,
        color: '#666',
        flex: 1,
    },
    partsContainer: {
        marginTop: height * 0.01,
    },
    partsCategory: {
        marginBottom: height * 0.02,
    },
    categoryTitle: {
        fontSize: width * 0.04,
        color: '#1a237e',
        fontWeight: '500',
        marginBottom: height * 0.01,
    },
    partsGrid: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: width * 0.02,
    },
    partItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: width * 0.02,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    partName: {
        fontSize: width * 0.035,
        color: '#333',
    },
    partCode: {
        fontSize: width * 0.035,
        color: '#666',
        fontWeight: '500',
    },
});

export default CatalogoScreen;