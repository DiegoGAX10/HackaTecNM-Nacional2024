import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import StartScreen from "./Interfaces/StartScreen";
import XploitScreen from "./Interfaces/XploitScreen";
import MainScreen from "./Interfaces/MainScreen";
import QRScreen from "./Interfaces/QRScreen";
import ModelosScreen from "./Interfaces/ModelosScreen";
import CompatibilidadScreen from "./Interfaces/CompatibilidadScreen";


const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false, // Oculta el encabezado en todas las pantallas
                }}
            >
                <Stack.Screen name="Start" component={StartScreen} />
                <Stack.Screen name="Main" component={MainScreen} />
                <Stack.Screen name="Xploit" component={XploitScreen} />
                <Stack.Screen name="QR" component={QRScreen}/>
                <Stack.Screen name="Modelos" component={ModelosScreen}/>
                <Stack.Screen name="Compatibilidad" component={CompatibilidadScreen}/>

            </Stack.Navigator>
        </NavigationContainer>
    );
}


