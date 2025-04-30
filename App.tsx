import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ScanPrinterScreen from './src/screens/ScanPrinterScreen';
import PrinterSelectionScreen from './src/screens/PrinterSelectionScreen';
import TicketFormScreen from './src/screens/TicketFormScreen';
import PreviewAndPrintScreen from './src/screens/PreviewAndPrintScreen';
import { RootStackParamList } from './src/navigation/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ScanPrinterScreen">
        <Stack.Screen name="ScanPrinterScreen" component={ScanPrinterScreen} options={{ title: 'Scanner les Imprimantes' }} />
        <Stack.Screen name="PrinterSelectionScreen" component={PrinterSelectionScreen} options={{ title: 'Sélection Imprimante' }} />
        <Stack.Screen name="TicketFormScreen" component={TicketFormScreen} options={{ title: 'Formulaire Ticket' }} />
        <Stack.Screen name="PreviewAndPrintScreen" component={PreviewAndPrintScreen} options={{ title: 'Aperçu & Impression' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
