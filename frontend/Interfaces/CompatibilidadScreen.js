import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions, StatusBar } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const CompatibilidadScreen = ({ navigation }) => {
    const [selectedPart, setSelectedPart] = useState(null);

    const partsData = {
        "Monitor": {
            code: "MT-2234",
            compatibleWith: {
                "9700": "2015-2023",
                "B11R": "2018-2023",
                "B8R": "2017-2023"
            },
            specifications: {
                material: "Pantalla OLED",
                dimensiones: "350mm x 200mm",
            }
        },
        "Estereo": {
            code: "ET-8876",
            compatibleWith: {
                "9700": "2016-2023",
                "B11R": "2017-2023"
            },
            specifications: {
                material: "Plástico, Aluminio",
                guresor: "10cm",
                duracion: "25,000 km"
            }
        },
        "Velocimetro": {
            code: "VO-1123",
            compatibleWith: {
                "B8R": "2017-2023",
                "B11R": "2018-2023"
            },
            specifications: {
                material: "Plastico micro glass",
                duracion: "300,000 km"
            }
        },
    };

    const renderSpecifications = (specs) => {
        return Object.entries(specs).map(([key, value]) => (
            <View key={key} style={styles.specItem}>
                <Text style={styles.specLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}:</Text>
                <Text style={styles.specValue}>{value}</Text>
            </View>
        ));
    };

    const renderCompatibilityInfo = (compatibleWith) => {
        return (
            <View style={styles.compatibilityInfo}>
                <Text style={styles.compatibleTitle}>Compatible con modelos Volvo:</Text>
                {Object.entries(compatibleWith).map(([model, years], index) => (
                    <View key={index} style={styles.compatibleModel}>
                        <View style={styles.modelTag}>
                            <FontAwesome5 name="bus" size={16} color="#1a237e" style={styles.modelIcon} />
                            <Text style={styles.modelText}>Volvo {model}</Text>
                        </View>
                        <Text style={styles.yearsText}>Años: {years}</Text>
                    </View>
                ))}
            </View>
        );
    };

    const renderPartCard = (partName, data) => {
        const isSelected = selectedPart === partName;

        return (
            <TouchableOpacity
                onPress={() => setSelectedPart(partName === selectedPart ? null : partName)}
                style={[
                    styles.partCard,
                    isSelected && styles.partCardSelected
                ]}
            >
                <View style={styles.partHeader}>
                    <View style={styles.partInfo}>
                        <Text style={styles.partName}>{partName}</Text>
                        <Text style={styles.partCode}>Código: {data.code}</Text>
                    </View>
                    <MaterialIcons
                        name={isSelected ? "expand-less" : "expand-more"}
                        size={24}
                        color="#1a237e"
                    />
                </View>

                {isSelected && (
                    <View style={styles.partDetails}>
                        <View style={styles.specsContainer}>
                            <Text style={styles.sectionTitle}>Especificaciones:</Text>
                            {renderSpecifications(data.specifications)}
                        </View>
                        {renderCompatibilityInfo(data.compatibleWith)}
                    </View>
                )}
            </TouchableOpacity>
        );
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
                <Text style={styles.title}>Compatibilidad </Text>
                <View style={styles.placeholder} />
            </LinearGradient>

            <ScrollView style={styles.content}>
                <View style={styles.instructionContainer}>
                    <Text style={styles.instructionText}>
                        Selecciona una pieza para ver su compatibilidad con modelos Volvo
                    </Text>
                </View>

                {Object.entries(partsData).map(([part, data]) => (
                    <View key={part} style={styles.cardContainer}>
                        {renderPartCard(part, data)}
                    </View>
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
    content: {
        flex: 1,
        padding: width * 0.04,
    },
    instructionContainer: {
        backgroundColor: '#fff',
        padding: width * 0.04,
        borderRadius: 12,
        marginBottom: height * 0.02,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    instructionText: {
        fontSize: width * 0.04,
        color: '#666',
        textAlign: 'center',
    },
    cardContainer: {
        marginBottom: height * 0.02,
    },
    partCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    partCardSelected: {
        borderColor: '#1a237e',
        borderWidth: 2,
    },
    partHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: width * 0.04,
    },
    partInfo: {
        flex: 1,
    },
    partName: {
        fontSize: width * 0.045,
        fontWeight: '600',
        color: '#1a237e',
    },
    partCode: {
        fontSize: width * 0.035,
        color: '#666',
        marginTop: 4,
    },
    partDetails: {
        padding: width * 0.04,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    sectionTitle: {
        fontSize: width * 0.04,
        fontWeight: '600',
        color: '#333',
        marginBottom: height * 0.01,
    },
    specsContainer: {
        marginBottom: height * 0.02,
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
    compatibilityInfo: {
        marginTop: height * 0.01,
    },
    compatibleTitle: {
        fontSize: width * 0.04,
        fontWeight: '600',
        color: '#333',
        marginBottom: height * 0.01,
    },
    compatibleModel: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: height * 0.005,
    },
    modelTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e3f2fd',
        paddingHorizontal: width * 0.03,
        paddingVertical: height * 0.006,
        borderRadius: 15,
    },
    modelIcon: {
        marginRight: width * 0.02,
    },
    modelText: {
        color: '#1a237e',
        fontSize: width * 0.035,
        fontWeight: '500',
    },
    yearsText: {
        fontSize: width * 0.035,
        color: '#666',
    },
});

export default CompatibilidadScreen;