import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ScanPrinterScreen from './src/screens/ScanPrinterScreen';
import TicketFormScreen from './src/screens/TicketFormScreen';
import PreviewAndPrintScreen from './src/screens/PreviewAndPrintScreen';
import { RootStackParamList } from './src/navigation/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ScanPrinterScreen">
        <Stack.Screen name="ScanPrinterScreen" component={ScanPrinterScreen} options={{ title: 'Connexion Imprimante' }} />
        <Stack.Screen name="TicketFormScreen" component={TicketFormScreen} options={{ title: 'Formulaire du Ticket' }} />
        <Stack.Screen name="PreviewAndPrintScreen" component={PreviewAndPrintScreen} options={{ title: 'Aperçu & Impression' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
